import React from 'react';
import { Link } from 'wouter';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto py-4 text-center text-sm text-muted-foreground">
      <div className="flex flex-col items-center justify-center space-y-2">
        <div className="text-xs">
          Powered by <span className="text-primary">Internet Computer Protocol</span> & <span className="text-primary">IPFS</span>
        </div>
        <div className="flex space-x-4">
          <Link href="/">
            <a className="hover:text-primary transition-colors">Beranda</a>
          </Link>
          <Link href="/upload">
            <a className="hover:text-primary transition-colors">Unggah</a>
          </Link>
          <Link href="/metaverse">
            <a className="hover:text-primary transition-colors">Metaverse</a>
          </Link>
        </div>
        <div className="text-xs">
          &copy; {new Date().getFullYear()} HeritageVault-ICP. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
