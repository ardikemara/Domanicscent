import "server-only";

// Kirim email via Resend REST langsung (tanpa SDK, ikut pola Midtrans/RajaOngkir).
// Fallback aman: kalau RESEND_API_KEY belum di-set atau request gagal, return
// { ok:false } tanpa throw, jadi pemanggil (mis. subscribeLead) nggak ke-blok.

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export function siteUrl() {
  return (process.env.SITE_URL || "https://www.domanicscent.com").replace(/\/$/, "");
}

export async function sendEmail({ to, subject, html, replyTo }) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "DOMANIC <onboarding@resend.dev>";
  if (!key) return { ok: false, skipped: true }; // belum dikonfigurasi, no-op
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, html, reply_to: replyTo || undefined }),
    });
    if (!res.ok) return { ok: false, error: `resend ${res.status}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: "send-failed" };
  }
}

// Warna brand (inline, biar aman di semua email client).
const C = {
  paper: "#FAF7F2", cream: "#EFE6D8", beige: "#D8C7B0",
  umber: "#4A3C2E", charcoal: "#2A2420", taupe: "#A08870", gold: "#C89B4A",
};

function esc(s) {
  return String(s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

// Bangun email hasil quiz persona buat satu produk. Return { subject, html }.
export function personaResultEmail(product, name) {
  const url = siteUrl();
  const greetName = (name || "").toString().trim();
  const promo = process.env.WELCOME_PROMO || "DOMANIC10";
  const productUrl = `${url}/products/${product.slug}`;
  const img = product.image?.startsWith("http") ? product.image : `${url}${product.image}`;
  const notes = product.notes
    ? [
        product.notes.top?.length ? `Top: ${product.notes.top.join(", ")}` : null,
        product.notes.mid?.length ? `Mid: ${product.notes.mid.join(", ")}` : null,
        product.notes.base?.length ? `Base: ${product.notes.base.join(", ")}` : null,
      ].filter(Boolean)
    : [];
  const story = product.noteStory || product.story || product.tagline || "";

  const subject = `Kamu ${product.persona}. Ini parfum-mu, ${product.name}.`;

  const html = `<!doctype html>
<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:${C.paper};font-family:Arial,Helvetica,sans-serif;color:${C.charcoal}">
<span style="display:none;max-height:0;overflow:hidden;opacity:0">Persona wangimu udah ketemu. Kenalan sama ${esc(product.name)}.</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper}">
  <tr><td align="center" style="padding:28px 16px">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid ${C.cream};border-radius:14px;overflow:hidden">
      <tr><td style="padding:26px 30px 6px;text-align:center">
        <div style="font-size:18px;letter-spacing:6px;color:${C.umber};font-weight:bold">DOMANIC</div>
      </td></tr>
      <tr><td style="padding:14px 30px 0;text-align:center">
        ${greetName ? `<div style="font-size:14px;color:${C.charcoal};margin-bottom:10px">Halo ${esc(greetName)},</div>` : ""}
        <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${C.taupe}">Persona wangimu</div>
        <div style="font-size:15px;color:${C.gold};font-style:italic;margin-top:8px">${esc(product.persona)}</div>
        <div style="font-size:26px;color:${C.umber};margin-top:4px">${esc(product.name)}</div>
      </td></tr>
      <tr><td style="padding:22px 30px 0;text-align:center">
        <img src="${esc(img)}" alt="${esc(product.name)}" width="280" style="width:280px;max-width:80%;border-radius:10px;display:block;margin:0 auto">
      </td></tr>
      <tr><td style="padding:20px 34px 0;text-align:center">
        <p style="font-size:15px;line-height:1.6;color:${C.charcoal};font-style:italic;margin:0 0 14px">${esc(product.tagline || "")}</p>
        <p style="font-size:14px;line-height:1.7;color:${C.charcoal};margin:0">${esc(story)}</p>
      </td></tr>
      ${notes.length ? `<tr><td style="padding:18px 34px 0">
        <div style="background:${C.cream};border-radius:10px;padding:16px 18px">
          ${notes.map((n) => `<div style="font-size:13px;color:${C.umber};padding:3px 0">${esc(n)}</div>`).join("")}
        </div>
      </td></tr>` : ""}
      <tr><td style="padding:22px 34px 0;text-align:center">
        <div style="border:1px dashed ${C.beige};border-radius:10px;padding:16px">
          <div style="font-size:12px;color:${C.taupe};text-transform:uppercase;letter-spacing:2px">Buat order pertamamu</div>
          <div style="font-size:22px;color:${C.umber};font-weight:bold;letter-spacing:2px;margin-top:6px">${esc(promo)}</div>
          <div style="font-size:12px;color:${C.taupe};margin-top:4px">pakai pas checkout</div>
        </div>
      </td></tr>
      <tr><td style="padding:24px 34px 30px;text-align:center">
        <a href="${esc(productUrl)}" style="display:inline-block;background:${C.umber};color:${C.paper};text-decoration:none;font-size:14px;letter-spacing:2px;padding:13px 30px;border-radius:999px">KENALAN SAMA ${esc((product.name || "").toUpperCase())}</a>
      </td></tr>
    </table>
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">
      <tr><td style="padding:18px 30px;text-align:center">
        <p style="font-size:11px;line-height:1.6;color:${C.taupe};margin:0">Kamu nerima email ini karena ikut quiz persona di domanicscent.com.<br>DOMANIC, extrait de parfum, dibikin pelan di Indonesia.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  return { subject, html };
}

function rp(n) {
  return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

// Email konfirmasi order (dikirim pas order dibuat).
export function orderConfirmationEmail(o) {
  const url = siteUrl();
  const payUrl = `${url}/pay/${o.orderNumber}`;
  const rows = (o.items || []).map((it) => `
    <tr>
      <td style="padding:8px 0;font-size:14px;color:${C.charcoal}">${esc(it.name)} <span style="color:${C.taupe}">× ${it.qty}</span></td>
      <td style="padding:8px 0;font-size:14px;color:${C.charcoal};text-align:right">${rp(it.lineTotal)}</td>
    </tr>`).join("");
  const line = (label, val, strong) => `
    <tr>
      <td style="padding:4px 0;font-size:${strong ? "15px" : "13px"};color:${strong ? C.umber : C.taupe};${strong ? "font-weight:bold" : ""}">${esc(label)}</td>
      <td style="padding:4px 0;font-size:${strong ? "15px" : "13px"};color:${strong ? C.umber : C.charcoal};text-align:right;${strong ? "font-weight:bold" : ""}">${esc(val)}</td>
    </tr>`;
  const subject = `Pesananmu diterima, ${o.orderNumber}`;
  const html = `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:${C.paper};font-family:Arial,Helvetica,sans-serif;color:${C.charcoal}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper}"><tr><td align="center" style="padding:28px 16px">
  <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fff;border:1px solid ${C.cream};border-radius:14px">
    <tr><td style="padding:26px 34px 4px;text-align:center"><div style="font-size:18px;letter-spacing:6px;color:${C.umber};font-weight:bold">DOMANIC</div></td></tr>
    <tr><td style="padding:14px 34px 0;text-align:center">
      <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${C.taupe}">Pesanan diterima</div>
      <div style="font-size:22px;color:${C.umber};margin-top:6px">${esc(o.orderNumber)}</div>
      <p style="font-size:14px;color:${C.charcoal};margin:12px 0 0">Makasih${o.name ? ` ${esc(o.name)}` : ""}, pesananmu udah kami terima. Lanjut bayar biar segera kami proses.</p>
    </td></tr>
    <tr><td style="padding:20px 34px 0">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${C.cream};border-bottom:1px solid ${C.cream}">${rows}</table>
    </td></tr>
    <tr><td style="padding:14px 34px 0">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${line("Subtotal", rp(o.subtotal))}
        ${o.discount > 0 ? line(`Diskon${o.promoCode ? ` (${o.promoCode})` : ""}`, "-" + rp(o.discount)) : ""}
        ${line("Ongkir", o.shipping === 0 ? "Gratis" : rp(o.shipping))}
        ${line("Total", rp(o.total), true)}
      </table>
    </td></tr>
    <tr><td style="padding:24px 34px 30px;text-align:center">
      <a href="${esc(payUrl)}" style="display:inline-block;background:${C.umber};color:${C.paper};text-decoration:none;font-size:14px;letter-spacing:2px;padding:13px 30px;border-radius:999px">LANJUTKAN PEMBAYARAN</a>
      <p style="font-size:12px;color:${C.taupe};margin:14px 0 0">Kalau udah bayar, abaikan email ini.</p>
    </td></tr>
  </table>
  <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%"><tr><td style="padding:18px 30px;text-align:center">
    <p style="font-size:11px;line-height:1.6;color:${C.taupe};margin:0">DOMANIC, extrait de parfum, dibikin pelan di Indonesia.</p>
  </td></tr></table>
</td></tr></table></body></html>`;
  return { subject, html };
}

// Email welcome pas subscribe newsletter.
export function welcomeEmail({ name } = {}) {
  const url = siteUrl();
  const promo = process.env.WELCOME_PROMO || "DOMANIC10";
  const subject = "Selamat datang di DOMANIC";
  const html = `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:${C.paper};font-family:Arial,Helvetica,sans-serif;color:${C.charcoal}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper}"><tr><td align="center" style="padding:28px 16px">
  <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fff;border:1px solid ${C.cream};border-radius:14px">
    <tr><td style="padding:26px 34px 4px;text-align:center"><div style="font-size:18px;letter-spacing:6px;color:${C.umber};font-weight:bold">DOMANIC</div></td></tr>
    <tr><td style="padding:16px 34px 0;text-align:center">
      <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${C.taupe}">Welcome</div>
      <div style="font-size:22px;color:${C.umber};margin-top:6px">Wear your identity</div>
      <p style="font-size:14px;line-height:1.7;color:${C.charcoal};margin:14px 0 0">${name ? `Halo ${esc(name)}, makasih` : "Makasih"} udah gabung. Kamu bakal dapet early drops, styling notes, dan promo khusus member duluan.</p>
    </td></tr>
    <tr><td style="padding:22px 34px 0;text-align:center">
      <div style="border:1px dashed ${C.beige};border-radius:10px;padding:16px">
        <div style="font-size:12px;color:${C.taupe};text-transform:uppercase;letter-spacing:2px">Kode buat order pertamamu</div>
        <div style="font-size:22px;color:${C.umber};font-weight:bold;letter-spacing:2px;margin-top:6px">${esc(promo)}</div>
      </div>
    </td></tr>
    <tr><td style="padding:24px 34px 30px;text-align:center">
      <a href="${esc(url + "/#collection")}" style="display:inline-block;background:${C.umber};color:${C.paper};text-decoration:none;font-size:14px;letter-spacing:2px;padding:13px 30px;border-radius:999px">LIHAT COLLECTION</a>
    </td></tr>
  </table>
  <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%"><tr><td style="padding:18px 30px;text-align:center">
    <p style="font-size:11px;line-height:1.6;color:${C.taupe};margin:0">DOMANIC, extrait de parfum, dibikin pelan di Indonesia.</p>
  </td></tr></table>
</td></tr></table></body></html>`;
  return { subject, html };
}

// Email pembayaran diterima (dikirim dari webhook Komerce pas order jadi paid).
export function paymentReceivedEmail(o) {
  const url = siteUrl();
  const rows = (o.items || []).map((it) => `
    <tr>
      <td style="padding:8px 0;font-size:14px;color:${C.charcoal}">${esc(it.name)} <span style="color:${C.taupe}">× ${it.qty}</span></td>
      <td style="padding:8px 0;font-size:14px;color:${C.charcoal};text-align:right">${rp(it.lineTotal)}</td>
    </tr>`).join("");
  const line = (label, val, strong) => `
    <tr>
      <td style="padding:4px 0;font-size:${strong ? "15px" : "13px"};color:${strong ? C.umber : C.taupe};${strong ? "font-weight:bold" : ""}">${esc(label)}</td>
      <td style="padding:4px 0;font-size:${strong ? "15px" : "13px"};color:${strong ? C.umber : C.charcoal};text-align:right;${strong ? "font-weight:bold" : ""}">${esc(val)}</td>
    </tr>`;
  const subject = `Pembayaran diterima, ${o.orderNumber}`;
  const html = `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:${C.paper};font-family:Arial,Helvetica,sans-serif;color:${C.charcoal}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper}"><tr><td align="center" style="padding:28px 16px">
  <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fff;border:1px solid ${C.cream};border-radius:14px">
    <tr><td style="padding:26px 34px 4px;text-align:center"><div style="font-size:18px;letter-spacing:6px;color:${C.umber};font-weight:bold">DOMANIC</div></td></tr>
    <tr><td style="padding:14px 34px 0;text-align:center">
      <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${C.gold}">Pembayaran diterima</div>
      <div style="font-size:22px;color:${C.umber};margin-top:6px">${esc(o.orderNumber)}</div>
      <p style="font-size:14px;line-height:1.7;color:${C.charcoal};margin:12px 0 0">Makasih${o.name ? ` ${esc(o.name)}` : ""}, pembayaranmu udah kami terima. Pesananmu lagi kami siapin, nanti kami kabarin pas dikirim beserta nomor resinya.</p>
    </td></tr>
    <tr><td style="padding:20px 34px 0">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${C.cream};border-bottom:1px solid ${C.cream}">${rows}</table>
    </td></tr>
    <tr><td style="padding:14px 34px 4px">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${line("Subtotal", rp(o.subtotal))}
        ${o.discount > 0 ? line(`Diskon${o.promoCode ? ` (${o.promoCode})` : ""}`, "-" + rp(o.discount)) : ""}
        ${line("Ongkir", o.shipping === 0 ? "Gratis" : rp(o.shipping))}
        ${line("Total dibayar", rp(o.total), true)}
      </table>
    </td></tr>
    <tr><td style="padding:22px 34px 30px;text-align:center">
      <a href="${esc(url + "/#collection")}" style="display:inline-block;border:1px solid ${C.umber};color:${C.umber};text-decoration:none;font-size:13px;letter-spacing:2px;padding:11px 26px;border-radius:999px">LIHAT COLLECTION</a>
    </td></tr>
  </table>
  <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%"><tr><td style="padding:18px 30px;text-align:center">
    <p style="font-size:11px;line-height:1.6;color:${C.taupe};margin:0">DOMANIC, extrait de parfum, dibikin pelan di Indonesia.</p>
  </td></tr></table>
</td></tr></table></body></html>`;
  return { subject, html };
}
