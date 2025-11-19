// src/lib/api.ts

/**
 * Ryuzen Dev - Frontend API Service
 * Comprehensive API client for communicating with NestJS backend
 * Handles authentication, user data, orders, payments, and A2F/OTP
 */

const API_URL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_TIMEOUT: number = 30000; // 30 seconds

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface User {
  id: number;
  email: string;
  username: string;
  name: string;
  role: string;
  phoneNumber?: string;
  photo?: string;
  companyName?: string;
  address?: string;
  taxId?: string;
  workosId?: string;
  oauthProvider?: string;
  emailVerified: boolean;
  a2fEnabled: boolean;
  mfaEnabled: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

interface Order {
  id: number;
  projectName: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  source: 'WEBSITE' | 'WHATSAPP' | 'MANUAL';
  progress: number;
  price?: number;
  paymentStatus: 'PENDING_PAYMENT' | 'PAID' | 'CANCELLED' | 'REFUNDED';
  paymentMethod?: 'BANK_TRANSFER' | 'E_WALLET' | 'MANUAL';
  dueDate?: string;
  estimatedCompletionDate?: string;
  paidAt?: string;
  notes?: string;
  repositoryLink?: string;
  createdAt: string;
  updatedAt: string;
  priceList?: {
    packageName: string;
    price: number;
  };
}

interface Payment {
  id: number;
  orderId: number;
  amount: number;
  method: 'BANK_TRANSFER' | 'E_WALLET' | 'MANUAL';
  status: 'PENDING_PAYMENT' | 'PAID' | 'CANCELLED' | 'REFUNDED';
  transactionId?: string;
  proofOfPayment?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
  order?: {
    id: number;
    projectName: string;
    status: string;
  };
}

interface UserStats {
  orders: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    successRate: number;
  };
  payments: {
    pending: number;
    paid: number;
    refunded: number;
    cancelled: number;
    totalRevenue: number;
  };
  overview: {
    activeProjects: number;
    completedProjects: number;
    pendingActions: number;
  };
}

interface DashboardData {
  user: {
    name: string;
    email: string;
    photo?: string;
    companyName?: string;
    createdAt: string;
  };
  overview: {
    totalOrders: number;
    pendingOrders: number;
    inProgressOrders: number;
    completedOrders: number;
    totalRevenue: number;
    successRate: number;
    averageProgress: number;
  };
  recentOrders: Array<{
    id: number;
    projectName: string;
    status: string;
    progress: number;
    price?: number;
    paymentStatus: string;
    dueDate?: string;
    createdAt: string;
    packageName: string;
  }>;
  activeProjects: Array<{
    id: number;
    projectName: string;
    status: string;
    progress: number;
    dueDate?: string;
    recentUpdates: Array<{
      description: string;
      percentage: number;
      createdAt: string;
    }>;
  }>;
  quickStats: {
    activeProjects: number;
    completedProjects: number;
    pendingActions: number;
    pendingPayments: number;
  };
}

interface A2FConfig {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

interface MFASetupData {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

interface MFAStatusResponse {
  mfaEnabled: boolean;
  a2fEnabled: boolean;
}

interface A2FStatusResponse {
  a2fEnabled: boolean;
  mfaEnabled: boolean;
}

interface LoginResponse {
  user: User;
  token: string | null;
  requiresA2F?: boolean;
  requiresMFA?: boolean;
}

interface PriceList {
  id: number;
  packageName: string;
  description: string;
  price: number;
  features: string[];
  duration: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface HealthCheckResponse {
  status: string;
  timestamp: string;
  version: string;
}

interface TokenValidationResponse {
  valid: boolean;
  user?: User;
  error?: string;
}

interface OrderCreateData {
  projectName: string;
  description: string;
  priceListId?: number;
  price?: number;
  dueDate?: string;
  notes?: string;
}

interface ContactFormData {
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
}

interface UploadProfilePictureResponse {
  success: boolean;
  photoUrl: string;
  message: string;
}

class ApiService {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_URL;
    this.timeout = API_TIMEOUT;
  }

  /**
   * Generic request method with timeout and error handling
   */
  private async request<T = unknown>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url: string = `${this.baseURL}${endpoint}`;
    
    const token: string | null = this.getToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const config: RequestInit = {
      ...options,
      headers,
    };

    if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
      config.body = JSON.stringify(options.body);
    } else {
      config.body = options.body;
    }

    try {
      const controller: AbortController = new AbortController();
      const timeoutId: NodeJS.Timeout = setTimeout((): void => controller.abort(), this.timeout);
      
      const response: Response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        await this.handleHttpError(response, url);
      }

      const contentType: string | null = response.headers.get('content-type');
      let data: T;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json() as T;
      } else {
        data = await response.text() as unknown as T;
      }

      return data;
    } catch (error: unknown) {
      this.handleRequestError(error, url);
      throw error;
    }
  }

  /**
   * Handle HTTP errors with specific status codes
   */
  private async handleHttpError(response: Response, url: string): Promise<never> {
    const status: number = response.status;
    let errorMessage: string;

    try {
      const errorData = await response.json() as { message?: string; error?: string };
      errorMessage = errorData.message || errorData.error || `HTTP ${status} error`;
    } catch {
      errorMessage = `HTTP ${status} error for ${url}`;
    }

    switch (status) {
      case 400:
        throw new Error(errorMessage || 'Bad request. Please check your input.');
      case 401:
        // Special handling for MFA status endpoint - don't logout user
        if (url.includes('/api/auth/mfa/status')) {
          console.warn('MFA status endpoint returned 401, continuing without MFA status');
          throw new Error('MFA status unavailable');
        }
        this.handleUnauthorizedError();
        throw new Error('Authentication failed. Please login again.');
      case 403:
        throw new Error('Access forbidden. You do not have permission.');
      case 404:
        throw new Error(errorMessage || 'Resource not found. Please check the endpoint.');
      case 422:
        throw new Error(errorMessage || 'Validation error. Please check your input.');
      case 429:
        throw new Error('Too many requests. Please try again later.');
      case 500:
        throw new Error('Server error. Please try again later.');
      case 502:
        throw new Error('Bad gateway. Please try again later.');
      case 503:
        throw new Error('Service unavailable. Please try again later.');
      default:
        throw new Error(errorMessage);
    }
  }

  /**
   * Handle network and other request errors
   */
  private handleRequestError(error: unknown, url: string): never {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout for ${url}. Please try again.`);
    }

    if (error instanceof TypeError) {
      throw new Error('Network error. Please check your connection.');
    }

    console.error(`API Request failed for ${url}:`, error);
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }

  /**
   * Handle unauthorized errors by clearing local storage
   */
  private handleUnauthorizedError(): void {
    // Only logout if we're not already on login page
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
      this.removeAuthToken();
      this.removeUserData();
      window.location.href = '/auth/login';
    }
  }

  // ============ AUTHENTICATION METHODS ============

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Automatically set token after successful login
    if (response.token) {
      this.setAuthToken(response.token);
      this.setUserData(response.user);
    }
    
    return response;
  }

  async register(userData: RegisterData): Promise<{ user: User; token: string }> {
    const response = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Automatically set token after successful registration
    if (response.token) {
      this.setAuthToken(response.token);
      this.setUserData(response.user);
    }
    
    return response;
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyOTP(email: string, otp: string, provider: string = 'authenticator'): Promise<{ user: User; token: string }> {
    const response = await this.request<{ user: User; token: string }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp, provider }),
    });
    
    // Automatically set token after successful OTP verification
    if (response.token) {
      this.setAuthToken(response.token);
      this.setUserData(response.user);
    }
    
    return response;
  }

  async resendOTP(email: string, provider: string = 'authenticator'): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email, provider }),
    });
  }

  // ============ USER METHODS ============

  async getUserStats(): Promise<UserStats> {
    return this.request<UserStats>('/api/user/stats');
  }

  async getRecentOrders(take: number = 5): Promise<Order[]> {
    return this.request<Order[]>(`/api/user/recent-orders?take=${take}`);
  }

  async getUserProfile(): Promise<User> {
    return this.request<User>('/api/user/profile');
  }

  async getUserDashboard(): Promise<DashboardData> {
    return this.request<DashboardData>('/api/user/dashboard');
  }

  async getOrderDetail(orderId: number): Promise<Order> {
    return this.request<Order>(`/api/user/orders/${orderId}`);
  }

  async getUserPayments(): Promise<Payment[]> {
    return this.request<Payment[]>('/api/user/payments');
  }

  // ============ A2F/OTP METHODS ============

  async getA2FStatus(): Promise<{ a2fEnabled: boolean }> {
    try {
      // Check if user is authenticated first
      if (!this.isAuthenticated()) {
        console.warn('User not authenticated, skipping MFA status check');
        return { a2fEnabled: false };
      }

      const response: MFAStatusResponse = await this.request<MFAStatusResponse>('/api/auth/mfa/status');
      return { a2fEnabled: response.a2fEnabled || response.mfaEnabled };
    } catch (error: unknown) {
      console.warn('Failed to get A2F status, continuing without MFA status:', error);
      // Return default value if endpoint fails - don't logout user
      return { a2fEnabled: false };
    }
  }

  async setupA2F(): Promise<A2FConfig> {
    try {
      const response: A2FConfig = await this.request<A2FConfig>('/api/auth/mfa/setup', {
        method: 'POST',
      });
      return response;
    } catch (error: unknown) {
      console.error('Failed to setup A2F:', error);
      throw new Error('Failed to setup MFA. Please try again later.');
    }
  }

  async verifyA2F(token: string): Promise<{ success: boolean }> {
    try {
      return await this.request<{ success: boolean }>('/api/auth/mfa/verify', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });
    } catch (error: unknown) {
      console.error('Failed to verify A2F:', error);
      throw new Error('Failed to verify MFA code.');
    }
  }

  async disableA2F(password: string): Promise<{ success: boolean }> {
    try {
      return await this.request<{ success: boolean }>('/api/auth/mfa/disable', {
        method: 'POST',
        body: JSON.stringify({ password }),
      });
    } catch (error: unknown) {
      console.error('Failed to disable A2F:', error);
      throw new Error('Failed to disable MFA.');
    }
  }

  async generateBackupCodes(): Promise<{ backupCodes: string[] }> {
    try {
      return await this.request<{ backupCodes: string[] }>('/api/auth/mfa/backup-codes', {
        method: 'POST',
      });
    } catch (error: unknown) {
      console.error('Failed to generate backup codes:', error);
      throw new Error('Failed to generate backup codes.');
    }
  }

  // ============ OAUTH METHODS ============

  getGitHubAuthUrl(): string {
    return `${this.baseURL}/auth/github`;
  }

  getGoogleAuthUrl(): string {
    return `${this.baseURL}/auth/google`;
  }

  // ============ TOKEN & STORAGE MANAGEMENT ============

  async validateToken(): Promise<TokenValidationResponse> {
    try {
      const token: string | null = this.getToken();
      
      if (!token) {
        return { valid: false, error: 'No token found' };
      }

      // Simple token validation - check if it's a valid JWT structure
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        return { valid: false, error: 'Invalid token format' };
      }

      // Try to get user profile to validate token
      try {
        const userProfile: User = await this.getUserProfile();
        return { 
          valid: true, 
          user: userProfile 
        };
      } catch (error) {
        console.warn('Token validation via profile failed:', error);
        return { 
          valid: false, 
          error: error instanceof Error ? error.message : 'Token validation failed' 
        };
      }
    } catch (error: unknown) {
      console.error('Token validation failed:', error);
      return { 
        valid: false, 
        error: error instanceof Error ? error.message : 'Token validation failed' 
      };
    }
  }

  setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      console.log('Token set in localStorage');
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      console.log('Retrieved token from localStorage:', token ? 'Yes' : 'No');
      return token;
    }
    return null;
  }

  removeAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      console.log('Token removed from localStorage');
    }
  }

  setUserData(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
      console.log('User data set in localStorage');
    }
  }

  getUserData(): User | null {
    if (typeof window !== 'undefined') {
      const userData: string | null = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  removeUserData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      console.log('User data removed from localStorage');
    }
  }

  clearAuthData(): void {
    this.removeAuthToken();
    this.removeUserData();
    console.log('All auth data cleared');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      console.log('No token found, user not authenticated');
      return false;
    }

    // Basic JWT expiration check
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.log('Invalid token format');
        return false;
      }
      
      const payload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp && payload.exp < currentTime) {
        console.log('Token expired, clearing auth data');
        this.clearAuthData();
        return false;
      }
      
      console.log('Token is valid, user is authenticated');
      return true;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }

  getAuthHeaders(): HeadersInit {
    const token: string | null = this.getToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    console.log('Auth headers:', headers);
    return headers;
  }

  // ============ UTILITY METHODS ============

  async healthCheck(): Promise<HealthCheckResponse> {
    return this.request<HealthCheckResponse>('/auth/health');
  }

  async updateProfile(profileData: Partial<User>): Promise<User> {
    return this.request<User>('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/user/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async uploadProfilePicture(file: File): Promise<{ photoUrl: string }> {
    try {
      const formData: FormData = new FormData();
      formData.append('photo', file);
      
      const token = this.getToken();
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
      
      // Remove Content-Type for FormData, let browser set it
      delete headers['Content-Type'];
      
      const response = await fetch(`${this.baseURL}/api/user/upload-profile-photo`, {
        method: 'POST',
        body: formData,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const result: UploadProfilePictureResponse = await response.json();
      
      if (result.success) {
        return { photoUrl: result.photoUrl };
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error: unknown) {
      console.error('Upload profile picture error:', error);
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to upload profile picture. Please try again.');
      }
    }
  }

  async createOrder(orderData: OrderCreateData): Promise<Order> {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async updateOrder(orderId: number, orderData: Partial<Order>): Promise<Order> {
    return this.request<Order>(`/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify(orderData),
    });
  }

  async cancelOrder(orderId: number, reason?: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/orders/${orderId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async submitComplaint(orderId: number, message: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/complaints', {
      method: 'POST',
      body: JSON.stringify({ orderId, message }),
    });
  }

  async submitRating(orderId: number, score: number, review?: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/ratings', {
      method: 'POST',
      body: JSON.stringify({ orderId, score, review }),
    });
  }

  async getPriceLists(): Promise<PriceList[]> {
    return this.request<PriceList[]>('/price-lists');
  }

  async submitContactForm(contactData: ContactFormData): Promise<{ message: string }> {
    return this.request<{ message: string }>('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }

  async deleteAccount(password: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/user/delete-account', {
      method: 'DELETE',
      body: JSON.stringify({ password }),
    });
  }
}

export const apiService = new ApiService();

export type {
  User,
  Order,
  Payment,
  UserStats,
  DashboardData,
  LoginResponse,
  A2FConfig,
  MFASetupData,
  LoginCredentials,
  RegisterData,
  ApiResponse,
  PriceList,
  HealthCheckResponse,
  TokenValidationResponse,
  OrderCreateData,
  ContactFormData,
  UploadProfilePictureResponse,
};