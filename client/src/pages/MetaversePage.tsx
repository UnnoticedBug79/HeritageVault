import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HeritageVaultHeader from '@/components/HeritageVaultHeader';
import Footer from '@/components/Footer';
import { ArrowLeft, Book, Info, Layers, Eye, Box } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const MetaversePage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [renderMode, setRenderMode] = useState<'3d' | 'ar'>('3d');
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Ambil artifactId dari URL jika ada
  const urlParams = new URLSearchParams(window.location.search);
  const artifactId = urlParams.get('id');
  
  useEffect(() => {
    // Simulasi loading 3D engine dengan tampilan yang lebih menarik
    document.title = "Metaverse Viewer | HeritageVault";
    
    // Tampilkan loading screen lebih lama (2 detik) agar animasi terlihat
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => {
      clearTimeout(timer);
      document.title = "HeritageVault";
    };
  }, []);
  
  const handleARMode = () => {
    if (isMobile) {
      setRenderMode('ar');
      toast({
        title: "AR Mode Aktif",
        description: "Arahkan kamera ke permukaan datar untuk menempatkan artefak"
      });
    } else {
      toast({
        title: "AR Mode Tidak Tersedia",
        description: "Mode AR hanya tersedia di perangkat mobile",
        variant: "destructive"
      });
    }
  };
  
  const handleDownload = () => {
    toast({
      title: "Download 3D Model",
      description: "Model 3D sedang diunduh dalam format GLB"
    });
  };
  
  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="container mx-auto px-4 py-4 max-w-4xl flex flex-col items-center">
        <HeritageVaultHeader />
        
        <div className="w-full mb-6">
          <Button 
            variant="outline" 
            className="mb-4"
            onClick={() => artifactId ? setLocation(`/artifact/${artifactId}`) : setLocation('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          
          <h1 className="text-2xl font-bold mb-2 text-center text-primary">
            <Box className="inline-block mr-2 h-6 w-6" />
            Metaverse Viewer
          </h1>
          
          <Card className="border-2 border-primary/20 p-0 overflow-hidden">
            <Tabs defaultValue="view" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="view">Tampilan</TabsTrigger>
                <TabsTrigger value="info">Informasi</TabsTrigger>
                <TabsTrigger value="story">Cerita</TabsTrigger>
              </TabsList>
              
              <TabsContent value="view" className="p-4">
                <div 
                  className="bg-black/70 rounded-md h-[400px] mb-4 border border-primary/30 flex items-center justify-center"
                  style={{
                    backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230a1e26' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
                  }}
                >
                  {loading ? (
                    <div className="text-center relative">
                      {/* Futuristic loading animation */}
                      <div className="relative w-36 h-36 mx-auto mb-4">
                        {/* Pulsing core */}
                        <div className="absolute inset-10 rounded-full bg-primary/20 animate-ping-slow"></div>
                        
                        {/* Orbital rings */}
                        <div className="absolute inset-0 border-2 border-primary/40 rounded-full animate-spin-slow"></div>
                        <div className="absolute inset-4 border-2 border-primary/30 rounded-full animate-reverse-spin"></div>
                        <div className="absolute inset-8 border-2 border-primary/20 rounded-full animate-spin-slow"></div>
                        
                        {/* Holographic globe effect */}
                        <div className="absolute inset-14 rounded-full bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 animate-pulse flex items-center justify-center backdrop-blur-sm">
                          <span className="text-primary text-xl font-display neon-text">3D</span>
                        </div>
                        
                        {/* Grid lines */}
                        <div className="absolute inset-0 rounded-full border border-primary/10 flex items-center justify-center"
                          style={{background: `
                            linear-gradient(0deg, transparent 24%, rgba(2, 231, 245, 0.1) 25%, rgba(2, 231, 245, 0.1) 26%, transparent 27%, transparent 74%, rgba(2, 231, 245, 0.1) 75%, rgba(2, 231, 245, 0.1) 76%, transparent 77%, transparent),
                            linear-gradient(90deg, transparent 24%, rgba(2, 231, 245, 0.1) 25%, rgba(2, 231, 245, 0.1) 26%, transparent 27%, transparent 74%, rgba(2, 231, 245, 0.1) 75%, rgba(2, 231, 245, 0.1) 76%, transparent 77%, transparent)`,
                            backgroundSize: '30px 30px'
                          }}>
                        </div>
                      </div>
                      
                      <p className="text-primary relative">
                        <span className="inline-block mr-2 w-2 h-2 bg-primary rounded-full animate-ping"></span>
                        Memuat Lingkungan Metaverse
                        <span className="inline-block ml-2 w-2 h-2 bg-primary rounded-full animate-ping" style={{animationDelay: '0.3s'}}></span>
                      </p>
                      
                      <p className="text-xs text-gray-400 mt-1">Internet Computer Protocol (ICP)</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="relative mx-auto h-[300px] w-[300px] mb-4">
                        {/* 3D interaktif disini (untuk demo kita gunakan gradien animated) */}
                        <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-purple-600/40 animate-pulse rounded-full"></div>
                        
                        {/* Pseudo 3D object */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-40 h-40 border-2 border-primary/50 rounded-lg bg-black/50 transform perspective-1000 rotate-y-45 rotate-x-10 animate-float-slow flex items-center justify-center">
                            <span className="text-primary text-4xl font-display">Batik</span>
                          </div>
                        </div>
                        
                        {/* Particle effects */}
                        <div className="absolute inset-0">
                          {Array.from({ length: 20 }).map((_, i) => (
                            <div 
                              key={i} 
                              className="absolute w-1 h-1 bg-primary rounded-full animate-float-particle"
                              style={{ 
                                left: `${Math.random() * 100}%`, 
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                opacity: Math.random() * 0.7
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-gray-400 text-sm">
                        {renderMode === '3d' 
                          ? 'Klik dan seret untuk memutar model' 
                          : 'Mode AR aktif - Arahkan kamera ke permukaan'
                        }
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setRenderMode('3d')}
                    disabled={renderMode === '3d'}
                  >
                    <Box className="mr-2 h-4 w-4" />
                    Mode 3D
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleARMode}
                    disabled={renderMode === 'ar'}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Mode AR
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full col-span-2"
                    onClick={handleDownload}
                  >
                    <Layers className="mr-2 h-4 w-4" />
                    Download 3D Model
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="info" className="p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium flex items-center">
                      <Info className="mr-2 h-4 w-4 text-primary" />
                      Informasi Kain Batik
                    </h3>
                    <div className="mt-2 space-y-2">
                      <p className="text-sm">
                        Batik adalah teknik menggambar atau mewarnai kain dengan menorehkan 
                        lilin (malam) panas untuk menghasilkan motif tertentu yang memiliki 
                        makna filosofis.
                      </p>
                      <p className="text-sm">
                        Pada 2 Oktober 2009, UNESCO mengakui batik Indonesia sebagai Warisan 
                        Kemanusiaan untuk Budaya Lisan dan Non-bendawi (Masterpieces of the Oral 
                        and Intangible Heritage of Humanity).
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium flex items-center">
                      <Info className="mr-2 h-4 w-4 text-primary" />
                      Teknik Pembuatan
                    </h3>
                    <div className="mt-2 space-y-2">
                      <p className="text-sm">
                        Proses pembuatan batik melibatkan beberapa tahap, seperti pengolahan 
                        kain, penggambaran motif, pelekatan malam, pewarnaan, hingga 
                        penghilangan malam. Dalam metaverse ini, Anda dapat mengamati teknik-teknik
                        tradisional ini dalam bentuk 3D.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="story" className="p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium flex items-center">
                      <Book className="mr-2 h-4 w-4 text-primary" />
                      Cerita Dibalik Artefak
                    </h3>
                    <div className="mt-2 space-y-2">
                      <p className="text-sm">
                        Batik memiliki sejarah panjang yang bermula dari keraton-keraton 
                        Jawa. Motif-motif tertentu dulunya hanya boleh dipakai oleh kalangan 
                        bangsawan dan keluarga kerajaan.
                      </p>
                      <p className="text-sm">
                        Setiap motif batik memiliki filosofi dan makna tersendiri. Motif parang, 
                        misalnya, melambangkan ketajaman dalam berpikir, bertindak dan berbicara. 
                        Sementara motif kawung melambangkan harapan agar manusia selalu ingat 
                        akan asal-usulnya.
                      </p>
                      <p className="text-sm">
                        Dewasa ini, pembatik-pembatik muda berusaha mempertahankan warisan 
                        budaya ini dengan inovasi desain yang adaptif terhadap selera zaman, 
                        sambil tetap mempertahankan teknik tradisionalnya.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default MetaversePage;
