from django.conf.urls import patterns, include, url
from django.contrib import admin
from views import login,about,product
from views import register,getTotalProducts,shoppingList
from views import getQuantity
from views import storeBuyInformation
import views
admin.autodiscover()
urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^accounts/login/$',login),
    url(r'^about/$',about),
    url(r'^product/(?P<pk>\d{1,5})/$',views.ProductDetailView.as_view()),
    url(r'^index/$',views.IndexListView.as_view()),
    url(r'^authenticate/$',views.authenticate),
    url(r'^register/$',register),
    url(r'^getTotalProducts/$',getTotalProducts),
    url(r'^shoppingList/$',shoppingList),
    url(r'^storeBuyInformation/$',storeBuyInformation),
    url(r'^getQuantity/$',getQuantity),
)
