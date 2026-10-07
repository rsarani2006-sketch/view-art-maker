import { useState } from "react";
import { z } from "zod";

import { formatPrice } from "@/data/movies";

const cardSchema = z.object({
  name: z.string().trim().min(2, "Enter the name on the card").max(60),
  number: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry must be MM/YY"),
  cvv: z.string().regex(/^\d{3}$/, "CVV must be 3 digits"),
});
const upiSchema = z
  .string()
  .trim()
  .regex(/^[\w.-]{2,}@[a-zA-Z]{2,}$/, "Enter a valid UPI ID, e.g. name@okaxis");

type Props = { total: number; onPaid: (method: string) => void; onCancel: () => void };

const inputCls =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary";

export function DemoPayment({ total, onPaid, onCancel }: Props) {
  const [method, setMethod] = useState<"upi" | "card">("upi");
  const [upi, setUpi] = useState("");
  const [card, setCard] = useState({ name: "", number: "", expiry: "", cvv: "" });
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  const pay = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed =
      method === "upi"
        ? upiSchema.safeParse(upi)
        : cardSchema.safeParse({ ...card, number: card.number.replace(/\s/g, "") });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check your details");
      return;
    }
    setPaying(true);
    setTimeout(() => onPaid(method === "upi" ? "UPI" : "Card"), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <form onSubmit={pay} className="w-full max-w-md rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-3xl text-foreground">Payment</h2>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
            Demo · no real money
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Amount to pay <span className="font-semibold text-primary">{formatPrice(total)}</span>
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          {(["upi", "card"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMethod(m); setError(null); }}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                method === m ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary"
              }`}
            >
              {m === "upi" ? "UPI" : "Credit / Debit card"}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          {method === "upi" ? (
            <input aria-label="UPI ID" placeholder="yourname@okaxis" value={upi} onChange={(e) => setUpi(e.target.value)} className={inputCls} />
          ) : (
            <>
              <input aria-label="Name on card" placeholder="Name on card" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} className={inputCls} />
              <input aria-label="Card number" inputMode="numeric" placeholder="4111 1111 1111 1111" maxLength={19} value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} className={inputCls} />
              <div className="grid grid-cols-2 gap-3">
                <input aria-label="Expiry" placeholder="MM/YY" maxLength={5} value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} className={inputCls} />
                <input aria-label="CVV" type="password" inputMode="numeric" placeholder="CVV" maxLength={3} value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} className={inputCls} />
              </div>
            </>
          )}
        </div>

        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onCancel} disabled={paying} className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground">
            Back
          </button>
          <button type="submit" disabled={paying} className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
            {paying ? "Processing…" : `Pay ${formatPrice(total)}`}
          </button>
        </div>
      </form>
    </div>
  );
}
