'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { signUp } from '@/app/actions/auth';
import { signupSchema } from '@/lib/validation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type FormValues = {
  fullName: string;
  email: string;
  password: string;
};

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: ''
    }
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const result = await signUp({
        fullName: values.fullName,
        email: values.email,
        password: values.password
      });

      if (result.success) {
        toast.success('Account created. Check your email to confirm if required.');
        router.push('/dashboard');
      } else {
        toast.error(result.error || 'Signup failed');
      }
    } catch {
      toast.error('Unexpected signup error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Create your account</h1>
      <p className="mt-2 text-sm text-slate-500">Start earning and using credits instantly.</p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <Input
          label="Full name"
          placeholder="John Dela Cruz"
          {...form.register('fullName')}
          error={form.formState.errors.fullName?.message}
        />
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

        <Button type="submit" className="w-full" loading={loading}>
          Sign up
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-brand-700">
          Login
        </Link>
      </p>
    </div>
  );
}
