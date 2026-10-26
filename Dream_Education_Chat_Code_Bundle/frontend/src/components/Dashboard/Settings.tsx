import { useState } from 'react';
export default function Settings() {
  const [animations, setAnimations] = useState(true);
  const [compact, setCompact] = useState(false);
  return <section className="bg-white rounded-2xl p-8 shadow-sm">
    <h2 className="text-3xl font-bold">Settings</h2><p className="mt-2 text-gray-600">Customize your learning experience.</p>
    <div className="mt-8 space-y-5">
      <label className="flex items-center justify-between"><span>Enable animations</span><input type="checkbox" checked={animations} onChange={e => setAnimations(e.target.checked)} /></label>
      <label className="flex items-center justify-between"><span>Compact layout</span><input type="checkbox" checked={compact} onChange={e => setCompact(e.target.checked)} /></label>
      <p className="text-sm text-gray-500">These sample settings are temporary and are not saved to the database.</p>
    </div>
  </section>;
}
