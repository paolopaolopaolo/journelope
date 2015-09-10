from rest_framework import serializers
from journalapp.models import *
import pdb


# Inherit from the master Serializer
class MasterModelSerializer(serializers.ModelSerializer):
	# Override TargetModel with desired Model, or it won't work

	TargetModel = None

	def create(self, validated_data):
		for key in validated_data:
			# HACK: This only works even without id because the journal/page 
			# nested object is not being edited at the same time
			if key == 'journal':
				validated_data[key] = Journal.objects.get(id = validated_data['journal']['id'])
			if key == 'page':
				validated_data[key]['journal'] = Journal.objects.get(id = validated_data[key]['journal']['id'])
				validated_data[key] = Page.objects.get(id = validated_data['page']['id'])
		result = self.TargetModel(**validated_data)
		result.save()
		return result

	def update(self, instance, validated_data):
		for key in validated_data:
			if key == 'journal':
				validated_data[key] = Journal.objects.get(id = instance.journal.id)
			if key == 'page':
				validated_data[key] = Page.objects.get(id = instance.page.id)

			setattr(instance, key, validated_data.get(key, getattr(instance, key)))
			instance.save()
		return instance
	
# Primary Serializers
class JournalSerializer(MasterModelSerializer):
	
	TargetModel = Journal

	class Meta:
		model = Journal
		fields = (
			'id',
			'date',
			'user',
			'textFilename',
			'order',
			'public'
		)

		extra_kwargs = {
            "id": {
                "read_only": False,
                "required": False,
            },
        }

	# Override create method
	def create(self, validated_data):
		result = super(JournalSerializer, self).create(validated_data)
		
		newpage = Page(journal=result, text="")
		newpage.save()
		PageImage(page=newpage).save()
		return result

class PageSerializer(MasterModelSerializer):

	TargetModel = Page

	class Meta:
		model = Page
		fields = (
			'id',
			'date',
			'journal',
			'text',
			'scrollpos'
		)
		
		extra_kwargs = {
            "id": {
                "read_only": False,
                "required": False,
            },
        }

	
	journal = JournalSerializer(required = True)

class ImageSerializer(MasterModelSerializer):

	TargetModel = Image

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

	page = PageSerializer(required=True)
	imageFile = serializers.ImageField(allow_empty_file=False, use_url=True)

# Compound Serializers (Use this for Bootstrap Vars)

class PageImageSerializer(serializers.Serializer):
	page = PageSerializer(required=True)
	images = ImageSerializer(many=True)
