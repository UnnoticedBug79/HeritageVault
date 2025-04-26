import React from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import HeritageVaultHeader from '@/components/HeritageVaultHeader';
import Footer from '@/components/Footer';
import FeatureCards from '@/components/FeatureCards';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';

interface User {
  id: number;
  username: string;
  isAuthenticated: boolean;
}

const HomePage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { data: user } = useQuery<User>({ 
    queryKey: ['/api/user'],
    queryFn: getQueryFn({ on401: 'returnNull' })
  });

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="container mx-auto px-4 py-8">
        <HeritageVaultHeader />
        
        <section className="mb-12">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-3xl font-display font-medium mb-4">
              Melestarikan Warisan Budaya Indonesia dalam 
              <span className="text-primary neon-text"> Blockchain</span>
            </h2>
            <p className="text-muted-foreground mb-6">
              HeritageVault adalah platform inovatif yang mendigitalisasi dan
              mempreservasi artefak budaya Indonesia sebagai NFT terverifikasi di blockchain,
              menggunakan teknologi Internet Computer Protocol (ICP).
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                className="neon-border text-primary bg-card hover:bg-primary/10"
                onClick={() => setLocation('/upload')}
              >
                Unggah Artefak Budaya
              </Button>
              <Button 
                variant="outline"
                onClick={() => setLocation('/metaverse')}
              >
                Jelajahi Metaverse
              </Button>
            </div>
          </div>
          
          <Card className="mx-auto max-w-5xl neon-border overflow-hidden">
            <CardContent className="p-0">
              <div 
                className="h-64 w-full bg-cover bg-center"
                style={{
                  backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1577715310886-4a92a0854888?q=80&w=1000')",
                  backgroundBlendMode: "overlay"
                }}
              >
                <div className="flex items-center justify-center h-full text-center p-4">
                  <div className="max-w-xl">
                    <h3 className="text-2xl font-display font-medium mb-2 text-white">Tidak Hanya Melestarikan, Tapi Memverifikasi</h3>
                    <p className="text-gray-200 mb-4">
                      HeritageVault menggunakan teknologi blockchain dan sistem hash kriptografis
                      untuk memastikan keaslian setiap artefak budaya yang dipreservasi.
                    </p>
                    <Button 
                      variant="outline" 
                      className="border-white text-white hover:bg-white/20"
                      onClick={() => setLocation('/verify/1')}
                    >
                      Lihat Sistem Verifikasi
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        
        <section className="mb-16">
          <h2 className="text-2xl font-display font-medium mb-6 text-center">
            Fitur <span className="text-primary neon-text">Utama</span>
          </h2>
          <FeatureCards />
        </section>
                
        <section className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-display font-medium mb-6 text-center">
            Tentang <span className="text-primary neon-text">Kami</span>
          </h2>
          <Card className="neon-border bg-card">
            <CardContent className="p-6">
              <p className="mb-4">
                HeritageVault dibangun dengan misi untuk melestarikan kekayaan budaya Indonesia
                dengan cara yang lebih modern dan aman. Kami percaya bahwa teknologi blockchain
                dan metaverse dapat menjadi jembatan antara warisan tradisional dan masa depan
                digital.
              </p>
              <p className="mb-4">
                Tim kami terdiri dari para pengembang blockchain, ahli budaya, dan pengrajin
                tradisional yang bekerja sama untuk menciptakan ekosistem digital yang
                melindungi dan mempromosikan keragaman budaya Indonesia.
              </p>
              <p>
                Dengan memanfaatkan Internet Computer Protocol, IPFS, dan teknologi NFT,
                kami memastikan bahwa setiap artefak yang didigitalisasi tetap otentik,
                aman, dan dapat diakses oleh generasi mendatang.
              </p>
            </CardContent>
          </Card>
        </section>
        
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
