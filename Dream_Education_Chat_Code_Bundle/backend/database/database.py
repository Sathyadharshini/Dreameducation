import sqlite3
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DB_PATH = PROJECT_ROOT / 'database' / 'dream_education.db'
DB_PATH.parent.mkdir(parents=True, exist_ok=True)

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute('PRAGMA foreign_keys = ON')
    return conn

def initialize_database():
    schema_path = Path(__file__).with_name('schema.sql')
    conn = get_connection()
    try:
        conn.executescript(schema_path.read_text(encoding='utf-8'))
        conn.commit()
    finally:
        conn.close()

if __name__ == '__main__':
    initialize_database()
    print(f'Database initialized at {DB_PATH}')
