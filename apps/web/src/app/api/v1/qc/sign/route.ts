import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { computeRowHash, GENESIS_HASH } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { qcRunId, expertUserId } = body;

    const expert = await prisma.user.findUnique({
      where: { id: expertUserId },
    });

    // Hard Rule: Workshop can NEVER sign QC. Only EXPERT.
    if (!expert || expert.role !== "EXPERT") {
      return NextResponse.json(
        { message: "Faqat EXPERT roli sifat nazoratini imzolashi mumkin. Ustaxonaga taqiqlangan." },
        { status: 403 }
      );
    }

    const qcRun = await prisma.qCRun.findUnique({
      where: { id: qcRunId },
      include: { piece: true },
    });

    if (!qcRun) {
      return NextResponse.json({ message: "QC yozuvi topilmadi" }, { status: 404 });
    }

    if (qcRun.result !== "PASS") {
      return NextResponse.json(
        { message: "Faqat me'yordan o'tgan (PASS) QC yozuvlari imzolanadi." },
        { status: 422 }
      );
    }

    // Generate digital signature
    const signaturePayload = `${qcRun.id}|${qcRun.meanDeltaE}|${qcRun.maxDeltaE}|${qcRun.scanDeviation95thMm}`;
    const hash = crypto.createHash("sha256").update(signaturePayload).digest("hex");
    const sigHex = crypto.createHash("sha256").update(`${hash}_${expert.id}`).digest("hex");

    const now = new Date();
    const updated = await prisma.qCRun.update({
      where: { id: qcRunId },
      data: {
        expertSignedUserId: expert.id,
        signedAt: now,
        expertSignature: sigHex,
      },
    });

    // Append to audit log
    const lastLog = await prisma.auditLog.findFirst({ orderBy: { timestamp: "desc" } });
    const prevHash = lastLog?.currentHash || GENESIS_HASH;
    const currentHash = computeRowHash(
      prevHash,
      now,
      expert.id,
      "QC_RUN_SIGNED",
      "QCRun",
      qcRun.id,
      JSON.stringify({ signature: sigHex })
    );

    await prisma.auditLog.create({
      data: {
        prevHash,
        currentHash,
        timestamp: now,
        userId: expert.id,
        action: "QC_RUN_SIGNED",
        entityType: "QCRun",
        entityId: qcRun.id,
        payloadJson: JSON.stringify({ signature: sigHex }),
      },
    });

    return NextResponse.json({ qcRun: updated });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Xatolik" }, { status: 500 });
  }
}
