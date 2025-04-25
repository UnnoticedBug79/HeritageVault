import React, { useState } from 'react';
import { useLocation } from 'wouter';
import HeritageVaultHeader from '../components/HeritageVaultHeader';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import VerificationIcon from '../components/icons/VerificationIcon';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import VerificationCelebration from '../components/VerificationCelebration';

const VerifyArtifact: React.FC = () => {
  const [artifactId, setArtifactId] = useState<string>('');
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'success' | 'failed'>('idle');
  const [artifact, setArtifact] = useState<any>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [_, navigate] = useLocation();
  const { toast } = useToast();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!artifactId || artifactId.trim() === '') {
      toast({
        title: 'ID Artefak Diperlukan',
        description: 'Masukkan ID artefak yang ingin diverifikasi',
        variant: 'destructive',
      });
      return;
    }

    try {
      setVerificationStatus('loading');
      
      // Pertama ambil data artefak
      const artifactRes = await apiRequest('GET', `/api/artifacts/${artifactId}`);
      const artifactData = await artifactRes.json();
      setArtifact(artifactData);
      
      // Simulasi proses verifikasi (dalam aplikasi nyata, proses ini mungkin lebih kompleks)
      setTimeout(async () => {
        try {
          // Panggil API verifikasi
          const verifyRes = await apiRequest('POST', `/api/artifacts/${artifactId}/verify`, {
            verificationHash: artifactData.verificationHash,
            metadataHash: artifactData.metadataHash
          });
          
          const verifyData = await verifyRes.json();
          
          if (verifyData.verified) {
            setVerificationStatus('success');
            toast({
              title: 'Verifikasi Berhasil!',
              description: 'Artefak ini asli dan belum dimodifikasi.',
            });
            
            // Mulai animasi perayaan
            setShowCelebration(true);
            
            // Matikan animasi perayaan setelah beberapa detik
            setTimeout(() => {
              setShowCelebration(false);
            }, 7000);
          } else {
            setVerificationStatus('failed');
            toast({
              title: 'Verifikasi Gagal',
              description: 'Artefak ini mungkin telah dimodifikasi atau tidak asli.',
              variant: 'destructive',
            });
          }
        } catch (error) {
          setVerificationStatus('failed');
          toast({
            title: 'Verifikasi Gagal',
            description: 'Terjadi kesalahan saat memverifikasi artefak.',
            variant: 'destructive',
          });
        }
      }, 2000); // Simulasi waktu verifikasi 2 detik
      
    } catch (error) {
      setVerificationStatus('failed');
      toast({
        title: 'Artefak Tidak Ditemukan',
        description: 'ID artefak tidak valid atau artefak tidak ditemukan.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <HeritageVaultHeader />
      
      <div className="flex justify-center mb-8">
        <div className="w-24 h-24">
          <VerificationIcon className="w-full h-full" />
        </div>
      </div>
      
      <h1 className="text-3xl font-display font-bold text-center mb-6 neon-text">Verifikasi Keaslian Artefak</h1>
      <p className="text-gray-300 text-center mb-8 max-w-2xl mx-auto">
        Verifikasi keaslian artefak budaya menggunakan teknologi blockchain. 
        Masukkan ID artefak untuk memeriksa apakah artefak tersebut asli dan belum dimodifikasi.
      </p>
      
      <Card className="p-6 max-w-md mx-auto neon-border bg-card/60 backdrop-blur-sm">
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="artifactId" className="block text-sm font-medium text-gray-300">
              ID Artefak
            </label>
            <Input
              id="artifactId"
              placeholder="Masukkan ID artefak (contoh: 1)"
              value={artifactId}
              onChange={(e) => setArtifactId(e.target.value)}
              className="bg-background/50 border-primary/40"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full flex items-center justify-center"
            disabled={verificationStatus === 'loading'}
          >
            {verificationStatus === 'loading' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memverifikasi...
              </>
            ) : 'Verifikasi Artefak'}
          </Button>
        </form>
        
        {/* Visualisasi Proses Verifikasi */}
        {verificationStatus !== 'idle' && (
          <div className="mt-8 space-y-4">
            <h3 className="text-xl font-semibold neon-text">Proses Verifikasi</h3>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-2 ${verificationStatus === 'loading' || verificationStatus === 'success' || verificationStatus === 'failed' ? 'bg-primary' : 'bg-gray-600'}`}></div>
                <p className="text-sm">Mengambil data artefak dari blockchain</p>
              </div>
              
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-2 ${verificationStatus === 'success' || verificationStatus === 'failed' ? 'bg-primary' : 'bg-gray-600'}`}></div>
                <p className="text-sm">Menghitung hash dari data artefak</p>
              </div>
              
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-2 ${verificationStatus === 'success' || verificationStatus === 'failed' ? (verificationStatus === 'success' ? 'bg-green-500' : 'bg-red-500') : 'bg-gray-600'}`}></div>
                <p className="text-sm">Membandingkan hash dengan data di blockchain</p>
              </div>
            </div>
            
            {/* Hasil Verifikasi */}
            {(verificationStatus === 'success' || verificationStatus === 'failed') && (
              <div className={`p-4 rounded-md mt-4 ${verificationStatus === 'success' ? 'bg-green-900/20 border border-green-500/30 text-green-400' : 'bg-red-900/20 border border-red-500/30 text-red-400'}`}>
                <h4 className="font-bold text-lg mb-2">
                  {verificationStatus === 'success' ? 'Artefak Terverifikasi ✓' : 'Verifikasi Gagal ✗'}
                </h4>
                <p className="text-sm">
                  {verificationStatus === 'success' 
                    ? 'Artefak ini asli dan data yang tersimpan di blockchain belum dimodifikasi.' 
                    : 'Artefak ini mungkin telah dimodifikasi atau bukan merupakan artefak asli.'}
                </p>
                
                {artifact && verificationStatus === 'success' && (
                  <div className="mt-4 pt-4 border-t border-green-500/20">
                    <h5 className="font-semibold mb-2">Detail Artefak</h5>
                    <p className="text-sm"><span className="font-medium">Nama:</span> {artifact.name}</p>
                    <p className="text-sm"><span className="font-medium">Kategori:</span> {artifact.type}</p>
                    {artifact.verified && (
                      <div className="flex items-center mt-1">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <p className="text-sm font-medium">Terverifikasi di Blockchain</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Tombol untuk melihat detail artefak jika verifikasi berhasil */}
            {verificationStatus === 'success' && (
              <Button 
                onClick={() => navigate(`/artifact/${artifactId}`)}
                variant="outline" 
                className="w-full mt-4 border-primary/40"
              >
                Lihat Detail Artefak
              </Button>
            )}
          </div>
        )}
      </Card>
      
      <div className="mt-12 text-center">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-white"
        >
          Kembali ke Beranda
        </Button>
      </div>
      
      {/* Komponen animasi perayaan */}
      <VerificationCelebration 
        active={showCelebration} 
        artifactName={artifact?.name}
      />
    </div>
  );
};

export default VerifyArtifact;
