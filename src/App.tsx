/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Sparkles, AlertCircle, ArrowUpRight, Laptop, Trash2, Heart, ShieldCheck, Cpu, HelpCircle } from 'lucide-react';
import { AppItem, Category, ToastMessage } from './types';
import { PRESET_APPS } from './data';
import Navbar from './components/Navbar';
import AppCard from './components/AppCard';
import AppDetailModal from './components/AppDetailModal';
import AdminPanel from './components/AdminPanel';
import Notification from './components/Notification';

export default function App() {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [isAdminOpen, setIsAdminOpen] = useState(false); // Hidden by default, opens via + toggle button
  const [sortBy, setSortBy] = useState('downloads');
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // Custom download progress indicators
  const [downloadProgress, setDownloadProgress] = useState<{ [appId: string]: number }>({});
  const [downloadingApp, setDownloadingApp] = useState<AppItem | null>(null);

  // Initialize Apps from LocalStorage or Presets
  useEffect(() => {
    const savedApps = localStorage.getItem('app_store_apps_data');
    if (savedApps) {
      try {
        const parsed = JSON.parse(savedApps);
        // Force cleanup of default preset apps to start fresh
        const filtered = parsed.filter((app: AppItem) => !['notion', 'figma', 'spotify', 'vscode', 'discord', 'obsidian', 'warp', 'sublime'].includes(app.id));
        setApps(filtered);
        localStorage.setItem('app_store_apps_data', JSON.stringify(filtered));
      } catch (e) {
        setApps([]);
      }
    } else {
      localStorage.setItem('app_store_apps_data', JSON.stringify([]));
      setApps([]);
    }
  }, []);

  // Sync to local storage
  const saveAppsToLocalStorage = (updatedApps: AppItem[]) => {
    setApps(updatedApps);
    localStorage.setItem('app_store_apps_data', JSON.stringify(updatedApps));
  };

  // Toast builder
  const showToast = (text: string, type: 'success' | 'error' | 'info') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}`,
      type,
      text,
    };
    setToasts((prev) => [...prev, newToast]);
    
    // Auto remove after 4s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Add App Handler
  const handleAddApp = (newApp: AppItem) => {
    const updated = [newApp, ...apps];
    saveAppsToLocalStorage(updated);
  };

  // Delete App Handler
  const handleDeleteApp = (id: string) => {
    const target = apps.find((a) => a.id === id);
    if (!target) return;
    
    const updated = apps.filter((a) => a.id !== id);
    saveAppsToLocalStorage(updated);
    showToast(`"${target.name}" has been removed from store catalog.`, 'info');
  };

  // Direct Download trigger with download animation overlays
  const handleDownloadApp = (app: AppItem) => {
    if (downloadingApp) {
      showToast('Another download is currently processing...', 'error');
      return;
    }

    setDownloadingApp(app);
    showToast(`Downloading "${app.name}" - Starting transfer stream...`, 'info');

    // Simulate progress download loader
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setDownloadProgress((prev) => ({ ...prev, [app.id]: progress }));
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Open download link in a new tab
        window.open(app.downloadUrl, '_blank', 'noopener,noreferrer');
        
        showToast(`"${app.name}" download successfully started!`, 'success');
        
        // Log additional custom download statistic increments
        const updatedApps = apps.map((a) => {
          if (a.id === app.id) {
            const currentCount = a.downloadsCount + 1;
            // format readable abbreviation
            let formatted = `${currentCount}`;
            if (currentCount >= 1000000) {
              formatted = `${(currentCount / 1000000).toFixed(1)}M`;
            } else if (currentCount >= 1000) {
              formatted = `${(currentCount / 1000).toFixed(1)}K`;
            }
            return {
              ...a,
              downloadsCount: currentCount,
              downloads: formatted,
            };
          }
          return a;
        });
        saveAppsToLocalStorage(updatedApps);
        
        // Reset states
        setTimeout(() => {
          setDownloadingApp(null);
          setDownloadProgress((prev) => {
            const copy = { ...prev };
            delete copy[app.id];
            return copy;
          });
        }, 1000);
      }
    }, 150);
  };

  // Filters logic
  const filteredApps = apps
    .filter((app) => {
      // Category matches
      const categoryMatch = selectedCategory === 'All' || app.category === selectedCategory;
      // Search matches (case insensitive check on name, developer, description & category)
      const query = searchQuery.toLowerCase().trim();
      const searchMatch =
        !query ||
        app.name.toLowerCase().includes(query) ||
        app.developer.toLowerCase().includes(query) ||
        app.category.toLowerCase().includes(query) ||
        app.description.toLowerCase().includes(query);
      
      return categoryMatch && searchMatch;
    })
    .sort((a, b) => {
      // Sort configurations
      if (sortBy === 'downloads') {
        return b.downloadsCount - a.downloadsCount;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'newest') {
        return (b.createdAt || 0) - (a.createdAt || 0);
      }
      return 0;
    });

  // Pick first featured app for dashboard hero card banner layout
  const featuredApp = apps.find((a) => a.featured) || apps[0];

  return (
    <div className="min-h-screen bg-[#070b13] text-gray-150 flex flex-col font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-400">
      
      {/* Dynamic Toast Alerts System */}
      <Notification toasts={toasts} onDismiss={dismissToast} />

      {/* Primary Store Header and Search Controllers */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        isAdminOpen={isAdminOpen}
        setIsAdminOpen={setIsAdminOpen}
        sortBy={sortBy}
        setSortBy={setSortBy}
        appsCount={filteredApps.length}
      />

      {/* Full Screen Visual Downloader Overlays (Shows dynamic direct download countdowns) */}
      <AnimatePresence>
        {downloadingApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#04060b]/90 backdrop-blur-md z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="max-w-md w-full glassmorphism p-8 rounded-3xl border border-emerald-500/20 text-center space-y-6 shadow-2xl"
            >
              <div className="relative w-20 h-20 mx-auto rounded-3xl overflow-hidden shadow-2xl bg-slate-950">
                <img
                  src={downloadingApp.logoUrl}
                  alt={downloadingApp.name}
                  className="w-full h-full object-cover animate-pulse"
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs text-emerald-400 font-mono uppercase tracking-widest font-bold">
                  Establishing Safe Connection
                </p>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  Downloading {downloadingApp.name}
                </h3>
                <p className="text-gray-400 text-xs font-mono">
                  Fetching resources from secure verified source...
                </p>
              </div>

              {/* Progress Container bar */}
              <div className="space-y-2">
                <div className="w-full bg-slate-950 h-3.5 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-600 rounded-full"
                    style={{ width: `${downloadProgress[downloadingApp.id] || 0}%` }}
                    transition={{ ease: 'easeOut' }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] font-mono font-bold text-gray-500">
                  <span>TRANSFER SPEED: 8.5 MB/s</span>
                  <span className="text-emerald-400">{downloadProgress[downloadingApp.id] || 0}% SECURED</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-[11px] font-mono text-gray-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Signed & Verified installer
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN LAYOUT BODY WRAPPER */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-8">
        


        {/* UPPER SECTION: PREMIUM ADMIN UPLOAD PANEL */}
        {isAdminOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full max-w-4xl mx-auto space-y-6"
          >
            <AdminPanel
              onAddApp={handleAddApp}
              onClose={() => setIsAdminOpen(false)}
              showToast={showToast}
            />

            {/* Premium Instruction Accordion Banner */}
            <div className="rounded-2xl bg-white/5 p-5 border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-[11px] text-gray-400">
              <div className="space-y-1">
                <p className="text-gray-300 font-bold uppercase flex items-center gap-1.5 text-xs font-sans">
                  🎨 1. App Logo System
                </p>
                <p className="leading-relaxed">
                  आप ऐप का मुख्य आइकॉन सीधे ड्रैग-एंड-ड्रॉप कर सकते हैं या कस्टमाइज़्ड प्रीमियम प्रीसेट से चुन सकते हैं।
                </p>
              </div>
              <div className="space-y-1 md:border-l md:border-white/15 md:pl-4">
                <p className="text-gray-300 font-bold uppercase flex items-center gap-1.5 text-xs font-sans">
                  🔗 2. Direct Download Link
                </p>
                <p className="leading-relaxed">
                  वह वास्तविक URL प्रदान करें जिस पर क्लिक करने से इंस्टॉलर या पैकेज का सीधा सुरक्षित डाउनलोड प्रारंभ हो जाए।
                </p>
              </div>
              <div className="space-y-1 md:border-l md:border-white/15 md:pl-4">
                <p className="text-gray-300 font-bold uppercase flex items-center gap-1.5 text-xs font-sans">
                  🚀 3. Instant Live Indexing
                </p>
                <p className="leading-relaxed">
                  आपके सबमिट करते ही आपका ऐप स्टोर फीड में बिना किसी लोडिंग के तत्काल जुड़ जाएगा जिसे सीधे डाउनलोड किया जा सकेगा।
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* LOWER SECTION: APP STORE GRID AND CATALOG */}
        <div className="space-y-8 max-w-5xl mx-auto w-full">
          
          {/* HERO SECTION DESIGN (Featured highlight app banner layout) */}
          {featuredApp && !searchQuery && selectedCategory === 'All' && (
            <div 
              onClick={() => setSelectedApp(featuredApp)}
              className="relative overflow-hidden rounded-3xl glassmorphism p-6 sm:p-8 cursor-pointer group hover:border-emerald-500/20 transition-all duration-300"
            >
              {/* Visual grid decor details inside card */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-indigo-500/5 to-transparent pointer-events-none" />
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/15 transition-all duration-500" />
              
              <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  {/* Visual SQUIRCLE featured Logo app logo */}
                  <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-white/10 overflow-hidden shadow-2xl relative shrink-0">
                    <img
                      src={featuredApp.logoUrl}
                      alt={`${featuredApp.name} logo`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80`;
                      }}
                    />
                  </div>

                  <div className="space-y-1.5 max-w-md">
                    <div className="inline-flex items-center gap-1 bg-emerald-400/10 text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider border border-emerald-400/20">
                      <Sparkles className="w-3 h-3 animate-spin" /> EDITORS' CHOICE FEATURED
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none group-hover:text-emerald-450 transition-colors duration-300">
                      {featuredApp.name}
                    </h2>
                    <p className="text-gray-400 text-xs">
                      Publish by {featuredApp.developer} • Safe Install Verified
                    </p>
                  </div>
                </div>

                {/* Get featured choice button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadApp(featuredApp);
                  }}
                  className="flex justify-center items-center gap-2 px-5 py-3 rounded-2xl bg-white text-gray-950 font-bold text-xs shadow-xl shadow-white/5 hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Get Free Download</span>
                </button>
              </div>

              <p className="text-gray-400 text-sm mt-6 leading-relaxed line-clamp-2 max-w-3xl">
                {featuredApp.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-white/5 text-xs text-gray-500 font-mono">
                <span>Rating: <strong className="text-amber-400 font-bold">{featuredApp.rating.toFixed(1)} / 5.0</strong></span>
                <span>Filesize: <strong className="text-gray-300">{featuredApp.size}</strong></span>
                <span>Version: <strong className="text-gray-300">{featuredApp.version}</strong></span>
                <span className="flex items-center gap-1 ml-auto text-emerald-400">
                  See app description details <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
            </div>
          )}

          {/* APP GRID BOX CONTAINER */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                <Laptop className="w-5 h-5 text-emerald-400" />
                सभी उपलब्ध एप्लीकेशन ({filteredApps.length})
              </h3>
              <span className="text-xs text-gray-500 font-mono hidden sm:inline">
                Click on any card to view description notes and direct download channels.
              </span>
            </div>

            {filteredApps.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredApps.map((app, index) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
                  >
                    <AppCard
                      app={app}
                      onSelect={setSelectedApp}
                      onDownload={handleDownloadApp}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl bg-slate-950 p-12 text-center border border-white/5 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center mx-auto text-emerald-500">
                  <Laptop className="w-6 h-6" />
                </div>
                <h4 className="text-gray-300 font-bold text-base">स्टोर खाली है (Empty Shelf)</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  सभी डिफ़ॉल्ट ऐप्स सुरक्षा के साथ हटा दिए गए हैं। कृपया ऊपर दिए गए <strong>ऐड करें (Admin Upload Panel)</strong> से अपना मनपसंद ऐप, नाम, आइकॉन लिंक, सीधे डाउनलोड की लिंक व विवरण डालकर अपना स्वयं का कस्टम स्टोर चलाएं!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER SECTION */}
      <footer className="w-full border-t border-white/5 bg-slate-950 py-8 px-4 sm:px-6 mt-16 font-mono text-[11px] text-gray-650 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-semibold text-gray-500">
            © 2026 Premium App Store Core. Developed in complete design compliance.
          </p>
          <div className="flex gap-4 items-center">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> SSL SECURED
            </span>
            <span className="p-1 px-2.5 rounded bg-white/5 text-[10px] text-gray-400 border border-white/5">
              PERSISTENT REPOSITORY
            </span>
          </div>
        </div>
      </footer>

      {/* RICH DYNAMIC SPECIFICATIONS MODAL */}
      <AppDetailModal
        app={selectedApp}
        onClose={() => setSelectedApp(null)}
        onDownload={handleDownloadApp}
        onDelete={handleDeleteApp}
      />
    </div>
  );
}
