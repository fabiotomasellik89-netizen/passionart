"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreditCard, Truck } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/field";
import { euro } from "@/lib/utils";
import { calculateShippingOptions } from "@/lib/shipping";

const PayPalButtons = dynamic(
  () => import("@paypal/react-paypal-js").then((mod) => mod.PayPalButtons),
  { ssr: false },
);
const PayPalScriptProvider = dynamic(
  () => import("@paypal/react-paypal-js").then((mod) => mod.PayPalScriptProvider),
  { ssr: false },
);

export default function CheckoutClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, clearCart, getSubtotal, getTotalItems } = useCartStore();
  const subtotal = getSubtotal();
  const totalItems = getTotalItems();

  // Resolve shipping from URL params (set by cart page)
  const shippingId = searchParams.get("shipping") as "standard" | "express" | null;
  const shippingOptions = calculateShippingOptions(totalItems, subtotal);
  const resolvedOption =
    shippingOptions.find((o) => o.id === shippingId) ?? shippingOptions[0];
  const shippingCost = resolvedOption.price;

  const total = subtotal + shippingCost;
  const [customer, setCustomer] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isDemoPaypal = !process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  const canSubmit = useMemo(
    () =>
      Boolean(
        customer.fullName &&
          customer.email &&
          customer.address &&
          customer.city &&
          customer.zip &&
          items.length,
      ),
    [customer, items.length],
  );

  useEffect(() => {
    if (!items.length) {
      router.replace("/carrello");
    }
  }, [items.length, router]);

  if (!items.length) {
    return null;
  }

  async function finalize(orderId: string) {
    setLoading(true);
    const response = await fetch("/api/paypal/capture-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        orderData: {
          customer,
          subtotal,
          shipping: shippingCost,
          shippingOption: resolvedOption,
          total,
          items,
        },
      }),
    });
    const result = (await response.json()) as {
      success?: boolean;
      orderNumber?: string;
      error?: string;
    };
    setLoading(false);

    if (!result.success || !result.orderNumber) {
      setError(result.error || "Errore durante il salvataggio dell'ordine.");
      return;
    }

    // Send confirmation email (fire-and-forget)
    fetch("/api/orders/confirm-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderNumber: result.orderNumber,
        customer,
        items,
        subtotal,
        shippingCost,
        shippingLabel: resolvedOption.label,
        total,
      }),
    }).catch(() => {/* non-blocking */});

    clearCart();
    router.push(`/ordine-confermato?order=${result.orderNumber}`);
  }

  async function createOrder() {
    if (!canSubmit) {
      setError("Compila tutti i campi obbligatori prima del pagamento.");
      throw new Error("Form incompleto");
    }

    const response = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total }),
    });
    const result = (await response.json()) as { id?: string; error?: string };

    if (!result.id) {
      throw new Error(result.error || "Ordine PayPal non creato");
    }

    return result.id;
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-10 md:px-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.24em] text-[var(--color-muted)]">
            Checkout
          </p>
          <h1 className="font-display text-5xl text-[var(--color-foreground)]">
            Completa il tuo ordine PassionArt.
          </h1>
        </div>

        <Card className="space-y-5">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-[var(--color-accent)]" />
            <p className="font-semibold text-[var(--color-foreground)]">Dati cliente e spedizione</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nome e cognome">
              <Input
                value={customer.fullName}
                onChange={(event) =>
                  setCustomer((current) => ({ ...current, fullName: event.target.value }))
                }
              />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                value={customer.email}
                onChange={(event) =>
                  setCustomer((current) => ({ ...current, email: event.target.value }))
                }
              />
            </Field>
            <Field label="Telefono">
              <Input
                value={customer.phone}
                onChange={(event) =>
                  setCustomer((current) => ({ ...current, phone: event.target.value }))
                }
              />
            </Field>
            <Field label="CAP">
              <Input
                value={customer.zip}
                onChange={(event) =>
                  setCustomer((current) => ({ ...current, zip: event.target.value }))
                }
              />
            </Field>
            <Field label="Indirizzo" hint="Via, numero civico e dettagli aggiuntivi">
              <Input
                className="md:col-span-2"
                value={customer.address}
                onChange={(event) =>
                  setCustomer((current) => ({ ...current, address: event.target.value }))
                }
              />
            </Field>
            <Field label="Città">
              <Input
                value={customer.city}
                onChange={(event) =>
                  setCustomer((current) => ({ ...current, city: event.target.value }))
                }
              />
            </Field>
          </div>
          <Field label="Note per il laboratorio">
            <Textarea
              value={customer.notes}
              onChange={(event) =>
                setCustomer((current) => ({ ...current, notes: event.target.value }))
              }
              placeholder="Palette preferita, richieste sulla confezione o altri dettagli utili."
            />
          </Field>
        </Card>

        <Card className="space-y-5">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-[var(--color-accent)]" />
            <p className="font-semibold text-[var(--color-foreground)]">Pagamento</p>
          </div>
          {error ? (
            <div className="rounded-[1.5rem] border border-[var(--color-error)]/20 bg-[rgba(193,79,88,0.08)] px-4 py-3 text-sm text-[var(--color-error)]">
              {error}
            </div>
          ) : null}
          {isDemoPaypal ? (
            <div className="space-y-4">
              <p className="text-sm leading-7 text-[var(--color-muted)]">
                Modalità demo attiva: mancano le credenziali PayPal sandbox. Puoi comunque
                simulare l&apos;ordine end-to-end per verificare il flusso.
              </p>
              <Button
                className="w-full"
                size="lg"
                disabled={!canSubmit || loading}
                onClick={async () => finalize(`DEMO-${Date.now()}`)}
              >
                {loading ? "Elaborazione..." : "Conferma ordine demo"}
              </Button>
            </div>
          ) : (
            <PayPalScriptProvider
              options={{
                clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string,
                currency: "EUR",
              }}
            >
              <PayPalButtons
                style={{ layout: "vertical", color: "gold", shape: "pill" }}
                createOrder={createOrder}
                onApprove={async (data) => {
                  if (!data.orderID) {
                    setError("Impossibile recuperare l'ordine PayPal.");
                    return;
                  }
                  await finalize(data.orderID);
                }}
                onError={() => setError("Si è verificato un errore nel pagamento PayPal.")}
              />
            </PayPalScriptProvider>
          )}
        </Card>
      </div>

      <div className="lg:sticky lg:top-24 lg:h-fit">
        <Card className="space-y-5">
          <h2 className="font-display text-4xl text-[var(--color-foreground)]">
            Riepilogo
          </h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-4 border-b border-[var(--color-line)] pb-4"
              >
                <div>
                  <p className="font-semibold text-[var(--color-foreground)]">{item.name}</p>
                  <p className="text-sm text-[var(--color-muted)]">
                    {item.quantity} pz · {item.configuration.format} · {item.configuration.paletteSize ?? item.configuration.size ?? ""}
                  </p>
                </div>
                <span className="font-semibold">{euro(item.totalPrice)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-muted)]">Subtotale</span>
              <span className="font-semibold">{euro(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-muted)]">{resolvedOption.label}</span>
              <span className="font-semibold">
                {shippingCost === 0 ? "Inclusa" : euro(shippingCost)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--color-line)] pt-3">
              <span className="font-semibold text-[var(--color-foreground)]">Totale</span>
              <span className="text-2xl font-semibold text-[var(--color-accent)]">
                {euro(total)}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
