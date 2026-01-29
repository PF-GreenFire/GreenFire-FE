import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../apis/axios';

const fetchMe = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const { data } = await api.get('/api/v1/auth/me');
  return data;
};

export const useAuth = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: fetchMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const isLoggedIn = !!data?.ok;
  const user = data || null;
  const role = data?.role || null;

  const onLoginSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
  };

  const onLogout = () => {
    localStorage.removeItem('token');
    queryClient.setQueryData(['auth', 'me'], null);
  };

  return {
    user,
    isLoggedIn,
    isLoading,
    role,
    onLoginSuccess,
    onLogout,
  };
};
