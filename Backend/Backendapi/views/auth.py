from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    if request.method == 'POST':
        try:
            print('Received data:', request.data)
            username = request.data.get('username')
            password = request.data.get('password')
            email = request.data.get('email')

            if not username or not password:
                return Response({'error': 'Please provide both username and password'},
                              status=status.HTTP_400_BAD_REQUEST)

            if User.objects.filter(username=username).exists():
                return Response({'error': 'Username already exists'},
                              status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.create_user(username=username, password=password, email=email)
            token, _ = Token.objects.get_or_create(user=user)
            
            return Response({
                'token': token.key,
                'user_id': user.id,
                'username': user.username
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            print('Error during registration:', str(e))
            return Response({'error': 'An error occurred during registration'},
                          status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    if request.method == 'POST':
        try:
            username = request.data.get('username')
            password = request.data.get('password')

            if not username or not password:
                return Response({'error': 'Please provide both username and password'},
                              status=status.HTTP_400_BAD_REQUEST)

            user = authenticate(username=username, password=password)

            if not user:
                return Response({'error': 'Invalid credentials'},
                              status=status.HTTP_401_UNAUTHORIZED)
                
            token, _ = Token.objects.get_or_create(user=user)
            
            print('=== Login Debug Info ===')
            print('Generated token:', token.key)
            print('User:', user.username)
            print('=====================')
            
            return Response({
                'token': token.key,
                'user_id': user.id,
                'username': user.username
            })
        except Exception as e:
            print('Error during login:', str(e))
            return Response({'error': 'An error occurred during login'},
                          status=status.HTTP_500_INTERNAL_SERVER_ERROR)
