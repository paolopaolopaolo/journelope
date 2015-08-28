from django.contrib.auth.models import User
from django.db import models

# Create your models here.
class J_User(models.Model):
	user = models.OneToOneField(User)

	def __unicode__(self):
		return unicode(self.user)
