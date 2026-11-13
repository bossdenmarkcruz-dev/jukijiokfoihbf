import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { CreditCard, Users, ShoppingCart, CircleDollarSign } from 'lucide-react';

export default async function AdminOverviewPage() {
  const supabase = createSupabaseServerClient();

  const [{ count: userCount }, { count: paymentCount }, { count: orderCount }] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('payment_verifications').select('*', { count: 'exact', head: true }),
    supabase.from('boost_orders').select('*', { count: 'exact', head: true })
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-slate-900">Admin overview</h1>

      <div className="grid gap-4 md:grid-cols-4">
        <Card icon={<Users className="h-5 w-5 text-brand-600" />} title="Users" value={`${userCount ?? 0}`} subtitle="Registered users" />
        <Card icon={<CreditCard className="h-5 w-5 text-green-600" />} title="Payments" value={`${paymentCount ?? 0}`} subtitle="Pending + reviewed" />
        <Card icon={<ShoppingCart className="h-5 w-5 text-violet-600" />} title="Orders" value={`${orderCount ?? 0}`} subtitle="Boost orders total" />
        <Card icon={<CircleDollarSign className="h-5 w-5 text-orange-600" />} title="Credits" value="0" subtitle="System total" />
      </div>
    </div>
  );
}
