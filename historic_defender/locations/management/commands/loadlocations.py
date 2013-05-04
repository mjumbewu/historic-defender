from django.core.management.base import BaseCommand, CommandError
from locations.models import Location
from locations.models import Parcel

import csv
import os.path
import sys

class Command(BaseCommand):
    
    def handle(self, *args, **options):
        file = os.path.abspath( args[0])
        headers         = None        
        address_field   = None     
        parcel_field    = None
        lat_field       = None
        long_field      = None   
        previous_loc    = Location()        
        
        with open(file) as f:
            reader = csv.reader(f)
    
            for row in reader:
                if headers is None:
                    headers = row
                    address_field   = headers.index('address')
                    parcel_field    = headers.index('parcel')
                    lat_field       = headers.index('latitude')
                    long_field      = headers.index('longitude')                    
                    continue
    
                try:
                    if(previous_loc.address == row[address_field]):
                        new_parcel = Parcel( location = previous_loc, number = int( row[parcel_field].translate( None, "'")))
                        new_parcel.save()
                    else:
                        previous_loc = Location( address = row[address_field], latitude = row[lat_field], longitude = row[long_field])
                        previous_loc.save()
                        new_parcel = Parcel( location = previous_loc, number = int( row[parcel_field].translate( None, "'")))
                        new_parcel.save()                        
                    
                except Exception, e:
                    print >> sys.stderr, e
