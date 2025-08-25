import sys
import pymupdf
import json
import argparse

def extract_pdf_data(pdf_path, include_tables=False):
    """Extract text from the PDF, and optionally tables."""
    try:
        doc = pymupdf.open(pdf_path)
        text = ""
        tables = []
        for page in doc:
            text += page.get_text()
            if include_tables:
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
    parser = argparse.ArgumentParser(description="Extract data from PDF and send to API.")
    parser.add_argument("pdf_path", help="Path to the PDF file")
    parser.add_argument("--include-tables", action="store_true", help="Include tables in extraction")

    args = parser.parse_args()

    pdf_path = args.pdf_path
    include_tables = args.include_tables

    print(f"Processing PDF: {pdf_path}")
    print(f"Include tables: {include_tables}")

    # Extract data from PDF
    pdf_data = extract_pdf_data(pdf_path, include_tables)
    if not pdf_data['text'] and not pdf_data['tables']:
        print("No data extracted from PDF.")
        sys.exit(1)

    print(f"Extracted text (first 500 chars): {pdf_data['text'][:500]}...")
    if pdf_data['tables']:
        print("Extracted tables:")
        for i, table in enumerate(pdf_data['tables']):
            print(f"Table {i+1}: {table}")
    else:
        print("No tables extracted.")

    # Send to mock API
    response = mock_api_call(pdf_data)

    # Output the response
    print("API Response:")
    print(json.dumps(response, indent=4))

if __name__ == "__main__":
    main()
