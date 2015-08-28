from django.test import TestCase, Client, RequestFactory
from django.contrib.auth.models import User, AnonymousUser
from django.db import IntegrityError
from django.utils.decorators import method_decorator
from random import choice

from journalapp.models import *

# Simple Decorators
def login_as_user(**decorator_kwargs):
	def wrapper(method):
		def wrapper_function(*args, **kwargs):
			self = args[0]
			self.client.login(**decorator_kwargs)
			method(self)
			self.client.logout()
		return wrapper_function
	return wrapper

def label_test(**decorator_kwargs):
	def wrapper(method):
		def wrapper_function(*args, **kwargs):
			print "\t\t".join([decorator_kwargs['test'], ""]),
			method(*args, **kwargs)
			print "OK"
		return wrapper_function
	return wrapper

# Base Test (Inherit all tests from here)
class SiteTest(TestCase):
	test_name = ''
	client = None
	first_names = [	'Andrew',
					'Ava',
					'Barbara',
					'Brady',
					'Chuck',
					'Daniel',
					'Ernie',
					'Elizabeth'
				  ]
	last_names = [	'Carter',
					'Daniels',
					'Englebert',
					'Fiorina',
					'Goldman'
				]
	
	letters = 'abcdefghijklmnopqrstuvwkyz'
	
	numbers = '01234567890'


	def _randomUserLabels(self):
		username = choice(self.letters)
		for i in range(8):
			username = "".join([username, choice(self.letters)])
		for j in range(4):
			username = "".join([username, choice(self.numbers)])
		email = "@".join([username, "gmail.com"])
		return username, email
		
	def _populateWithNewUsers(self, times):
		for i in range(times):
			username, email = self._randomUserLabels()
			self.client.post('/uauth/',{
									'access_type': 'signup',
									'first_name': choice(self.first_names),
									'last_name': choice(self.last_names),
									'username': username,
									'email': email,
									'password': 'password',
									'confirm_password': 'password',
									}, follow=True)

	def setUp(self):
		print '%s::\t\t' % (self.test_name), 
		self.factory = RequestFactory()
		self.client = Client()

# Testing that LogIns/SignUps work
class CredentialsTesting(SiteTest):
	test_name = 'Credentials'
	## Tests signing up ##

	# Sign up new user
	@label_test(test="Sign Up Test:")
	def test_0000_signup(self):
		resp = self.client.post('/uauth/',{
								'access_type': 'signup',
								'first_name': 'Andy',
								'last_name': 'Brickman',
								'username': 'a.brick',
								'email': 'a.brick@gmail.com',
								'password': 'password',
								'confirm_password': 'password',
								}, follow=True)
		self.assertRedirects(resp, '/profile/')
		try:
			user = User.objects.get(username = 'a.brick')
			j_user = J_User.objects.get(user = user)
		except Exception, e:
			raise AssertionError('User/J_User not saved')

		self.assertEqual(user.email, 'a.brick@gmail.com')
		self.client.logout()

	# Sign up user with taken username
	@label_test(test="Taken username test:")
	def test_0001_username_taken(self):
		with self.assertRaises(IntegrityError):
			resp = self.client.post('/uauth/',{
									'access_type': 'signup',
									'first_name': 'Andy',
									'last_name': 'Brickman',
									'username': 'a.bedelia',
									'email': 'a.brick@gmail.com',
									'password': 'password',
									'confirm_password': 'password',
									}, follow=True)
			resp2 = self.client.post('/uauth/',{
									'access_type': 'signup',
									'first_name': 'Andy',
									'last_name': 'Brickman',
									'username': 'a.bedelia',
									'email': 'a@gmail.com',
									'password': 'password',
									'confirm_password': 'password',
									}, follow=True)
	## Tests logging in ##
	
	# Test email login
	@label_test(test="Email login test:")
	def test_0002_email_login(self):
		pre_resp = self.client.post('/uauth/',{
									'access_type': 'signup',
									'first_name': 'Andy',
									'last_name': 'Brickman',
									'username': 'a.bedelia',
									'email': 'a.brick@gmail.com',
									'password': 'password',
									'confirm_password': 'password',
									}, follow=True)

		user = User.objects.get(email='a.brick@gmail.com')
		resp = self.client.post('/uauth/',{
								'access_type': 'login',
								'uname_email': 'a.brick@gmail.com',
								'password': 'password',
								}, follow=True)
		self.assertRedirects(resp, '/journal/')
		self.client.logout()

	# Test username login
	@label_test(test="Username login test:")
	def test_0003_username_login(self):
		pre_resp = self.client.post('/uauth/',{
									'access_type': 'signup',
									'first_name': 'Andy',
									'last_name': 'Brickman',
									'username': 'a.bedelia',
									'email': 'a.brick@gmail.com',
									'password': 'password',
									'confirm_password': 'password',
									}, follow=True)
		user = User.objects.get(email='a.brick@gmail.com')
		resp = self.client.post('/uauth/',{
								'access_type': 'login',
								'uname_email': 'a.bedelia',
								'password': 'password',
								}, follow=True)
		self.assertRedirects(resp, '/journal/')
		self.client.logout()