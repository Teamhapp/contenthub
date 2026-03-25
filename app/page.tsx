import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-[#faf8ff] text-[#151b29] antialiased">
      {/* ══════════ HERO ══════════ */}
      <section className="relative px-6 lg:px-8 py-20 lg:py-32 max-w-[1440px] mx-auto overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#e6deff] text-[#1c0062] font-semibold text-[10px] tracking-[0.12em] uppercase mb-6">
              Curated Creative Economy
            </span>
            <h1 className="font-['Plus_Jakarta_Sans'] text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8">
              Where{" "}
              <span className="bg-gradient-to-r from-[#451ebb] to-[#5d3fd3] bg-clip-text text-transparent">
                Creativity
              </span>{" "}
              Finds Its Value
            </h1>
            <p className="text-lg lg:text-xl text-[#484554] mb-10 max-w-xl leading-relaxed">
              The Digital Atelier is a high-end marketplace designed for premium
              assets, insightful content, and the visionaries who build them.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/browse"
                className="bg-gradient-to-r from-[#451ebb] to-[#5d3fd3] text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 shadow-[0_20px_40px_rgba(21,27,41,0.06)] hover:opacity-90 transition-all"
              >
                Browse Content
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <Link
                href="/auth/register"
                className="px-8 py-4 rounded-lg font-semibold text-lg text-[#151b29] border border-[#c9c4d7]/30 hover:bg-[#f1f3ff] transition-all"
              >
                Start Selling
              </Link>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-64 rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#451ebb]/20 to-[#5d3fd3]/30" />
                <div className="h-48 rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#e9edff] to-[#dde2f6] relative">
                  <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#451ebb]">
                    FEATURED CREATOR
                  </div>
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="h-48 rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#5d3fd3]/20 to-[#cabeff]/40" />
                <div className="h-64 rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#e2e8fc] to-[#f1f3ff]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ STATS BAR ══════════ */}
      <section className="bg-[#f1f3ff] py-12 px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "10K+", label: "Verified Creators" },
            { value: "$5M+", label: "Paid Out" },
            { value: "250K+", label: "Premium Assets" },
            { value: "4.9/5", label: "Creator Trust Score" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-['Plus_Jakarta_Sans'] text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-[10px] text-[#484554] tracking-[0.12em] uppercase font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section className="px-6 lg:px-8 py-24 max-w-[1440px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-['Plus_Jakarta_Sans'] text-4xl font-extrabold mb-4">The Curated Path</h2>
          <p className="text-[#484554] max-w-2xl mx-auto">
            A seamless experience designed for both the connoisseur and the creator.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              icon: "token",
              title: "Discover & Mint",
              desc: "Browse through a gallery of hand-picked digital assets, from exclusive articles to architectural blueprints.",
              progress: "w-1/3",
              iconBg: "bg-[#e6deff]",
              iconColor: "text-[#451ebb]",
              barColor: "bg-[#451ebb]",
            },
            {
              icon: "verified_user",
              title: "Secure Exchange",
              desc: "Every transaction is protected by our Atelier Trust Layer, ensuring creators get paid and buyers get quality.",
              progress: "w-2/3",
              iconBg: "bg-[#ffdbc8]",
              iconColor: "text-[#713300]",
              barColor: "bg-[#713300]",
            },
            {
              icon: "auto_graph",
              title: "Scale Your Studio",
              desc: "Unlock analytics, community engagement tools, and premium placement to grow your creative brand.",
              progress: "w-full",
              iconBg: "bg-[#e6deff]",
              iconColor: "text-[#605693]",
              barColor: "bg-[#605693]",
            },
          ].map((step) => (
            <div key={step.title} className="relative group">
              <div className="bg-white p-8 rounded-xl shadow-[0_20px_40px_rgba(21,27,41,0.06)] transition-transform duration-300 group-hover:-translate-y-2">
                <div className={`w-16 h-16 ${step.iconBg} rounded-xl flex items-center justify-center mb-6`}>
                  <span className={`material-symbols-outlined ${step.iconColor} text-3xl`}>{step.icon}</span>
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-[#484554] text-sm leading-relaxed mb-6">{step.desc}</p>
                <div className="h-1 bg-[#dde2f6] w-full rounded-full">
                  <div className={`h-full ${step.barColor} ${step.progress} rounded-full`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ EXHIBITION FLOOR ══════════ */}
      <section className="px-6 lg:px-8 py-24 bg-white">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="font-['Plus_Jakarta_Sans'] text-4xl font-extrabold mb-2">Exhibition Floor</h2>
              <p className="text-[#484554]">Trending assets from the world&apos;s most innovative creators.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/browse?type=article" className="px-6 py-2 rounded-full border border-[#c9c4d7]/30 font-medium text-sm hover:bg-[#f1f3ff] transition-all">
                Articles
              </Link>
              <Link href="/browse?type=video" className="px-6 py-2 rounded-full bg-[#151b29] text-white font-medium text-sm">
                Videos
              </Link>
              <Link href="/browse?type=file" className="px-6 py-2 rounded-full border border-[#c9c4d7]/30 font-medium text-sm hover:bg-[#f1f3ff] transition-all">
                Files
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Featured (Large) */}
            <div className="md:col-span-8 group">
              <div className="relative h-[500px] rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(21,27,41,0.06)] bg-gradient-to-br from-[#1a1040] via-[#2d1b69] to-[#451ebb]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-8 flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-[#451ebb] text-white text-[10px] font-bold rounded-full uppercase tracking-[0.12em]">
                      Trending Video
                    </span>
                    <span className="text-white/70 text-xs">2.4M Views</span>
                  </div>
                  <h3 className="text-3xl font-['Plus_Jakarta_Sans'] font-bold text-white mb-2">
                    The Future of Generative Motion
                  </h3>
                  <p className="text-white/80 max-w-lg mb-6">
                    A deep dive into how AI is reshaping the cinematic landscape for independent filmmakers.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#dde2f6]" />
                      <span className="text-white font-medium">Elena Vance</span>
                    </div>
                    <Link href="/browse" className="bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-lg font-bold hover:bg-white hover:text-[#451ebb] transition-all">
                      Watch Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Cards */}
            <div className="md:col-span-4 flex flex-col gap-6">
              <Link href="/browse?type=article" className="flex-1 bg-[#f1f3ff] p-6 rounded-xl group/card cursor-pointer hover:bg-white transition-all shadow-[0_20px_40px_rgba(21,27,41,0.06)]">
                <div className="flex justify-between items-start mb-6">
                  <span className="material-symbols-outlined text-[#451ebb]">description</span>
                  <span className="text-xs text-[#484554] tracking-tight font-medium">8 MIN READ</span>
                </div>
                <h4 className="font-['Plus_Jakarta_Sans'] text-xl font-bold mb-3 group-hover/card:text-[#451ebb] transition-colors">
                  Digital Scarcity in 2024
                </h4>
                <p className="text-sm text-[#484554] leading-relaxed mb-6">
                  Exploring why physical-digital hybrids are becoming the new gold standard for collectors.
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#451ebb]">$12.00</span>
                  <span className="text-xs text-[#484554] line-through">$25.00</span>
                </div>
              </Link>

              <Link href="/browse?type=file" className="flex-1 bg-[#f1f3ff] p-6 rounded-xl group/card cursor-pointer hover:bg-white transition-all shadow-[0_20px_40px_rgba(21,27,41,0.06)]">
                <div className="flex justify-between items-start mb-6">
                  <span className="material-symbols-outlined text-[#605693]">folder_zip</span>
                  <span className="text-xs text-[#484554] tracking-tight font-medium">1.2 GB</span>
                </div>
                <h4 className="font-['Plus_Jakarta_Sans'] text-xl font-bold mb-3 group-hover/card:text-[#605693] transition-colors">
                  Brutalist UI Kit v2.0
                </h4>
                <p className="text-sm text-[#484554] leading-relaxed mb-6">
                  A massive collection of raw, unpolished components for high-impact web design.
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#605693]">$49.00</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FINAL CTA ══════════ */}
      <section className="px-6 lg:px-8 py-24">
        <div className="max-w-[1200px] mx-auto bg-[#451ebb] text-white rounded-[2rem] overflow-hidden relative">
          <div className="relative z-10 p-12 lg:p-24 flex flex-col items-center text-center">
            <h2 className="font-['Plus_Jakarta_Sans'] text-4xl lg:text-6xl font-extrabold mb-8 max-w-3xl leading-tight">
              Ready to Elevate Your Creative Output?
            </h2>
            <p className="text-[#e6deff]/80 text-lg lg:text-xl mb-12 max-w-xl">
              Join a global network of elite creators and collectors who value quality over noise.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
              <Link
                href="/auth/register"
                className="bg-white text-[#451ebb] px-10 py-5 rounded-xl font-bold text-lg hover:bg-[#e6deff] transition-all shadow-[0_20px_40px_rgba(21,27,41,0.06)]"
              >
                Create Your Account
              </Link>
              <Link
                href="/browse"
                className="bg-transparent border border-white/30 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
              >
                Explore the Marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
