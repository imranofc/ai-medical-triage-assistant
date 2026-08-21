import json

from django.conf import settings
from google import genai
from google.genai import types

from .prompt import build_analysis_prompt
from .schema import ANALYSIS_SCHEMA
from .validator import validate_analysis_response

MODEL_NAME = "gemini-3.6-flash"

def generate_analysis(consultation, patient_detail):
    api_key = getattr(
        settings,
        "GEMINI_API_KEY",
        None
    )

    if not api_key:
        raise ValueError(
            "GEMINI_API_KEY is not configured in Django settings."
        )

    client = genai.Client(
        api_key=api_key
    )

    prompt = build_analysis_prompt(
        consultation,
        patient_detail
    )

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=ANALYSIS_SCHEMA,
            thinking_config=types.ThinkingConfig(
                thinking_level="minimal"
            ),
        ),
    )

    raw_text = getattr(
        response,
        "text",
        None
    )

    if not raw_text:
        raise ValueError(
            "Gemini returned an empty response."
        )

    try:
        analysis_data = json.loads(
            raw_text
        )
    except json.JSONDecodeError as exc:
        raise ValueError(
            "Gemini returned invalid JSON."
        ) from exc

    validate_analysis_response(
        analysis_data
    )

    return analysis_data