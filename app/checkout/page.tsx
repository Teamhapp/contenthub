"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/constants";
import Link from "next/link";
import { ContentTypeIcon, IconTrash, IconShield, IconArrowRight, IconCart } from "@/components/ui/Icons";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetch("/api/cart")
      .then((r) => r.json())
      .then(setCart)
      .finally(() => setLoading(false));
  }, []);

  async function removeItem(contentId: string) {
    await fetch(`/api/cart/${contentId}`, { method: "DELETE" });
    setCart({ ...cart, items: cart.items.filter((item: any) => item.content._id !== contentId) });
  }

  async function handleCheckout() {
    setProcessing(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok) router.push(`/checkout/success?transactionId=${data.transactionId}`);
      else alert(data.error || "Checkout failed");
    } catch { alert("Something went wrong"); }
    setProcessing(false);
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="section-title mb-8">Shopping Cart</h1>
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="card p-4"><div className="skeleton h-16 rounded-xl" /></div>
          ))}
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const total = items.reduce((sum: number, item: any) => sum + (item.content?.price || 0), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Steps */}
      <div className="flex items-center justify-center gap-4 mb-10">
        {["Cart", "Payment", "Complete"].map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              i === 0 ? "bg-brand-600 text-white" : "bg-surface-200 text-surface-500"
            }`}>
              {i + 1}
            </div>
            <span className={`text-sm font-medium ${i === 0 ? "text-brand-600" : "text-surface-400"}`}>{step}</span>
            {i < 2 && <div className="w-12 h-px bg-surface-200" />}
          </div>
        ))}
      </div>

      <h1 className="section-title mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
            <IconCart className="w-8 h-8 text-surface-400" />
          </div>
          <p className="text-surface-500 text-lg mb-1 font-medium">Your cart is empty</p>
          <p className="text-surface-400 text-sm mb-6">Add some content to get started</p>
          <Link href="/browse" className="btn-primary">
            Browse Content
            <IconArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item: any) => (
              <div key={item.content._id} className="card p-4 flex items-center gap-4">
                <div className="w-16 h-16 bg-surface-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {item.content.thumbnailUrl ? (
                    <img src={item.content.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <ContentTypeIcon type={item.content.type} className="w-7 h-7 text-surface-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-surface-900 truncate">{item.content.title}</h3>
                  <p className="text-xs text-surface-400 capitalize mt-0.5">{item.content.type}</p>
                  {item.content.creator && (
                    <p className="text-xs text-surface-400">by {item.content.creator.name}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-brand-600 font-display">{formatPrice(item.content.price)}</p>
                  <button onClick={() => removeItem(item.content._id)} className="btn-danger p-1 mt-1">
                    <IconTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24 shadow-soft-lg">
              <h2 className="font-display font-bold text-lg mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-surface-500">
                  <span>Items ({items.length})</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="border-t border-surface-100 pt-3">
                  <div className="flex justify-between font-display font-bold text-xl">
                    <span>Total</span>
                    <span className="text-gradient">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Mock Payment */}
              <div className="mt-6 p-4 bg-surface-50 rounded-xl border border-surface-200">
                <div className="flex items-center gap-2 text-xs text-surface-500 font-semibold uppercase tracking-wider mb-3">
                  <IconShield className="w-3.5 h-3.5" />
                  Secure Mock Payment
                </div>
                <div className="space-y-2">
                  <input type="text" defaultValue="4242 4242 4242 4242" className="input text-sm bg-white" readOnly />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" defaultValue="12/28" className="input text-sm bg-white" readOnly />
                    <input type="text" defaultValue="123" className="input text-sm bg-white" readOnly />
                  </div>
                </div>
                <p className="text-xs text-surface-400 mt-2">Demo mode - no real charges</p>
              </div>

              <button
                onClick={handleCheckout}
                disabled={processing}
                className="w-full mt-4 btn-primary py-3 text-base justify-center hero-gradient border-0"
              >
                {processing ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Processing...
                  </>
                ) : (
                  <>Pay {formatPrice(total)} <IconArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
