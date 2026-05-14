import re
from pathlib import Path
from typing import Tuple
import markdown
from bs4 import BeautifulSoup


def _normalize_key(text: str) -> str:
    """Normalize span text to match form field keys (spaces → underscores)."""
    # Strip possessives for lookup
    text = text.rstrip("'s").rstrip("'")
    return text


def _restore_possessive(original: str, normalized: str, value: str) -> str:
    """Restore possessive suffix if original had one."""
    if original.endswith("'s"):
        return f"{value}'s"
    elif original.endswith("'"):
        return f"{value}'"
    return value


def render_template(raw_content: str, values: dict[str, str]) -> Tuple[str, list, list]:
    """
    Render template by substituting variables.

    Returns:
        (html_string, variables_used, variables_missing)
    """
    # Handle bracket placeholders first (cover page style)
    rendered = raw_content
    bracket_pattern = r"\[([^\[\]]+)\]"
    bracket_matches = re.findall(bracket_pattern, rendered)

    used_vars = set()
    missing_vars = set()

    for match in bracket_matches:
        text = match.strip()
        if re.match(r"^\s*[xX]?\s*$", text) or not text:
            continue

        normalized = _normalize_key(text)
        if normalized in values:
            value = values[normalized]
            rendered = rendered.replace(f"[{match}]", value)
            used_vars.add(normalized)
        else:
            missing_vars.add(normalized)

    # Convert markdown to HTML
    html = markdown.markdown(rendered, extensions=["tables", "extra"])

    # Parse and substitute span variables
    soup = BeautifulSoup(html, "html.parser")

    for span in soup.find_all("span"):
        class_attr = span.get("class")
        if not class_attr:
            continue

        class_str = " ".join(class_attr) if isinstance(class_attr, list) else class_attr

        # Check if it's a variable span
        if any(
            var_class in class_str
            for var_class in ["coverpage_link", "keyterms_link", "orderform_link", "businessterms_link", "sow_link"]
        ):
            original_text = span.get_text(strip=True)
            if not original_text:
                continue

            normalized = _normalize_key(original_text)

            if normalized in values:
                value = values[normalized]
                restored_value = _restore_possessive(original_text, normalized, value)
                span.string = restored_value
                used_vars.add(normalized)
            else:
                missing_vars.add(normalized)

    # Wrap in full HTML document with styling
    static_dir = Path(__file__).parent.parent / "static"
    css_path = static_dir / "legal.css"

    css_content = ""
    if css_path.exists():
        with open(css_path) as f:
            css_content = f.read()

    full_html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
{css_content}
    </style>
</head>
<body>
{str(soup)}
</body>
</html>"""

    used_list = sorted(list(used_vars))
    missing_list = sorted(list(missing_vars))

    return full_html, used_list, missing_list
