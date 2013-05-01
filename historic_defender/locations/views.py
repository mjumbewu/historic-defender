from django.core            import serializers
from django.db              import connection
from django.http            import HttpResponse
from locations.models       import Location
import json

def index(request):
    page = request.GET.get('page')

    if page:
        try:
            results = create_results(int(page))
        except Location.DoesNotExist:
            pass
        return HttpResponse(serializers.serialize("json", results))
    
def create_results(page):
    start = (page * 250)
    end = (page + 1) * 250
    
    return Location.objects.all()[start:end]