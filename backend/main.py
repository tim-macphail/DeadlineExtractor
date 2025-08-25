from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import os
from search import find_text_with_position

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)




@app.post("/api/document")
async def upload_document(file: UploadFile = File(...)):
    # Log PDF information
    print(f"Received PDF file: {file.filename}")
    print(f"Content type: {file.content_type}")
    print(f"File size: {file.size} bytes")

    # Read file content
    content = await file.read()
    print(f"File content length: {len(content)} bytes")

    # Create temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
        temp_file.write(content)
        temp_file_path = temp_file.name

    try:
        # Search for the specified text in the PDF
        search_text = "In this paper we"
        results = find_text_with_position(temp_file_path, search_text)

        # Log search results
        print(f"Found {len(results)} instances of '{search_text}'")

        # Return search results
        return results

    except Exception as e:
        print(f"Error processing PDF: {e}")
        # Return empty list on error
        return []

    finally:
        # Clean up temporary file
        if os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
            print(f"Cleaned up temporary file: {temp_file_path}")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
