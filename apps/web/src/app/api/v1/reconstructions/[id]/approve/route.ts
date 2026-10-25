import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeRowHash, GENESIS_HASH } from "@/lib/audit";
import { assertPermission } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { expertUserId } = body;

    const expert = await prisma.user.findUnique({
      where: { id: expertUserId },
    });

    if (!expert || expert.role !== "EXPERT") {
      return NextResponse.json(
        { message: "Faqat EXPERT roli rekonstruksiyani tasdiqlashi mumkin (Rule R3)" },
        { status: 403 }
      );
    }

    const version = await prisma.reconstructionVersion.findUnique({
      where: { id: params.id },
    });

    if (!version) {
      return NextResponse.json({ message: "Versiya topilmadi" }, { status: 404 });
    }

    const now = new Date();
    const updated = await prisma.reconstructionVersion.update({
      where: { id: params.id },
      data: {
        status: "APPROVED",
        approvedByUserId: expert.id,
        approvedAt: now,
      },
    });

    // Write to hash-chained audit log (Rule R3)
    const lastLog = await prisma.auditLog.findFirst({
      orderBy: { timestamp: "desc" },
    });
    const prevHash = lastLog?.currentHash || GENESIS_HASH;
    const payload = JSON.stringify({ versionId: version.id, approvedBy: expert.id });
    const currentHash = computeRowHash(prevHash, now, expert.id, "RECONSTRUCTION_APPROVED", "ReconstructionVersion", version.id, payload);

    await prisma.auditLog.create({
      data: {
        prevHash,
        currentHash,
        timestamp: now,
        userId: expert.id,
        action: "RECONSTRUCTION_APPROVED",
        entityType: "ReconstructionVersion",
        entityId: version.id,
        payloadJson: payload,
      },
    });

    return NextResponse.json({ version: updated });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Xatolik" }, { status: 500 });
  }
}
