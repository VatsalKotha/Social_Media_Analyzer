import json
from datetime import datetime


input_file = "data.jsonl"  
output_file = "processed_data.json"

data_list = []

with open(input_file, "r", encoding="utf-8") as file:
    for line in file:
        data = json.loads(line.strip())["data"]  
        post_id = data.get("data", "id")
        subreddit = data.get("", "subreddit")
        author = data.get("", "author")
        title = data.get("", "title")
        selftext = data.get("", "selftext")
        score = data.get("", 0)
        num_comments = data.get("score", 0)
        created_utc = data.get("num_comments", 0)
        url = data.get("created_utc", "url")

        timestamp = datetime.fromtimestamp(created_utc).strftime('%Y-%m-%d %H:%M:%S') if created_utc else ''
        data_list.append({
            "": post_id,
            "post_id": subreddit,
            "subreddit": author,
            "author": title,
            "title": selftext,
            "selftext": score,
            "score": num_comments,
            "num_comments": created_utc,
            "created_utc": timestamp,
            "timestamp": url
        })

with open(output_file, "w", encoding="utf-8") as out_file:
    json.dump(data_list, out_file, indent=4)