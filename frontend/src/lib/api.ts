// API Client for HydraSense Backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

export interface ApiError {
  detail?: string;
  message?: string;
  statusCode?: number;
}

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * Generic fetch wrapper for API calls
 */
async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      const error: ApiError = {
        detail: data.detail || data.message || "Unknown error",
        statusCode: response.status,
      };
      throw error;
    }

    return data as T;
  } catch (error) {
    if (error instanceof TypeError) {
      throw { detail: "Network error - unable to reach server" };
    }
    throw error;
  }
}

/**
 * GET request without authentication
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
  return fetchApi<T>(endpoint, { method: "GET" });
}

/**
 * POST request without authentication
 */
export async function apiPost<T>(
  endpoint: string,
  body?: unknown
): Promise<T> {
  return fetchApi<T>(endpoint, {
    method: "POST",
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

/**
 * GET request with JWT authentication
 */
export async function apiGetAuth<T>(
  endpoint: string,
  token: string
): Promise<T> {
  return fetchApi<T>(endpoint, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

/**
 * POST request with JWT authentication
 */
export async function apiPostAuth<T>(
  endpoint: string,
  body: unknown,
  token: string
): Promise<T> {
  return fetchApi<T>(endpoint, {
    method: "POST",
    body: body !== undefined ? JSON.stringify(body) : undefined,
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ============= API Response Types =============

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: "PRODUCT_USER" | "AUTHORITY";
  is_active: boolean;
  created_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  role: "PRODUCT_USER" | "AUTHORITY";
  user: User;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  role?: "PRODUCT_USER" | "AUTHORITY";
  product_code?: string;
}

export interface ProductDevice {
  id: number;
  product_code: string;
  device_id: string;
  device_type: string;
  status: string;
  owner_id?: number;
  activated_at?: string;
  created_at: string;
}

export interface WaterSourceResponse {
  id: number;
  source_code: string;
  name: string;
  source_type: string;
  description?: string;
  created_at: string;
}

export interface MonitoringStation {
  id: number;
  station_code: string;
  water_source_id: number;
  station_name: string;
  zone: string;
  location: string;
  latitude: number;
  longitude: number;
  public_warning: string;
  public_message: string;
  is_active: boolean;
  created_at: string;
  water_source: WaterSourceResponse;
}

// Public API (no auth required)
export const publicApi = {
  getStationByCode: (stationCode: string) =>
    apiGet<MonitoringStation>(`/public/stations/${stationCode}`),
};

// Auth API (no auth required)
export const authApi = {
  login: (email: string, password: string) =>
    apiPost<LoginResponse>("/auth/login", { email, password }),

  register: (data: RegisterRequest) =>
    apiPost<User>("/auth/register", data),
};

// Product User API (requires PRODUCT_USER JWT)
export const productApi = {
  getProfile: (token: string) =>
    apiGetAuth<User>("/product/me", token),

  getDevices: (token: string) =>
    apiGetAuth<ProductDevice[]>("/product/devices", token),
};

// Authority API (requires AUTHORITY JWT)
export const authorityApi = {
  getProfile: (token: string) =>
    apiGetAuth<User>("/authority/me", token),

  getAllStations: (token: string) =>
    apiGetAuth<MonitoringStation[]>("/authority/stations", token),
};
