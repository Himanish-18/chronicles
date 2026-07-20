export const APP_NAME = 'Chronicles';

export const CATEGORIES = [
  { id: '1', name: 'Technology', slug: 'technology', color: '#7c3aed' },
  { id: '2', name: 'Design', slug: 'design', color: '#ec4899' },
  { id: '3', name: 'DevOps', slug: 'devops', color: '#06b6d4' },
  { id: '4', name: 'AI & ML', slug: 'ai-ml', color: '#f59e0b' },
  { id: '5', name: 'Web Dev', slug: 'web-dev', color: '#10b981' },
  { id: '6', name: 'Cloud', slug: 'cloud', color: '#3b82f6' },
] as const;

export const NAV_LINKS = [
  { label: 'Explore', href: '/blogs' },
  { label: 'Categories', href: '/categories' },
  { label: 'Trending', href: '/trending' },
  { label: 'About', href: '/about' },
] as const;

export const DASHBOARD_NAV = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'My Blogs', href: '/dashboard/blogs', icon: 'FileText' },
  { label: 'Create New', href: '/dashboard/create', icon: 'PenSquare' },
  { label: 'Bookmarks', href: '/dashboard/bookmarks', icon: 'Bookmark' },
] as const;

export const DASHBOARD_NAV_BOTTOM = [
  { label: 'Settings', href: '/dashboard/settings', icon: 'Settings' },
  { label: 'Profile', href: '/dashboard/profile', icon: 'User' },
] as const;

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const PAGINATION_LIMIT = 9;
