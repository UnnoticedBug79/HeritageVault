import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export const useArtifact = (id?: string) => {
  const queryClient = useQueryClient();
  
  const artifactQuery = useQuery({
    queryKey: id ? ['/api/artifacts', id] : null,
    enabled: !!id,
  });

  const uploadArtifact = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await apiRequest('POST', '/api/artifacts', formData);
      await res.json();
      if (!res.ok) {
        throw new Error('Failed to upload artifact');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/artifacts'] });
    },
  });
  
  const verifyArtifact = useMutation({
    mutationFn: async ({ id, verificationHash, metadataHash }: { id: number, verificationHash: string, metadataHash: string }) => {
      const res = await apiRequest('POST', `/api/artifacts/${id}/verify`, { verificationHash, metadataHash });
      if (!res.ok) {
        throw new Error('Failed to verify artifact');
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/artifacts', variables.id.toString()] });
      queryClient.invalidateQueries({ queryKey: ['/api/artifacts'] });
    },
  });

  return {
    artifact: artifactQuery.data,
    isLoading: artifactQuery.isLoading,
    error: artifactQuery.error,
    uploadArtifact,
    verifyArtifact,
  };
};
