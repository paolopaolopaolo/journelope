from django.conf.urls import patterns, include, url
from django.contrib import admin
from journalapp.views import *

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'j_app.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', LandingPageView.as_view(name='landing_page'), name='LandingPage'),
    url(r'^uauth/', UserAuthenticationView.as_view(name='user_authentication'), name='UAuthPage'),
    url(r'^journal/', JournalPageView.as_view(name='journal'), name='JournalPage'),
)
