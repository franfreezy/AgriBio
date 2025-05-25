from django.db import models
from django.contrib.auth.models import User

class UploadedFile(models.Model):
    file = models.FileField(upload_to='uploads/')
    name = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('waiting', 'Waiting'),
            ('processing', 'Processing'),
            ('cleaned', 'Cleaned'),
            ('error', 'Error'),
        ],
        default='waiting'
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file_type = models.CharField(max_length=50)
    size = models.BigIntegerField()
    row_count = models.IntegerField(null=True, blank=True)
    column_count = models.IntegerField(null=True, blank=True)
    missing_values = models.JSONField(default=dict, blank=True)
    duplicates_removed = models.IntegerField(default=0)
    error_message = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name
