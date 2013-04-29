import json
from rest_framework import serializers
from locations import models

class LocationSerializer (serializers.ModelSerializer):
    
    class Meta:
        model = models.Location