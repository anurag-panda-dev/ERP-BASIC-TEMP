import axios from 'axios';

// ── Axios Instance ─────────────────────────────────────────
// Uses Vite proxy → all /api requests go to http://localhost:5000
const api = axios.create({
  baseURL: '/',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor: Inject Clerk token ────────────────
// The token injector is set up externally (in AuthContext) via:
//   api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
// This keeps the axios instance decoupled from React context.

// ── Response Interceptor: Normalize errors ─────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';

    const status = error.response?.status;

    // 401 handled by AuthContext (Clerk manages session)
    return Promise.reject({
      message,
      status,
      data: error.response?.data,
      originalError: error,
    });
  }
);

export default api;
