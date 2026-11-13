'use server';

import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function approvePayment(paymentId: string, adminNote: string) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();

  if (!profile?.is_admin) {
    return { success: false, error: 'Admin access required' };
  }

  const adminClient = createSupabaseAdminClient();

  const { error } = await adminClient.rpc('approve_payment', {
    payment_id: paymentId,
    admin_user_id: user.id,
    admin_note: adminNote
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function rejectPayment(paymentId: string, adminNote: string) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();

  if (!profile?.is_admin) {
    return { success: false, error: 'Admin access required' };
  }

  const adminClient = createSupabaseAdminClient();
  const { error } = await adminClient.rpc('reject_payment', {
    payment_id: paymentId,
    admin_user_id: user.id,
    admin_note: adminNote
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();

  if (!profile?.is_admin) {
    return { success: false, error: 'Admin access required' };
  }

  const { error } = await supabase
    .from('boost_orders')
    .update({
      status,
      processed_at: status === 'completed' || status === 'cancelled' ? new Date().toISOString() : null
    })
    .eq('id', orderId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function adjustUserCredits(userId: string, delta: number, reason: string) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();

  if (!profile?.is_admin) {
    return { success: false, error: 'Admin access required' };
  }

  const adminClient = createSupabaseAdminClient();

  if (delta >= 0) {
    const { error } = await adminClient.rpc('add_credits', {
      user_id: userId,
      amount: delta,
      description: reason
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  const { error } = await adminClient.rpc('deduct_credits', {
    user_id: userId,
    amount: Math.abs(delta),
    description: reason
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}
