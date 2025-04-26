import React, { useState } from 'react';
import { useLocation } from 'wouter';
import HeritageVaultHeader from '@/components/HeritageVaultHeader';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import UploadIcon from '@/components/icons/UploadIcon';
import { Database, CheckCircle2, Loader2 } from 'lucide-react';

const UploadArtifact: React.FC = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [artifactName, setArtifactName] = useState('');
  const [artifactDescription, setArtifactDescription] = useState('');
  const [artifactType, setArtifactType] = useState('');
  const [artifactOrigin, setArtifactOrigin] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Upload ke IPFS terlebih dahulu, lalu ke NFT/ICP
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      setIsLoading(true);
      
      // Step 1: Upload to IPFS
      const ipfsResponse = await apiRequest('POST', '/api/upload', formData);
      const ipfsData = await ipfsResponse.json();
      
      if (!ipfsData || !ipfsData.cid) {
        throw new Error('IPFS upload failed');
      }
      
      // Step 2: Add IPFS data to form and create NFT
      formData.append('ipfsCid', ipfsData.cid);
      formData.append('ipfsUrl', ipfsData.url);
      formData.append('metadataHash', ipfsData.metadataHash);
      
      // Final step: Upload to NFT/ICP
      return await apiRequest('POST', '/api/artifacts', formData);
    },
    onSuccess: () => {
      setIsLoading(false);
      queryClient.invalidateQueries({ queryKey: ['/api/artifacts'] });
      toast({
        title: "Berhasil Diunggah",
        description: "Artefak budaya telah berhasil diunggah sebagai NFT dengan penyimpanan IPFS terdesentralisasi",
      });
      setLocation('/');
    },
    onError: (error) => {
      setIsLoading(false);
      toast({
        title: "Gagal Mengunggah",
        description: "Terjadi kesalahan saat mengunggah. Silakan coba lagi.",
        variant: "destructive",
      });
      console.error(error);
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "File Diperlukan",
        description: "Mohon pilih file gambar artefak untuk diunggah",
        variant: "destructive",
      });
      return;
    }

    if (!artifactName || !artifactDescription || !artifactType || !artifactOrigin || !price) {
      toast({
        title: "Data Belum Lengkap",
        description: "Mohon lengkapi semua informasi artefak",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', artifactName);
    formData.append('description', artifactDescription);
    formData.append('type', artifactType);
    formData.append('origin', artifactOrigin);
    formData.append('price', price);
    formData.append('file', file);
    formData.append('tags', `${artifactType},${artifactOrigin},indonesia,heritage`);
    
    uploadMutation.mutate(formData);
  };

  // Loading state dengan animasi yang lebih menarik
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80 font-sans flex flex-col items-center justify-center overflow-hidden">
        <HeritageVaultHeader />
        
        <div className="text-center p-8 relative">
          {/* Cyber animation container */}
          <div className="relative w-40 h-40 mx-auto mb-6">
            {/* Pulsing circle */}
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping-slow"></div>
            
            {/* Rotating rings */}
            <div className="absolute inset-2 border-2 border-primary/50 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-4 border-2 border-primary/30 rounded-full animate-reverse-spin"></div>
            <div className="absolute inset-6 border-2 border-primary/20 rounded-full animate-spin-slow"></div>
            
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative bg-black/30 backdrop-blur-sm p-4 rounded-xl border border-primary/40">
                <Database className="h-10 w-10 text-primary animate-pulse" />
              </div>
            </div>
            
            {/* Particles */}
            {Array.from({ length: 10 }).map((_, i) => (
              <div 
                key={i} 
                className="absolute w-1 h-1 bg-primary rounded-full animate-float-particle"
                style={{ 
                  left: `${Math.random() * 100}%`, 
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  opacity: Math.random() * 0.7
                }}
              />
            ))}
          </div>
          
          <h2 className="text-2xl font-display font-medium neon-text mb-2 animate-pulse">
            Menyimpan Warisan Budaya...
          </h2>
          
          <div className="max-w-md mx-auto space-y-2">
            <p className="text-muted-foreground">
              Artefak sedang diunggah ke penyimpanan IPFS terdesentralisasi dan 
              didaftarkan sebagai NFT di Internet Computer (ICP).
            </p>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-primary/70">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-ping"></div>
              <span>Mengamankan artefak budaya Indonesia</span>
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" style={{ animationDelay: '0.3s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <HeritageVaultHeader />
        
        <Card className="neon-border bg-card mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center mb-4">
              <UploadIcon className="w-8 h-8 text-primary mr-2" />
              <h2 className="text-2xl font-display font-medium neon-text">Unggah Karya Budaya</h2>
            </div>
            
            {/* IPFS Info Banner */}
            <div className="flex items-center mb-6 p-3 border border-primary/30 rounded-md bg-card/60">
              <Database className="h-5 w-5 text-primary mr-2" />
              <div>
                <span className="font-medium">Penyimpanan IPFS Terdesentralisasi</span>
                <p className="text-xs text-muted-foreground">Artefak akan disimpan di jaringan IPFS secara otomatis</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Label htmlFor="artifactName">Nama Artefak</Label>
                <Input 
                  id="artifactName" 
                  value={artifactName} 
                  onChange={(e) => setArtifactName(e.target.value)} 
                  className="mt-1 bg-background"
                  required
                />
              </div>
              
              <div className="mb-4">
                <Label htmlFor="artifactDescription">Deskripsi</Label>
                <Textarea 
                  id="artifactDescription" 
                  value={artifactDescription} 
                  onChange={(e) => setArtifactDescription(e.target.value)} 
                  className="mt-1 bg-background"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="artifactType">Jenis</Label>
                  <Select value={artifactType} onValueChange={setArtifactType} required>
                    <SelectTrigger className="mt-1 bg-background">
                      <SelectValue placeholder="Pilih jenis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="batik">Batik</SelectItem>
                      <SelectItem value="tenun">Tenun</SelectItem>
                      <SelectItem value="ukiran">Ukiran</SelectItem>
                      <SelectItem value="patung">Patung</SelectItem>
                      <SelectItem value="other">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="artifactOrigin">Asal Daerah</Label>
                  <Input 
                    id="artifactOrigin" 
                    value={artifactOrigin} 
                    onChange={(e) => setArtifactOrigin(e.target.value)} 
                    className="mt-1 bg-background"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <Label htmlFor="price">Harga (Rp)</Label>
                <Input 
                  id="price" 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                  className="mt-1 bg-background"
                  type="number"
                  required
                />
              </div>
              
              <div className="mb-6">
                <Label htmlFor="file">Upload Gambar</Label>
                <div className="mt-1 flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-6">
                  {previewUrl ? (
                    <div className="text-center">
                      <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto mb-2" />
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setFile(null);
                          setPreviewUrl(null);
                        }}
                      >
                        Ganti Gambar
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <UploadIcon className="w-10 h-10 text-primary mx-auto mb-2" />
                      <p className="mb-2">Klik untuk memilih file atau seret dan lepas</p>
                      <Input 
                        id="file" 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                      />
                      <Button variant="outline" onClick={() => document.getElementById('file')?.click()}>
                        Pilih File
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <Button 
                  type="submit" 
                  className="w-full neon-border text-primary bg-card hover:bg-primary/10"
                  disabled={uploadMutation.isPending || isLoading}
                >
                  {uploadMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sedang Mengunggah...
                    </>
                  ) : "Unggah Sebagai NFT"}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setLocation('/')}
                  type="button"
                >
                  Kembali ke Beranda
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Footer />
      </div>
    </div>
  );
};

export default UploadArtifact;
