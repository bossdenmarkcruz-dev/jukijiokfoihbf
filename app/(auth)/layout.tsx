import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white">
              B
            </div>
            <span className="text-2xl font-black text-slate-900">BoostForge</span>
          </Link>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          {children}
        </div>
      </div>
    </main>
  );
}
