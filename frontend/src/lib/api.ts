export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function getHeaders(token?: string | null): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const actualToken = token || (typeof window !== 'undefined' ? localStorage.getItem('spotify_token') : null);
  if (actualToken) {
    headers['Authorization'] = `Bearer ${actualToken}`;
  }
  return headers;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: (() => { const h = { ...getHeaders(token), ...(options.headers || {}) }; if (options.body instanceof FormData) delete (h as any)['Content-Type']; return h; })(),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

// Auth
export const authApi = {
  register: (data: { email: string; username: string; password: string }) =>
    request<{ user: any; accessToken: string }>('/auth/register', {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),
  login: (data: { email: string; password: string }) =>
    request<{ user: any; accessToken: string }>('/auth/login', {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),
  me: (token: string) =>
    request<any>('/auth/me', {}, token),
};

// Songs
export const songsApi = {
  getAll: (limit?: number) =>
    request<any[]>(`/songs${limit ? `?limit=${limit}` : ''}`),
  getOne: (id: string) =>
    request<any>(`/songs/${id}`),
};

// Albums
export const albumsApi = {
  getAll: (limit?: number) =>
    request<any[]>(`/albums${limit ? `?limit=${limit}` : ''}`),
  getOne: (id: string) =>
    request<any>(`/albums/${id}`),
};

// Artists
export const artistsApi = {
  getAll: (limit?: number) =>
    request<any[]>(`/artists${limit ? `?limit=${limit}` : ''}`),
  getOne: (id: string) =>
    request<any>(`/artists/${id}`),
};

// Playlists
export const playlistsApi = {
  getAll: (token: string) =>
    request<any[]>('/playlists', {}, token),
  getOne: (id: string) =>
    request<any>(`/playlists/${id}`),
  create: (token: string, data: { name: string }) =>
    request<any>('/playlists', {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    }, token),
  addSong: (token: string, playlistId: string, songId: string) =>
    request<any>(`/playlists/${playlistId}/songs`, {
      method: 'POST',
      body: JSON.stringify({ songId }),
    }, token),
  removeSong: (token: string, playlistId: string, songId: string) =>
    request<any>(`/playlists/${playlistId}/songs/${songId}`, {
      method: 'DELETE',
    }, token),
  delete: (token: string, id: string) =>
    request<any>(`/playlists/${id}`, {
      method: 'DELETE',
    }, token),
};

// Search
export const searchApi = {
  search: (query: string) =>
    request<{ songs: any[]; albums: any[]; artists: any[] }>(`/search?q=${encodeURIComponent(query)}`),
};

// Liked Songs
export const likedSongsApi = {
  getAll: (token: string) =>
    request<any[]>('/liked-songs', {}, token),
  like: (token: string, songId: string) =>
    request<any>(`/liked-songs/${songId}`, { method: 'POST' }, token),
  unlike: (token: string, songId: string) =>
    request<any>(`/liked-songs/${songId}`, { method: 'DELETE' }, token),
};

// Admin
export const adminApi = {
  getUsers: (token: string) =>
    request<any[]>('/admin/users', {}, token),
  deleteUser: (id: string, token: string) =>
    request<{ message: string }>(`/admin/users/${id}`, { method: 'DELETE' }, token),
  updateUserStatus: (id: string, isActive: boolean, token: string) =>
    request<any>(`/admin/users/${id}/status`, { method: 'PUT', body: JSON.stringify({ isActive }) }, token),
  updateUserRoles: (id: string, roles: string[], token: string) =>
    request<any>(`/admin/users/${id}/roles`, { method: 'PUT', body: JSON.stringify({ roles }) }, token),
  getRoles: (token: string) =>
    request<any[]>('/admin/roles', {}, token),
  createSong: (data: any, token: string) =>
    request<any>('/admin/songs', { method: 'POST', body: data instanceof FormData ? data : JSON.stringify(data) }, token),
  updateSong: (id: string, data: any, token: string) =>
    request<any>(`/admin/songs/${id}`, { method: 'PUT', body: data instanceof FormData ? data : JSON.stringify(data) }, token),
  deleteSong: (id: string, token: string) =>
    request<{ message: string }>(`/admin/songs/${id}`, { method: 'DELETE' }, token),
};
