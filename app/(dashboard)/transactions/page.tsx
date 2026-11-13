import { createSupabaseServerClient } from '@/lib/supabase/server';
import { TransactionList } from '@/components/TransactionList';

export default async function TransactionsPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <h1 className="text-2xl font-black text-slate-900">Transaction history</h1>

      <div className="mt-6">
        <TransactionList transactions={transactions ?? []} />
      </div>
    </div>
  );
}
