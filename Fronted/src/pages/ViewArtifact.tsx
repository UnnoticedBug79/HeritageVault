import React, { useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import HeritageVaultHeader from '../components/HeritageVaultHeader';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Cube3D, ChevronLeft, History, Info, Loader2 } from 'lucide-react';
import { renderArtifact3D, launchARView } from '@/lib/metaverse';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const ViewArtifact: React.FC = () => {
  const { id } = useParams();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'details' | '3d'>('details');
  
  const { data: artifact, isLoading, error } = useQuery({
    queryKey: ['/api/artifacts', id],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/artifacts/${id}`);
      if (!res.ok) {
        throw new Error('Failed to fetch artifact');
      }
      return res.json();
    },
    enabled: !!id,
  });
  
  const handleLaunchAR = () => {
    if (artifact) {
      launchARView(artifact.id);
      toast({
        title: 'AR Mode',
        description: 'Mode AR diluncurkan. Arahkan kamera ke permukaan datar.',
      });
    }
  };
  
  const handleView3D = () => {
    if (artifact) {
      setViewMode('3d');
      renderArtifact3D(artifact.id);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <HeritageVaultHeader />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-gray-400">Memuat data artefak...</p>
        </div>
      </div>
    );
  }
  
  if (error || !artifact) {
    return (
      <div className="container mx-auto px-4 py-8">
        <HeritageVaultHeader />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-destructive mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-destructive mb-2">Artefak Tidak Ditemukan</h2>
          <p className="text-gray-400 mb-6">ID artefak tidak valid atau artefak tidak tersedia.</p>
          <Button onClick={() => navigate('/')}>Kembali ke Beranda</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <HeritageVaultHeader />
      
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="flex items-center text-gray-400 hover:text-white"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Kembali ke Beranda
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gambar Artefak */}
        <div className="lg:col-span-1">
          <Card className="p-4 overflow-hidden bg-card/60 backdrop-blur-sm border-primary/20">
            <div className="aspect-square relative rounded-md overflow-hidden">
              <img 
                src={artifact.imageUrl || 'https://placehold.co/600x600/1a1a2e/00e5ff?text=No+Image'} 
                alt={artifact.name}
                className="w-full h-full object-cover"
              />
              
              {artifact.verified && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-green-600 text-white border-0 shadow-lg">
                    Terverifikasi
                  </Badge>
                </div>
              )}
            </div>
            
            <div className="mt-4 space-y-2">
              <Button 
                variant="outline" 
                className="w-full border-primary/40 hover:bg-primary/10"
                onClick={handleView3D}
              >
                <Cube3D className="mr-2 h-4 w-4" />
                Lihat dalam 3D
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-primary/40 hover:bg-primary/10"
                onClick={handleLaunchAR}
              >
                Lihat dalam AR
              </Button>
            </div>
          </Card>
        </div>
        
        {/* Detail Artefak */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="details">
            <TabsList className="mb-6 bg-background/50 border border-primary/20">
              <TabsTrigger value="details" className="data-[state=active]:bg-primary/10">
                <Info className="h-4 w-4 mr-2" />
                Detail
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-primary/10">
                <History className="h-4 w-4 mr-2" />
                Sejarah & Narasi
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-6">
              <Card className="p-6 bg-card/60 backdrop-blur-sm border-primary/20">
                <h1 className="text-3xl font-bold text-primary mb-2">{artifact.name}</h1>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="border-primary/40 text-primary">
                    {artifact.type}
                  </Badge>
                  
                  <Badge variant="outline" className="border-primary/40">
                    {artifact.origin}
                  </Badge>
                </div>
                
                <p className="text-gray-300 mb-6">{artifact.description}</p>
                
                <Separator className="my-4 bg-primary/20" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Harga</h3>
                    <p className="text-lg font-semibold text-white">Rp {artifact.price.toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Status</h3>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${artifact.verified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      <p className="font-medium">{artifact.verified ? 'Terverifikasi' : 'Menunggu Verifikasi'}</p>
                    </div>
                  </div>
                  
                  {artifact.verified && (
                    <>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">ID Verifikasi</h3>
                        <p className="text-xs text-gray-300 font-mono break-all">{artifact.verificationHash?.substring(0, 16)}...</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Tanggal Verifikasi</h3>
                        <p className="text-gray-300">{new Date(artifact.createdAt).toLocaleDateString()}</p>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="mt-6">
                  <Button variant="default" className="w-full">
                    {artifact.verified ? 'Lihat Sertifikat NFT' : 'Verifikasi Artefak Ini'}
                  </Button>
                </div>
              </Card>
              
              {artifact.verified && (
                <Card className="p-4 border-green-600/20 bg-green-900/10 backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-900/30 rounded-full p-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-400 mb-1">Artefak Terverifikasi</h3>
                      <p className="text-gray-300 text-sm">
                        Artefak ini telah diverifikasi dan tercatat di blockchain. 
                        Verifikasi memastikan keaslian dan integritas artefak budaya ini.
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="history">
              <Card className="p-6 bg-card/60 backdrop-blur-sm border-primary/20">
                <h2 className="text-2xl font-bold text-primary mb-4">Sejarah & Narasi Budaya</h2>
                
                <div className="prose prose-invert max-w-none">
                  <p>
                    {artifact.type === 'batik' && (
                      <>
                        Batik <strong>{artifact.name}</strong> berasal dari daerah {artifact.origin} dan memiliki sejarah panjang dalam budaya Indonesia. 
                        Pola-pola yang terlihat dalam batik ini memiliki makna filosofis yang mendalam, menggambarkan harmonisasi antara manusia, alam, dan spiritual.
                      </>
                    )}
                    
                    {artifact.type === 'tenun' && (
                      <>
                        Kain tenun <strong>{artifact.name}</strong> merupakan warisan budaya dari daerah {artifact.origin}. 
                        Proses pembuatannya yang rumit memerlukan keterampilan tinggi yang diwariskan dari generasi ke generasi. 
                        Motif pada kain tenun ini melambangkan status sosial, kesuburan, dan hubungan dengan alam.
                      </>
                    )}
                    
                    {!['batik', 'tenun'].includes(artifact.type) && (
                      <>
                        Artefak <strong>{artifact.name}</strong> dari {artifact.origin} adalah bagian penting dari warisan budaya Indonesia. 
                        Setiap detail dalam artefak ini menceritakan kisah yang kaya tentang budaya, tradisi, dan nilai-nilai masyarakat yang menciptakannya.
                      </>
                    )}
                  </p>
                  
                  <h3>Makna Simbolis</h3>
                  <p>
                    Motif yang terdapat pada {artifact.name} memiliki makna simbolis yang dalam:
                  </p>
                  <ul>
                    <li>Pola geometris melambangkan keteraturan dan keseimbangan alam.</li>
                    <li>Unsur flora menggambarkan kesuburan dan kehidupan.</li>
                    <li>Warna-warna yang digunakan memiliki makna tersendiri: biru melambangkan kesetiaan, merah melambangkan keberanian, dan kuning melambangkan kejayaan.</li>
                  </ul>
                  
                  <h3>Proses Pembuatan</h3>
                  <p>
                    Proses pembuatan {artifact.type === 'batik' ? 'batik' : artifact.type === 'tenun' ? 'tenun' : 'artefak'} ini melibatkan beberapa tahapan:
                  </p>
                  <ol>
                    <li>Persiapan bahan baku dari sumber-sumber alami.</li>
                    <li>Pembuatan pola dasar yang memerlukan ketelitian tinggi.</li>
                    <li>Proses pewarnaan menggunakan teknik tradisional.</li>
                    <li>Penyelesaian akhir yang memperhalus detail-detail kecil.</li>
                  </ol>
                  
                  <p>
                    Melalui preservasi digital dalam bentuk NFT, artefak budaya ini dapat dilestarikan selamanya dalam blockchain, 
                    memastikan bahwa nilai historis dan kultural tetap terjaga untuk generasi mendatang.
                  </p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ViewArtifact;
