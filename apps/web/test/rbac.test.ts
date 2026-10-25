import { describe, it, expect } from "vitest";
import { hasPermission, PERMISSION_MATRIX, Role, PermissionAction } from "../src/lib/auth";

describe("Server-Side RBAC Permission Matrix", () => {
  const allRoles: Role[] = ["CLIENT", "EXPERT", "WORKSHOP", "OPERATOR", "PUBLIC"];

  it("ensures WORKSHOP role can NEVER sign QC (Hard Rule Section 2)", () => {
    expect(hasPermission("WORKSHOP", "qc:sign_pass")).toBe(false);
  });

  it("ensures WORKSHOP role can record measurements and execute steps", () => {
    expect(hasPermission("WORKSHOP", "production:execute_step")).toBe(true);
    expect(hasPermission("WORKSHOP", "qc:record_measurement")).toBe(true);
  });

  it("ensures ONLY EXPERT can approve reconstruction versions", () => {
    expect(hasPermission("EXPERT", "reconstruction:approve")).toBe(true);
    expect(hasPermission("CLIENT", "reconstruction:approve")).toBe(false);
    expect(hasPermission("WORKSHOP", "reconstruction:approve")).toBe(false);
    expect(hasPermission("OPERATOR", "reconstruction:approve")).toBe(false);
    expect(hasPermission("PUBLIC", "reconstruction:approve")).toBe(false);
  });

  it("ensures EXPERT can sign QC runs and revoke certificates", () => {
    expect(hasPermission("EXPERT", "qc:sign_pass")).toBe(true);
    expect(hasPermission("EXPERT", "certificate:revoke")).toBe(true);
  });

  it("ensures OPERATOR has administrative privileges but cannot sign QC", () => {
    expect(hasPermission("OPERATOR", "admin:manage_parameters")).toBe(true);
    expect(hasPermission("OPERATOR", "admin:view_audit")).toBe(true);
    expect(hasPermission("OPERATOR", "qc:sign_pass")).toBe(false); // Only EXPERT signs QC
  });

  it("ensures PUBLIC has only certificate verification permission", () => {
    expect(hasPermission("PUBLIC", "certificate:verify")).toBe(true);
    expect(hasPermission("PUBLIC", "project:create")).toBe(false);
    expect(hasPermission("PUBLIC", "source:upload")).toBe(false);
    expect(hasPermission("PUBLIC", "admin:view_audit")).toBe(false);
  });
});
