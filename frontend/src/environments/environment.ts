export const environment = {
  production: false,
  apiUrl: typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : '/api', // Use relative path for production (Netlify)
};
