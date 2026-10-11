import { useEffect } from 'react';

export type SeoPageKey = 'home' | 'projects' | 'services' | 'studio' | 'inquiry' | 'not-found';

export interface PageSeoMetadata {
  title: string;
  description: string;
  canonicalSlug: string;
  ogTitle: string;
  ogDescription: string;
}

export const WEBLUME_SEO_MAP: Record<SeoPageKey, PageSeoMetadata> = {
  home: {
    title: 'Weblume.com — Luxury Website Development & Digital Studio',
    description:
      'We Build Digital Experiences That Grow Businesses. Weblume.com crafts high-converting, responsive websites for brands in India, Dubai, USA, UK & Australia.',
    canonicalSlug: '/',
    ogTitle: 'Weblume.com — Digital Experiences That Grow Businesses',
    ogDescription:
      'Bespoke website development, landing pages, and digital design crafted for ambitious businesses worldwide.',
  },
  projects: {
    title: 'Featured Projects & Live Portfolio | Weblume.com Studio',
    description:
      'Explore live client websites, real estate portals like NCR Properties, hospitality concepts, and interactive web applications built by Weblume.com.',
    canonicalSlug: '/#projects',
    ogTitle: 'Selected Works & Live Project Screenshots — Weblume.com',
    ogDescription:
      'Inspect real website deployments, responsive UI architecture, and interactive frontend applications by Weblume.com.',
  },
  services: {
    title: 'Web Development & UI Design Services | Weblume.com',
    description:
      'Custom business websites, high-converting landing pages, real estate portals, café websites, and complete website redesigns by Weblume.com.',
    canonicalSlug: '/#services',
    ogTitle: '7 Bespoke Web Development & Design Services — Weblume.com',
    ogDescription:
      'Request a tailored quote for business websites, landing page design, real estate portals, and responsive redesigns.',
  },
  studio: {
    title: 'Studio Capabilities, Tech Stack & Process | Weblume.com',
    description:
      'Discover the frontend engineering skills, HTML5/CSS3/JavaScript stack, UI design standards, and 4-step launch workflow behind Weblume.com.',
    canonicalSlug: '/#studio',
    ogTitle: 'Inside Weblume.com — Engineering, UI Craft & 4-Step Workflow',
    ogDescription:
      'Learn how Weblume.com takes digital products from discovery and UI architecture to responsive launch.',
  },
  inquiry: {
    title: 'Start a Project Inquiry & Direct Contact | Weblume.com',
    description:
      'Have a project in mind? Contact Weblume.com at weblumeservice@gmail.com or submit your project inquiry brief for a transparent custom quote.',
    canonicalSlug: '/#inquiry',
    ogTitle: 'Initiate a Website Project with Weblume.com',
    ogDescription:
      'Connect directly via email (weblumeservice@gmail.com), WhatsApp (+91 8391026730), or our secure project inquiry brief.',
  },
  'not-found': {
    title: '404 Page Not Found | Weblume.com Digital Studio',
    description:
      'The requested route could not be found on Weblume.com. Return to the main portfolio to explore projects, services, or submit a project inquiry.',
    canonicalSlug: '/#404',
    ogTitle: '404 Route Not Found — Weblume.com',
    ogDescription: 'Navigate back to Weblume.com to explore featured websites and services.',
  },
};

function upsertMetaTag(attrName: 'name' | 'property', attrValue: string, content: string) {
  if (typeof document === 'undefined') return;
  let tag = document.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attrName, attrValue);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertCanonicalLink(href: string) {
  if (typeof document === 'undefined') return;
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

/**
 * Custom hook that dynamically updates document.title, meta description,
 * OpenGraph tags, Twitter cards, and canonical URL when navigating between the 5 pages.
 */
export function usePageSeo(activePage: SeoPageKey): PageSeoMetadata {
  const seoData = WEBLUME_SEO_MAP[activePage] || WEBLUME_SEO_MAP.home;

  useEffect(() => {
    document.title = seoData.title;

    upsertMetaTag('name', 'description', seoData.description);
    upsertMetaTag('property', 'og:title', seoData.ogTitle);
    upsertMetaTag('property', 'og:description', seoData.ogDescription);
    upsertMetaTag('name', 'twitter:title', seoData.ogTitle);
    upsertMetaTag('name', 'twitter:description', seoData.ogDescription);

    const origin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : 'https://weblume.com';
    const fullUrl = `${origin}${seoData.canonicalSlug}`;
    upsertMetaTag('property', 'og:url', fullUrl);
    upsertCanonicalLink(fullUrl);
  }, [seoData]);

  return seoData;
}

/**
 * Security helper: validates that an external URL uses safe http/https protocol
 */
export function isSafeHttpUrl(rawUrl?: string): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  const trimmed = rawUrl.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

/**
 * Security helper: strips HTML tags and control characters from user input
 */
export function sanitizePlainText(input: string, maxLength = 2000): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .slice(0, maxLength);
}
