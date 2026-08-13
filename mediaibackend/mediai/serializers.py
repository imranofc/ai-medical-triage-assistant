from rest_framework import serializers 
from django.contrib.auth.models import User 
 
class RegisterSerializer(serializers.ModelSerializer): 
    password2 = serializers.CharField(write_only = True) 
 
    class Meta: 
        model = User 
        fields = ['username', 'first_name', 'email', 'password', 'password2'] 

    def validate(self, data): 
        if data['password'] != data['password2']: 
            raise serializers.ValidationError("Password must match") 
         
        return data 
 
    def create(self, validated_data): 
        user = User.objects.create( 
            username = validated_data['username'],
            email = validated_data['email'],
            first_name = validated_data['first_name'],
        )

        user.set_password(validated_data['password'])
        user.save()
 
        return user