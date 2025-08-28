import random
import logging
import pymupdf  # PyMuPDF

logger = logging.getLogger(__name__)

class NoHighlightFoundError(Exception):
    """Raised when no highlight positions are found for the given search text."""
    pass

def get_highlight_position(pdf_path, search_text):
    """
    Find specific text in PDF and return the first position in react-pdf-highlighter format

    Args:
        pdf_path (str): Path to the PDF file
        search_text (str): Text to search for (e.g., "May 5, 2020")

    Returns:
        dict: The first highlight position object matching the react-pdf-highlighter format

    Raises:
        NoHighlightFoundError: If no positions are found for the search text
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

        if not results:
            raise NoHighlightFoundError(f"No highlights found for text: '{search_text}'")

        # Return the first highlight position
        return results[0]['highlight']

    except NoHighlightFoundError:
        # Re-raise our custom exception
        raise
    except Exception as e:
        logger.error(f"Error processing PDF: {e}")
        raise NoHighlightFoundError(f"Error searching for text: '{search_text}'") from e
