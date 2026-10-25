/**
 * CLI Tool: Verify Cryptographic Audit Trail Hash Chain
 * Executed via: make verify-audit or npm run verify-audit
 */

import { PrismaClient } from "@prisma/client";
import { verifyAuditChain } from "../src/lib/audit";

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log("=== NaqshLab Audit Trail Verification ===");
    console.log("Fetching all audit log rows from database...");

    const rows = await prisma.auditLog.findMany({
      orderBy: { timestamp: "asc" },
    });

    console.log(`Loaded ${rows.length} records. Verifying cryptographic chain...`);

    const result = verifyAuditChain(
      rows.map((r) => ({
        id: r.id,
        prevHash: r.prevHash,
        currentHash: r.currentHash,
        timestamp: r.timestamp,
        userId: r.userId,
        action: r.action,
        entityType: r.entityType,
        entityId: r.entityId,
        payloadJson: r.payloadJson,
      }))
    );

    if (result.isValid) {
      console.log("✅ AUDIT CHAIN INTACT: " + result.message);
      process.exit(0);
    } else {
      console.error("❌ AUDIT CHAIN CORRUPTED: " + result.message);
      process.exit(1);
    }
  } catch (err) {
    console.error("Error during audit verification:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
