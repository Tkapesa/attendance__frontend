from django.urls import path
from . import views

urlpatterns = [
    path("register/", views.register_user, name="register_user"),
    path("students/", views.list_students, name="list_students"),
    path("students/<str:uid>/", views.get_student, name="get_student"),
    path("students/<str:uid>/delete/", views.delete_student, name="delete_student"),
]
