import { z } from "zod";
import {
  REPLICA_STATEMENT_UZ,
  REPLICA_STATEMENT_EN,
  FORBIDDEN_FINISH_KEYWORDS,
  ALLOWED_FINISH_TYPES,
} from "./constants";

export type Role = "CLIENT" | "EXPERT" | "WORKSHOP" | "OPERATOR" | "PUBLIC";

export type ProjectStatus =
  | "DRAFT"
  | "SOURCES_UPLOADED"
  | "RECONSTRUCTION_REVIEW"
  | "DESIGN_APPROVED"
  | "MODEL_READY"
  | "PRODUCTION_PLANNED"
  | "IN_PRODUCTION"
  | "QC"
  | "CERTIFIED"
  | "DELIVERED"
  | "CANCELLED";

export type ObjectType = "KASHI_TILE" | "GANCH_PANEL" | "MIXED";

export type ProductionRouteType = "KASHI" | "GANCH" | "CNC_DIRECT";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "WAITING_QC" | "DONE" | "REWORK";

export type QCResultStatus = "PASS" | "FAIL" | "EXPERT_REVIEW";

export type CertificateStatus = "VALID" | "REVOKED";

export type MotifFamily = "GIRIH" | "ISLIMI" | "ROSETTE" | "BORDER_STRIP";

export type SymmetryGroup = "C2" | "C4" | "C6" | "C8" | "D2" | "D4" | "D6" | "D8";

// R2: Finish validation schema
export const FinishSchema = z.string().refine((val) => {
  const lower = val.toLowerCase();
  for (const forbidden of FORBIDDEN_FINISH_KEYWORDS) {
    if (lower.includes(forbidden)) {
      return false;
    }
  }
  return true;
}, {
  message: "Forbidden finish: Artificial ageing, patina, distressing or antique simulation is strictly prohibited (Rule R2)",
});

// R1: Replica Statement validation schema
export const ReplicaStatementSchema = z.object({
  statementUz: z.literal(REPLICA_STATEMENT_UZ),
  statementEn: z.literal(REPLICA_STATEMENT_EN),
});

// Consent schema
export const ConsentInputSchema = z.object({
  projectId: z.string(),
  hasRightsConsent: z.literal(true, {
    errorMap: () => ({ message: "Huquq tasdig'i majburiy (Rule R7)" }),
  }),
});

// Calibration schema
export const CalibrationDataSchema = z.object({
  type: z.enum(["ARUCO", "CHECKERBOARD", "MANUAL_SCALE"]),
  markerSizeMm: z.number().positive().optional(),
  pxPerMm: z.number().positive(),
  reprojectionErrorPx: z.number().nonnegative(),
  hasManualScaleWarning: z.boolean().default(false),
});

// CIELAB color sample
export const CIELABSampleSchema = z.object({
  pointId: z.string(),
  L: z.number().min(0).max(100),
  a: z.number().min(-128).max(127),
  b: z.number().min(-128).max(127),
});

// Canonical Certificate payload definition (RFC 8785)
export interface CanonicalCertificatePayload {
  serial: string;
  statement_uz: typeof REPLICA_STATEMENT_UZ;
  statement_en: typeof REPLICA_STATEMENT_EN;
  reference_object_description: string;
  route: ProductionRouteType;
  parameterset_version: number;
  nominal_dimensions_mm: { length: number; width: number; thickness: number };
  measured_dimensions_mm: { length: number; width: number; thickness: number };
  colour_summary: { mean_delta_e: number; max_delta_e: number };
  qc_run_id: string;
  qc_result: QCResultStatus;
  workshop_name: string;
  production_dates: { started: string; completed: string };
  expert: { id: string; name: string };
  issue_date: string;
  status: CertificateStatus;
}
