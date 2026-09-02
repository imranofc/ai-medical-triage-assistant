#for update profile serializer please check the update_profile view in views.py file

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Consultation,
    Symptoms,
    PatientDetail,
    Analysis
)


class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'username',
            'first_name',
            'email',
            'password',
            'password2'
        ]

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError(
                "Password must match"
            )

        return data

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
        )

        user.set_password(validated_data['password'])
        user.save()

        return user


class ConsultationSerializer(serializers.ModelSerializer):
    symptoms = serializers.ListField(
        child=serializers.CharField(max_length=50),
        write_only=True
    )

    class Meta:
        model = Consultation
        fields = [
            'user',
            'symptoms',
            'severity',
            'description',
            'duration'
        ]
        read_only_fields = ['user']

    def create(self, validated_data):
        symptoms_data = validated_data.pop('symptoms')

        consultation_id = self.context.get(
            'consultation_id'
        )

        symptoms = []

        for symptom_name in symptoms_data:
            symptom, created = Symptoms.objects.get_or_create(
                symptom=symptom_name
            )
            symptoms.append(symptom)

        consultation = Consultation.objects.filter(
            id=consultation_id,
            user=validated_data['user']
        ).first()

        if consultation:
            for field, value in validated_data.items():
                setattr(consultation, field, value)

            consultation.save()
            consultation.symptoms.set(symptoms)

            return consultation

        consultation = Consultation.objects.create(
            **validated_data
        )

        consultation.symptoms.set(symptoms)

        return consultation


class PatientDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientDetail
        fields = [
            'consultation',
            'age',
            'gender',
            'height',
            'weight',
            'medical_conditions',
            'smoke',
            'drink_alcohol',
            'diet',
            'exercise',
            'allergies'
        ]

    def create(self, validated_data):
        consultation = validated_data.get(
            "consultation"
        )

        detail = PatientDetail.objects.filter(
            consultation=consultation
        ).first()

        if detail:
            for field, value in validated_data.items():
                setattr(detail, field, value)

            detail.save()

            return detail

        return PatientDetail.objects.create(
            **validated_data
        )


class AnalysisSerializer(serializers.ModelSerializer):
    consultation = serializers.PrimaryKeyRelatedField(
        read_only=True
    )

    class Meta:
        model = Analysis
        fields = [
            'id',
            'consultation',
            'response',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'id',
            'consultation',
            'response',
            'created_at',
            'updated_at'
        ]


class UpdateProfileSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=False
    )

    new_password = serializers.CharField(
        write_only=True,
        required=False
    )

    confirm_password = serializers.CharField(
        write_only=True,
        required=False
    )

    class Meta:
        model = User
        fields = [
            'first_name',
            'email',
            'password',
            'new_password',
            'confirm_password',
        ]

    def update(self, instance, validated_data):

        if 'new_password' in validated_data:
            if 'password' not in validated_data:
                raise serializers.ValidationError(
                    "Current password is required"
                )

            if instance.check_password(validated_data['password']):
                if validated_data['new_password'] == validated_data['confirm_password']:
                    instance.set_password(
                        validated_data['new_password']
                    )

                    validated_data.pop('password')
                    validated_data.pop('new_password')
                    validated_data.pop('confirm_password')

                else:
                    raise serializers.ValidationError(
                        "New password and confirm password must match"
                    )
            else:
                raise serializers.ValidationError(
                    "Old password is wrong please enter correct password"
                )

        else:
            validated_data.pop('password', None)
            validated_data.pop('confirm_password', None)

        for field, value in validated_data.items():
            setattr(instance, field, value)

        instance.save()
        return instance