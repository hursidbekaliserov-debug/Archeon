/**
 * NaqshLab TypeScript Cryptographic Utilities
 * - RFC 8785 Canonical JSON serialization
 * - SHA-256 digest computation
 * - Ed25519 signature verification
 */

import crypto from "crypto";

/**
 * Encodes JavaScript object to deterministic RFC 8785 Canonical JSON string.
 */
export function canonicalJsonStringify(obj: any): string {
  if (obj === null || typeof obj !== "object") {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    return "[" + obj.map(canonicalJsonStringify).join(",") + "]";
  }

  const sortedKeys = Object.keys(obj).sort();
  const pairs = sortedKeys.map(
    (key) => `${JSON.stringify(key)}:${canonicalJsonStringify(obj[key])}`
  );
  return "{" + pairs.join(",") + "}";
}

/**
 * Computes SHA-256 hash in hexadecimal.
 */
export function sha256Hex(data: string | Buffer): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

/**
 * Verifies Ed25519 digital signature of canonical JSON hash.
 */
export function verifyEd25519Signature(
  publicKeyHex: string,
  dataHashHex: string,
  signatureHex: string
): boolean {
  try {
    const pubKeyBuffer = Buffer.from(publicKeyHex, "hex");
    const sigBuffer = Buffer.from(signatureHex, "hex");
    const dataBuffer = Buffer.from(dataHashHex, "utf8");

    // Construct SPKI DER format for Node crypto ed25519 public key
    // Ed25519 SPKI prefix: 302a300506032b6570032100
    const spkiPrefix = Buffer.from("302a300506032b6570032100", "hex");
    const fullSpki = Buffer.concat([spkiPrefix, pubKeyBuffer]);

    const keyObj = crypto.createPublicKey({
      key: fullSpki,
      format: "der",
      type: "spki",
    });

    return crypto.verify(null, dataBuffer, keyObj, sigBuffer);
  } catch (err) {
    return false;
  }
}
