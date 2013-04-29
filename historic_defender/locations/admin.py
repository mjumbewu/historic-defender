from django.contrib import admin
from bulkadmin.admin import BulkUploadAdmin
from . import models

admin.site.register(models.Location, BulkUploadAdmin)
