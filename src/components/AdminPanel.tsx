/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Upload, Plus, AlertCircle, Sparkles, Check, Image as ImageIcon, Link as LinkIcon, Edit3, X, HelpCircle } from 'lucide-react';
import { AppItem, Category } from '../types';
import { CATEGORIES, PRESET_LOGOS } from '../data';

interface AdminPanelProps {
  onAddApp: (app: AppItem) => void;
  onClose?: () => void;
  showToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export default function AdminPanel({ onAddApp, onClose, showToast }: AdminPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth states
  const [isLogged, setIsLogged] = useState(() => {
    return localStorage.getItem('shubham_admin_session') === 'active';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Form states (keeping it ultra simple with smart pre-filled defaults)
  const [name, setName] = useState('');
  const [developer, setDeveloper] = useState('');
  const [category, setCategory] = useState<Category>('All');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [size, setSize] = useState('32 MB');
  const [version, setVersion] = useState('1.0.0');
  const [rating, setRating] = useState('4.8');
  const [description, setDescription] = useState('');
  
  // App logo state holds selected preset url, custom file base64
  const [logoUrl, setLogoUrl] = useState('');
  const [customLogoFile, setCustomLogoFile] = useState<File | null>(null);
  const [activeUploadTab, setActiveUploadTab] = useState<'upload' | 'preset' | 'link'>('preset');
  
  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);

  // Handle Admin Authorization
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'SHUBHAM YADAV' && password === 'shubham bhai') {
      setIsLogged(true);
      localStorage.setItem('shubham_admin_session', 'active');
      showToast('Admin login successful! Welcome SHUBHAM YADAV.', 'success');
    } else {
      showToast('Incorrect Username or Password!', 'error');
    }
  };

  const handleLogout = () => {
    setIsLogged(false);
    setUsername('');
    setPassword('');
    localStorage.removeItem('shubham_admin_session');
    showToast('Admin signed out.', 'info');
  };

  // Handle Drag Over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Handle Drag Leave
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Convert File to Base64 helper
  const processLogoFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image file (PNG/JPG)', 'error');
      return;
    }
    
    // Check size < 2MB for safe localStorage allocation
    if (file.size > 2 * 1024 * 1024) {
      showToast('Image size should be smaller than 2MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setLogoUrl(base64);
      setCustomLogoFile(file);
      showToast('Logo chosen successfully!', 'success');
    };
    reader.onerror = () => {
      showToast('Error reading image', 'error');
    };
    reader.readAsDataURL(file);
  };

  // Handle Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processLogoFile(files[0]);
    }
  };

  // Handle Manual File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processLogoFile(files[0]);
    }
  };

  // Trigger click on hidden file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation checks
    if (!name.trim()) {
      showToast('App Name acts mandatory!', 'error');
      return;
    }
    if (!downloadUrl.trim() || !downloadUrl.startsWith('http')) {
      showToast('Provide a valid link starting with http/https!', 'error');
      return;
    }
    if (!logoUrl) {
      showToast('Please specify an App Logo!', 'error');
      return;
    }
    if (!description.trim()) {
      showToast('App description text is required!', 'error');
      return;
    }

    const ratingsNum = parseFloat(rating) || 4.8;
    const finalRating = Math.max(1, Math.min(5, ratingsNum));

    // Combine into final App Item
    const newApp: AppItem = {
      id: `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`,
      name: name.trim(),
      category,
      developer: developer.trim() || 'Verified Independent Dev',
      downloads: '100+', 
      downloadsCount: 100,
      rating: finalRating,
      version: version.trim() || '1.0.0',
      logoUrl,
      description: description.trim(),
      downloadUrl: downloadUrl.trim(),
      size: size.trim() || '32 MB',
      isCustom: true,
      featured: true, // Auto flag as featured so they appear beautifully in the main banner list too!
      createdAt: Date.now(),
    };

    onAddApp(newApp);
    showToast(`"${name}" Added and Published Live!`, 'success');

    // Reset Form
    setName('');
    setDeveloper('');
    setCategory('All');
    setDownloadUrl('');
    setSize('32 MB');
    setVersion('1.0.0');
    setRating('4.8');
    setDescription('');
    setLogoUrl('');
    setCustomLogoFile(null);
  };

  // Authentication Guard Interface Setup
  if (!isLogged) {
    return (
      <div className="glassmorphism rounded-3xl p-6 relative overflow-hidden border border-emerald-500/10 shadow-2xl">
        <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="text-center space-y-2 mb-6 border-b border-white/5 pb-5">
          <span className="inline-flex p-2.5 rounded-full bg-emerald-500/10 text-emerald-400 mb-1">
            <Sparkles className="w-5 h-5" />
          </span>
          <h3 className="text-base font-extrabold text-white tracking-tight">Admin System Lock</h3>
          <p className="text-xs text-gray-400 font-mono">
            कृपया लॉगिन क्रेडेंशियल्स दर्ज करें।
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-gray-300 font-mono">
              USERNAME
            </label>
            <input
              type="text"
              required
              placeholder="SHUBHAM YADAV"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-slate-950 border border-white/10 hover:border-emerald-500/25 focus:border-emerald-500/80 text-xs text-white placeholder-gray-600 transition-all outline-none rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-gray-300 font-mono">
              PASSWORD
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-slate-950 border border-white/10 hover:border-emerald-500/25 focus:border-emerald-500/80 text-xs text-white placeholder-gray-600 transition-all outline-none rounded-xl"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 mt-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-gray-950 font-bold text-xs hover:scale-[1.01] transition-all cursor-pointer select-none active:scale-95"
          >
            Sign In Securely
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="glassmorphism rounded-3xl p-6 relative overflow-hidden border border-emerald-500/10 shadow-2xl">
      {/* Accent lighting highlights */}
      <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute right-4 top-4 font-mono text-[9px] text-emerald-500/40 flex items-center gap-1.5 select-none">
        <Sparkles className="w-3 h-3" /> Active: {username} • 
        <button onClick={handleLogout} className="text-red-400 hover:underline">Logout</button>
      </div>

      <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-4 mb-5">
        <div>
          <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Plus className="w-4.5 h-4.5" />
            </span>
            ऐप अपलोड पैनल (Admin)
          </h3>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Publish brand new applications directly to the store.
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-full bg-white/5 transition-colors sm:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* APP NAME AND DEVELOPER */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-300 font-mono">
              App Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Photoshop Mobile"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-white/10 hover:border-emerald-500/20 focus:border-emerald-500/80 focus:ring focus:ring-emerald-500/10 text-xs text-white placeholder-gray-650 transition-all outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-300 font-mono">
              Developer (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Adobe Inc."
              value={developer}
              onChange={(e) => setDeveloper(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-white/10 hover:border-emerald-500/20 focus:border-emerald-500/80 focus:ring focus:ring-emerald-500/10 text-xs text-white placeholder-gray-650 transition-all outline-none"
            />
          </div>
        </div>

        {/* SIZE & VERSION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-300 font-mono">
              File Size
            </label>
            <input
              type="text"
              placeholder="32 MB"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-white/10 hover:border-emerald-500/20 focus:border-emerald-500/80 text-xs text-white placeholder-gray-650 transition-all outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-300 font-mono">
              App Version
            </label>
            <input
              type="text"
              placeholder="1.0.0"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-white/10 hover:border-emerald-500/20 focus:border-emerald-500/80 text-xs text-white placeholder-gray-650 transition-all outline-none"
            />
          </div>
        </div>

        {/* LOGO SELECTION TAB CONTROL */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-300 font-mono">
            App Logo * (अपलोड, प्रीसेट या लिंक चुनें)
          </label>
          
          <div className="flex bg-slate-950 p-1 rounded-xl border border-white/5 gap-1">
            <button
              type="button"
              onClick={() => setActiveUploadTab('preset')}
              className={`flex-1 flex justify-center items-center gap-1.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                activeUploadTab === 'preset'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" /> Premium Presets
            </button>
            <button
              type="button"
              onClick={() => setActiveUploadTab('upload')}
              className={`flex-1 flex justify-center items-center gap-1.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                activeUploadTab === 'upload'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" /> Direct Upload
            </button>
            <button
              type="button"
              onClick={() => setActiveUploadTab('link')}
              className={`flex-1 flex justify-center items-center gap-1.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                activeUploadTab === 'link'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" /> Image Link
            </button>
          </div>

          {/* TAB 1: PREMIUM PRESET ASSETS (Default highly reliable choice) */}
          {activeUploadTab === 'preset' && (
            <div className="bg-slate-950 p-3 rounded-2xl border border-white/5">
              <div className="grid grid-cols-4 gap-2">
                {PRESET_LOGOS.map((logo) => {
                  const isSelected = logoUrl === logo.url;
                  return (
                    <button
                      key={logo.name}
                      type="button"
                      onClick={() => {
                        setLogoUrl(logo.url);
                        setCustomLogoFile(null);
                        showToast(`Logo Preset Selected: ${logo.name}`, 'info');
                      }}
                      className={`relative aspect-square rounded-xl overflow-hidden bg-slate-900 border transition-all ${
                        isSelected
                          ? 'border-emerald-500 scale-95 ring-2 ring-emerald-500/15'
                          : 'border-white/5 hover:border-white/20'
                      }`}
                    >
                      <img src={logo.url} alt={logo.name} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-emerald-950/70 flex items-center justify-center">
                          <Check className="w-5 h-5 text-emerald-400 animate-bounce" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: DIRECT FILE UPLOAD */}
          {activeUploadTab === 'upload' && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              className={`relative border border-dashed rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-500/5'
                  : logoUrl && customLogoFile
                  ? 'border-emerald-500/40 bg-emerald-500/5'
                  : 'border-white/10 hover:border-emerald-500/30 bg-slate-950 hover:bg-white/5'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {logoUrl && customLogoFile ? (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 bg-slate-900 shrink-0">
                    <img src={logoUrl} alt="custom upload" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-gray-250 text-xs font-semibold truncate max-w-[170px]">
                      {customLogoFile.name}
                    </p>
                    <p className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-mono">
                      <Check className="w-3 h-3" /> Ready
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-emerald-400 mb-1" />
                  <p className="text-xs font-bold text-gray-250 text-center">
                    Drag logo here or <span className="text-emerald-400">browse</span>
                  </p>
                </>
              )}
            </div>
          )}

          {/* TAB 3: IMAGE LINK URL */}
          {activeUploadTab === 'link' && (
            <div className="space-y-2">
              <input
                type="url"
                placeholder="Paste Image web HTTPS link..."
                value={logoUrl.startsWith('data:') ? '' : logoUrl}
                onChange={(e) => {
                  setLogoUrl(e.target.value);
                  setCustomLogoFile(null);
                }}
                className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-white/10 focus:border-emerald-500 text-xs text-white placeholder-gray-600 transition-all outline-none font-mono"
              />
              {logoUrl && !logoUrl.startsWith('data:') && (
                <div className="flex gap-2 items-center bg-slate-950 p-2 rounded-xl border border-white/5">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/5 bg-slate-900 shrink-0">
                    <img
                      src={logoUrl}
                      alt="Logo Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 truncate font-mono">
                    Exterior link assigned.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* DIRECT DOWNLOAD URL */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-300 font-mono">
            Direct Download Link * (डाउनलोड लिंक)
          </label>
          <div className="relative">
            <input
              type="url"
              required
              placeholder="e.g. https://domain.com/app.exe"
              value={downloadUrl}
              onChange={(e) => {
                setDownloadUrl(e.target.value);
              }}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-white/10 hover:border-emerald-500/20 focus:border-emerald-500/80 text-xs text-white placeholder-gray-600 font-mono transition-all outline-none"
            />
            <LinkIcon className="absolute left-3 top-3 w-3.5 h-3.5 text-gray-500" />
          </div>
        </div>

        {/* DESCRIPTION FIELD */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-300 font-mono font-bold">
            App Descriptions * (ऐप विवरण)
          </label>
          <textarea
            required
            rows={2}
            placeholder="Introduction, features list, version changes, utility guide etc..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-white/10 hover:border-emerald-500/20 focus:border-emerald-500/80 text-xs text-white placeholder-gray-650 transition-all outline-none resize-none"
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-gray-950 font-extrabold text-xs shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer select-none"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>ऐड करें (Publish Live)</span>
        </button>
      </form>
    </div>
  );
}
