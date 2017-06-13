# -*- coding:utf-8 -*-
from django.shortcuts import render_to_response,HttpResponseRedirect
from django.http import Http404,HttpResponse
from django.contrib.auth.decorators import login_required
from django.template import RequestContext
from store.models import User,Product
from django.views.generic.edit import FormView
from django.views.generic.list import ListView
from django.views.generic.detail import DetailView
from store.RegisterForm import RegisterForm
from store.LoginForm import LoginForm
import md5
import re
import json
import hashlib
## http://stackoverflow.com/questions/29137910/redirecting-after-ajax-post-in-django
## http://stackoverflow.com/questions/5909787/testing-a-session-variable-in-django
def login(request):
	return render_to_response('login.html',locals())

def about(request):
	name = request.session.get('name','')
	totalPrice = request.session.get('totalPrice',0)
	return render_to_response('about.html',locals())

def product(request,id):
	return render_to_response('product2.html',locals())


class ProductDetailView(DetailView):
	model = Product
	template_name = 'product2.html'
	context_object_name = 'product'
	pk_url_kwargs = 'id'
	

	def get(self,request,pk,*args,**kwargs):
		try:
			return super(DetailView,self).get(self,request,pk=pk,
											  *args,**kwargs)
		except Http404:
			return HttpResponse('error')

	def get_context_data(self,**kwargs):
		context = super(DetailView,self).get_context_data(**kwargs)
		context['name'] = self.request.session['name']
		context['totalPrice'] = self.request.session.get('totalPrice',0)
		return context

class IndexListView(ListView):
	model = Product
	template_name = 'index.html'
	context_object_name = 'products'
	queryset  = Product.objects.all()

	def get_context_data(self,**kwargs):
		context = super(ListView,self).get_context_data(**kwargs)
		context['name'] = self.request.session.get('name','')
		context['totalPrice'] = self.request.session.get('totalPrice',0)
		return context

def authenticate(request):
	response = {'isAuthenticated':'1','url':'/index/'}
	if request.POST:
		name = request.POST['name']
		password = md5.new(request.POST['password']).hexdigest()
		if(User.objects.filter(name=name,password=password)):
			request.session['name'] = name
			return HttpResponse(json.dumps(response),content_type='application/json')
		response['isAuthenticated'] = 0;
		return HttpResponse(json.dumps(response),content_type='application/json')


def register(request):
	response = {'errorMessage':'','status':0}
	if request.POST:
		username = request.POST['username']
		email = request.POST['email']
		password = request.POST['password']
		isEmailExists = User.objects.filter(email=email)

		pattern = re.compile('^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$')
		match_result = pattern.match(email)

		if match_result == None:
			response['errorMessage'] ='emailInValid' 
			return HttpResponse(json.dumps(response),content_type='application/json')
		if(isEmailExists):
			response['errorMessage'] ='emailExists' 
			return HttpResponse(json.dumps(response),content_type='application/json')
		User.objects.create(
			name=username,
			email = email,
			password = md5.new(password).hexdigest()
		)
		response['status'] = 1;
		return HttpResponse(json.dumps(response),content_type='application/json')

# for calculate total page
def getTotalProducts(request):
	products = Product.objects.all()
	return HttpResponse(len(products))

def storeBuyInformation(request):
	if request.POST:	
		product = request.POST['product']
		price = request.POST['price']
		quantity = request.POST['quantity']

		if 'project' not in request.session:
			request.session['product'] = {}
		request.session['product'][product] = product
		request.session['product'][product] = {'price':'','quantity':'','total':''}
		request.session['product'][product]['price'] = str(price)
		request.session['product'][product]['quantity'] = str(quantity)
		request.session['product'][product]['total'] = int(price) * int(quantity)
		
		total = 0 
		for key in request.session['product'].keys():
			total += request.session['product'][key]['total']
		request.session['totalPrice'] = total

		if request.POST['quantity'] == '0':
			del request.session['product'][request.POST['product']]

		return HttpResponse('success')


def getQuantity(request):
	return HttpResponse(json.dumps(request.session['product']),content_type='application/json')


def shoppingList(request):
	name = request.session.get('name','')
	products = request.session['product']
	totalPrice = request.session.get('totalPrice',0)
	return render_to_response('cart.html',locals())

