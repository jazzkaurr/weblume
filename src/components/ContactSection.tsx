import React, { useState, useEffect } from 'react';
import {
  Mail,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  SlidersHorizontal,
  MapPin,
  Copy,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { ProfileConfig } from '../data/portfolioData';
import { isSafeHttpUrl, sanitizePlainText } from '../utils/seoConfig';

interface ContactSectionProps {
  profile: ProfileConfig;
  preselectedService: string;
  onOpenSettings: () => void;
}

const WEBSITE_TYPES = [
  'Business Website Development',
  'Landing Page Design',
  'Portfolio Website',
  'Restaurant & Café Website',
  'Real Estate Website',
  'Website Redesign',
  'Graphic & Poster Design',
  'Custom Web Application',
];

const BUDGET_RANGES = [
  '₹10,000 – ₹25,000 / $200 – $400 (Starter / Landing Page)',
  '₹25,000 – ₹50,000 / $400 – $800 (Multi-Section Business Site)',
  '₹50,000 – ₹1,00,000 / $800 – $1,500 (Custom Portal / Real Estate)',
  'Custom Scope / Let’s Discuss Requirements',
];

export const ContactSection: React.FC<ContactSectionProps> = ({
  profile,
  preselectedService,
  onOpenSettings,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [websiteType, setWebsiteType] = useState(WEBSITE_TYPES[0]);
  const [estimatedBudget, setEstimatedBudget] = useState(BUDGET_RANGES[0]);
  const [description, setDescription] = useState('');
  const [websiteUrlHoneypot, setWebsiteUrlHoneypot] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedRecord, setSubmittedRecord] = useState<{
    id: string;
    fullName: string;
    email: string;
    companyName?: string;
    websiteType: string;
    estimatedBudget: string;
    description: string;
    forwardedToWebhook: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (preselectedService) {
      const matched = WEBSITE_TYPES.find((t) =>
        t.toLowerCase().includes(preselectedService.toLowerCase().slice(0, 10))
      );
      if (matched) {
        setWebsiteType(matched);
      } else {
        setDescription((prev) =>
          prev
            ? prev
            : `Hello Weblume.com, I am interested in inquiring about ${sanitizePlainText(preselectedService, 100)}.`
        );
      }
    }
  }, [preselectedService]);

  const cleanPhone = (raw: string) => {
    const digits = raw.replace(/\D/g, '');
    if (digits.length === 10) return `91${digits}`;
    return digits;
  };

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(profile.email).catch(() => {});
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const safeName = sanitizePlainText(fullName, 120).trim();
    const safeEmail = sanitizePlainText(email, 160).trim();
    const safeCompany = sanitizePlainText(companyName, 140).trim();
    const safeDesc = sanitizePlainText(description, 2500).trim();

    if (safeName.length < 2) {
      setErrorMsg('Please enter your full name (at least 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(safeEmail)) {
      setErrorMsg('Please enter a valid email address so we can reply to your inquiry.');
      return;
    }

    if (safeDesc.length < 15) {
      setErrorMsg(
        'Please share a brief description of your project (at least 15 characters).'
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: safeName,
          email: safeEmail,
          companyName: safeCompany,
          websiteType,
          estimatedBudget,
          description: safeDesc,
          customWebhookUrl: profile.customWebhookUrl,
          websiteUrlHoneypot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Could not submit inquiry. Please check your entries.');
      } else {
        setSubmittedRecord({
          id: data.inquiry.id,
          fullName: safeName,
          email: safeEmail,
          companyName: safeCompany,
          websiteType,
          estimatedBudget,
          description: safeDesc,
          forwardedToWebhook: Boolean(data.forwardedToWebhook),
          message: data.message,
        });
        setFullName('');
        setEmail('');
        setCompanyName('');
        setDescription('');
      }
    } catch {
      setErrorMsg(
        'Network error while recording inquiry. You can also reach out directly via Email or WhatsApp below.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const buildMailtoHref = () => {
    const subj = encodeURIComponent(
      submittedRecord
        ? `Weblume.com Project Inquiry (${submittedRecord.id}) — ${submittedRecord.websiteType}`
        : `Project Inquiry for Weblume.com (${websiteType})`
    );
    const bodyText = submittedRecord
      ? `Hello Weblume.com,\n\nI submitted a project brief on Weblume.com (${submittedRecord.id}):\n\nName: ${submittedRecord.fullName}\nEmail: ${submittedRecord.email}\nCompany: ${submittedRecord.companyName || 'N/A'}\nWebsite Type: ${submittedRecord.websiteType}\nEstimated Budget: ${submittedRecord.estimatedBudget}\n\nProject Details:\n${submittedRecord.description}\n\nBest regards,\n${submittedRecord.fullName}`
      : `Hello Weblume.com,\n\nI would like to discuss a website project with Weblume.com.\n\nWebsite Type: ${websiteType}\nEstimated Budget: ${estimatedBudget}\n\nProject Details:\n${description || '[Describe your project goals]'}`;
    return `mailto:${profile.email}?subject=${subj}&body=${encodeURIComponent(bodyText)}`;
  };

  const buildWhatsAppHref = (phoneNum: string) => {
    const formattedPhone = cleanPhone(phoneNum);
    const msg = submittedRecord
      ? `Hello Weblume.com, I just submitted inquiry ${submittedRecord.id}.\n• Name: ${submittedRecord.fullName}\n• Project: ${submittedRecord.websiteType}\n• Budget: ${submittedRecord.estimatedBudget}\n• Details: ${submittedRecord.description}`
      : `Hello Weblume.com, I would like to discuss a ${websiteType} project.`;
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <section id="contact" className="py-12 sm:py-16 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Direct Emails, WhatsApp & Global Studio Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="text-xs font-semibold text-[#5B21B6] dark:text-[#DDD6FE] tracking-wide">
                Page 05 · Direct Emails &amp; Project Inquiry
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#14121A] dark:text-[#F7F5FA] headline-balance">
                Have a Project in Mind? Let’s Build Something{' '}
                <span className="font-serif-editorial italic font-semibold text-[#5B21B6] dark:text-[#DDD6FE]">
                  Extraordinary.
                </span>
              </h2>
              <p className="text-sm sm:text-base text-[#534E5E] dark:text-[#B8B2C8] leading-relaxed">
                Reach out to <strong className="text-[#14121A] dark:text-[#F7F5FA] font-semibold">Weblume.com</strong> directly via email, WhatsApp, or the encrypted project inquiry brief.
              </p>
            </div>

            {/* Highlighted Direct Email Box with One-Click Copy */}
            <div className="rounded-2xl border border-[#5B21B6]/30 dark:border-[#C4B5FD]/30 bg-[#EDE9FE]/50 dark:bg-[#7C3AED]/10 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#5B21B6] dark:text-[#DDD6FE]">
                  Official Studio Email
                </span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-[#100E18] border border-[#E4DFD7] dark:border-[#242033] text-[#14121A] dark:text-[#F7F5FA] hover:border-[#6D28D9] transition-colors cursor-pointer"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#6D28D9] dark:text-[#DDD6FE]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>
              </div>
              <a
                href={`mailto:${profile.email}`}
                className="block text-lg sm:text-xl font-bold text-[#14121A] dark:text-[#F7F5FA] hover:text-[#5B21B6] dark:hover:text-[#DDD6FE] transition-colors break-all"
              >
                {profile.email}
              </a>
            </div>

            {/* Structured Contact & WhatsApp Card */}
            <div className="rounded-2xl border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#100E18] p-6 space-y-5 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[#E4DFD7] dark:border-[#242033]">
                <div>
                  <div className="text-base font-bold text-[#14121A] dark:text-[#F7F5FA]">
                    Weblume.com
                  </div>
                  <div className="text-xs text-[#7C7589] dark:text-[#B8B2C8] mt-0.5">
                    {profile.profession}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#E4DFD7] dark:border-[#242033] text-[#14121A] dark:text-[#F7F5FA] hover:border-[#6D28D9] transition-colors cursor-pointer"
                  title="Edit Contact Details & View Inquiries"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Inbox &amp; Settings</span>
                </button>
              </div>

              <dl className="space-y-3.5 text-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <dt className="text-xs text-[#7C7589] dark:text-[#B8B2C8]">
                    WhatsApp (Line 1)
                  </dt>
                  <dd className="font-mono-tabular font-semibold text-[#14121A] dark:text-[#F7F5FA]">
                    <a
                      href={buildWhatsAppHref(profile.whatsappPrimary)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#5B21B6] dark:hover:text-[#DDD6FE] transition-colors"
                    >
                      +91 {profile.whatsappPrimary}
                    </a>
                  </dd>
                </div>

                {profile.whatsappSecondary && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <dt className="text-xs text-[#7C7589] dark:text-[#B8B2C8]">
                      WhatsApp (Line 2)
                    </dt>
                    <dd className="font-mono-tabular font-semibold text-[#14121A] dark:text-[#F7F5FA]">
                      <a
                        href={buildWhatsAppHref(profile.whatsappSecondary)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#5B21B6] dark:hover:text-[#DDD6FE] transition-colors"
                      >
                        +91 {profile.whatsappSecondary}
                      </a>
                    </dd>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <dt className="text-xs text-[#7C7589] dark:text-[#B8B2C8]">
                    Social Profiles
                  </dt>
                  <dd className="flex items-center gap-3 text-xs font-medium">
                    {isSafeHttpUrl(profile.linkedinUrl) && (
                      <a
                        href={profile.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#14121A] dark:text-[#F7F5FA] hover:text-[#5B21B6] dark:hover:text-[#DDD6FE]"
                      >
                        <span>LinkedIn</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <span className="text-[#7C7589]">·</span>
                    {isSafeHttpUrl(profile.githubUrl) && (
                      <a
                        href={profile.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#14121A] dark:text-[#F7F5FA] hover:text-[#5B21B6] dark:hover:text-[#DDD6FE]"
                      >
                        <span>GitHub</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </dd>
                </div>

                <div className="pt-3 border-t border-[#E4DFD7] dark:border-[#242033] flex items-start gap-2 text-xs text-[#534E5E] dark:text-[#B8B2C8]">
                  <MapPin className="w-4 h-4 text-[#5B21B6] dark:text-[#DDD6FE] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-[#14121A] dark:text-[#F7F5FA]">
                      {profile.location}
                    </span>
                    <p className="mt-0.5 text-[#7C7589]">
                      Serving clients in {profile.targetMarkets.join(' · ')}
                    </p>
                  </div>
                </div>
              </dl>

              {/* Direct Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href={buildMailtoHref()}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg bg-[#5B21B6] dark:bg-[#6D28D9] text-white hover:bg-[#4C1D95] dark:hover:bg-[#7C3AED] transition-colors whitespace-nowrap shrink-0"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email Weblume.com</span>
                </a>
                <a
                  href={buildWhatsAppHref(profile.whatsappPrimary)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg border border-[#E4DFD7] dark:border-[#242033] text-[#14121A] dark:text-[#F7F5FA] hover:border-[#6D28D9] transition-colors whitespace-nowrap shrink-0"
                >
                  <MessageSquare className="w-4 h-4 text-[#5B21B6] dark:text-[#DDD6FE]" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Project Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#100E18] p-6 sm:p-8 shadow-xl dark:shadow-black/40">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-5 mb-6 border-b border-[#E4DFD7] dark:border-[#242033]">
                <div>
                  <h3 className="text-xl font-bold text-[#14121A] dark:text-[#F7F5FA]">
                    Interactive Project Inquiry
                  </h3>
                  <p className="text-xs text-[#534E5E] dark:text-[#B8B2C8] mt-1">
                    Select your website type, estimated budget, and share your project brief for <strong className="text-[#14121A] dark:text-[#F7F5FA]">Weblume.com</strong>.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 text-[11px] text-[#5B21B6] dark:text-[#DDD6FE] font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Input Sanitized &amp; Protected</span>
                </div>
              </div>

              {submittedRecord ? (
                <div className="rounded-xl border border-[#6D28D9]/40 bg-[#EDE9FE]/40 dark:bg-[#7C3AED]/10 p-6 space-y-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#5B21B6] dark:text-[#DDD6FE] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="text-xs font-mono-tabular text-[#5B21B6] dark:text-[#DDD6FE]">
                        Reference ID: {submittedRecord.id}
                      </div>
                      <h4 className="text-lg font-bold text-[#14121A] dark:text-[#F7F5FA]">
                        Project Inquiry Logged on Weblume.com
                      </h4>
                      <p className="text-sm text-[#534E5E] dark:text-[#B8B2C8] leading-relaxed">
                        {submittedRecord.message}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-[#FAF8F5] dark:bg-[#0B0912] border border-[#E4DFD7] dark:border-[#242033] text-xs space-y-1.5 text-[#534E5E] dark:text-[#B8B2C8]">
                    <div>
                      <span className="text-[#7C7589]">Client:</span> {submittedRecord.fullName} ({submittedRecord.email})
                    </div>
                    <div>
                      <span className="text-[#7C7589]">Service:</span> {submittedRecord.websiteType} · {submittedRecord.estimatedBudget}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-[#14121A] dark:text-[#F7F5FA]">
                      Send an instant copy directly to Weblume.com right now:
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <a
                        href={buildWhatsAppHref(profile.whatsappPrimary)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#5B21B6] dark:bg-[#6D28D9] hover:bg-[#4C1D95] dark:hover:bg-[#7C3AED] rounded-lg transition-colors whitespace-nowrap shrink-0"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Send via WhatsApp (+91 {profile.whatsappPrimary})</span>
                      </a>
                      <a
                        href={buildMailtoHref()}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#14121A] dark:text-[#F7F5FA] border border-[#E4DFD7] dark:border-[#242033] hover:border-[#6D28D9] rounded-lg transition-colors whitespace-nowrap shrink-0"
                      >
                        <Mail className="w-4 h-4" />
                        <span>Email ({profile.email})</span>
                      </a>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setSubmittedRecord(null)}
                      className="text-xs text-[#534E5E] dark:text-[#B8B2C8] hover:text-[#14121A] dark:hover:text-white underline cursor-pointer"
                    >
                      Submit another project inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {/* Hidden Honeypot Input for Anti-Bot Security */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="website-url-hp">Website URL</label>
                    <input
                      id="website-url-hp"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={websiteUrlHoneypot}
                      onChange={(e) => setWebsiteUrlHoneypot(e.target.value)}
                    />
                  </div>

                  {errorMsg && (
                    <div
                      role="alert"
                      className="flex items-start gap-2.5 p-3.5 rounded-lg border border-rose-500/40 bg-rose-500/10 text-xs text-rose-700 dark:text-rose-300"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Quick Interactive Service Selector */}
                  <div>
                    <label className="block text-xs font-medium text-[#14121A] dark:text-[#F7F5FA] mb-2">
                      1. Select Type of Website Required *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {WEBSITE_TYPES.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setWebsiteType(type)}
                          className={`px-3 py-2 text-xs font-medium rounded-lg border text-left truncate transition-colors cursor-pointer ${
                            websiteType === type
                              ? 'border-[#5B21B6] dark:border-[#8B5CF6] bg-[#5B21B6] dark:bg-[#6D28D9] text-white shadow-xs'
                              : 'border-[#E4DFD7] dark:border-[#242033] bg-[#FAF8F5] dark:bg-[#0B0912] text-[#534E5E] dark:text-[#B8B2C8] hover:border-[#6D28D9]/50'
                          }`}
                          title={type}
                        >
                          {type.replace(' Development', '').replace(' Design', '')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="inq-name"
                        className="block text-xs font-medium text-[#14121A] dark:text-[#F7F5FA] mb-1.5"
                      >
                        Full Name *
                      </label>
                      <input
                        id="inq-name"
                        type="text"
                        required
                        maxLength={120}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E4DFD7] dark:border-[#242033] bg-[#FAF8F5] dark:bg-[#0B0912] text-[#14121A] dark:text-[#F7F5FA] focus:outline-none focus:border-[#6D28D9] transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="inq-email"
                        className="block text-xs font-medium text-[#14121A] dark:text-[#F7F5FA] mb-1.5"
                      >
                        Email Address *
                      </label>
                      <input
                        id="inq-email"
                        type="email"
                        required
                        maxLength={160}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E4DFD7] dark:border-[#242033] bg-[#FAF8F5] dark:bg-[#0B0912] text-[#14121A] dark:text-[#F7F5FA] focus:outline-none focus:border-[#6D28D9] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="inq-company"
                        className="block text-xs font-medium text-[#14121A] dark:text-[#F7F5FA] mb-1.5"
                      >
                        Business / Brand Name (Optional)
                      </label>
                      <input
                        id="inq-company"
                        type="text"
                        maxLength={140}
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Your business or startup"
                        className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E4DFD7] dark:border-[#242033] bg-[#FAF8F5] dark:bg-[#0B0912] text-[#14121A] dark:text-[#F7F5FA] focus:outline-none focus:border-[#6D28D9] transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="inq-budget"
                        className="block text-xs font-medium text-[#14121A] dark:text-[#F7F5FA] mb-1.5"
                      >
                        Estimated Budget *
                      </label>
                      <select
                        id="inq-budget"
                        value={estimatedBudget}
                        onChange={(e) => setEstimatedBudget(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E4DFD7] dark:border-[#242033] bg-[#FAF8F5] dark:bg-[#0B0912] text-[#14121A] dark:text-[#F7F5FA] focus:outline-none focus:border-[#6D28D9] transition-colors"
                      >
                        {BUDGET_RANGES.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="inq-desc"
                      className="block text-xs font-medium text-[#14121A] dark:text-[#F7F5FA] mb-1.5"
                    >
                      Project Description &amp; Requirements *
                    </label>
                    <textarea
                      id="inq-desc"
                      rows={4}
                      required
                      maxLength={2500}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your business, key pages needed, reference websites, and target launch timeline..."
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-[#E4DFD7] dark:border-[#242033] bg-[#FAF8F5] dark:bg-[#0B0912] text-[#14121A] dark:text-[#F7F5FA] focus:outline-none focus:border-[#6D28D9] transition-colors"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                    <p className="text-xs text-[#534E5E] dark:text-[#B8B2C8]">
                      Direct Studio Email: <span className="text-[#14121A] dark:text-[#F7F5FA] font-medium">{profile.email}</span>
                    </p>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#5B21B6] dark:bg-[#6D28D9] hover:bg-[#4C1D95] dark:hover:bg-[#7C3AED] disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-md"
                    >
                      <Send className="w-4 h-4" />
                      <span>{submitting ? 'Submitting Inquiry...' : 'Submit Project Inquiry'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
