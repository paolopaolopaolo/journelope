from django.shortcuts import render, redirect
from django.views.generic import View
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import HttpResponse
from django.contrib.auth import login, authenticate, logout
from journalapp.forms import *
from journalapp.decorators import *
from journalapp.serializers import *
from rest_framework.renderers import JSONRenderer


import pdb, json

# Simple Logout Procedure
def log_out(request):
	logout(request)
	return redirect("LandingPage")

# The Views here will be used to render the initial HTML content of each page.
# This also includes bootstrapped JSON that Backbone can use later, as well as
# regular forms.

# USE THIS VIEW TO CREATE ALL THE OTHER VIEWS
class JournelopeView(View):
	name = None
	# Put default value for reusable context parameter here
	default_context = {
		'current_user': None,
		'showsFooter': False,
		'showsAuthenticatedHeader': False,
		'hasBackbone': False
	}

	# Use this function to set reusable context parameters
	def set_params(self, view):
		# Set up new context
		self.context = self.default_context.copy()	
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

class UserAuthenticationView(JournelopeView):
	
	def _validate_and_use_form(self, form, request):
		if form.is_valid():
			if request.POST['access_type'] == 'signup':
				# Sign Up
				new_user = User.objects.create(
								first_name = form.cleaned_data['first_name'],
								last_name = form.cleaned_data['last_name'],
								username = form.cleaned_data['email'],
								email = form.cleaned_data['email']
							)
				new_user.set_password(form.cleaned_data['password'])
				new_user.save()
				new_journal_user = J_User(user = new_user)
				new_journal_user.save()

			user_auth = authenticate(
							username = form.cleaned_data['email'],
							password = form.cleaned_data['password']
						)
			if user_auth is not None:
				self.context['current_user'] = user_auth.username
				login(request, user_auth)
				return redirect("JournalPage") 
				
		if request.POST['access_type'] == 'signup':
			self.context['signup_form'] = form
			self.context['login_form'] = LogInForm()
		else:
			self.context['signup_form'] = SignUpForm()
			self.context['login_form'] = form
		return render(request, 'j_app/uauth/base.html', self.context)

	@set_user
	def get(self, request, *args, **kwargs):
		if request.user.is_authenticated():
			return redirect('JournalPage')
		self.context['signup_form'] = SignUpForm()
		self.context['login_form'] = LogInForm()
		return render(request, 'j_app/uauth/base.html', self.context)

	def post(self, request, *args, **kwargs):
		if request.POST['access_type'] == 'signup':
			form = SignUpForm(request.POST)
		elif request.POST['access_type'] == 'login':
			form = LogInForm(request.POST)
		else:
			response = HttpResponse()
			response.status_code = 405
			response.reason_phrase = "Bad form construction"
			return response
		return self._validate_and_use_form(form, request)

class JournalPageView(JournelopeView):

	def get_queryset(self, request):
		j_user = J_User.objects.get(user = request.user)
		journals = Journal.objects.filter(user = j_user)
		return journals

	@method_decorator(login_required)
	def dispatch(self, *args, **kwargs):
		return super(JournalPageView, self).dispatch(*args, **kwargs)

	@set_user
	def get(self, request, *args, **kwargs):
		journals = self.get_queryset(request)
		serialized_journals = [JournalSerializer(journal).data for journal in journals]
		json_journals = JSONRenderer().render(serialized_journals)
		self.context['journals'] = json_journals
		self.context['user'] = J_User.objects.get(user = request.user).id
		
		return render(request, "j_app/journal/base.html", self.context)
		