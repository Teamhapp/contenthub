"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/constants";
import Link from "next/link";
import { ContentTypeIcon, IconTrash, IconShield, IconArrowRight, IconCart, IconCheck, IconTag } from "@/components/ui/Icons";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [discount, setDiscount] = useState<{ code: string; amount: number; percent?: number } | null>(null);

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

  async function applyCoupon() {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    setDiscount(null);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), totalAmount: total }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setDiscount({ code: couponCode.trim(), amount: data.discount, percent: data.percent });
      } else {
        setCouponError(data.error || "Invalid coupon code");
      }
    } catch {
      setCouponError("Failed to validate coupon");
    }
    setCouponLoading(false);
  }

  async function handleCheckout() {
    setProcessing(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ couponCode: discount?.code }),
      });
      const data = await res.json();
      if (res.ok) router.push(`/checkout/success?transactionId=${data.transactionId}`);
      else alert(data.error || "Checkout failed");
    } catch { alert("Something went wrong"); }
    setProcessing(false);
  }

  const items = cart?.items || [];
  const total = items.reduce((sum: number, item: any) => sum + (item.content?.price || 0), 0);
  const finalTotal = discount ? Math.max(0, total - discount.amount) : total;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fade-in">
        {/* Skeleton steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="skeleton w-10 h-10 rounded-full" />
              <div className="skeleton w-16 h-4 rounded-lg" />
              {i < 2 && <div className="skeleton w-16 h-0.5 rounded-full" />}
            </div>
          ))}
        </div>
        <div className="skeleton h-8 w-48 rounded-xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-5"><div className="skeleton h-20 rounded-xl" /></div>
            ))}
          </div>
          <div className="card p-6">
            <div className="skeleton h-64 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    { label: "Cart", active: true, completed: false },
    { label: "Payment", active: false, completed: false },
    { label: "Complete", active: false, completed: false },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fade-in">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-12">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                step.completed
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                  : step.active
                    ? "bg-[#451ebb] text-white shadow-lg shadow-[#451ebb]/40"
                    : "bg-[#f1f3ff] text-[#797586] border border-[#e2e8fc]"
              }`}>
                {step.completed ? (
                  <IconCheck className="w-5 h-5" />
                ) : (
                  i + 1
                )}
                {step.active && (
                  <div className="absolute inset-0 rounded-full bg-[#5d3fd3]/20 animate-pulse" />
                )}
              </div>
              <span className={`text-xs font-semibold tracking-wide ${
                step.active ? "text-[#451ebb]" : step.completed ? "text-emerald-600" : "text-[#797586]"
              }`}>{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-16 sm:w-24 h-0.5 mx-3 mb-5 rounded-full ${
                step.completed ? "bg-gradient-to-r from-emerald-500 to-brand-500" : "bg-[#e2e8fc]"
              }`} />
            )}
          </div>
        ))}
      </div>

      <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="empty-state card py-20">
          <div className="empty-state-icon">
            <IconCart className="w-10 h-10 text-[#797586]" />
          </div>
          <h2 className="text-xl font-['Plus_Jakarta_Sans'] font-bold text-[#151b29] mb-2">Your cart is empty</h2>
          <p className="text-[#797586] text-sm mb-8 max-w-xs mx-auto">
            Discover premium content from talented creators and add them to your cart.
          </p>
          <Link href="/browse" className="btn-primary px-8 py-3">
            Browse Content
            <IconArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item: any, index: number) => (
              <div
                key={item.content._id}
                className="card p-4 sm:p-5 flex items-center gap-4 group hover:shadow-soft-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-surface-100 to-surface-50 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-[#f1f3ff]">
                  {item.content.thumbnailUrl ? (
                    <img src={item.content.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand-50 to-purple-50 flex items-center justify-center">
                      <ContentTypeIcon type={item.content.type} className="w-8 h-8 text-brand-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-['Plus_Jakarta_Sans'] font-semibold text-[#151b29] truncate">{item.content.title}</h3>
                  {item.content.creator && (
                    <p className="text-xs text-[#797586] mt-0.5">by {item.content.creator.name}</p>
                  )}
                  <div className="mt-1.5">
                    <span className={`badge-${item.content.type === "video" ? "info" : item.content.type === "article" ? "success" : "warning"} text-[10px] uppercase tracking-wider`}>
                      {item.content.type}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 flex flex-col items-end gap-2">
                  <p className="price-tag text-lg">{formatPrice(item.content.price)}</p>
                  <button
                    onClick={() => removeItem(item.content._id)}
                    className="btn-danger p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    title="Remove item"
                  >
                    <IconTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24 shadow-soft-lg">
              <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-lg mb-5">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[#797586]">
                  <span>Items ({items.length})</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-[#797586]">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-[#797586]">
                  <span>Tax</span>
                  <span className="text-[#797586]">$0.00</span>
                </div>

                {discount && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span className="flex items-center gap-1">
                      <IconTag className="w-3.5 h-3.5" />
                      Discount {discount.percent ? `(${discount.percent}%)` : ""}
                    </span>
                    <span>-{formatPrice(discount.amount)}</span>
                  </div>
                )}

                <div className="divider-gradient" />

                <div className="flex justify-between font-['Plus_Jakarta_Sans'] font-bold text-xl pt-1">
                  <span>Total</span>
                  <div className="text-right">
                    {discount && (
                      <span className="block text-sm font-normal text-[#797586] line-through mb-0.5">
                        {formatPrice(total)}
                      </span>
                    )}
                    <span className="text-gradient">{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Coupon Code */}
              <div className="mt-5 p-4 bg-[#faf8ff] rounded-xl border border-[#f1f3ff]">
                <label className="text-xs font-semibold text-[#797586] uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                  <IconTag className="w-3.5 h-3.5" />
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code"
                    className="input text-sm flex-1"
                    onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="btn-secondary px-4 py-2 text-sm flex-shrink-0"
                  >
                    {couponLoading ? "..." : "Apply"}
                  </button>
                </div>
                {couponError && (
                  <p className="text-xs text-red-500 mt-2 font-medium">{couponError}</p>
                )}
                {discount && (
                  <p className="text-xs text-emerald-600 mt-2 font-medium flex items-center gap-1">
                    <IconCheck className="w-3.5 h-3.5" />
                    Coupon applied! You save {formatPrice(discount.amount)}
                  </p>
                )}
              </div>

              {/* Mock Payment */}
              <div className="mt-5 p-4 bg-[#faf8ff] rounded-xl border border-[#e2e8fc]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs text-[#797586] font-semibold uppercase tracking-wider">
                    <IconShield className="w-3.5 h-3.5" />
                    Payment Details
                  </div>
                  <span className="badge-success text-[10px] flex items-center gap-1">
                    <IconShield className="w-2.5 h-2.5" />
                    Secure
                  </span>
                </div>
                <div className="space-y-2">
                  <input type="text" defaultValue="4242 4242 4242 4242" className="input text-sm bg-white font-mono tracking-wider" readOnly />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" defaultValue="12/28" className="input text-sm bg-white font-mono" readOnly />
                    <input type="text" defaultValue="123" className="input text-sm bg-white font-mono" readOnly />
                  </div>
                </div>
                <p className="text-[11px] text-[#797586] mt-2.5 text-center">Demo mode &mdash; no real charges will be made</p>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={processing}
                className="w-full mt-5 btn-glow py-3.5 text-base justify-center font-['Plus_Jakarta_Sans'] font-bold"
              >
                {processing ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Processing...
                  </>
                ) : (
                  <>Pay {formatPrice(finalTotal)} <IconArrowRight className="w-4 h-4 ml-1" /></>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
