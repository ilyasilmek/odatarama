// Helper to resolve API endpoint whether running locally, on AI Studio, or deployed on GitHub Pages
export function getApiUrl(endpoint: string): string {
  // If user configured a custom backend URL in localStorage (useful when frontend is hosted on GitHub Pages)
  const customBackendUrl = typeof window !== 'undefined' ? localStorage.getItem('declutter_backend_url') : null;
  const envApiUrl = typeof import.meta !== 'undefined' && (import.meta as any).env ? (import.meta as any).env.VITE_API_URL : '';
  const baseUrl = (envApiUrl || customBackendUrl || '').replace(/\/+$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  return baseUrl ? `${baseUrl}${cleanEndpoint}` : cleanEndpoint;
}
