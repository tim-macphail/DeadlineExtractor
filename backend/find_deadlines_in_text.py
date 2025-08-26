import random


def find_deadlines_in_text(text: str):
    apiResponse = []

    # Check if text is long enough for 15-character substrings
    if len(text) < 15:
        return apiResponse

    # Generate 5 random substrings of 15 characters each
    for i in range(15):
        # Generate random starting position (ensure we don't go beyond text length)
        max_start = len(text) - 15
        start_pos = random.randint(0, max_start)

        # Extract 15-character substring
        substring = text[start_pos:start_pos + 15]

        # Generate random date in August 2025 (August has 31 days)
        day = random.randint(1, 31)

        # Create deadline object
        deadline = {
            "sourceText": substring,
            "name": f"Assignment {i+1}",
            "date": f"2025-08-{day:02d}T23:11",
            # "date": f"2025-08-{i+1:02d}T23:11",
            "description": ""
        }

        apiResponse.append(deadline)

    # return api response but each one gets a unique id property
    return apiResponse
