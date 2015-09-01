from rest_framework import serializers
from journalapp.models import *

# Primary Serializers

class JournalSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = Journal
		fields = (
				'id',
				'date',
				'textFilename',
				'order',
				'public'
			)

	def create(self, validated_data):
		return Journal(**validated_data)

	def update(self, instance, validated_data):
		for key in validated_data:
			setattr(instance, key, validated_data.get(key, getattr(instance, key)))
		return instance

class PageSerializer(serializers.ModelSerializer):

	journal = JournalSerializer(required = True)

	class Meta:
		model = Page
		fields = (
				'id',
				'date',
				'journal',
				'text',
				'scrollpos'
			)

	def create(self, validated_data):
		return Page(**validated_data)

	def update(self, instance, validated_data):
		for key in validated_data:
			setattr(instance, key, validated_data.get(key, getattr(instance, key)))
		return instance

class ImageSerializer(serializers.ModelSerializer):
	
	page = PageSerializer(required=True)
	imageFile = serializers.ImageField(allow_empty_file=False, use_url=True)

	class Meta:
		model = Image
		fields = (
				'id',
				'top',
				'page',
				'left',
				'width',
				'height',
				'imageFile',
			)

	def create(self, validated_data):
		return Image(**validated_data)


# Compound Serializers

class PageImageSerializer(serializers.Serializer):
	page = PageSerializer(required=True)
	images = ImageSerializer(many=True)
