from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_delete
from django.dispatch.dispatcher import receiver
import re, os


# Helper functions
def upload_image(instance, filename):
	try:
		user = str(instance.page.journal.user.user.id)
	except Exception, e:
		user = 'temp'
	journal = str(instance.page.journal.id)
	page = str(instance.page.id)
	filename_subbed = re.sub(r"[\'\"\/ ]", "_", filename)
	if filename_subbed is None:
		filename_subbed = filename
	return os.path.join("journalimgs", user, journal, page, filename)

# Create your models here.
class J_User(models.Model):
	user = models.OneToOneField(User)

	def __unicode__(self):
		return unicode(self.user)

class Journal(models.Model):
	user = models.ForeignKey(J_User, null=True)
	date = models.DateTimeField(auto_now=True)
	textFilename = models.CharField(max_length = 200)
	order = models.IntegerField(default = 1)
	public = models.BooleanField(default = False)

	def __unicode__(self):
		return "%s:%s" % (self.user, self.textFilename)

class Page(models.Model):
	journal = models.ForeignKey(Journal)
	date = models.DateTimeField(auto_now=True)
	text = models.TextField(blank=True)
	scrollpos = models.IntegerField(default=0)

	def __unicode__(self):
		return "%s:%s" % (unicode(self.journal.textFilename), unicode(self.text))
	
class Image(models.Model):
	imageFile = models.ImageField(upload_to = upload_image)
	page = models.ForeignKey(Page)
	top = models.FloatField(default=0.0)
	left = models.FloatField(default=0.0)
	width = models.FloatField(default=0.0)
	height = models.FloatField(default=0.0)

	def __unicode__(self):
		return "IMAGE:%s" % (unicode(self.page.journal.textFilename))

# Compound model
class PageImage(models.Model):
	page = models.OneToOneField(Page)
	images = models.ManyToManyField(Image, blank=True)

# Temporary Journal Page model
class TemporaryJournalPage(models.Model):
	guid = models.CharField(max_length = 20)
	pageimage = models.OneToOneField(PageImage)
	journal = models.OneToOneField(Journal)

# This will delete from file the image that is being deleted

@receiver(post_delete, sender=Image)
def image_delete(sender, instance, **kwargs):
    # Pass false so ImageField doesn't save the model.
    instance.imageFile.delete(False)
