import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Sidebar } from '@/components/Sidebar';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-100">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1">
            <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
              <div className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand-700">Dashboard</p>
                  <h1 className="text-xl font-black text-slate-900">BoostForge</h1>
                </div>
                <div className="flex items-center gap-3">
                  <Link href="/" className="text-sm font-medium text-slate-600">
                    Home
                  </Link>
                </div>
              </div>
            </header>
            <main className="p-6">{children}</main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
