from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from document_service import process_document
import os
import logging
from dotenv import load_dotenv
from logging_config import setup_logging

load_dotenv()

# Set up logging
setup_logging()
logger = logging.getLogger(__name__)

# Sanity check: Verify environment variables are loaded
logger.info(f"GENAI_API_KEY loaded: {'Yes' if os.getenv('GENAI_API_KEY') else 'No'}")
logger.info(f"CORS_ORIGINS loaded: {os.getenv('CORS_ORIGINS')}")

app = FastAPI()

# Configure CORS
cors_origins_str = os.getenv("CORS_ORIGINS", "http://localhost:5173")
cors_origins = cors_origins_str.split(",")
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
