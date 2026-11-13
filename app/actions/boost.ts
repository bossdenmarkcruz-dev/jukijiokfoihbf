'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { calculateCost } from '@/lib/utils';

export async function placeBoostOrder({
  serviceType,
  targetUrl,
  quantity
}: {
  serviceType: string;
  targetUrl: string;
  quantity: number;
}) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const cost = calculateCost(serviceType, quantity);

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('credits')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return { success: false, error: 'Profile not found' };
  }

  if (profile.credits < cost) {
    return { success: false, error: 'Insufficient credits' };
  }

  const { error: deductionError } = await supabase.rpc('deduct_credits', {
    user_id: user.id,
    amount: cost,
    description: `Boost order: ${serviceType} for ${quantity}`
  });

  if (deductionError) {
    return { success: false, error: deductionError.message };
  }

  const { data: order, error: orderError } = await supabase
    .from('boost_orders')
    .insert({
      user_id: user.id,
      service_type: serviceType,
      target_url: targetUrl,
      quantity,
      credits_charged: cost,
      status: 'pending'
    })
    .select()
    .single();

  if (orderError) {
    return { success: false, error: orderError.message };
  }

  return { success: true, order };
}
