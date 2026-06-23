import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/authStore';
import { LoginCredentials, RegisterData } from '@/types/auth.types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setAuth, logout: logoutStore, user: storeUser } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async (tokens) => {
      localStorage.setItem('auth_tokens', JSON.stringify(tokens));
      
      // Fetch user data
      try {
        const user = await authApi.getMe();
        setAuth(user, tokens);
        queryClient.setQueryData(['me'], user);
        
        toast.success('Welcome back!');
        navigate('/dashboard');
      } catch (error) {
        toast.error('Failed to fetch user data');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Login failed');
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success('Account created! Please login.');
      navigate('/login');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Registration failed');
    },
  });

  // Only fetch user if we have tokens and no user in store
  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: authApi.getMe,
    enabled: !!localStorage.getItem('auth_tokens') && !storeUser,
    retry: false,
    staleTime: Infinity,
  });

  const login = (credentials: LoginCredentials) => {
    loginMutation.mutate(credentials);
  };

  const register = (data: RegisterData) => {
    registerMutation.mutate(data);
  };

  const logout = () => {
    authApi.logout();
    logoutStore();
    queryClient.clear();
    toast.info('Logged out successfully');
    navigate('/login');
  };

  return {
    user: storeUser || user,
    login,
    register,
    logout,
    isLoading: loginMutation.isPending || registerMutation.isPending,
  };
};