import { createSupabaseServerClient } from '@/lib/supabase/server';
import { PaymentVerificationCard } from '@/components/PaymentVerificationCard';

export default async function AdminPaymentsPage() {
  const supabase = createSupabaseServerClient();

  const { data: paymentRows } = await supabase
    .from('payment_verifications')
    .select('*, profiles:user_id (id, email)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-slate-900">Payment verifications</h1>

      <div className="space-y-4">
        {(paymentRows ?? []).length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            No pending payments.
          </div>
        ) : (
          paymentRows.map((payment) => (
            <PaymentVerificationCard
              key={payment.id}
              payment={{
                id: payment.id,
                user_id: payment.user_id,
                amount: payment.amount,
                gcash_reference_number: payment.gcash_reference_number ?? '',
                screenshot_url: payment.screenshot_url ?? '',
                status: payment.status,
                created_at: payment.created_at,
                admin_note: payment.admin_note ?? '',
                profiles: payment.profiles
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
