import React from 'react';
import { Link } from 'wouter';
import FeatureCard from './FeatureCard';
import VerificationIcon from './icons/VerificationIcon';
import UploadIcon from './icons/UploadIcon';
import NFTIcon from './icons/NFTIcon';
import SupportIcon from './icons/SupportIcon';
import BatikIcon from './icons/BatikIcon';

const FeatureCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      <FeatureCard
        icon={<VerificationIcon className="w-12 h-12" />}
        title="Verifikasi Keaslian"
        description="Verifikasi keaslian artefak budaya menggunakan teknologi blockchain untuk mencegah pemalsuan dan menjaga integritas heritage."
        link="/verify"
      />
      
      <FeatureCard
        icon={<UploadIcon className="w-12 h-12" />}
        title="Upload Artefak"
        description="Unggah karya Anda untuk diverifikasi dan diubah menjadi NFT yang aman di Internet Computer Protocol."
        link="/upload"
      />
      
      <FeatureCard
        icon={<NFTIcon className="w-12 h-12" />}
        title="Artefak NFT"
        description="Koleksi NFT artefak budaya Indonesia yang telah diverifikasi dengan dukungan visual 3D interaktif."
      />
      
      <FeatureCard
        icon={<SupportIcon className="w-12 h-12" />}
        title="Dukung Pengrajin"
        description="Langganan bulanan untuk mendukung pengrajin lokal dan komunitas budaya tradisional."
        price="Rp 150.000/bulan"
      />
      
      <FeatureCard
        icon={<BatikIcon className="w-12 h-12" />}
        title="Batik & Tenun Digital"
        description="Lihat detail pola tradisional dengan narasi budaya yang menyertainya dalam format digital."
      />
      
      <FeatureCard
        title="Metaverse Experience"
        description="Jelajahi galeri virtual artefak budaya dalam lingkungan metaverse yang imersif."
        metaverse={true}
      />
    </div>
  );
};

export default FeatureCards;
