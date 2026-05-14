from typing import Optional, Tuple
from app.core import catalog, parser, renderer, pdf_generator
from app.models.schemas import TemplateSummary, TemplateSchema, VariableSource


_schema_cache = {}


def _filename_to_id(filename: str) -> str:
    """Convert filename to ID (remove .md extension, replace spaces)."""
    return filename.replace(".md", "").replace(" ", "-").lower()


def list_templates() -> list[TemplateSummary]:
    """List all available templates."""
    summaries = []
    cat = catalog.get_catalog()

    for item in cat:
        filename = item["filename"]
        template_path = catalog.get_template_path(filename)

        if not template_path:
            continue

        with open(template_path) as f:
            content = f.read()

        parsed = parser.parse_template(filename, content, item["name"])

        # Get unique variable sources
        sources = {v.source for v in parsed.variables}

        summaries.append(
            TemplateSummary(
                id=_filename_to_id(filename),
                filename=filename,
                name=item["name"],
                description=item["description"],
                variable_count=len(parsed.variables),
                variable_sources=sorted(list(sources), key=lambda s: s.value),
            )
        )

    return summaries


def get_template_schema(filename: str) -> Optional[TemplateSchema]:
    """Get template schema by filename."""
    if filename in _schema_cache:
        return _schema_cache[filename]

    cat_item = catalog.find_by_filename(filename)
    if not cat_item:
        return None

    template_path = catalog.get_template_path(filename)
    if not template_path:
        return None

    with open(template_path) as f:
        content = f.read()

    parsed = parser.parse_template(filename, content, cat_item["name"])

    # Find related filenames (e.g., cover pages)
    related = []
    for item in catalog.get_catalog():
        if item["filename"] != filename:
            # Simple heuristic: same base name (e.g., Mutual-NDA and Mutual-NDA-coverpage)
            base_name = filename.replace("-coverpage", "").replace(".md", "")
            if base_name in item["filename"]:
                related.append(item["filename"])

    sources = {v.source for v in parsed.variables}

    schema = TemplateSchema(
        id=_filename_to_id(filename),
        filename=filename,
        name=cat_item["name"],
        description=cat_item["description"],
        variables=parsed.variables,
        related_filenames=related,
    )

    _schema_cache[filename] = schema
    return schema


def render_template(filename: str, values: dict[str, str]) -> Optional[Tuple[str, list, list]]:
    """Render a template with given values. Returns (html, used_vars, missing_vars)."""
    template_path = catalog.get_template_path(filename)
    if not template_path:
        return None

    with open(template_path) as f:
        content = f.read()

    html, used, missing = renderer.render_template(content, values)
    return html, used, missing


def get_template_content(filename: str) -> Optional[str]:
    """Get raw template content."""
    template_path = catalog.get_template_path(filename)
    if not template_path:
        return None

    with open(template_path) as f:
        return f.read()


def generate_pdf(filename: str, values: dict[str, str]) -> Optional[bytes]:
    """Generate PDF for a template with given values."""
    result = render_template(filename, values)
    if not result:
        return None

    html, _, _ = result
    pdf_bytes = pdf_generator.generate_pdf(html)
    return pdf_bytes
