from typing import List

MAX_LENGTH = 2048

def tokenize_text(text: str) -> List[str]:
    lines = text.split("\n")
    line_map = map(lambda x: (len(x), x), lines)

    messages = []
    current_message = ""
    for size, x in line_map:
        current_len = len(current_message)
        if current_len + size < MAX_LENGTH:
            current_message += x + "\n"
        else:
            messages.append(current_message)
            current_message = x + "\n"
    messages.append(current_message)

    # Handle specially long cases
    if text.startswith("MongoDB Server Information"):
        return messages[:2]

    return messages
