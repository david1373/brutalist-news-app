import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';

export const useArticles = (page = 1, limit = 10, source) => {
  return useQuery({
    queryKey: ['articles', page, limit, source],
    queryFn: async () => {
      const { data } = await api.get('/articles', {
        params: { page, limit, source }
      });
      return data;
    }
  });
};

export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ url, source }) => {
      const { data } = await api.post('/articles', { url, source });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['articles']);
    }
  });
};