export const formatImageUrl = (url, apiUrl) => {
  if (!url) return 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600'; // Fallback
  if (url.startsWith('http')) return url;
  
  // Ensure apiUrl doesn't have trailing slash and url has leading slash
  const cleanApiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  
  return `${cleanApiUrl}${cleanPath}`;
};
