import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Navbar/Navbar';
import ProgressOverview from './ProgressOverview';
import SubjectGrid from './SubjectGrid';
import CourseView from './CourseView';
import LessonViewer from './LessonViewer';
import Profile from './Profile';
import About from './About';
import Settings from './Settings';
import DailyQuiz from './DailyQuiz';

type View = 'subjects' | 'course' | 'lesson' | 'profile' | 'about' | 'settings' | 'quiz';

export default function Dashboard() {
  const { student, signOut } = useAuth();
  const [view, setView] = useState<View>('subjects');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  if (!student) return null;

  const handleSubjectSelect = (id: string) => { setSelectedSubject(id); setView('course'); };
  const handleCourseSelect = (course: any) => { setSelectedCourse(course); setSelectedLesson(null); setView('lesson'); };
  const handleBack = () => {
    if (view === 'lesson') { setSelectedCourse(null); setSelectedLesson(null); setView('course'); }
    else if (view === 'course') { setSelectedSubject(null); setView('subjects'); }
  };

  return <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-slate-50">
    <Navbar student={student} currentView={view} onNavigate={setView} onSignOut={signOut} />
    <main className="max-w-7xl mx-auto px-4 py-8">
      {view === 'subjects' && <><ProgressOverview studentId={student.id} /><SubjectGrid classLevel={student.class_level} onSubjectSelect={handleSubjectSelect} /></>}
      {view === 'course' && selectedSubject && <CourseView subjectId={selectedSubject} classLevel={student.class_level} onCourseSelect={handleCourseSelect} onBack={handleBack} />}
      {view === 'lesson' && selectedCourse && <LessonViewer course={selectedCourse} selectedLesson={selectedLesson} onLessonSelect={setSelectedLesson} onBack={handleBack} studentId={student.id} />}
      {view === 'profile' && <Profile student={student} />}
      {view === 'about' && <About />}
      {view === 'settings' && <Settings />}
      {view === 'quiz' && <DailyQuiz studentId={student.id} />}
    </main>
  </div>;
}
