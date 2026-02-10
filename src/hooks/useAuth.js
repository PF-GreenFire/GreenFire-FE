import { useEffect, useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../apis/axios';
import { setAccessToken, getAccessToken } from '../apis/axios';
import { logout as apiLogout, refresh as apiRefresh } from '../apis/authAPI';

/**
 * 앱 시작(새로고침) 시 HttpOnly 쿠키로 Access Token 복구 후 /auth/me 호출.
 * 이미 메모리에 토큰이 있으면 (로그인 직후) refresh를 건너뛴다.
 * Refresh 실패 시 → 비로그인 상태 (세션 만료 모달은 interceptor가 처리).
 */
const fetchMe = async () => {
  // 메모리에 토큰이 없을 때만 refresh로 복구 시도 (새로고침 케이스)
  if (!getAccessToken()) {
    try {
      await apiRefresh();
    } catch {
      // refresh 실패 = 비로그인 상태 (쿠키 없거나 만료)
      return null;
    }
  }

  try {
    const { data } = await api.get('/api/v1/auth/me');
    return data;
  } catch {
    setAccessToken(null);
    return null;
  }
};

export const useAuth = () => {
  const queryClient = useQueryClient();
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: fetchMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // session-expired 이벤트 구독 (axios interceptor에서 발생)
  useEffect(() => {
    const handleSessionExpired = () => {
      setIsSessionExpired(true);
      queryClient.setQueryData(['auth', 'me'], null);
    };

    window.addEventListener('session-expired', handleSessionExpired);
    return () => {
      window.removeEventListener('session-expired', handleSessionExpired);
    };
  }, [queryClient]);

  const isLoggedIn = !!data?.ok;
  const user = data || null;
  const role = data?.role || null;

  const onLoginSuccess = useCallback(() => {
    setIsSessionExpired(false);
    queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
  }, [queryClient]);

  const onLogout = useCallback(async () => {
    setIsSessionExpired(false);
    await apiLogout();
    queryClient.setQueryData(['auth', 'me'], null);
  }, [queryClient]);

  const clearSessionExpired = useCallback(() => {
    setIsSessionExpired(false);
  }, []);

  return {
    user,
    isLoggedIn,
    isLoading,
    role,
    isSessionExpired,
    onLoginSuccess,
    onLogout,
    clearSessionExpired,
  };
};
