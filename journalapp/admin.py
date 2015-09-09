from django.contrib import admin
from journalapp.models import *

# Register your models here.
admin.site.register(J_User)
admin.site.register(Journal)
admin.site.register(Page)
admin.site.register(Image)
admin.site.register(PageImage)