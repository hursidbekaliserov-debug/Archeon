import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeRowHash, GENESIS_HASH } from "@/lib/audit";

export async function POST(req: NextRequest, { params }: { params: { serial: string } }) {
  try {
    const serial = decodeURIComponent(params.serial);
    const body = await req.json();
    const { userId, reason } = body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || (user.role !== "EXPERT" && user.role !== "OPERATOR")) {
      return NextResponse.json(
        { message: "Sertifikatni faqat EXPERT yoki OPERATOR bekor qilishi mumkin." },
        { status: 403 }
      );
    }

    if (!reason) {
      return NextResponse.json({ message: "Bekor qilish sababi kiritilishi shart." }, { status: 400 });
    }

    const cert = await prisma.certificate.findUnique({
      where: { serial },
    });

    if (!cert) {
      return NextResponse.json({ message: "Sertifikat topilmadi" }, { status: 404 });
    }

    const now = new Date();
    const updated = await prisma.certificate.update({
      where: { serial },
      data: {
        status: "REVOKED",
        revocationReason: reason,
        revokedAt: now,
      },
    });

    // Audit log
    const lastLog = await prisma.auditLog.findFirst({ orderBy: { timestamp: "desc" } });
    const prevHash = lastLog?.currentHash || GENESIS_HASH;
    const currentHash = computeRowHash(
      prevHash,
      now,
      user.id,
      "CERTIFICATE_REVOKED",
      "Certificate",
      serial,
      JSON.stringify({ serial, reason })
    );

    await prisma.auditLog.create({
      data: {
        prevHash,
        currentHash,
        timestamp: now,
        userId: user.id,
        action: "CERTIFICATE_REVOKED",
        entityType: "Certificate",
        entityId: serial,
        payloadJson: JSON.stringify({ serial, reason }),
      },
    });

    return NextResponse.json({ certificate: updated });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Xatolik" }, { status: 500 });
  }
}
