# BoostForge

BoostForge is a social media boosting exchange built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## Features
- Email/password authentication with Supabase Auth
- Manual GCash top-up verification
- Credit ledger and boost spending
- Admin approval and review workflows
- Boost queue stubs for future bot automation

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and fill in your keys.
3. Create a Supabase project and run the migration:
   ```bash
   npx supabase db push
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Supabase setup
- Create a new project in Supabase
- Enable Email Auth
- Run the migration in `supabase/migrations/001_initial_schema.sql`
- Create a storage bucket named `payment-screenshots`

## GCash QR code
- Upload a QR code image to a public host or storage bucket
- Set the URL in your `.env.local` as `NEXT_PUBLIC_GCASH_QR_CODE_URL`

## Deployment
- Push to GitHub and import into Vercel
- Add the environment variables in your Vercel project settings
- Deploy
