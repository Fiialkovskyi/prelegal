import re
from dataclasses import dataclass
from bs4 import BeautifulSoup

from app.models.schemas import TemplateVariable, VariableSource


VARIABLE_CLASSES = {
    "coverpage_link": VariableSource.COVERPAGE,
    "keyterms_link": VariableSource.KEYTERMS,
    "orderform_link": VariableSource.ORDERFORM,
    "businessterms_link": VariableSource.BUSINESSTERMS,
    "sow_link": VariableSource.SOW,
}


@dataclass
class ParsedTemplate:
    filename: str
    title: str
    raw_content: str
    variables: list[TemplateVariable]


def _extract_span_variables(content: str) -> dict[str, TemplateVariable]:
    """Extract variables from span elements."""
    variables = {}
    soup = BeautifulSoup(content, "html.parser")

    for span in soup.find_all("span"):
        class_attr = span.get("class")
        if not class_attr:
            continue

        class_str = " ".join(class_attr) if isinstance(class_attr, list) else class_attr

        for var_class, var_source in VARIABLE_CLASSES.items():
            if var_class in class_str:
                text = span.get_text(strip=True)
                if not text:
                    continue

                if text in variables:
                    variables[text].occurrences += 1
                else:
                    variables[text] = TemplateVariable(
                        name=text,
                        source=var_source,
                        occurrences=1,
                    )
                break

    return variables


def _extract_bracket_variables(content: str) -> dict[str, TemplateVariable]:
    """Extract variables from bracket placeholders like [Fill in state]."""
    variables = {}

    # Match [something] but exclude checkboxes [x] and [ ]
    pattern = r"\[([^\[\]]+)\]"
    matches = re.findall(pattern, content)

    for match in matches:
        text = match.strip()
        # Skip checkbox patterns
        if re.match(r"^\s*[xX]?\s*$", text):
            continue
        # Skip whitespace-only
        if not text:
            continue

        if text in variables:
            variables[text].occurrences += 1
        else:
            variables[text] = TemplateVariable(
                name=text,
                source=VariableSource.BRACKET,
                occurrences=1,
            )

    return variables


def parse_template(filename: str, content: str, title: str) -> ParsedTemplate:
    """Parse a template file and extract variables."""
    # Extract both span-based and bracket-based variables
    span_vars = _extract_span_variables(content)
    bracket_vars = _extract_bracket_variables(content)

    # Merge, preferring span variables if both exist
    all_vars = {**bracket_vars, **span_vars}

    variables = sorted(all_vars.values(), key=lambda v: v.name)

    return ParsedTemplate(
        filename=filename,
        title=title,
        raw_content=content,
        variables=variables,
    )
