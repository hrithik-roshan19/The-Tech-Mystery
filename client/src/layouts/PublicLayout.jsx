import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import ScanlineOverlay from '../components/hud/ScanlineOverlay';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cyber-bg text-cyber-text relative">
      <ScanlineOverlay />
      <Navbar />
      <main className="flex-grow z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;

