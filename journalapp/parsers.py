from rest_framework.parsers import BaseParser
import json, pdb, base64, cStringIO, re, urllib
from PIL import Image as PImage

from journalapp.models import *
# Custom Parser(s)

# This will parse all incoming JSON and will return
# stream.read() unless imageField is present; in which
# case the parser will perform 
class JournalImageParser(BaseParser):
	
	media_type = 'application/json'

	def _handle_images(self, base64str):
		if re.search(r'http', base64str) is not None:
			file_item = cStringIO.StringIO(urllib.urlopen(base64str).read())
			image = PImage.open(file_item)
		else:
			image_string = cStringIO.StringIO(base64.b64decode(base64str))
			image = PImage.open(image_string)
		return image

	def parse(self, stream, media_type, parser_context):
		request = json.loads(stream.read())
		dest_request = request.copy()

		if 'imageFile' in request:
			dest_request['imageFile'] = self._handle_images(request['imageFile'])

		return dest_request
