import { redirect } from 'next/navigation';
import { AdminRoute } from '@/components/AdminRoute';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const adminLinks = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/payments', label: 'Payments' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/users', label: 'Users' }
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <AdminRoute>
      <div className="min-h-screen bg-slate-100">
        <div className="flex min-h-screen">
          <aside className="w-72 border-r border-slate-200 bg-slate-900 text-white">
            <div className="px-6 py-6">
              <p className="text-xl font-black">BoostForge Admin</p>
            </div>
            <nav className="space-y-2 px-4">
              {adminLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </AdminRoute>
  );
}
