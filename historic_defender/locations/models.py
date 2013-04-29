from django.db import models

# Create your models here.
class Location(models.Model):
	parcel = models.IntegerField(default=0)
	address = models.CharField(max_length=50)
	latitude = models.FloatField(default=0)
	longitude = models.FloatField(default=0)