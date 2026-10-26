import { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Clock } from 'lucide-react';
import ModelViewer from './ModelViewer';
import { getModules, getLessons } from '../../services/api';

export default function LessonViewer({ course, selectedLesson, onLessonSelect, onBack }: {
  course: any; selectedLesson: any; onLessonSelect: (lesson: any) => void; onBack: () => void; studentId: string;
}) {
  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try { setLoading(true); const result = await getModules(course.id); if (alive) setModules(result.modules || []); }
      catch (e) { console.error('Loading modules failed:', e); }
      finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [course?.id]);

  async function loadLessons(moduleId: string) {
    try {
      const result = await getLessons(moduleId);
      setLessons(prev => [...prev.filter(x => x.module_id !== moduleId), ...(result.lessons || [])]);
    } catch (e) { console.error('Loading lessons failed:', e); }
  }

  if (selectedLesson) return <div>
    <button onClick={() => onLessonSelect(null)} className="mb-6 flex items-center gap-2 text-gray-600"><ArrowLeft />Back to Lessons</button>
    <section className="rounded-2xl bg-white p-8 shadow-sm">
      <h2 className="mb-3 text-3xl font-bold">{selectedLesson.title}</h2><p className="mb-6 text-gray-600">{selectedLesson.description}</p>
      <div className="mb-8 flex gap-4 text-sm text-gray-500"><span><Clock className="inline h-4 w-4" /> {selectedLesson.duration_minutes} minutes</span><span><BookOpen className="inline h-4 w-4" /> {selectedLesson.content_type}</span></div>
      {selectedLesson.content_type === '3d_model' && selectedLesson.content_url
        ? <><h3 className="mb-4 text-xl font-bold">Explore in 3D</h3><ModelViewer modelPath={selectedLesson.content_url} /></>
        : <div className="rounded-xl bg-cyan-50 p-10 text-center"><h3 className="text-xl font-bold">Lesson Content</h3><p className="mt-2 text-gray-600">Interactive lesson content will appear here.</p></div>}
    </section>
  </div>;

  return <div>
    <button onClick={onBack} className="mb-6 flex items-center gap-2 text-gray-600"><ArrowLeft />Back to Courses</button>
    <h2 className="mb-2 text-3xl font-bold">{course.title}</h2><p className="mb-8 text-gray-600">{course.description}</p>
    {loading ? <p className="py-12 text-center">Loading modules...</p> : modules.length === 0 ? <p className="py-12 text-center text-gray-500">No modules available for this course yet.</p> :
      <div className="space-y-6">{modules.map(m => <section key={m.id} className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="text-xl font-bold">Module {m.order_index}: {m.title}</h3><p className="mt-1 text-gray-600">{m.description}</p>
        <button onClick={() => loadLessons(m.id)} className="my-4 rounded-lg bg-cyan-50 px-4 py-2 text-cyan-700">View Lessons</button>
        {lessons.filter(l => l.module_id === m.id).map(l => <button key={l.id} onClick={() => onLessonSelect(l)} className="mb-3 flex w-full items-center justify-between rounded-lg bg-gray-50 p-4 text-left hover:bg-cyan-50"><span><strong>{l.title}</strong><span className="mt-1 block text-sm text-gray-500">{l.description}</span></span><span className="text-sm text-gray-500">{l.duration_minutes} min</span></button>)}
      </section>)}</div>}
  </div>;
}
