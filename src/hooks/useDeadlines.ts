import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Deadline = Database['public']['Tables']['deadlines']['Row'];
type DeadlineInsert = Database['public']['Tables']['deadlines']['Insert'];
type DeadlineUpdate = Database['public']['Tables']['deadlines']['Update'];

export const useDeadlines = () => {
  return useQuery({
    queryKey: ['deadlines'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deadlines')
        .select(`
          *,
          universities (
            name,
            program_name
          )
        `)
        .order('date', { ascending: true });
      
      if (error) throw error;
      return data as (Deadline & { universities: { name: string; program_name: string } })[];
    },
  });
};

export const useCreateDeadline = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (deadline: DeadlineInsert) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('deadlines')
        .insert([{ ...deadline, user_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deadlines'] });
    },
  });
};

export const useUpdateDeadline = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: DeadlineUpdate }) => {
      const { data, error } = await supabase
        .from('deadlines')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deadlines'] });
    },
  });
};

export const useDeleteDeadline = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('deadlines')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deadlines'] });
    },
  });
};