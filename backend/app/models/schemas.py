from enum import Enum
from typing import Optional
from pydantic import BaseModel


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
