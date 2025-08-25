from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


response = [
    {
        "date": "2023-10-15",
        "id": "1",
        "name": "Project Proposal",
        "highlight": {
            "id": "1",
            "comment": {
                "emoji": "",
                "text": "In this paper we"
            },
            "content": {
                "text": "In this paper we"
            },
            "position": {
                "boundingRect": {
                    "x1": 45.827999114990234,
                    "y1": 197.7198028564453,
                    "x2": 103.40967559814453,
                    "y2": 206.59608459472656,
                    "width": 486.0,
                    "height": 720.0
                },
                "rects": [
                    {
                        "x1": 45.827999114990234,
                        "y1": 197.7198028564453,
                        "x2": 103.40967559814453,
                        "y2": 206.59608459472656,
                        "width": 486.0,
                        "height": 720.0
                    }
                ],
                "pageNumber": 1
            }
        }
    }
]

@app.get("/api/document")
async def get_document():
    return response

@app.post("/api/document")
async def upload_document(file: UploadFile = File(...)):
    # Log PDF information
    print(f"Received PDF file: {file.filename}")
    print(f"Content type: {file.content_type}")
    print(f"File size: {file.size} bytes")

    # Read file content to verify it's a PDF
    content = await file.read()
    print(f"File content length: {len(content)} bytes")

    # For now, just return the hardcoded response
    # In the future, this could process the PDF and extract deadlines
    return response

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
