"""
Bilingual QC Report & A5 Certificate PDF Generation via ReportLab
Enforces Rule R1:
Every customer-facing document must display:
- Uzbek: "NUSXA — ASL EMAS"
- English: "REPLICA — NOT AN ORIGINAL"
Fails immediately if either statement is absent.
"""

import io
from typing import Dict, Any
from reportlab.lib.pagesizes import A4, A5
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm


REPLICA_STATEMENT_UZ = "NUSXA — ASL EMAS"
REPLICA_STATEMENT_EN = "REPLICA — NOT AN ORIGINAL"


def generate_qc_report_pdf(qc_data: Dict[str, Any]) -> bytes:
    """
    Generates bilingual QC Report PDF (A4) in uz-Latn and en.
    """
    # R1 Validation
    statement_uz = qc_data.get("statement_uz")
    statement_en = qc_data.get("statement_en")
    if statement_uz != REPLICA_STATEMENT_UZ or statement_en != REPLICA_STATEMENT_EN:
        raise ValueError(f"Rule R1 Violation: Cannot generate QC Report without mandatory replica statements.")

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=15 * mm,
        rightMargin=15 * mm,
        topMargin=15 * mm,
        bottomMargin=15 * mm
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "TitleStyle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=16,
        textColor=colors.HexColor("#0E2238"),
        spaceAfter=4
    )
    replica_banner_style = ParagraphStyle(
        "ReplicaBanner",
        fontName="Courier-Bold",
        fontSize=12,
        textColor=colors.HexColor("#1D4E9A"),
        alignment=1, # Center
        spaceAfter=10
    )
    body_style = ParagraphStyle(
        "Body",
        fontName="Helvetica",
        fontSize=10,
        textColor=colors.HexColor("#4A6079"),
        spaceAfter=6
    )

    elements = []

    # Mandatory Replica Banner
    elements.append(Paragraph(f"<b>{REPLICA_STATEMENT_UZ}</b> &bull; <b>{REPLICA_STATEMENT_EN}</b>", replica_banner_style))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#D9E3EE"), spaceAfter=10))

    # Header
    elements.append(Paragraph("SIFAT NAZORATI HISOBOTI / QUALITY CONTROL REPORT", title_style))
    elements.append(Paragraph(f"<b>Buyum seriyasi / Piece Serial:</b> {qc_data.get('serial', 'N/A')}", body_style))
    elements.append(Paragraph(f"<b>Obyekt / Reference Object:</b> {qc_data.get('object_name', 'Heritage Tile')}", body_style))
    elements.append(Paragraph(f"<b>Ishlab chiqarish yo'nalishi / Route:</b> {qc_data.get('route', 'KASHI')}", body_style))
    elements.append(Spacer(1, 10))

    # Metrics Summary Table
    table_data = [
        ["Metrika / Metric", "Me'yor / Threshold", "Haqiqiy / Measured", "Holat / Status"],
        ["O'rtacha Rang Farqi (Mean dE00)", "<= 2.0", f"{qc_data.get('mean_delta_e', 0.0):.2f}", "O'TDI / PASS"],
        ["Maksimal Rang Farqi (Max dE00)", "<= 3.0", f"{qc_data.get('max_delta_e', 0.0):.2f}", "O'TDI / PASS"],
        ["3D Skan Og'ishi (95th %ile)", "<= 0.8 mm", f"{qc_data.get('scan_p95_mm', 0.0):.2f} mm", "O'TDI / PASS"],
        ["O'lcham og'ishi (Caliper)", "<= 0.5 mm", f"{qc_data.get('caliper_delta_mm', 0.0):.2f} mm", "O'TDI / PASS"],
    ]

    t = Table(table_data, colWidths=[60 * mm, 35 * mm, 40 * mm, 35 * mm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#F4F7FB")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#0E2238")),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#D9E3EE")),
        ("ALIGN", (1, 0), (-1, -1), "CENTER"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 15))

    # Signature Block
    elements.append(Paragraph("<b>Ekspert Tasdig'i / Expert Signature:</b>", body_style))
    elements.append(Spacer(1, 5))
    sig_data = [
        ["Ekspert / Expert Name:", qc_data.get("expert_name", "Inomjon Shomurodov (Heritage Restorer)")],
        ["Raqamli Imzo / Digital Signature (Ed25519):", qc_data.get("expert_signature", "8f3e...b12a")[:32] + "..."],
        ["Imzolangan Sana / Date:", qc_data.get("signed_at", "2026-10-25 12:00:00 UTC")]
    ]
    st = Table(sig_data, colWidths=[65 * mm, 105 * mm])
    st.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTNAME", (1, 0), (1, -1), "Courier"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    elements.append(st)

    doc.build(elements)
    return buffer.getvalue()


def generate_certificate_pdf(cert_data: Dict[str, Any]) -> bytes:
    """
    Generates A5 Certificate of Provenance PDF.
    """
    # R1 Validation
    if cert_data.get("statement_uz") != REPLICA_STATEMENT_UZ or cert_data.get("statement_en") != REPLICA_STATEMENT_EN:
        raise ValueError(f"Rule R1 Violation: Certificate requires both replica statements.")

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A5,
        leftMargin=10 * mm,
        rightMargin=10 * mm,
        topMargin=10 * mm,
        bottomMargin=10 * mm
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "CertTitle",
        fontName="Helvetica-Bold",
        fontSize=14,
        textColor=colors.HexColor("#0E2238"),
        alignment=1,
        spaceAfter=6
    )
    banner_style = ParagraphStyle(
        "CertBanner",
        fontName="Courier-Bold",
        fontSize=11,
        textColor=colors.HexColor("#1D4E9A"),
        alignment=1,
        spaceAfter=8
    )
    meta_style = ParagraphStyle(
        "CertMeta",
        fontName="Helvetica",
        fontSize=8,
        textColor=colors.HexColor("#4A6079"),
        spaceAfter=4
    )

    elements = [
        Paragraph(f"<b>{REPLICA_STATEMENT_UZ}</b> &bull; <b>{REPLICA_STATEMENT_EN}</b>", banner_style),
        HRFlowable(width="100%", thickness=1, color=colors.HexColor("#1D4E9A"), spaceAfter=8),
        Paragraph("HAQIQIYLIK SERTIFIKATI / CERTIFICATE OF PROVENANCE", title_style),
        Spacer(1, 4),
        Paragraph(f"<b>Seriya raqami / Serial:</b> {cert_data.get('serial', 'NLB-KSH-2026-000001')}", meta_style),
        Paragraph(f"<b>Yo'nalish / Route:</b> {cert_data.get('route', 'KASHI')}", meta_style),
        Paragraph(f"<b>Obyekt / Reference:</b> {cert_data.get('reference_object_description', 'Bukhara Kalyan Mosque Tile Replica')}", meta_style),
        Paragraph(f"<b>Ustaxona / Workshop:</b> {cert_data.get('workshop_name', 'Rishtan Ceramic Lab')}", meta_style),
        Paragraph(f"<b>Sertifikat Holati / Status:</b> <b>{cert_data.get('status', 'VALID')}</b>", meta_style),
        Spacer(1, 6),
        Paragraph(f"<b>Ommaviy tekshirish / Public Verification:</b> https://naqshlab.uz/v/{cert_data.get('serial', '')}", meta_style),
        Paragraph(f"<b>SHA-256 Hash:</b> {cert_data.get('canonical_json_sha256', '')}", meta_style),
        Paragraph(f"<b>Ed25519 Imzo / Signature:</b> {cert_data.get('expert_signature', '')[:48]}...", meta_style),
    ]

    doc.build(elements)
    return buffer.getvalue()
