from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from document_service import process_document

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
    # Read file content
    content = await file.read()

    # Process the document using the service layer
    results = process_document(content, file.filename)

    # Return the results
    return results
