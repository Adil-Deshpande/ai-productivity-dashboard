'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

import { GoalsSection } from '@/components/goals/GoalsSection';

export default function Dashboard() {
  const [user, setUser] = useState<{ name?: string, email: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(setUser)
      .catch(() => router.push('/login'));
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (!user) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="p-10 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Welcome back, {user.name ? user.name.split(' ')[0] : 'User'}!</h1>
          <p className="mt-2 text-gray-500">Here&apos;s an overview of your active projects and goals.</p>
        </div>
        <div className="flex items-center gap-4">
           {/* Temporary quick actions or logout */}
          <Button onClick={handleLogout} variant="ghost" className="text-gray-500 hover:text-gray-900">
            Logout
          </Button>
        </div>
      </div>
      
      <GoalsSection />
    </div>
  );
}
