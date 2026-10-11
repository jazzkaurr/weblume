import ncrPropertiesImg from '../assets/images/project_ncr_properties_1791697444828.jpg';
import vehicleMarketplaceImg from '../assets/images/project_vehicle_marketplace_1791697458112.jpg';
import cafeConceptImg from '../assets/images/project_cafe_concept_1791697476732.jpg';
import taskManagerImg from '../assets/images/project_task_manager_1791697488406.jpg';
import onlineCalculatorImg from '../assets/images/project_online_calculator_1791697503312.jpg';

export type ProjectFilterType = 'all' | 'business' | 'concept' | 'webapp';

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  filterGroup: Exclude<ProjectFilterType, 'all'>;
  statusLabel: 'Live Client Website' | 'Live URL Pending' | 'Demo Concept' | 'Interactive Web App';
  purpose: string;
  features: string[];
  technologies: string[];
  liveUrl?: string;
  imageUrl: string;
  featuredSpan?: boolean;
  interactiveDemoType?: 'task-manager' | 'calculator';
  locationContext?: string;
}

export interface ServiceItem {
  id: string;
  index: string;
  title: string;
  description: string;
  deliverables: string[];
  idealFor: string;
}

export interface ProfileConfig {
  fullName: string;
  brandName: string;
  domainName: string;
  profession: string;
  tagline: string;
  email: string;
  whatsappPrimary: string;
  whatsappSecondary: string;
  linkedinUrl: string;
  githubUrl: string;
  location: string;
  targetMarkets: string[];
  customWebhookUrl: string;
}

export const DEFAULT_PROFILE_CONFIG: ProfileConfig = {
  fullName: 'Weblume.com',
  brandName: 'Weblume.com',
  domainName: 'Weblume.com',
  profession: 'Website Developer & Digital Design Studio',
  tagline: 'We Build Digital Experiences That Grow Businesses.',
  email: 'weblumeservice@gmail.com',
  whatsappPrimary: '8391026730',
  whatsappSecondary: '8368208941',
  linkedinUrl: 'https://www.linkedin.com',
  githubUrl: 'https://github.com',
  location: 'India — Available for remote projects worldwide',
  targetMarkets: ['India', 'Dubai', 'USA', 'UK', 'Australia'],
  customWebhookUrl: '',
};

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'ncr-properties',
    title: 'NCR Properties',
    category: 'Real Estate Website',
    filterGroup: 'business',
    statusLabel: 'Live Client Website',
    purpose:
      'Showcase luxury farmhouses, residential plots, and commercial properties across Faridabad, Gurgaon, Delhi, Palwal, and Sohna with direct buyer lead capture.',
    features: [
      'Location-based property categories across Delhi NCR',
      'Curated architectural image galleries with responsive viewing',
      'Structured buyer inquiry section for site visits',
      'Direct phone call and instant WhatsApp contact integration',
    ],
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design', 'UI Design'],
    liveUrl: 'https://ncr-properties-farmhouses-in-faridabad-gurgaon-pa.ai.studio/',
    imageUrl: ncrPropertiesImg,
    featuredSpan: true,
    locationContext: 'Faridabad · Gurgaon · Delhi · Palwal · Sohna',
  },
  {
    id: 'used-vehicle-marketplace',
    title: 'Used Vehicle Marketplace',
    category: 'Automotive Business Website',
    filterGroup: 'business',
    statusLabel: 'Live URL Pending',
    purpose:
      'Help customers browse, evaluate, and inquire about certified used vehicle sales and purchases with clear vehicle specifications and direct dealer contact.',
    features: [
      'Conversion-focused automotive homepage layout',
      'Structured vehicle information and inspection highlights',
      'Buyer & seller benefits breakdown and interactive FAQs',
      'Direct call and WhatsApp inquiry pathways (add final live URL when published)',
    ],
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Web Design'],
    liveUrl: '',
    imageUrl: vehicleMarketplaceImg,
    featuredSpan: false,
  },
  {
    id: 'cafe-website-concept',
    title: 'Café Website Concept',
    category: 'Restaurant & Café Web Design',
    filterGroup: 'concept',
    statusLabel: 'Demo Concept',
    purpose:
      'Create a warm, editorial online presence for an artisanal café and bakery to showcase seasonal menus, atmosphere, and location details.',
    features: [
      'Structured specialty coffee and pastry menu presentation',
      'Editorial visual gallery highlighting interior ambiance',
      'Brand story introduction and roasting philosophy',
      'Location hours, map directions, and table/order inquiry details',
    ],
    technologies: ['HTML5', 'CSS3', 'Website UI Design', 'Canva Visuals'],
    liveUrl: '',
    imageUrl: cafeConceptImg,
    featuredSpan: false,
  },
  {
    id: 'task-manager-app',
    title: 'Task Manager',
    category: 'JavaScript Web Application',
    filterGroup: 'webapp',
    statusLabel: 'Interactive Web App',
    purpose:
      'A fast, distraction-free personal productivity application engineered with vanilla JavaScript and persistent browser local storage.',
    features: [
      'Add, edit, toggle completion, and delete daily tasks',
      'Automatic state persistence using browser LocalStorage',
      'Filter tasks by status (All, Active, Completed) with live counters',
      'Clean responsive layout built for both desktop and mobile workflows',
    ],
    technologies: ['HTML', 'CSS', 'JavaScript', 'LocalStorage API'],
    liveUrl: '#interactive-demo-task-manager',
    imageUrl: taskManagerImg,
    featuredSpan: false,
    interactiveDemoType: 'task-manager',
  },
  {
    id: 'online-calculator',
    title: 'Online Calculator',
    category: 'Frontend Development',
    filterGroup: 'webapp',
    statusLabel: 'Interactive Web App',
    purpose:
      'A tactile, high-contrast arithmetic calculator built to demonstrate clean DOM manipulation, state management, and responsive grid alignment.',
    features: [
      'Complete arithmetic operations with decimal and percentage support',
      'Live expression history readout and instant clear controls',
      'Full keyboard input support for rapid numerical entry',
      'Responsive tactile grid interface with tabular numerals',
    ],
    technologies: ['HTML', 'CSS', 'JavaScript', 'CSS Grid'],
    liveUrl: '#interactive-demo-calculator',
    imageUrl: onlineCalculatorImg,
    featuredSpan: false,
    interactiveDemoType: 'calculator',
  },
];

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: 'business-websites',
    index: '01',
    title: 'Business Website Development',
    description:
      'Professional, trustworthy multi-section websites tailored for local businesses, service providers, and growing brands.',
    deliverables: ['Custom Brand Alignment', 'Mobile-First Responsive Layout', 'Lead Capture & Contact Integration'],
    idealFor: 'Consultancies, clinics, agencies & local enterprises',
  },
  {
    id: 'landing-page-design',
    index: '02',
    title: 'Landing Page Design',
    description:
      'High-converting single-page experiences structured around clear value propositions, product showcases, and direct calls to action.',
    deliverables: ['Conversion-Focused Hierarchy', 'Fast Loading Performance', 'WhatsApp & Form Lead Funnels'],
    idealFor: 'Product launches, ad campaigns & service promotions',
  },
  {
    id: 'portfolio-websites',
    index: '03',
    title: 'Portfolio Websites',
    description:
      'Distinctive personal websites for freelancers, digital creators, architects, and consultants to present their work with authority.',
    deliverables: ['Filterable Project Galleries', 'Case Study Layouts', 'Direct Booking & Inquiry Flow'],
    idealFor: 'Freelancers, designers, creators & independent professionals',
  },
  {
    id: 'restaurant-cafe-websites',
    index: '04',
    title: 'Restaurant & Café Websites',
    description:
      'Appetizing digital storefronts featuring easy-to-read digital menus, ambiance galleries, opening hours, and table or order inquiry links.',
    deliverables: ['Mobile-Readable Menu Sections', 'Atmosphere Photo Showcase', 'Location & Reservation Links'],
    idealFor: 'Specialty cafés, restaurants, bakeries & cloud kitchens',
  },
  {
    id: 'real-estate-websites',
    index: '05',
    title: 'Real Estate Websites',
    description:
      'High-impact property portals for realtors, developers, and farmhouse brokers with categorized listings and instant buyer contact.',
    deliverables: ['Property Category Filtering', 'High-Resolution Villa Galleries', 'Direct Call & WhatsApp Lead Buttons'],
    idealFor: 'Real estate brokers, farmhouse listings & property developers',
  },
  {
    id: 'website-redesign',
    index: '06',
    title: 'Website Redesign',
    description:
      'Transform outdated, slow, or non-responsive websites into modern digital experiences with clean typography and intuitive mobile navigation.',
    deliverables: ['UI/UX Audit & Layout Refresh', 'Mobile Responsiveness Upgrade', 'Improved Navigation & Speed'],
    idealFor: 'Established businesses upgrading their online presence',
  },
  {
    id: 'graphic-poster-design',
    index: '07',
    title: 'Graphic & Poster Design',
    description:
      'Polished digital creatives, social media banners, and promotional posters that maintain visual consistency across your brand channels.',
    deliverables: ['Social Media Creatives', 'Digital Promotional Posters', 'Brand-Consistent Visual Assets'],
    idealFor: 'Marketing campaigns, announcements & social branding',
  },
];

export interface SkillItem {
  name: string;
  category: 'Core Web' | 'Design & UI' | 'Workflow & Logic';
  summary: string;
}

export const CORE_SKILLS: SkillItem[] = [
  {
    name: 'HTML5',
    category: 'Core Web',
    summary: 'Semantic document structure, accessible markup, and SEO-friendly page hierarchy.',
  },
  {
    name: 'CSS3',
    category: 'Core Web',
    summary: 'Modern Flexbox and Grid layouts, custom animations, dark/light theming, and clean styling.',
  },
  {
    name: 'JavaScript',
    category: 'Core Web',
    summary: 'Interactive UI components, DOM manipulation, form validation, and client-side state logic.',
  },
  {
    name: 'Responsive Web Design',
    category: 'Design & UI',
    summary: 'Fluid layouts engineered to look crisp and function smoothly across mobile, tablet, and desktop screens.',
  },
  {
    name: 'Landing Page Development',
    category: 'Core Web',
    summary: 'Structured conversion flows with clear visual anchors, fast load times, and actionable CTAs.',
  },
  {
    name: 'Website UI Design',
    category: 'Design & UI',
    summary: 'Balanced typography, intentional whitespace, accessible contrast, and modern interface systems.',
  },
  {
    name: 'Canva Graphic Design',
    category: 'Design & UI',
    summary: 'Custom promotional graphics, social banners, and cohesive visual assets for digital brands.',
  },
  {
    name: 'AI-Assisted Website Development',
    category: 'Workflow & Logic',
    summary: 'Leveraging modern AI-assisted workflows to prototype rapidly, refine layouts, and deliver reliable code.',
  },
  {
    name: 'Basic Python & Problem Solving',
    category: 'Workflow & Logic',
    summary: 'Foundational Python scripting, algorithmic thinking, and structured debugging.',
  },
];

export interface TechStackItem {
  name: string;
  role: string;
  group: string;
}

export const TECH_STACK: TechStackItem[] = [
  { name: 'HTML5', role: 'Semantic Markup & Structure', group: 'Frontend Core' },
  { name: 'CSS3', role: 'Responsive Layouts & Styling', group: 'Frontend Core' },
  { name: 'JavaScript', role: 'Client-Side Interactivity', group: 'Frontend Core' },
  { name: 'Python', role: 'Foundational Scripting & Logic', group: 'Programming' },
  { name: 'Git & GitHub', role: 'Version Control & Deployment', group: 'Developer Tools' },
  { name: 'VS Code', role: 'Primary Code Editor', group: 'Developer Tools' },
  { name: 'Canva', role: 'Graphic & Poster Design', group: 'Creative Suite' },
  { name: 'AI Website Builders', role: 'Rapid Prototyping & Assisted Dev', group: 'Modern Workflow' },
];

export const WORK_PROCESS_STEPS = [
  {
    step: '01',
    title: 'Discover',
    subtitle: 'Goals & Business Requirements',
    description:
      'We begin by understanding your business offerings, target audience, regional market, and the exact actions you want visitors to take on your website.',
  },
  {
    step: '02',
    title: 'Design',
    subtitle: 'Structure, Layout & Visual Identity',
    description:
      'We plan the sitemap, content hierarchy, color palette, and typography so every section communicates trust and guides visitors naturally toward inquiry.',
  },
  {
    step: '03',
    title: 'Develop',
    subtitle: 'Responsive Build & Testing',
    description:
      'Your website is built with clean, semantic code, interactive components, and tested carefully across mobile phones, tablets, and desktop browsers.',
  },
  {
    step: '04',
    title: 'Launch',
    subtitle: 'Deployment & Handover',
    description:
      'We publish your website live, verify all contact forms and WhatsApp/email links, and provide clear handover guidance so you can manage your online presence.',
  },
];

export const WHY_WORK_WITH_ME = [
  {
    index: '01',
    title: 'Modern & Responsive Design',
    description:
      'Every layout adapts seamlessly across smartphones, tablets, and high-resolution desktop displays without broken elements.',
  },
  {
    index: '02',
    title: 'Clear Communication',
    description:
      'Direct, jargon-free updates via Email and WhatsApp from initial concept through final deployment.',
  },
  {
    index: '03',
    title: 'Attention to Detail',
    description:
      'Careful alignment, readable typography, accessible contrast ratios, and purposeful hover interactions.',
  },
  {
    index: '04',
    title: 'Business-Focused Solutions',
    description:
      'Websites structured around real business goals—generating inquiries, showcasing offerings clearly, and building buyer confidence.',
  },
  {
    index: '05',
    title: 'Mobile-Friendly Experiences',
    description:
      'Touch-friendly navigation and fast-loading assets designed for visitors browsing on mobile networks.',
  },
  {
    index: '06',
    title: 'Customized Around Your Needs',
    description:
      'Tailored layouts built specifically for your industry—whether real estate, hospitality, automotive, or personal branding.',
  },
  {
    index: '07',
    title: 'Transparent Scope & Pricing',
    description:
      'Honest deliverables, clear project milestones, and straightforward pricing with no hidden surprises.',
  },
];
