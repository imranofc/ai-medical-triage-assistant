from typing import Any


REQUIRED_TOP_LEVEL_FIELDS = {
    "summary",
    "triage",
    "possible_explanations",
    "warning_signs",
    "self_care",
    "important",
    "disclaimer",
}

REQUIRED_TRIAGE_FIELDS = {
    "level",
    "title",
    "description",
    "reason",
}

VALID_TRIAGE_LEVELS = {
    "informational",
    "routine_consultation",
    "prompt_attention",
    "emergency_warning",
}


def validate_analysis_response(data: Any) -> None:
    if not isinstance(data, dict):
        raise ValueError(
            "AI response must be a JSON object."
        )

    missing_fields = (
        REQUIRED_TOP_LEVEL_FIELDS - data.keys()
    )

    if missing_fields:
        raise ValueError(
            "AI response is missing required fields: "
            + ", ".join(sorted(missing_fields))
        )

    if not isinstance(data["summary"], str):
        raise ValueError(
            "'summary' must be a string."
        )

    validate_triage(data["triage"])
    validate_possible_explanations(
        data["possible_explanations"]
    )
    validate_warning_signs(
        data["warning_signs"]
    )
    validate_self_care(
        data["self_care"]
    )

    if not isinstance(data["important"], str):
        raise ValueError(
            "'important' must be a string."
        )

    if not isinstance(data["disclaimer"], str):
        raise ValueError(
            "'disclaimer' must be a string."
        )


def validate_triage(triage: Any) -> None:
    if not isinstance(triage, dict):
        raise ValueError(
            "'triage' must be an object."
        )

    missing_fields = (
        REQUIRED_TRIAGE_FIELDS - triage.keys()
    )

    if missing_fields:
        raise ValueError(
            "Triage is missing required fields: "
            + ", ".join(sorted(missing_fields))
        )

    if triage["level"] not in VALID_TRIAGE_LEVELS:
        raise ValueError(
            "Invalid triage level: "
            f"{triage['level']}"
        )

    for field in (
        "title",
        "description",
        "reason",
    ):
        if not isinstance(triage[field], str):
            raise ValueError(
                f"'triage.{field}' must be a string."
            )


def validate_possible_explanations(
    explanations: Any,
) -> None:
    if not isinstance(explanations, list):
        raise ValueError(
            "'possible_explanations' must be an array."
        )

    for index, explanation in enumerate(
        explanations
    ):
        if not isinstance(explanation, dict):
            raise ValueError(
                f"Possible explanation {index + 1} "
                "must be an object."
            )

        required_fields = {
            "name",
            "likelihood",
            "overview",
            "why_it_may_fit",
            "key_information",
            "common_symptoms",
            "details",
        }

        missing_fields = (
            required_fields - explanation.keys()
        )

        if missing_fields:
            raise ValueError(
                f"Possible explanation {index + 1} "
                "is missing: "
                + ", ".join(
                    sorted(missing_fields)
                )
            )

        if not isinstance(
            explanation["name"],
            str,
        ):
            raise ValueError(
                f"Possible explanation {index + 1} "
                "'name' must be a string."
            )

        if explanation["likelihood"] not in {
            "more_consistent",
            "possible",
            "less_likely",
        }:
            raise ValueError(
                f"Invalid likelihood in possible "
                f"explanation {index + 1}."
            )

        for field in (
            "overview",
        ):
            if not isinstance(
                explanation[field],
                str,
            ):
                raise ValueError(
                    f"Possible explanation {index + 1} "
                    f"'{field}' must be a string."
                )

        for field in (
            "why_it_may_fit",
            "key_information",
            "common_symptoms",
        ):
            if not isinstance(
                explanation[field],
                list,
            ):
                raise ValueError(
                    f"Possible explanation {index + 1} "
                    f"'{field}' must be an array."
                )

        validate_explanation_details(
            explanation["details"],
            index,
        )


def validate_explanation_details(
    details: Any,
    explanation_index: int,
) -> None:
    if not isinstance(details, dict):
        raise ValueError(
            f"Details for possible explanation "
            f"{explanation_index + 1} must be an object."
        )

    required_fields = {
        "what_it_is",
        "typical_course",
        "what_to_watch_for",
        "when_to_seek_professional_care",
        "questions_to_discuss_with_doctor",
    }

    missing_fields = (
        required_fields - details.keys()
    )

    if missing_fields:
        raise ValueError(
            f"Details for possible explanation "
            f"{explanation_index + 1} are missing: "
            + ", ".join(
                sorted(missing_fields)
            )
        )

    if not isinstance(
        details["what_it_is"],
        str,
    ):
        raise ValueError(
            "'what_it_is' must be a string."
        )

    if not isinstance(
        details["typical_course"],
        str,
    ):
        raise ValueError(
            "'typical_course' must be a string."
        )

    if not isinstance(
        details["when_to_seek_professional_care"],
        str,
    ):
        raise ValueError(
            "'when_to_seek_professional_care' "
            "must be a string."
        )

    if not isinstance(
        details["what_to_watch_for"],
        list,
    ):
        raise ValueError(
            "'what_to_watch_for' must be an array."
        )

    if not isinstance(
        details["questions_to_discuss_with_doctor"],
        list,
    ):
        raise ValueError(
            "'questions_to_discuss_with_doctor' "
            "must be an array."
        )


def validate_warning_signs(
    warning_signs: Any,
) -> None:
    if not isinstance(
        warning_signs,
        dict,
    ):
        raise ValueError(
            "'warning_signs' must be an object."
        )

    if not isinstance(
        warning_signs.get("items"),
        list,
    ):
        raise ValueError(
            "'warning_signs.items' must be an array."
        )

    if not isinstance(
        warning_signs.get("details"),
        list,
    ):
        raise ValueError(
            "'warning_signs.details' must be an array."
        )

    for index, detail in enumerate(
        warning_signs["details"]
    ):
        if not isinstance(detail, dict):
            raise ValueError(
                f"Warning sign detail {index + 1} "
                "must be an object."
            )

        required_fields = {
            "warning",
            "why_it_matters",
            "recommended_action",
        }

        missing_fields = (
            required_fields - detail.keys()
        )

        if missing_fields:
            raise ValueError(
                f"Warning sign detail {index + 1} "
                "is missing: "
                + ", ".join(
                    sorted(missing_fields)
                )
            )


def validate_self_care(
    self_care: Any,
) -> None:
    if not isinstance(
        self_care,
        dict,
    ):
        raise ValueError(
            "'self_care' must be an object."
        )

    if not isinstance(
        self_care.get("items"),
        list,
    ):
        raise ValueError(
            "'self_care.items' must be an array."
        )

    if not isinstance(
        self_care.get("details"),
        list,
    ):
        raise ValueError(
            "'self_care.details' must be an array."
        )

    for index, detail in enumerate(
        self_care["details"]
    ):
        if not isinstance(detail, dict):
            raise ValueError(
                f"Self-care detail {index + 1} "
                "must be an object."
            )

        required_fields = {
            "recommendation",
            "explanation",
        }

        missing_fields = (
            required_fields - detail.keys()
        )

        if missing_fields:
            raise ValueError(
                f"Self-care detail {index + 1} "
                "is missing: "
                + ", ".join(
                    sorted(missing_fields)
                )
            )