from rest_framework.parsers import BaseParser
import json

# Custom Parser(s)

# This will parse all incoming JSON and will return
# stream.read() unless imageField is present; in which
# case the parser will perform 
class JournalImageParser(BaseParser):
	
	media_type = 'application/json'

	def parse(self, stream, media_type, parser_context):
		request = stream.read()
		# Do the stuff here

		return request
