import React from 'react';
import { SearchX, Sparkles, MapPin, BookmarkPlus, Calendar, PlusCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  type: 
    | 'search_empty' 
    | 'no_hackathons' 
    | 'no_scholarships' 
    | 'no_saved' 
    | 'no_applications' 
    | 'no_calendar' 
    | 'no_colleges' 
    | 'custom';
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction
}) => {
  const defaults = {
    search_empty: {
      icon: SearchX,
      title: 'No opportunities found matching your criteria',
      description: 'Try adjusting your search terms, clearing specific filters, or switching your regional scope to "All India" or "Online Only".',
      actionText: 'Clear All Filters',
    },
    no_hackathons: {
      icon: MapPin,
      title: 'No local hackathons listed for this exact city',
      description: 'Don\'t worry! Online hackathons and national open hackathons (like Smart India Hackathon & ETHIndia) are open to students nationwide.',
      actionText: 'Switch to Online Hackathons',
      secondaryActionText: 'Explore All India',
    },
    no_scholarships: {
      icon: Sparkles,
      title: 'No scholarships matching current stream or criteria',
      description: 'Check government merit-cum-means portals (NSP & MahaDBT) or update your student profile in Settings to expand eligibility criteria.',
      actionText: 'View All Scholarships',
      secondaryActionText: 'Update Profile',
    },
    no_saved: {
      icon: BookmarkPlus,
      title: 'You haven\'t saved any opportunities yet',
      description: 'Click the bookmark icon on any hackathon, scholarship, or internship card to track it here for quick access.',
      actionText: 'Explore Opportunities',
    },
    no_applications: {
      icon: Calendar,
      title: 'No applications being tracked',
      description: 'Track your application status (Preparing, Applied, Selected) to keep notes, manage deadlines, and never miss an interview.',
      actionText: 'Browse Opportunities to Apply',
    },
    no_calendar: {
      icon: Calendar,
      title: 'No upcoming event dates or deadlines',
      description: 'Save opportunities to populate your calendar timeline with registration deadlines and hackathon dates.',
      actionText: 'Discover Hackathons & Grants',
    },
    no_colleges: {
      icon: PlusCircle,
      title: 'College not listed in current directory?',
      description: 'Our directory is expanding across all Indian states and streams. You can suggest your college to be verified and added.',
      actionText: 'Suggest a College',
    },
    custom: {
      icon: RefreshCw,
      title: title || 'Nothing found',
      description: description || 'No records available at this time.',
      actionText: actionText || 'Refresh',
    }
  };

  const config = defaults[type] || defaults.custom;
  const Icon = config.icon;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-sm my-6">
      <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-navy-900 mb-2">
        {title || config.title}
      </h4>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">
        {description || config.description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {(actionText || config.actionText) && onAction && (
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionText || config.actionText}
          </Button>
        )}
        {(secondaryActionText || ('secondaryActionText' in config && config.secondaryActionText)) && onSecondaryAction && (
          <Button variant="outline" size="sm" onClick={onSecondaryAction}>
            {secondaryActionText || ('secondaryActionText' in config && config.secondaryActionText)}
          </Button>
        )}
      </div>
    </div>
  );
};
