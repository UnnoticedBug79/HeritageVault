import React from 'react';
import { Link } from 'wouter';

const HeritageVaultHeader: React.FC = () => {
  return (
    <header className="mb-8 py-4 text-center">
      <Link href="/">
        <a className="inline-block">
          <h1 className="text-4xl font-display font-bold header-title neon-text">
            HeritageVault<span className="text-primary">ICP</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Melestarikan Warisan Budaya Indonesia dalam Blockchain
          </p>
        </a>
      </Link>
    </header>
  );
};

export default HeritageVaultHeader;
