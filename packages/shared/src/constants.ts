/**
 * NaqshLab Constants and Microcopy
 * Absolute rules R1, R2, R5, R6 enforcement
 */

// R1: Mandatory Replica Statements
export const REPLICA_STATEMENT_UZ = "NUSXA — ASL EMAS" as const;
export const REPLICA_STATEMENT_EN = "REPLICA — NOT AN ORIGINAL" as const;

// Mandatory exact microcopy (Section 5)
export const MICROCOPY = {
  replicaUz: "NUSXA — ASL EMAS",
  replicaEn: "REPLICA — NOT AN ORIGINAL",
  expertUnapproved: "Ekspert tasdiqlamagan — taklif",
  aiSuggestionUnapproved: "AI taklifi (tasdiqlanmagan)",
  pendingApproval: "Tasdiqlash kutilmoqda",
  readyForProduction: "Ishlab chiqarishga tayyor",
  qcPassed: "Sifat nazorati: o'tdi",
  qcFailed: "Sifat nazorati: o'tmadi",
  verifyCertificate: "Sertifikatni tekshirish",
  tamperWarning: "Ma'lumot o'zgartirilgan bo'lishi mumkin",
  demoNotice: "Bu sahifa DEMO ma'lumot ko'rsatadi",
  consentRequired: "Huquq tasdig'i majburiy",
  revokedStatus: "Qaytarib olingan (REVOKED)",
} as const;

// R2: Disallowed finish values - Must not exist in schema; API returns 422
export const FORBIDDEN_FINISH_KEYWORDS = [
  "patina",
  "distress",
  "distressed",
  "antique",
  "antique_stain",
  "fake_wear",
  "aged",
  "artificial_aging",
  "wear",
  "museum_stamp",
  "inventory_seal",
  "seal_imitation",
] as const;

// Legitimate finish types
export const ALLOWED_FINISH_TYPES = [
  "NATURAL_GLAZE",
  "RAW_GANCH_MATTE",
  "SEALED_GANCH",
  "TRADITIONAL_COBALT_GLAZE",
  "TERRACOTTA_NATURAL",
] as const;

// Color Palette Tokens
export const DESIGN_TOKENS = {
  paper: "#FFFFFF",
  mist: "#F4F7FB",
  line: "#D9E3EE",
  ink: "#0E2238",
  inkMuted: "#4A6079",
  cobalt: "#1D4E9A",
  cobaltDeep: "#163C78",
  ishkor: "#5E9DBE", // Decorative only, never body text
  success: "#1F7A5A",
  warning: "#9A6A12",
  danger: "#A3372D",
} as const;
