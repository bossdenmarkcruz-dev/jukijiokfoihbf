import { createSupabaseServerClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import { AdminOrderStatusControls } from '@/components/AdminOrderStatusControls';

export default async function AdminOrdersPage() {
  const supabase = createSupabaseServerClient();

  const { data: orders } = await supabase
    .from('boost_orders')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-slate-900">Boost orders</h1>

      <div className="space-y-4">
        {(orders ?? []).map((order) => (
          <div key={order.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
            <div className="flex flex-col justify-between gap-3 sm:flex-row">
              <div>
                <p className="text-lg font-bold text-slate-900">{order.service_type}</p>
                <p className="text-sm text-slate-500">{order.target_url}</p>
              </div>
              <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                {order.status}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600">
              <span>Quantity: {order.quantity}</span>
              <span>Credits: {order.credits_charged}</span>
              <span>Created: {formatDate(order.created_at)}</span>
            </div>

            <div className="mt-4">
              <AdminOrderStatusControls orderId={order.id} currentStatus={order.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
