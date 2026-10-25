"""
Unit & Integration Tests for FastAPI Geometry Worker Service
Verifies:
- Endpoints (/health, /ready, /delta-e, /split-modules, /toolpath, /pdf)
- Out-of-bounds CNC toolpath rejection (422)
- Excessive depth toolpath rejection (422)
- Rule R1 replica statement enforcement on PDF generation
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

import pytest
from fastapi.testclient import TestClient
from main import app


client = TestClient(app)


def test_health_and_ready():
    r1 = client.get("/health")
    assert r1.status_code == 200
    assert r1.json()["status"] == "ok"

    r2 = client.get("/ready")
    assert r2.status_code == 200
    assert r2.json()["status"] == "ready"


def test_delta_e_endpoint():
    payload = {
        "lab1": [50.0, 2.6772, -79.7751],
        "lab2": [50.0, 0.0, -82.7485]
    }
    res = client.post("/delta-e", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert abs(data["delta_e00"] - 2.0425) < 0.005
    assert data["passes_default_threshold"] is False  # 2.0425 > 2.0


def test_panel_splitting():
    # Large panel: 600mm x 400mm
    payload = {
        "panel_width_mm": 600.0,
        "panel_length_mm": 400.0,
        "max_module_width_mm": 280.0,
        "max_module_length_mm": 160.0,
        "joint_gap_mm": 1.5
    }
    res = client.post("/split-modules", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["grid"]["cols"] == 3
    assert data["grid"]["rows"] == 3
    assert data["total_modules"] == 9
    assert len(data["modules"]) == 9
    assert data["modules"][0]["code"] == "M-R1-C1"


def test_cnc_toolpath_within_bounds():
    payload = {
        "width_mm": 150.0,
        "length_mm": 150.0,
        "relief_depth_mm": 6.0
    }
    res = client.post("/toolpath", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "G21" in data["gcode"]
    assert "NUSXA — ASL EMAS" in data["gcode"]
    assert data["line_count"] > 10


def test_cnc_toolpath_refuses_out_of_bounds():
    # Width 450mm exceeds 300mm envelope
    payload = {
        "width_mm": 450.0,
        "length_mm": 150.0,
        "relief_depth_mm": 6.0
    }
    res = client.post("/toolpath", json=payload)
    assert res.status_code == 422
    assert "exceeds 3018 work envelope" in res.json()["detail"]


def test_cnc_toolpath_refuses_excessive_depth():
    # Depth 40mm exceeds 30mm limit
    payload = {
        "width_mm": 150.0,
        "length_mm": 150.0,
        "relief_depth_mm": 40.0
    }
    res = client.post("/toolpath", json=payload)
    assert res.status_code == 422
    assert "exceeds safe limit" in res.json()["detail"]


def test_qc_report_pdf_rule_r1():
    valid_payload = {
        "statement_uz": "NUSXA — ASL EMAS",
        "statement_en": "REPLICA — NOT AN ORIGINAL",
        "serial": "NLB-KSH-2026-000001",
        "object_name": "Bukhara Kalyan Tile",
        "route": "KASHI",
        "mean_delta_e": 1.45,
        "max_delta_e": 2.10,
        "scan_p95_mm": 0.42,
        "caliper_delta_mm": 0.15
    }
    res = client.post("/pdf/qc-report", json=valid_payload)
    assert res.status_code == 200
    assert res.headers["content-type"] == "application/pdf"
    assert len(res.content) > 1000

    # Rule R1 violation: missing replica statement
    invalid_payload = valid_payload.copy()
    invalid_payload["statement_uz"] = "ASL NUSXA"
    res_bad = client.post("/pdf/qc-report", json=invalid_payload)
    assert res_bad.status_code == 422


def test_certificate_pdf_rule_r1():
    valid_payload = {
        "statement_uz": "NUSXA — ASL EMAS",
        "statement_en": "REPLICA — NOT AN ORIGINAL",
        "serial": "NLB-GNC-2026-000002",
        "route": "GANCH",
        "reference_object_description": "Samarkand Plaster Panel Replica",
        "workshop_name": "Tashkent Ganch Lab",
        "status": "VALID",
        "canonical_json_sha256": "abcdef1234567890",
        "expert_signature": "0123456789abcdef" * 4
    }
    res = client.post("/pdf/certificate", json=valid_payload)
    assert res.status_code == 200
    assert res.headers["content-type"] == "application/pdf"

    invalid_payload = valid_payload.copy()
    invalid_payload["statement_en"] = "AUTHENTIC ANTIQUE"
    res_bad = client.post("/pdf/certificate", json=invalid_payload)
    assert res_bad.status_code == 422
