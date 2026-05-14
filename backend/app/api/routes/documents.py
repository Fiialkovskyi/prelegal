from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.database import Document
from app.models.schemas import DocumentCreate, DocumentUpdate, DocumentResponse
from app.core.security import get_current_user_id

router = APIRouter(prefix="/api/documents", tags=["documents"])


@router.get("", response_model=list[DocumentResponse])
def list_documents(
    user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)
):
    """List all documents for the current user."""
    documents = db.query(Document).filter(Document.user_id == user_id).all()
    return documents


@router.post("", response_model=DocumentResponse)
def create_document(
    doc_data: DocumentCreate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Create a new document."""
    new_doc = Document(
        user_id=user_id,
        name=doc_data.name,
        template_id=doc_data.template_id,
        content=doc_data.content,
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    return new_doc


@router.get("/{doc_id}", response_model=DocumentResponse)
def get_document(
    doc_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Get a specific document."""
    document = db.query(Document).filter(
        Document.id == doc_id, Document.user_id == user_id
    ).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document


@router.put("/{doc_id}", response_model=DocumentResponse)
def update_document(
    doc_id: int,
    doc_data: DocumentUpdate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Update a document."""
    document = db.query(Document).filter(
        Document.id == doc_id, Document.user_id == user_id
    ).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    if doc_data.name is not None:
        document.name = doc_data.name
    if doc_data.content is not None:
        document.content = doc_data.content

    db.commit()
    db.refresh(document)
    return document


@router.delete("/{doc_id}")
def delete_document(
    doc_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    """Delete a document."""
    document = db.query(Document).filter(
        Document.id == doc_id, Document.user_id == user_id
    ).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    db.delete(document)
    db.commit()
    return {"message": "Document deleted"}
