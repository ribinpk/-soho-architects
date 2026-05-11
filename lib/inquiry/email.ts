import type { InquiryInput } from "./schema";

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value: string | undefined): string {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #e0d9cc;color:#6b6863;font:12px/1.4 system-ui,sans-serif;letter-spacing:0.12em;text-transform:uppercase;width:140px;vertical-align:top;">${escape(label)}</td>
      <td style="padding:10px 0;border-bottom:1px solid #e0d9cc;color:#1a1a1a;font:14px/1.55 system-ui,sans-serif;vertical-align:top;white-space:pre-line;">${escape(value)}</td>
    </tr>
  `;
}

export function renderInquiryHtml(data: InquiryInput): string {
  return `
<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f5f1ea;font-family:system-ui,sans-serif;color:#1a1a1a;">
    <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
      <p style="margin:0;font:12px/1 system-ui,sans-serif;letter-spacing:0.18em;text-transform:uppercase;color:#6b6863;">SOHO Architects · Inquiry</p>
      <h1 style="margin:14px 0 28px;font:24px/1.2 Georgia,serif;letter-spacing:-0.01em;">New inquiry from ${escape(data.name)}</h1>
      <table style="width:100%;border-collapse:collapse;">
        ${row("Name", data.name)}
        ${row("Email", data.email)}
        ${row("Phone", data.phone || undefined)}
        ${row("Project type", data.projectType)}
        ${row("Location", data.location || undefined)}
        ${row("Budget", data.budgetRange || undefined)}
        ${row("Message", data.message)}
      </table>
      <p style="margin:28px 0 0;font:12px/1.55 system-ui,sans-serif;color:#8c8881;">Reply to this email to respond to ${escape(data.name)}.</p>
    </div>
  </body>
</html>`;
}

export function renderInquiryText(data: InquiryInput): string {
  const lines = [
    `New inquiry — SOHO Architects`,
    ``,
    `From:     ${data.name}`,
    `Email:    ${data.email}`,
  ];
  if (data.phone) lines.push(`Phone:    ${data.phone}`);
  if (data.projectType) lines.push(`Type:     ${data.projectType}`);
  if (data.location) lines.push(`Location: ${data.location}`);
  if (data.budgetRange) lines.push(`Budget:   ${data.budgetRange}`);
  lines.push(``, `Message:`, data.message);
  return lines.join("\n");
}
