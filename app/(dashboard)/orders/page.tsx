import { createSupabaseServerClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';

export default async function OrdersPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from('boost_orders')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
      <h1 className="text-2xl font-black text-slate-900">My boost orders</h1>

      <div className="mt-6 space-y-4">
        {(orders ?? []).length === 0 ? (
          <p className="text-sm text-slate-500">No orders yet.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-bold text-slate-900">{order.service_type}</p>
                  <p className="text-sm text-slate-500">{order.target_url}</p>
                </div>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                  {order.status}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                <span>Quantity: {order.quantity}</span>
                <span>Charged: {order.credits_charged} credits</span>
                <span>Created: {formatDate(order.created_at)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
