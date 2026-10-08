import React from 'react';

/**
 * ScanlineOverlay Component
 * Renders atmospheric background cyber grid and subtle CRT scanlines.
 */
export const ScanlineOverlay = () => {
  return (
    <>
      <div className="fixed inset-0 bg-cyber-grid pointer-events-none opacity-40 z-0" />
      <div className="scanline-effect pointer-events-none" />
    </>
  );
};

export default ScanlineOverlay;

