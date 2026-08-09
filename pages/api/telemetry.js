import { reportServerIssue } from '../../lib/server-monitoring';

const ALLOWED_EVENTS = new Set(['client_error']);
const clean = (value, max = 180) => String(value ?? '').replace(/[\r\n\t]/g, ' ').trim().slice(0, max);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rawLength = Number(req.headers['content-length'] || 0);
  if (rawLength > 4096) return res.status(413).json({ error: 'Payload too large' });

  const body = typeof req.body === 'string' ? (() => { try { return JSON.parse(req.body); } catch { return {}; } })() : (req.body || {});
  const event = clean(body.event, 48);
  if (!ALLOWED_EVENTS.has(event)) return res.status(400).json({ error: 'Unsupported telemetry event' });

  await reportServerIssue(event, {
    context: clean(body.context, 48),
    message: clean(body.message, 180),
    path: clean(String(body.path || '').split('?')[0], 120),
  });

  res.setHeader('Cache-Control', 'no-store');
  return res.status(204).end();
}
