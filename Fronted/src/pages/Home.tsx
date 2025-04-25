import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import HeritageVaultHeader from '../components/HeritageVaultHeader';
import FeatureCards from '../components/FeatureCards';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import NeonDialog from '@/components/ui/neon-dialog';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  username: string;
  isAuthenticated: boolean;
}

const Home: React.FC = () => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showSubscribeDialog, setShowSubscribeDialog] = useState(false);
  const { toast } = useToast();
  
  const { data: user } = useQuery<User>({
    queryKey: ['/api/user'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/user');
      if (!res.ok) return null;
      return res.json();
    },
    retry: false,
  });
  
  const handleLogin = async () => {
    try {
      const res = await apiRequest('POST', '/api/auth/login', {
        username: 'demo_user',
        password: 'password',
      });
      
      if (res.ok) {
        toast({
          title: 'Login Berhasil',
          description: 'Selamat datang kembali!',
        });
        
        // Invalidate user query to refetch
        // queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      } else {
        toast({
          title: 'Login Gagal',
          description: 'Username atau password salah.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Login Gagal',
        description: 'Terjadi kesalahan saat login.',
        variant: 'destructive',
      });
    }
  };
  
  const handleSubscribe = async () => {
    try {
      const res = await apiRequest('POST', '/api/subscription', {
        plan: 'monthly',
        months: 1,
      });
      
      if (res.ok) {
        toast({
          title: 'Berlangganan Berhasil',
          description: 'Terima kasih telah mendukung pengrajin lokal!',
        });
        
        // queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      } else {
        toast({
          title: 'Berlangganan Gagal',
          description: 'Terjadi kesalahan saat melakukan langganan.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Berlangganan Gagal',
        description: 'Terjadi kesalahan saat melakukan langganan.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <HeritageVaultHeader />
      
      {/* Hero Section */}
      <div className="py-16 px-4 text-center mb-16 relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Glowing rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-2 border-primary/10 rounded-full animate-pulse opacity-40"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/5 rounded-full animate-pulse opacity-30" style={{ animationDelay: '1s' }}></div>
          
          {/* Grid lines */}
          <div className="absolute inset-0 grid grid-cols-8 opacity-10">
            {[...Array(8)].map((_, i) => (
              <div key={`v-${i}`} className="border-r border-primary/20 h-full"></div>
            ))}
          </div>
          
          <div className="absolute inset-0 grid grid-rows-8 opacity-10">
            {[...Array(8)].map((_, i) => (
              <div key={`h-${i}`} className="border-b border-primary/20 w-full"></div>
            ))}
          </div>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tighter gradient-text">
            Preservasi Budaya<br className="hidden sm:block" /> Era Digital
          </h1>
          
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Platform preservasi digital yang mendemokratisasi warisan budaya Indonesia
            dengan teknologi blockchain dan kecerdasan buatan.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="text-lg px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/80">
              Jelajahi Artefak
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 border-primary/40 text-white hover:bg-primary/10"
              onClick={() => setShowLoginDialog(true)}
            >
              {user?.isAuthenticated ? 'Dashboard' : 'Masuk'}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Feature Cards */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8 neon-text">Fitur Utama</h2>
        <FeatureCards />
      </div>
      
      {/* About Section */}
      <div className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 neon-text">Tentang HeritageVault</h2>
            <p className="text-gray-300 mb-6">
              HeritageVault adalah platform inovatif yang menggunakan teknologi blockchain untuk 
              memverifikasi keaslian artefak budaya Indonesia, khususnya batik dan tenun.
            </p>
            <p className="text-gray-300 mb-6">
              Dengan kemampuan verifikasi modern dan visualisasi 3D/AR, kami memberi akses global 
              pada warisan budaya Indonesia sambil memastikan para pengrajin mendapat pengakuan 
              dan manfaat ekonomi yang layak.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <span className="text-gray-300">Verifikasi berbasis blockchain yang tidak dapat dipalsukan</span>
              </li>
              <li className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <span className="text-gray-300">Tokenisasi artefak budaya sebagai NFT pada Internet Computer Protocol</span>
              </li>
              <li className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <span className="text-gray-300">Dukungan langsung kepada pengrajin lokal melalui sistem langganan</span>
              </li>
            </ul>
          </div>
          
          <div>
            <Card className="overflow-hidden relative border-primary/20 bg-card/60 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
              <div className="p-8 relative">
                <h3 className="text-2xl font-semibold mb-4 text-primary">Mendukung Budaya Indonesia</h3>
                <p className="text-gray-300 mb-6">
                  Berlangganan untuk membuka akses penuh ke koleksi artefak digital dan mendukung 
                  pengrajin lokal di seluruh Indonesia. Setiap langganan memberi manfaat langsung 
                  pada komunitas pengrajin.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-primary/20 pb-3">
                    <span className="text-gray-300">Akses Koleksi Premium</span>
                    <span className="text-primary">✓</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-primary/20 pb-3">
                    <span className="text-gray-300">Dukungan untuk Pengrajin</span>
                    <span className="text-primary">✓</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-primary/20 pb-3">
                    <span className="text-gray-300">Pengalaman AR/3D</span>
                    <span className="text-primary">✓</span>
                  </div>
                </div>
                
                <div className="mt-8">
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">Rp 150.000</span>
                    <span className="text-gray-400 ml-2">/bulan</span>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => setShowSubscribeDialog(true)}
                  >
                    Berlangganan Sekarang
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Login Dialog */}
      <NeonDialog
        isOpen={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
        title="Masuk ke HeritageVault"
        description="Masuk untuk mengakses semua fitur HeritageVault dan mulai menjelajahi artefak budaya."
        confirmText="Masuk"
        cancelText="Batal"
        onConfirm={handleLogin}
      />
      
      {/* Subscribe Dialog */}
      <NeonDialog
        isOpen={showSubscribeDialog}
        onClose={() => setShowSubscribeDialog(false)}
        title="Dukung Pengrajin Lokal"
        description="Langganan bulanan Anda akan mendukung pengrajin lokal dan komunitas budaya tradisional di seluruh Indonesia."
        confirmText="Berlangganan Rp 150.000/bulan"
        cancelText="Nanti Saja"
        onConfirm={handleSubscribe}
      />
    </div>
  );
};

export default Home;
