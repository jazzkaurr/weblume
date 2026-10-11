# Weblume.com — Website Developer & Digital Design Studio

**Tagline:** *“We Build Digital Experiences That Grow Businesses.”*  
**Studio Brand:** `Weblume.com`  
**Primary Email:** `weblumeservice@gmail.com`  
**Business WhatsApp:** `+91 8391026730` · `+91 8368208941`

---

## 1. Overview

Weblume is a responsive, modern web developer and digital designer portfolio engineered with **React 19**, **TypeScript**, **Tailwind CSS 4**, and an **Express** backend. It is built to attract business and freelance clients across **India, Dubai, the USA, the UK, and Australia**.

### Key Highlights
- **Brand Identity:** Obsidian black (`#070709`), crisp white (`#FAFAFC`), soft lavender, and electric purple (`#7C3AED`) accents with `Plus Jakarta Sans` and `JetBrains Mono` typography.
- **Dark & Light Mode:** Instant theme switching persisted in `localStorage`.
- **Interactive Hero Visual:** Switch between a live website mockup (`NCR Properties`), semantic HTML/CSS code preview, and responsive viewport breakdown.
- **Featured Projects Portfolio with Live Sandboxes:**
  1. **NCR Properties** — Live Real Estate Website (`https://ncr-properties-farmhouses-in-faridabad-gurgaon-pa.ai.studio/`)
  2. **Used Vehicle Marketplace** — Automotive Business Website (editable live URL when published)
  3. **Café Website Concept** — Restaurant & Café Web Design Concept
  4. **Task Manager** — Includes an embedded, working JavaScript + `LocalStorage` Task Manager inside the Project Details modal.
  5. **Online Calculator** — Includes an embedded, working arithmetic calculator inside the Project Details modal.
- **Easy Project & Contact Management:** Use the **Add / Manage Projects** and **Contact Info & Inbox** buttons in the top studio bar to add new projects, upload real project screenshots, update live URLs, or edit LinkedIn/GitHub links without touching code.
- **Working Contact Form & Inquiry Backend:** Validates all fields, logs inquiries to the backend (`/api/inquiries`), optionally forwards to Formspree/Webhooks (`CONTACT_WEBHOOK_URL`), and provides one-click WhatsApp (`+91 8391026730`) and Email (`weblumeservice@gmail.com`) dispatch.

---

## 2. Local Setup & Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server (runs on port 3000):**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

---

## 3. Customizing Projects, Screenshots & Contact Details

### Option A: Directly in the Browser UI
- Click **Add / Manage Projects** in the top bar (or **Edit** on any project card) to upload a screenshot from your computer, paste a new Live URL, or add a new project.
- Click **Contact Info & Inbox** to update your email, WhatsApp numbers, LinkedIn URL, GitHub URL, or inspect submitted client inquiries.

### Option B: In Source Code (`src/data/portfolioData.ts`)
- Edit `DEFAULT_PROFILE_CONFIG` in `src/data/portfolioData.ts` to permanently change default contact details and social profile URLs.
- Edit `INITIAL_PROJECTS` in `src/data/portfolioData.ts` to add or update default portfolio projects.

---

## 4. Connecting Automatic Email Forwarding (Formspree / Web3Forms)

By default, every inquiry submitted through the Contact Form is:
1. Validated and saved on the server (`inquiries.json` via `POST /api/inquiries`), viewable anytime inside **Contact Info & Inbox → Submitted Inquiries**.
2. Paired with instant one-click **Send via WhatsApp** and **Open in Email Client** buttons.

To also receive automatic background email notifications in `weblumeservice@gmail.com`:
1. Create a free form endpoint at [Formspree.io](https://formspree.io/) connected to `weblumeservice@gmail.com`.
2. Either set `CONTACT_WEBHOOK_URL="https://formspree.io/f/your-id"` in `.env`, **or** paste the Formspree URL into **Contact Info & Inbox → Optional Formspree / Email Webhook URL** in the website UI.

---

## 5. Deployment (Vercel / Netlify / Cloud Run)

- **Cloud Run / Node Hosting:** Run `npm run build` followed by `npm start` (`tsx server.ts`).
- **Static Hosting (Vercel / Netlify):** The frontend builds cleanly into `/dist` via `npm run build`. Connect a Formspree endpoint in `DEFAULT_PROFILE_CONFIG.customWebhookUrl` for serverless form handling.
