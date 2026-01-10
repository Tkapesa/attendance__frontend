from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("", include("health_urls")),
    path("admin/", admin.site.urls),
    path("auth/", include("authentication.urls")),
    path("users/", include("users.urls")),
    path("fingerprint/", include("fingerprint.urls")),
    path("attendance/", include("attendance.urls")),
    path("dashboard/", include("dashboard.urls")),
]
