import axios from "axios";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = "https://ican-api-6000e8d06d3a.herokuapp.com/api";
const ACCESS_TOKEN_COOKIE = 'accessToken';
const REFRESH_TOKEN_COOKIE = 'refreshToken'; // Added cookie name for refresh token
const USER_DATA_COOKIE = 'user_data';
const DEBUG = true;

export interface User {
    id: string;
    firstname: string;
    surname: string;
    email: string;
    role?: string;
    phone?: string;
    membershipId?: string;
}

interface JwtPayload {
    sub: string;
    email: string;
    firstname: string;
    surname: string;
    role: string;
    phone: string;
    exp: number;
}

// Access token cookie settings
const tokenCookieOptions = {
    maxAge: 30 * 60, // 30 minutes
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false,
    sameSite: 'lax' as const
};

// Refresh token should live longer
const refreshTokenCookieOptions = {
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false, // Set to false so JS can access it
    sameSite: 'lax' as const
};

// User data cookie settings
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
        console.log(logEntry.message, logEntry.data);
    }
};

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

export const getRefreshToken = (): string | null => {
    const cookies = parseCookies();
    return cookies[REFRESH_TOKEN_COOKIE] || null;
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

const updateAuthCookies = (accessToken: string, refreshToken?: string): void => {
    try {
        setCookie(null, ACCESS_TOKEN_COOKIE, accessToken, tokenCookieOptions);

        // Only update refresh token if provided
        if (refreshToken) {
            setCookie(null, REFRESH_TOKEN_COOKIE, refreshToken, refreshTokenCookieOptions);
            debug('Refresh token updated');
        }

        const decoded = jwtDecode<JwtPayload>(accessToken);
        const userData: User = {
            id: decoded.sub,
            email: decoded.email,
            firstname: decoded.firstname,
            surname: decoded.surname,
            phone: decoded.phone,
            role: decoded.role,
        };

        setCookie(null, USER_DATA_COOKIE, JSON.stringify(userData), userDataCookieOptions);
        debug('Auth cookies updated successfully', {
            tokenExpiry: new Date(decoded.exp * 1000).toLocaleString(),
            hasRefreshToken: !!refreshToken,
        });
    } catch (error) {
        debug('Failed to update auth cookies:', error);
        throw error;
    }
};

export const refreshTokens = async (): Promise<boolean> => {
    debug('Refreshing tokens using refresh token from cookies');

    try {
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
            debug('No refresh token available');
            return false;
        }

        // Replace the access token with the refresh token
        updateAuthCookies(refreshToken);

        debug('Access token replaced with refresh token');
        return true;
    } catch (error) {
        debug('Failed to refresh tokens:', error);
        return false;
    }
};

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
            hasAccessToken: !!response.data.access_token,
            hasRefreshToken: !!response.data.refresh_token,
        });

        const accessToken = response.data.access_token;
        const refreshToken = response.data.refresh_token;

        if (!accessToken || !refreshToken) {
            throw new Error("Access token or refresh token missing in login response");
        }

        // Store both access and refresh tokens
        updateAuthCookies(accessToken, refreshToken);

        // Merge user data from token and response
        const decoded = jwtDecode<JwtPayload>(accessToken);
        const userData: User = {
            id: decoded.sub,
            email: decoded.email,
            firstname: decoded.firstname,
            surname: decoded.surname,
            role: decoded.role,
            phone: decoded.phone,
            membershipId: response.data.user?.membershipId,
        };

        setCookie(null, USER_DATA_COOKIE, JSON.stringify(userData), userDataCookieOptions);

        return userData;
    } catch (error) {
        debug('Login failed:', error);
        throw error;
    }
};

export const getFreshAccessToken = async (): Promise<string | null> => {
    try {
        debug('Explicitly requesting fresh access token');
        const refreshed = await refreshTokens();
        if (refreshed) {
            const token = getToken();
            debug('Fresh access token obtained successfully');
            return token;
        }
        return null;
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
        destroyCookie(null, REFRESH_TOKEN_COOKIE, { path: '/' });
        destroyCookie(null, USER_DATA_COOKIE, { path: '/' });
        debug('Local auth cookies cleared');
    }
};

export const createAuthenticatedAxios = () => {
    const instance = axios.create({
        baseURL: API_BASE_URL,
        withCredentials: true,
    });

    // Request interceptor to add the access token to headers
    instance.interceptors.request.use(
        async (config) => {
            let token = getToken();

            // Check if the token is expired and replace it with the refresh token
            if (token && isTokenExpired(token)) {
                debug('Access token expired, replacing with refresh token');
                const refreshed = await refreshTokens();
                if (refreshed) {
                    token = getToken(); // Get the new token (refresh token)
                    debug('Successfully replaced access token with refresh token');
                } else {
                    debug('Failed to replace access token with refresh token');
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

    return instance;
};

export const authAxios = createAuthenticatedAxios();

export const checkAuthStatus = async (): Promise<boolean> => {
    const token = getToken();
    debug('Checking auth status', { hasToken: !!token });
    
    if (!token) return false;
    
    // Always refresh when checking auth status to ensure maximum token lifespan
    return await refreshTokens();
};

export const showDebugLogsModal = () => {
    console.warn("Debug logs modal is disabled because localStorage is not used.");
};

const authService = {
    login,
    logout,
    refreshTokens,
    getToken,
    getRefreshToken,
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