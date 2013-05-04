from django.core            import serializers
from django.db              import connection
from django.http            import HttpResponse
from locations.models       import Location
from locations.models       import Parcel
from itertools              import chain
import json

def index(request):
    page = request.GET.get('page')

    if page:
        try:
            results = create_results( int( page))
        except Location.DoesNotExist:
            pass
        return HttpResponse( json.dumps( results))

def parcels(request):
    locid = request.GET.get('locid')

    if locid:
        try:
            results = Parcel.objects.filter( location_id__exact = locid).values()
        except Location.DoesNotExist:
            pass
        return HttpResponse( json.dumps( list( results)))
    
def create_results(page):
    start = (page * 250)
    end = (page + 1) * 250
       
    return dict(meta    = dict( total = Location.objects.count() ) ,
                results = list( Location.objects.all().values()[start:end] ) )  