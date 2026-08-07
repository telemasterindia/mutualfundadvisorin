type NotificationField = [label: string, value: unknown];

const DEFAULT_RECIPIENT = "telemasterindia@gmail.com";

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export async function sendLeadNotification(
  subject: string,
  fields: NotificationField[],
  replyTo?: string,
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("Lead email was not sent because RESEND_API_KEY is not configured.");
    return false;
  }

  const rows = fields
    .filter(([, value]) => value !== null && value !== undefined && value !== "")
    .map(
      ([label, value]) =>
        `<tr><th style="padding:8px 12px;text-align:left;vertical-align:top">${escapeHtml(label)}</th>` +
        `<td style="padding:8px 12px;white-space:pre-wrap">${escapeHtml(String(value))}</td></tr>`,
    )
    .join("");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.LEAD_FROM_EMAIL ?? "Website Leads <leads@mutualfundadvisor.in>",
        to: [process.env.LEAD_NOTIFICATION_EMAIL ?? DEFAULT_RECIPIENT],
        reply_to: replyTo,
        subject,
        html: `<h2>${escapeHtml(subject)}</h2><table style="border-collapse:collapse">${rows}</table>`,
      }),
    });

    if (!response.ok) {
      console.error("Lead email failed:", response.status, await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Lead email failed:", error);
    return false;
  }
}
