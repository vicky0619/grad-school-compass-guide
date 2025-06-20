import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type University = Database['public']['Tables']['universities']['Row'];
type UniversityInsert = Database['public']['Tables']['universities']['Insert'];
type UniversityUpdate = Database['public']['Tables']['universities']['Update'];

export const useUniversities = () => {
  return useQuery({
    queryKey: ['universities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .order('deadline', { ascending: true });
      
      if (error) throw error;
      return data as University[];
    },
  });
};

export const useCreateUniversity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (university: UniversityInsert) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('universities')
        .insert([{ ...university, user_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['universities'] });
    },
  });
};

export const useUpdateUniversity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UniversityUpdate }) => {
      const { data, error } = await supabase
        .from('universities')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['universities'] });
    },
  });
};

export const useDeleteUniversity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('universities')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['universities'] });
    },
  });
};