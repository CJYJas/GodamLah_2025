import json
import os

DB_PATH = "data/users.json"
ATTEMPT_PATH = "data/attempts.json"

os.makedirs("data", exist_ok=True)

# Initialize files if not exist
for path in [DB_PATH, ATTEMPT_PATH]:
    if not os.path.exists(path):
        with open(path, "w") as f:
            json.dump({}, f)


def read_json(path):
    with open(path, "r") as f:
        return json.load(f)


def write_json(path, data):
    with open(path, "w") as f:
        json.dump(data, f, indent=4)


# USER FUNCTIONS ------------------
def save_user(user):
    db = read_json(DB_PATH)
    db[user["ic_number"]] = user
    write_json(DB_PATH, db)


def get_user(ic_number):
    db = read_json(DB_PATH)
    return db.get(ic_number)


# ATTEMPT FUNCTIONS ---------------
def get_attempts(ic_number):
    db = read_json(ATTEMPT_PATH)
    return db.get(ic_number, 0)


def save_attempt(ic_number):
    db = read_json(ATTEMPT_PATH)
    db[ic_number] = db.get(ic_number, 0) + 1
    write_json(ATTEMPT_PATH, db)
    return db[ic_number]


def reset_attempts(ic_number):
    db = read_json(ATTEMPT_PATH)
    db[ic_number] = 0
    write_json(ATTEMPT_PATH, db)
