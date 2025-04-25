import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-12 text-center text-gray-400 text-sm pb-6">
      <p>© {new Date().getFullYear()} HeritageVault: NeonLoom</p>
      <p className="mt-1">Melestarikan Warisan Budaya Indonesia di Blockchain</p>
    </footer>
  );
};

export default Footer;
