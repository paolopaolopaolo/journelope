from django import forms

class SignUpForm(forms.Form):
	first_name = forms.CharField(max_length = 100)
	last_name = forms.CharField(max_length = 100)
	email = forms.EmailField()
	password = forms.CharField(min_length = 6, widget=forms.PasswordInput)
	confirm_password = forms.CharField(min_length=6, widget=forms.PasswordInput)

class LogInForm(forms.Form):
	email = forms.EmailField()
	password = forms.CharField(min_length = 6, widget=forms.PasswordInput)