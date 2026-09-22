import { useEffect, useState, useCallback } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'library'; categoryId?: string }
  | { name: 'device'; deviceId: string }
  | { name: 'lab'; deviceId: string }
  | { name: 'dashboard' }
  | { name: 'ai-assistant' }
  | { name: 'careers' };

function parseHash(): Route {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  const parts = hash.split('/').filter(Boolean);

  if (parts.length === 0) return { name: 'home' };
  if (parts[0] === 'library') {
    if (parts.length >= 2) return { name: 'library', categoryId: parts[1] };
    return { name: 'library' };
  }
  if (parts[0] === 'device' && parts[1]) return { name: 'device', deviceId: parts[1] };
  if (parts[0] === 'lab' && parts[1]) return { name: 'lab', deviceId: parts[1] };
  if (parts[0] === 'dashboard') return { name: 'dashboard' };
  if (parts[0] === 'ai-assistant') return { name: 'ai-assistant' };
  if (parts[0] === 'careers') return { name: 'careers' };
  return { name: 'home' };
}

export function useRouter() {
  const [route, setRoute] = useState<Route>(parseHash());

  useEffect(() => {
    const handler = () => {
      setRoute(parseHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const navigate = useCallback((path: string) => {
    window.location.hash = path;
  }, []);

  return { route, navigate };
}

export function navigate(path: string) {
  window.location.hash = path;
}
