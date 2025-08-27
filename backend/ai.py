import os
from google import genai
import json

client = genai.Client(api_key=os.getenv("GENAI_API_KEY"))


prompt = """Extract deadlines from the following text that was read from a pdf document using pymupdf. The schema is
```
interface Deadline {
  name: string;
  date: string; // format: 2025-08-26 or 2025-08-26T23:11 if time-specific
  description?: string;
  sourceText: string; // the text snippet from the document that was used to identify this deadline
}
```
You do not need to use pymuypdf, that is just how the text was extracted.
Return an array of these objects, for example
[
    {
        name: "Project Proposal Submission",
        date: "2025-08-26",
        description: "Submit the initial project proposal to the committee.",
        sourceText: "Project Proposal Submission - 2025-08-26: Submit the initial project proposal to the committee."
    },
    {
        name: "Final Report Deadline",
        date: "2025-12-15T17:00",
        description: "",
        sourceText: "Final Report Deadline - 2025-12-15T17:00: "
    }
]

Only return valid JSON, no explanations or extra text. Adding extra text will cause the JSON parser to fail.
Here is the text to analyze:
"""


def get_deadlines(text: str):
    message = prompt + '"""' + text + '"""'

    print("Sending to LLM:")
    print(message)

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=message,
    )

    print(response.text)

    response_text = response.text[7:-3]

    return json.loads(response_text)

