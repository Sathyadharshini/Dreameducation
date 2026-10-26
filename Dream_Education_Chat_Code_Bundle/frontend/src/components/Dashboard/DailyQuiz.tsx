import { useEffect, useState } from 'react';
import { Trophy, ArrowRight } from 'lucide-react';
import { getDailyQuiz, submitQuiz } from '../../services/api';

export default function DailyQuiz({ studentId }: { studentId: string }) {
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadQuiz() {
    try {
      setLoading(true); setError('');
      const result = await getDailyQuiz();
      setQuiz(result.quiz);
      setQuestions((result.questions || []).map((q: any) => ({ ...q, options: Array.isArray(q.options) ? q.options : JSON.parse(q.options || '[]') })));
    } catch (e: any) { setError(e.message || 'Failed to load quiz'); }
    finally { setLoading(false); }
  }
  useEffect(() => { void loadQuiz(); }, []);

  async function finish() {
    try {
      setLoading(true);
      const result = await submitQuiz(studentId, quiz.id, answers);
      setScore(result.score ?? 0);
    } catch (e: any) { setError(e.message || 'Failed to submit quiz'); }
    finally { setLoading(false); }
  }

  if (loading) return <p className="py-20 text-center">Loading today's quiz...</p>;
  if (error) return <div className="rounded-2xl bg-white p-10 text-center"><h2 className="text-2xl font-bold">Quiz error</h2><p className="mt-3 text-gray-600">{error}</p><button onClick={loadQuiz} className="mt-5 rounded-lg bg-cyan-600 px-5 py-2 text-white">Try again</button></div>;
  if (!quiz || !questions.length) return <div className="rounded-2xl bg-white p-10 text-center"><Trophy className="mx-auto mb-4 h-16 w-16 text-yellow-500" /><h2 className="text-2xl font-bold">No Quiz Available</h2><p className="mt-2 text-gray-600">Today's quiz hasn't been created yet.</p></div>;
  if (score !== null) return <div className="rounded-2xl bg-white p-10 text-center"><Trophy className="mx-auto mb-5 h-20 w-20 text-yellow-500" /><h2 className="text-3xl font-bold">Quiz Completed!</h2><p className="mt-3">Your score</p><p className="mt-2 text-5xl font-bold text-cyan-600">{score}</p></div>;

  const q = questions[current];
  const selected = answers[q.id] || '';
  return <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
    <div className="mb-6 flex items-center justify-between"><div><h2 className="text-3xl font-bold">Daily Quiz</h2><p className="mt-1 text-gray-600">{quiz.title}</p></div><Trophy className="h-10 w-10 text-yellow-500" /></div>
    <p className="text-sm text-gray-500">Question {current + 1} of {questions.length}</p>
    <div className="mb-6 mt-2 h-2 w-full rounded-full bg-gray-200"><div className="h-2 rounded-full bg-cyan-600" style={{ width: `${((current + 1) / questions.length) * 100}%` }} /></div>
    <h3 className="mb-6 text-xl font-semibold">{q.question}</h3>
    <div className="space-y-3">{q.options.map((option: string, i: number) => <button key={i} onClick={() => setAnswers(prev => ({ ...prev, [q.id]: option }))} className={`w-full rounded-xl border p-4 text-left ${selected === option ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-gray-200 hover:bg-gray-50'}`}>{option}</button>)}</div>
    <button disabled={!selected} onClick={() => current < questions.length - 1 ? setCurrent(current + 1) : void finish()} className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 py-3 text-white disabled:opacity-50">{current === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}<ArrowRight className="h-5 w-5" /></button>
  </div>;
}
