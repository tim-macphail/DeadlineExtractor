import tempfile
import os
from search import find_text_with_position
from parse import extract_pdf_data
from llm import mock_search_for_deadlines


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
        pdf_data = extract_pdf_data(temp_file_path, include_tables=False)
        extracted_text = pdf_data['text']

        print(f"Extracted text length: {len(extracted_text)} characters")

        # Send text to LLM to find deadlines
        deadlines = mock_search_for_deadlines(extracted_text)
        print(f"Found {len(deadlines)} potential deadlines")

        # For each deadline, find its position in the PDF
        results = []
        for i, deadline in enumerate(deadlines):
            source_text = deadline['sourceText']
            print(f"Searching for deadline {i+1}: '{source_text}'")

            # Find position data for this source text
            position_results = find_text_with_position(temp_file_path, source_text)

            if position_results:
                # Create result objects using actual deadline data instead of hardcoded values
                result = {
                    "date": deadline['date'],
                    "name": deadline['name'],
                    "description": deadline['description'],
                    "id": position_results[0]['highlight']['id'],
                    "highlight": position_results[0]['highlight']
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
