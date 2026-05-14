import io
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.models.schemas import RenderRequest, TemplateSummary, TemplateSchema
from app.services import template_service

router = APIRouter(prefix="/api/v1/templates", tags=["templates"])


def _resolve_template_id(template_id: str) -> str:
    """Resolve template ID to filename. Raises HTTPException if not found."""
    summaries = template_service.list_templates()
    for summary in summaries:
        if summary.id == template_id or summary.filename == template_id:
            return summary.filename
    raise HTTPException(status_code=404, detail="Template not found")


@router.get("", response_model=list[TemplateSummary])
def list_templates():
    """List all available templates."""
    return template_service.list_templates()


@router.get("/{template_id}/schema", response_model=TemplateSchema)
def get_template_schema(template_id: str):
    """Get template schema (form fields and variables)."""
    filename = _resolve_template_id(template_id)
    schema = template_service.get_template_schema(filename)
    if not schema:
        raise HTTPException(status_code=404, detail="Template not found")
    return schema


@router.get("/{template_id}/content")
def get_template_content(template_id: str):
    """Get raw template content (markdown)."""
    filename = _resolve_template_id(template_id)
    content = template_service.get_template_content(filename)
    if not content:
        raise HTTPException(status_code=404, detail="Template not found")
    return {"content": content}


@router.post("/{template_id}/pdf")
def generate_pdf(template_id: str, request: RenderRequest):
    """Generate PDF for a template."""
    filename = _resolve_template_id(template_id)
    pdf_bytes = template_service.generate_pdf(filename, request.values)
    if not pdf_bytes:
        raise HTTPException(status_code=500, detail="Failed to generate PDF")

    filename_pdf = filename.replace(".md", ".pdf")
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename_pdf}"'},
    )
