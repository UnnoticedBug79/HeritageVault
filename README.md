# HeritageVault-ICP: Melestarikan Warisan Budaya Indonesia

<p align="center">
  <img src="generated-icon.png" alt="HeritageVault Logo" width="150"/>
</p>

## 🌟 Tentang Proyek

HeritageVault adalah platform Web3 cutting-edge yang menggabungkan teknologi blockchain dengan warisan budaya Indonesia. Dibangun di atas Internet Computer Protocol (ICP), platform ini menawarkan solusi inovatif untuk preservasi, verifikasi, dan monetisasi artefak budaya tradisional seperti batik, tenun, dan ukiran melalui teknologi NFT dan metaverse.

## ✨ Fitur Utama

- **Digitalisasi Artefak Budaya**: Upload dan preservasi artefak tradisional sebagai NFT terverifikasi
  
- **Penyimpanan Terdesentralisasi**: Integrasi IPFS via Pinata untuk penyimpanan gambar yang permanen
  
- **Verifikasi Kriptografis**: Sistem hash canggih untuk memverifikasi keaslian artefak budaya
  
- **Visualisasi 3D & AR**: Pengalaman immersive untuk mengeksplorasi artefak dalam lingkungan metaverse
  
- **Antarmuka Cyberpunk**: Desain UI futuristik dengan animasi khas cyberpunk yang memukau

## 🚀 Teknologi

- **Blockchain**: Internet Computer Protocol (ICP) untuk aplikasi blockchain terdesentralisasi
  
- **Storage**: IPFS via Pinata untuk penyimpanan gambar permanen dan terdesentralisasi
  
- **Frontend**: React + TypeScript dengan UI modern bergaya cyberpunk/neon
  
- **Backend**: Express.js untuk API dan Motoko untuk canister ICP
  
- **Styling**: Tailwind CSS + Shadcn UI untuk komponen modern yang responsif
  
- **Authentication**: Internet Identity untuk login terenkripsi berbasis blockchain
  
- **Visualisasi**: Pengalaman immersive dengan dukungan 3D dan Augmented Reality

## 📦 Struktur Proyek
├── client/ # Frontend Express React
│ ├── src/
│ │ ├── components/ # Komponen React
│ │ ├── hooks/ # Custom hooks
│ │ ├── lib/ # Utilitas dan fungsi
│ │ ├── pages/ # Halaman aplikasi
│ │ └── ...
├── server/ # Express server
├── src/ # Motoko ICP canister
│ ├── heritageVault_backend/ # Canister backend
│ │ ├── main.mo # Entry point
│ │ ├── types.mo # Tipe data
│ │ ├── verification.mo # Modul verifikasi
│ │ └── token.mo # Modul token NFT
│ └── heritageVault_frontend/ # ICP frontend
├── dfx.json # Konfigurasi ICP
└── ...


## 🔧 Instalasi & Pengembangan

### Prasyarat
- Node.js (versi 16 atau lebih tinggi)
- DFX CLI untuk Internet Computer
- Git

### Langkah Instalasi

1. Clone repository
   
       ```
   git clone https://github.com/Alufeed12/heritage-vault.git
   cd heritage-vault

   Instal dependensi
2.Instal dependensi
    
       '''
       npm install

3. Jalankan aplikasi di lingkungan pengembangan

       '''
       npm run dev

4. Deploy ke ICP
   
       '''
       dfx deploy

 🔮 Penggunaan
1. Upload Artefak
Dokumentasikan artefak budaya dengan mengupload gambar, deskripsi, dan metadata. Artefak akan disimpan di blockchain sebagai NFT.

2. Verifikasi Keaslian
Verifikasi keaslian artefak menggunakan sistem hash kriptografis yang menghubungkan metadata dengan gambar asli.

3. Berlangganan untuk Mendukung Pengrajin
Dukung pengrajin lokal dengan berlangganan bulanan atau tahunan melalui sistem token ICP.

4. Eksplorasi Metaverse
Lihat artefak dalam lingkungan 3D dan Augmented Reality dengan narasi budaya yang mendalam.

🔍 Sistem Verifikasi Keaslian
HeritageVault menggunakan sistem hash kriptografis canggih untuk memverifikasi keaslian artefak:

Cara Kerja Verifikasi:


1. Proses Hashing:

 a). Saat upload, sistem     menghasilkan dua hash terpisah:
    -verificationHash:  Hash dari       kombinasi nama, deskripsi,         gambar, dan metadata
     -metadataHash: Hash khusus          untuk data metadata  
      (pengrajin, teknik, dll.)
      
  b).Kedua hash ini tersimpan di     blockchain bersama NFT artefak


2. Proses Verifikasi:

-Pengguna dapat memverifikasi artefak dengan mengirimkan ID artefak
-Sistem mengambil data asli dari blockchain dan meregenerasi hash
-Jika hash baru = hash tersimpan, artefak dinyatakan asli
-Jika berbeda, artefak telah dimodifikasi dan tidak asli

3.Alur Data Verifikasi:

[Data Artefak] → [Algoritma Hash] → [Hash Tersimpan]
                                      ↑
[Data Artefak] → [Algoritma Hash] → [Hash Baru] → [Komparasi]


Semua proses verifikasi diimplementasikan di modul verification.mo dan tercatat secara transparan di blockchain.

🔬 Uji Coba Fungsi ICP
Untuk mengujicoba fungsi Internet Computer Protocol (ICP) dalam aplikasi:

Persiapan Lingkungan ICP
1. Pastikan DFX CLI terinstal
   
       '''
       sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"

 2.Mulai replica ICP lokal

    '''
    dfx start --background

 3.Deploy canister ke replica lokal
      
      ''''
      dfx deploy


Tim : UnnoticedBug79
- Hari Hardiyan
- M Raffi Firdaus
- M Akbar

