import os
from typing import Optional
from litellm import completion
from pydantic import BaseModel

MODEL = "openrouter/openai/gpt-oss-120b"
EXTRA_BODY = {"provider": {"order": ["cerebras"]}}

NDA_FIELDS = {
    "Purpose": "The purpose for which confidential information may be used",
    "Effective Date": "The date the NDA takes effect",
    "MNDA Term": "How long the NDA lasts (e.g., '1 year(s)')",
    "Term of Confidentiality": "How long confidential information must be kept secret (e.g., '1 year(s)')",
    "Governing Law": "The US state whose laws govern the agreement (e.g., 'California')",
    "Jurisdiction": "Courts that handle disputes (e.g., 'courts located in San Francisco, CA')",
}

REQUIRED_FIELDS = list(NDA_FIELDS.keys())

SYSTEM_PROMPT = """You are a legal document assistant helping users fill out a Mutual Non-Disclosure Agreement (Mutual NDA).

Gather the following 6 required fields through friendly, conversational chat:
1. Purpose - The purpose for which confidential information may be used
2. Effective Date - The date the NDA takes effect
3. MNDA Term - How long the NDA lasts (e.g., "1 year(s)")
4. Term of Confidentiality - How long confidential information must be kept secret (e.g., "1 year(s)")
5. Governing Law - The US state whose laws govern the agreement
6. Jurisdiction - The courts with jurisdiction (e.g., "courts located in San Francisco, CA")

Guidelines:
- Be friendly and concise
- Ask 1-2 questions at a time, never all at once
- When a user provides a piece of information, acknowledge it naturally and ask for the next missing field
- Use natural defaults when reasonable (e.g., if they say "1 year" for the NDA term, format it as "1 year(s)")
- When all 6 fields are collected, briefly confirm them and tell the user they can download the document

CRITICAL JSON output rules:
- extracted_values must contain ALL field values gathered so far (not just new ones)
- Use EXACTLY these key names: "Purpose", "Effective Date", "MNDA Term", "Term of Confidentiality", "Governing Law", "Jurisdiction"
- Set is_complete to true ONLY when all 6 fields have non-empty values
"""


class ChatResponse(BaseModel):
    reply: str
    extracted_values: dict[str, str]
    is_complete: bool


def _call_ai(messages: list[dict]) -> ChatResponse:
    api_key = os.getenv("OPENROUTER_API_KEY")
    response = completion(
        model=MODEL,
        messages=messages,
        response_format=ChatResponse,
        reasoning_effort="low",
        extra_body=EXTRA_BODY,
        api_key=api_key,
    )
    return ChatResponse.model_validate_json(response.choices[0].message.content)


def get_greeting() -> str:
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": "Hi, I need to create a Mutual NDA."},
    ]
    result = _call_ai(messages)
    return result.reply


def process_message(
    messages: list[dict],
    current_values: Optional[dict[str, str]] = None,
) -> ChatResponse:
    system_content = SYSTEM_PROMPT
    if current_values is not None:
        gathered = [f"  - {k}: {v}" for k, v in current_values.items() if v]
        if gathered:
            system_content += "\n\nFields already gathered:\n" + "\n".join(gathered)

    full_messages = [{"role": "system", "content": system_content}] + messages
    result = _call_ai(full_messages)

    # Merge with existing values so nothing is dropped
    if current_values is not None:
        merged = {k: v for k, v in current_values.items() if v}
        merged.update({k: v for k, v in result.extracted_values.items() if v})
        result.extracted_values = merged

    # Always recalculate completion from the full known values
    result.is_complete = all(result.extracted_values.get(f) for f in REQUIRED_FIELDS)

    return result
