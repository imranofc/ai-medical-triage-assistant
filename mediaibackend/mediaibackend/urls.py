from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from mediai.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', TokenObtainPairView.as_view(), name="login"),
    path('api/register/', RegisterView.as_view(), name="register"),
    path('api/consultation/', ConsultationView.as_view(), name="consultation"),
    path('api/new-consultation/', new_consultation, name="new_consultation"),
    path('api/petientdetail/', PetientDetailView.as_view(), name="patientdetail"),
    path('api/consultation-review/', consultation_review, name="consultation_review"),
    path('api/analysis/', AnalysisView.as_view(), name="analysis"),
    path('api/check-login/', check_login, name="check_login"),
    path("api/logout/", logout, name="logout"),
]
