from django.db import models

# Create your models here.
class Location(models.Model):
	address = models.CharField(max_length=50)
	latitude = models.FloatField(default=0)
	longitude = models.FloatField(default=0)
	
class Parcel(models.Model):	
	location = models.ForeignKey('locations.location')
	number = models.IntegerField(default=0)	