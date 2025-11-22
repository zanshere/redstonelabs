// src/lib/utils/error-handler.ts

/**
 * Comprehensive error handling utilities for API interactions
 */

export class ApiError extends Error {
  public statusCode: number;
  public code: string;
  public details: unknown;

  constructor(
    message: string, 
    statusCode: number = 500, 
    code: string = 'INTERNAL_ERROR', 
    details: unknown = null
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static fromResponse(error: unknown): ApiError {
    if (
      error && 
      typeof error === 'object' && 
      'status' in error && 
      'message' in error
    ) {
      const errorObj = error as { 
        status: number; 
        message: string; 
        code?: string; 
        details?: unknown;
      };
      
      return new ApiError(
        errorObj.message,
        errorObj.status,
        errorObj.code || 'API_ERROR',
        errorObj.details || null
      );
    }
    
    return new ApiError(
      error instanceof Error ? error.message : 'An unexpected error occurred',
      500,
      'UNKNOWN_ERROR',
      error
    );
  }
}

export class NetworkError extends ApiError {
  constructor(message: string = 'Network connection failed') {
    super(message, 0, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = 'Access forbidden') {
    super(message, 403, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string = 'Validation failed', details: unknown = null) {
    super(message, 422, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND_ERROR');
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string = 'Too many requests', retryAfter?: number) {
    super(message, 429, 'RATE_LIMIT_ERROR', { retryAfter });
    this.name = 'RateLimitError';
  }
}

export class A2FError extends ApiError {
  constructor(message: string = 'Two-factor authentication failed') {
    super(message, 401, 'A2F_ERROR');
    this.name = 'A2FError';
  }
}

export class OTPError extends ApiError {
  constructor(message: string = 'Invalid OTP code') {
    super(message, 401, 'OTP_ERROR');
    this.name = 'OTPError';
  }
}

export class OTPExpiredError extends ApiError {
  constructor(message: string = 'OTP code has expired') {
    super(message, 401, 'OTP_EXPIRED_ERROR');
    this.name = 'OTPExpiredError';
  }
}

export class OTPAttemptsExceededError extends ApiError {
  constructor(message: string = 'Too many OTP attempts') {
    super(message, 429, 'OTP_ATTEMPTS_EXCEEDED_ERROR');
    this.name = 'OTPAttemptsExceededError';
  }
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorLogInfo {
  timestamp: string;
  context: string;
  error: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
    statusCode?: number;
    details?: unknown;
  };
}

/**
 * Error handler utility class
 */
export class ErrorHandler {
  /**
   * Handle API errors and convert to appropriate error types
   */
  static handleApiError(error: unknown): never {
    console.error('API Error:', error);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new NetworkError('Request timeout. Please try again.');
    }

    if (error instanceof TypeError) {
      throw new NetworkError('Network connection failed. Please check your internet connection.');
    }

    if (error && typeof error === 'object' && 'response' in error) {
      const responseError = error as { 
        response: { 
          status: number; 
          data?: unknown;
        }; 
      };
      
      const { status, data } = responseError.response;
      
      let message = 'An error occurred';
      let details: unknown = null;
      let code: string | undefined;

      if (data && typeof data === 'object') {
        const dataObj = data as Record<string, unknown>;
        message = (dataObj.message as string) || message;
        details = dataObj.details || null;
        code = dataObj.code as string;
      }

      if (code === 'A2F_REQUIRED') {
        throw new A2FError(message);
      }

      if (code === 'INVALID_OTP') {
        throw new OTPError(message);
      }

      if (code === 'OTP_EXPIRED') {
        throw new OTPExpiredError(message);
      }

      if (code === 'OTP_ATTEMPTS_EXCEEDED') {
        throw new OTPAttemptsExceededError(message);
      }

      switch (status) {
        case 400:
          throw new ValidationError(message, details);
          
        case 401:
          if (
            message.includes('2FA') || 
            message.includes('OTP') || 
            message.includes('two-factor') ||
            message.includes('A2F')
          ) {
            throw new A2FError(message);
          }
          throw new AuthenticationError(message);
          
        case 403:
          throw new AuthorizationError(message);
          
        case 404:
          throw new NotFoundError(message);
          
        case 422:
          throw new ValidationError(message, details);
          
        case 429:
          throw new RateLimitError(message);
          
        case 500:
          throw new ApiError('Internal server error. Please try again later.', 500);
          
        case 502:
          throw new ApiError('Bad gateway. Please try again later.', 502);
          
        case 503:
          throw new ApiError('Service unavailable. Please try again later.', 503);
          
        default:
          throw new ApiError(message, status);
      }
    }

    if (error instanceof Error) {
      throw new ApiError(error.message);
    }

    throw new ApiError('An unexpected error occurred');
  }

  /**
   * Get user-friendly error message
   */
  static getUserFriendlyMessage(error: unknown): string {
    if (error instanceof ApiError) {
      return error.message;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'An unexpected error occurred. Please try again.';
  }

  /**
   * Check if error is due to network issues
   */
  static isNetworkError(error: unknown): boolean {
    return (
      error instanceof NetworkError || 
      (error instanceof Error && error.name === 'AbortError') ||
      error instanceof TypeError
    );
  }

  /**
   * Check if error is due to authentication issues
   */
  static isAuthenticationError(error: unknown): boolean {
    return (
      error instanceof AuthenticationError || 
      (error instanceof ApiError && error.statusCode === 401)
    );
  }

  /**
   * Check if error is due to authorization issues
   */
  static isAuthorizationError(error: unknown): boolean {
    return (
      error instanceof AuthorizationError || 
      (error instanceof ApiError && error.statusCode === 403)
    );
  }

  /**
   * Check if error is due to validation issues
   */
  static isValidationError(error: unknown): boolean {
    return (
      error instanceof ValidationError || 
      (error instanceof ApiError && error.statusCode === 422)
    );
  }

  /**
   * Check if error is A2F/OTP related
   */
  static isA2FError(error: unknown): boolean {
    return (
      error instanceof A2FError || 
      error instanceof OTPError ||
      error instanceof OTPExpiredError ||
      error instanceof OTPAttemptsExceededError
    );
  }

  /**
   * Log error for debugging
   */
  static logError(error: unknown, context: string = ''): void {
    const timestamp: string = new Date().toISOString();
    
    const errorInfo: ErrorLogInfo = {
      timestamp,
      context,
      error: {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        code: error instanceof ApiError ? error.code : undefined,
        statusCode: error instanceof ApiError ? error.statusCode : undefined,
        details: error instanceof ApiError ? error.details : undefined,
      },
    };

    console.error('Application Error:', errorInfo);

    if (process.env.NODE_ENV === 'production') {
      // In production, send to logging service
      // this.sendToLoggingService(errorInfo);
    }
  }

  /**
   * Retry handler for failed requests
   */
  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: unknown) {
        lastError = error;

        if (
          this.isAuthenticationError(error) || 
          this.isAuthorizationError(error) ||
          (error instanceof ApiError && error.statusCode === 400)
        ) {
          break;
        }

        if (
          this.isNetworkError(error) || 
          (error instanceof ApiError && error.statusCode >= 500)
        ) {
          if (attempt < maxRetries) {
            const backoffDelay: number = delay * Math.pow(2, attempt - 1);
            console.warn(`Retry attempt ${attempt} after ${backoffDelay}ms`);
            await new Promise((resolve) => setTimeout(resolve, backoffDelay));
            continue;
          }
        }

        break;
      }
    }

    throw lastError;
  }

  /**
   * Format validation errors for display
   */
  static formatValidationErrors(error: unknown): string[] {
    if (!(error instanceof ValidationError)) {
      return [this.getUserFriendlyMessage(error)];
    }

    if (error.details && typeof error.details === 'object') {
      const details = error.details as Record<string, unknown>;
      
      if (Array.isArray(details.errors)) {
        return details.errors as string[];
      }
      
      if (typeof details.errors === 'object') {
        return Object.values(details.errors as Record<string, string>);
      }
    }

    return [error.message];
  }
}

export const handleError = ErrorHandler.handleApiError;
export const getErrorMessage = ErrorHandler.getUserFriendlyMessage;
export const logError = ErrorHandler.logError;
export const withRetry = ErrorHandler.withRetry;
export const formatValidationErrors = ErrorHandler.formatValidationErrors;