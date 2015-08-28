from django.contrib.auth.models import User
from journalapp.models import *


# @desc: Sets the user of the context to 
#        request.user.username, if user is authenticated
# @params: function
# @res: function

def set_user(function):
	def wrapper(*args, **kwargs):
		self = args[0]
		request = args[1]
		if request.user.is_authenticated():
			self.context['current_user'] = request.user.username
		return function(*args, **kwargs)
	return wrapper


