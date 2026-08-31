// Authentication state management for HydraSense

const TOKEN_KEY = "hydrasense_access_token";
const ROLE_KEY = "hydrasense_role";
const USER_KEY = "hydrasense_user";

export type UserRole = "PRODUCT_USER" | "AUTHORITY";

export interface AuthUser {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
}

/**
 * Save authentication data to sessionStorage
 */
export function saveAuth(token: string, role: UserRole, user: AuthUser): void {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(ROLE_KEY, role);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Get JWT token from sessionStorage
 */
export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

/**
 * Get user role from sessionStorage
 */
export function getRole(): UserRole | null {
  const role = sessionStorage.getItem(ROLE_KEY);
  return role as UserRole | null;
}

/**
 * Get user info from sessionStorage
 */
export function getUser(): AuthUser | null {
  const user = sessionStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}

/**
 * Check if user has a specific role
 */
export function hasRole(role: UserRole): boolean {
  return getRole() === role;
}

/**
 * Check if user is product user
 */
export function isProductUser(): boolean {
  return getRole() === "PRODUCT_USER";
}

/**
 * Check if user is authority
 */
export function isAuthority(): boolean {
  return getRole() === "AUTHORITY";
}

/**
 * Clear authentication data from sessionStorage
 */
export function clearAuth(): void {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(ROLE_KEY);
  sessionStorage.removeItem(USER_KEY);
}
