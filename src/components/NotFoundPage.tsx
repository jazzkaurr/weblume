import React from 'react';
import { Home, Mail } from 'lucide-react';

interface NotFoundPageProps {
  onReturnHome: () => void;
  onGoToContact: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onReturnHome,
  onGoToContact,
}) => {
  return (
    <main className="min-h-[78vh] flex items-center justify-center px-6 py-20">
      <div className="max-w-xl w-full text-center space-y-6 rounded-2xl border border-[#E4DFD7] dark:border-[#242033] bg-white dark:bg-[#100E18] p-8 sm:p-12 shadow-xl">
        <div className="text-xs font-mono-tabular text-[#5B21B6] dark:text-[#DDD6FE]">
          HTTP 404 · Route Not Found
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#14121A] dark:text-[#F7F5FA] headline-balance">
          This Digital Route Does Not{' '}
          <span className="font-serif-editorial italic font-semibold text-[#5B21B6] dark:text-[#DDD6FE]">
            Exist Yet.
          </span>
        </h1>
        <p className="text-sm sm:text-base text-[#534E5E] dark:text-[#B8B2C8] leading-relaxed">
          The page or project link you requested could not be located on Weblume.com. Return to the main portfolio to explore featured websites, services, or initiate a project inquiry.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
          <button
            type="button"
            onClick={onReturnHome}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#5B21B6] dark:bg-[#6D28D9] hover:bg-[#4C1D95] dark:hover:bg-[#7C3AED] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Back to Weblume.com</span>
          </button>
          <button
            type="button"
            onClick={onGoToContact}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-[#14121A] dark:text-[#F7F5FA] border border-[#E4DFD7] dark:border-[#242033] hover:border-[#6D28D9] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>Contact Weblume.com</span>
          </button>
        </div>
      </div>
    </main>
  );
};
