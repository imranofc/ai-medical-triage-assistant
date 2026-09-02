from django.conf import settings
from django.contrib.gis import serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q
from .serializers import UpdateProfileSerializer
import time

from rest_framework.decorators import (
    authentication_classes,
    permission_classes,
    api_view
)

from .models import (
    Consultation,
    PatientDetail,
    Analysis
)

from .serializers import (
    RegisterSerializer,
    ConsultationSerializer,
    PatientDetailSerializer,
    AnalysisSerializer
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
    time.sleep(3)
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
    time.sleep(10)
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

        return Response(
            serializer.data,
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