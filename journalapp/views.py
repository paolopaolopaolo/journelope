from django.shortcuts import render, redirect
from django.views.generic import View
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import HttpResponse

from journalapp.forms import *
from journalapp.decorators import *

import pdb


# USE THIS VIEW TO CREATE ALL THE OTHER VIEWS
class JournelopeView(View):
	name = None
	# Put default value for reusable context parameter here
	context = {
		'current_user': None,
		'showsFooter': False,
		'showsAuthenticatedHeader': False,
		'hasBackbone': False
	}

	# Use this function to set reusable context parameters
	def set_params(self, view):
		# Add view name to any of these variables to set context variable to true
		# Remove view name to set context variable to false
		show_footer_views = ['landing_page', 'journal']
		shows_authenticated_header_views = ['journal']
		has_backbone_views = ['journal']

		if view in show_footer_views:
			self.context['showsFooter'] = True
		if view in has_backbone_views:
			self.context['hasBackbone'] = True
		if view in shows_authenticated_header_views:
			self.context['showsAuthenticatedHeader'] = True
	

	def dispatch(self, *args, **kwargs):
		self.set_params(view = self.name) 
		return super(JournelopeView, self).dispatch(*args, **kwargs)

class LandingPageView(JournelopeView):

	@set_user
	def get(self, request, *args, **kwargs):
		if request.user.is_authenticated():
			return redirect('JournalPage')
		return render(request, 'j_app/landing_page/base.html', self.context)

# Create your views here.
class UserAuthenticationView(JournelopeView):
	
	@set_user
	def get(self, request, *args, **kwargs):
		return HttpResponse('Hello World (UAuth Page)', content_type='text/plain')


class JournalPageView(JournelopeView):

	@method_decorator(login_required)
	def dispatch(self, *args, **kwargs):
		return super(JournalPageView, self).dispatch(*args, **kwargs)

	@set_user
	def get(self, request, *args, **kwargs):
		return HttpResponse('Hello World (Journal Page)', content_type='text/plain')