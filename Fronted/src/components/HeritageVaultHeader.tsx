import React from 'react';
import { Link } from 'wouter';

const HeritageVaultHeader: React.FC = () => {
  return (
    <header className="mb-8 w-full flex justify-center items-center">
      <Link href="/">
        <div className="flex flex-col items-center cursor-pointer w-full">
          <div className="flex justify-center w-full">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-primary tracking-wide mb-2 header-title">
              HERITAGEVAULT
            </h1>
          </div>
          <p className="text-sm text-gray-400 text-center px-2">Preservasi Budaya Indonesia dalam Blockchain</p>
        </div>
      </Link>
    </header>
  );
};

export default HeritageVaultHeader;
