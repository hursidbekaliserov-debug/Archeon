import { NextRequest, NextResponse } from "next/server";
import { calculateDetailedQuote } from "@/lib/pricing";
import { FinishSchema } from "@naqshlab/shared";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { objectType, areaM2, linearMeters, complexity, route, requiresNewMould, isRushOrder, finishType } = body;

    // Hard Rule R2: Check for forbidden finish
    if (finishType) {
      const finishCheck = FinishSchema.safeParse(finishType);
      if (!finishCheck.success) {
        return NextResponse.json(
          { message: finishCheck.error.issues[0].message },
          { status: 422 }
        );
      }
    }

    const quote = calculateDetailedQuote({
      objectType: objectType || "TILE",
      areaM2: Number(areaM2) || 0,
      linearMeters: Number(linearMeters) || 0,
      complexity: complexity || "A",
      route: route || "KASHI",
      requiresNewMould: Boolean(requiresNewMould),
      isRushOrder: Boolean(isRushOrder),
    });

    return NextResponse.json({ quote });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Xatolik" }, { status: 500 });
  }
}
