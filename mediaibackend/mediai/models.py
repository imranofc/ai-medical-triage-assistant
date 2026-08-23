from django.db import models
from django.contrib.auth.models import User


class Symptoms(models.Model):
    symptom = models.CharField(max_length=50)

    def __str__(self):
        return self.symptom


class Consultation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    symptoms = models.ManyToManyField(Symptoms)
    duration = models.CharField(max_length=100)
    severity = models.CharField(max_length=50)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    draft = models.BooleanField(default=True)
    favourite = models.BooleanField(default=False)

    def __str__(self):
        return f"Consultation #{self.id}"


class PatientDetail(models.Model):
    consultation = models.ForeignKey(
        Consultation,
        on_delete=models.CASCADE
    )
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=20)
    height = models.DecimalField(max_digits=5, decimal_places=2)
    weight = models.DecimalField(max_digits=5, decimal_places=2)
    medical_conditions = models.TextField(blank=True)
    smoke = models.CharField(max_length=20)
    drink_alcohol = models.CharField(max_length=20)
    diet = models.CharField(max_length=50)
    exercise = models.CharField(max_length=50)
    allergies = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Patient - {self.age} - {self.gender}"


class Analysis(models.Model):
    consultation = models.OneToOneField(
        Consultation,
        on_delete=models.CASCADE,
        related_name="analysis"
    )
    response = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Analysis - Consultation #{self.consultation.id}"