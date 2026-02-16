"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Tag } from "lucide-react";
import { createPromoCode, togglePromoCode } from "./actions";

interface PromoCode {
  id: string;
  code: string;
  type: string;
  value: number;
  maxUses: number;
  currentUses: number;
  expiresAt: Date | null;
  active: boolean;
  createdAt: Date;
}

export default function PromoManager({ initialPromos }: { initialPromos: PromoCode[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState("");
  const [type, setType] = useState<"percentage" | "fixed">("percentage");
  const [value, setValue] = useState("");
  const [maxUses, setMaxUses] = useState("0");
  const [expiresAt, setExpiresAt] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await createPromoCode({
        code,
        type,
        value: type === "fixed" ? Math.round(parseFloat(value) * 100) : parseInt(value),
        maxUses: parseInt(maxUses) || 0,
        expiresAt: expiresAt || undefined,
      });
      if (result.error) {
        setError(result.error);
      } else {
        setShowForm(false);
        setCode("");
        setValue("");
        setMaxUses("0");
        setExpiresAt("");
        router.refresh();
      }
    });
  }

  function handleToggle(id: string) {
    startTransition(async () => {
      await togglePromoCode(id);
      router.refresh();
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Promo Codes</h1>
          <p className="text-muted text-sm mt-1">{initialPromos.length} codes created</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors"
        >
          <Plus size={16} /> Create Code
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-card-bg border border-card-border rounded-xl p-6 mb-6 space-y-4">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Code *</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                required
                placeholder="SAVE20"
                className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent outline-none uppercase tracking-wider font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "percentage" | "fixed")}
                className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent outline-none"
              >
                <option value="percentage">Percentage Off</option>
                <option value="fixed">Fixed Amount Off</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Value ({type === "percentage" ? "%" : "$"}) *
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
                min="1"
                step={type === "fixed" ? "0.01" : "1"}
                className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Max Uses (0 = unlimited)</label>
              <input
                type="number"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                min="0"
                className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Expires At</label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors disabled:opacity-50"
          >
            {isPending ? "Creating..." : "Create Promo Code"}
          </button>
        </form>
      )}

      <div className="bg-card-bg border border-card-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-card-border bg-muted-bg/50">
              <th className="text-left px-4 py-3 font-medium text-foreground">Code</th>
              <th className="text-left px-4 py-3 font-medium text-foreground">Discount</th>
              <th className="text-left px-4 py-3 font-medium text-foreground">Usage</th>
              <th className="text-left px-4 py-3 font-medium text-foreground">Expires</th>
              <th className="text-left px-4 py-3 font-medium text-foreground">Status</th>
              <th className="text-right px-4 py-3 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialPromos.map((promo) => (
              <tr key={promo.id} className="border-b border-card-border last:border-0">
                <td className="px-4 py-3">
                  <span className="font-mono font-semibold flex items-center gap-1.5">
                    <Tag size={14} className="text-accent" />
                    {promo.code}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {promo.type === "percentage" ? `${promo.value}%` : `$${(promo.value / 100).toFixed(2)}`}
                </td>
                <td className="px-4 py-3">
                  {promo.currentUses}{promo.maxUses > 0 ? ` / ${promo.maxUses}` : " (unlimited)"}
                </td>
                <td className="px-4 py-3 text-muted">
                  {promo.expiresAt ? new Date(promo.expiresAt).toLocaleDateString() : "Never"}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    promo.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {promo.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleToggle(promo.id)}
                    disabled={isPending}
                    className="text-sm text-accent hover:text-accent-dark font-medium"
                  >
                    {promo.active ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
            {initialPromos.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted">No promo codes yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
