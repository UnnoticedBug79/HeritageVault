import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import HeritageVaultHeader from '../components/HeritageVaultHeader';
import UploadIcon from '../components/icons/UploadIcon';
import { useArtifact } from '@/hooks/use-artifact';

// Definisi skema validasi form
const uploadSchema = z.object({
  name: z.string().min(3, { message: 'Nama artefak minimal 3 karakter' }),
  description: z.string().min(10, { message: 'Deskripsi minimal 10 karakter' }),
  type: z.string().min(1, { message: 'Pilih jenis artefak' }),
  origin: z.string().min(2, { message: 'Asal daerah minimal 2 karakter' }),
  price: z.string().transform((val) => parseInt(val)),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

const UploadArtifact: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const { uploadArtifact } = useArtifact();

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      name: '',
      description: '',
      type: '',
      origin: '',
      price: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: UploadFormValues) => {
    if (!selectedFile) {
      toast({
        title: 'Gambar Diperlukan',
        description: 'Pilih gambar artefak untuk diunggah',
        variant: 'destructive',
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      // Tambahkan data form ke formData
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      
      const result = await uploadArtifact.mutateAsync(formData);
      
      toast({
        title: 'Artefak Berhasil Diunggah',
        description: 'Artefak Anda telah berhasil diunggah dan siap untuk diverifikasi.',
      });
      
      // Redirect ke halaman detail artefak
      navigate(`/artifact/${result.id}`);
    } catch (error) {
      toast({
        title: 'Gagal Mengunggah Artefak',
        description: 'Terjadi kesalahan saat mengunggah artefak. Silakan coba lagi.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <HeritageVaultHeader />
      
      <div className="flex justify-center mb-8">
        <div className="w-24 h-24">
          <UploadIcon className="w-full h-full" />
        </div>
      </div>
      
      <h1 className="text-3xl font-display font-bold text-center mb-6 neon-text">Unggah Artefak Budaya</h1>
      <p className="text-gray-300 text-center mb-8 max-w-2xl mx-auto">
        Unggah artefak budaya Anda untuk diverifikasi dan didaftarkan di blockchain.
        Artefak yang terverifikasi akan mendapatkan sertifikat keaslian digital.
      </p>
      
      <Card className="p-6 max-w-2xl mx-auto neon-border bg-card/60 backdrop-blur-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Artefak</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Batik Parang Rusak" 
                          {...field} 
                          className="bg-background/50 border-primary/40"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenis Artefak</FormLabel>
                      <FormControl>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="bg-background/50 border-primary/40">
                            <SelectValue placeholder="Pilih jenis artefak" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="batik">Batik</SelectItem>
                            <SelectItem value="tenun">Tenun</SelectItem>
                            <SelectItem value="ukiran">Ukiran</SelectItem>
                            <SelectItem value="keris">Keris</SelectItem>
                            <SelectItem value="lainnya">Lainnya</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asal Daerah</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Yogyakarta" 
                          {...field} 
                          className="bg-background/50 border-primary/40"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Harga (Rp)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="2000000" 
                          type="number" 
                          {...field} 
                          className="bg-background/50 border-primary/40"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Jelaskan tentang artefak Anda, sejarah, dan keunikannya..." 
                          {...field} 
                          className="bg-background/50 border-primary/40 h-32"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-2">
                  <FormLabel>Gambar Artefak</FormLabel>
                  <div className="border-2 border-dashed border-primary/30 rounded-lg p-4 text-center">
                    {previewUrl ? (
                      <div className="space-y-2">
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="mx-auto max-h-40 object-contain rounded"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          className="text-sm"
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl(null);
                          }}
                        >
                          Ganti Gambar
                        </Button>
                      </div>
                    ) : (
                      <div className="py-4">
                        <Upload className="mx-auto h-10 w-10 text-primary/70 mb-2" />
                        <p className="text-gray-400 text-sm mb-2">
                          Unggah gambar artefak (JPG, PNG)
                        </p>
                        <Input
                          type="file"
                          accept="image/jpeg,image/png"
                          onChange={handleFileChange}
                          className="hidden"
                          id="artifact-image"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('artifact-image')?.click()}
                          className="border-primary/40"
                        >
                          Pilih Gambar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-primary/20 pt-6 flex justify-between">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-white"
              >
                Batal
              </Button>
              
              <Button 
                type="submit" 
                className="px-8 flex items-center gap-2"
                disabled={uploadArtifact.isPending}
              >
                {uploadArtifact.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Mengunggah...
                  </>
                ) : (
                  <>
                    Unggah Artefak
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default UploadArtifact;
