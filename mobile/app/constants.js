// API Configuration for Mobile App — set EXPO_PUBLIC_API_URL (e.g. https://your-domain.com/api)

function normalizeApiRoot(url) {
  return url.replace(/\/$/, '');
}

/**
 * @returns {string | null}
 */
export function getApiRoot() {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv && String(fromEnv).trim()) {
    return normalizeApiRoot(String(fromEnv).trim());
  }
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    return 'http://localhost:3000/api';
  }
  return null;
}

/**
 * Base URL for /api/mobile/v1/* routes.
 * @returns {string}
 */
export function getMobileV1Base() {
  const root = getApiRoot();
  if (!root) {
    throw new Error(
      'Set EXPO_PUBLIC_API_URL to your API root including /api (e.g. https://your-domain.com/api)'
    );
  }
  return `${root}/mobile/v1`;
}

/** Resolved API root; empty string in production if EXPO_PUBLIC_API_URL is missing. */
export const API_BASE_URL = getApiRoot() || '';

export const APP_CONFIG = {
  // API endpoints (prefer getMobileV1Base() for driver/employee native flows)
  endpoints: {
    auth: `${API_BASE_URL}/mobile/v1/auth/login`,
    drivers: `${API_BASE_URL}/drivers`,
    trips: `${API_BASE_URL}/trips`,
    employees: `${API_BASE_URL}/employees`,
  },
  
  // App settings
  app: {
    name: 'Fleet Flows',
    version: '1.0.0',
    supportEmail: 'support@fleetflows.com',
  },
  
  // Map settings
  maps: {
    defaultZoom: 15,
    maxZoom: 20,
    minZoom: 5,
  },
};
