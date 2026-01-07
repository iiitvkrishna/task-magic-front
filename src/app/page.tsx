'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [email, setEmail] = useState('suman@example.com');
  const [password, setPassword] = useState('123456');
  const router = useRouter();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } else {
      alert('Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* logo + title */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <span className="text-2xl text-white">✨</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Task Magic</h1>
          <p className="text-sm text-purple-700 mt-1">Drag, tick, add—your creative space.</p>
        </div>

        {/* card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl ring-1 ring-black/5">
          <form onSubmit={login} className="space-y-5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl bg-white/60 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-purple-900 placeholder-purple-500"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:scale-105 transition-transform">
              Enter Task Magic →
            </button>
          </form>

          {/* footer links */}
          <div className="mt-6 text-center text-sm text-purple-700 space-y-1">
            <button className="block w-full py-2 rounded-lg bg-white/50 border border-purple-200">Continue with Demo</button>
            <button className="block w-full py-2 rounded-lg bg-white/50 border border-purple-200">Continue with Guest</button>
            <p className="text-xs text-purple-600 mt-3">No account needed. Just start creating magic.</p>
          </div>
        </div>
      </div>
    </div>
  );
}