import pymupdf

def get_text_from_pdf(pdf_path, include_tables=False):
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
