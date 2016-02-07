from rest_framework.parsers import BaseParser
import json, pdb, base64, cStringIO, re, random
from django.core.files.uploadedfile import InMemoryUploadedFile
from PIL import Image as PImage
import requests

from journalapp.models import *
# Custom Parser(s)

# This will parse all incoming JSON and will return
# stream.read() unless imageField is present; in which
# case the parser will perform 
class JournalImageParser(BaseParser):
	
	media_type = 'application/json'

	def _generate_filename(self):
		string1 = ""
		string2 = ""
		for char in range(0, 10):
			string1 = "".join([string1, str(random.randrange(0, 10))])
			string2 = "".join([string2, str(random.randrange(0, 10))])
		return "_".join((string1, string2))
	
	@classmethod
	def handle_image(cls, base64str):
		return cls()._handle_images(base64str)

	def _handle_images(self, base64str):
		size = 0
		if re.search(r'http', base64str) is not None:
			file_item = cStringIO.StringIO(requests.get(base64str, verify=False).content)
		else:
			file_item = cStringIO.StringIO(base64.b64decode(base64str))
		
		file_item.seek(0, os.SEEK_END)
		size = file_item.tell()
		file_item.seek(0)

		image = InMemoryUploadedFile(
			file_item,
			None,
			".".join([self._generate_filename(), 'PNG']),
			'image/png',
			size,
			None)
		return image

	def parse(self, stream, media_type, parser_context):
		request = json.loads(stream.read())
		dest_request = request.copy()

		if 'imageFile' in request:
			dest_request['imageFile'] = self._handle_images(request['imageFile'])

		return dest_request
