import pymupdf  # PyMuPDF
import json
import sys

def find_text_with_position(pdf_path, search_text):
    """
    Find specific text in PDF and return position in react-pdf-highlighter format
    
    Args:
        pdf_path (str): Path to the PDF file
        search_text (str): Text to search for (e.g., "May 5, 2020")
    
    Returns:
        list: List of position objects matching the react-pdf-highlighter format
    """
    try:
        # Open the PDF
        doc = pymupdf.open(pdf_path)
        results = []
        
        # Search through each page
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            
            # Get page dimensions
            page_rect = page.rect
            page_width = page_rect.width
            page_height = page_rect.height
            
            # Search for the text
            text_instances = page.search_for(search_text)
            
            # Process each found instance
            for rect in text_instances:
                # Create position object in react-pdf-highlighter format
                position = {
                    "boundingRect": {
                        "x1": rect.x0,
                        "y1": rect.y0,
                        "x2": rect.x1,
                        "y2": rect.y1,
                        "width": page_width,
                        "height": page_height,
                    },
                    "rects": [
                        {
                            "x1": rect.x0,
                            "y1": rect.y0,
                            "x2": rect.x1,
                            "y2": rect.y1,
                            "width": page_width,
                            "height": page_height,
                        }
                    ],
                    "pageNumber": page_num + 1,  # react-pdf-highlighter uses 1-based indexing
                }
                
                results.append({
                    "date": "2023-10-15",
                    "id": "1",
                    "name": "Project Proposal",
                    "highlight": {
                        "id": "1",
                        "comment": {
                            "emoji": '',
                            "text": search_text,
                        },
                        "content": {
                            "text": search_text,
                        },
                        "position": position,
                    }
                })
        
        doc.close()
        return results
    
    except Exception as e:
        print(f"Error processing PDF: {e}")
        return []

def main():
    # Example usage
    pdf_path = "your_document.pdf"  # Replace with your PDF path
    search_text = "May 5, 2020"
    
    if len(sys.argv) > 1:
        pdf_path = sys.argv[1]
    if len(sys.argv) > 2:
        search_text = sys.argv[2]
    
    
    results = find_text_with_position(pdf_path, search_text)
    
    if results:
        # format the output like
        print(json.dumps(results, indent=4))
    else:
        print("Text not found in the document.")

# Alternative function for more flexible date searching
def find_dates_with_context(pdf_path, date_pattern=None):
    """
    Find dates with surrounding context text
    
    Args:
        pdf_path (str): Path to the PDF file
        date_pattern (str): Regex pattern for dates (optional)
    
    Returns:
        list: List of found dates with context and positions
    """
    import re
    
    # Default date patterns - matches various date formats
    if date_pattern is None:
        date_patterns = [
            r'\b\w+ \d{1,2}, \d{4}\b',  # May 5, 2020
            r'\b\d{1,2}/\d{1,2}/\d{4}\b',  # 5/5/2020
            r'\b\d{4}-\d{2}-\d{2}\b',  # 2020-05-05
        ]
    else:
        date_patterns = [date_pattern]
    
    try:
        doc = pymupdf.open(pdf_path)
        results = []
        
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            page_width = page.rect.width
            page_height = page.rect.height
            
            # Get all text blocks with positions
            text_dict = page.get_text("dict")
            
            for block in text_dict["blocks"]:
                if "lines" in block:
                    for line in block["lines"]:
                        line_text = ""
                        line_bbox = None
                        
                        for span in line["spans"]:
                            line_text += span["text"]
                            if line_bbox is None:
                                line_bbox = span["bbox"]
                            else:
                                # Expand bounding box to include this span
                                line_bbox = [
                                    min(line_bbox[0], span["bbox"][0]),
                                    min(line_bbox[1], span["bbox"][1]),
                                    max(line_bbox[2], span["bbox"][2]),
                                    max(line_bbox[3], span["bbox"][3])
                                ]
                        
                        # Check for date patterns
                        for pattern in date_patterns:
                            matches = re.finditer(pattern, line_text)
                            for match in matches:
                                position = {
                                    "boundingRect": {
                                        "x1": line_bbox[0],
                                        "y1": line_bbox[1],
                                        "x2": line_bbox[2],
                                        "y2": line_bbox[3],
                                        "width": page_width,
                                        "height": page_height,
                                    },
                                    "rects": [
                                        {
                                            "x1": line_bbox[0],
                                            "y1": line_bbox[1],
                                            "x2": line_bbox[2],
                                            "y2": line_bbox[3],
                                            "width": page_width,
                                            "height": page_height,
                                        }
                                    ],
                                    "pageNumber": page_num + 1,
                                }
                                
                                results.append({
                                    "date": match.group(),
                                    "context": line_text.strip(),
                                    "position": position,
                                    "page": page_num + 1
                                })
        
        doc.close()
        return results
    
    except Exception as e:
        print(f"Error processing PDF: {e}")
        return []

if __name__ == "__main__":
    main()
