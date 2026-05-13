import json
from pathlib import Path
from typing import Optional

_catalog_cache = None


def get_catalog_path() -> Path:
    """Get the path to catalog.json relative to project root."""
    backend_dir = Path(__file__).parent.parent.parent
    return backend_dir.parent / "catalog.json"


def get_templates_dir() -> Path:
    """Get the path to templates directory."""
    backend_dir = Path(__file__).parent.parent.parent
    return backend_dir.parent / "templates"


def load_catalog():
    """Load and cache catalog.json."""
    global _catalog_cache
    if _catalog_cache is not None:
        return _catalog_cache

    catalog_path = get_catalog_path()
    with open(catalog_path) as f:
        _catalog_cache = json.load(f)
    return _catalog_cache


def get_catalog():
    """Get cached catalog."""
    if _catalog_cache is None:
        load_catalog()
    return _catalog_cache


def find_by_filename(filename: str):
    """Find a template entry by filename."""
    catalog = get_catalog()
    for item in catalog:
        if item.get("filename") == filename:
            return item
    return None


def get_template_path(filename: str) -> Optional[Path]:
    """Get the full path to a template file, validating it exists."""
    if not find_by_filename(filename):
        return None

    template_path = get_templates_dir() / filename
    if not template_path.exists():
        return None

    return template_path
