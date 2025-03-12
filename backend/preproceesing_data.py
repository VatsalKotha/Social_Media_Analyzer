import json
from datetime import datetime

# Load JSONL file and process each line
input_file = "data.jsonl"  # Update with your file path
output_file = "processed_data.json"

data_list = []

with open(input_file, "r", encoding="utf-8") as file:
    for line in file:
        data = json.loads(line.strip())["data"]  # Extract the "data" field

        # Extract relevant fields
        post_id = data.get("id", "")
        subreddit = data.get("subreddit", "")
        author = data.get("author", "")
        title = data.get("title", "")
        selftext = data.get("selftext", "")
        score = data.get("score", 0)
        num_comments = data.get("num_comments", 0)
        created_utc = data.get("created_utc", 0)
        url = data.get("url", "")

        # Convert UNIX timestamp to human-readable format
        timestamp = datetime.utcfromtimestamp(created_utc).strftime('%Y-%m-%d %H:%M:%S') if created_utc else ""

        # Append processed data
        data_list.append({
            "post_id": post_id,
            "subreddit": subreddit,
            "author": author,
            "title": title,
            "selftext": selftext,
            "score": score,
            "num_comments": num_comments,
            "created_utc": created_utc,
            "timestamp": timestamp,
            "url": url
        })

# Save processed data as JSON
with open(output_file, "w", encoding="utf-8") as out_file:
    json.dump(data_list, out_file, indent=4)


print(f"✅ Processed data saved to {output_file}")