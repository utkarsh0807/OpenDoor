'use client';

import React, { useState } from 'react';
import { Play, Image as ImageIcon, Award, Users, ExternalLink, ShieldCheck } from 'lucide-react';
import { MediaAssets } from '@/lib/types';

interface MediaGalleryProps {
  media?: MediaAssets;
  title: string;
  sourceUrl: string;
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  media,
  title,
  sourceUrl
}) => {
  const [activeTab, setActiveTab] = useState<'poster' | 'video' | 'photos'>('poster');

  if (!media) return null;

  const hasPoster = Boolean(media.posterUrl || media.bannerUrl);
  const hasVideo = Boolean(media.videoUrl);
  const hasPhotos = Boolean(media.eventPhotos && media.eventPhotos.length > 0);
  const hasSponsors = Boolean(media.sponsorLogos && media.sponsorLogos.length > 0);

  if (!hasPoster && !hasVideo && !hasPhotos && !hasSponsors) {
    return null;
  }

  // Parse YouTube or Vimeo embed ID
  const getEmbedUrl = (url?: string | null) => {
    if (!url) return null;
    try {
      if (url.includes('youtube.com/watch?v=')) {
        const id = url.split('v=')[1]?.split('&')[0];
        return `https://www.youtube-nocookie.com/embed/${id}`;
      }
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1]?.split('?')[0];
        return `https://www.youtube-nocookie.com/embed/${id}`;
      }
      if (url.includes('vimeo.com/')) {
        const id = url.split('vimeo.com/')[1]?.split('?')[0];
        return `https://player.vimeo.com/video/${id}`;
      }
    } catch {
      return null;
    }
    return null;
  };

  const videoEmbedUrl = getEmbedUrl(media.videoUrl);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4 text-xs">
      {/* Tabs */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
        <h4 className="font-bold text-navy-900 text-sm flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-purple-600" />
          Official Media & Visual Highlights
        </h4>

        <div className="flex items-center gap-1">
          {hasPoster && (
            <button
              onClick={() => setActiveTab('poster')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'poster' ? 'bg-purple-100 text-purple-800' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Poster / Banner
            </button>
          )}

          {hasVideo && videoEmbedUrl && (
            <button
              onClick={() => setActiveTab('video')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                activeTab === 'video' ? 'bg-purple-100 text-purple-800' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Play className="w-3 h-3 text-rose-500 fill-rose-500" />
              Video Highlight
            </button>
          )}

          {hasPhotos && (
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'photos' ? 'bg-purple-100 text-purple-800' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Gallery ({media.eventPhotos?.length})
            </button>
          )}
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="relative rounded-xl overflow-hidden bg-slate-900/5 aspect-video flex items-center justify-center">
        {activeTab === 'poster' && (
          <img
            src={media.bannerUrl || media.posterUrl || ''}
            alt={`${title} Official Poster`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}

        {activeTab === 'video' && videoEmbedUrl && (
          <iframe
            src={videoEmbedUrl}
            title={`${title} Promotional Video`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}

        {activeTab === 'photos' && media.eventPhotos && (
          <div className="w-full h-full p-2 grid grid-cols-2 gap-2 overflow-y-auto">
            {media.eventPhotos.map((photo, i) => (
              <img
                key={i}
                src={photo}
                alt={`${title} Photo ${i + 1}`}
                className="w-full h-36 object-cover rounded-lg"
                loading="lazy"
              />
            ))}
          </div>
        )}
      </div>

      {/* Sponsor Logos */}
      {hasSponsors && media.sponsorLogos && (
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Official Organizers & Sponsors
          </span>
          <div className="flex flex-wrap items-center gap-4">
            {media.sponsorLogos.map((sp, idx) => (
              <div key={idx} className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
                <span className="font-semibold text-slate-700 text-[11px]">{sp.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Media Attribution */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
        <span>Attribution: Discovered via public organizer feed</span>
        <a 
          href={sourceUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-purple-600 hover:underline flex items-center gap-1"
        >
          View Original Source Media <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>
    </div>
  );
};
