from django.test import TestCase, Client, RequestFactory
from django.contrib.auth.models import User, AnonymousUser
from django.db import IntegrityError
from django.conf import settings
from django.utils.decorators import method_decorator
from random import choice
from PIL import Image as Pimage
from journalapp.models import *
import cStringIO
from django.core.files.uploadedfile import InMemoryUploadedFile

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
	fixtures = ['seed.json',]
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
								'email': 'a.brick@gmail.com',
								'password': 'password',
								'confirm_password': 'password',
								}, follow=True)
		self.assertRedirects(resp, '/journal/')
		try:
			user = User.objects.get(email = 'a.brick@gmail.com')
			j_user = J_User.objects.get(user = user)
		except Exception, e:
			raise AssertionError('User/J_User not saved')

		self.assertEqual(user.email, 'a.brick@gmail.com')
		self.client.logout()

	# Sign up user with taken email
	@label_test(test="Taken email test:")
	def test_0001_email_taken(self):
		with self.assertRaises(IntegrityError):
			resp = self.client.post('/uauth/',{
									'access_type': 'signup',
									'first_name': 'Andy',
									'last_name': 'Brickman',
									'email': 'a.brick@gmail.com',
									'password': 'password',
									'confirm_password': 'password',
									}, follow=True)
			resp2 = self.client.post('/uauth/',{
									'access_type': 'signup',
									'first_name': 'Abigail',
									'last_name': 'Broderick',
									'email': 'a.brick@gmail.com',
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
									'email': 'a.brick@gmail.com',
									'password': 'password',
									'confirm_password': 'password',
									}, follow=True)

		user = User.objects.get(email='a.brick@gmail.com')
		resp = self.client.post('/uauth/',{
								'access_type': 'login',
								'email': 'a.brick@gmail.com',
								'password': 'password',
								}, follow=True)
		self.assertRedirects(resp, '/journal/')
		self.client.logout()

# Test Journal Usage
class JournalUseTesting(SiteTest):
	test_name = "JournalUse (ADMIN)"

	@label_test(test="adminImageUpload")
	@login_as_user(username='a.bedelia@gmail.com', password='abcd1234')
	def test_0001_imageUpload(self):

			path_to_img = os.path.join(settings.STATIC_ROOT, "j_app", "shared", "img", "koalas", "koala1.jpg")

			juser = J_User.objects.get(user=User.objects.get(email='a.bedelia@gmail.com'))
			journal = Journal(user=juser, textFilename='test')
			journal.save()
			page = Page(journal=journal, text="Shyamalamadingdong")
			page.save()
			image = Pimage.open(path_to_img)
			image_file = cStringIO.StringIO()
			image.save(image_file, format='JPEG')

			image_file.seek(0, os.SEEK_END)
			image_size = image_file.tell()
			image_file.seek(0)

			request_body = {
				"page": page,
				"imageFile": open(image_file, 'rb'),
				"top": "20",
				"left": "20",
				"height": "100",
				"width": "100",
			}
			
			response = self.client.post('/ji/', request_body, follow=True)
			
			print response.content
			print response.wsgi_request
			print dir(response)
			
			self.assertEquals(response.status_code, 200)

