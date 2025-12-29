from django.urls import path
from . import views

urlpatterns = [
    path("verify/<int:fingerprint_id>/", views.verify_fingerprint, name="verify_fingerprint"),
    path("enroll/", views.enroll_fingerprint, name="enroll_fingerprint"),
]
