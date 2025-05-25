from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..models import UploadedFile
from django.db.models import Count
from datetime import datetime, timedelta

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_dashboard_stats(request):
    try:
        # Calculate dates for trends
        now = datetime.now()
        week_ago = now - timedelta(days=7)
        
        # Get total uploads and this week's uploads
        total_uploads = UploadedFile.objects.filter(user=request.user).count()
        last_week_uploads = UploadedFile.objects.filter(
            user=request.user,
            uploaded_at__gte=week_ago
        ).count()
        
        # Calculate trends (percentage change)
        uploads_trend = 0
        if last_week_uploads > 0:
            previous_week_uploads = UploadedFile.objects.filter(
                user=request.user,
                uploaded_at__lt=week_ago,
                uploaded_at__gte=week_ago - timedelta(days=7)
            ).count()
            if previous_week_uploads > 0:
                uploads_trend = ((last_week_uploads - previous_week_uploads) / previous_week_uploads) * 100
        
        return Response({
            'total_uploads': total_uploads,
            'uploads_trend': uploads_trend,
            'last_week_uploads': last_week_uploads,
            'active_users': 1,  # Since we're looking at single user stats
            'users_trend': 0,
            'total_clicks': 0,  # Placeholder for future analytics
            'clicks_trend': 0,  # Placeholder for future analytics
        })
    except Exception as e:
        print('Error fetching dashboard stats:', str(e))
        return Response({'error': 'An error occurred while fetching dashboard stats'},
                      status=status.HTTP_500_INTERNAL_SERVER_ERROR)
