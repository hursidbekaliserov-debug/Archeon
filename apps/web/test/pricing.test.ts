import { describe, it, expect } from "vitest";
import { calculateDetailedQuote, BASE_PRICE_RULES } from "../src/lib/pricing";

describe("Deterministic Pricing Engine", () => {
  it("calculates standard tile quote accurately with replica statement on each item", () => {
    const quote = calculateDetailedQuote({
      objectType: "TILE",
      areaM2: 2.0,
      complexity: "A",
      route: "KASHI",
      requiresNewMould: false,
      isRushOrder: false,
    });

    // unitPrice = (2,800,000 + 350,000) * 1.0 = 3,150,000
    // total = 3,150,000 * 2.0 = 6,300,000 UZS
    expect(quote.totalUzs).toBe(6_300_000);
    expect(quote.items.length).toBe(1);
    expect(quote.items[0].replicaStatementUz).toBe("NUSXA — ASL EMAS");
    expect(quote.items[0].replicaStatementEn).toBe("REPLICA — NOT AN ORIGINAL");
  });

  it("handles zero area gracefully", () => {
    const quote = calculateDetailedQuote({
      objectType: "TILE",
      areaM2: 0.0,
      complexity: "B",
      route: "GANCH",
      requiresNewMould: false,
      isRushOrder: false,
    });

    expect(quote.totalUzs).toBe(0);
    expect(quote.subtotalUzs).toBe(0);
  });

  it("accurately applies one-time mould fee and rush order surcharge", () => {
    const quote = calculateDetailedQuote({
      objectType: "TILE",
      areaM2: 1.0,
      complexity: "A",
      route: "KASHI",
      requiresNewMould: true,
      isRushOrder: true,
    });

    // Tile base: 3,150,000 UZS
    // Mould fee: 1,200,000 UZS
    // Subtotal before rush: 4,350,000 UZS
    // Rush multiplier: 1.4x (+40% = 1,740,000 UZS)
    // Final total: 6,090,000 UZS
    expect(quote.subtotalUzs).toBe(6_090_000);
    expect(quote.totalUzs).toBe(6_090_000);
    expect(quote.items.some((it) => it.descriptionEn.includes("mould"))).toBe(true);
    expect(quote.items.some((it) => it.descriptionEn.includes("Rush"))).toBe(true);
  });

  it("calculates linear frieze border items", () => {
    const quote = calculateDetailedQuote({
      objectType: "FRIEZE_BORDER",
      areaM2: 0,
      linearMeters: 10.0,
      complexity: "B", // 1.35x
      route: "GANCH",  // +150k
      requiresNewMould: false,
      isRushOrder: false,
    });

    // unitPrice = (750,000 + 150,000) * 1.35 = 900,000 * 1.35 = 1,215,000
    // total = 1,215,000 * 10 = 12,150,000 UZS
    expect(quote.totalUzs).toBe(12_150_000);
  });
});
