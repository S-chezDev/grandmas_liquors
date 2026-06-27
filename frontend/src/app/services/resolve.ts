export function resolveApiPath(path: string): string {
  if (!path) return '';
  // If it's already an absolute URL, return it as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Retrieve base URL from Vite environment config
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  if (apiBaseUrl) {
    if (path.startsWith('/api') || path.startsWith('/uploads')) {
      return `${apiBaseUrl}${path}`;
    }
  }

  return path;
}
