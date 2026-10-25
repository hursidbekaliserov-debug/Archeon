/**
 * NaqshLab Deterministic Price Engine
 * Computes transparent, itemized quotes for custom heritage reproduction:
 * - Surface area rate (per m2 for tiles)
 * - Linear meter rate (for border friezes)
 * - Complexity multipliers (Class A = 1.0, Class B = 1.35, Class C = 1.75)
 * - Route surcharges (KASHI ceramic vs GANCH plaster vs CNC_DIRECT)
 * - One-time master mould fabrication fee per unique design
 * - Rush production surcharge multiplier (e.g. 1.5x)
 * - Optional transport logistics zone fees
 * - Configurable VAT percentage (default 0%)
 * - Edge case handling: zero area, rounding, currency conversion (UZS / USD)
 */

import { ProductionRouteType, REPLICA_STATEMENT_UZ, REPLICA_STATEMENT_EN } from "@naqshlab/shared";

export type ComplexityClass = "A" | "B" | "C";

export interface PriceEngineParams {
  objectType: "TILE" | "FRIEZE_BORDER" | "PANEL";
  areaM2: number;
  linearMeters?: number;
  complexity: ComplexityClass;
  route: ProductionRouteType;
  requiresNewMould: boolean;
  isRushOrder: boolean;
  transportZoneKm?: number;
  vatPercent?: number;
  currency?: "UZS" | "USD";
  uzsToUsdRate?: number;
}

export interface QuoteLineItem {
  descriptionUz: string;
  descriptionEn: string;
  quantity: number;
  unitPriceUzs: number;
  totalPriceUzs: number;
  replicaStatementUz: string;
  replicaStatementEn: string;
}

export interface DetailedQuote {
  subtotalUzs: number;
  vatPercent: number;
  vatAmountUzs: number;
  totalUzs: number;
  totalUsd: number;
  isEstimate: boolean;
  items: QuoteLineItem[];
}

// Default baseline price rules in UZS
export const BASE_PRICE_RULES = {
  tileRatePerM2Uzs: 2_800_000,          // 2.8M UZS (~$220) per m2
  friezeRatePerLinearMUzs: 750_000,      // 750k UZS per linear meter
  complexityMultipliers: {
    A: 1.0,   // Standard geometric repeating grid
    B: 1.35,  // Dual-level islimi floral interlacing
    C: 1.75,  // Multi-tier high-relief mukarnas / multi-color glaze
  },
  routeSurchargesUzs: {
    KASHI: 350_000,       // Bisque + glaze double-firing surcharge
    GANCH: 150_000,       // Artisanal hand-carving labour allocation
    CNC_DIRECT: 250_000,  // Machine runtime + manual finishing
  },
  mouldFeePerDesignUzs: 1_200_000,       // One-off silicone/plaster master mould
  rushMultiplier: 1.4,                   // 40% surcharge for priority kiln/casting schedule
  transportPer100KmUzs: 200_000,
  defaultUzsToUsdRate: 12_800,
} as const;

export function calculateDetailedQuote(params: PriceEngineParams): DetailedQuote {
  const items: QuoteLineItem[] = [];

  const complexityMult = BASE_PRICE_RULES.complexityMultipliers[params.complexity] || 1.0;
  const routeSurcharge = BASE_PRICE_RULES.routeSurchargesUzs[params.route] || 0;
  const safeArea = Math.max(0, params.areaM2);

  // 1. Base fabrication item
  if (params.objectType === "FRIEZE_BORDER" && (params.linearMeters ?? 0) > 0) {
    const lm = Math.max(0, params.linearMeters ?? 0);
    const unitPrice = Math.round((BASE_PRICE_RULES.friezeRatePerLinearMUzs + routeSurcharge) * complexityMult);
    const lineTotal = Math.round(unitPrice * lm);
    items.push({
      descriptionUz: `Hoshiya frizi ishlab chiqarish (${params.complexity}-daraja, ${params.route})`,
      descriptionEn: `Frieze border fabrication (Class ${params.complexity}, ${params.route})`,
      quantity: lm,
      unitPriceUzs: unitPrice,
      totalPriceUzs: lineTotal,
      replicaStatementUz: REPLICA_STATEMENT_UZ,
      replicaStatementEn: REPLICA_STATEMENT_EN,
    });
  } else {
    // Standard tile or panel by m2
    const baseRate = BASE_PRICE_RULES.tileRatePerM2Uzs;
    const unitPrice = Math.round((baseRate + routeSurcharge) * complexityMult);
    const lineTotal = Math.round(unitPrice * safeArea);
    items.push({
      descriptionUz: `An'anaviy qoplama paneli/koshin (${safeArea.toFixed(2)} m², ${params.complexity}-daraja, ${params.route})`,
      descriptionEn: `Heritage panel/tile fabrication (${safeArea.toFixed(2)} m², Class ${params.complexity}, ${params.route})`,
      quantity: Number(safeArea.toFixed(2)),
      unitPriceUzs: unitPrice,
      totalPriceUzs: lineTotal,
      replicaStatementUz: REPLICA_STATEMENT_UZ,
      replicaStatementEn: REPLICA_STATEMENT_EN,
    });
  }

  // 2. Master mould fee (if requested)
  if (params.requiresNewMould) {
    const mouldFee = BASE_PRICE_RULES.mouldFeePerDesignUzs;
    items.push({
      descriptionUz: "Usta qolipi tayyorlash (bir martalik matritsa/qolip)",
      descriptionEn: "Master mould fabrication (one-time tooling)",
      quantity: 1,
      unitPriceUzs: mouldFee,
      totalPriceUzs: mouldFee,
      replicaStatementUz: REPLICA_STATEMENT_UZ,
      replicaStatementEn: REPLICA_STATEMENT_EN,
    });
  }

  // 3. Transport logistics fee
  if (params.transportZoneKm && params.transportZoneKm > 0) {
    const transportTotal = Math.round((params.transportZoneKm / 100) * BASE_PRICE_RULES.transportPer100KmUzs);
    items.push({
      descriptionUz: `Maxsus amortizatsiyalangan yetkazib berish (${params.transportZoneKm} km)`,
      descriptionEn: `Specialized shock-damped transport (${params.transportZoneKm} km)`,
      quantity: 1,
      unitPriceUzs: transportTotal,
      totalPriceUzs: transportTotal,
      replicaStatementUz: REPLICA_STATEMENT_UZ,
      replicaStatementEn: REPLICA_STATEMENT_EN,
    });
  }

  // Calculate preliminary sum
  let rawSubtotal = items.reduce((acc, it) => acc + it.totalPriceUzs, 0);

  // 4. Rush surcharge (applies as multiplier over fabrication items)
  if (params.isRushOrder && rawSubtotal > 0) {
    const rushSurcharge = Math.round(rawSubtotal * (BASE_PRICE_RULES.rushMultiplier - 1.0));
    items.push({
      descriptionUz: "Tezlashtirilgan ishlab chiqarish ustamasi (navbatsiz)",
      descriptionEn: "Rush order acceleration surcharge (priority allocation)",
      quantity: 1,
      unitPriceUzs: rushSurcharge,
      totalPriceUzs: rushSurcharge,
      replicaStatementUz: REPLICA_STATEMENT_UZ,
      replicaStatementEn: REPLICA_STATEMENT_EN,
    });
    rawSubtotal += rushSurcharge;
  }

  // 5. VAT calculation
  const vatRate = Math.max(0, params.vatPercent ?? 0);
  const vatAmount = Math.round(rawSubtotal * (vatRate / 100));
  const totalUzs = rawSubtotal + vatAmount;

  // Currency conversion
  const exchangeRate = params.uzsToUsdRate || BASE_PRICE_RULES.defaultUzsToUsdRate;
  const totalUsd = Number((totalUzs / exchangeRate).toFixed(2));

  return {
    subtotalUzs: rawSubtotal,
    vatPercent: vatRate,
    vatAmountUzs: vatAmount,
    totalUzs,
    totalUsd,
    isEstimate: true, // Quotes are estimates per Section 3.9
    items,
  };
}
