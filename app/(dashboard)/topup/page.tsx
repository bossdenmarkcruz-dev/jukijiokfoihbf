'use client';

import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { ImageUp, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { topupSchema } from '@/lib/validation';
import { generateGCashQR } from '@/lib/external/gcashPayment';

type FormValues = {
  amount: number;
  gcashReferenceNumber: string;
};

export default function TopUpPage() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(topupSchema),
    defaultValues: {
      amount: 100,
      gcashReferenceNumber: ''
    }
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB.');
      return;
    }

    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const onSubmit = async (values: FormValues) => {
    if (!file) {
      toast.error('Please upload a payment screenshot.');
      return;
    }

    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error('Please log in first.');
        return;
      }

      const paymentId = crypto.randomUUID();
      const storagePath = `${user.id}/${paymentId}.png`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment-screenshots')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type || 'image/png'
        });

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage.from('payment-screenshots').getPublicUrl(uploadData.path);

      const { error: dbError } = await supabase.from('payment_verifications').insert({
        id: paymentId,
        user_id: user.id,
        amount: values.amount,
        gcash_reference_number: values.gcashReferenceNumber,
        screenshot_url: publicData.publicUrl,
        status: 'pending'
      });

      if (dbError) throw dbError;

      toast.success('Payment submitted for verification. Credits will be added after admin approval.');
      form.reset();
      setFile(null);
      setPreviewUrl(null);
    } catch {
      toast.error('Could not submit payment verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-black text-slate-900">Top up credits</h1>
        <p className="mt-2 text-sm text-slate-500">Pay via GCash and submit a screenshot for review.</p>

        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-brand-50 p-3 text-brand-700">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">GCash QR Code</p>
              <p className="font-bold text-slate-900">Transfer the amount below</p>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <img
              src={generateGCashQR(100)}
              alt="GCash QR code"
              className="h-56 w-56 rounded-xl border border-slate-200 bg-white object-cover"
            />
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Input
            label="Amount to pay (PHP)"
            type="number"
            min={1}
            {...form.register('amount', { valueAsNumber: true })}
            error={form.formState.errors.amount?.message}
          />
          <Input
            label="GCash reference number"
            placeholder="REF-123456"
            {...form.register('gcashReferenceNumber')}
            error={form.formState.errors.gcashReferenceNumber?.message}
          />

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Payment screenshot</span>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <ImageUp className="h-5 w-5 text-brand-700" />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-brand-600 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white"
              />
            </div>
          </label>

          {previewUrl && (
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <img src={previewUrl} alt="Proof upload" className="h-48 w-full object-cover" />
            </div>
          )}

          <Button type="submit" className="w-full" loading={loading}>
            Submit payment verification
          </Button>
        </form>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-slate-900">How it works</h2>
        <ol className="mt-5 space-y-4 text-sm text-slate-600">
          <li>1. Pay using the GCash QR code.</li>
          <li>2. Enter your GCash reference number.</li>
          <li>3. Upload a screenshot of the payment.</li>
          <li>4. Admin reviews and approves the transaction.</li>
          <li>5. Credits are added automatically to your account.</li>
        </ol>
      </div>
    </div>
  );
}
