'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { signIn } from '@/app/actions/auth';
import { loginSchema } from '@/lib/validation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type FormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const result = await signIn(values.email, values.password);
      if (result.success) {
        toast.success('Logged in successfully');
        router.push('/dashboard');
        router.refresh();
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch {
      toast.error('Unexpected login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Welcome back</h1>
      <p className="mt-2 text-sm text-slate-500">Log in to manage boosts and credits.</p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="name@example.com"
          {...form.register('email')}
          error={form.formState.errors.email?.message}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          {...form.register('password')}
          error={form.formState.errors.password?.message}
        />

        <div className="flex items-center justify-between">
          <Link href="/forgot-password" className="text-sm font-medium text-brand-700">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" loading={loading}>
          Login
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-semibold text-brand-700">
          Create one
        </Link>
      </p>
    </div>
  );
}
