interface Props { student: { full_name: string; email: string; class_level: number; total_points: number; daily_streak: number }; }
export default function Profile({ student }: Props) {
  return <section className="bg-white rounded-2xl p-8 shadow-sm">
    <h2 className="text-3xl font-bold">Profile</h2>
    <div className="mt-6 space-y-3 text-gray-700">
      <p><strong>Name:</strong> {student.full_name}</p><p><strong>Email:</strong> {student.email}</p>
      <p><strong>Class:</strong> {student.class_level}</p><p><strong>Points:</strong> {student.total_points}</p>
      <p><strong>Daily streak:</strong> {student.daily_streak}</p>
    </div>
  </section>;
}
