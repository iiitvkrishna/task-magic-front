'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const api = axios.create({ baseURL: 'http://localhost:8000/api' });

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  estimatedHours: number;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium'); // 19 priority state
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/'); return; }
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    api.get<Task[]>('/tasks').then((res) => setTasks(res.data));
  }, [router]);

  /* 30 */ const addTask = async () => {
    if (!title.trim()) return;
    const { data } = await api.post<Task>('/tasks', {
      title,
      description: '',
      status: 'To-Do',
      priority,        // 36 user choice
      estimatedHours: 1,
    });
    setTitle(''); setPriority('Medium'); setTasks([data, ...tasks]); // 38 reset priority
  };

  /* 41 */ const aiGenerate = async () => {
    const { data } = await api.post<Task[]>('/tasks/ai', { prompt: 'anything' });
    setTasks([...data, ...tasks]);
  };

  /* 45 */ const deleteTask = async (id: string) => {
    await api.delete(`/tasks/${id}`); setTasks(tasks.filter((t) => t._id !== id));
  };

  /* 48 */ const toggleStatus = async (id: string, current: string) => {
    const next = current === 'To-Do' ? 'In Progress' : current === 'In Progress' ? 'Done' : 'To-Do';
    const { data } = await api.put<Task>(`/tasks/${id}`, { status: next }); setTasks(tasks.map((t) => (t._id === id ? data : t)));
  };

  const stats = {
    active: tasks.filter((t) => t.status !== 'Done').length,
    completed: tasks.filter((t) => t.status === 'Done').length,
    high: tasks.filter((t) => t.priority === 'High').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* 66 */} <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-sm"><span className="text-white text-lg">✨</span></div><h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Task Magic</h1></div>
          <div className="flex items-center gap-3"><span className="hidden sm:inline text-sm text-purple-700">Drag, tick, add—your creative space.</span><button onClick={() => { localStorage.removeItem('token'); location.href = '/'; }} className="text-sm text-purple-700 hover:text-purple-900">→ Logout</button></div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-6"><h2 className="text-3xl sm:text-4xl font-bold text-purple-900 mb-2">Drag, tick, add—your creative space.</h2><p className="text-purple-700">Manage your tasks with magic and style</p></div>

        {/* 78 */} <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-lg">⚡</div><div><p className="text-2xl font-bold text-purple-900">{stats.active}</p><p className="text-xs text-purple-600">Active Tasks</p></div></div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center text-white text-lg">✅</div><div><p className="text-2xl font-bold text-purple-900">{stats.completed}</p><p className="text-xs text-purple-600">Completed</p></div></div>
          <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white text-lg">🚨</div><div><p className="text-2xl font-bold text-purple-900">{stats.high}</p><p className="text-xs text-purple-600">High Priority</p></div></div>
        </div>

        {/* 92 */} <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-2xl ring-1 ring-black/5 mb-8">
          <label className="block text-sm font-medium text-purple-900 mb-2">What inspires you today?</label>
          <div className="flex items-center gap-3">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a new task..." className="flex-1 h-12 rounded-xl border-2 border-purple-200 bg-white/60 px-4 text-purple-900 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400" onKeyPress={(e) => e.key === 'Enter' && addTask()} />
            {/* 100 */}<select value={priority} onChange={(e) => setPriority(e.target.value as 'High' | 'Medium' | 'Low')} className="h-12 rounded-xl border-2 border-purple-200 bg-white/60 px-3 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-400"><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option></select>
            <button onClick={addTask} className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xl shadow-lg hover:scale-105 transition-transform grid place-items-center">+</button>
          </div>
          <button onClick={aiGenerate} className="mt-4 w-full h-11 rounded-lg border-2 border-dashed border-purple-300 text-purple-700 bg-white/50 hover:bg-white/70 transition flex items-center justify-center gap-2"><span className="text-xl">✨</span>AI Surprise</button>
        </div>

        {/* 110 */} <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((t) => (
            <div key={t._id} className="bg-white rounded-2xl p-5 shadow-lg ring-1 ring-black/5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <button onClick={() => toggleStatus(t._id, t.status)} className={`mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center ${t.status === 'Done' ? 'bg-green-600 border-green-600' : 'bg-white border-purple-300'}`}>{t.status === 'Done' && <span className="text-white text-xs font-bold">✓</span>}</button>
                  <div>
                    <h3 className={`font-semibold text-purple-900 ${t.status === 'Done' ? 'line-through' : ''}`}>{t.title}</h3>
                    <p className="text-sm text-purple-700">{t.description}</p>
                  </div>
                </div>
                <button onClick={() => deleteTask(t._id)} className="text-purple-700 hover:text-red-600 text-lg">✕</button>
              </div>
              <div className="flex items-center gap-2 text-xs text-purple-600 mt-2">
                <span className="px-2 py-0.5 rounded-full bg-purple-100">{t.estimatedHours}h</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-100">{t.priority}</span>
              </div>
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 mb-4"><span className="text-2xl">✨</span></div>
            <h3 className="text-xl font-bold text-purple-900 mb-2">No tasks yet</h3>
            <p className="text-purple-700">Create your first task to start the magic!</p>
          </div>
        )}
      </main>
    </div>
  );
}