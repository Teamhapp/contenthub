import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#f8f9fc] border-t border-[#e2e8fc]/50 font-['Plus_Jakarta_Sans']">
      <div className="w-full py-16 px-6 lg:px-8 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-12">
          <div>
            <div className="text-2xl font-black text-[#151b29] mb-4">The Digital Atelier</div>
            <p className="text-[#797586] text-sm max-w-xs leading-relaxed">
              The world&apos;s premier destination for high-fidelity digital assets and creator culture.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#151b29]">Platform</span>
              <Link href="/browse" className="text-[#797586] hover:text-[#451ebb] transition-colors text-sm">Explore</Link>
              <Link href="/browse" className="text-[#797586] hover:text-[#451ebb] transition-colors text-sm">Creators</Link>
              <Link href="/browse" className="text-[#797586] hover:text-[#451ebb] transition-colors text-sm">Marketplace</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#151b29]">Resources</span>
              <span className="text-[#797586] text-sm">API</span>
              <span className="text-[#797586] text-sm">Contact</span>
              <span className="text-[#797586] text-sm">Help Center</span>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#151b29]">Legal</span>
              <span className="text-[#797586] text-sm">Terms</span>
              <span className="text-[#797586] text-sm">Privacy</span>
              <span className="text-[#797586] text-sm">Cookies</span>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#151b29]">Stay Updated</span>
              <div className="flex gap-2">
                <input className="bg-white border-none focus:ring-1 focus:ring-[#451ebb] rounded-lg text-sm w-32 px-3 py-2" placeholder="Email" type="email" />
                <button className="bg-[#151b29] text-white p-2 rounded-lg">
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#e2e8fc] text-xs uppercase tracking-[0.12em] text-[#797586]">
          <span>&copy; {new Date().getFullYear()} The Digital Atelier. All rights reserved.</span>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="hover:text-[#451ebb] transition-colors cursor-pointer">Twitter</span>
            <span className="hover:text-[#451ebb] transition-colors cursor-pointer">Instagram</span>
            <span className="hover:text-[#451ebb] transition-colors cursor-pointer">LinkedIn</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
