from django.urls import path, include
from rest_framework import routers
from .views import (
    register_user, login_user,
    upload_file, list_files, delete_file,
    get_dashboard_stats, list_reports
)
from .views.analysis import AnalysisViewSet

router = routers.DefaultRouter()
router.register(r'analysis/files', AnalysisViewSet, basename='analysis')

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('upload/', upload_file, name='upload_file'),
    path('files/', list_files, name='list_files'),
    path('files/<int:file_id>/', delete_file, name='delete_file'),
    path('stats/', get_dashboard_stats, name='dashboard_stats'),    path('reports/list', list_reports, name='list_reports'),
    path('', include(router.urls)),
]