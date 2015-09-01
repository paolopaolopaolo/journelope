from django import template
import re

register = template.Library()

@register.filter(name='removeColon')
def remove_colon(value):
	return re.sub(r':', '', value)