/**
 * NaqshLab Server-Side RBAC & Session Security
 * Roles:
 * - CLIENT: Own projects, uploads, reviews proposals, quotes, orders, certificates
 * - EXPERT: Approves reconstructions & 3D models, signs QC runs (Ed25519), approves/revokes certificates
 * - WORKSHOP: Assigned tasks, completes checklists, uploads photos/measurements. NEVER signs QC.
 * - OPERATOR: Full system administration (workshops, parameter sets, tolerances, users, audit, analytics)
 * - PUBLIC: Verifies certificates at /v/{serial}. No login required.
 */

import { Role } from "@naqshlab/shared";

export type PermissionAction =
  | "project:create"
  | "project:read_own"
  | "project:read_all"
  | "source:upload"
  | "reconstruction:propose"
  | "reconstruction:approve" // EXPERT only
  | "model:approve"          // EXPERT only
  | "production:assign_task"
  | "production:execute_step"
  | "qc:record_measurement"
  | "qc:sign_pass"           // EXPERT only; WORKSHOP strictly prohibited
  | "certificate:issue"
  | "certificate:revoke"     // EXPERT or OPERATOR only
  | "certificate:verify"     // PUBLIC and all
  | "admin:manage_parameters"// OPERATOR only
  | "admin:view_audit";      // OPERATOR only

export const PERMISSION_MATRIX: Record<Role, Record<PermissionAction, boolean>> = {
  CLIENT: {
    "project:create": true,
    "project:read_own": true,
    "project:read_all": false,
    "source:upload": true,
    "reconstruction:propose": true,
    "reconstruction:approve": false,
    "model:approve": false,
    "production:assign_task": false,
    "production:execute_step": false,
    "qc:record_measurement": false,
    "qc:sign_pass": false,
    "certificate:issue": false,
    "certificate:revoke": false,
    "certificate:verify": true,
    "admin:manage_parameters": false,
    "admin:view_audit": false,
  },
  EXPERT: {
    "project:create": false,
    "project:read_own": true,
    "project:read_all": true,
    "source:upload": false,
    "reconstruction:propose": true,
    "reconstruction:approve": true,
    "model:approve": true,
    "production:assign_task": false,
    "production:execute_step": false,
    "qc:record_measurement": true,
    "qc:sign_pass": true,
    "certificate:issue": true,
    "certificate:revoke": true,
    "certificate:verify": true,
    "admin:manage_parameters": false,
    "admin:view_audit": true,
  },
  WORKSHOP: {
    "project:create": false,
    "project:read_own": false,
    "project:read_all": false,
    "source:upload": false,
    "reconstruction:propose": false,
    "reconstruction:approve": false,
    "model:approve": false,
    "production:assign_task": false,
    "production:execute_step": true,
    "qc:record_measurement": true,
    "qc:sign_pass": false, // WORKSHOP can NEVER sign QC (Hard Rule Section 2)
    "certificate:issue": false,
    "certificate:revoke": false,
    "certificate:verify": true,
    "admin:manage_parameters": false,
    "admin:view_audit": false,
  },
  OPERATOR: {
    "project:create": true,
    "project:read_own": true,
    "project:read_all": true,
    "source:upload": true,
    "reconstruction:propose": true,
    "reconstruction:approve": false, // Only EXPERT approves reconstructions
    "model:approve": false,
    "production:assign_task": true,
    "production:execute_step": true,
    "qc:record_measurement": true,
    "qc:sign_pass": false,          // OPERATOR manages system; EXPERT signs QC
    "certificate:issue": false,
    "certificate:revoke": true,
    "certificate:verify": true,
    "admin:manage_parameters": true,
    "admin:view_audit": true,
  },
  PUBLIC: {
    "project:create": false,
    "project:read_own": false,
    "project:read_all": false,
    "source:upload": false,
    "reconstruction:propose": false,
    "reconstruction:approve": false,
    "model:approve": false,
    "production:assign_task": false,
    "production:execute_step": false,
    "qc:record_measurement": false,
    "qc:sign_pass": false,
    "certificate:issue": false,
    "certificate:revoke": false,
    "certificate:verify": true,
    "admin:manage_parameters": false,
    "admin:view_audit": false,
  },
};

export function hasPermission(role: Role, action: PermissionAction): boolean {
  return Boolean(PERMISSION_MATRIX[role]?.[action]);
}

export function assertPermission(role: Role, action: PermissionAction) {
  if (!hasPermission(role, action)) {
    throw new Error(`Forbidden: Role '${role}' lacks permission for '${action}'`);
  }
}
