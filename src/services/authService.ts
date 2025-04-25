import axios from "axios";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = "https://ican-api-6000e8d06d3a.herokuapp.com/api";
const ACCESS_TOKEN_COOKIE = 'accessToken';
const USER_DATA_COOKIE = 'user_data';
const DEBUG = true;

export interface User {
    id: string;
    firstname: string;
    surname: string;
    email: string;
    role?: string;
    membershipId?: string;
}

interface JwtPayload {
    sub: string;
    email: string;
    firstname: string;
    surname: string;
    role: string;
    exp: number;
}

// Access token cookie should live longer than the token itself
// to retain the expired token for refresh purposes
const tokenCookieOptions = {
    maxAge: 30 * 60, // 30 minutes - longer than token lifespan
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false,
    sameSite: 'lax' as const
};

// User data can live much longer
const userDataCookieOptions = {
    maxAge: 24 * 60 * 60, // 1 day
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false,
    sameSite: 'lax' as const
};

export const debug = (message: string, data?: any) => {
    if (DEBUG) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            message: `[AuthService] ${message}`,
            data: data || '',
        };

        // Log to the console instead of storing in localStorage
        console.log(logEntry.message, logEntry.data);
    }
};

// Remove functions that interact with localStorage
export const getDebugLogs = () => {
    console.warn("Debug logs retrieval is disabled because localStorage is not used.");
    return [];
};

export const clearDebugLogs = () => {
    console.warn("Debug logs clearing is disabled because localStorage is not used.");
};

let refreshPromise: Promise<boolean> | null = null;

export const isTokenExpired = (token: string, bufferSeconds = 300): boolean => {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        const expiresAt = decoded.exp;
        const currentTime = Date.now() / 1000;
        const timeLeft = expiresAt - currentTime;

        debug('Token expiration check', {
            expiresAt: new Date(expiresAt * 1000).toLocaleString(),
            currentTime: new Date(currentTime * 1000).toLocaleString(),
            timeLeftSeconds: timeLeft,
            isExpired: timeLeft < bufferSeconds
        });

        return timeLeft < bufferSeconds;
    } catch (error) {
        debug("Error checking token expiration:", error);
        return true;
    }
};

export const getToken = (): string | null => {
    const cookies = parseCookies();
    return cookies[ACCESS_TOKEN_COOKIE] || null;
};

export const getCurrentUser = (): User | null => {
    try {
        const cookies = parseCookies();
        const userData = cookies[USER_DATA_COOKIE];
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        debug("Error parsing user data:", error);
        return null;
    }
};

const updateAuthCookies = (accessToken: string): void => {
    try {
        setCookie(null, ACCESS_TOKEN_COOKIE, accessToken, tokenCookieOptions);

        const decoded = jwtDecode<JwtPayload>(accessToken);
        const userData: User = {
            id: decoded.sub,
            email: decoded.email,
            firstname: decoded.firstname,
            surname: decoded.surname,
            role: decoded.role
        };

        // Use longer-lived cookie for user data
        setCookie(null, USER_DATA_COOKIE, JSON.stringify(userData), userDataCookieOptions);
        debug('Auth cookies updated successfully', { 
            tokenExpiry: new Date((decoded.exp * 1000)).toLocaleString() 
        });
    } catch (error) {
        debug("Failed to update auth cookies:", error);
        throw error;
    }
};

// Modified to handle token refresh more robustly
export const refreshTokens = async (): Promise<boolean> => {
    debug('Refresh tokens requested');

    if (refreshPromise) {
        debug('Using existing refresh promise');
        return refreshPromise;
    }

    refreshPromise = (async () => {
        try {
            debug('Starting token refresh');
            
            // Log cookie state for debugging
            debug('Cookies before refresh:', parseCookies());
            
            const response = await axios({
                method: 'PATCH',  // Keep this as PATCH if that's what your API expects
                url: `${API_BASE_URL}/auth/refresh`,
                withCredentials: true, // Crucial for sending cookies with the request
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            debug('Refresh response received', {
                status: response.status,
                hasAccessToken: !!response.data.accessToken || !!response.data.access_token
            });

            const accessToken = response.data.accessToken || response.data.access_token;

            if (!accessToken) {
                debug('No access token in refresh response');
                return false;
            }

            updateAuthCookies(accessToken);
            return true;
        } catch (error:any) {
            debug('Token refresh failed:', error);
            
            // Log more details about the error for debugging
            if (error.response) {
                debug('Error response data:', error.response.data);
                debug('Error response status:', error.response.status);
                debug('Error response headers:', error.response.headers);
            } else if (error.request) {
                debug('No response received:', error.request);
            }
            
            if (error.message && error.message.includes('ERR_NETWORK_CHANGED')) {
                alert("Network connection was lost. Please check your internet and log in again.");
            }
            return false;
        } finally {
            refreshPromise = null;
        }
    })();

    return refreshPromise;
};

// Modified to get a fresh token immediately after login
export const login = async (email: string, password: string): Promise<User> => {
    try {
        debug('Login attempt for:', email);
        const response = await axios.post(
            `${API_BASE_URL}/auth/login`,
            { email, password },
            { withCredentials: true }
        );

        debug('Login response received', {
            status: response.status,
            hasToken: !!response.data.access_token || !!response.data.accessToken
        });

        const accessToken = response.data.accessToken || response.data.access_token;

        if (!accessToken) {
            throw new Error("No access token received");
        }

        // Store the initial access token
        updateAuthCookies(accessToken);
        
        // Immediately refresh to get a fresh token with full lifespan
        debug('Immediately refreshing token after login for maximum lifespan');
        const refreshed = await refreshTokens();
        
        if (!refreshed) {
            debug('Initial token refresh failed, but continuing with original token');
        } else {
            debug('Successfully obtained fresh token after login');
        }
        
        return getCurrentUser() as User;
    } catch (error) {
        debug('Login failed:', error);
        throw error;
    }
};

// Try to get a completely fresh token regardless of current state
export const getFreshAccessToken = async (): Promise<string | null> => {
    try {
        debug('Explicitly requesting fresh access token');
        const response = await axios({
            method: 'PATCH',
            url: `${API_BASE_URL}/auth/refresh`,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const accessToken = response.data.accessToken || response.data.access_token;

        if (!accessToken) {
            debug('No fresh access token received');
            return null;
        }

        updateAuthCookies(accessToken);
        debug('Fresh access token obtained successfully');
        return accessToken;
    } catch (error) {
        debug('Failed to get fresh access token:', error);
        return null;
    }
};

export const logout = async (): Promise<void> => {
    try {
        debug('Attempting logout');
        await axios.post(
            `${API_BASE_URL}/auth/logout`,
            {},
            { withCredentials: true }
        );
        debug('Logout API call succeeded');
    } catch (error) {
        debug('Logout API call failed:', error);
    } finally {
        destroyCookie(null, ACCESS_TOKEN_COOKIE, { path: '/' });
        destroyCookie(null, USER_DATA_COOKIE, { path: '/' });
        debug('Local auth cookies cleared');
    }
};

export const createAuthenticatedAxios = () => {
    const instance = axios.create({
        baseURL: API_BASE_URL,
        withCredentials: true, // Always send cookies with requests
    });

    instance.interceptors.request.use(
        async (config) => {
            let token = getToken();
            
            // Proactively check if token will expire soon and refresh if needed
            if (token && isTokenExpired(token)) {
                debug('Token expired or expiring soon, refreshing before request');
                const refreshed = await refreshTokens();
                if (refreshed) {
                    token = getToken(); 
                    debug('Successfully refreshed token for request');
                } else {
                    debug('Failed to refresh token for request');
                }
            }
            
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                debug('Added token to request headers');
            } else {
                debug('No token available for request headers');
            }
            return config;
        },
        (error) => {
            debug('Request interceptor error:', error);
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            debug('Response error intercepted', { 
                status: error.response?.status,
                url: originalRequest?.url
            });

            // Handle 401 errors by refreshing the token
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                debug('Received 401, attempting token refresh');

                try {
                    const refreshed = await refreshTokens();

                    if (refreshed) {
                        const newToken = getToken();
                        if (newToken) {
                            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                            debug('Retrying original request with new token');
                            return instance(originalRequest);
                        }
                    } else {
                        // If refresh failed, clear cookies and force logout
                        debug('Refresh failed after 401, forcing logout');
                        destroyCookie(null, ACCESS_TOKEN_COOKIE, { path: '/' });
                        destroyCookie(null, USER_DATA_COOKIE, { path: '/' });
                        
                        // Store a flag in localStorage before redirecting
                        localStorage.setItem('auth_failed', 'true');
                        localStorage.setItem('last_auth_error_time', new Date().toISOString());
                        
                        // Optionally redirect to login page
                        if (typeof window !== 'undefined') {
                            // Allow user to view logs before redirect if needed
                            const shouldRedirect = confirm('Authentication failed. Would you like to go to the login page now?');
                            if (shouldRedirect) {
                                window.location.href = '/login';
                            }
                        }
                    }
                } catch (refreshError) {
                    debug("Error during token refresh:", refreshError);
                }
            }

            return Promise.reject(error);
        }
    );

    return instance;
};

export const authAxios = createAuthenticatedAxios();

// Modified to always attempt a refresh when checking auth status
export const checkAuthStatus = async (): Promise<boolean> => {
    const token = getToken();
    debug('Checking auth status', { hasToken: !!token });
    
    if (!token) return false;
    
    // Always refresh when checking auth status to ensure maximum token lifespan
    return await refreshTokens();
};

// Remove localStorage usage in showDebugLogsModal
export const showDebugLogsModal = () => {
    console.warn("Debug logs modal is disabled because localStorage is not used.");
};

const authService = {
    login,
    logout,
    refreshTokens,
    getToken,
    getCurrentUser,
    isTokenExpired,
    authAxios,
    checkAuthStatus,
    debug,
    getDebugLogs,
    clearDebugLogs,
    getFreshAccessToken,
    showDebugLogsModal,
};

export default authService;