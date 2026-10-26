PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS students (
 id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL,
 full_name TEXT NOT NULL, class_level INTEGER NOT NULL CHECK(class_level BETWEEN 1 AND 12),
 school_name TEXT, total_points INTEGER DEFAULT 0, daily_streak INTEGER DEFAULT 0,
 last_quiz_date TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP, last_login TEXT
);
CREATE TABLE IF NOT EXISTS subjects (
 id TEXT PRIMARY KEY, name TEXT UNIQUE NOT NULL, description TEXT NOT NULL,
 icon TEXT, color TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS courses (
 id TEXT PRIMARY KEY, subject_id TEXT NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL,
 class_level INTEGER NOT NULL CHECK(class_level BETWEEN 1 AND 12),
 difficulty TEXT NOT NULL CHECK(difficulty IN ('beginner','intermediate','advanced')),
 thumbnail_url TEXT, has_vr_content INTEGER DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS modules (
 id TEXT PRIMARY KEY, course_id TEXT NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL,
 order_index INTEGER DEFAULT 0, has_3d_content INTEGER DEFAULT 1, created_at TEXT DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS lessons (
 id TEXT PRIMARY KEY, course_id TEXT NOT NULL, module_id TEXT, title TEXT NOT NULL,
 description TEXT NOT NULL, order_index INTEGER DEFAULT 0,
 content_type TEXT NOT NULL CHECK(content_type IN ('3d_model','vr_experience','video','interactive')),
 content_url TEXT, vr_content_url TEXT, duration_minutes INTEGER DEFAULT 15,
 created_at TEXT DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(module_id) REFERENCES modules(id) ON DELETE CASCADE,
 FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS three_d_models (
 id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT, subject_id TEXT,
 model_path TEXT NOT NULL, thumbnail_path TEXT, supports_vr INTEGER DEFAULT 0,
 created_at TEXT DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS lesson_three_d_models (
 id TEXT PRIMARY KEY, lesson_id TEXT NOT NULL, model_id TEXT NOT NULL, display_order INTEGER DEFAULT 0,
 FOREIGN KEY(lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
 FOREIGN KEY(model_id) REFERENCES three_d_models(id) ON DELETE CASCADE, UNIQUE(lesson_id, model_id)
);
CREATE TABLE IF NOT EXISTS student_progress (
 id TEXT PRIMARY KEY, student_id TEXT NOT NULL, lesson_id TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'not_started' CHECK(status IN ('not_started','in_progress','completed')),
 completion_percentage INTEGER DEFAULT 0 CHECK(completion_percentage BETWEEN 0 AND 100),
 time_spent_minutes INTEGER DEFAULT 0, last_accessed TEXT DEFAULT CURRENT_TIMESTAMP,
 completed_at TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
 FOREIGN KEY(lesson_id) REFERENCES lessons(id) ON DELETE CASCADE, UNIQUE(student_id, lesson_id)
);
CREATE TABLE IF NOT EXISTS chat_history (
 id TEXT PRIMARY KEY, student_id TEXT NOT NULL, message TEXT NOT NULL, response TEXT NOT NULL,
 context TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS assessments (
 id TEXT PRIMARY KEY, lesson_id TEXT NOT NULL, question TEXT NOT NULL, options TEXT NOT NULL,
 correct_answer TEXT NOT NULL, explanation TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS student_assessments (
 id TEXT PRIMARY KEY, student_id TEXT NOT NULL, assessment_id TEXT NOT NULL,
 selected_answer TEXT NOT NULL, is_correct INTEGER NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
 FOREIGN KEY(assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS daily_quizzes (
 id TEXT PRIMARY KEY, date TEXT UNIQUE NOT NULL, subject_id TEXT NOT NULL, title TEXT NOT NULL,
 description TEXT NOT NULL, points_reward INTEGER DEFAULT 10, created_at TEXT DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS quiz_questions (
 id TEXT PRIMARY KEY, quiz_id TEXT NOT NULL, question TEXT NOT NULL, options TEXT NOT NULL,
 correct_answer TEXT NOT NULL, explanation TEXT, points INTEGER DEFAULT 10, order_index INTEGER DEFAULT 0,
 created_at TEXT DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(quiz_id) REFERENCES daily_quizzes(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS student_quiz_attempts (
 id TEXT PRIMARY KEY, student_id TEXT NOT NULL, quiz_id TEXT NOT NULL, score INTEGER DEFAULT 0,
 total_questions INTEGER NOT NULL, correct_answers INTEGER DEFAULT 0,
 completed_at TEXT DEFAULT CURRENT_TIMESTAMP, created_at TEXT DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
 FOREIGN KEY(quiz_id) REFERENCES daily_quizzes(id) ON DELETE CASCADE, UNIQUE(student_id, quiz_id)
);
CREATE TABLE IF NOT EXISTS achievements (
 id TEXT PRIMARY KEY, name TEXT UNIQUE NOT NULL, description TEXT NOT NULL, icon TEXT, points_reward INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS student_achievements (
 id TEXT PRIMARY KEY, student_id TEXT NOT NULL, achievement_id TEXT NOT NULL, earned_at TEXT DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
 FOREIGN KEY(achievement_id) REFERENCES achievements(id) ON DELETE CASCADE, UNIQUE(student_id, achievement_id)
);
CREATE INDEX IF NOT EXISTS idx_courses_subject ON courses(subject_id);
CREATE INDEX IF NOT EXISTS idx_courses_class ON courses(class_level);
CREATE INDEX IF NOT EXISTS idx_modules_course ON modules(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_progress_student ON student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_progress_lesson ON student_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_chat_student ON chat_history(student_id);
CREATE INDEX IF NOT EXISTS idx_assessments_lesson ON assessments(lesson_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_student ON student_quiz_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_models_subject ON three_d_models(subject_id);
