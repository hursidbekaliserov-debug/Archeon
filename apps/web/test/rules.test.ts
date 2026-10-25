import { describe, it, expect } from "vitest";
import { FinishSchema, ReplicaStatementSchema, ConsentInputSchema, REPLICA_STATEMENT_UZ, REPLICA_STATEMENT_EN } from "@naqshlab/shared";

describe("Hard Business Rules (R1, R2, R7)", () => {
  describe("Rule R1: Replica Statement Enforcement", () => {
    it("accepts documents with exact mandatory replica statements", () => {
      const valid = {
        statementUz: REPLICA_STATEMENT_UZ,
        statementEn: REPLICA_STATEMENT_EN,
      };
      const res = ReplicaStatementSchema.safeParse(valid);
      expect(res.success).toBe(true);
    });

    it("rejects document when replica statement is missing or tampered", () => {
      const invalid = {
        statementUz: "ASL NUSXA (ORIGINAL)",
        statementEn: REPLICA_STATEMENT_EN,
      };
      const res = ReplicaStatementSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });
  });

  describe("Rule R2: Prohibition of Artificial Ageing & Patina", () => {
    it("accepts authentic craft finishes", () => {
      expect(FinishSchema.safeParse("NATURAL_GLAZE").success).toBe(true);
      expect(FinishSchema.safeParse("RAW_GANCH_MATTE").success).toBe(true);
      expect(FinishSchema.safeParse("TRADITIONAL_COBALT_GLAZE").success).toBe(true);
    });

    it("strictly rejects patina finishes", () => {
      const res = FinishSchema.safeParse("antique_patina_wash");
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error.issues[0].message).toContain("Rule R2");
      }
    });

    it("strictly rejects distressing and simulated wear", () => {
      expect(FinishSchema.safeParse("distressed_edge").success).toBe(false);
      expect(FinishSchema.safeParse("fake_wear").success).toBe(false);
      expect(FinishSchema.safeParse("antique_stain").success).toBe(false);
      expect(FinishSchema.safeParse("museum_stamp").success).toBe(false);
    });
  });

  describe("Rule R7: Intellectual Rights Consent", () => {
    it("requires explicit boolean consent flag before upload", () => {
      const valid = {
        projectId: "proj-123",
        hasRightsConsent: true,
      };
      expect(ConsentInputSchema.safeParse(valid).success).toBe(true);

      const invalid = {
        projectId: "proj-123",
        hasRightsConsent: false,
      };
      expect(ConsentInputSchema.safeParse(invalid).success).toBe(false);
    });
  });
});
