// src/lib/hooks/useApi.ts

/**
 * Custom React hook for API calls with state management
 */

import { useState, useCallback, useRef } from 'react';
import { apiService } from '../lib/api';
import { ErrorHandler, ApiError } from '../lib/utils/error-handler';

interface UseApiOptions<T> {
  immediate?: boolean;
  initialData?: T | null;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  success: boolean;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: unknown[]) => Promise<T>;
  reset: () => void;
}

export function useApi<T = unknown>(
  apiCall: (...args: unknown[]) => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const {
    immediate = false,
    initialData = null,
    onSuccess,
    onError,
  } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
    success: false,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(async (...args: unknown[]): Promise<T> => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setState((prevState: UseApiState<T>) => ({
      ...prevState,
      loading: true,
      error: null,
      success: false,
    }));

    try {
      const result: T = await apiCall(...args);
      
      setState({
        data: result,
        loading: false,
        error: null,
        success: true,
      });

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (error: unknown) {
      const apiError: ApiError = ErrorHandler.handleApiError(error);
      
      setState((prevState: UseApiState<T>) => ({
        ...prevState,
        loading: false,
        error: apiError,
        success: false,
      }));

      if (onError) {
        onError(apiError);
      }

      throw apiError;
    } finally {
      abortControllerRef.current = null;
    }
  }, [apiCall, onSuccess, onError]);

  const reset = useCallback((): void => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setState({
      data: initialData,
      loading: false,
      error: null,
      success: false,
    });
  }, [initialData]);

  return {
    ...state,
    execute,
    reset,
  };
}

// Authentication hooks
export function useLogin() {
  return useApi(apiService.login);
}

export function useRegister() {
  return useApi(apiService.register);
}

export function useForgotPassword() {
  return useApi(apiService.forgotPassword);
}

export function useVerifyOTP() {
  return useApi(apiService.verifyOTP);
}

export function useResendOTP() {
  return useApi(apiService.resendOTP);
}

// User data hooks
export function useUserProfile() {
  return useApi(apiService.getUserProfile);
}

export function useUserStats() {
  return useApi(apiService.getUserStats);
}

export function useUserDashboard() {
  return useApi(apiService.getUserDashboard);
}

export function useRecentOrders() {
  return useApi((take: number = 5) => apiService.getRecentOrders(take));
}

export function useOrderDetail() {
  return useApi((orderId: number) => apiService.getOrderDetail(orderId));
}

export function useUserPayments() {
  return useApi(apiService.getUserPayments);
}

// A2F/OTP hooks
export function useA2FStatus() {
  return useApi(apiService.getA2FStatus);
}

export function useA2FSetup() {
  return useApi(apiService.setupA2F);
}

export function useA2FVerify() {
  return useApi(apiService.verifyA2F);
}

export function useA2FDisable() {
  return useApi(apiService.disableA2F);
}

export function useBackupCodes() {
  return useApi(apiService.generateBackupCodes);
}

// Profile management hooks
export function useUpdateProfile() {
  return useApi(apiService.updateProfile);
}

export function useChangePassword() {
  return useApi(apiService.changePassword);
}

export function useUploadProfilePicture() {
  return useApi(apiService.uploadProfilePicture);
}

// Order management hooks
export function useCreateOrder() {
  return useApi(apiService.createOrder);
}

export function useUpdateOrder() {
  return useApi((orderId: number, orderData: unknown) => apiService.updateOrder(orderId, orderData));
}

export function useCancelOrder() {
  return useApi((orderId: number, reason?: string) => apiService.cancelOrder(orderId, reason));
}

export function useSubmitComplaint() {
  return useApi(apiService.submitComplaint);
}

export function useSubmitRating() {
  return useApi(apiService.submitRating);
}

export function usePriceLists() {
  return useApi(apiService.getPriceLists);
}

// Utility hooks
export function useHealthCheck() {
  return useApi(apiService.healthCheck);
}

export function useContactForm() {
  return useApi(apiService.submitContactForm);
}

export function useValidateToken() {
  return useApi(apiService.validateToken);
}