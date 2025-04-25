import React from 'react';
import UserIcon from './icons/UserIcon';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const AuthSection: React.FC = () => {
  const { toast } = useToast();
  
  const loginMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/auth/login', { method: 'internet_identity' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      toast({
        title: "Login Berhasil",
        description: "Anda telah berhasil masuk menggunakan Internet Identity",
      });
    },
    onError: (error) => {
      toast({
        title: "Login Gagal",
        description: "Terjadi kesalahan saat mencoba masuk. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  });

  const handleLogin = () => {
    loginMutation.mutate();
  };

  return (
    <div className="text-center mt-10">
      <button 
        className="pulse-effect bg-transparent neon-border text-primary font-medium py-2 px-6 rounded-md hover:shadow-[0_0_8px_theme(colors.primary),0_0_15px_rgba(2,231,245,0.5)] transition duration-300"
        onClick={handleLogin}
        disabled={loginMutation.isPending}
      >
        <span className="flex items-center justify-center">
          <UserIcon className="w-5 h-5 mr-2" />
          {loginMutation.isPending ? "Memproses..." : "Login dengan Internet Identity"}
        </span>
      </button>
    </div>
  );
};

export default AuthSection;
