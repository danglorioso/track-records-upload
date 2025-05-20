from http.server import BaseHTTPRequestHandler
import json
import os
import sys
import tempfile
from urllib.parse import parse_qs

# Import local modules
sys.path.append(os.path.dirname(__file__))
from parser import parse_results

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Get content-type and content-length
        content_length = int(self.headers.get('content-length', 0))
        content_type = self.headers.get('content-type', '')

        # Check for multipart form data
        if not content_type.startswith('multipart/form-data'):
            self.send_error(400, "Expected multipart/form-data")
            return

        # Read the body
        post_data = self.rfile.read(content_length)
        
        # The boundary is defined in the content-type header
        boundary = content_type.split('=')[1].strip()
        
        # Parse multipart form data (simplified, in real code use a proper library)
        fields = {}
        files = {}
        
        # This is a simple multipart parser that isn't production-ready
        # In production, use a proper library or the built-in functionality of frameworks
        
        try:
            # Parse the multipart data to extract the file and fields
            # This is where you'd use a library in production
            # For this example, we'll create a temporary file to work with
            
            with tempfile.NamedTemporaryFile(suffix='.txt', delete=False) as temp_file:
                temp_file.write(b"Sample meet data for testing\nEvent 1 Boys 100m\n1 John Doe 12 School Name 10.23")
                temp_file_path = temp_file.name
            
            # Extract metadata from form fields (in a real implementation)
            metadata = {
                "Meet Date": "2023-05-15",  # Default/example values
                "Meet Location": "Example Stadium",
                "Edition": "1st",
                "Meet Name": "Example Track Meet",
                "Timing": "FAT",
                "URL": "https://example.com",
                "Season": "Outdoor"
            }
            
            # Parse the results using our function
            output_file = parse_results(temp_file_path, metadata)
            
            # Read the generated CSV
            with open(output_file, 'r') as f:
                csv_content = f.read()
            
            # Clean up temporary files
            os.unlink(temp_file_path)
            os.unlink(output_file)
            
            # Prepare the response
            response_data = {
                'success': True,
                'data': csv_content
            }
            
            # Send successful response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode())
            
        except Exception as e:
            # Send error response
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                'success': False,
                'error': str(e)
            }).encode())