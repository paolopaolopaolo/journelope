from django import forms
from django.db import IntegrityError
from django.contrib.auth.models import User

class SignUpForm(forms.Form):
    first_name = forms.CharField(max_length = 100)
    last_name = forms.CharField(max_length = 100)
    email = forms.EmailField()
    password = forms.CharField(min_length = 6, widget=forms.PasswordInput)
    confirm_password = forms.CharField(min_length=6, widget=forms.PasswordInput)

    def clean_email(self):
        try:
            conflicting_user = User.objects.get(username = self.data['email'])
            raise IntegrityError('Email already used!')
        except User.DoesNotExist:
            return self.data['email']

    def clean_password(self):
        if self.data['password'] != self.data['confirm_password']:
            raise forms.ValidationError('Passwords are not the same')
        return self.data['password']
    
    def clean(self,*args, **kwargs):
        self.clean_password()
        return super(SignUpForm, self).clean(*args, **kwargs)

class LogInForm(forms.Form):
    email = forms.EmailField()
    password = forms.CharField(min_length = 6, widget=forms.PasswordInput)