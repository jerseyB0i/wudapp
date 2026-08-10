import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../infrastructure/api.client';
import { useAuthStore } from '../store/auth.store';
import type { LoginBody, RegisterBody, AuthResponse } from '@wudapp/types';

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (body: LoginBody) =>
      apiClient.post<AuthResponse>('/api/auth/login', body).then((r) => r.data),
    onSuccess: (data) => setAuth(data.user, data.token),
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: (body: RegisterBody) =>
      apiClient.post<AuthResponse>('/api/auth/register', body).then((r) => r.data),
    onSuccess: (data) => setAuth(data.user, data.token),
  });
}
