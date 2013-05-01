import csv
import requests
import json
import sys

def print_row(row):
    print >> sys.stdout, ','.join([repr(el) for el in row])

if __name__ == '__main__':
    headers = None
    address_field = None
    geocode_base = 'http://services.phila.gov/ULRS311/Data/Location/'

    new_data = []

    with open('PRHP_3-20-2013.txt') as f:
        reader = csv.reader(f)

        for row in reader:
            if headers is None:
                headers = row
                address_field = headers.index('Loc')
#                print_row(headers + ['lat','lng'])
                continue

            try:
                response = requests.get(geocode_base + row[address_field])
                data = json.loads(response.text)
                lng = data['Locations'][0]['XCoord']
                lat = data['Locations'][0]['YCoord']

                print_row(row + [lat, lng])
            except Exception, e:
                print >> sys.stderr, row
                print >> sys.stderr, e
