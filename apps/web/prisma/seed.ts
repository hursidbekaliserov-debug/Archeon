/**
 * NaqshLab Comprehensive DEMO Database Seeder
 * Complies with Rules R1, R2, R3, R4, R5, R6, R7
 * Generates 20 original procedural motifs (Girih, Islimi, Rosette, Border)
 * Seeds demo accounts for CLIENT, EXPERT, WORKSHOP, OPERATOR
 * Seeds parameter sets, workshops, demo project, QC run, and valid public certificate
 */

import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import {
  REPLICA_STATEMENT_UZ,
  REPLICA_STATEMENT_EN,
  APP_CONFIG,
} from "@naqshlab/shared";
import { computeRowHash, GENESIS_HASH } from "../src/lib/audit";
import { canonicalJsonStringify, sha256Hex } from "../src/lib/crypto";
import { ARCHEON_20_MOTIFS } from "./motifsData";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:C:/Users/user/Desktop/Archeon/apps/web/prisma/dev.db";
}

const prisma = new PrismaClient();

// Helper to generate SVG procedural paths
function generateGirihSvg(symmetry: number): string {
  const points: string[] = [];
  const cx = 75, cy = 75, r1 = 60, r2 = 30;
  for (let i = 0; i < symmetry * 2; i++) {
    const angle = (i * Math.PI) / symmetry;
    const r = i % 2 === 0 ? r1 : r2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return `<polygon points="${points.join(" ")}" fill="none" stroke="#1D4E9A" stroke-width="1.5" />
<circle cx="${cx}" cy="${cy}" r="15" fill="none" stroke="#1D4E9A" stroke-width="1.2" />`;
}

function generateIslimiSvg(): string {
  return `<path d="M 25 75 C 40 30, 60 30, 75 75 C 90 120, 110 120, 125 75 C 110 50, 90 50, 75 75 C 60 100, 40 100, 25 75 Z" fill="none" stroke="#1D4E9A" stroke-width="1.5" />
<path d="M 75 25 C 60 45, 60 65, 75 75 C 90 65, 90 45, 75 25 Z" fill="none" stroke="#1D4E9A" stroke-width="1.2" />`;
}

function generateRosetteSvg(petals: number): string {
  let paths = "";
  const cx = 75, cy = 75;
  for (let i = 0; i < petals; i++) {
    const deg = (i * 360) / petals;
    paths += `<ellipse cx="${cx}" cy="${cy - 28}" rx="8" ry="24" transform="rotate(${deg} ${cx} ${cy})" fill="none" stroke="#1D4E9A" stroke-width="1.2" />`;
  }
  return `<circle cx="${cx}" cy="${cy}" r="12" fill="none" stroke="#1D4E9A" stroke-width="1.5" />${paths}`;
}

function generateBorderSvg(): string {
  return `<path d="M 0 25 Q 25 5, 50 25 T 100 25 T 150 25" fill="none" stroke="#1D4E9A" stroke-width="1.5" />
<path d="M 0 25 Q 25 45, 50 25 T 100 25 T 150 25" fill="none" stroke="#1D4E9A" stroke-width="1.5" />`;
}

async function main() {
  console.log("🌱 Seeding NaqshLab procedural DEMO database...");

  // Clear existing demo data
  await prisma.auditLog.deleteMany({});
  await prisma.certificate.deleteMany({});
  await prisma.qCResult.deleteMany({});
  await prisma.qCRun.deleteMany({});
  await prisma.colourReading.deleteMany({});
  await prisma.measurement.deleteMany({});
  await prisma.checklistStep.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.jobCard.deleteMany({});
  await prisma.piece.deleteMany({});
  await prisma.model3D.deleteMany({});
  await prisma.reconstructionRegion.deleteMany({});
  await prisma.reconstructionVersion.deleteMany({});
  await prisma.sourceAsset.deleteMany({});
  await prisma.consent.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.orderEvent.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.quoteItem.deleteMany({});
  await prisma.quote.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.parameterSet.deleteMany({});
  await prisma.productionRoute.deleteMany({});
  await prisma.workshop.deleteMany({});
  await prisma.priceRule.deleteMany({});
  await prisma.motif.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.organization.deleteMany({});

  // 1. Organizations & Workshops
  const orgRishtan = await prisma.organization.create({
    data: { name: "Rishtan Koshin Laboratoriyasi (DEMO)", isPartnerWorkshop: true },
  });
  const orgGanch = await prisma.organization.create({
    data: { name: "Toshkent Ganchkorlik Ustaxonasi (DEMO)", isPartnerWorkshop: true },
  });

  const wsRishtan = await prisma.workshop.create({
    data: {
      name: "Rishtan Keramika Markazi (DEMO)",
      location: "Farg'ona viloyati, Rishtan tumani",
      capacitySlots: 15,
    },
  });

  const wsGanch = await prisma.workshop.create({
    data: {
      name: "Toshkent Badiiy Ganch Studiyasi (DEMO)",
      location: "Toshkent shahri, Chilonzor",
      capacitySlots: 8,
    },
  });

  // 2. Generate Ed25519 Keypair for Expert
  const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519");
  const expertPubHex = publicKey.export({ type: "spki", format: "der" }).subarray(12).toString("hex");
  const expertPrivHex = privateKey.export({ type: "pkcs8", format: "der" }).subarray(16).toString("hex");

  // 3. Demo Users
  const clientUser = await prisma.user.create({
    data: {
      email: "client@naqshlab.uz",
      role: "CLIENT",
      name: "Farhod Karimov (Mijoz DEMO)",
    },
  });

  const expertUser = await prisma.user.create({
    data: {
      email: "expert@naqshlab.uz",
      role: "EXPERT",
      name: "Usta Inomjon Shomurodov (Ekspert DEMO)",
      ed25519PublicKey: expertPubHex,
      encryptedEd25519Priv: expertPrivHex,
    },
  });

  const workshopUser = await prisma.user.create({
    data: {
      email: "workshop@naqshlab.uz",
      role: "WORKSHOP",
      name: "Akmal Saidov (Usta DEMO)",
      organizationId: orgRishtan.id,
    },
  });

  const operatorUser = await prisma.user.create({
    data: {
      email: "operator@naqshlab.uz",
      role: "OPERATOR",
      name: "Shahzod Aliyev (Operator DEMO)",
    },
  });

  // 4. ParameterSets (Versioned)
  const paramKashi = await prisma.parameterSet.create({
    data: {
      route: "KASHI",
      version: 1,
      shrinkageX: 0.085, // 8.5% shrinkage
      shrinkageY: 0.085,
      shrinkageZ: 0.060,
      clayPlasterRecipe: "Rishtan qizil gili + 15% kvars qumi (RECIPE-KSH-01)",
      glazeRecipe: "Ishkor siri, tabiiy kobalt oksidi (GLZ-BLU-02)",
      dryingHours: 48,
      minThicknessMm: 8.0,
      firingProfileJson: JSON.stringify({
        bisque: { rampHours: 6, maxTempC: 950, holdHours: 2, coolHours: 8 },
        glaze: { rampHours: 7, maxTempC: 1040, holdHours: 1.5, coolHours: 10 },
      }),
      tolerancesJson: JSON.stringify({
        dimensionMm: 0.5,
        maxDeltaE: 2.5,
        meanDeltaE: 1.8,
        scanP95Mm: 0.8,
      }),
      isFrozen: true,
    },
  });

  const paramGanch = await prisma.parameterSet.create({
    data: {
      route: "GANCH",
      version: 1,
      shrinkageX: 0.008, // 0.8% shrinkage
      shrinkageY: 0.008,
      shrinkageZ: 0.005,
      clayPlasterRecipe: "Samarqand toza alabastr ganchi + 5% hayvon yelimi (RECIPE-GNC-01)",
      dryingHours: 24,
      minThicknessMm: 12.0,
      firingProfileJson: JSON.stringify({ cureDays: 7, sealType: "SHELLAC_NATURAL" }),
      tolerancesJson: JSON.stringify({
        dimensionMm: 0.8,
        scanP95Mm: 0.8,
      }),
      isFrozen: true,
    },
  });

  // 5. Price Rules
  await prisma.priceRule.createMany({
    data: [
      { itemType: "TILE_M2", basePriceUzs: 2_800_000, complexityMultiplier: 1.0 },
      { itemType: "FRIEZE_LINEAR_M", basePriceUzs: 750_000, complexityMultiplier: 1.0 },
      { itemType: "COMPLEXITY_A", basePriceUzs: 0, complexityMultiplier: 1.0 },
      { itemType: "COMPLEXITY_B", basePriceUzs: 0, complexityMultiplier: 1.35 },
      { itemType: "COMPLEXITY_C", basePriceUzs: 0, complexityMultiplier: 1.75 },
      { itemType: "MOULD_FEE", basePriceUzs: 1_200_000 },
      { itemType: "RUSH", basePriceUzs: 0, rushMultiplier: 1.4 },
    ],
  });

  // 6. Seed 20 Authentic Heritage Motifs (Girih, Islimi, Rosette, Border)
  await prisma.motif.createMany({ data: ARCHEON_20_MOTIFS });

  // 7. Demo Project with Complete Workflow
  const demoProject = await prisma.project.create({
    data: {
      clientId: clientUser.id,
      name: "Registon Sherdor Madrassa Koshini Tiklash (DEMO)",
      location: "Samarqand shahri, Registon maydoni",
      objectType: "KASHI_TILE",
      periodStyle: "XVII asr, Ashtarxoniylar davri mayolika uslubi",
      notes: "Shimoliy fasaddagi shikastlangan burchak koshinini yuqori aniqlikda qayta tiklash.",
      consentFlag: true,
      allowExternalAi: false,
      status: "CERTIFIED",
    },
  });

  // Consent Record
  await prisma.consent.create({
    data: {
      userId: clientUser.id,
      projectId: demoProject.id,
      statement: "Men yuklanayotgan materiallarni qayta ishlash huquqiga ega ekanligimni tasdiqlayman.",
      ipHash: sha256Hex("192.168.1.100_salt"),
      consentGiven: true,
    },
  });

  // Reconstruction Version (Approved by Expert)
  const reconVersion = await prisma.reconstructionVersion.create({
    data: {
      projectId: demoProject.id,
      versionNumber: 1,
      status: "APPROVED",
      approvedByUserId: expertUser.id,
      approvedAt: new Date("2026-10-24T14:30:00Z"),
      svgData: generateGirihSvg(8),
      metadataJson: JSON.stringify({
        scalePxPerMm: 12.5,
        symmetry: "C8",
        confidence: 0.96,
        method: "Symmetry & Periodicity Copy-Fill",
      }),
    },
  });

  // 3D Model
  const model3d = await prisma.model3D.create({
    data: {
      reconstructionVersionId: reconVersion.id,
      boundingBoxJson: JSON.stringify({ x: 150.0, y: 150.0, z: 14.0 }),
      basePlateThicknessMm: 8.0,
      reliefDepthMm: 6.0,
      volumeMm3: 285400.0,
      surfaceAreaMm2: 38200.0,
      estimatedMassKg: 0.656,
      isWatertight: true,
    },
  });

  // Piece & Job Card
  const serial = "NLB-KSH-2026-000001";
  const piece = await prisma.piece.create({
    data: {
      serial,
      projectId: demoProject.id,
      model3dId: model3d.id,
      status: "DELIVERED",
      replicaStatementUz: REPLICA_STATEMENT_UZ,
      replicaStatementEn: REPLICA_STATEMENT_EN,
    },
  });

  const jobCard = await prisma.jobCard.create({
    data: {
      pieceId: piece.id,
      model3dId: model3d.id,
      parameterSetId: paramKashi.id,
      workshopId: wsRishtan.id,
      compensatedDimensionsJson: JSON.stringify({ x: 162.75, y: 162.75, z: 14.84 }),
      replicaMarkingRequired: true,
      replicaMarkingTextUz: REPLICA_STATEMENT_UZ,
      replicaMarkingTextEn: REPLICA_STATEMENT_EN,
      status: "COMPLETED",
    },
  });

  // Task & Completed Marking Step with Mandatory Photo Proof
  const taskMarking = await prisma.task.create({
    data: {
      jobCardId: jobCard.id,
      workshopId: wsRishtan.id,
      title: "Orqa tomoniga nusxa tamg'asini bosish (REPLICA Marking)",
      status: "DONE",
      orderIndex: 1,
    },
  });

  await prisma.checklistStep.create({
    data: {
      taskId: taskMarking.id,
      stepName: "Koshin orqasiga NLB-KSH-2026-000001 va NUSXA — ASL EMAS yozuvini o'yish",
      requiresPhoto: true,
      photoStorageKey: "uploads/demo/replica_backstamp_proof.jpg",
      isReplicaMarkingStep: true,
      isCompleted: true,
      completedAt: new Date("2026-10-25T08:00:00Z"),
    },
  });

  // QC Run (Passing, Signed by Expert)
  const qcRun = await prisma.qCRun.create({
    data: {
      pieceId: piece.id,
      inspectorUserId: workshopUser.id,
      expertSignedUserId: expertUser.id,
      result: "PASS",
      meanDeltaE: 1.42,
      maxDeltaE: 2.15,
      scanDeviation95thMm: 0.38,
      caliperDeviationsJson: JSON.stringify({
        length: { nominal: 150.0, measured: 150.2, delta: 0.2 },
        width: { nominal: 150.0, measured: 149.9, delta: -0.1 },
      }),
      signedAt: new Date("2026-10-25T11:00:00Z"),
      expertSignature: "3f82a9947bf3c8801901dd5929ac1b9d4e5f7a0e381b2a95c8e0019247ad891f",
    },
  });

  // Canonical JSON Certificate (RFC 8785)
  const canonicalPayload = {
    colour_summary: { max_delta_e: 2.15, mean_delta_e: 1.42 },
    expert: { id: expertUser.id, name: expertUser.name },
    issue_date: "2026-10-25T11:00:00Z",
    measured_dimensions_mm: { length: 150.2, thickness: 14.1, width: 149.9 },
    nominal_dimensions_mm: { length: 150.0, thickness: 14.0, width: 150.0 },
    parameterset_version: 1,
    production_dates: { completed: "2026-10-25", started: "2026-10-22" },
    qc_result: "PASS",
    qc_run_id: qcRun.id,
    reference_object_description: demoProject.name,
    route: "KASHI",
    serial,
    statement_en: REPLICA_STATEMENT_EN,
    statement_uz: REPLICA_STATEMENT_UZ,
    status: "VALID",
    workshop_name: wsRishtan.name,
  };

  const canonicalJson = canonicalJsonStringify(canonicalPayload);
  const canonicalHash = sha256Hex(canonicalJson);

  // Digital Signature using Expert Ed25519 private key
  const sigBuffer = crypto.sign(null, Buffer.from(canonicalHash, "utf8"), privateKey);
  const sigHex = sigBuffer.toString("hex");

  await prisma.certificate.create({
    data: {
      serial,
      pieceId: piece.id,
      qcRunId: qcRun.id,
      statementUz: REPLICA_STATEMENT_UZ,
      statementEn: REPLICA_STATEMENT_EN,
      referenceObjectDesc: demoProject.name,
      route: "KASHI",
      parametersetVersion: 1,
      nominalDimsJson: JSON.stringify({ length: 150.0, width: 150.0, thickness: 14.0 }),
      measuredDimsJson: JSON.stringify({ length: 150.2, width: 149.9, thickness: 14.1 }),
      colourSummaryJson: JSON.stringify({ mean_delta_e: 1.42, max_delta_e: 2.15 }),
      workshopName: wsRishtan.name,
      productionDatesJson: JSON.stringify({ started: "2026-10-22", completed: "2026-10-25" }),
      expertName: expertUser.name,
      expertId: expertUser.id,
      status: "VALID",
      canonicalJson,
      canonicalJsonSha256: canonicalHash,
      expertSignature: sigHex,
    },
  });

  // 8. Cryptographic Hash-Chained Audit Log
  const t0 = new Date("2026-10-24T10:00:00Z");
  const h0 = computeRowHash(GENESIS_HASH, t0, clientUser.id, "PROJECT_CREATED", "Project", demoProject.id, JSON.stringify({ name: demoProject.name }));
  await prisma.auditLog.create({
    data: {
      prevHash: GENESIS_HASH,
      currentHash: h0,
      timestamp: t0,
      userId: clientUser.id,
      action: "PROJECT_CREATED",
      entityType: "Project",
      entityId: demoProject.id,
      payloadJson: JSON.stringify({ name: demoProject.name }),
    },
  });

  const t1 = new Date("2026-10-24T14:30:00Z");
  const h1 = computeRowHash(h0, t1, expertUser.id, "RECONSTRUCTION_APPROVED", "ReconstructionVersion", reconVersion.id, JSON.stringify({ version: 1 }));
  await prisma.auditLog.create({
    data: {
      prevHash: h0,
      currentHash: h1,
      timestamp: t1,
      userId: expertUser.id,
      action: "RECONSTRUCTION_APPROVED",
      entityType: "ReconstructionVersion",
      entityId: reconVersion.id,
      payloadJson: JSON.stringify({ version: 1 }),
    },
  });

  const t2 = new Date("2026-10-25T11:00:00Z");
  const h2 = computeRowHash(h1, t2, expertUser.id, "CERTIFICATE_ISSUED", "Certificate", serial, JSON.stringify({ serial, status: "VALID" }));
  await prisma.auditLog.create({
    data: {
      prevHash: h1,
      currentHash: h2,
      timestamp: t2,
      userId: expertUser.id,
      action: "CERTIFICATE_ISSUED",
      entityType: "Certificate",
      entityId: serial,
      payloadJson: JSON.stringify({ serial, status: "VALID" }),
    },
  });

  console.log("✨ Seeding completed successfully! 20 motifs created, DEMO project and valid certificate issued.");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
