import React from 'react';
import { useLocation } from 'wouter';
import FeatureCard from './FeatureCard';
import { Database, Shield, Cube, ArrowUpRight, CreditCard } from 'lucide-react';
import BatikIcon from './icons/BatikIcon';
import NFTIcon from './icons/NFTIcon';
import VerificationIcon from './icons/VerificationIcon';

const FeatureCards: React.FC = () => {
  const [, setLocation] = useLocation();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <FeatureCard
        icon={<VerificationIcon className="w-12 h-12 text-primary" />}
        title="Verifikasi Keaslian"
        description="Sistem verifikasi kriptografis yang memastikan keaslian setiap artefak budaya yang didaftarkan."
        rightIcon={<ArrowUpRight className="h-4 w-4" />}
        onClick={() => setLocation('/verify/1')}
      />
      
      <FeatureCard
        icon={<NFTIcon className="w-12 h-12 text-primary" />}
        title="NFT Berbasis ICP"
        description="Transformasi artefak fisik menjadi NFT di blockchain yang aman dan terdesentralisasi."
        rightIcon={<ArrowUpRight className="h-4 w-4" />}
        onClick={() => setLocation('/upload')}
      />
      
      <FeatureCard
        icon={<Cube className="w-12 h-12 text-primary" />}
        title="Visualisasi Metaverse"
        description="Jelajahi artefak budaya dalam lingkungan 3D interaktif dan augmented reality."
        rightIcon={<ArrowUpRight className="h-4 w-4" />}
        metaverse={true}
        onClick={() => setLocation('/metaverse')}
      />
      
      <FeatureCard
        icon={<Database className="w-12 h-12 text-primary" />}
        title="Penyimpanan IPFS"
        description="Data dan gambar artefak disimpan secara permanen di jaringan IPFS terdesentralisasi."
      />
      
      <FeatureCard
        icon={<BatikIcon className="w-12 h-12 text-primary" />}
        title="Dukungan Pengrajin"
        description="Program dukungan untuk pengrajin tradisional dengan sistem monetisasi langsung."
        price="Mulai Rp150.000/bln"
        onClick={() => setLocation('/subscribe')}
      />
      
      <FeatureCard
        icon={<Shield className="w-12 h-12 text-primary" />}
        title="Keamanan Blockchain"
        description="Perlindungan data menggunakan teknologi Internet Computer Protocol (ICP)."
      />
    </div>
  );
};

export default FeatureCards;
