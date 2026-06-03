/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Star, Calendar, RefreshCw, HardDrive, User, Tag, Trash2, Globe } from 'lucide-react';
import { AppItem } from '../types';

interface AppDetailModalProps {
  app: AppItem | null;
  onClose: () => void;
  onDownload: (app: AppItem) => void;
  onDelete?: (id: string) => void;
}

export default function AppDetailModal({ app, onClose, onDownload, onDelete }: AppDetailModalProps) {
  if (!app) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-gray-950/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto glassmorphism rounded-3xl p-6 sm:p-8 z-10 shadow-2xl [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full"
        >
          {/* Close trigger button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white p-2 rounded-full transition-all border border-white/5 active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Heading Section */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-xl shrink-0">
              <img
                src={app.logoUrl}
                alt={`${app.name} Logo`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80`;
                }}
              />
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Secure Download
                </span>
                {app.isCustom && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Custom App
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {app.name}
              </h2>
              <p className="text-gray-400 text-sm flex items-center gap-1.5 font-mono">
                By {app.developer}
              </p>
            </div>
          </div>

          {/* Feature highlights grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 sm:my-8 bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="text-center p-2">
              <div className="text-amber-400 flex justify-center mb-1">
                <Star className="w-4 h-4 fill-current animate-pulse" />
              </div>
              <p className="text-[10px] text-gray-500 tracking-wider font-mono uppercase">Rating</p>
              <p className="text-sm font-extrabold text-white font-mono">{app.rating.toFixed(1)} / 5</p>
            </div>

            <div className="text-center p-2 border-l border-white/10">
              <div className="text-indigo-400 flex justify-center mb-1">
                <Download className="w-4 h-4" />
              </div>
              <p className="text-[10px] text-gray-500 tracking-wider font-mono uppercase">Downloads</p>
              <p className="text-sm font-extrabold text-white font-mono">{app.downloads}</p>
            </div>

            <div className="text-center p-2 border-l border-white/10 sm:border-l">
              <div className="text-emerald-400 flex justify-center mb-1">
                <HardDrive className="w-4 h-4" />
              </div>
              <p className="text-[10px] text-gray-500 tracking-wider font-mono uppercase">File Size</p>
              <p className="text-sm font-extrabold text-white font-mono">{app.size}</p>
            </div>

            <div className="text-center p-2 border-l border-white/10">
              <div className="text-blue-400 flex justify-center mb-1">
                <RefreshCw className="w-4 h-4" />
              </div>
              <p className="text-[10px] text-gray-500 tracking-wider font-mono uppercase">Version</p>
              <p className="text-sm font-extrabold text-white font-mono">{app.version}</p>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-4">
            <h4 className="text-gray-200 font-bold text-base border-l-2 border-emerald-500 pl-2">
              About This App
            </h4>
            <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
              {app.description}
            </p>
          </div>

          {/* Technical Specifications list */}
          <div className="mt-8 pt-6 border-t border-white/5 grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <User className="w-4 h-4 text-emerald-400" />
                <span className="font-mono">Developer:</span>
                <span className="text-white font-semibold">{app.developer}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Tag className="w-4 h-4 text-emerald-400" />
                <span className="font-mono">Distribution:</span>
                <span className="text-white font-semibold">Free & Safe</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span className="font-mono">Platform compatibility:</span>
                <span className="text-white font-semibold">Universal Web/Desktop</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span className="font-mono">Direct download source:</span>
                <span className="text-white font-semibold truncate max-w-[150px] inline-block align-bottom">Verified Host</span>
              </div>
            </div>
          </div>

          {/* Action button grouping at footer */}
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {onDelete && app.isCustom ? (
              <button
                onClick={() => {
                  onDelete(app.id);
                  onClose();
                }}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-red-950/40 hover:bg-red-900/30 text-red-400 border border-red-500/10 hover:border-red-500/30 font-medium text-sm transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove Custom App</span>
              </button>
            ) : (
              <div aria-hidden className="hidden sm:block" />
            )}

            <button
              onClick={() => onDownload(app)}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-gray-950 font-bold text-sm shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-98 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Instantly Download App ({app.size})</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
