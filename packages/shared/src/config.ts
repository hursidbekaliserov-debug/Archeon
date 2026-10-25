/**
 * Archeon Single Source of Truth Brand Configuration
 * Rule 0: Keep the name in ONE config constant so it can be renamed.
 */
export const BRAND_NAME = "Archeon" as const;

export const APP_CONFIG = {
  brandName: BRAND_NAME,
  legalEntity: `${BRAND_NAME} MCHJ`,
  supportEmail: "info@archeon.uz",
  defaultCurrency: "UZS",
  defaultLocale: "uz-Latn",
  supportedLocales: ["uz-Latn", "ru", "en"] as const,
  defaultBasePlateThicknessMm: 8.0,
  cncWorkAreaMm: { x: 300, y: 180, z: 45 },
  tolerances: {
    tileDimensionsMm: 0.5,
    panelModuleDimensionsMm: 1.5,
    meanDeltaE: 2.0,
    maxDeltaE: 3.0,
    scan95thPercentileMm: 0.8,
  },
} as const;
