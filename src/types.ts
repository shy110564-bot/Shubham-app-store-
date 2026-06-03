/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AppItem {
  id: string;
  name: string;
  category: string;
  developer: string;
  downloads: string;
  downloadsCount: number; // For sorting
  rating: number;
  version: string;
  logoUrl: string;
  description: string;
  downloadUrl: string;
  size: string;
  featured?: boolean;
  isCustom?: boolean;
  createdAt?: number;
}

export type Category = 'All';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}
