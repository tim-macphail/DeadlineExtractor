import sys
import pymupdf
import json

def extract_pdf_data(pdf_path):
    """Extract all text and tables from the PDF."""
    try:
        doc = pymupdf.open(pdf_path)
        text = ""
        tables = []
        for page in doc:
            text += page.get_text()
            page_tables = page.find_tables()
            for table in page_tables:
                tables.append(table.extract())
        doc.close()
        return {'text': text, 'tables': tables}
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return {'text': '', 'tables': []}

def mock_api_call(data):
    """Pretend to send text and tables to an API and return a response."""
    # Simulate processing time or API call
    print(f"Text length: {len(data['text'])} characters")
    print(f"Number of tables: {len(data['tables'])}")
    return {"deadlines": []}

def main():
    if len(sys.argv) != 2:
        print("Usage: python parse.py <pdf_path>")
        sys.exit(1)

    pdf_path = sys.argv[1]
    print(f"Processing PDF: {pdf_path}")

    # Extract data from PDF
    pdf_data = extract_pdf_data(pdf_path)
    if not pdf_data['text'] and not pdf_data['tables']:
        print("No data extracted from PDF.")
        sys.exit(1)

    print(json.dumps(pdf_data, indent=4))

    # Send to mock API
    response = mock_api_call(pdf_data)

    # Output the response
    print("API Response:")
    print(json.dumps(response, indent=4))

if __name__ == "__main__":
    main()
