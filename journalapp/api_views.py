from rest_framework import generics, mixins
from rest_framework.parsers import JSONParser
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from journalapp.models import *
from journalapp.serializers import *
from journalapp.parsers import *
import pdb


# Subclass of GenericAPI that has .create, .update, and .delete
# methods
class CUDAPI(
				mixins.CreateModelMixin,
				mixins.UpdateModelMixin,
				mixins.DestroyModelMixin,
				generics.GenericAPIView
			):

	lookup_field = 'id'
	parser_classes = [ JournalImageParser, ]

	def post(self, request, *args, **kwargs):
		return self.create(request, *args, **kwargs)

	def put(self, request, *args, **kwargs):
		return self.update(request, *args, **kwargs)

	def delete(self, request, *args, **kwargs):
		return self.destroy(request, *args, **kwargs)		

class GetJournalPages(mixins.ListModelMixin, generics.GenericAPIView):
	
	journal_id = None
	serializer_class = PageImageSerializer

	def get_queryset(self):
		# This function returns pages paired up with their images.
		# PageImage is a cache model that is lazily created whenever
		# a user tries to fetch a journal it hasn't seen before
		def pair_up_page_image_trees(page, images):
			try:
				result = PageImage.objects.get(page = page)
				result.page = page
				result.images = images.filter(page=page)
				result.save()
			except PageImage.DoesNotExist:
				result = PageImage(page = page)
				result.save()
				result.images = images.filter(page = page)
			return result

		pages = Page.objects.filter(journal__user__user=self.request.user)
		images = Image.objects.filter(page__journal__user__user=self.request.user)
		if self.journal_id is not None:
			pages = pages.filter(journal__id=self.journal_id)
		return [pair_up_page_image_trees(page, images) for page in pages]

	@method_decorator(login_required)
	def get(self, request, *args, **kwargs):
		if 'id' in kwargs:
			self.journal_id = kwargs['id']
		return self.list(request, *args, **kwargs)

class CUDImage(CUDAPI):
	queryset = Image.objects.all()
	serializer_class = ImageSerializer

class CUDPage(CUDAPI):
	queryset = Page.objects.all()
	serializer_class = PageSerializer

class CUDJournal(CUDAPI):
	queryset = Journal.objects.all()
	serializer_class = JournalSerializer