"""
Custom middleware to handle exceptions and return JSON responses for API endpoints.
"""
import json
import traceback
from django.http import JsonResponse


class JSONErrorMiddleware:
    """
    Middleware to catch exceptions and return JSON error responses instead of HTML.
    This is essential for ESP32 and frontend API consumption.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        response = self.get_response(request)
        return response
    
    def process_exception(self, request, exception):
        """
        Convert exceptions to JSON responses for API endpoints.
        """
        # Only handle API paths (not Django admin, static files, etc.)
        api_paths = ['/users/', '/fingerprint/', '/attendance/', '/health/']
        
        if not any(request.path.startswith(path) for path in api_paths):
            return None  # Let Django handle non-API errors
        
        # Handle specific exceptions
        if isinstance(exception, FileNotFoundError):
            return JsonResponse({
                'status': 'error',
                'message': str(exception)
            }, status=500)
        
        # Handle any other exception
        error_message = str(exception) if str(exception) else type(exception).__name__
        
        # Log the full traceback for debugging
        print(f"API Error: {error_message}")
        traceback.print_exc()
        
        return JsonResponse({
            'status': 'error',
            'message': error_message
        }, status=500)
