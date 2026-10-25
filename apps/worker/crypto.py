"""
Cryptographic Provenance, Canonical JSON (RFC 8785) & Ed25519 Digital Signatures
"""

import json
import hashlib
from typing import Dict, Any, Tuple
from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.ciphers.aead import AESGCM


def canonical_json_encode(data: Dict[str, Any]) -> bytes:
    """
    Serializes a dictionary into RFC 8785 Canonical JSON format:
    - UTF-8 encoding
    - Keys sorted lexicographically by Unicode code point
    - No whitespace between keys, colons, or commas
    - Deterministic representation of numbers
    """
    return json.dumps(data, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")


def compute_sha256(data_bytes: bytes) -> str:
    """Computes SHA-256 hex digest."""
    return hashlib.sha256(data_bytes).hexdigest()


def generate_expert_keypair() -> Tuple[str, bytes]:
    """
    Generates a new Ed25519 keypair for an accredited EXPERT user.
    Returns:
    - public_key_hex (stored plain in DB for verification)
    - private_key_raw_bytes (to be encrypted at rest immediately)
    """
    private_key = ed25519.Ed25519PrivateKey.generate()
    public_key = private_key.public_key()

    pub_bytes = public_key.public_bytes(
        encoding=serialization.Encoding.Raw,
        format=serialization.PublicFormat.Raw
    )
    priv_bytes = private_key.private_bytes(
        encoding=serialization.Encoding.Raw,
        format=serialization.PrivateFormat.Raw,
        encryption_algorithm=serialization.NoEncryption()
    )

    return pub_bytes.hex(), priv_bytes


def encrypt_private_key_at_rest(private_key_bytes: bytes, master_secret_key: bytes) -> str:
    """
    Encrypts private key using AES-256-GCM.
    Returns nonce + ciphertext in hex string.
    """
    aesgcm = AESGCM(master_secret_key[:32])
    import os
    nonce = os.urandom(12)
    ciphertext = aesgcm.encrypt(nonce, private_key_bytes, None)
    return (nonce + ciphertext).hex()


def decrypt_private_key(encrypted_hex: str, master_secret_key: bytes) -> bytes:
    """Decrypts private key from AES-256-GCM storage."""
    raw = bytes.fromhex(encrypted_hex)
    nonce = raw[:12]
    ciphertext = raw[12:]
    aesgcm = AESGCM(master_secret_key[:32])
    return aesgcm.decrypt(nonce, ciphertext, None)


def sign_certificate_hash(private_key_bytes: bytes, canonical_json_sha256: str) -> str:
    """
    Signs the SHA-256 digest of the canonical certificate JSON using Ed25519.
    Returns signature in hexadecimal.
    """
    priv_key = ed25519.Ed25519PrivateKey.from_private_bytes(private_key_bytes)
    sig = priv_key.sign(canonical_json_sha256.encode("utf-8"))
    return sig.hex()


def verify_certificate_signature(public_key_hex: str, canonical_json_sha256: str, signature_hex: str) -> bool:
    """
    Verifies Ed25519 signature over canonical JSON hash.
    Returns True if mathematically valid, False otherwise.
    """
    try:
        pub_key = ed25519.Ed25519PublicKey.from_public_bytes(bytes.fromhex(public_key_hex))
        pub_key.verify(bytes.fromhex(signature_hex), canonical_json_sha256.encode("utf-8"))
        return True
    except Exception:
        return False
