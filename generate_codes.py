
import json
import base64
import urllib.parse
import time

def generate_code(name, total_score, quiz_count=15):
    # Mocking a game state
    state = {
        "player": name,
        "startTime": int(time.time() * 1000) - 3600000, # 1 hour ago
        "scores": {},
        "totalScore": total_score,
        "visited": [f"quiz{i}" for i in range(1, quiz_count + 1)] + ["result"]
    }
    
    # Distribute score loosely (doesn't have to be perfect for this test)
    points_per_quiz = total_score // quiz_count
    for i in range(1, quiz_count + 1):
        state["scores"][f"quiz{i}"] = {
            "points": points_per_quiz,
            "time": 30,
            "status": "completed"
        }
        
    json_str = json.dumps(state)
    encoded_uri = urllib.parse.quote(json_str)
    base64_str = base64.b64encode(encoded_uri.encode('utf-8')).decode('utf-8')
    
    return base64_str

players = [
    ("Thrall", 14500),
    ("Jaina", 14200),
    ("Sylvanas", 13800),
    ("Anduin", 12500),
    ("Garrosh", 9000)
]

print("Here are 5 codes for the leaderboard:\n")
for name, score in players:
    code = generate_code(name, score)
    print(f"Name: {name} (Score: {score})\nCode: {code}\n")
