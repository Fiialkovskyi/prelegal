import io
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.models.schemas import RenderRequest, RenderResponse, TemplateSummary, TemplateSchema
from app.services import template_service

router = APIRouter(prefix="/api/v1/templates", tags=["templates"])


@router.get("", response_model=list[TemplateSummary])
def list_templates():
    """List all available templates."""
    return template_service.list_templates()


@router.get("/{template_id}/schema", response_model=TemplateSchema)
def get_template_schema(template_id: str):
    """Get template schema (form fields and variables)."""
    # Find template by ID or filename
    summaries = template_service.list_templates()
    template_summary = None

    for summary in summaries:
        if summary.id == template_id or summary.filename == template_id:
            template_summary = summary
            break

    if not template_summary:
        raise HTTPException(status_code=404, detail="Template not found")

    schema = template_service.get_template_schema(template_summary.filename)
    if not schema:
        raise HTTPException(status_code=404, detail="Template not found")

    return schema


@router.get("/{template_id}/content")
def get_template_content(template_id: str):
    """Get raw template content (markdown)."""
    summaries = template_service.list_templates()
    template_summary = None

    for summary in summaries:
        if summary.id == template_id or summary.filename == template_id:
            template_summary = summary
            break

    if not template_summary:
        raise HTTPException(status_code=404, detail="Template not found")

    content = template_service.get_template_content(template_summary.filename)
    if not content:
        raise HTTPException(status_code=404, detail="Template not found")

    return {"content": content}


@router.post("/{template_id}/render", response_model=RenderResponse)
def render_template(template_id: str, request: RenderRequest):
    """Render a template with given values."""
    summaries = template_service.list_templates()
    template_summary = None

    for summary in summaries:
        if summary.id == template_id or summary.filename == template_id:
            template_summary = summary
            break

    if not template_summary:
        raise HTTPException(status_code=404, detail="Template not found")

    result = template_service.render_template(template_summary.filename, request.values)
    if not result:
        raise HTTPException(status_code=500, detail="Failed to render template")

    html, used, missing = result

    if request.strict and missing:
        raise HTTPException(
            status_code=422,
            detail=f"Missing required fields: {', '.join(missing)}",
        )

    return RenderResponse(html=html, variables_used=used, variables_missing=missing)


@router.post("/{template_id}/pdf")
def generate_pdf(template_id: str, request: RenderRequest):
    """Generate PDF for a template."""
    summaries = template_service.list_templates()
    template_summary = None

    for summary in summaries:
        if summary.id == template_id or summary.filename == template_id:
            template_summary = summary
            break

    if not template_summary:
        raise HTTPException(status_code=404, detail="Template not found")

    pdf_bytes = template_service.generate_pdf(template_summary.filename, request.values)
    if not pdf_bytes:
        raise HTTPException(status_code=500, detail="Failed to generate PDF")

    # Return PDF as streaming response
    filename = template_summary.filename.replace(".md", ".pdf")
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
