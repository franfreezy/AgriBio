from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from ..models import UploadedFile

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_file(request):
    print('=== Upload Request Debug Info ===')
    print('Auth Header:', request.headers.get('Authorization'))
    print('User:', request.user)
    print('Is Authenticated:', request.user.is_authenticated)
    print('Files:', request.FILES)
    print('Content Type:', request.content_type)
    print('==============================')

    if not request.user.is_authenticated:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

    if 'file' not in request.FILES:
        return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    file = request.FILES['file']
    
    try:
        # Create the directory if it doesn't exist
        from django.conf import settings
        import os
        media_root = settings.MEDIA_ROOT
        upload_dir = os.path.join(media_root, 'uploads')
        os.makedirs(upload_dir, exist_ok=True)        # Save the file
        uploaded_file = UploadedFile.objects.create(
            file=file,
            name=file.name,
            user=request.user,
            status='uploaded'  # File is just stored, no processing needed
        )
        
        return Response({
            'id': uploaded_file.id,
            'name': uploaded_file.name,
            'url': uploaded_file.file.url,
            'size': file.size,
            'status': 'uploaded',
            'file_type': file.name.split('.')[-1].upper() if '.' in file.name else 'Unknown'
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        print('Error during file upload:', str(e))
        return Response({
            'status': 'error',
            'message': str(e) if settings.DEBUG else 'An error occurred during file upload'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_files(request):    try:
        files = UploadedFile.objects.filter(user=request.user)
        files_data = [{
            'id': f.id,
            'name': f.name,
            'url': f.file.url,
            'size': f.file.size if f.file else 0,
            'status': 'uploaded',
            'uploaded_at': f.uploaded_at,
            'file_type': f.name.split('.')[-1].upper() if '.' in f.name else 'Unknown'
        } for f in files]
        return Response(files_data)
    except Exception as e:
        print('Error listing files:', str(e))
        return Response({'error': 'An error occurred while listing files'},
                      status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_file(request, file_id):
    try:
        file = UploadedFile.objects.get(id=file_id, user=request.user)
        file.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except UploadedFile.DoesNotExist:
        return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print('Error deleting file:', str(e))
        return Response({'error': 'An error occurred while deleting the file'},
                      status=status.HTTP_500_INTERNAL_SERVER_ERROR)
