from django.db import models

class User(models.Model):
	name = models.CharField(max_length=20)
	email = models.CharField(max_length=100)
	password = models.CharField(max_length=20)

	def __unicode__(self):
		return self.name

class Category(models.Model):
	category = models.CharField(max_length=30)

	def __unicode__(self):
		return self.category

class Product(models.Model):
	name = models.CharField(max_length=50)
	description = models.CharField(max_length=200)
	price = models.DecimalField(max_digits = 4,decimal_places=0)
	category = models.ForeignKey(Category)
	buyer = models.ManyToManyField(User)

	def __unicode__(self):
		return self.name



