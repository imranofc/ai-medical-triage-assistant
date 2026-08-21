ANALYSIS_SCHEMA = {
    "type": "object",
    "properties": {
        "summary": {
            "type": "string",
            "description": (
                "A concise educational summary of the "
                "user's reported symptoms."
            )
        },
        "triage": {
            "type": "object",
            "properties": {
                "level": {
                    "type": "string",
                    "enum": [
                        "informational",
                        "routine_consultation",
                        "prompt_attention",
                        "emergency_warning"
                    ]
                },
                "title": {
                    "type": "string"
                },
                "description": {
                    "type": "string"
                },
                "reason": {
                    "type": "string"
                }
            },
            "required": [
                "level",
                "title",
                "description",
                "reason"
            ]
        },
        "possible_explanations": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    },
                    "likelihood": {
                        "type": "string",
                        "enum": [
                            "more_consistent",
                            "possible",
                            "less_likely"
                        ]
                    },
                    "overview": {
                        "type": "string"
                    },
                    "why_it_may_fit": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "key_information": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "common_symptoms": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "details": {
                        "type": "object",
                        "properties": {
                            "what_it_is": {
                                "type": "string"
                            },
                            "typical_course": {
                                "type": "string"
                            },
                            "what_to_watch_for": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            },
                            "when_to_seek_professional_care": {
                                "type": "string"
                            },
                            "questions_to_discuss_with_doctor": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            }
                        },
                        "required": [
                            "what_it_is",
                            "typical_course",
                            "what_to_watch_for",
                            "when_to_seek_professional_care",
                            "questions_to_discuss_with_doctor"
                        ]
                    }
                },
                "required": [
                    "name",
                    "likelihood",
                    "overview",
                    "why_it_may_fit",
                    "key_information",
                    "common_symptoms",
                    "details"
                ]
            }
        },
        "warning_signs": {
            "type": "object",
            "properties": {
                "items": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "details": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "warning": {
                                "type": "string"
                            },
                            "why_it_matters": {
                                "type": "string"
                            },
                            "recommended_action": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "warning",
                            "why_it_matters",
                            "recommended_action"
                        ]
                    }
                }
            },
            "required": [
                "items",
                "details"
            ]
        },
        "self_care": {
            "type": "object",
            "properties": {
                "items": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "details": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "recommendation": {
                                "type": "string"
                            },
                            "explanation": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "recommendation",
                            "explanation"
                        ]
                    }
                }
            },
            "required": [
                "items",
                "details"
            ]
        },
        "important": {
            "type": "string"
        },
        "disclaimer": {
            "type": "string"
        }
    },
    "required": [
        "summary",
        "triage",
        "possible_explanations",
        "warning_signs",
        "self_care",
        "important",
        "disclaimer"
    ]
}