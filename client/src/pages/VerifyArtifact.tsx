import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import HeritageVaultHeader from '@/components/HeritageVaultHeader';
import Footer from '@/components/Footer';
import { useArtifact } from '@/hooks/use-artifact';
import { ArrowLeft, Shield, Check, Loader2, AlertTriangle, Lock } from 'lucide-react';
import VerificationCelebration from '@/components/VerificationCelebration';

const VerifyArtifact: React.FC = () => {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { artifact, isLoading, verifyMutation, verifying, verified } = useArtifact(id);
  const [showCelebration, setShowCelebration] = useState(false);
  
  useEffect(() => {
    if (verified) {
      setShowCelebration(true);
      
      // Auto hide celebration after 5 seconds
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [verified]);
  
  const handleVerify = () => {
    if (artifact) {
      verifyMutation.mutate(artifact.id);
    }
  };
  
  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <HeritageVaultHeader />
        
        <Button 
          variant="outline" 
          className="mb-4"
          onClick={() => setLocation(artifact ? `/artifact/${artifact.id}` : '/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
        
        <h1 className="text-2xl font-display font-medium mb-6 text-center">
          <Shield className="inline-block mr-2 h-6 w-6 text-primary" />
          Verifikasi Keaslian Artefak
        </h1>
        
        {isLoading ? (
          <Card className="neon-border bg-card mb-8 p-6 text-center">
            <CardContent className="pt-6">
              <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin text-primary" />
              <p>Memuat data artefak...</p>
            </CardContent>
          </Card>
        ) : artifact ? (
          <>
            <Card className="neon-border bg-card mb-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-medium mb-4">{artifact.name}</h2>
                
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <img 
                      src={artifact.ipfsUrl || `/uploads/${artifact.imagePath.split('/').pop()}`} 
                      alt={artifact.name} 
                      className="w-full h-auto rounded-md border border-primary/30"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-sm text-muted-foreground mb-1">Deskripsi</h3>
                      <p className="text-sm">{artifact.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm text-muted-foreground mb-1">Jenis</h3>
                        <p className="text-sm font-medium">{artifact.type}</p>
                      </div>
                      <div>
                        <h3 className="text-sm text-muted-foreground mb-1">Asal</h3>
                        <p className="text-sm font-medium">{artifact.origin}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm text-muted-foreground mb-1">Status Verifikasi</h3>
                      {artifact.isVerified ? (
                        <div className="flex items-center gap-2 text-green-500">
                          <Check className="h-4 w-4" />
                          <span className="text-sm font-medium">Terverifikasi</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-yellow-500">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-sm font-medium">Belum Diverifikasi</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="neon-border bg-card mb-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-primary" />
                  Data Verifikasi Blockchain
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-1">Hash Verifikasi</h4>
                    <p className="text-xs font-mono bg-black/30 p-2 rounded-md overflow-x-auto">
                      {artifact.verificationHash}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-1">Hash Metadata</h4>
                    <p className="text-xs font-mono bg-black/30 p-2 rounded-md overflow-x-auto">
                      {artifact.metadataHash}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-1">IPFS CID</h4>
                    <p className="text-xs font-mono bg-black/30 p-2 rounded-md overflow-x-auto">
                      {artifact.ipfsCid || 'Tidak tersedia'}
                    </p>
                  </div>
                  
                  {artifact.verifiedAt && (
                    <div>
                      <h4 className="text-sm text-muted-foreground mb-1">Waktu Verifikasi</h4>
                      <p className="text-sm">
                        {new Date(artifact.verifiedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
                
                {!artifact.isVerified && (
                  <div className="mt-6">
                    <Button
                      className="w-full neon-border text-primary bg-card hover:bg-primary/10"
                      onClick={handleVerify}
                      disabled={verifying}
                    >
                      {verifying ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sedang Memverifikasi...
                        </>
                      ) : (
                        <>
                          <Shield className="mr-2 h-4 w-4" />
                          Verifikasi Artefak
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="neon-border bg-card mb-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Tentang Sistem Verifikasi</h3>
                <p className="text-sm mb-4">
                  Sistem verifikasi HeritageVault menggunakan hash kriptografis untuk memastikan bahwa 
                  artefak yang didaftarkan adalah asli dan belum dimodifikasi.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <p className="text-xs">Hash verifikasi dibuat dari kombinasi nama, deskripsi, dan data gambar artefak.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <p className="text-xs">Hash metadata dibuat dari informasi tambahan seperti asal, kreator, dan teknik pembuatan.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <p className="text-xs">Kedua hash disimpan di blockchain untuk verifikasi permanen dan tidak dapat diubah.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="neon-border bg-card mb-8 p-6 text-center">
            <CardContent className="pt-6">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <p>Artefak tidak ditemukan.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setLocation('/')}
              >
                Kembali ke Beranda
              </Button>
            </CardContent>
          </Card>
        )}
        
        <Footer />
      </div>
      
      <VerificationCelebration 
        active={showCelebration} 
        artifactName={artifact?.name}
      />
    </div>
  );
};

export default VerifyArtifact;
