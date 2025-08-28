from dotenv import load_dotenv
load_dotenv()

import os
from document_service import process_document
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile

app = FastAPI()

# Configure CORS
cors_origins = os.getenv("CORS_ORIGINS").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
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
