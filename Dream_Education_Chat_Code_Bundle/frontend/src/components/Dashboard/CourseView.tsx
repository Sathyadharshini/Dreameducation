import { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Glasses } from 'lucide-react';
import { getSubject, getCourses } from '../../services/api';

export default function CourseView({ subjectId, classLevel, onCourseSelect, onBack }: {
  subjectId: string; classLevel: number; onCourseSelect: (course: any) => void; onBack: () => void;
}) {
  const [courses, setCourses] = useState<any[]>([]);
  const [subject, setSubject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const [s, c] = await Promise.all([getSubject(subjectId), getCourses(subjectId, classLevel)]);
        if (alive) { setSubject(s.subject || s); setCourses(c.courses || c || []); }
      } catch (e) { console.error('Error loading course data:', e); }
      finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [subjectId, classLevel]);
  const colors: Record<string, string> = { beginner: 'bg-green-100 text-green-700', intermediate: 'bg-yellow-100 text-yellow-700', advanced: 'bg-red-100 text-red-700' };
  return <div>
    <button onClick={onBack} className="mb-6 flex items-center gap-2 text-gray-600"><ArrowLeft />Back to Subjects</button>
    {subject && <header className="mb-8"><h2 className="text-3xl font-bold">{subject.name}</h2><p className="text-gray-600">{subject.description}</p></header>}
    {loading ? <p>Loading courses...</p> : !courses.length ? <p className="py-12 text-center text-gray-500">No courses available for your class level yet.</p> :
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">{courses.map(c => <button key={c.id} onClick={() => onCourseSelect(c)} className="rounded-xl border border-gray-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        <h3 className="mb-2 text-xl font-bold">{c.title}</h3><p className="mb-4 text-sm text-gray-600">{c.description}</p>
        <div className="flex items-center justify-between"><span className="flex items-center text-xs text-gray-500"><BookOpen className="mr-1 h-4 w-4" />Class {c.class_level}</span>{c.has_vr_content && <span className="flex items-center text-xs text-blue-600"><Glasses className="mr-1 h-4 w-4" />VR Available</span>}<span className={`rounded-full px-3 py-1 text-xs ${colors[c.difficulty] || ''}`}>{c.difficulty}</span></div>
      </button>)}</div>}
  </div>;
}
