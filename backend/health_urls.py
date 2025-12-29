from django.urls import path
from health_views import health


urlpatterns = [
    path("health/", health, name="health"),
]
