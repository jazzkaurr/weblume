import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  Edit3,
  Trash2,
  RotateCcw,
  Upload,
  Check,
  Mail,
} from 'lucide-react';
import {
  ProjectItem,
  ProfileConfig,
  DEFAULT_PROFILE_CONFIG,
} from '../data/portfolioData';
import {
  InteractiveTaskManagerDemo,
  InteractiveCalculatorDemo,
} from './InteractiveDemos';
import { isSafeHttpUrl, sanitizePlainText } from '../utils/seoConfig';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onEditProject: (project: ProjectItem) => void;
  onRequestSimilarProject: (projectTitle: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onEditProject,
  onRequestSimilarProject,
}) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [project?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const hasExternalLiveUrl =
    isSafeHttpUrl(project.liveUrl) &&
    !project.liveUrl?.startsWith('#interactive-demo');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      <div className="relative w-full max-w-4xl rounded-2xl border border-[#E4DFD7] dark:border-[#242033] bg-[#FAF8F5] dark:bg-[#100E18] text-[#14121A] dark:text-[#F7F5FA] shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Top Modal Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#0B0912] shrink-0">
          <div className="text-xs text-[#534E5E] dark:text-[#B8B2C8]">
            <span>{project.category}</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span className="text-[#5B21B6] dark:text-[#DDD6FE] font-medium">
              {project.statusLabel}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEditProject(project)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#E4DFD7] dark:border-[#242033] text-[#14121A] dark:text-[#F7F5FA] hover:border-[#6D28D9] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Project</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close project details"
              className="p-2 rounded-lg text-[#534E5E] dark:text-[#B8B2C8] hover:text-[#14121A] dark:hover:text-white hover:bg-[#F3EFEA] dark:hover:bg-[#1C182B] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
          {/* Visual Preview */}
          <div className="rounded-xl overflow-hidden border border-[#E4DFD7] dark:border-[#242033] bg-[#0B0912] aspect-16/10 relative">
            {!imgError && project.imageUrl ? (
              <img
                src={project.imageUrl}
                alt={`${project.title} preview`}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#100E18] via-[#06050A] to-[#2E1065]">
                <p className="text-lg font-semibold text-white">{project.title}</p>
                <p className="text-xs text-[#B8B2C8] mt-1">{project.category}</p>
              </div>
            )}
          </div>

          {/* Interactive Live Demo Sandbox (for Task Manager or Calculator) */}
          {project.interactiveDemoType === 'task-manager' && (
            <InteractiveTaskManagerDemo />
          )}
          {project.interactiveDemoType === 'calculator' && (
            <InteractiveCalculatorDemo />
          )}

          {/* Project Overview & Features */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-4">
              <h3
                id="modal-project-title"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-[#14121A] dark:text-[#F7F5FA]"
              >
                {project.title}
              </h3>
              {project.locationContext && (
                <p className="text-xs text-[#7C7589] dark:text-[#B8B2C8]">
                  Coverage: {project.locationContext}
                </p>
              )}
              <p className="text-base text-[#534E5E] dark:text-[#B8B2C8] leading-relaxed">
                {project.purpose}
              </p>

              <div className="pt-2">
                <h4 className="text-sm font-semibold text-[#14121A] dark:text-[#F7F5FA] mb-3">
                  Key Capabilities &amp; Features
                </h4>
                <ul className="space-y-2.5">
                  {project.features.map((feat, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm text-[#534E5E] dark:text-[#B8B2C8]"
                    >
                      <span className="font-mono-tabular text-xs text-[#5B21B6] dark:text-[#DDD6FE] mt-0.5">
                        0{idx + 1}.
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6 lg:border-l lg:border-[#E4DFD7] dark:lg:border-[#242033] lg:pl-8">
              <div>
                <h4 className="text-xs font-medium text-[#7C7589] dark:text-[#B8B2C8] mb-2">
                  Technologies &amp; Stack
                </h4>
                <p className="text-sm font-medium text-[#14121A] dark:text-[#F7F5FA]">
                  {project.technologies.join(' · ')}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-medium text-[#7C7589] dark:text-[#B8B2C8] mb-2">
                  Project Classification
                </h4>
                <p className="text-sm text-[#534E5E] dark:text-[#B8B2C8]">
                  {project.statusLabel === 'Demo Concept'
                    ? 'Concept Design — Created to showcase hospitality UI layout and menu presentation.'
                    : project.statusLabel === 'Live URL Pending'
                    ? 'Business Website Build — Final client domain URL can be linked via Edit Project once published.'
                    : project.statusLabel === 'Interactive Web App'
                    ? 'Frontend Web Application — Try the working application directly inside the sandbox above.'
                    : 'Live Deployed Website — Accessible online via the external link below.'}
                </p>
              </div>

              <div className="pt-2 space-y-3">
                {hasExternalLiveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#5B21B6] dark:bg-[#6D28D9] hover:bg-[#4C1D95] dark:hover:bg-[#7C3AED] rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>View Live Website</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => onEditProject(project)}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-medium text-[#14121A] dark:text-[#F7F5FA] border border-[#E4DFD7] dark:border-[#242033] hover:border-[#6D28D9] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Add or Update Live URL &amp; Screenshot</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onRequestSimilarProject(project.title);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-[#5B21B6] dark:text-[#DDD6FE] bg-[#EDE9FE]/80 dark:bg-[#7C3AED]/15 hover:bg-[#EDE9FE] dark:hover:bg-[#7C3AED]/25 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Request a Similar Website
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProjectEditorModalProps {
  isOpen: boolean;
  editingProject: ProjectItem | null;
  onClose: () => void;
  onSaveProject: (project: ProjectItem) => void;
  onDeleteProject: (projectId: string) => void;
  onResetDefaults: () => void;
}

export const ProjectEditorModal: React.FC<ProjectEditorModalProps> = ({
  isOpen,
  editingProject,
  onClose,
  onSaveProject,
  onDeleteProject,
  onResetDefaults,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [filterGroup, setFilterGroup] = useState<'business' | 'concept' | 'webapp'>('business');
  const [statusLabel, setStatusLabel] = useState<ProjectItem['statusLabel']>('Live Client Website');
  const [purpose, setPurpose] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [techText, setTechText] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [featuredSpan, setFeaturedSpan] = useState(false);

  useEffect(() => {
    if (editingProject) {
      setTitle(editingProject.title);
      setCategory(editingProject.category);
      setFilterGroup(editingProject.filterGroup);
      setStatusLabel(editingProject.statusLabel);
      setPurpose(editingProject.purpose);
      setFeaturesText(editingProject.features.join('\n'));
      setTechText(editingProject.technologies.join(', '));
      setLiveUrl(editingProject.liveUrl || '');
      setImageUrl(editingProject.imageUrl);
      setFeaturedSpan(Boolean(editingProject.featuredSpan));
    } else {
      setTitle('');
      setCategory('Business Website');
      setFilterGroup('business');
      setStatusLabel('Live Client Website');
      setPurpose('');
      setFeaturesText('Responsive mobile & desktop layout\nDirect WhatsApp & email inquiry integration\nFast page load speed');
      setTechText('HTML5, CSS3, JavaScript, Responsive Design');
      setLiveUrl('');
      setImageUrl('');
      setFeaturedSpan(false);
    }
  }, [editingProject, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const safeTitle = sanitizePlainText(title, 120).trim();
    const safePurpose = sanitizePlainText(purpose, 1000).trim();
    if (!safeTitle || !safePurpose) return;

    const trimmedLiveUrl = liveUrl.trim();
    const validLiveUrl =
      trimmedLiveUrl.startsWith('#interactive-demo') || isSafeHttpUrl(trimmedLiveUrl)
        ? trimmedLiveUrl
        : '';

    const saved: ProjectItem = {
      id: editingProject ? editingProject.id : `proj-${Date.now()}`,
      title: safeTitle,
      category: sanitizePlainText(category, 100).trim() || 'Website Development',
      filterGroup,
      statusLabel,
      purpose: safePurpose,
      features: featuresText
        .split('\n')
        .map((s) => sanitizePlainText(s, 200).trim())
        .filter(Boolean),
      technologies: techText
        .split(',')
        .map((s) => sanitizePlainText(s, 60).trim())
        .filter(Boolean),
      liveUrl: validLiveUrl,
      imageUrl: imageUrl.trim(),
      featuredSpan,
      interactiveDemoType: editingProject?.interactiveDemoType,
      locationContext: editingProject?.locationContext,
    };

    onSaveProject(saved);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-[#E4DFD7] dark:border-[#242033] bg-[#FAF8F5] dark:bg-[#100E18] text-[#14121A] dark:text-[#F7F5FA] shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#0B0912]">
          <div>
            <h3 className="text-lg font-bold text-[#14121A] dark:text-[#F7F5FA]">
              {editingProject ? `Edit Project: ${editingProject.title}` : 'Add New Portfolio Project'}
            </h3>
            <p className="text-xs text-[#7C7589] dark:text-[#B8B2C8]">
              Update project details, live URLs, or upload real project screenshots.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#534E5E] hover:text-[#14121A] dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#534E5E] dark:text-[#B8B2C8] mb-1.5">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., NCR Properties"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#0B0912] text-[#14121A] dark:text-[#F7F5FA] focus:outline-none focus:border-[#6D28D9]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#534E5E] dark:text-[#B8B2C8] mb-1.5">
                Category Label *
              </label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Real Estate Website"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#0B0912] text-[#14121A] dark:text-[#F7F5FA] focus:outline-none focus:border-[#6D28D9]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#534E5E] dark:text-[#B8B2C8] mb-1.5">
                Filter Tab Group
              </label>
              <select
                value={filterGroup}
                onChange={(e) => setFilterGroup(e.target.value as 'business' | 'concept' | 'webapp')}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#0B0912] text-[#14121A] dark:text-[#F7F5FA] focus:outline-none focus:border-[#6D28D9]"
              >
                <option value="business">Business &amp; Client Websites</option>
                <option value="concept">Concept &amp; Hospitality Design</option>
                <option value="webapp">JavaScript &amp; Frontend Apps</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#534E5E] dark:text-[#B8B2C8] mb-1.5">
                Transparency Status Label
              </label>
              <select
                value={statusLabel}
                onChange={(e) => setStatusLabel(e.target.value as ProjectItem['statusLabel'])}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#0B0912] text-[#14121A] dark:text-[#F7F5FA] focus:outline-none focus:border-[#6D28D9]"
              >
                <option value="Live Client Website">Live Client Website</option>
                <option value="Live URL Pending">Live URL Pending</option>
                <option value="Demo Concept">Demo Concept</option>
                <option value="Interactive Web App">Interactive Web App</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#534E5E] dark:text-[#B8B2C8] mb-1.5">
              Live Website URL (https://...)
            </label>
            <input
              type="url"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder="https://your-live-project-url.com"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#0B0912] text-[#14121A] dark:text-[#F7F5FA] focus:outline-none focus:border-[#6D28D9]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#534E5E] dark:text-[#B8B2C8] mb-1.5">
              Project Screenshot (Upload file or paste image URL)
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste screenshot URL or upload image..."
                className="flex-1 px-3.5 py-2 text-sm rounded-lg border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#0B0912] text-[#14121A] dark:text-[#F7F5FA] focus:outline-none focus:border-[#6D28D9]"
              />
              <label className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#0B0912] hover:border-[#6D28D9] cursor-pointer whitespace-nowrap shrink-0">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Screenshot</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#534E5E] dark:text-[#B8B2C8] mb-1.5">
              Project Purpose &amp; Overview *
            </label>
            <textarea
              rows={2}
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Explain what this website achieves for the business or user..."
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#0B0912] text-[#14121A] dark:text-[#F7F5FA] focus:outline-none focus:border-[#6D28D9]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#534E5E] dark:text-[#B8B2C8] mb-1.5">
              Key Features (One per line)
            </label>
            <textarea
              rows={3}
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#0B0912] text-[#14121A] dark:text-[#F7F5FA] focus:outline-none focus:border-[#6D28D9]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-medium text-[#534E5E] dark:text-[#B8B2C8] mb-1.5">
                Technologies (Comma separated)
              </label>
              <input
                type="text"
                value={techText}
                onChange={(e) => setTechText(e.target.value)}
                placeholder="HTML5, CSS3, JavaScript"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#0B0912] text-[#14121A] dark:text-[#F7F5FA] focus:outline-none focus:border-[#6D28D9]"
              />
            </div>
            <label className="flex items-center gap-2.5 text-xs font-medium text-[#534E5E] dark:text-[#B8B2C8] pt-4 cursor-pointer">
              <input
                type="checkbox"
                checked={featuredSpan}
                onChange={(e) => setFeaturedSpan(e.target.checked)}
                className="rounded border-[#E4DFD7] text-[#6D28D9] focus:ring-[#6D28D9]"
              />
              <span>Highlight as Wide Featured Card (2-column span)</span>
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E4DFD7] dark:border-[#242033]">
            <div className="flex items-center gap-2">
              {editingProject && (
                <button
                  type="button"
                  onClick={() => {
                    onDeleteProject(editingProject.id);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Project</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  onResetDefaults();
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#7C7589] hover:text-[#14121A] dark:hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-[#534E5E] dark:text-[#B8B2C8] hover:text-[#14121A] dark:hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#5B21B6] dark:bg-[#6D28D9] hover:bg-[#4C1D95] dark:hover:bg-[#7C3AED] rounded-lg transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Project</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

interface StudioSettingsModalProps {
  isOpen: boolean;
  profile: ProfileConfig;
  onClose: () => void;
  onSaveProfile: (updated: ProfileConfig) => void;
}

export const StudioSettingsModal: React.FC<StudioSettingsModalProps> = ({
  isOpen,
  profile,
  onClose,
  onSaveProfile,
}) => {
  const [formState, setFormState] = useState<ProfileConfig>(profile);
  const [activeTab, setActiveTab] = useState<'profile' | 'inquiries' | 'https-dns'>('profile');
  const [inquiries, setInquiries] = useState<
    Array<{
      id: string;
      fullName: string;
      email: string;
      companyName?: string;
      websiteType: string;
      estimatedBudget: string;
      description: string;
      createdAt: string;
    }>
  >([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  useEffect(() => {
    setFormState(profile);
  }, [profile, isOpen]);

  useEffect(() => {
    if (isOpen && activeTab === 'inquiries') {
      setLoadingInquiries(true);
      fetch('/api/inquiries')
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data.inquiries)) {
            setInquiries(data.inquiries);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingInquiries(false));
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...formState,
      fullName: sanitizePlainText(formState.fullName, 80) || 'Weblume.com',
      brandName: sanitizePlainText(formState.brandName, 80) || 'Weblume.com',
      email: sanitizePlainText(formState.email, 160),
      whatsappPrimary: sanitizePlainText(formState.whatsappPrimary, 30),
      whatsappSecondary: sanitizePlainText(formState.whatsappSecondary, 30),
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-[#E4DFD7] dark:border-[#242033] bg-[#FAF8F5] dark:bg-[#100E18] text-[#14121A] dark:text-[#F7F5FA] shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#0B0912]">
          <div className="flex flex-wrap items-center gap-1.5 bg-[#F3EFEA] dark:bg-[#161324] p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-white dark:bg-[#242033] text-[#14121A] dark:text-white shadow-xs'
                  : 'text-[#534E5E] dark:text-[#B8B2C8] hover:text-[#14121A] dark:hover:text-white'
              }`}
            >
              Contact &amp; Brand
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('inquiries')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'inquiries'
                  ? 'bg-white dark:bg-[#242033] text-[#14121A] dark:text-white shadow-xs'
                  : 'text-[#534E5E] dark:text-[#B8B2C8] hover:text-[#14121A] dark:hover:text-white'
              }`}
            >
              Inquiries ({inquiries.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('https-dns')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'https-dns'
                  ? 'bg-white dark:bg-[#242033] text-[#14121A] dark:text-white shadow-xs'
                  : 'text-[#534E5E] dark:text-[#B8B2C8] hover:text-[#14121A] dark:hover:text-white'
              }`}
            >
              Enforce HTTPS &amp; DNS
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#534E5E] hover:text-[#14121A] dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {activeTab === 'https-dns' ? (
          <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed">
            <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-500/10 space-y-1.5">
              <div className="font-bold text-rose-700 dark:text-rose-300 text-sm">
                Why “Enforce HTTPS” Is Blocked on Your Domain
              </div>
              <p className="text-[#534E5E] dark:text-[#B8B2C8]">
                Your GoDaddy DNS table currently contains an extra <strong className="font-mono-tabular text-[#14121A] dark:text-white">A | @ | Parked</strong> record alongside GitHub’s 4 IP addresses. When Let’s Encrypt attempts to verify your domain to issue the SSL certificate, GoDaddy’s <strong className="font-mono-tabular">Parked</strong> IP intercepts the check and blocks HTTPS activation.
              </p>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-sm font-bold text-[#14121A] dark:text-[#F7F5FA]">
                Fix in GoDaddy DNS (Keep “www” Untouched for Your Other Website)
              </h4>
              <div className="p-3.5 rounded-xl border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#0B0912] space-y-2 font-mono-tabular">
                <div className="text-rose-600 dark:text-rose-400 font-semibold">
                  1. ONLY DELETE THIS RECORD (Leave “www” as-is!):
                </div>
                <div>Type: A | Name: @ | Value: Parked (Delete this row only!)</div>
                <div className="pt-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                  2. OPTION A — Using Root Domain (weblume.site):
                </div>
                <div>Keep the 4 GitHub A records (@ → 185.199.108-111.153) and set GitHub Custom Domain to: weblume.site</div>
                <div className="pt-2 text-violet-600 dark:text-violet-400 font-semibold">
                  3. OPTION B — Using Your “web” Subdomain (web.weblume.site):
                </div>
                <div>Since you already have CNAME | web | jazzkaurr.github.io., set GitHub Custom Domain to: web.weblume.site (instant SSL without touching @ or www!)</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[#5B21B6]/30 dark:border-[#C4B5FD]/30 bg-[#EDE9FE]/50 dark:bg-[#7C3AED]/10 text-[#14121A] dark:text-[#F7F5FA]">
              <strong>App-Level HTTPS Already Active:</strong> We have also enabled <code className="font-mono-tabular">Strict-Transport-Security (HSTS)</code>, <code className="font-mono-tabular">upgrade-insecure-requests</code>, automatic HTTP→HTTPS redirects, and <code className="font-mono-tabular">/public/CNAME</code> inside this codebase.
            </div>
          </div>
        ) : activeTab === 'profile' ? (
          <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#534E5E] dark:text-[#B8B2C8] mb-1.5">
                  Studio / Brand Name
                </label>
                <input
                  type="text"
                  value={formState.fullName}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      fullName: e.target.value,
                      brandName: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#0B0912] text-[#14121A] dark:text-[#F7F5FA]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#534E5E] dark:text-[#B8B2C8] mb-1.5">
                  Professional Email
                </label>
                <input
                  type="email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#0B0912] text-[#14121A] dark:text-[#F7F5FA]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#534E5E] dark:text-[#B8B2C8] mb-1.5">
                  Primary WhatsApp Number
                </label>
                <input
                  type="text"
                  value={formState.whatsappPrimary}
                  onChange={(e) =>
                    setFormState({ ...formState, whatsappPrimary: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#0B0912] text-[#14121A] dark:text-[#F7F5FA]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#534E5E] dark:text-[#B8B2C8] mb-1.5">
                  Secondary WhatsApp Number
                </label>
                <input
                  type="text"
                  value={formState.whatsappSecondary}
                  onChange={(e) =>
                    setFormState({ ...formState, whatsappSecondary: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#0B0912] text-[#14121A] dark:text-[#F7F5FA]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#534E5E] dark:text-[#B8B2C8] mb-1.5">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  value={formState.linkedinUrl}
                  onChange={(e) => setFormState({ ...formState, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/your-profile"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#0B0912] text-[#14121A] dark:text-[#F7F5FA]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#534E5E] dark:text-[#B8B2C8] mb-1.5">
                  GitHub Profile URL
                </label>
                <input
                  type="url"
                  value={formState.githubUrl}
                  onChange={(e) => setFormState({ ...formState, githubUrl: e.target.value })}
                  placeholder="https://github.com/your-username"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#0B0912] text-[#14121A] dark:text-[#F7F5FA]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#534E5E] dark:text-[#B8B2C8] mb-1.5">
                Optional Formspree / HTTPS Webhook URL
              </label>
              <input
                type="url"
                value={formState.customWebhookUrl}
                onChange={(e) =>
                  setFormState({ ...formState, customWebhookUrl: e.target.value })
                }
                placeholder="https://formspree.io/f/your-form-id"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#0B0912] text-[#14121A] dark:text-[#F7F5FA]"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E4DFD7] dark:border-[#242033]">
              <button
                type="button"
                onClick={() => setFormState(DEFAULT_PROFILE_CONFIG)}
                className="text-xs text-[#7C7589] hover:text-[#14121A] dark:hover:text-white cursor-pointer"
              >
                Reset to Defaults
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-[#534E5E] dark:text-[#B8B2C8] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#5B21B6] dark:bg-[#6D28D9] hover:bg-[#4C1D95] dark:hover:bg-[#7C3AED] rounded-lg cursor-pointer"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="p-6 overflow-y-auto space-y-3 max-h-[70vh]">
            {loadingInquiries ? (
              <p className="text-sm text-[#7C7589] py-8 text-center">Loading inquiries...</p>
            ) : inquiries.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <p className="text-sm font-medium text-[#14121A] dark:text-[#F7F5FA]">
                  No inquiries submitted yet.
                </p>
                <p className="text-xs text-[#7C7589]">
                  Test the Project Inquiry form on Page 05 to see recorded project briefs appear here.
                </p>
              </div>
            ) : (
              inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-4 rounded-xl border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#0B0912] space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#7C7589]">
                    <span className="font-mono-tabular font-semibold text-[#5B21B6] dark:text-[#DDD6FE]">
                      {inq.id}
                    </span>
                    <span>{new Date(inq.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="text-sm font-semibold text-[#14121A] dark:text-[#F7F5FA]">
                    {inq.fullName} {inq.companyName ? `· ${inq.companyName}` : ''}
                  </div>
                  <div className="text-xs text-[#7C7589]">
                    {inq.email} · {inq.websiteType} · Budget: {inq.estimatedBudget}
                  </div>
                  <p className="text-xs text-[#534E5E] dark:text-[#B8B2C8] leading-relaxed pt-1">
                    {inq.description}
                  </p>
                  <div className="pt-2 flex items-center gap-3">
                    <a
                      href={`mailto:${inq.email}?subject=Re: Your Weblume.com Website Inquiry (${inq.id})`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#5B21B6] dark:text-[#DDD6FE] hover:underline"
                    >
                      <Mail className="w-3 h-3" />
                      <span>Reply via Email</span>
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
