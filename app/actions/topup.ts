'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function submitPaymentVerification({
  amount,
  gcashReferenceNumber,
  screenshotUrl
}: {
  amount: number;
  gcashReferenceNumber: string;
  screenshotUrl: string;
}) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { error } = await supabase.from('payment_verifications').insert({
    user_id: user.id,
    amount,
    gcash_reference_number: gcashReferenceNumber,
    screenshot_url: screenshotUrl,
    status: 'pending'
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
