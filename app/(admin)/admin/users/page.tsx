import { createSupabaseServerClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import { AdminUserCreditsManager } from '@/components/AdminUserCreditsManager';

export default async function AdminUsersPage() {
  const supabase = createSupabaseServerClient();

  const { data: users } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });

  const rows = await Promise.all(
    (users ?? []).map(async (user) => {
      const { count } = await supabase
        .from('boost_orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      return { ...user, totalOrders: count ?? 0 };
    })
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-slate-900">Users</h1>

      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-lg font-bold text-slate-900">{row.email}</p>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                  <span>Credits: {row.credits}</span>
                  <span>Orders: {row.totalOrders}</span>
                  <span>Created: {formatDate(row.created_at)}</span>
                </div>
              </div>
              <AdminUserCreditsManager userId={row.id} currentCredits={row.credits} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
