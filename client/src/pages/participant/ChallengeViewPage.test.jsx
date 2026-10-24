// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ChallengeViewPageWrapper, { ChallengeViewPage } from './ChallengeViewPage';
import { challengeService } from '../../services/challenge.service';

vi.mock('../../services/challenge.service', () => ({
  challengeService: {
    getCurrentChallenge: vi.fn(),
    submitFlag: vi.fn(),
  }
}));

let mockUser = { id: 'user-1', name: 'Agent 47', role: 'TEAM_LEADER', teamId: 'team-1' };

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: mockUser,
    isAuthenticated: true,
    loading: false,
    logout: vi.fn()
  })
}));

describe('ChallengeViewPage Rendering States', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser = { id: 'user-1', name: 'Agent 47', role: 'TEAM_LEADER', teamId: 'team-1' };
  });

  it('renders loading state initially with cyberpunk spinner', () => {
    challengeService.getCurrentChallenge.mockReturnValue(new Promise(() => {}));
    render(
      <MemoryRouter>
        <ChallengeViewPageWrapper />
      </MemoryRouter>
    );
    expect(screen.getByText(/DECRYPTING CHALLENGE NODE/i)).toBeDefined();
  });

  it('renders squad required state if user has no teamId', async () => {
    mockUser = { id: 'user-2', name: 'Lone Wolf', role: 'PARTICIPANT', teamId: null };
    render(
      <MemoryRouter>
        <ChallengeViewPageWrapper />
      </MemoryRouter>
    );
    expect(screen.getByText(/SQUAD FORMATION REQUIRED/i)).toBeDefined();
    expect(screen.getByText(/Squad Affiliation Required/i)).toBeDefined();
    expect(screen.getByText(/INITIALIZE \/ JOIN SQUAD/i)).toBeDefined();
  });

  it('renders locked / checkpoint scan required state when 403 lock error occurs', async () => {
    const error = new Error('Physical checkpoint QR must be scanned');
    error.response = {
      status: 403,
      data: {
        success: false,
        message: 'Physical checkpoint QR must be scanned to unlock this level challenge',
        data: {
          isLocked: true,
          levelNumber: 1,
          checkpoint: { name: 'Library Beacon Alpha', locationDescription: '2nd Floor Stacks', code: 'CP-LIB-01' }
        }
      }
    };
    challengeService.getCurrentChallenge.mockRejectedValue(error);

    render(
      <MemoryRouter>
        <ChallengeViewPageWrapper />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/SECURITY LOCK ACTIVE \/\/ LEVEL 1/i)).toBeDefined();
      expect(screen.getByText(/Library Beacon Alpha/i)).toBeDefined();
      expect(screen.getByText(/OPEN QR SCANNER/i)).toBeDefined();
    });
  });

  it('renders event not live standby notice when event is in registration mode', async () => {
    const error = new Error('Event must be LIVE for gameplay');
    error.response = {
      status: 403,
      data: {
        success: false,
        message: 'Event must be LIVE for gameplay'
      }
    };
    challengeService.getCurrentChallenge.mockRejectedValue(error);

    render(
      <MemoryRouter>
        <ChallengeViewPageWrapper />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/SYSTEM STANDBY \/\/ EVENT LIFECYCLE NOTICE/i)).toBeDefined();
      expect(screen.getByText(/Event Awaiting Official Commencement/i)).toBeDefined();
      expect(screen.getByText(/Event must be LIVE for gameplay/i)).toBeDefined();
      expect(screen.getByText(/CHECK LIVE STATUS/i)).toBeDefined();
    });
  });

  it('renders team size warning when team does not meet size requirement', async () => {
    const error = new Error('Team does not meet event team-size requirements');
    error.response = {
      status: 403,
      data: {
        success: false,
        message: 'Team does not meet event team-size requirements'
      }
    };
    challengeService.getCurrentChallenge.mockRejectedValue(error);

    render(
      <MemoryRouter>
        <ChallengeViewPageWrapper />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/SQUAD VERIFICATION \/\/ TEAM SIZE NOTICE/i)).toBeDefined();
      expect(screen.getByText(/Minimum Squad Size Not Met/i)).toBeDefined();
      expect(screen.getByText(/MANAGE SQUAD ROSTER/i)).toBeDefined();
    });
  });

  it('renders generic API connection error with retry button', async () => {
    const error = new Error('Connection timed out');
    error.response = {
      status: 500,
      data: {
        success: false,
        message: 'Database query failed or timed out'
      }
    };
    challengeService.getCurrentChallenge.mockRejectedValue(error);

    render(
      <MemoryRouter>
        <ChallengeViewPageWrapper />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/TERMINAL LINK EXCEPTION \/\/ ACCESS BLOCKED/i)).toBeDefined();
      expect(screen.getByText(/Database query failed or timed out/i)).toBeDefined();
      expect(screen.getByText(/RETRY CONNECTION/i)).toBeDefined();
    });
  });

  it('renders active question, prompt, sequence and submission form when question is returned', async () => {
    challengeService.getCurrentChallenge.mockResolvedValue({
      success: true,
      data: {
        levelNumber: 1,
        challenge: {
          title: 'Sector Alpha Infiltration',
          category: 'Orientation',
          points: 100,
          difficulty: 'Easy',
          description: 'Decode the cipher'
        },
        question: {
          _id: 'q-caesar-1',
          title: 'Caesar Cipher Decryption',
          prompt: 'Decode the intercepted string: KHOOR ZRUOG',
          instructions: 'Use classical shift of 3.',
          difficulty: 'Easy',
          type: 'Flag',
          points: 100,
          attempts: 5,
          assetUrls: ['https://example.com/artifact1.pcap']
        },
        sequenceNumber: 2,
        totalQuestions: 4,
        solvedCount: 1,
        teamChallenge: { attemptsCount: 1 }
      }
    });

    render(
      <MemoryRouter>
        <ChallengeViewPageWrapper />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Caesar Cipher Decryption/i)).toBeDefined();
      expect(screen.getByText(/Decode the intercepted string: KHOOR ZRUOG/i)).toBeDefined();
      expect(screen.getByText(/Use classical shift of 3/i)).toBeDefined();
      expect(screen.getByText(/ATTACHMENT_1/i)).toBeDefined();
      expect(screen.getByText(/QUESTION 2 OF 4/i)).toBeDefined();
      expect(screen.getByText(/1 SOLVED/i)).toBeDefined();
      expect(screen.getByText(/\+100 PTS/i)).toBeDefined();
      expect(screen.getByText(/SUBMIT ANSWER/i)).toBeDefined();
    });
  });

  it('renders Multiple Choice option buttons when question type is Multiple Choice', async () => {
    challengeService.getCurrentChallenge.mockResolvedValue({
      success: true,
      data: {
        levelNumber: 2,
        challenge: { title: 'Web App Security' },
        question: {
          _id: 'q-mc-1',
          title: 'HTTP Status Identification',
          prompt: 'What status indicates Forbidden access?',
          type: 'Multiple Choice',
          options: ['200 OK', '401 Unauthorized', '403 Forbidden', '500 Server Error'],
          points: 150
        },
        sequenceNumber: 1,
        totalQuestions: 1
      }
    });

    render(
      <MemoryRouter>
        <ChallengeViewPageWrapper />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/HTTP Status Identification/i)).toBeDefined();
      expect(screen.getByText('403 Forbidden')).toBeDefined();
      expect(screen.getByText('200 OK')).toBeDefined();
    });
  });

  it('renders empty question bank state when no questions exist for level', async () => {
    challengeService.getCurrentChallenge.mockResolvedValue({
      success: true,
      data: {
        levelNumber: 3,
        challenge: { title: 'Binary Vault' },
        question: null,
        emptyReason: 'No questions are configured for this level'
      }
    });

    render(
      <MemoryRouter>
        <ChallengeViewPageWrapper />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/No Questions Configured For This Level/i)).toBeDefined();
      expect(screen.getByText(/VIEW QR STATIONS/i)).toBeDefined();
    });
  });

  it('renders grand victory screen when all levels are complete', async () => {
    challengeService.getCurrentChallenge.mockResolvedValue({
      success: true,
      data: {
        isEventComplete: true,
        levelNumber: 10,
        message: 'All challenges conquered'
      }
    });

    render(
      <MemoryRouter>
        <ChallengeViewPageWrapper />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/ALL CHALLENGES CONQUERED/i)).toBeDefined();
      expect(screen.getByText(/SUBMIT FINAL FLAG/i)).toBeDefined();
      expect(screen.getByText(/VIEW LEADERBOARD/i)).toBeDefined();
    });
  });
});
