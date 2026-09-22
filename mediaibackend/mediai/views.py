from django.contrib.gis import serializers
from django.utils.encoding import force_bytes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q
from .serializers import UpdateProfileSerializer
from io import BytesIO
from reportlab.pdfgen import canvas
from django.http import FileResponse
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator


from rest_framework.decorators import (
    authentication_classes,
    permission_classes,
    api_view
)

from .models import (
    Consultation,
    PatientDetail,
    Analysis,
    User,
)

from .serializers import (
    RegisterSerializer,
    ConsultationSerializer,
    PatientDetailSerializer,
    AnalysisSerializer,
    FavouriteSerializer,
    ForgotPasswordSerializer,
    ResetPasswordSerializer,
)

from .ai.service import generate_analysis


class RegisterView(APIView):

    def post(self, request):
        serializer = RegisterSerializer(
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                {
                    "message": "User created successfully",
                    "status": True
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def check_login(request):
    return Response({
        "is_authenticated": True,
        "name" : request.user.first_name.split()[0].title(),
        "fullname" : request.user.first_name,
        "email" : request.user.email,
    })

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    refresh_token = request.data.get("refresh")

    if not refresh_token:
        return Response(
            {"error": "Refresh token is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        token = RefreshToken(refresh_token)
        token.blacklist()

        return Response(
            {"message": "Logged out successfully"},
            status=status.HTTP_205_RESET_CONTENT
        )

    except Exception:
        return Response(
            {"error": "Invalid refresh token"},
            status=status.HTTP_400_BAD_REQUEST
        )


class ConsultationView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        consultation_id = request.query_params.get("id")

        if not consultation_id:
            return Response(
                {
                    "detail": "Consultation ID is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        consultation = Consultation.objects.filter(
            id=consultation_id,
            user=request.user
        ).first()

        if consultation is None:
            return Response(
                {
                    "detail": "Consultation not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        analysis = Analysis.objects.filter(consultation=consultation).last()

        if analysis is not None:
            return Response(status=status.HTTP_208_ALREADY_REPORTED)

        return Response(
            {
                "id": consultation.id,
                "symptoms": list(
                    consultation.symptoms.values_list(
                        "symptom",
                        flat=True
                    )
                ),
                "duration": consultation.duration,
                "severity": consultation.severity,
                "description": consultation.description,
            },
            status=status.HTTP_200_OK
        )

    def post(self, request):
        consultation_id = request.query_params.get("id")

        serializer = ConsultationSerializer(
            data=request.data,
            context={
                "request": request,
                "consultation_id": consultation_id
            }
        )

        if serializer.is_valid():
            consultation = serializer.save(
                user=request.user
            )

            return Response(
                {
                    "id": consultation.id
                },
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def new_consultation(request):

    consultation_id = request.query_params.get("id")

    if not consultation_id:
        return Response(
            {
                "error": "Consultation ID is required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    consultation = Consultation.objects.filter(
        id=consultation_id
    ).first()

    if consultation is None:
        return Response(
            {
                "detail": "Consultation not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    if consultation.user != request.user:
        return Response(
            {
                "detail": (
                    "You do not have access "
                    "to this consultation."
                )
            },
            status=status.HTTP_403_FORBIDDEN
        )
    analysis = Analysis.objects.filter(consultation=consultation).last()

    if analysis is not None:
        return Response(status=status.HTTP_208_ALREADY_REPORTED)

    patient_detail = PatientDetail.objects.filter(
        consultation=consultation
    ).last()

    if patient_detail is None:
        return Response(
            {},
            status=status.HTTP_200_OK
        )

    return Response(
        {
            "age": patient_detail.age,
            "gender": patient_detail.gender,
            "height": str(patient_detail.height),
            "weight": str(patient_detail.weight),
            "medical_conditions": (
                patient_detail.medical_conditions
            ),
            "smoke": patient_detail.smoke,
            "drink_alcohol": (
                patient_detail.drink_alcohol
            ),
            "diet": patient_detail.diet,
            "exercise": patient_detail.exercise,
            "allergies": patient_detail.allergies,
        },
        status=status.HTTP_200_OK
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def consultation_review(request):

    consultation_id = request.query_params.get("id")

    if not consultation_id:
        return Response(
            {
                "detail": "Consultation ID is required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    patient_detail = PatientDetail.objects.filter(
        id=consultation_id
    ).first()

    if patient_detail is None:
        return Response(
            {
                "detail": "Patient detail not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    if patient_detail.consultation.user != request.user:
        return Response(
            {
                "detail": (
                    "You do not have access "
                    "to this consultation."
                )
            },
            status=status.HTTP_403_FORBIDDEN
        )
    
    analysis = Analysis.objects.filter(consultation=patient_detail.consultation).last()

    if analysis is not None:
        return Response(status=status.HTTP_208_ALREADY_REPORTED)

    serializer = PatientDetailSerializer(
        patient_detail
    )

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )


class PetientDetailView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = PatientDetailSerializer(
            data=request.data
        )

        if serializer.is_valid():
            patient_detail = serializer.save()

            return Response(
                {
                    "id": patient_detail.id
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class AnalysisView(APIView):

    authentication_classes = [
        JWTAuthentication
    ]

    permission_classes = [
        IsAuthenticated
    ]

    def get_consultation(
        self,
        request,
        consultation_id
    ):
        return Consultation.objects.filter(
            id=consultation_id,
            user=request.user
        ).first()

    def get(self, request):

        consultation_id = request.query_params.get(
            "id"
        )

        if not consultation_id:
            return Response(
                {
                    "detail": (
                        "Consultation ID is required."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        consultation = self.get_consultation(
            request,
            consultation_id
        )

        if consultation is None:
            return Response(
                {
                    "detail": "Consultation not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        analysis = Analysis.objects.filter(
            consultation=consultation
        ).first()

        if analysis is None:
            return Response(
                {
                    "detail": "Analysis not found.",
                    "analysis_exists": False
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = AnalysisSerializer(
            analysis
        )
        
        data = serializer.data
        data["favourite"] = consultation.favourite

        return Response(
            data,
            status=status.HTTP_200_OK
        )

    def post(self, request):

        consultation_id = request.query_params.get(
            "id"
        )

        if not consultation_id:
            return Response(
                {
                    "detail": (
                        "Consultation ID is required."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        consultation = self.get_consultation(
            request,
            consultation_id
        )

        if consultation is None:
            return Response(
                {
                    "detail": "Consultation not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        patient_detail = PatientDetail.objects.filter(
            consultation=consultation
        ).last()

        if patient_detail is None:
            return Response(
                {
                    "detail": (
                        "Patient details are required "
                        "before analysis."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if not consultation.symptoms.exists():
            return Response(
                {
                    "detail": (
                        "At least one symptom is required "
                        "before analysis."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            analysis_data = generate_analysis(
                consultation,
                patient_detail
            )

            analysis, created = (
                Analysis.objects.update_or_create(
                    consultation=consultation,
                    defaults={
                        "response": analysis_data
                    }
                )
            )

            consultation.draft = False

            consultation.save(
                update_fields=["draft"]
            )

            serializer = AnalysisSerializer(
                analysis
            )

            return Response(
                {
                    "message": (
                        "AI analysis generated "
                        "successfully."
                    ),
                    "analysis_exists": True,
                    "created": created,
                    "data": serializer.data
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {
                    "detail": (
                        "Failed to generate "
                        "AI analysis."
                    ),
                    "error": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



# History

@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def history(request):
    filter_type = request.query_params.get("filter", "total")
    search = request.query_params.get("search", "").strip()

    consultations = Consultation.objects.filter(
        user=request.user
    ).prefetch_related("symptoms").order_by("-created_at")

    if filter_type == "completed":
        consultations = consultations.filter(draft=False)
    elif filter_type == "draft":
        consultations = consultations.filter(draft=True)
    elif filter_type == "favourite":
        consultations = consultations.filter(favourite=True)

    if search:
        consultations = consultations.filter(
            Q(description__icontains=search) |
            Q(duration__icontains=search) |
            Q(severity__icontains=search) |
            Q(symptoms__symptom__icontains=search)
        ).distinct()

    total = Consultation.objects.filter(
        user=request.user
    ).count()

    completed = Consultation.objects.filter(
        user=request.user,
        draft=False
    ).count()

    draft = Consultation.objects.filter(
        user=request.user,
        draft=True
    ).count()

    favourite = Consultation.objects.filter(
        user=request.user,
        favourite=True
    ).count()

    return Response({
        "stats": {
            "total": total,
            "completed": completed,
            "draft": draft,
            "favourite": favourite
        },
        "results": [
            {
                "id": consultation.id,
                "name": ", ".join(
                    consultation.symptoms.values_list(
                        "symptom",
                        flat=True
                    )[:2]
                ) or f"Consultation #{consultation.id}",
                "description": consultation.description[:80],
                "created_at": consultation.created_at,
                "status": (
                    "draft"
                    if consultation.draft
                    else "completed"
                ),
                "favourite": consultation.favourite
            }
            for consultation in consultations
        ]
    })

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def update_profile(request):

    serializer = UpdateProfileSerializer(
        request.user,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():
        serializer.save()

        return Response(
            {
                "message": "Profile updated successfully",
                "status": True
            },
            status=status.HTTP_200_OK
        )

    return Response(
        {
            "message": "Profile update failed",
            "errors": serializer.errors,
            "status": False
        },
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def download_report(request):

    consultation_id = request.data.get("id")

    if not consultation_id:
        return Response(
            {
                "error": "Consultation ID is required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    consultation = Consultation.objects.filter(
        id=consultation_id,
        user=request.user
    ).first()

    if consultation is None:
        return Response(
            {
                "error": "Consultation not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    patient_detail = PatientDetail.objects.filter(
        consultation=consultation
    ).last()

    if patient_detail is None:
        return Response(
            {
                "error": "Patient details not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    analysis = Analysis.objects.filter(
        consultation=consultation
    ).first()

    if analysis is None:
        return Response(
            {
                "error": "Analysis not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.enums import TA_CENTER
    from reportlab.platypus import (
        SimpleDocTemplate,
        Paragraph,
        Spacer,
        Table,
        TableStyle,
        PageBreak
    )
    from reportlab.lib import colors

    buffer = BytesIO()

    document = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "ReportTitle",
        parent=styles["Title"],
        alignment=TA_CENTER,
        fontSize=20,
        spaceAfter=20
    )

    heading_style = ParagraphStyle(
        "Heading",
        parent=styles["Heading2"],
        fontSize=14,
        spaceBefore=15,
        spaceAfter=8
    )

    subheading_style = ParagraphStyle(
        "SubHeading",
        parent=styles["Heading3"],
        fontSize=11,
        spaceBefore=8,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        "Body",
        parent=styles["BodyText"],
        fontSize=10,
        leading=14,
        spaceAfter=6
    )

    story = []

    story.append(
        Paragraph(
            "Medical Report",
            title_style
        )
    )

    story.append(
        Paragraph(
            f"<b>Consultation ID:</b> {consultation.id}",
            body_style
        )
    )

    story.append(
        Paragraph(
            f"<b>Date:</b> {consultation.created_at.strftime('%d-%m-%Y %H:%M')}",
            body_style
        )
    )

    story.append(
        Spacer(1, 10)
    )

    story.append(
        Paragraph(
            "Patient Details",
            heading_style
        )
    )

    patient_data = [
        ["Age", str(patient_detail.age)],
        ["Gender", str(patient_detail.gender)],
        ["Height", str(patient_detail.height)],
        ["Weight", str(patient_detail.weight)],
        [
            "Medical Conditions",
            str(patient_detail.medical_conditions or "None")
        ],
        ["Smoking", str(patient_detail.smoke)],
        [
            "Alcohol",
            str(patient_detail.drink_alcohol)
        ],
        ["Diet", str(patient_detail.diet)],
        ["Exercise", str(patient_detail.exercise)],
        [
            "Allergies",
            str(patient_detail.allergies or "None")
        ],
    ]

    patient_table = Table(
        patient_data,
        colWidths=[150, 350]
    )

    patient_table.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                ("FONTNAME", (1, 0), (1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )

    story.append(patient_table)

    story.append(
        Paragraph(
            "Consultation Details",
            heading_style
        )
    )

    symptoms = list(
        consultation.symptoms.values_list(
            "symptom",
            flat=True
        )
    )

    consultation_data = [
        [
            "Symptoms",
            ", ".join(symptoms) if symptoms else "None"
        ],
        [
            "Duration",
            str(consultation.duration)
        ],
        [
            "Severity",
            str(consultation.severity)
        ],
        [
            "Description",
            str(consultation.description)
        ],
    ]

    consultation_table = Table(
        consultation_data,
        colWidths=[150, 350]
    )

    consultation_table.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )

    story.append(consultation_table)

    response_data = analysis.response

    story.append(
        Paragraph(
            "AI Analysis",
            heading_style
        )
    )

    story.append(
        Paragraph(
            f"<b>Summary</b><br/>{response_data.get('summary', '')}",
            body_style
        )
    )

    triage = response_data.get("triage", {})

    story.append(
        Paragraph(
            "Triage",
            subheading_style
        )
    )

    story.append(
        Paragraph(
            f"<b>Level:</b> {triage.get('level', '')}",
            body_style
        )
    )

    story.append(
        Paragraph(
            f"<b>Title:</b> {triage.get('title', '')}",
            body_style
        )
    )

    story.append(
        Paragraph(
            f"<b>Description:</b> {triage.get('description', '')}",
            body_style
        )
    )

    story.append(
        Paragraph(
            f"<b>Reason:</b> {triage.get('reason', '')}",
            body_style
        )
    )

    possible_explanations = response_data.get(
        "possible_explanations",
        []
    )

    story.append(
        Paragraph(
            "Possible Explanations",
            heading_style
        )
    )

    for item in possible_explanations:

        story.append(
            Paragraph(
                f"<b>{item.get('name', '')}</b>",
                subheading_style
            )
        )

        story.append(
            Paragraph(
                f"<b>Likelihood:</b> {item.get('likelihood', '')}",
                body_style
            )
        )

        story.append(
            Paragraph(
                f"<b>Overview:</b> {item.get('overview', '')}",
                body_style
            )
        )

        why_it_may_fit = item.get(
            "why_it_may_fit",
            []
        )

        if why_it_may_fit:
            story.append(
                Paragraph(
                    "<b>Why it may fit:</b>",
                    body_style
                )
            )

            for point in why_it_may_fit:
                story.append(
                    Paragraph(
                        f"• {point}",
                        body_style
                    )
                )

        key_information = item.get(
            "key_information",
            []
        )

        if key_information:
            story.append(
                Paragraph(
                    "<b>Key Information:</b>",
                    body_style
                )
            )

            for point in key_information:
                story.append(
                    Paragraph(
                        f"• {point}",
                        body_style
                    )
                )

        common_symptoms = item.get(
            "common_symptoms",
            []
        )

        if common_symptoms:
            story.append(
                Paragraph(
                    "<b>Common Symptoms:</b>",
                    body_style
                )
            )

            for point in common_symptoms:
                story.append(
                    Paragraph(
                        f"• {point}",
                        body_style
                    )
                )

        details = item.get(
            "details",
            {}
        )

        if details:

            story.append(
                Paragraph(
                    "<b>Details</b>",
                    subheading_style
                )
            )

            story.append(
                Paragraph(
                    f"<b>What it is:</b> {details.get('what_it_is', '')}",
                    body_style
                )
            )

            story.append(
                Paragraph(
                    f"<b>Typical Course:</b> {details.get('typical_course', '')}",
                    body_style
                )
            )

            watch_for = details.get(
                "what_to_watch_for",
                []
            )

            if watch_for:
                story.append(
                    Paragraph(
                        "<b>What to Watch For:</b>",
                        body_style
                    )
                )

                for point in watch_for:
                    story.append(
                        Paragraph(
                            f"• {point}",
                            body_style
                        )
                    )

            story.append(
                Paragraph(
                    f"<b>When to Seek Professional Care:</b> "
                    f"{details.get('when_to_seek_professional_care', '')}",
                    body_style
                )

            )

            questions = details.get(
                "questions_to_discuss_with_doctor",
                []
            )

            if questions:
                story.append(
                    Paragraph(
                        "<b>Questions to Discuss With Doctor:</b>",
                        body_style
                    )
                )

                for question in questions:
                    story.append(
                        Paragraph(
                            f"• {question}",
                            body_style
                        )
                    )

    warning_signs = response_data.get(
        "warning_signs",
        {}
    )

    story.append(
        Paragraph(
            "Warning Signs",
            heading_style
        )
    )

    warning_items = warning_signs.get(
        "items",
        []
    )

    for item in warning_items:
        story.append(
            Paragraph(
                f"• {item}",
                body_style
            )
        )

    warning_details = warning_signs.get(
        "details",
        []
    )

    for item in warning_details:

        story.append(
            Paragraph(
                f"<b>{item.get('warning', '')}</b>",
                subheading_style
            )
        )

        story.append(
            Paragraph(
                f"<b>Why it matters:</b> "
                f"{item.get('why_it_matters', '')}",
                body_style
            )
        )

        story.append(
            Paragraph(
                f"<b>Recommended Action:</b> "
                f"{item.get('recommended_action', '')}",
                body_style
            )
        )

    self_care = response_data.get(
        "self_care",
        {}
    )

    story.append(
        Paragraph(
            "Self-Care Suggestions",
            heading_style
        )
    )

    self_care_items = self_care.get(
        "items",
        []
    )

    for item in self_care_items:
        story.append(
            Paragraph(
                f"• {item}",
                body_style
            )
        )

    self_care_details = self_care.get(
        "details",
        []
    )

    for item in self_care_details:

        story.append(
            Paragraph(
                f"<b>{item.get('recommendation', '')}</b>",
                subheading_style
            )
        )

        story.append(
            Paragraph(
                f"{item.get('explanation', '')}",
                body_style
            )
        )

    story.append(
        Paragraph(
            "Important",
            heading_style
        )
    )

    story.append(
        Paragraph(
            response_data.get(
                "important",
                ""
            ),
            body_style
        )
    )

    story.append(
        Paragraph(
            "Disclaimer",
            heading_style
        )
    )

    story.append(
        Paragraph(
            response_data.get(
                "disclaimer",
                ""
            ),
            body_style
        )
    )

    document.build(story)

    buffer.seek(0)

    return FileResponse(
        buffer,
        as_attachment=True,
        filename=f"medical_report_{consultation.id}.pdf",
        content_type="application/pdf"
    )

@api_view(["PATCH"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_favourite(request):

    consultation_id = request.data.get("id")

    consultation = Consultation.objects.filter(
        id=consultation_id,
        user=request.user
    ).first()

    if consultation is None:
        return Response(
            {"error": "Consultation not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = FavouriteSerializer(
        consultation,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():
        serializer.save()

        return Response(
            {
                "favourite": serializer.instance.favourite
            },
            status=status.HTTP_200_OK
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(["POST"])
def forgot_password(request):
    serializer = ForgotPasswordSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    email = serializer.validated_data["email"]

    user = User.objects.filter(
        email__iexact=email,
        is_active=True
    ).first()

    if user:
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        # Development URL
        reset_url = (
            f"http://localhost:3000/reset-password/{uid}/{token}/"
        )

        # Production URL
        # reset_url = (
        #     f"https://mediai.imranofc.com/reset-password/{uid}/{token}/"
        # )

        send_mail(
            "MediAI - Reset Your Password",
            f"Click the link below to reset your password:\n\n"
            f"{reset_url}\n\n"
            f"This link will expire when your password is changed.",
            None,
            [user.email],
            fail_silently=False,
        )

    return Response(
        {
            "message": (
                "If an account exists with this email, "
                "a password reset link has been sent."
            )
        },
        status=status.HTTP_200_OK
    )

@api_view(["POST"])
def reset_password(request, uidb64, token):

    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)

    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is None or not default_token_generator.check_token(user, token):
        return Response(
            {"error": "Invalid or expired reset link."},
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = ResetPasswordSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    password = serializer.validated_data["new_password"]

    user.set_password(password)
    user.save()

    return Response(
        {"message": "Password reset successfully."},
        status=status.HTTP_200_OK
    )