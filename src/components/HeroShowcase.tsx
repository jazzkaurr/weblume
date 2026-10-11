import React, { useState } from 'react';
import {
  ExternalLink,
  Smartphone,
  Monitor,
  Code2,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ProjectItem } from '../data/portfolioData';
import { isSafeHttpUrl } from '../utils/seoConfig';

interface HeroShowcaseProps {
  projects: ProjectItem[];
  onExploreProject: (projectId: string) => void;
  onStartQuote: (serviceName?: string) => void;
}

export const HeroShowcase: React.FC<HeroShowcaseProps> = ({
  projects,
  onExploreProject,
  onStartQuote,
}) => {
  const [activeView, setActiveView] = useState<'preview' | 'code' | 'responsive'>('preview');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [imgFailed, setImgFailed] = useState<Record<string, boolean>>({});

  const currentProject = projects[activeSlideIndex] || projects[0];

  const handlePrev = () => {
    setActiveSlideIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveSlideIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between rounded-2xl border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#100E18] p-5 sm:p-6 overflow-hidden shadow-xl dark:shadow-black/40">
      {/* Subtle Royal Amethyst & Champagne radial ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 -right-28 w-80 h-80 rounded-full bg-[#7C3AED]/15 dark:bg-[#7C3AED]/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-28 w-64 h-64 rounded-full bg-[#C4B5FD]/20 dark:bg-[#DDD6FE]/10 blur-3xl"
      />

      {/* Top Interactive Mode Switcher */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-[#E4DFD7] dark:border-[#242033]">
        <div className="text-xs font-semibold text-[#5B21B6] dark:text-[#DDD6FE] tracking-wide">
          Weblume.com Interactive Showcase
        </div>

        <div className="flex items-center gap-1 p-1 rounded-lg bg-[#F3EFEA] dark:bg-[#0B0912] border border-[#E4DFD7]/80 dark:border-[#242033]">
          <button
            type="button"
            onClick={() => setActiveView('preview')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeView === 'preview'
                ? 'bg-white dark:bg-[#1C182B] text-[#14121A] dark:text-[#F7F5FA] shadow-xs'
                : 'text-[#534E5E] dark:text-[#B8B2C8] hover:text-[#14121A] dark:hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Screenshots</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('code')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeView === 'code'
                ? 'bg-white dark:bg-[#1C182B] text-[#14121A] dark:text-[#F7F5FA] shadow-xs'
                : 'text-[#534E5E] dark:text-[#B8B2C8] hover:text-[#14121A] dark:hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Clean Code</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('responsive')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeView === 'responsive'
                ? 'bg-white dark:bg-[#1C182B] text-[#14121A] dark:text-[#F7F5FA] shadow-xs'
                : 'text-[#534E5E] dark:text-[#B8B2C8] hover:text-[#14121A] dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Responsive</span>
          </button>
        </div>
      </div>

      {/* Main Dynamic Viewport Area */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        {activeView === 'preview' && currentProject && (
          <motion.div
            key={currentProject.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="space-y-4"
          >
            <div className="relative rounded-xl overflow-hidden border border-[#E4DFD7] dark:border-[#242033] bg-[#0B0912] aspect-16/10 group">
              {!imgFailed[currentProject.id] && currentProject.imageUrl ? (
                <img
                  src={currentProject.imageUrl}
                  alt={`${currentProject.title} Screenshot`}
                  referrerPolicy="no-referrer"
                  onError={() =>
                    setImgFailed((prev) => ({ ...prev, [currentProject.id]: true }))
                  }
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#0B0912] text-[#B8B2C8] text-sm">
                  {currentProject.title} — {currentProject.category}
                </div>
              )}

              {/* Top Slide Counter & Controls */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <span className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-xs text-[11px] font-mono-tabular text-[#F7F5FA] border border-white/10">
                  0{activeSlideIndex + 1} / 0{projects.length} · {currentProject.category}
                </span>

                <div className="flex items-center gap-1.5 pointer-events-auto">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous project screenshot"
                    className="p-2 rounded-lg bg-black/80 hover:bg-[#6D28D9] text-white border border-white/10 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next project screenshot"
                    className="p-2 rounded-lg bg-black/80 hover:bg-[#6D28D9] text-white border border-white/10 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-end p-5">
                <div className="text-xs text-[#DDD6FE] font-medium">
                  {currentProject.statusLabel}
                </div>
                <div className="flex flex-wrap items-end justify-between gap-4 mt-1">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {currentProject.title}
                    </h3>
                    <p className="text-xs text-zinc-300 mt-0.5 line-clamp-1">
                      {currentProject.purpose}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onExploreProject(currentProject.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#6D28D9] hover:bg-[#7C3AED] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Inspect Project</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Project Thumbnail Selector Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {projects.slice(0, 5).map((proj, idx) => (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                    activeSlideIndex === idx
                      ? 'border-[#6D28D9] dark:border-[#A78BFA] bg-[#EDE9FE]/70 dark:bg-[#7C3AED]/20 text-[#14121A] dark:text-[#F7F5FA]'
                      : 'border-[#E4DFD7] dark:border-[#242033] bg-[#FAF8F5] dark:bg-[#0B0912] text-[#534E5E] dark:text-[#B8B2C8] hover:border-[#6D28D9]/50'
                  }`}
                >
                  <div className="text-[10px] font-mono-tabular text-[#5B21B6] dark:text-[#DDD6FE]">
                    0{idx + 1}
                  </div>
                  <div className="text-[11px] font-semibold truncate mt-0.5">
                    {proj.title}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {activeView === 'code' && (
          <motion.div
            key="code"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="rounded-xl border border-[#242033] bg-[#08070D] p-5 text-xs font-mono-tabular text-[#E2DDF0] space-y-3 overflow-x-auto"
          >
            <div className="flex items-center justify-between text-[#7E7791] pb-2 border-b border-[#242033]">
              <span>weblume.com · Semantic HTML5, CSS3 &amp; JavaScript</span>
              <span className="text-[#DDD6FE]">Hardened &amp; Responsive</span>
            </div>
            <pre className="leading-relaxed text-[12px] text-[#E2DDF0] overflow-x-auto">
{`<section class="weblume-showcase" aria-label="Featured Client Portal">
  <header class="hero-header">
    <h2>Weblume.com — Digital Experiences That Convert</h2>
    <p>Direct client inquiries via Email and WhatsApp.</p>
  </header>

  <div class="bento-grid">
    <article class="project-card">
      <h3>NCR Properties — Luxury Farmhouses</h3>
      <p>Faridabad · Gurgaon · Delhi · Palwal · Sohna</p>
      <a href="mailto:weblumeservice@gmail.com" class="cta-primary">
        Request Project Quote
      </a>
    </article>
  </div>
</section>`}
            </pre>
            <div className="pt-2 border-t border-[#242033] flex items-center justify-between text-[11px] text-[#B8B2C8]">
              <span>WCAG AA Contrast · Input Sanitized · Mobile First</span>
              <button
                type="button"
                onClick={() => onExploreProject('task-manager-app')}
                className="text-[#DDD6FE] hover:underline cursor-pointer"
              >
                Launch Working JS Demo →
              </button>
            </div>
          </motion.div>
        )}

        {activeView === 'responsive' && (
          <motion.div
            key="responsive"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch"
          >
            <div className="sm:col-span-5 rounded-xl border border-[#E4DFD7] dark:border-[#242033] bg-[#FAF8F5] dark:bg-[#0B0912] p-4 flex flex-col justify-between">
              <div>
                <div className="text-xs text-[#5B21B6] dark:text-[#DDD6FE] font-medium">
                  Mobile Viewport (390px)
                </div>
                <h4 className="text-sm font-bold text-[#14121A] dark:text-[#F7F5FA] mt-1">
                  Touch-First Navigation &amp; Tap Targets
                </h4>
                <p className="text-xs text-[#534E5E] dark:text-[#B8B2C8] mt-2 leading-relaxed">
                  Every button, menu link, and WhatsApp action is sized for effortless mobile thumb navigation (≥ 44px touch targets).
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E4DFD7] dark:border-[#242033] text-xs text-[#7C7589]">
                Smartphones · Tablets · Widescreen
              </div>
            </div>

            <div className="sm:col-span-7 rounded-xl border border-[#E4DFD7] dark:border-[#242033] bg-[#FAF8F5] dark:bg-[#0B0912] p-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="text-xs text-[#5B21B6] dark:text-[#DDD6FE] font-medium">
                  Cross-Device Layout Integrity
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#13111C] border border-[#E4DFD7]/60 dark:border-[#242033] flex items-center justify-between text-xs">
                    <span className="font-medium text-[#14121A] dark:text-[#F7F5FA]">
                      1. Mobile Handsets
                    </span>
                    <span className="font-mono-tabular text-[#7C7589]">320px – 640px</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#13111C] border border-[#E4DFD7]/60 dark:border-[#242033] flex items-center justify-between text-xs">
                    <span className="font-medium text-[#14121A] dark:text-[#F7F5FA]">
                      2. Tablets &amp; Hybrid Laptops
                    </span>
                    <span className="font-mono-tabular text-[#7C7589]">768px – 1024px</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#13111C] border border-[#E4DFD7]/60 dark:border-[#242033] flex items-center justify-between text-xs">
                    <span className="font-medium text-[#14121A] dark:text-[#F7F5FA]">
                      3. Desktop &amp; Studio Displays
                    </span>
                    <span className="font-mono-tabular text-[#7C7589]">1280px – 1440px+</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E4DFD7] dark:border-[#242033] flex items-center justify-between">
                <span className="text-xs text-[#7C7589]">Fluid CSS Grid &amp; Flexbox</span>
                <button
                  type="button"
                  onClick={() => onStartQuote('Website Redesign')}
                  className="text-xs font-medium text-[#5B21B6] dark:text-[#DDD6FE] hover:underline cursor-pointer"
                >
                  Request Redesign Quote →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Direct Contact Strip inside Showcase Card */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-4 mt-5 border-t border-[#E4DFD7] dark:border-[#242033] text-xs text-[#534E5E] dark:text-[#B8B2C8]">
        <a
          href="mailto:weblumeservice@gmail.com"
          className="hover:text-[#5B21B6] dark:hover:text-[#DDD6FE] transition-colors font-medium"
        >
          weblumeservice@gmail.com
        </a>
        {isSafeHttpUrl('https://ncr-properties-farmhouses-in-faridabad-gurgaon-pa.ai.studio/') && (
          <a
            href="https://ncr-properties-farmhouses-in-faridabad-gurgaon-pa.ai.studio/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#5B21B6] dark:text-[#DDD6FE] hover:underline font-medium"
          >
            <span>Live NCR Properties Demo</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};
