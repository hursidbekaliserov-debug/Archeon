import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeRowHash, GENESIS_HASH } from "@/lib/audit";
import { sha256Hex } from "@/lib/crypto";

export async function GET() {
  const projects = await prisma.project.findMany({
    include: { client: true, pieces: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, location, objectType, periodStyle, notes, allowExternalAi, hasConsent } = body;

    if (!name || !location) {
      return NextResponse.json({ message: "Loyiha nomi va joylashuvi majburiy" }, { status: 400 });
    }

    // Rule R7: Rights Consent enforcement
    if (!hasConsent) {
      return NextResponse.json(
        { message: "Huquq tasdig'i majburiy (Rule R7)" },
        { status: 422 }
      );
    }

    // Default demo client
    let client = await prisma.user.findFirst({ where: { role: "CLIENT" } });
    if (!client) {
      client = await prisma.user.create({
        data: { email: "client@naqshlab.uz", role: "CLIENT", name: "Default Client" },
      });
    }

    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const ipHash = sha256Hex(`${ip}_salt_naqshlab`);

    const project = await prisma.project.create({
      data: {
        clientId: client.id,
        name,
        location,
        objectType: objectType || "KASHI_TILE",
        periodStyle: periodStyle || "An'anaviy uslub",
        notes,
        allowExternalAi: Boolean(allowExternalAi),
        consentFlag: true,
        status: "DRAFT",
      },
    });

    // Save Consent (Rule R7)
    await prisma.consent.create({
      data: {
        userId: client.id,
        projectId: project.id,
        statement: "Men yuklanayotgan materiallarni qayta ishlash huquqiga ega ekanligimni tasdiqlayman.",
        ipHash,
        consentGiven: true,
      },
    });

    // Append to Hash-Chained Audit Log
    const lastLog = await prisma.auditLog.findFirst({
      orderBy: { timestamp: "desc" },
    });
    const prevHash = lastLog?.currentHash || GENESIS_HASH;
    const now = new Date();
    const payload = JSON.stringify({ name: project.name, objectType: project.objectType });
    const currentHash = computeRowHash(prevHash, now, client.id, "PROJECT_CREATED", "Project", project.id, payload);

    await prisma.auditLog.create({
      data: {
        prevHash,
        currentHash,
        timestamp: now,
        userId: client.id,
        action: "PROJECT_CREATED",
        entityType: "Project",
        entityId: project.id,
        payloadJson: payload,
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Xatolik yuz berdi" }, { status: 500 });
  }
}
