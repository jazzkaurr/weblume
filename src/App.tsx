import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Plus,
  Sun,
  Moon,
  Edit3,
  Eye,
  Mail,
  MessageSquare,
  Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  INITIAL_PROJECTS,
  SERVICES_LIST,
  CORE_SKILLS,
  TECH_STACK,
  WORK_PROCESS_STEPS,
  WHY_WORK_WITH_ME,
  DEFAULT_PROFILE_CONFIG,
  ProjectItem,
  ProjectFilterType,
  ProfileConfig,
} from './data/portfolioData';
import { HeroShowcase } from './components/HeroShowcase';
import {
  ProjectDetailModal,
  ProjectEditorModal,
  StudioSettingsModal,
} from './components/ProjectModals';
import { ContactSection } from './components/ContactSection';
import { NotFoundPage } from './components/NotFoundPage';
import { usePageSeo, isSafeHttpUrl, SeoPageKey } from './utils/seoConfig';

export type PageKey = 'home' | 'projects' | 'services' | 'studio' | 'inquiry';

const PAGES_ORDER: Array<{ id: PageKey; num: string; label: string }> = [
  { id: 'home', num: '01', label: 'Home' },
  { id: 'projects', num: '02', label: 'Projects' },
  { id: 'services', num: '03', label: 'Services' },
  { id: 'studio', num: '04', label: 'Studio' },
  { id: 'inquiry', num: '05', label: 'Inquiry' },
];

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('weblume_theme');
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [profile, setProfile] = useState<ProfileConfig>(() => {
    try {
      const saved = localStorage.getItem('weblume_profile_v2');
      return saved ? { ...DEFAULT_PROFILE_CONFIG, ...JSON.parse(saved) } : DEFAULT_PROFILE_CONFIG;
    } catch {
      return DEFAULT_PROFILE_CONFIG;
    }
  });

  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    try {
      const saved = localStorage.getItem('weblume_projects_v2');
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  // 5-Page Navigation State
  const [activePage, setActivePage] = useState<PageKey>('home');
  const [viewAllPagesMode, setViewAllPagesMode] = useState(false);

  const [projectFilter, setProjectFilter] = useState<ProjectFilterType>('all');
  const [skillFilter, setSkillFilter] = useState<
    'All' | 'Core Web' | 'Design & UI' | 'Workflow & Logic'
  >('All');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState('');
  const [isNotFoundView, setIsNotFoundView] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Dynamically update document.title, meta description, OpenGraph, Twitter & canonical tags per page
  const activeSeoKey: SeoPageKey = isNotFoundView ? 'not-found' : activePage;
  const currentSeo = usePageSeo(activeSeoKey);

  // Sync theme class with document root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('weblume_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('weblume_projects_v2', JSON.stringify(projects));
    } catch {
      // ignore
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem('weblume_profile_v2', JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  // Sync browser URL hash with the 5 pages
  useEffect(() => {
    const syncFromLocation = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === '404') {
        setIsNotFoundView(true);
        return;
      }
      const matchedPage = PAGES_ORDER.find((p) => p.id === hash);
      if (matchedPage) {
        setIsNotFoundView(false);
        setActivePage(matchedPage.id);
      }
    };
    syncFromLocation();
    window.addEventListener('hashchange', syncFromLocation);
    return () => window.removeEventListener('hashchange', syncFromLocation);
  }, []);

  const navigateToPage = (page: PageKey) => {
    if (isNotFoundView) {
      setIsNotFoundView(false);
    }
    setActivePage(page);
    try {
      window.history.replaceState(null, '', page === 'home' ? '/' : `#${page}`);
    } catch {
      // ignore history errors in sandboxed iframes
    }
    if (viewAllPagesMode) {
      setTimeout(() => {
        document.getElementById(`page-${page}`)?.scrollIntoView({ behavior: 'smooth' });
      }, 40);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRequestQuote = (serviceTitle?: string) => {
    if (serviceTitle) {
      setPreselectedService(serviceTitle);
    }
    navigateToPage('inquiry');
  };

  const handleSaveProject = (saved: ProjectItem) => {
    setProjects((prev) => {
      const exists = prev.some((p) => p.id === saved.id);
      if (exists) {
        return prev.map((p) => (p.id === saved.id ? saved : p));
      }
      return [saved, ...prev];
    });
    if (selectedProject?.id === saved.id) {
      setSelectedProject(saved);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
    }
  };

  const handleResetProjects = () => {
    setProjects(INITIAL_PROJECTS);
    try {
      localStorage.removeItem('weblume_projects_v2');
    } catch {
      // ignore
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (projectFilter === 'all') return true;
    return p.filterGroup === projectFilter;
  });

  const filteredSkills = CORE_SKILLS.filter((s) =>
    skillFilter === 'All' ? true : s.category === skillFilter
  );

  const cleanWhatsAppNumber = (raw: string) => {
    const digits = raw.replace(/\D/g, '');
    return digits.length === 10 ? `91${digits}` : digits;
  };

  const currentPageIdx = PAGES_ORDER.findIndex((p) => p.id === activePage);
  const prevPageObj = currentPageIdx > 0 ? PAGES_ORDER[currentPageIdx - 1] : null;
  const nextPageObj =
    currentPageIdx < PAGES_ORDER.length - 1 ? PAGES_ORDER[currentPageIdx + 1] : null;

  const shouldRenderPage = (pageKey: PageKey) =>
    viewAllPagesMode || activePage === pageKey;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF8F5] dark:bg-[#06050A] text-[#14121A] dark:text-[#F7F5FA] transition-colors duration-200">
      {/* Strict 3-Zone Top Navigation Bar (5 Pages) */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-8 px-6 lg:px-10 py-4 border-b border-[#E4DFD7] dark:border-[#242033] bg-[#FAF8F5]/95 dark:bg-[#06050A]/95 backdrop-blur-md">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            navigateToPage('home');
          }}
          className="text-lg font-bold tracking-tight text-[#14121A] dark:text-[#F7F5FA] whitespace-nowrap shrink-0"
        >
          Weblume.com
        </a>

        {/* Zone 2: 5 clean single-line text navigation links */}
        <nav
          aria-label="5-Page Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#534E5E] dark:text-[#B8B2C8]"
        >
          {PAGES_ORDER.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                navigateToPage(item.id);
              }}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                !isNotFoundView && activePage === item.id
                  ? 'text-[#14121A] dark:text-[#F7F5FA] border-[#5B21B6] dark:border-[#DDD6FE] font-semibold'
                  : 'border-transparent hover:text-[#14121A] dark:hover:text-[#F7F5FA]'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => handleRequestQuote()}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#5B21B6] dark:bg-[#6D28D9] hover:bg-[#4C1D95] dark:hover:bg-[#7C3AED] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
          >
            Project Inquiry
          </button>
        </div>
      </header>

      {/* Interactive Studio Utility & 5-Page Switcher Bar */}
      <div className="border-b border-[#E4DFD7] dark:border-[#242033] bg-[#F3EFEA] dark:bg-[#0B0912]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Mobile & Desktop Quick 5-Page Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-full">
            {PAGES_ORDER.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => navigateToPage(p.id)}
                className={`px-2.5 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activePage === p.id && !viewAllPagesMode
                    ? 'bg-[#5B21B6] dark:bg-[#6D28D9] text-white shadow-xs'
                    : 'text-[#534E5E] dark:text-[#B8B2C8] hover:text-[#14121A] dark:hover:text-[#F7F5FA]'
                }`}
              >
                <span className="font-mono-tabular opacity-75 mr-1">{p.num}.</span>
                {p.label}
              </button>
            ))}
          </div>

          {/* Right Studio Controls (Theme Toggle, Add Screenshot, View Mode) */}
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href={`mailto:${profile.email}`}
              className="hidden lg:inline-flex items-center gap-1.5 text-[#534E5E] dark:text-[#B8B2C8] hover:text-[#5B21B6] dark:hover:text-[#DDD6FE] font-medium transition-colors whitespace-nowrap shrink-0"
            >
              <Mail className="w-3.5 h-3.5 text-[#5B21B6] dark:text-[#DDD6FE]" />
              <span>{profile.email}</span>
            </a>

            <button
              type="button"
              onClick={() => {
                setEditingProject(null);
                setIsEditorOpen(true);
              }}
              className="inline-flex items-center gap-1 text-[#534E5E] dark:text-[#B8B2C8] hover:text-[#14121A] dark:hover:text-[#F7F5FA] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#5B21B6] dark:text-[#DDD6FE]" />
              <span>Add Screenshot / Project</span>
            </button>

            <button
              type="button"
              onClick={() => setViewAllPagesMode(!viewAllPagesMode)}
              className="inline-flex items-center gap-1 text-[#534E5E] dark:text-[#B8B2C8] hover:text-[#14121A] dark:hover:text-[#F7F5FA] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Switch between 5-Page Interactive View and Continuous Scroll"
            >
              <Layers className="w-3.5 h-3.5 text-[#5B21B6] dark:text-[#DDD6FE]" />
              <span>{viewAllPagesMode ? '5-Page Mode' : 'View All'}</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle luxury dark and light color palette"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#13111C] text-[#14121A] dark:text-[#F7F5FA] hover:border-[#6D28D9] font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#DDD6FE]" />
                  <span>Silk Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#5B21B6]" />
                  <span>Obsidian Dark</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {isNotFoundView ? (
        <NotFoundPage
          onReturnHome={() => {
            setIsNotFoundView(false);
            navigateToPage('home');
          }}
          onGoToContact={() => {
            setIsNotFoundView(false);
            navigateToPage('inquiry');
          }}
        />
      ) : (
        <main className="flex-1">
          <AnimatePresence mode="wait">
            {/* =========================================================
                PAGE 01: HOME (Hero, Interactive Mockups & Direct Contact)
               ========================================================= */}
            {shouldRenderPage('home') && (
              <motion.div
                key="page-home"
                id="page-home"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="py-12 sm:py-20"
              >
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-stretch">
                    {/* Left Column */}
                    <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
                      <div className="space-y-6">
                        <div className="text-xs font-semibold text-[#5B21B6] dark:text-[#DDD6FE] tracking-wide">
                          Page 01 / 05 · Weblume.com · Available for Freelance Projects
                        </div>

                        <h1
                          className="font-bold tracking-tight text-[#14121A] dark:text-[#F7F5FA] headline-balance leading-[1.07]"
                          style={{ fontSize: 'clamp(2.25rem, 4vw, 3.75rem)' }}
                        >
                          I Design &amp; Develop Websites That Turn{' '}
                          <span className="font-serif-editorial italic font-semibold text-[#5B21B6] dark:text-[#DDD6FE]">
                            Ideas Into Reality.
                          </span>
                        </h1>

                        <p className="text-base sm:text-lg text-[#534E5E] dark:text-[#B8B2C8] leading-relaxed max-w-xl">
                          <strong className="text-[#14121A] dark:text-[#F7F5FA] font-semibold">Weblume.com</strong> builds modern, responsive, high-converting websites for businesses, startups, and personal brands across India, Dubai, the USA, the UK, and Australia.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 pt-1">
                          <button
                            type="button"
                            onClick={() => navigateToPage('projects')}
                            className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#5B21B6] dark:bg-[#6D28D9] hover:bg-[#4C1D95] dark:hover:bg-[#7C3AED] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-lg shadow-[#5B21B6]/20"
                          >
                            <span>Explore Project Screenshots</span>
                            <ArrowUpRight className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => navigateToPage('inquiry')}
                            className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#14121A] dark:text-[#F7F5FA] bg-white dark:bg-[#100E18] border border-[#E4DFD7] dark:border-[#242033] hover:border-[#6D28D9] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            <span>Let’s Work Together</span>
                          </button>
                        </div>
                      </div>

                      {/* Essential Contact & Brand Strip */}
                      <div className="pt-6 border-t border-[#E4DFD7] dark:border-[#242033] grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#100E18]">
                          <div className="text-[11px] text-[#7C7589] dark:text-[#B8B2C8]">
                            Official Studio Email
                          </div>
                          <a
                            href={`mailto:${profile.email}`}
                            className="text-sm font-bold text-[#14121A] dark:text-[#F7F5FA] hover:text-[#5B21B6] dark:hover:text-[#DDD6FE] transition-colors block truncate mt-0.5"
                          >
                            {profile.email}
                          </a>
                        </div>

                        <div className="p-4 rounded-xl border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#100E18]">
                          <div className="text-[11px] text-[#7C7589] dark:text-[#B8B2C8]">
                            Direct WhatsApp Lines
                          </div>
                          <div className="text-sm font-bold font-mono-tabular text-[#14121A] dark:text-[#F7F5FA] mt-0.5">
                            <a
                              href={`https://wa.me/${cleanWhatsAppNumber(profile.whatsappPrimary)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-[#5B21B6] dark:hover:text-[#DDD6FE]"
                            >
                              +91 {profile.whatsappPrimary}
                            </a>
                            <span className="mx-1.5 text-[#7C7589]">·</span>
                            <a
                              href={`https://wa.me/${cleanWhatsAppNumber(profile.whatsappSecondary)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-[#5B21B6] dark:hover:text-[#DDD6FE]"
                            >
                              {profile.whatsappSecondary}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Interactive Screenshot Carousel & Code Showcase */}
                    <div className="lg:col-span-6 flex">
                      <HeroShowcase
                        projects={projects}
                        onExploreProject={(projId) => {
                          const found = projects.find((p) => p.id === projId);
                          if (found) setSelectedProject(found);
                        }}
                        onStartQuote={(serviceName) => handleRequestQuote(serviceName)}
                      />
                    </div>
                  </div>

                  {/* Full-Width 4-Column Quick Navigation Cards Below Hero */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14 pt-10 border-t border-[#E4DFD7] dark:border-[#242033]">
                    <button
                      type="button"
                      onClick={() => navigateToPage('projects')}
                      className="text-left p-5 rounded-xl border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#100E18] hover:border-[#6D28D9] transition-colors group cursor-pointer shadow-xs"
                    >
                      <div className="text-xs font-mono-tabular text-[#5B21B6] dark:text-[#DDD6FE]">
                        Page 02 →
                      </div>
                      <h2 className="text-base font-bold text-[#14121A] dark:text-[#F7F5FA] mt-1 group-hover:text-[#5B21B6] dark:group-hover:text-[#DDD6FE] transition-colors">
                        Project Screenshots
                      </h2>
                      <p className="text-xs text-[#534E5E] dark:text-[#B8B2C8] mt-1">
                        NCR Properties, Automotive, Café Concept &amp; Live JS Apps.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateToPage('services')}
                      className="text-left p-5 rounded-xl border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#100E18] hover:border-[#6D28D9] transition-colors group cursor-pointer shadow-xs"
                    >
                      <div className="text-xs font-mono-tabular text-[#5B21B6] dark:text-[#DDD6FE]">
                        Page 03 →
                      </div>
                      <h2 className="text-base font-bold text-[#14121A] dark:text-[#F7F5FA] mt-1 group-hover:text-[#5B21B6] dark:group-hover:text-[#DDD6FE] transition-colors">
                        7 Core Web Services
                      </h2>
                      <p className="text-xs text-[#534E5E] dark:text-[#B8B2C8] mt-1">
                        Business sites, landing pages, real estate portals &amp; redesigns.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateToPage('studio')}
                      className="text-left p-5 rounded-xl border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#100E18] hover:border-[#6D28D9] transition-colors group cursor-pointer shadow-xs"
                    >
                      <div className="text-xs font-mono-tabular text-[#5B21B6] dark:text-[#DDD6FE]">
                        Page 04 →
                      </div>
                      <h2 className="text-base font-bold text-[#14121A] dark:text-[#F7F5FA] mt-1 group-hover:text-[#5B21B6] dark:group-hover:text-[#DDD6FE] transition-colors">
                        Studio Skills &amp; Stack
                      </h2>
                      <p className="text-xs text-[#534E5E] dark:text-[#B8B2C8] mt-1">
                        HTML5, CSS3, JS, UI Design, Canva &amp; 4-step workflow.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateToPage('inquiry')}
                      className="text-left p-5 rounded-xl border border-[#5B21B6]/40 dark:border-[#C4B5FD]/40 bg-[#EDE9FE]/50 dark:bg-[#7C3AED]/10 hover:border-[#6D28D9] transition-colors group cursor-pointer shadow-xs"
                    >
                      <div className="text-xs font-mono-tabular text-[#5B21B6] dark:text-[#DDD6FE]">
                        Page 05 →
                      </div>
                      <h2 className="text-base font-bold text-[#14121A] dark:text-[#F7F5FA] mt-1 group-hover:text-[#5B21B6] dark:group-hover:text-[#DDD6FE] transition-colors">
                        Emails &amp; Inquiry Form
                      </h2>
                      <p className="text-xs text-[#534E5E] dark:text-[#B8B2C8] mt-1">
                        weblumeservice@gmail.com · Instant Quote &amp; WhatsApp.
                      </p>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* =========================================================
                PAGE 02: PROJECTS & SCREENSHOTS GALLERY
               ========================================================= */}
            {shouldRenderPage('projects') && (
              <motion.section
                key="page-projects"
                id="page-projects"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="py-12 sm:py-16 border-t border-[#E4DFD7]/60 dark:border-[#242033]/60"
              >
                <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-10">
                  <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div className="space-y-2 max-w-2xl">
                      <div className="text-xs font-semibold text-[#5B21B6] dark:text-[#DDD6FE] tracking-wide">
                        Page 02 / 05 · Weblume.com Portfolio &amp; Project Screenshots
                      </div>
                      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#14121A] dark:text-[#F7F5FA] headline-balance">
                        Featured Projects &amp;{' '}
                        <span className="font-serif-editorial italic font-semibold text-[#5B21B6] dark:text-[#DDD6FE]">
                          Live Demos
                        </span>
                      </h2>
                      <p className="text-sm sm:text-base text-[#534E5E] dark:text-[#B8B2C8]">
                        Click any screenshot to inspect project details, test the working JavaScript apps, or upload custom screenshots.
                      </p>
                    </div>

                    {/* Interactive Filter Segmented Control + Add Project Button */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div
                        role="tablist"
                        aria-label="Filter portfolio projects"
                        className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-[#F3EFEA] dark:bg-[#0B0912] border border-[#E4DFD7] dark:border-[#242033]"
                      >
                        {[
                          { id: 'all', label: `All (${projects.length})` },
                          { id: 'business', label: 'Business Sites' },
                          { id: 'concept', label: 'Design Concepts' },
                          { id: 'webapp', label: 'Live JS Apps' },
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={projectFilter === tab.id}
                            onClick={() => setProjectFilter(tab.id as ProjectFilterType)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                              projectFilter === tab.id
                                ? 'bg-white dark:bg-[#1C182B] text-[#14121A] dark:text-[#F7F5FA] shadow-xs'
                                : 'text-[#534E5E] dark:text-[#B8B2C8] hover:text-[#14121A] dark:hover:text-white'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingProject(null);
                          setIsEditorOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#5B21B6] dark:bg-[#6D28D9] hover:bg-[#4C1D95] dark:hover:bg-[#7C3AED] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Project</span>
                      </button>
                    </div>
                  </div>

                  {/* Project Bento Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
                    {filteredProjects.map((project) => {
                      const isWide = Boolean(project.featuredSpan) && projectFilter === 'all';
                      const hasExternalUrl =
                        isSafeHttpUrl(project.liveUrl) &&
                        !project.liveUrl?.startsWith('#interactive-demo');
                      const imgFailed = Boolean(failedImages[project.id]);

                      return (
                        <article
                          key={project.id}
                          className={`${
                            isWide ? 'lg:col-span-12' : 'lg:col-span-6'
                          } group rounded-2xl border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#100E18] hover:border-[#6D28D9]/70 transition-colors overflow-hidden flex flex-col shadow-sm`}
                        >
                          <div
                            className={`grid grid-cols-1 ${
                              isWide ? 'lg:grid-cols-12 items-stretch' : ''
                            } h-full`}
                          >
                            {/* Project Screenshot Container */}
                            <div
                              onClick={() => setSelectedProject(project)}
                              className={`${
                                isWide ? 'lg:col-span-7' : ''
                              } relative bg-[#0B0912] aspect-16/10 overflow-hidden cursor-pointer`}
                            >
                              {!imgFailed && project.imageUrl ? (
                                <img
                                  src={project.imageUrl}
                                  alt={`${project.title} Screenshot`}
                                  referrerPolicy="no-referrer"
                                  onError={() =>
                                    setFailedImages((prev) => ({
                                      ...prev,
                                      [project.id]: true,
                                    }))
                                  }
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#100E18] via-[#06050A] to-[#2E1065]">
                                  <span className="text-xs text-[#DDD6FE] font-medium">
                                    {project.category}
                                  </span>
                                  <h4 className="text-xl font-bold text-white mt-1">
                                    {project.title}
                                  </h4>
                                </div>
                              )}
                            </div>

                            {/* Project Info */}
                            <div
                              className={`${
                                isWide ? 'lg:col-span-5' : ''
                              } p-6 sm:p-7 flex flex-col justify-between space-y-5`}
                            >
                              <div className="space-y-2.5">
                                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#7C7589] dark:text-[#B8B2C8]">
                                  <div>
                                    <span>{project.category}</span>
                                    <span className="mx-1.5" aria-hidden="true">
                                      ·
                                    </span>
                                    <span className="text-[#5B21B6] dark:text-[#DDD6FE] font-medium">
                                      {project.statusLabel}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingProject(project);
                                      setIsEditorOpen(true);
                                    }}
                                    className="inline-flex items-center gap-1 text-[#7C7589] hover:text-[#14121A] dark:hover:text-white transition-colors cursor-pointer"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Edit / Screenshot</span>
                                  </button>
                                </div>

                                <h3 className="text-2xl font-bold tracking-tight text-[#14121A] dark:text-[#F7F5FA]">
                                  {project.title}
                                </h3>

                                {project.locationContext && (
                                  <p className="text-xs text-[#7C7589] dark:text-[#B8B2C8]">
                                    {project.locationContext}
                                  </p>
                                )}

                                <p className="text-sm text-[#534E5E] dark:text-[#B8B2C8] leading-relaxed">
                                  {project.purpose}
                                </p>

                                <ul className="space-y-1 pt-1">
                                  {project.features.slice(0, 3).map((feat, i) => (
                                    <li
                                      key={i}
                                      className="text-xs text-[#534E5E] dark:text-[#B8B2C8] flex items-start gap-2"
                                    >
                                      <span className="font-mono-tabular text-[#5B21B6] dark:text-[#DDD6FE]">
                                        •
                                      </span>
                                      <span>{feat}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="space-y-4 pt-4 border-t border-[#E4DFD7] dark:border-[#242033]">
                                <div className="text-xs text-[#7C7589] dark:text-[#B8B2C8]">
                                  <span className="text-[#14121A] dark:text-[#F7F5FA] font-medium">
                                    {project.technologies.join(' · ')}
                                  </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-2.5">
                                  {hasExternalUrl ? (
                                    <a
                                      href={project.liveUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#5B21B6] dark:bg-[#6D28D9] hover:bg-[#4C1D95] dark:hover:bg-[#7C3AED] rounded-lg transition-colors whitespace-nowrap shrink-0"
                                    >
                                      <span>View Live Website</span>
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                  ) : project.interactiveDemoType ? (
                                    <button
                                      type="button"
                                      onClick={() => setSelectedProject(project)}
                                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#5B21B6] dark:bg-[#6D28D9] hover:bg-[#4C1D95] dark:hover:bg-[#7C3AED] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                                    >
                                      <span>Try Live App Demo</span>
                                      <ArrowUpRight className="w-3.5 h-3.5" />
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingProject(project);
                                        setIsEditorOpen(true);
                                      }}
                                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#14121A] dark:text-[#F7F5FA] border border-[#E4DFD7] dark:border-[#242033] hover:border-[#6D28D9] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                                    >
                                      <span>Add Live URL</span>
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => setSelectedProject(project)}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#14121A] dark:text-[#F7F5FA] border border-[#E4DFD7] dark:border-[#242033] hover:border-[#6D28D9] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Project Details</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </motion.section>
            )}

            {/* =========================================================
                PAGE 03: SERVICES (7 Core Offerings + Instant Quote Trigger)
               ========================================================= */}
            {shouldRenderPage('services') && (
              <motion.section
                key="page-services"
                id="page-services"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="py-12 sm:py-16 border-t border-[#E4DFD7]/60 dark:border-[#242033]/60"
              >
                <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-10">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="max-w-2xl space-y-2">
                      <div className="text-xs font-semibold text-[#5B21B6] dark:text-[#DDD6FE] tracking-wide">
                        Page 03 / 05 · Weblume.com Services
                      </div>
                      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#14121A] dark:text-[#F7F5FA] headline-balance">
                        Digital Services That{' '}
                        <span className="font-serif-editorial italic font-semibold text-[#5B21B6] dark:text-[#DDD6FE]">
                          Grow Businesses
                        </span>
                      </h2>
                      <p className="text-sm sm:text-base text-[#534E5E] dark:text-[#B8B2C8]">
                        Select any service below to open the Project Inquiry page with your service pre-selected.
                      </p>
                    </div>
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-xs font-semibold text-[#5B21B6] dark:text-[#DDD6FE] hover:underline"
                    >
                      Direct Email: {profile.email} →
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SERVICES_LIST.map((service, idx) => (
                      <div
                        key={service.id}
                        className={`${
                          idx === 0 ? 'md:col-span-2 lg:col-span-2' : ''
                        } rounded-2xl border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#100E18] p-6 sm:p-7 flex flex-col justify-between space-y-6 hover:border-[#6D28D9] transition-colors shadow-xs`}
                      >
                        <div className="space-y-2.5">
                          <div className="text-xs font-mono-tabular text-[#5B21B6] dark:text-[#DDD6FE] font-semibold">
                            {service.index}. {service.idealFor}
                          </div>
                          <h3 className="text-xl font-bold text-[#14121A] dark:text-[#F7F5FA]">
                            {service.title}
                          </h3>
                          <p className="text-sm text-[#534E5E] dark:text-[#B8B2C8] leading-relaxed">
                            {service.description}
                          </p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-[#E4DFD7] dark:border-[#242033]">
                          <div className="text-xs text-[#7C7589] dark:text-[#B8B2C8]">
                            {service.deliverables.join(' · ')}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRequestQuote(service.title)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#5B21B6] dark:bg-[#6D28D9] hover:bg-[#4C1D95] dark:hover:bg-[#7C3AED] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            <span>Request a Quote</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.section>
            )}

            {/* =========================================================
                PAGE 04: STUDIO (Skills, Tech Stack & 4-Step Process)
               ========================================================= */}
            {shouldRenderPage('studio') && (
              <motion.section
                key="page-studio"
                id="page-studio"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="py-12 sm:py-16 border-t border-[#E4DFD7]/60 dark:border-[#242033]/60"
              >
                <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-16">
                  {/* Top Studio Intro + Interactive Filterable Skills */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    <div className="lg:col-span-5 space-y-4">
                      <div className="text-xs font-semibold text-[#5B21B6] dark:text-[#DDD6FE] tracking-wide">
                        Page 04 / 05 · About Weblume.com
                      </div>
                      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#14121A] dark:text-[#F7F5FA] headline-balance">
                        Modern Code, Clean UI &amp;{' '}
                        <span className="font-serif-editorial italic font-semibold text-[#5B21B6] dark:text-[#DDD6FE]">
                          Business Focus.
                        </span>
                      </h2>
                      <p className="text-sm sm:text-base text-[#534E5E] dark:text-[#B8B2C8] leading-relaxed">
                        <strong className="text-[#14121A] dark:text-[#F7F5FA] font-semibold">Weblume.com</strong> creates attractive, functional, and responsive digital experiences tailored to real business needs—combining clean frontend code with thoughtful visual design.
                      </p>

                      {/* Technology Stack Compact Grid */}
                      <div className="pt-4 space-y-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#7C7589]">
                          Technology Stack &amp; Tools
                        </h3>
                        <div className="grid grid-cols-2 gap-2.5">
                          {TECH_STACK.map((item) => (
                            <div
                              key={item.name}
                              className="p-3.5 rounded-xl border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#100E18]"
                            >
                              <div className="text-sm font-bold text-[#14121A] dark:text-[#F7F5FA]">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-[#5B21B6] dark:text-[#DDD6FE] mt-0.5">
                                {item.role}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Interactive Filterable Core Skills */}
                    <div className="lg:col-span-7 space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="text-base font-bold text-[#14121A] dark:text-[#F7F5FA]">
                          Core Capabilities ({filteredSkills.length})
                        </h3>
                        <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-[#F3EFEA] dark:bg-[#0B0912] border border-[#E4DFD7] dark:border-[#242033]">
                          {(['All', 'Core Web', 'Design & UI', 'Workflow & Logic'] as const).map(
                            (cat) => (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => setSkillFilter(cat)}
                                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                                  skillFilter === cat
                                    ? 'bg-white dark:bg-[#1C182B] text-[#14121A] dark:text-[#F7F5FA] shadow-xs'
                                    : 'text-[#534E5E] dark:text-[#B8B2C8] hover:text-[#14121A] dark:hover:text-white'
                                }`}
                              >
                                {cat}
                              </button>
                            )
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredSkills.map((skill, idx) => (
                          <div
                            key={skill.name}
                            className="p-4 rounded-xl border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#100E18] space-y-1.5 shadow-2xs"
                          >
                            <div className="text-[11px] font-mono-tabular text-[#5B21B6] dark:text-[#DDD6FE]">
                              0{idx + 1} · {skill.category}
                            </div>
                            <h4 className="text-sm font-bold text-[#14121A] dark:text-[#F7F5FA]">
                              {skill.name}
                            </h4>
                            <p className="text-xs text-[#534E5E] dark:text-[#B8B2C8] leading-relaxed">
                              {skill.summary}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* 4-Step Work Process */}
                      <div className="pt-6 space-y-4">
                        <h3 className="text-base font-bold text-[#14121A] dark:text-[#F7F5FA]">
                          4-Step Work Process
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {WORK_PROCESS_STEPS.map((step) => (
                            <div
                              key={step.step}
                              className="p-4 rounded-xl border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#100E18] space-y-1.5"
                            >
                              <div className="text-xs font-mono-tabular font-semibold text-[#5B21B6] dark:text-[#DDD6FE]">
                                {step.step}. {step.title} — {step.subtitle}
                              </div>
                              <p className="text-xs text-[#534E5E] dark:text-[#B8B2C8] leading-relaxed">
                                {step.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Compact Why Work With Weblume.com Bar */}
                  <div className="pt-10 border-t border-[#E4DFD7] dark:border-[#242033]">
                    <div className="text-xs font-semibold text-[#5B21B6] dark:text-[#DDD6FE] mb-4">
                      Why Partner With Weblume.com
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {WHY_WORK_WITH_ME.slice(0, 4).map((item) => (
                        <div
                          key={item.index}
                          className="p-4 rounded-xl border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#100E18]"
                        >
                          <div className="text-xs font-mono-tabular text-[#5B21B6] dark:text-[#DDD6FE] font-semibold">
                            {item.index}.
                          </div>
                          <h4 className="text-sm font-bold text-[#14121A] dark:text-[#F7F5FA] mt-1">
                            {item.title}
                          </h4>
                          <p className="text-xs text-[#534E5E] dark:text-[#B8B2C8] mt-1 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            {/* =========================================================
                PAGE 05: EMAILS & PROJECT INQUIRY SECTION
               ========================================================= */}
            {shouldRenderPage('inquiry') && (
              <motion.div
                key="page-inquiry"
                id="page-inquiry"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <ContactSection
                  profile={profile}
                  preselectedService={preselectedService}
                  onOpenSettings={() => setIsSettingsOpen(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 5-Page Interactive Step Footer Navigator (When in 5-Page Mode) */}
          {!viewAllPagesMode && (
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-12">
              <div className="p-4 rounded-2xl border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#100E18] flex flex-wrap items-center justify-between gap-4 shadow-sm">
                <div>
                  {prevPageObj ? (
                    <button
                      type="button"
                      onClick={() => navigateToPage(prevPageObj.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg border border-[#E4DFD7] dark:border-[#242033] hover:border-[#6D28D9] transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>
                        {prevPageObj.num}. {prevPageObj.label}
                      </span>
                    </button>
                  ) : (
                    <span className="text-xs text-[#7C7589] font-mono-tabular px-2">
                      Page 01 of 05
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {PAGES_ORDER.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => navigateToPage(p.id)}
                      className={`px-2.5 py-1 text-xs font-mono-tabular rounded-md transition-colors cursor-pointer ${
                        activePage === p.id
                          ? 'bg-[#5B21B6] dark:bg-[#6D28D9] text-white font-semibold'
                          : 'text-[#7C7589] hover:text-[#14121A] dark:hover:text-white'
                      }`}
                    >
                      {p.num}
                    </button>
                  ))}
                </div>

                <div>
                  {nextPageObj ? (
                    <button
                      type="button"
                      onClick={() => navigateToPage(nextPageObj.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#5B21B6] dark:bg-[#6D28D9] hover:bg-[#4C1D95] dark:hover:bg-[#7C3AED] rounded-lg transition-colors cursor-pointer"
                    >
                      <span>
                        Next: {nextPageObj.num}. {nextPageObj.label}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigateToPage('home')}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg border border-[#E4DFD7] dark:border-[#242033] hover:border-[#6D28D9] transition-colors cursor-pointer"
                    >
                      <span>Back to 01. Home</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* Sleek Footer with Dynamic SEO Indicator, Direct Email, WhatsApp & 5-Page Links */}
      <footer className="border-t border-[#E4DFD7] dark:border-[#242033] bg-[#F3EFEA] dark:bg-[#040307] py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="text-base font-bold tracking-tight text-[#14121A] dark:text-[#F7F5FA]">
              Weblume.com
            </div>
            <p className="text-xs text-[#534E5E] dark:text-[#B8B2C8]">
              “Thoughtfully Designed. Professionally Developed.” · {currentSeo.title}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-1.5 font-semibold text-[#5B21B6] dark:text-[#DDD6FE] hover:underline"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{profile.email}</span>
            </a>

            <a
              href={`https://wa.me/${cleanWhatsAppNumber(profile.whatsappPrimary)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono-tabular font-medium text-[#14121A] dark:text-[#F7F5FA] hover:text-[#5B21B6] dark:hover:text-[#DDD6FE]"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#5B21B6] dark:text-[#DDD6FE]" />
              <span>+91 {profile.whatsappPrimary}</span>
            </a>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="text-[#534E5E] dark:text-[#B8B2C8] hover:text-[#14121A] dark:hover:text-white transition-colors cursor-pointer"
            >
              Inbox &amp; Settings
            </button>
          </div>
        </div>
      </footer>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onEditProject={(proj) => {
          setSelectedProject(null);
          setEditingProject(proj);
          setIsEditorOpen(true);
        }}
        onRequestSimilarProject={(projTitle) =>
          handleRequestQuote(`Website similar to ${projTitle}`)
        }
      />

      {/* Add / Edit Project Studio Modal */}
      <ProjectEditorModal
        isOpen={isEditorOpen}
        editingProject={editingProject}
        onClose={() => setIsEditorOpen(false)}
        onSaveProject={handleSaveProject}
        onDeleteProject={handleDeleteProject}
        onResetDefaults={handleResetProjects}
      />

      {/* Studio Settings & Inquiry Inbox Modal */}
      <StudioSettingsModal
        isOpen={isSettingsOpen}
        profile={profile}
        onClose={() => setIsSettingsOpen(false)}
        onSaveProfile={(updated) => setProfile(updated)}
      />
    </div>
  );
}
