def mock_search_for_deadlines(text: str):
    apiResponse = [{
        "sourceText": "In this paper",
        "name": "Assignment 5",
        "date": "2023-10-10",
        "description": "" # description is optional
    }]

    # return api response but each one gets a unique id property
    return [{"id": str(i + 1), **item} for i, item in enumerate(apiResponse)]