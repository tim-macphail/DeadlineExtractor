import random
import tempfile
import os
from ai import get_deadlines
from get_highlight_positions import get_highlight_position, NoHighlightFoundError
from get_text_from_pdf import get_text_from_pdf
from find_deadlines_in_text import find_deadlines_in_text


def process_document(file_content: bytes, filename: str) -> list:
    """
    Process an uploaded document to extract deadlines with position information.

    Args:
        file_content (bytes): The raw content of the uploaded file
        filename (str): The original filename for logging purposes

    Returns:
        list: List of deadline objects with position information, or empty list on error
    """
    # Log PDF information
    print(f"Processing document: {filename}")
    print(f"File size: {len(file_content)} bytes")

    # Create temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
        temp_file.write(file_content)
        temp_file_path = temp_file.name

    try:
        # Extract text from the PDF (without tables)
        extracted_text = get_text_from_pdf(temp_file_path, include_tables=False)['text']
        print(f"Extracted {len(extracted_text)} characters")

        # Send text to LLM to find deadlines
        deadlines = get_deadlines(extracted_text[2900:3900])
        print(f"LLM found {len(deadlines)} deadlines")

        for deadline in deadlines:
            try:
                id  = str(random.randint(1000, 9999))  # Assign a random ID
                deadline['highlight'] = get_highlight_position(temp_file_path, deadline['sourceText'])
                deadline['highlight']['id'] = id
                deadline['id'] = id
            except NoHighlightFoundError as e:
                print(f"Warning: {e}. Skipping deadline '{deadline['name']}'")

        # Return search results
        return deadlines

    except Exception as e:
        print(f"Error processing document: {e}")
        # Return empty list on error
        return []

    finally:
        # Clean up temporary file
        if os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
            print(f"Cleaned up temporary file: {temp_file_path}")
