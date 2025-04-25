import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export const useArtifact = (id?: string) => {
  const queryClient = useQueryClient();
  
  // Fetch single artifact
  const artifactQuery = useQuery({
    queryKey: ['/api/artifacts', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await apiRequest('GET', `/api/artifacts/${id}`);
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error('Failed to fetch artifact');
      }
      return res.json();
    },
    enabled: !!id,
  });
  
  // Fetch all artifacts
  const artifactsQuery = useQuery({
    queryKey: ['/api/artifacts'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/artifacts');
      if (!res.ok) throw new Error('Failed to fetch artifacts');
      return res.json();
    },
  });
  
  // Upload artifact mutation
  const uploadArtifact = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await apiRequest('POST', '/api/artifacts', formData);
      if (!res.ok) throw new Error('Failed to upload artifact');
      return res.json();
    },
    onSuccess: () => {
      // Invalidate artifacts query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['/api/artifacts'] });
    },
  });
  
  // Verify artifact mutation
  const verifyArtifact = useMutation({
    mutationFn: async ({ id, verificationData }: { id: number, verificationData: any }) => {
      const res = await apiRequest('POST', `/api/artifacts/${id}/verify`, verificationData);
      if (!res.ok) throw new Error('Failed to verify artifact');
      return res.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate both the artifacts list and the specific artifact
      queryClient.invalidateQueries({ queryKey: ['/api/artifacts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/artifacts', variables.id.toString()] });
    },
  });
  
  return {
    artifact: artifactQuery.data,
    artifacts: artifactsQuery.data,
    isLoading: artifactQuery.isLoading || artifactsQuery.isLoading,
    isError: artifactQuery.isError || artifactsQuery.isError,
    uploadArtifact,
    verifyArtifact,
  };
};
