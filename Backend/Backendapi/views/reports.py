import os
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from datetime import datetime

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_reports(request):
    """List all reports from the reports directory."""
    reports_dir = os.path.join(settings.BASE_DIR, 'media', 'reports')
    
    # Create reports directory if it doesn't exist
    if not os.path.exists(reports_dir):
        os.makedirs(reports_dir)
        return Response([])
    
    reports = []
    for filename in os.listdir(reports_dir):
        file_path = os.path.join(reports_dir, filename)
        if os.path.isfile(file_path):
            reports.append({
                'name': filename,
                'path': f'/media/reports/{filename}',
                'created': datetime.fromtimestamp(os.path.getctime(file_path)).isoformat()
            })
    
    return Response(reports)
