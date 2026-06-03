/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface NotificationProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function Notification({ toasts, onDismiss }: NotificationProps) {
  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 w-80 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl glassmorphism shadow-2xl overflow-hidden border-l-4 relative"
              style={{
                borderLeftColor: isSuccess ? '#10b981' : isError ? '#ef4444' : '#3b82f6',
              }}
            >
              {isSuccess && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
              {isError && <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />}

              <div className="flex-1 pr-6">
                <p className="text-xs text-gray-400 font-mono tracking-wider uppercase mb-0.5">
                  {toast.type}
                </p>
                <p className="text-sm text-gray-200 font-medium">
                  {toast.text}
                </p>
              </div>

              <button
                onClick={() => onDismiss(toast.id)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
