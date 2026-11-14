import Link from 'next/link';
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  ChartNoAxesCombined,
  Check,
  ChevronRight,
  CircleDollarSign,
  Instagram,
  ShieldCheck,
  Sparkles,
  Wallet,
  Zap,
} from 'lucide-react';

const services = [
  { name: 'Instagram', detail: 'Followers, likes & views', icon: Instagram, tone: 'rose' },
  { name: 'TikTok', detail: 'Followers, likes & views', icon: Zap, tone: 'slate' },
  { name: 'YouTube', detail: 'Views, likes & subscribers', icon: PlayIcon, tone: 'red' },
];

function PlayIcon({ className }: { className?: string }) {
  return <span className={`play-mark ${className ?? ''}`} aria-hidden="true">▶</span>;
}

export default function HomePage() {
  return (
    <main className="site-shell">
      <header className="site-header">
        <Link href="/" className="brand" aria-label="BoostForge home">
          <span className="brand-mark"><Zap size={19} fill="currentColor" /></span>
          <span>boostforge<span className="brand-period">.</span></span>
        </Link>
        <nav className="header-nav" aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#services">Services</a>
          <a href="#safety">Safety</a>
        </nav>
        <div className="header-actions">
          <Link className="login-link" href="/login">Log in</Link>
          <Link className="button button-dark button-small" href="/signup">Get started <ArrowRight size={15} /></Link>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> THE GROWTH TOOLKIT FOR CREATORS</div>
          <h1>Make your next<br />big moment <span>happen.</span></h1>
          <p className="hero-description">A little momentum goes a long way. Top up with GCash, choose your boost, and keep creating while we handle the rest.</p>
          <div className="hero-actions">
            <Link className="button button-dark" href="/signup">Start growing <ArrowRight size={16} /></Link>
            <div className="hero-proof"><div className="proof-avatars"><span>J</span><span>M</span><span>A</span></div><span>Made for creators<br /><strong>building their thing</strong></span></div>
          </div>
          <div className="hero-note"><ShieldCheck size={16} /> Straightforward payments. A clear order history. No guesswork.</div>
        </div>

        <div className="dashboard-wrap" aria-label="Preview of the BoostForge creator dashboard">
          <div className="dashboard-card">
            <div className="dash-top"><div><span className="dash-label">YOUR OVERVIEW</span><h2>Hey, creator <span>✳</span></h2></div><div className="profile-avatar">C</div></div>
            <div className="balance-card"><div className="balance-top"><span><Wallet size={15} /> Available balance</span><span className="balance-chip"><span /> Ready to use</span></div><div className="balance-amount"><span>₱</span> 2,450<span className="balance-decimal">.00</span></div><div className="balance-bottom"><span>Credits</span><Link href="/dashboard/topup">Top up <ArrowUpRight size={13} /></Link></div><div className="balance-decoration" /></div>
            <div className="dash-quick"><Link href="/dashboard/topup"><span className="quick-icon quick-lilac"><CircleDollarSign size={18} /></span><span><strong>Add credits</strong><small>GCash top up</small></span><ChevronRight size={16} /></Link><Link href="/dashboard/boost"><span className="quick-icon quick-green"><Sparkles size={18} /></span><span><strong>New boost</strong><small>Pick a service</small></span><ChevronRight size={16} /></Link></div>
            <div className="activity-head"><strong>Recent activity</strong><Link href="/dashboard/transactions">See all <ArrowRight size={13} /></Link></div>
            <div className="activity-row"><span className="activity-icon"><ArrowDownLeft size={15} /></span><span className="activity-name"><strong>GCash top up</strong><small>Today, 10:42 AM</small></span><span className="activity-value">+₱500</span><span className="activity-status">Done</span></div>
          </div>
          <div className="float-card float-growth"><span className="float-icon"><ChartNoAxesCombined size={17} /></span><span><strong>Keep your momentum</strong><small>Your next boost is one tap away.</small></span></div>
          <div className="float-card float-success"><span className="success-check"><Check size={15} /></span><span><strong>Payment verified</strong><small>Credits are ready to go</small></span></div>
          <div className="hero-spark spark-one">✳</div><div className="hero-spark spark-two">✳</div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Platform benefits"><div><BadgeCheck size={17} /><span>Manual payment review</span></div><span className="trust-divider" /><div><ShieldCheck size={17} /><span>Transparent order status</span></div><span className="trust-divider" /><div><Zap size={16} /><span>Built for your next idea</span></div></section>

      <section className="services-section" id="services">
        <div className="section-heading"><div><span className="section-kicker">ONE PLACE TO GET MOVING</span><h2>Your platforms.<br /><span>Your kind of growth.</span></h2></div><p>Pick the platform you&apos;re creating for, choose a service, and keep your energy where it belongs: on making something great.</p></div>
        <div className="service-grid">{services.map(({ name, detail, icon: Icon, tone }) => <article className="service-card" key={name}><span className={`service-icon ${tone}`}><Icon size={20} /></span><div><h3>{name}</h3><p>{detail}</p></div><span className="service-arrow"><ArrowUpRight size={17} /></span></article>)}</div>
        <p className="service-footnote">Available services and delivery details are shown clearly before you place an order.</p>
      </section>

      <section className="steps-section" id="how-it-works"><div className="steps-title"><span className="section-kicker">SIMPLE BY DESIGN</span><h2>From idea to<br /><span>in motion.</span></h2><p>No complicated setup. Just a few clear steps and you&apos;re back to creating.</p><Link className="text-link" href="/signup">Create your free account <ArrowRight size={15} /></Link></div><div className="steps-list"><article><span className="step-number">01</span><div><h3>Create your account</h3><p>Sign up and get your creator dashboard in a few moments.</p></div><span className="step-symbol"><BadgeCheck size={19} /></span></article><article><span className="step-number">02</span><div><h3>Add credits with GCash</h3><p>Submit your payment details for a quick manual review.</p></div><span className="step-symbol"><Wallet size={19} /></span></article><article><span className="step-number">03</span><div><h3>Choose your next boost</h3><p>Place your order and follow its progress from your dashboard.</p></div><span className="step-symbol"><Sparkles size={19} /></span></article></div></section>

      <section className="safety-banner" id="safety"><div className="safety-icon"><ShieldCheck size={22} /></div><div><span className="section-kicker">CLEAR FROM TOP UP TO ORDER</span><h2>Know what&apos;s happening<br />at every step.</h2><p>Your payment is reviewed before credits are added. Orders and transactions stay organized in one place, so you can focus on what comes next.</p></div><Link className="button button-light" href="/signup">Explore BoostForge <ArrowRight size={15} /></Link></section>

      <footer className="site-footer"><Link href="/" className="brand"><span className="brand-mark"><Zap size={17} fill="currentColor" /></span><span>boostforge<span className="brand-period">.</span></span></Link><p>Made for the people making things.</p><div><Link href="/login">Log in</Link><Link href="/signup">Create account</Link></div><span className="copyright">© {new Date().getFullYear()} BoostForge</span></footer>
    </main>
  );
}
