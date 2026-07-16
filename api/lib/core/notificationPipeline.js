import nodemailer from 'nodemailer';
import { logger } from './logger.js';

/**
 * Notification Pipeline — multi-channel dispatch.
 * Each channel is independent — failure in one does not block others.
 */

// ── Email ─────────────────────────────────────────────────────────────────────

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT ?? '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: 10000,
  });
}

export async function sendLeadEmail({ session, summary, score, priority, transcript }) {
  if (process.env.VITE_FF_EMAIL === 'false') return;

  const lead = session.leadProfile ?? {};
  const emoji = priority === 'hot' ? '🔥' : priority === 'warm' ? '🟡' : '🔵';
  const priorityLabel = priority.toUpperCase();

  const transporter = createTransporter();

  const html = `
    <div style="font-family:'Inter',Arial,sans-serif;max-width:640px;margin:0 auto;background:#111;color:#fff;border-radius:12px;overflow:hidden;border:1px solid #333">
      <div style="background:#000;padding:24px;border-bottom:1px solid #222;display:flex;align-items:center;gap:12px">
        <h1 style="margin:0;font-size:18px;font-weight:800;letter-spacing:2px">EDIT AURA</h1>
        <span style="background:#fff;color:#000;padding:2px 10px;font-size:10px;font-weight:700;letter-spacing:1px;border-radius:4px">${emoji} ${priorityLabel} LEAD</span>
      </div>
      <div style="padding:28px 24px">
        <h2 style="margin:0 0 20px;font-size:20px">AI Voice Lead — Score ${score}/100</h2>
        <table style="width:100%;border-collapse:collapse">
          ${tableRow('Name', lead.name)}
          ${tableRow('Email', lead.email)}
          ${tableRow('Phone', lead.phone)}
          ${tableRow('Company', lead.company)}
          ${tableRow('Budget', lead.budget)}
          ${tableRow('Timeline', lead.timeline)}
          ${tableRow('Services', Array.isArray(lead.services) ? lead.services.join(', ') : lead.services)}
        </table>

        ${summary ? `
        <div style="margin-top:24px;background:#1a1a1a;border:1px solid #333;border-radius:8px;padding:20px">
          <h3 style="margin:0 0 12px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#888">AI Summary</h3>
          <p style="margin:0 0 8px;font-size:14px;line-height:1.6"><strong>Requirements:</strong> ${summary.requirements ?? 'N/A'}</p>
          <p style="margin:0 0 8px;font-size:14px;line-height:1.6"><strong>Pain Points:</strong> ${summary.painPoints ?? 'N/A'}</p>
          <p style="margin:0 0 8px;font-size:14px;line-height:1.6"><strong>Recommended:</strong> ${(summary.recommendedServices ?? []).join(', ')}</p>
          <p style="margin:0 0 8px;font-size:14px;line-height:1.6"><strong>Likelihood:</strong> ${summary.likelihood ?? 0}%</p>
          ${summary.followUpActions?.length ? `<p style="margin:0;font-size:14px"><strong>Follow-up:</strong> ${summary.followUpActions.join(' | ')}</p>` : ''}
        </div>` : ''}

        ${transcript ? `
        <div style="margin-top:20px">
          <h3 style="margin:0 0 12px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#888">Full Transcript</h3>
          <div style="background:#0d0d0d;border:1px solid #222;border-radius:8px;padding:16px;font-size:13px;line-height:1.8;white-space:pre-wrap;max-height:400px;overflow-y:auto">${transcript}</div>
        </div>` : ''}
      </div>
      <div style="background:#000;padding:14px 24px;border-top:1px solid #222;font-size:10px;color:#555;font-family:monospace">
        SESSION: ${session.id} | ${new Date().toISOString()} | Score: ${score}/100 | Cost: $${session.costs?.total?.toFixed(4) ?? '0.00'}
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Edit Aura AI" <${process.env.SMTP_USER}>`,
    replyTo: lead.email ?? process.env.SMTP_USER,
    to: process.env.SMTP_USER,
    subject: `${emoji} New AI Lead: ${lead.name ?? 'Unknown'} | Score ${score}/100 | ${(lead.services ?? []).join(', ') || 'General'}`,
    html,
  });

  logger.info('lead_email_sent', { sessionId: session.id, score, priority });
}

function tableRow(label, value) {
  if (!value) return '';
  return `<tr><td style="padding:10px 0;border-bottom:1px solid #222;color:#888;font-size:11px;text-transform:uppercase;font-weight:bold;width:100px">${label}</td><td style="padding:10px 0;border-bottom:1px solid #222;font-size:14px">${value}</td></tr>`;
}

// ── Slack ─────────────────────────────────────────────────────────────────────

export async function sendSlackNotification({ session, score, priority }) {
  if (!process.env.SLACK_WEBHOOK_URL || process.env.VITE_FF_SLACK !== 'true') return;
  const lead = session.leadProfile ?? {};
  const emoji = priority === 'hot' ? ':fire:' : priority === 'warm' ? ':large_yellow_circle:' : ':large_blue_circle:';

  await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `${emoji} *New AI Lead* — Score ${score}/100`,
      blocks: [
        { type: 'header', text: { type: 'plain_text', text: `${emoji} New Lead: ${lead.name ?? 'Unknown'} — ${priority.toUpperCase()}` } },
        { type: 'section', fields: [
          { type: 'mrkdwn', text: `*Company:* ${lead.company ?? 'N/A'}` },
          { type: 'mrkdwn', text: `*Email:* ${lead.email ?? 'N/A'}` },
          { type: 'mrkdwn', text: `*Budget:* ${lead.budget ?? 'N/A'}` },
          { type: 'mrkdwn', text: `*Services:* ${(lead.services ?? []).join(', ') || 'N/A'}` },
          { type: 'mrkdwn', text: `*Score:* ${score}/100` },
          { type: 'mrkdwn', text: `*Session Cost:* $${session.costs?.total?.toFixed(4) ?? '0.00'}` },
        ]},
      ],
    }),
  });
}

// ── Generic Webhook ───────────────────────────────────────────────────────────

export async function sendWebhook({ session, summary, score }) {
  if (!process.env.WEBHOOK_URL) return;
  await fetch(process.env.WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event: 'voice_lead_captured',
      sessionId: session.id,
      lead: session.leadProfile,
      summary,
      score,
      costs: session.costs,
      timestamp: new Date().toISOString(),
    }),
  });
}

// ── Dispatch all channels ─────────────────────────────────────────────────────

export async function dispatchNotifications(payload) {
  const results = await Promise.allSettled([
    sendLeadEmail(payload),
    sendSlackNotification(payload),
    sendWebhook(payload),
  ]);
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      logger.error('notification_failed', { channel: i, error: r.reason?.message });
    }
  });
}
