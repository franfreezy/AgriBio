from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
import os
import json
from django.conf import settings
import pandas as pd
import numpy as np

class AnalysisViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        """List all analyzed files"""
        analysis_dir = os.path.join(settings.MEDIA_ROOT, 'analysis')
        if not os.path.exists(analysis_dir):
            return Response([])
            
        files = [f for f in os.listdir(analysis_dir) if f.endswith('.json')]
        return Response(files)
    
    def retrieve(self, request, pk=None):
        """Get analysis data for a specific file"""
        analysis_path = os.path.join(settings.MEDIA_ROOT, 'analysis', pk)
        if not os.path.exists(analysis_path):
            return Response(
                {'error': 'Analysis file not found'},
                status=status.HTTP_404_NOT_FOUND
            )
            
        try:
            with open(analysis_path, 'r') as f:
                analysis_data = json.load(f)
            return Response(analysis_data)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
