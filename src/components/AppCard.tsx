/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Download, Star, ExternalLink, HardDrive, ShieldAlert } from 'lucide-react';
import { AppItem } from '../types';

interface AppCardProps {
  app: AppItem;
  onSelect: (app: AppItem) => void;
  onDownload: (app: AppItem) => void;
}

export default function AppCard({ app, onSelect, onDownload }: AppCardProps) {
  // Safe click capture so downloading doesn't trigger modal opening
  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload(app);
  };

  return (
    <motion.div
      layoutId={`app-card-${app.id}`}
      onClick={() => onSelect(app)}
      hover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="glassmorphism relative overflow-hidden rounded-2xl p-5 cursor-pointer hover:border-emerald-500/30 transition-all flex flex-col justify-between group"
    >
      {/* Decorative colored glow on hover */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-teal-500 via-emerald-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -right-16 -top-16 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors duration-500" />

      <div>
        <div className="flex gap-4 items-start">
          {/* SQUIRCLE App Logo */}
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shrink-0 shadow-lg group-hover:shadow-emerald-900/10 group-hover:border-white/20 transition-all duration-300">
            <img
              src={app.logoUrl}
              alt={`${app.name} Logo`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fail-safe placeholder if image fails to load
                (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80`;
              }}
            />
            {app.isCustom && (
              <div className="absolute bottom-0 inset-x-0 bg-indigo-600/90 py-0.5 text-[8px] font-mono font-bold text-center text-white tracking-widest leading-3">
                CUSTOM
              </div>
            )}
          </div>

          {/* App Metadata */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-gray-500 text-[11px] font-mono flex items-center gap-1 bg-white/5 py-0.5 px-2 rounded-md border border-white/5">
                <HardDrive className="w-3 h-3 text-emerald-400" />
                {app.size}
              </span>
            </div>
            
            <h3 className="text-gray-100 font-bold text-base mt-1.5 tracking-tight truncate group-hover:text-emerald-400 transition-colors duration-300">
              {app.name}
            </h3>
            
            <p className="text-gray-400 text-xs truncate">
              {app.developer}
            </p>
          </div>
        </div>

        {/* Short description limit */}
        <p className="text-gray-400 text-[13px] mt-4 line-clamp-2 leading-relaxed min-h-[38px]">
          {app.description}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
        {/* Rating and Downloads Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-amber-400 bg-amber-400/5 px-2 py-1 rounded-lg border border-amber-400/10">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs font-mono font-bold leading-none">{app.rating.toFixed(1)}</span>
          </div>
          <div className="text-gray-500 text-xs">
            <span className="font-semibold text-gray-400 font-mono">{app.downloads}</span> downloads
          </div>
        </div>

        {/* Direct Download Action Button */}
        <button
          onClick={handleDownloadClick}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-gray-950 text-xs font-bold shadow-lg hover:shadow-emerald-500/25 active:scale-95 transition-all outline-none"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Get</span>
        </button>
      </div>
    </motion.div>
  );
}
