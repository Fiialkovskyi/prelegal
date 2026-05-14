from enum import Enum
from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class VariableSource(str, Enum):
    COVERPAGE = "coverpage_link"
    KEYTERMS = "keyterms_link"
    ORDERFORM = "orderform_link"
    BUSINESSTERMS = "businessterms_link"
    SOW = "sow_link"
    BRACKET = "bracket"


class TemplateVariable(BaseModel):
    name: str
    source: VariableSource
    occurrences: int
    required: bool = True
    description: Optional[str] = None


class TemplateSummary(BaseModel):
    id: str
    filename: str
    name: str
    description: str
    variable_count: int
    variable_sources: list[VariableSource]


class TemplateSchema(BaseModel):
    id: str
    filename: str
    name: str
    description: str
    variables: list[TemplateVariable]
    related_filenames: list[str] = []


class RenderRequest(BaseModel):
    values: dict[str, str]


# Auth schemas
class UserSignUp(BaseModel):
    email: str
    password: str


class UserSignIn(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


# Document schemas
class DocumentCreate(BaseModel):
    name: str
    template_id: str
    content: str


class DocumentUpdate(BaseModel):
    name: Optional[str] = None
    content: Optional[str] = None


class DocumentResponse(BaseModel):
    id: int
    user_id: int
    name: str
    template_id: str
    content: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
