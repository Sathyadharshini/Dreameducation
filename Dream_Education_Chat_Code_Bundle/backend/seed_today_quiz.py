from datetime import date
import json
import uuid
from database.database import get_connection

QUESTIONS = [
    ('Which organ pumps blood throughout the human body?', ['Brain', 'Heart', 'Lungs', 'Kidneys'], 'Heart', 'The heart pumps blood through the circulatory system.', 10),
    ('Which is the largest bone in the human body?', ['Femur', 'Tibia', 'Humerus', 'Radius'], 'Femur', 'The femur is the thigh bone and the longest bone.', 10),
    ('Which organs help us breathe?', ['Lungs', 'Stomach', 'Liver', 'Pancreas'], 'Lungs', 'The lungs exchange oxygen and carbon dioxide.', 10),
    ('What protects the brain?', ['Rib cage', 'Skull', 'Pelvis', 'Spine'], 'Skull', 'The skull protects the brain.', 10),
    ('Which blood cells carry oxygen?', ['White blood cells', 'Platelets', 'Red blood cells', 'Nerve cells'], 'Red blood cells', 'Red blood cells contain haemoglobin.', 10),
]

def seed_today_quiz():
    today = date.today().isoformat()
    conn = get_connection()
    try:
        subject = conn.execute('SELECT id FROM subjects WHERE lower(name)=lower(?) LIMIT 1', ('Biology',)).fetchone()
        if not subject:
            raise RuntimeError('Biology subject not found in subjects table.')
        existing = conn.execute('SELECT id,title FROM daily_quizzes WHERE date=?', (today,)).fetchone()
        if existing:
            print(f"Today's quiz already exists: {existing['title']} ({today})")
            return
        quiz_id = str(uuid.uuid4())
        conn.execute(
            'INSERT INTO daily_quizzes (id,date,subject_id,title,description,points_reward) VALUES (?,?,?,?,?,?)',
            (quiz_id, today, subject['id'], 'Biology Daily Challenge', 'Test your knowledge of the human body and biology.', 50)
        )
        for index, item in enumerate(QUESTIONS, start=1):
            question, options, correct, explanation, points = item
            conn.execute(
                'INSERT INTO quiz_questions (id,quiz_id,question,options,correct_answer,explanation,points,order_index) VALUES (?,?,?,?,?,?,?,?)',
                (str(uuid.uuid4()), quiz_id, question, json.dumps(options), correct, explanation, points, index)
            )
        conn.commit()
        print(f'Created Biology quiz for {today} with {len(QUESTIONS)} questions.')
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == '__main__':
    seed_today_quiz()
