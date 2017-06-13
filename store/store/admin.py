from django.contrib import admin
from store.models import User,Product,Category

class UserAdmin(admin.ModelAdmin):
	list_display=('name','email','password')

class CategoryAdmin(admin.ModelAdmin):
	list_display = ('category',)

class ProductAdmin(admin.ModelAdmin):
	list_display=('name','description','price','category')
	ordering=('-price',)


admin.site.register(User,UserAdmin)
admin.site.register(Product,ProductAdmin)
admin.site.register(Category,CategoryAdmin)


