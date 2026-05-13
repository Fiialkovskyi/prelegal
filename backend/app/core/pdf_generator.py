from pathlib import Path


def generate_pdf(html_string: str) -> bytes:
    """Generate PDF from HTML string."""
    # Import here to avoid requiring weasyprint at startup
    from weasyprint import HTML, CSS

    static_dir = Path(__file__).parent.parent / "static"
    css_path = static_dir / "legal.css"

    stylesheets = []
    if css_path.exists():
        stylesheets.append(CSS(filename=str(css_path)))

    pdf_bytes = HTML(string=html_string).write_pdf(stylesheets=stylesheets)
    return pdf_bytes
