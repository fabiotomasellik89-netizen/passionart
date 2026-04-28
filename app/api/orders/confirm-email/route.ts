import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import type { CartItem, CustomerInfo } from "@/types";

interface EmailPayload {
  orderNumber: string;
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  shippingLabel: string;
  total: number;
}

function formatEuro(amount: number): string {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(amount);
}

function buildEmailHtml(payload: EmailPayload): string {
  const { orderNumber, customer, items, subtotal, shippingCost, shippingLabel, total } = payload;

  const itemsRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #f0e8e0;font-size:14px;color:#3d2d2f;">
          ${item.name}
          <br/>
          <span style="font-size:12px;color:#7b6768;">
            ${item.quantity} pz · ${item.configuration.format} · ${item.configuration.paletteSize ?? item.configuration.size ?? ""}
            ${item.configuration.names ? ` · Per: ${item.configuration.names}` : ""}
          </span>
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #f0e8e0;font-size:14px;color:#3d2d2f;text-align:right;font-weight:600;">
          ${formatEuro(item.totalPrice)}
        </td>
      </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Conferma ordine PassionArt</title>
</head>
<body style="margin:0;padding:0;background:#fcf7f2;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fcf7f2;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#f2d7dd,#d46a92 50%,#f7efe4);border-radius:20px 20px 0 0;padding:36px 40px;text-align:center;">
              <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(255,255,255,0.8);">Make Your Dreams</p>
              <h1 style="margin:0;font-size:32px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">PassionArt</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:36px 40px;">
              <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#3d2d2f;">
                Ordine confermato!
              </h2>
              <p style="margin:0 0 24px;font-size:14px;color:#7b6768;line-height:1.6;">
                Ciao ${customer.fullName},<br/>
                abbiamo ricevuto il tuo ordine e siamo già al lavoro per le tue bomboniere artigianali.
              </p>

              <!-- Order number -->
              <div style="background:#fff8f2;border:1px solid rgba(141,116,109,0.16);border-radius:14px;padding:14px 20px;margin-bottom:28px;">
                <p style="margin:0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#7b6768;">Numero ordine</p>
                <p style="margin:4px 0 0;font-size:18px;font-weight:700;color:#bf4f7b;">#${orderNumber}</p>
              </div>

              <!-- Items table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <thead>
                  <tr>
                    <th style="padding:8px 12px;background:#fff8f2;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;color:#7b6768;text-align:left;border-radius:8px 0 0 0;">Articolo</th>
                    <th style="padding:8px 12px;background:#fff8f2;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;color:#7b6768;text-align:right;border-radius:0 8px 0 0;">Importo</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>

              <!-- Totals -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:6px 12px;font-size:13px;color:#7b6768;">Subtotale</td>
                  <td style="padding:6px 12px;font-size:13px;color:#3d2d2f;text-align:right;">${formatEuro(subtotal)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 12px;font-size:13px;color:#7b6768;">${shippingLabel}</td>
                  <td style="padding:6px 12px;font-size:13px;color:#3d2d2f;text-align:right;">${shippingCost === 0 ? "Inclusa" : formatEuro(shippingCost)}</td>
                </tr>
                <tr>
                  <td style="padding:10px 12px;font-size:15px;font-weight:700;color:#3d2d2f;border-top:2px solid #f0e8e0;">Totale</td>
                  <td style="padding:10px 12px;font-size:18px;font-weight:700;color:#bf4f7b;text-align:right;border-top:2px solid #f0e8e0;">${formatEuro(total)}</td>
                </tr>
              </table>

              <!-- Shipping address -->
              <div style="background:#fff8f2;border:1px solid rgba(141,116,109,0.16);border-radius:14px;padding:14px 20px;margin-bottom:28px;">
                <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#7b6768;">Indirizzo di consegna</p>
                <p style="margin:0;font-size:13px;color:#3d2d2f;line-height:1.7;">
                  ${customer.fullName}<br/>
                  ${customer.address}<br/>
                  ${customer.zip} ${customer.city}
                </p>
              </div>

              <p style="margin:0;font-size:13px;color:#7b6768;line-height:1.7;">
                Riceverai un aggiornamento appena il tuo ordine viene spedito.<br/>
                Per qualsiasi domanda scrivi a <a href="mailto:ciao@passionart.it" style="color:#bf4f7b;">ciao@passionart.it</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f3e4d8;border-radius:0 0 20px 20px;padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#7b6768;">
                PassionArt · Make Your Dreams
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as EmailPayload;

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT ?? "587");
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const fromEmail = process.env.SMTP_FROM ?? "ciao@passionart.it";

    if (!smtpHost || !smtpUser || !smtpPass) {
      // SMTP not configured – log for dev and return success so flow continues
      console.warn("[PassionArt] Email not sent: SMTP env vars not configured.");
      return NextResponse.json({ success: true, skipped: true });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: `"PassionArt" <${fromEmail}>`,
      to: payload.customer.email,
      subject: `Conferma ordine #${payload.orderNumber} – PassionArt`,
      html: buildEmailHtml(payload),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PassionArt] Email error:", err);
    return NextResponse.json({ success: false, error: "Email non inviata." }, { status: 500 });
  }
}
