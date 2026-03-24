import Link from "next/link";
import { IconArticle, IconVideo, IconFile, IconArrowRight, IconShield, IconSparkles, IconTrending, IconUsers } from "@/components/ui/Icons";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="hero-gradient">
          {/* Floating shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            {/* Grid pattern */}
            <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
                <IconSparkles className="w-4 h-4 text-amber-300" />
                <span className="text-sm text-white/90 font-medium">Premium digital content marketplace</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white leading-[1.1] tracking-tight">
                Discover & Purchase
                <span className="block mt-2 bg-gradient-to-r from-white via-purple-200 to-amber-200 bg-clip-text text-transparent">
                  Premium Digital Content
                </span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-indigo-100/80 max-w-2xl leading-relaxed">
                Articles, videos, and digital files from creators worldwide. Buy exactly what you need, when you need it. No subscriptions required.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/browse"
                  className="inline-flex items-center gap-2 bg-white text-brand-700 px-7 py-3.5 rounded-xl font-semibold hover:bg-indigo-50 transition-all shadow-soft-lg hover:shadow-soft-xl text-base"
                >
                  Browse Content
                  <IconArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all text-base backdrop-blur-sm"
                >
                  Start Selling
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-12 z-10 max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Creators", value: "10K+", icon: <IconUsers className="w-5 h-5" /> },
            { label: "Content Items", value: "50K+", icon: <IconArticle className="w-5 h-5" /> },
            { label: "Total Sales", value: "200K+", icon: <IconTrending className="w-5 h-5" /> },
            { label: "Satisfaction", value: "99%", icon: <IconSparkles className="w-5 h-5" /> },
          ].map((stat) => (
            <div key={stat.label} className="card p-5 text-center hover:shadow-soft-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3">
                {stat.icon}
              </div>
              <p className="text-2xl font-display font-bold text-surface-900">{stat.value}</p>
              <p className="text-xs text-surface-500 mt-0.5 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Three simple steps to access premium content</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent" />

            {[
              { step: "01", title: "Browse", desc: "Explore our curated catalog of articles, videos, and digital files from talented creators.", icon: <IconSearch className="w-7 h-7" />, color: "from-brand-500 to-blue-500" },
              { step: "02", title: "Purchase", desc: "Pay only for what you want. Secure checkout with instant access to your purchased content.", icon: <IconShield className="w-7 h-7" />, color: "from-emerald-500 to-teal-500" },
              { step: "03", title: "Enjoy", desc: "Access your content anytime from your personal library. Download, stream, or read.", icon: <IconSparkles className="w-7 h-7" />, color: "from-purple-500 to-pink-500" },
            ].map((item) => (
              <div key={item.step} className="text-center relative">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-5 text-white shadow-soft-md`}>
                  {item.icon}
                </div>
                <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Step {item.step}</span>
                <h3 className="text-xl font-display font-bold mt-2 text-surface-900">{item.title}</h3>
                <p className="text-surface-500 mt-2 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Types */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Content for Everyone</h2>
            <p className="section-subtitle">Diverse content types to match your learning style</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Articles", desc: "In-depth tutorials, guides, and written content from expert creators. Rich text with code examples.", icon: <IconArticle className="w-8 h-8" />, gradient: "from-blue-500 to-indigo-600", bg: "bg-blue-50" },
              { title: "Videos", desc: "Video courses, tutorials, and exclusive visual content. Stream instantly or download for offline.", icon: <IconVideo className="w-8 h-8" />, gradient: "from-purple-500 to-violet-600", bg: "bg-purple-50" },
              { title: "Digital Files", desc: "Templates, assets, code, designs, and downloadable resources. Ready to use in your projects.", icon: <IconFile className="w-8 h-8" />, gradient: "from-emerald-500 to-green-600", bg: "bg-emerald-50" },
            ].map((type) => (
              <Link href={`/browse?type=${type.title.toLowerCase().replace(" ", "")}`} key={type.title} className="group">
                <div className="card-hover p-8 h-full">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${type.gradient} flex items-center justify-center text-white shadow-soft-sm mb-5`}>
                    {type.icon}
                  </div>
                  <h3 className="text-xl font-display font-bold text-surface-900 group-hover:text-brand-600 transition-colors">{type.title}</h3>
                  <p className="text-surface-500 mt-2 leading-relaxed">{type.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Browse {type.title} <IconArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA for Creators */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-5" />
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <div className="inline-flex items-center gap-2 badge-purple mb-6">
            <IconTrending className="w-3.5 h-3.5" />
            For Creators
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-surface-900 tracking-tight">
            Monetize Your Expertise
          </h2>
          <p className="text-surface-500 text-lg mt-4 leading-relaxed max-w-xl mx-auto">
            Upload articles, videos, and digital files. Set your own prices, track your earnings, and build your audience.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/auth/register" className="btn-primary px-8 py-3 text-base">
              Start Selling Today
              <IconArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/browse" className="btn-secondary px-8 py-3 text-base">
              See What Sells
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function IconSearch({ className = "w-5 h-5" }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>;
}
