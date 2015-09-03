from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from django.conf import settings
from django.contrib import admin
from journalapp.views import *
from journalapp.api_views import *
import os

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'j_app.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'pages/(?P<id>[0-9]+){0,1}$', GetJournalPages.as_view(), name='JournalPagesAPI'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', LandingPageView.as_view(name='landing_page'), name='LandingPage'),
    url(r'^uauth/', UserAuthenticationView.as_view(name='user_authentication'), name='UAuthPage'),
    url(r'^journal/', JournalPageView.as_view(name='journal'), name='JournalPage'),
    url(r'^logout/', 'journalapp.views.log_out', name='logout'),

)

if settings.DEBUG:
	urlpatterns += static(r'static/', document_root = settings.STATIC_ROOT)
	urlpatterns += static(r'media/', document_root = settings.MEDIA_ROOT)