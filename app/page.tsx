import Link from "next/link";
import { IconArticle, IconVideo, IconFile, IconArrowRight, IconShield, IconSparkles, IconTrending, IconUsers, IconStar, IconCheck } from "@/components/ui/Icons";

export default function HomePage() {
  return (
    <div>
      {/* ══════════ HERO ══════════ */}
      <section className="relative overflow-hidden">
        <div className="hero-gradient-animated noise-bg">
          {/* Floating orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-white/[0.04] rounded-full blur-3xl" />
            <div className="absolute top-1/2 -left-32 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse-soft" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1s" }} />
            <div className="absolute top-1/4 right-1/3 w-48 h-48 bg-amber-500/[0.06] rounded-full blur-2xl animate-float" />
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-36 lg:py-44">
            <div className="max-w-3xl">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-sm text-white/90 font-medium">Premium digital content marketplace</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-extrabold text-white leading-[1.05] tracking-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
                Discover & Purchase
                <span className="block mt-3 bg-gradient-to-r from-white via-purple-200 to-amber-200 bg-clip-text text-transparent">
                  Premium Content
                </span>
              </h1>

              <p className="mt-7 text-lg sm:text-xl text-indigo-100/70 max-w-xl leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
                Articles, videos, and digital files from creators worldwide.
                Pay only for what you need. No subscriptions.
              </p>

              <div className="mt-10 flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <Link
                  href="/browse"
                  className="group inline-flex items-center gap-2.5 bg-white text-brand-700 px-8 py-4 rounded-2xl font-bold hover:bg-indigo-50 transition-all shadow-soft-xl hover:shadow-soft-2xl text-base"
                >
                  Browse Content
                  <IconArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-2 border-2 border-white/25 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 hover:border-white/40 transition-all text-base backdrop-blur-sm"
                >
                  Start Selling
                </Link>
              </div>

              {/* Social proof */}
              <div className="mt-12 flex items-center gap-6 animate-fade-in" style={{ animationDelay: "0.5s" }}>
                <div className="flex -space-x-2.5">
                  {["A", "B", "M", "S", "K"].map((letter, i) => (
                    <div
                      key={letter}
                      className="w-9 h-9 rounded-full border-2 border-indigo-500 flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: ["#6366f1", "#8b5cf6", "#a855f7", "#ec4899", "#f59e0b"][i], zIndex: 5 - i }}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <IconStar key={s} className="w-3.5 h-3.5 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-indigo-200/70 mt-0.5">Loved by <span className="text-white font-semibold">10,000+</span> creators & buyers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ STATS BAR ══════════ */}
      <section className="relative -mt-14 z-10 max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "Creators", value: "10K+", icon: <IconUsers className="w-5 h-5" />, color: "from-brand-500 to-purple-500" },
            { label: "Content Items", value: "50K+", icon: <IconArticle className="w-5 h-5" />, color: "from-blue-500 to-cyan-500" },
            { label: "Total Sales", value: "200K+", icon: <IconTrending className="w-5 h-5" />, color: "from-emerald-500 to-green-500" },
            { label: "Satisfaction", value: "99%", icon: <IconSparkles className="w-5 h-5" />, color: "from-amber-500 to-orange-500" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="card p-5 text-center hover:shadow-soft-md transition-all duration-300 hover:-translate-y-0.5 animate-stagger-fade"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center mx-auto mb-3 shadow-soft-sm`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-display font-extrabold text-surface-900">{stat.value}</p>
              <p className="text-xs text-surface-500 mt-0.5 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="badge-glow-purple mb-4 inline-flex">How It Works</span>
            <h2 className="section-title">Three Simple Steps</h2>
            <p className="section-subtitle max-w-lg mx-auto">Get started in minutes. No subscriptions, no commitments.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent" />

            {[
              { step: "01", title: "Browse & Discover", desc: "Explore curated articles, videos, and files from expert creators worldwide.", icon: <IconSearch className="w-7 h-7" />, color: "from-brand-500 to-blue-500" },
              { step: "02", title: "Purchase Securely", desc: "Pay only for what you want. Secure checkout with instant access granted.", icon: <IconShield className="w-7 h-7" />, color: "from-emerald-500 to-teal-500" },
              { step: "03", title: "Access Instantly", desc: "Read, stream, or download from your personal library. Yours forever.", icon: <IconSparkles className="w-7 h-7" />, color: "from-purple-500 to-pink-500" },
            ].map((item) => (
              <div key={item.step} className="text-center relative group">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-5 text-white shadow-soft-md group-hover:shadow-glow-lg group-hover:scale-105 transition-all duration-300`}>
                  {item.icon}
                </div>
                <span className="text-[10px] font-extrabold text-brand-400 uppercase tracking-[0.2em]">Step {item.step}</span>
                <h3 className="text-xl font-display font-bold mt-2 text-surface-900">{item.title}</h3>
                <p className="text-surface-500 mt-2 leading-relaxed max-w-xs mx-auto text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CONTENT TYPES ══════════ */}
      <section className="py-24 sm:py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <span className="badge-glow-blue mb-4 inline-flex">Content Types</span>
            <h2 className="section-title">Content for Everyone</h2>
            <p className="section-subtitle max-w-lg mx-auto">Diverse formats to match your learning style</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { title: "Articles", desc: "In-depth tutorials, guides, and written content from expert creators. Rich text with code examples.", icon: <IconArticle className="w-8 h-8" />, gradient: "from-blue-500 to-indigo-600", hover: "hover:shadow-[0_8px_30px_rgb(59_130_246/0.12)]" },
              { title: "Videos", desc: "Video courses, tutorials, and exclusive visual content. Stream instantly or download for offline viewing.", icon: <IconVideo className="w-8 h-8" />, gradient: "from-purple-500 to-violet-600", hover: "hover:shadow-[0_8px_30px_rgb(139_92_246/0.12)]" },
              { title: "Digital Files", desc: "Templates, assets, code, designs, and downloadable resources. Ready to use in your projects.", icon: <IconFile className="w-8 h-8" />, gradient: "from-emerald-500 to-green-600", hover: "hover:shadow-[0_8px_30px_rgb(16_185_129/0.12)]" },
            ].map((type) => (
              <Link href={`/browse?type=${type.title.toLowerCase().replace(" ", "")}`} key={type.title} className="group">
                <div className={`card p-8 h-full transition-all duration-300 hover:-translate-y-1.5 ${type.hover}`}>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${type.gradient} flex items-center justify-center text-white shadow-soft-sm mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {type.icon}
                  </div>
                  <h3 className="text-xl font-display font-bold text-surface-900 group-hover:text-brand-600 transition-colors">{type.title}</h3>
                  <p className="text-surface-500 mt-3 leading-relaxed text-sm">{type.desc}</p>
                  <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-brand-600 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1">
                    Browse {type.title} <IconArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ TRUST / FEATURES ══════════ */}
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="badge-glow-green mb-4 inline-flex">Why ContentHub</span>
            <h2 className="section-title">Built for Creators & Buyers</h2>
            <p className="section-subtitle max-w-lg mx-auto">Everything you need for premium digital content</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Secure Payments", desc: "End-to-end encrypted transactions with instant payouts", icon: <IconShield className="w-6 h-6" /> },
              { title: "Instant Access", desc: "Content unlocked immediately after purchase, no waiting", icon: <IconArrowRight className="w-6 h-6" /> },
              { title: "Creator Analytics", desc: "Detailed insights into sales, earnings, and audience growth", icon: <IconTrending className="w-6 h-6" /> },
              { title: "Quality First", desc: "All content reviewed to ensure premium quality standards", icon: <IconStar className="w-6 h-6" /> },
            ].map((feat) => (
              <div key={feat.title} className="card p-6 hover:shadow-soft-md transition-all duration-300 hover:-translate-y-0.5 group">
                <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
                  {feat.icon}
                </div>
                <h3 className="font-display font-bold text-surface-900">{feat.title}</h3>
                <p className="text-sm text-surface-500 mt-1.5 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA FOR CREATORS ══════════ */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-[0.03]" />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(rgb(99 102 241 / 0.06) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <div className="inline-flex items-center gap-2 badge-purple mb-6">
            <IconTrending className="w-3.5 h-3.5" />
            For Creators
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-surface-900 tracking-tight">
            Monetize Your Expertise
          </h2>
          <p className="text-surface-500 text-lg mt-5 leading-relaxed max-w-xl mx-auto">
            Upload articles, videos, and digital files. Set your own prices,
            track your earnings, and build your audience on your terms.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {[
              { label: "80% revenue share", icon: <IconDollar className="w-4 h-4" /> },
              { label: "Real-time analytics", icon: <IconTrending className="w-4 h-4" /> },
              { label: "Content protection", icon: <IconShield className="w-4 h-4" /> },
            ].map((perk) => (
              <div key={perk.label} className="flex items-center gap-2 text-sm text-surface-600">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <IconCheck className="w-3 h-3" />
                </div>
                {perk.label}
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/auth/register" className="btn-glow px-8 py-3.5 text-base rounded-2xl">
              Start Selling Today
              <IconArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/browse" className="btn-secondary px-8 py-3.5 text-base rounded-2xl">
              See What Sells
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER CTA ══════════ */}
      <section className="hero-gradient py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4">
            Ready to explore premium content?
          </h2>
          <p className="text-indigo-100/70 mb-8 max-w-lg mx-auto">
            Join thousands of creators and buyers on the fastest-growing content marketplace.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 bg-white text-brand-700 px-8 py-3.5 rounded-2xl font-bold hover:bg-indigo-50 transition-all shadow-soft-xl text-base"
          >
            Get Started Free
            <IconArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function IconSearch({ className = "w-5 h-5" }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>;
}

function IconDollar({ className = "w-5 h-5" }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}
