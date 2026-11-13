import Link from 'next/link';
import { ArrowRight, CreditCard, ShieldCheck, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50">
      <header className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white">
              B
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">BoostForge</p>
            </div>
          </div>
          <nav className="hidden gap-6 text-sm font-medium text-slate-600 md:flex">
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign up</Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-20 pt-12 lg:grid-cols-2">
        <div>
          <span className="inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-700">
            Social media growth
          </span>
          <h1 className="mt-6 text-5xl font-black tracking-tight text-slate-900">
            Buy boosts with credits and verify payments manually.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-600">
            BoostForge makes it easy to top up credits, purchase followers, likes, views, and comments,
            and handle GCash verification through a streamlined admin approval process.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/signup">
              <Button>Get started</Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary">Login</Button>
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              Manual verification
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Credit-based orders
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-violet-600" />
              GCash friendly
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-soft ring-1 ring-slate-200">
          <div className="grid gap-5">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Available credits</p>
              <p className="mt-2 text-4xl font-black text-slate-900">0</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Top up</p>
                <p className="mt-2 text-xl font-bold">GCash</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-sm text-slate-500">Order</p>
                <p className="mt-2 text-xl font-bold">Followers / Likes</p>
              </div>
            </div>
            <div className="rounded-2xl border border-dashed border-brand-300 bg-brand-50 p-4 text-sm text-brand-800">
              Current payment verification is manual. Admin approval adds credits automatically after review.
            </div>
            <Link href="/signup" className="flex items-center justify-center gap-2 font-semibold text-brand-700">
              Create your account <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
