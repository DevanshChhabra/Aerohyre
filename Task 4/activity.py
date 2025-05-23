#generated sample data
import csv
from datetime import datetime, timedelta
import random

users = [f"user{i}" for i in range(1, 11)]
actions = ["click", "view", "scroll", "purchase"]

start_time = datetime.now()

with open("activity.csv", "w", newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(["timestamp", "user_id", "action"])
    
    for i in range(500):
        ts = start_time + timedelta(seconds=random.randint(0, 3600))
        iso_ts = ts.isoformat() + "Z"
        writer.writerow([iso_ts, random.choice(users), random.choice(actions)])

with open("activity.csv", "a", newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    base_time = datetime.now()
    for i in range(12):  # 12 actions within 5 minutes
        ts = base_time + timedelta(seconds=i * 20)
        iso_ts = ts.isoformat() + "Z"
        writer.writerow([iso_ts, "user_suspicious", "click"])



from collections import defaultdict, deque, Counter
import json
import heapq
import sys

def parse_iso_timestamp(ts):
    return datetime.fromisoformat(ts.replace("Z", "+00:00"))

def read_activity_log(file_path, chunk_size=10000):
    #Reads the CSV file in chunks
    with open(file_path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        chunk = []
        for row in reader:
            chunk.append(row)
            if len(chunk) >= chunk_size:
                yield chunk
                chunk = []
        if chunk:
            yield chunk

def process_activity(file_path):
    action_count = Counter()
    action_times = defaultdict(lambda: defaultdict(list))  # user_id -> action -> [timestamps]

    for chunk in read_activity_log(file_path):
        for row in chunk:
            timestamp = parse_iso_timestamp(row['timestamp'])
            user_id = row['user_id']
            action = row['action']

            action_count[user_id] += 1
            action_times[user_id][action].append(timestamp)

    # Top 5 users by action count
    top_5_users = heapq.nlargest(5, action_count.items(), key=lambda x: x[1])

    # Users performing same action >10 times within any 5-minute window
    suspicious_users = []

    for user_id, actions in action_times.items():
        for action, times in actions.items():
            times.sort()
            window = deque()
            for time in times:
                window.append(time)
                while (time - window[0]) > timedelta(minutes=5):
                    window.popleft()
                if len(window) > 10:
                    suspicious_users.append({
                        "user_id": user_id,
                        "action": action,
                        "count_in_5_min": len(window),
                        "window_start": window[0].isoformat(),
                        "window_end": time.isoformat()
                    })
                    break  
    return top_5_users, suspicious_users

def print_summary(top_users, suspicious):
    print("\n=== Top 5 Users by Action Count ===")
    for i, (user_id, count) in enumerate(top_users, 1):
        print(f"{i}. User: {user_id}, Actions: {count}")

    print("\n=== Suspicious Activity Detected ===")
    if suspicious:
        for entry in suspicious:
            print(f"User '{entry['user_id']}' performed '{entry['action']}' {entry['count_in_5_min']} times "
                  f"between {entry['window_start']} and {entry['window_end']}")
    else:
        print("No suspicious activity found.")

def export_json(top_users, suspicious, output_path="summary.json"):
    summary = {
        "top_users": [{"user_id": u, "action_count": c} for u, c in top_users],
        "suspicious_activity": suspicious
    }
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2)
    print(f"\n[+] Results exported to {output_path}")

if __name__ == "__main__":
    file_path = "activity.csv"
    try:
        top_users, suspicious = process_activity(file_path)
        print_summary(top_users, suspicious)
        export_json(top_users, suspicious)  
    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found.", file=sys.stderr)
