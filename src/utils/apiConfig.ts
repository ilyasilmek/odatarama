// Helper to resolve API endpoint whether running locally, on AI Studio, or deployed on GitHub Pages

export const DEFAULT_CLOUD_RUN_BACKEND = "https://ais-pre-wzplpyycwkb24cchnfawsk-598933815767.europe-west2.run.app";

export function isGitHubPages(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.hostname.includes('github.io');
}

export function getBackendBaseUrl(): string {
  if (typeof window === 'undefined') return '';
  const customUrl = localStorage.getItem('declutter_backend_url');
  if (customUrl) return customUrl.replace(/\/+$/, '');

  const envUrl = typeof import.meta !== 'undefined' && (import.meta as any).env ? (import.meta as any).env.VITE_API_URL : '';
  if (envUrl) return envUrl.replace(/\/+$/, '');

  // When hosted on GitHub Pages, the backend is not on github.io, so route to Cloud Run AI backend
  if (isGitHubPages()) {
    return DEFAULT_CLOUD_RUN_BACKEND;
  }

  return '';
}

export function setCustomBackendUrl(url: string | null): void {
  if (typeof window === 'undefined') return;
  if (!url) {
    localStorage.removeItem('declutter_backend_url');
  } else {
    localStorage.setItem('declutter_backend_url', url.trim());
  }
}

export function getApiUrl(endpoint: string): string {
  const base = getBackendBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return base ? `${base}${cleanEndpoint}` : cleanEndpoint;
}
