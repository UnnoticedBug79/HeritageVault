import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getQueryFn, apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Artifact } from '@shared/schema';

export const useArtifact = (id?: string) => {
  const { toast } = useToast();
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  
  // Fetch single artifact
  const {
    data: artifact,
    isLoading,
    error,
    refetch
  } = useQuery<Artifact>({
    queryKey: [`/api/artifacts/${id}`],
    queryFn: getQueryFn({ on401: 'throw' }),
    enabled: !!id,
  });
  
  // Fetch all artifacts
  const {
    data: artifacts,
    isLoading: isLoadingAll,
    refetch: refetchAll
  } = useQuery<Artifact[]>({
    queryKey: ['/api/artifacts'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });
  
  // Create new artifact
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      // First upload to IPFS
      const ipfsResponse = await apiRequest('POST', '/api/upload', formData);
      const ipfsData = await ipfsResponse.json();
      
      if (!ipfsData || !ipfsData.cid) {
        throw new Error('IPFS upload failed');
      }
      
      // Add IPFS data to form
      formData.append('ipfsCid', ipfsData.cid);
      formData.append('ipfsUrl', ipfsData.url);
      formData.append('metadataHash', ipfsData.metadataHash);
      
      // Create artifact
      const response = await apiRequest('POST', '/api/artifacts', formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/artifacts'] });
      toast({
        title: "Artefak Berhasil Diunggah",
        description: "Artefak berhasil diunggah ke IPFS dan disimpan di blockchain.",
      });
    },
    onError: (error) => {
      toast({
        title: "Gagal Mengunggah",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Verify artifact
  const verifyMutation = useMutation({
    mutationFn: async (artifactId: number) => {
      setVerifying(true);
      const response = await apiRequest('POST', `/api/artifacts/${artifactId}/verify`);
      return response.json();
    },
    onSuccess: () => {
      setVerifying(false);
      setVerified(true);
      queryClient.invalidateQueries({ queryKey: [`/api/artifacts/${id}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/artifacts'] });
      toast({
        title: "Verifikasi Berhasil",
        description: "Artefak telah berhasil diverifikasi dan tercatat di blockchain.",
      });
    },
    onError: (error) => {
      setVerifying(false);
      toast({
        title: "Verifikasi Gagal",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  return {
    artifact,
    artifacts,
    isLoading,
    isLoadingAll,
    error,
    refetch,
    refetchAll,
    uploadMutation,
    verifyMutation,
    verifying,
    verified
  };
};
