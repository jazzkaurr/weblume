import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, 'inquiries.json');

export interface InquiryRecord {
  id: string;
  fullName: string;
  email: string;
  companyName?: string;
  websiteType: string;
  estimatedBudget: string;
  description: string;
  createdAt: string;
  forwardedToWebhook: boolean;
}

// Simple in-memory IP rate limiter for inquiry endpoint (max 10 requests per 15 mins)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 10;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  entry.count += 1;
  return true;
}

function sanitizeInput(value: unknown, maxLen = 1000): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[<>]/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLen);
}

function isSafeWebhookUrl(rawUrl: string): boolean {
  if (!rawUrl) return false;
  try {
    const parsed = new URL(rawUrl);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function loadInquiries(): InquiryRecord[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (err) {
    console.error('Failed to read inquiries file:', err);
  }
  return [];
}

function saveInquiries(list: InquiryRecord[]) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(list.slice(0, 200), null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write inquiries file:', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  // Enforce HTTPS & Security headers middleware
  app.use((req, res, next) => {
    const forwardedProto = req.headers['x-forwarded-proto'];
    if (
      process.env.NODE_ENV === 'production' &&
      forwardedProto &&
      forwardedProto !== 'https'
    ) {
      res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
      return;
    }

    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), payment=()'
    );
    next();
  });

  app.use(express.json({ limit: '512kb' }));

  // Health & Config Check
  app.get('/api/config-status', (_req, res) => {
    const webhookConfigured = Boolean(process.env.CONTACT_WEBHOOK_URL?.trim());
    res.json({
      status: 'ok',
      webhookConfigured,
      recipientEmail: 'weblumeservice@gmail.com',
    });
  });

  // Fetch recorded inquiries for Studio owner review
  app.get('/api/inquiries', (_req, res) => {
    const inquiries = loadInquiries();
    res.json({ inquiries });
  });

  // Submit new inquiry from the Contact Form
  app.post('/api/inquiries', async (req, res) => {
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      'unknown';

    if (!checkRateLimit(clientIp)) {
      res.status(429).json({
        error: 'Too many inquiries submitted recently. Please wait a few minutes or contact us directly via Email/WhatsApp.',
      });
      return;
    }

    const body = req.body || {};

    // Honeypot anti-spam check
    if (body.websiteUrlHoneypot && String(body.websiteUrlHoneypot).trim() !== '') {
      res.status(200).json({
        success: true,
        inquiry: { id: 'INQ-FILTERED' },
        forwardedToWebhook: false,
        message: 'Inquiry received.',
      });
      return;
    }

    const fullName = sanitizeInput(body.fullName, 120);
    const email = sanitizeInput(body.email, 160);
    const companyName = sanitizeInput(body.companyName, 140);
    const websiteType = sanitizeInput(body.websiteType, 120);
    const estimatedBudget = sanitizeInput(body.estimatedBudget, 140);
    const description = sanitizeInput(body.description, 2500);
    const customWebhookUrl = sanitizeInput(body.customWebhookUrl, 300);

    if (fullName.length < 2) {
      res.status(400).json({ error: 'Please enter your full name (at least 2 characters).' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }

    if (!websiteType) {
      res.status(400).json({ error: 'Please select the type of website required.' });
      return;
    }

    if (!estimatedBudget) {
      res.status(400).json({ error: 'Please select an estimated budget range.' });
      return;
    }

    if (description.length < 15) {
      res.status(400).json({
        error: 'Please provide a brief project description (at least 15 characters) so we can prepare an accurate quote.',
      });
      return;
    }

    const targetWebhook = (customWebhookUrl || process.env.CONTACT_WEBHOOK_URL || '').trim();
    let forwardedToWebhook = false;

    if (isSafeWebhookUrl(targetWebhook)) {
      try {
        const webhookRes = await fetch(targetWebhook, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            subject: `New Weblume.com Project Inquiry from ${fullName}`,
            fullName,
            email,
            companyName,
            websiteType,
            estimatedBudget,
            description,
            submittedAt: new Date().toISOString(),
          }),
        });
        forwardedToWebhook = webhookRes.ok;
      } catch (err) {
        console.warn('Optional webhook forwarding error:', err);
      }
    }

    const newInquiry: InquiryRecord = {
      id: `WBL-${Date.now().toString(36).toUpperCase()}`,
      fullName,
      email,
      companyName,
      websiteType,
      estimatedBudget,
      description,
      createdAt: new Date().toISOString(),
      forwardedToWebhook,
    };

    const existing = loadInquiries();
    const updated = [newInquiry, ...existing];
    saveInquiries(updated);

    res.status(201).json({
      success: true,
      inquiry: newInquiry,
      forwardedToWebhook,
      message: forwardedToWebhook
        ? 'Your inquiry has been securely logged and forwarded directly to Weblume.com.'
        : 'Your project brief has been securely recorded on the Weblume.com server. Use the instant Email or WhatsApp dispatch below for priority notification.',
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Weblume.com server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
