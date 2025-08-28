import logging
import sys

def setup_logging():
    """Configure logging for the backend with clickable file:line format for VSCode."""

    # Create logger
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    # Remove any existing handlers
    for handler in logger.handlers[:]:
        logger.removeHandler(handler)

    # Create console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)

    # Create formatter with clickable format
    formatter = logging.Formatter('%(filename)s:%(lineno)d - %(message)s')

    # Set formatter
    console_handler.setFormatter(formatter)

    # Add handler to logger
    logger.addHandler(console_handler)

    return logger

# Set up logging when module is imported
setup_logging()
