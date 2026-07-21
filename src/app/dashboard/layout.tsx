import { Sidebar } from '@/components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#fcfcfc]">
      <Sidebar />
      <main className="flex-1 ml-72">
        {children}
      </main>
    </div>
  );
}
