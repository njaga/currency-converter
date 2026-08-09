export const SITE_NAME = 'Kiwango';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://kiwango.vercel.app').replace(/\/$/, '');
export const SOCIAL_IMAGE_PATH = '/og/kiwango-social-card.png';

export const absoluteUrl = (path = '/') => {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};
