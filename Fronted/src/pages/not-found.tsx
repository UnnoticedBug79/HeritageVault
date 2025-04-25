import React from 'react';
import { useLocation } from 'wouter';
import HeritageVaultHeader from '../components/HeritageVaultHeader';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const [_, navigate] = useLocation();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <HeritageVaultHeader />
      
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-primary mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        
        <h1 className="text-4xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Halaman Tidak Ditemukan</h2>
        
        <p className="text-gray-300 max-w-lg mb-8">
          Halaman yang Anda cari tidak tersedia. Artefak digital ini mungkin telah dipindahkan
          atau tidak pernah ada dalam blockchain kami.
        </p>
        
        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/')}
            className="px-6"
          >
            Kembali ke Beranda
          </Button>
          
          <div>
            <Button 
              variant="outline"
              onClick={() => navigate('/verify')}
              className="border-primary/40 hover:bg-primary/10"
            >
              Verifikasi Artefak
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
