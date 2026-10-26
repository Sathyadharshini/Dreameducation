const API_BASE_URL = 'http://127.0.0.1:5000/api';

export interface Student {
  id: string;
  email: string;
  full_name: string;
  class_level: number;
  total_points: number;
  daily_streak: number;
  created_at?: string;
  last_login?: string;
}

async function parseResponse(response: Response, fallback: string) {
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || fallback);
  return result;
}

export async function getSubjects() {
  return parseResponse(await fetch(`${API_BASE_URL}/subjects`), 'Failed to load subjects');
}
export async function getStudentProgress(studentId: string) {
  return parseResponse(await fetch(`${API_BASE_URL}/progress/${studentId}`), 'Failed to load progress');
}
export async function signupStudent(data: { email: string; password: string; full_name: string; class_level: number }) {
  return parseResponse(await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  }), 'Signup failed');
}
export async function loginStudent(email: string, password: string) {
  return parseResponse(await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }),
  }), 'Login failed');
}
export async function getStudent(studentId: string) {
  return parseResponse(await fetch(`${API_BASE_URL}/auth/student/${studentId}`), 'Failed to load student');
}
export async function getSubject(subjectId: string) {
  return parseResponse(await fetch(`${API_BASE_URL}/subjects/${subjectId}`), 'Failed to load subject');
}
export async function getCourses(subjectId: string, classLevel: number) {
  return parseResponse(await fetch(`${API_BASE_URL}/courses?subject_id=${encodeURIComponent(subjectId)}&class_level=${classLevel}`), 'Failed to load courses');
}
export async function getModules(courseId: string) {
  return parseResponse(await fetch(`${API_BASE_URL}/modules?course_id=${encodeURIComponent(courseId)}`), 'Failed to load modules');
}
export async function getLessons(moduleId: string) {
  return parseResponse(await fetch(`${API_BASE_URL}/lessons?module_id=${encodeURIComponent(moduleId)}`), 'Failed to load lessons');
}

// These endpoint names are examples. Match them to your backend quiz blueprint.
export async function getDailyQuiz() {
  return parseResponse(await fetch(`${API_BASE_URL}/quizzes/today`), "Failed to load today's quiz");
}
export async function submitQuiz(studentId: string, quizId: string, answers: Record<string, string>) {
  return parseResponse(await fetch(`${API_BASE_URL}/quizzes/submit`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ student_id: studentId, quiz_id: quizId, answers }),
  }), 'Failed to submit quiz');
}
