from django.urls import path
from . import views

urlpatterns = [
    path("check-in/", views.check_in, name="check_in"),
    path("history/", views.attendance_history, name="attendance_history"),
    path("stats/", views.attendance_stats, name="attendance_stats"),
    path("today/", views.today_attendance, name="today_attendance"),
]
