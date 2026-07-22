import { Sidebar } from '@/components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50">
      <Sidebar />
      <main className="flex-1 ml-72 min-h-screen">
        {children}
      </main>
    </div>
  );
}
