# -*- coding: utf-8 -*-
from django import forms
import re
from store.models import User

class RegisterForm(forms.Form):
	username = forms.CharField(max_length=20,required=True)
	email = forms.CharField(max_length=100,required=True)
	password = forms.CharField(max_length=20,required=True)

	def clean_email(self):

		def IsEmailExists(eamil):
			return User.objects.filter(email=email)

		def IsEmailValid(eamil):
			pattern = re.compile('^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$')
			match_result = pattern.match(email)
			return match_result

		email = self.cleaned_data['email']
		if(IsEmailValid(email) == None):
			return "emailInValid"
		if(IsEmailExists(email)):
			return 'emailExists'
		return email


