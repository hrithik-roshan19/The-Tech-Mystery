import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Mobile UI/UX Responsiveness & Layout Guard Tests', () => {
  const readCss = (file) => fs.readFileSync(path.resolve(__dirname, file), 'utf8');

  it('1. index.css contains defensive global mobile overflow resets', () => {
    const css = readCss('styles/index.css');
    expect(css).toContain('box-sizing: border-box');
    expect(css).toContain('overflow-x: clip');
    expect(css).toContain('max-width: 100vw');
    expect(css).toContain('max-width: 100%');
    expect(css).toContain('word-break: break-word');
  });

  it('2. UserProfilePage.css includes mobile drawer scrim, telemetry, and 380px 1-col grid', () => {
    const css = readCss('styles/UserProfilePage.css');
    expect(css).toContain('.htg-up-mobile-scrim');
    expect(css).toContain('.htg-up-drawer-telemetry');
    expect(css).toContain('.htg-up-drawer-action');
    expect(css).toContain('@media (max-width: 820px)');
    expect(css).toContain('@media (max-width: 560px)');
    expect(css).toContain('@media (max-width: 380px)');
    expect(css).toContain('.htg-up-stat-grid');
    // Ensure data-pill in navbar is hidden on mobile to avoid overflow
    expect(css).toContain('.htg-up-navbar .htg-up-data-pill');
  });

  it('3. Navbar.css contains responsive media queries for 768px, 480px, and 360px', () => {
    const css = readCss('styles/Navbar.css');
    expect(css).toContain('@media (max-width: 768px)');
    expect(css).toContain('@media (max-width: 480px)');
    expect(css).toContain('@media (max-width: 360px)');
    expect(css).toContain('.htg-mobile-drawer-actions');
  });

  it('4. ChallengeLevelsPage.css restores difficulty badge on mobile and has no display:none on difficulty', () => {
    const css = readCss('styles/ChallengeLevelsPage.css');
    // Ensure display: none is not applied to difficulty
    expect(css).not.toMatch(/\.htg-difficulty\s*\{\s*display:\s*none/);
    expect(css).toContain('@media (max-width: 520px)');
    expect(css).toContain('@media (max-width: 360px)');
    expect(css).toContain('.htg-difficulty');
  });

  it('5. LeaderboardPage.css & JSX provides stacked mobile cards for viewports < 768px', () => {
    const css = readCss('styles/LeaderboardPage.css');
    const jsx = readCss('pages/public/LeaderboardPage.jsx');
    expect(css).toContain('.htg-lb-mobile-cards');
    expect(css).toContain('.htg-lb-mobile-card');
    expect(css).toContain('@media (max-width: 768px)');
    expect(jsx).toContain('htg-lb-mobile-cards');
    expect(jsx).toContain('htg-lb-mobile-card');
    // Clean unregistered squad state
    expect(jsx).toContain('userTeam.unregistered');
    expect(jsx).toContain('No Squad Linked');
  });

  it('6. QRCheckpointPage.css guarantees camera fluid sizing, break-all payloads, and 380px grid', () => {
    const css = readCss('styles/QRCheckpointPage.css');
    expect(css).toContain('word-break: break-all');
    expect(css).toContain('#htg-qr-reader');
    expect(css).toContain('@media(max-width:380px)');
    expect(css).toContain('.htg-qr-checkpoint-grid{grid-template-columns:1fr}');
  });

  it('7. TerminalWindow and CyberCard components have responsive wrapping and min-width constraints', () => {
    const terminalJsx = readCss('components/common/TerminalWindow.jsx');
    const cardJsx = readCss('components/common/CyberCard.jsx');
    expect(terminalJsx).toContain('flex-wrap');
    expect(terminalJsx).toContain('truncate');
    expect(cardJsx).toContain('flex-wrap');
    expect(cardJsx).toContain('break-words');
  });
});

