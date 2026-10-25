/**
 * NaqshLab Tamper-Evident Hash-Chained Audit Trail Service
 * Requirement 3.11 & Hard Rule R3:
 * Every row stores the SHA-256 of the previous row (hash chain).
 * Any tampering with a row corrupts the chain and is detected by verifyAuditChain().
 */

import crypto from "crypto";

export interface AuditRecord {
  id: string;
  prevHash: string;
  currentHash: string;
  timestamp: string | Date;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  payloadJson: string;
}

export const GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000";

/**
 * Computes the SHA-256 block hash for an audit row.
 */
export function computeRowHash(
  prevHash: string,
  timestamp: string | Date,
  userId: string,
  action: string,
  entityType: string,
  entityId: string,
  payloadJson: string
): string {
  const tsStr = timestamp instanceof Date ? timestamp.toISOString() : timestamp;
  const raw = `${prevHash}|${tsStr}|${userId}|${action}|${entityType}|${entityId}|${payloadJson}`;
  return crypto.createHash("sha256").update(raw, "utf8").digest("hex");
}

/**
 * Validates the cryptographic integrity of an array of audit records in chronological order.
 */
export function verifyAuditChain(records: AuditRecord[]): {
  isValid: boolean;
  corruptedAtIndex?: number;
  message: string;
} {
  if (records.length === 0) {
    return { isValid: true, message: "Audit chain is empty." };
  }

  let expectedPrevHash = GENESIS_HASH;

  for (let i = 0; i < records.length; i++) {
    const rec = records[i];

    // Check if the pointer to previous hash matches
    if (rec.prevHash !== expectedPrevHash) {
      return {
        isValid: false,
        corruptedAtIndex: i,
        message: `Broken link at index ${i}: expected prevHash ${expectedPrevHash}, got ${rec.prevHash}`,
      };
    }

    // Verify hash computation of the row itself
    const computedHash = computeRowHash(
      rec.prevHash,
      rec.timestamp,
      rec.userId,
      rec.action,
      rec.entityType,
      rec.entityId,
      rec.payloadJson
    );

    if (computedHash !== rec.currentHash) {
      return {
        isValid: false,
        corruptedAtIndex: i,
        message: `Data tampering at index ${i}: record hash mismatch (computed ${computedHash}, stored ${rec.currentHash})`,
      };
    }

    expectedPrevHash = rec.currentHash;
  }

  return { isValid: true, message: `Audit chain verified successfully (${records.length} records).` };
}
