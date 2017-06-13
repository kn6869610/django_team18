# -*- coding: utf-8 -*-
from django import forms
from store.models import User

class LoginForm(forms.Form):
	email = forms.CharField(max_length=20,required=True)
	password = forms.CharField(max_length=20,required=True)





