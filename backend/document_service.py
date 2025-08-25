import tempfile
import os
from backend.get_highlight_positions import get_highlight_positions
from backend.get_text_from_pdf import get_text_from_pdf
from backend.find_deadlines_in_text import find_deadlines_in_text


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
        deadlines = find_deadlines_in_text(extracted_text)
        print(f"LLM found {len(deadlines)} deadlines")

        # For each deadline, find its position in the PDF
        results = []
        for deadline in deadlines:
            source_text = deadline['sourceText']
            print(f"Searching for deadline: '{source_text}'")

            # Find position data for this source text
            highlight_position = get_highlight_positions(temp_file_path, source_text)[0] # only use first result

            result = {
                "date": deadline['date'],
                "name": deadline['name'],
                "description": deadline['description'],
                "id": highlight_position['id'],
                "highlight": highlight_position['highlight']
            }
            results.append(result)

        # Log final results
        print(f"Total results: {len(results)}")

        # Return search results
        return results

    except Exception as e:
        print(f"Error processing document: {e}")
        # Return empty list on error
        return []

    finally:
        # Clean up temporary file
        if os.path.exists(temp_file_path):
            os.unlink(temp_file_path)
            print(f"Cleaned up temporary file: {temp_file_path}")
