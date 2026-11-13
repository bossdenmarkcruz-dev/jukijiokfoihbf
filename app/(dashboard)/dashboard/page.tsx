import { CreditCard, Activity, Wallet } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { TransactionList } from '@/components/TransactionList';

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user?.id).single();
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card icon={<Wallet className="h-5 w-5 text-brand-600" />} title="Credits" value={`${profile?.credits ?? 0}`} subtitle="Available balance" />
        <Card icon={<CreditCard className="h-5 w-5 text-green-600" />} title="Top ups" value={`${(transactions ?? []).filter((tx) => tx.amount > 0).length}`} subtitle="Successful deposits" />
        <Card icon={<Activity className="h-5 w-5 text-violet-600" />} title="Orders" value="0" subtitle="Boosts placed" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent activity</h2>
            <span className="text-sm text-slate-500">Last 5 transactions</span>
          </div>
          <div className="mt-4">
            <TransactionList transactions={transactions ?? []} />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-lg font-bold text-slate-900">Quick actions</h2>
          <div className="mt-4 space-y-3">
            <a href="/dashboard/topup" className="flex items-center justify-between rounded-2xl border border-slate-200 p-3">
              <span>Top up credits</span>
              <span className="text-brand-700">→</span>
            </a>
            <a href="/dashboard/boost" className="flex items-center justify-between rounded-2xl border border-slate-200 p-3">
              <span>Place boost order</span>
              <span className="text-brand-700">→</span>
            </a>
            <a href="/dashboard/orders" className="flex items-center justify-between rounded-2xl border border-slate-200 p-3">
              <span>View orders</span>
              <span className="text-brand-700">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
