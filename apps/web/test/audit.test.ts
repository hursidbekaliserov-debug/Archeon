import { describe, it, expect } from "vitest";
import { GENESIS_HASH, computeRowHash, verifyAuditChain, AuditRecord } from "../src/lib/audit";

describe("Tamper-Evident Audit Trail Hash Chain", () => {
  it("verifies an empty chain", () => {
    const res = verifyAuditChain([]);
    expect(res.isValid).toBe(true);
  });

  it("verifies a valid linear chain of audit records", () => {
    const t1 = new Date("2026-10-25T10:00:00Z");
    const h1 = computeRowHash(GENESIS_HASH, t1, "user-expert-1", "RECONSTRUCTION_APPROVED", "ReconstructionVersion", "v1", '{"version":1}');
    const r1: AuditRecord = {
      id: "1",
      prevHash: GENESIS_HASH,
      currentHash: h1,
      timestamp: t1,
      userId: "user-expert-1",
      action: "RECONSTRUCTION_APPROVED",
      entityType: "ReconstructionVersion",
      entityId: "v1",
      payloadJson: '{"version":1}',
    };

    const t2 = new Date("2026-10-25T10:15:00Z");
    const h2 = computeRowHash(h1, t2, "user-expert-1", "QC_PASSED_SIGNED", "QCRun", "qc-1", '{"result":"PASS"}');
    const r2: AuditRecord = {
      id: "2",
      prevHash: h1,
      currentHash: h2,
      timestamp: t2,
      userId: "user-expert-1",
      action: "QC_PASSED_SIGNED",
      entityType: "QCRun",
      entityId: "qc-1",
      payloadJson: '{"result":"PASS"}',
    };

    const res = verifyAuditChain([r1, r2]);
    expect(res.isValid).toBe(true);
  });

  it("detects modification of record payload (tampering)", () => {
    const t1 = new Date("2026-10-25T10:00:00Z");
    const h1 = computeRowHash(GENESIS_HASH, t1, "user-expert-1", "RECONSTRUCTION_APPROVED", "ReconstructionVersion", "v1", '{"version":1}');
    const r1: AuditRecord = {
      id: "1",
      prevHash: GENESIS_HASH,
      currentHash: h1,
      timestamp: t1,
      userId: "user-expert-1",
      action: "RECONSTRUCTION_APPROVED",
      entityType: "ReconstructionVersion",
      entityId: "v1",
      payloadJson: '{"version":1}',
    };

    // Tampered row: changed payload
    const tamperedR1: AuditRecord = {
      ...r1,
      payloadJson: '{"version":2}', // Tampered!
    };

    const res = verifyAuditChain([tamperedR1]);
    expect(res.isValid).toBe(false);
    expect(res.corruptedAtIndex).toBe(0);
    expect(res.message).toContain("Data tampering");
  });

  it("detects broken prevHash linkage when records are inserted or deleted", () => {
    const t1 = new Date("2026-10-25T10:00:00Z");
    const h1 = computeRowHash(GENESIS_HASH, t1, "user-1", "ACTION_A", "Entity", "e1", "{}");
    const r1: AuditRecord = {
      id: "1",
      prevHash: GENESIS_HASH,
      currentHash: h1,
      timestamp: t1,
      userId: "user-1",
      action: "ACTION_A",
      entityType: "Entity",
      entityId: "e1",
      payloadJson: "{}",
    };

    const t2 = new Date("2026-10-25T10:05:00Z");
    const r2WithWrongPrev: AuditRecord = {
      id: "2",
      prevHash: "fake_prev_hash_1234567890", // Broken pointer!
      currentHash: "any_hash",
      timestamp: t2,
      userId: "user-1",
      action: "ACTION_B",
      entityType: "Entity",
      entityId: "e2",
      payloadJson: "{}",
    };

    const res = verifyAuditChain([r1, r2WithWrongPrev]);
    expect(res.isValid).toBe(false);
    expect(res.corruptedAtIndex).toBe(1);
    expect(res.message).toContain("Broken link");
  });
});
