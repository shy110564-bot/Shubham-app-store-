/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, SlidersHorizontal, LayoutGrid, PlusCircle, Laptop, GraduationCap } from 'lucide-react';
import { Category } from '../types';
import { CATEGORIES } from '../data';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (value: boolean) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  appsCount: number;
}

export default function Navbar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  isAdminOpen,
  setIsAdminOpen,
  sortBy,
  setSortBy,
  appsCount,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full glassmorphism border-b border-white/5 py-4 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        {/* TOP ROW: Brand and Actions */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <LayoutGrid className="w-5.5 h-5.5 text-slate-950 font-bold" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-1.5 leading-none">
                PREMIUM <span className="text-emerald-400">APP STORE</span>
              </h1>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-mono font-bold leading-none">
                  Instant Direct Distribution Portal
                </p>
                <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1 leading-none select-none">
                  <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
                  {appsCount} APPS
                </span>
              </div>
            </div>
          </div>

          {/* DELIBERATE DESIGNER SYMBOL BADGE: CREATED BY SHUBHAM YADAV */}
          <div className="w-full lg:w-auto flex items-center justify-center py-2 px-5 bg-gradient-to-r from-emerald-500/5 via-teal-400/10 to-indigo-500/5 border border-emerald-500/20 rounded-2xl relative overflow-hidden group hover:border-emerald-450/40 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
            {/* Ambient sliding light flare */}
            <div className="absolute -inset-y-12 -inset-x-32 bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[1800ms] pointer-events-none" />
            <div className="relative flex items-center gap-2.5">
              <span className="text-xs text-emerald-400 font-bold animate-ping leading-none">✦</span>
              <span className="text-[11px] font-black text-gray-200 tracking-widest uppercase font-mono flex items-center gap-1">
                CREATED BY <span className="text-emerald-400 font-extrabold bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-405 bg-clip-text">SHUBHAM YADAV</span>
              </span>
              <span className="text-xs text-emerald-400 font-bold animate-ping leading-none">✦</span>
            </div>
          </div>

          {/* SEARCH & FILTERS CONTROLS */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="खोजें (e.g. Notion, Discord...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-white/15 hover:border-emerald-500/20 focus:border-emerald-500 text-xs text-white placeholder-gray-500 transition-all outline-none font-medium"
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-3 pr-8 py-2.5 rounded-xl bg-slate-950 border border-white/15 hover:border-emerald-500/20 text-xs text-white font-medium transition-all outline-none appearance-none cursor-pointer"
              >
                <option value="downloads">Most Downloaded</option>
                <option value="rating">Top Rated</option>
                <option value="name">Alphabetical (A-Z)</option>
                <option value="newest">New Releases</option>
              </select>
              <SlidersHorizontal className="absolute right-3 top-3 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            </div>

            {/* Admin toggle CTA */}
            <button
              onClick={() => setIsAdminOpen(!isAdminOpen)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 border ${
                isAdminOpen
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-gray-950 border-transparent shadow-lg shadow-emerald-500/15'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Admin Upload</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
