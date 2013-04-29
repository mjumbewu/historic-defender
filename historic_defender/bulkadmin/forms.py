import csv

from django import forms


class BulkUploadForm(forms.Form):
    data = forms.FileField(help_text="""
        <p>Select the CSV file to upload.  The file should have a header for
           each column you want to populate.  When you have selected your
           file, click the 'Upload' button below.</p>
        """)

    exclude_duplicates = forms.BooleanField(help_text="""
        <p>If checked, only values not already in the database will be imported.
           Note that this may be a slow operation on large data sets.
        """, initial=False, required=False)

    def clean(self):
        cleaned_data = super(BulkUploadForm, self).clean()

        if 'data' in cleaned_data:
            cleaned_data['data'] = BulkUploadForm.load_csv(cleaned_data['data'])

        return cleaned_data

    @staticmethod
    def load_csv(f):
        reader = csv.reader(f, quotechar="'")
        data = []

        i = 0
        for row in reader:
            if i == 0:
                header = row
            else:
                d = dict(zip(header, row))
                for k in d.keys():
                    if k not in ['parcel', 'address', 'latitude', 'longitude']:
                        del d[k]
                d['parcel'] = int(d['parcel'])
                data.append(d)
            i += 1

        return data

    def bulk_create(self, ModelClass):
        data = self.cleaned_data['data']
        exclude_duplicates = self.cleaned_data['exclude_duplicates']

        if not exclude_duplicates:
            instances = [ModelClass(**d) for d in data]
            ModelClass.objects.bulk_create(instances)
        else:
            instances = []
            for d in data:
                try:
                    instance, created = ModelClass.objects.get_or_create(**d)
                    if created:
                        instances.append(instance)
                except ModelClass.MultipleObjectsReturned:
                    pass

        return instances
