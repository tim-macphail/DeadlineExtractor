import random
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
                    "highlight": {
                        "id": str(random.randint(1000, 9999)),  # Random ID for the highlight
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
    assert len(sys.argv) > 1, "PDF path is required"
    assert len(sys.argv) > 2, "Search text is required"
    pdf_path = sys.argv[1]
    search_text = sys.argv[2]
    
    results = find_text_with_position(pdf_path, search_text)
    
    if results:
        # format the output like
        print(json.dumps(results, indent=4))
    else:
        print("Text not found in the document.")

if __name__ == "__main__":
    main()
