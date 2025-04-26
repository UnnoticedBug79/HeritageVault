import React from 'react';
import { useParams, useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import HeritageVaultHeader from '@/components/HeritageVaultHeader';
import Footer from '@/components/Footer';
import { useArtifact } from '@/hooks/use-artifact';
import { ArrowLeft, Shield, Check, AlertTriangle, Loader2, Eye3d } from 'lucide-react';

const ViewArtifact: React.FC = () => {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { artifact, isLoading } = useArtifact(id);
  
  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <HeritageVaultHeader />
        
        <Button 
          variant="outline" 
          className="mb-4"
          onClick={() => setLocation('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Beranda
        </Button>
        
        {isLoading ? (
          <Card className="neon-border bg-card mb-8 p-6 text-center">
            <CardContent className="pt-6">
              <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin text-primary" />
              <p>Memuat data artefak...</p>
            </CardContent>
          </Card>
        ) : artifact ? (
          <>
            <h1 className="text-2xl font-display font-medium mb-4">{artifact.name}</h1>
            
            <Card className="neon-border bg-card mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <img 
                      src={artifact.ipfsUrl || `/uploads/${artifact.imagePath.split('/').pop()}`} 
                      alt={artifact.name} 
                      className="w-full h-auto rounded-md border border-primary/30"
                    />
                    
                    <div className="mt-4 flex justify-between">
                      <Button 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => setLocation(`/metaverse?id=${artifact.id}`)}
                      >
                        <Eye3d className="h-3 w-3 mr-2" />
                        Lihat di Metaverse
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => setLocation(`/verify/${artifact.id}`)}
                      >
                        <Shield className="h-3 w-3 mr-2" />
                        Verifikasi
                      </Button>
                    </div>
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
                      <h3 className="text-sm text-muted-foreground mb-1">Harga</h3>
                      <p className="text-sm font-medium">
                        Rp {artifact.price.toLocaleString('id-ID')}
                      </p>
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
                    
                    <div>
                      <h3 className="text-sm text-muted-foreground mb-1">Penyimpanan IPFS</h3>
                      {artifact.ipfsCid ? (
                        <div className="flex items-center gap-2 text-primary">
                          <Check className="h-4 w-4" />
                          <span className="text-sm font-medium">Tersimpan di IPFS</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-yellow-500">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-sm font-medium">Belum disimpan di IPFS</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-sm text-muted-foreground mb-1">Dibuat Pada</h3>
                      <p className="text-sm">
                        {new Date(artifact.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Button
                className="neon-border text-primary bg-card hover:bg-primary/10"
                onClick={() => window.open(artifact.ipfsUrl, '_blank')}
                disabled={!artifact.ipfsUrl}
              >
                Lihat di IPFS Gateway
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setLocation(`/verify/${artifact.id}`)}
              >
                <Shield className="mr-2 h-4 w-4" />
                Verifikasi Artefak
              </Button>
            </div>
          </>
        ) : (
          <Card className="neon-border bg-card mb-8 p-6 text-center">
            <CardContent className="pt-6">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <p>Artefak tidak ditemukan.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setLocation('
