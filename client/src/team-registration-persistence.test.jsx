// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const fixture = vi.hoisted(() => ({
  auth: {
    loading: false,
    identityAuthenticated: true,
    isAuthenticated: true,
    user: {
      _id: 'user_leader_1',
      id: 'user_leader_1',
      fullName: 'Alice Commander',
      email: 'alice@example.com',
      phone: '9876543210',
      collegeRollNo: 'TU-1001',
      role: 'TEAM_MEMBER',
      teamId: null,
    },
    refreshUser: vi.fn(),
    updateTeamMembership: vi.fn(),
  },
  createTeamMock: vi.fn(),
  getAllTeamsMock: vi.fn(),
  approveTeamMock: vi.fn(),
}));

vi.mock('@clerk/react', () => ({
  ClerkProvider: ({ children }) => <>{children}</>,
  useAuth: () => ({ isLoaded: true, isSignedIn: true, getToken: async () => 'test_token' }),
  useUser: () => ({ isLoaded: true, isSignedIn: true, user: { id: 'clerk_u1' } }),
  useClerk: () => ({ signOut: vi.fn() }),
  SignIn: () => <div>Clerk SignIn</div>,
  SignUp: () => <div>Clerk SignUp</div>,
}));

vi.mock('./hooks/useAuth', () => ({
  useAuth: () => fixture.auth,
}));

vi.mock('./services/team.service', () => ({
  teamService: {
    createTeam: (...args) => fixture.createTeamMock(...args),
    joinTeam: vi.fn(),
    getMyTeam: vi.fn(),
  },
}));

vi.mock('./services/admin.service', () => ({
  adminService: {
    getAllTeams: (...args) => fixture.getAllTeamsMock(...args),
    approveTeam: (...args) => fixture.approveTeamMock(...args),
    updateTeamDisqualification: vi.fn(),
    deleteTeam: vi.fn(),
    updateTeam: vi.fn(),
    addTeamMember: vi.fn(),
    removeTeamMember: vi.fn(),
    getDashboardStats: vi.fn().mockResolvedValue({ stats: {}, eventConfig: {} }),
  },
}));

vi.mock('./services/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: { success: true, data: {} } }),
    post: vi.fn().mockResolvedValue({ data: { success: true, data: {} } }),
    patch: vi.fn().mockResolvedValue({ data: { success: true, data: {} } }),
    delete: vi.fn().mockResolvedValue({ data: { success: true, data: {} } }),
  },
  setSessionTokenGetter: vi.fn(),
  setCachedToken: vi.fn(),
  isClerkMode: () => true,
  getNormalizedApiBaseUrl: () => 'http://localhost:5000/api/v1',
}));

import RegisterPage from './pages/public/RegisterPage';
import { TeamManagementPage } from './pages/admin/TeamManagementPage';

beforeEach(() => {
  vi.clearAllMocks();
  fixture.auth = {
    loading: false,
    identityAuthenticated: true,
    isAuthenticated: true,
    user: {
      _id: 'user_leader_1',
      id: 'user_leader_1',
      fullName: 'Alice Commander',
      email: 'alice@example.com',
      phone: '9876543210',
      collegeRollNo: 'TU-1001',
      role: 'TEAM_MEMBER',
      teamId: null,
    },
    refreshUser: vi.fn(),
    updateTeamMembership: vi.fn(),
  };
});

afterEach(() => {
  cleanup();
});

describe('Authenticated Team Registration & Member Persistence Flow', () => {
  it('1. Wizard captures 1 leader + 2 teammates and sends complete payload with members to createTeam', async () => {
    const createdTeamResult = {
      _id: 'team_cyber_123',
      name: 'CyberDefenders',
      college: "Tula's University, Dehradun",
      motto: 'Always Vigilant',
      joinCode: 'HTG-ABC12345',
      status: 'Pending',
      members: ['user_leader_1', 'user_m2', 'user_m3'],
    };

    fixture.createTeamMock.mockResolvedValueOnce({
      success: true,
      data: { team: createdTeamResult },
    });

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    // Step 0: Team Details
    const teamNameInput = screen.getByPlaceholderText('Enter your team name (min 3 chars)');
    fireEvent.change(teamNameInput, { target: { value: 'CyberDefenders' } });

    const mottoInput = screen.getByPlaceholderText('e.g. Decode. Infiltrate. Conquer.');
    fireEvent.change(mottoInput, { target: { value: 'Always Vigilant' } });

    // Advance to Step 1: Team Leader
    fireEvent.click(screen.getByText(/Next: Team Leader/i));

    // Step 1: Team Leader (fields auto-populated from authenticated user)
    expect(screen.getByDisplayValue('Alice Commander')).toBeTruthy();
    expect(screen.getByDisplayValue('alice@example.com')).toBeTruthy();

    // Advance to Step 2: Team Members
    fireEvent.click(screen.getByText(/Next: Team Members/i));

    // Step 2: Enter 2 teammates (Member 2 and Member 3)
    const member2Name = screen.getByPlaceholderText('Member 2 name (optional)');
    fireEvent.change(member2Name, { target: { value: 'Bob Operative' } });

    const emailInputs = screen.getAllByPlaceholderText('Email address');
    fireEvent.change(emailInputs[0], { target: { value: 'bob@tulas.edu.in' } });

    const member3Name = screen.getByPlaceholderText('Member 3 name (optional)');
    fireEvent.change(member3Name, { target: { value: 'Charlie Operative' } });
    fireEvent.change(emailInputs[1], { target: { value: 'charlie@tulas.edu.in' } });

    // Advance to Step 3: Review
    fireEvent.click(screen.getByText(/Review Registration/i));

    // Step 3: Review details
    expect(screen.getByText('CyberDefenders')).toBeTruthy();
    expect(screen.getByText(/Leader \+ 2 operative\(s\) \(3 total\)/i)).toBeTruthy();
    expect(screen.getByText(/Bob Operative \(bob@tulas.edu.in\)/i)).toBeTruthy();
    expect(screen.getByText(/Charlie Operative \(charlie@tulas.edu.in\)/i)).toBeTruthy();

    // Check terms checkbox and submit
    const termsCheckbox = screen.getByRole('checkbox');
    fireEvent.click(termsCheckbox);

    const submitBtn = screen.getByText(/Create Team & Enter the Grid/i);
    fireEvent.click(submitBtn);

    // Verify exact payload sent to teamService.createTeam
    await waitFor(() => {
      expect(fixture.createTeamMock).toHaveBeenCalledTimes(1);
    });

    const sentPayload = fixture.createTeamMock.mock.calls[0][0];
    expect(sentPayload.name).toBe('CyberDefenders');
    expect(sentPayload.college).toBe("Tula's University, Dehradun");
    expect(sentPayload.motto).toBe('Always Vigilant');
    expect(sentPayload.members).toEqual([
      { name: 'Bob Operative', email: 'bob@tulas.edu.in' },
      { name: 'Charlie Operative', email: 'charlie@tulas.edu.in' },
    ]);

    // Verify success confirmation view renders join code and does not immediately crash/redirect
    expect(await screen.findByText('Squad Enrolled Successfully!')).toBeTruthy();
    expect(screen.getByText('HTG-ABC12345')).toBeTruthy();
  });

  it('2. Admin TeamManagementPage displays complete roster count and enables Approve Team button', async () => {
    const mockTeams = [
      {
        _id: 'team_cyber_123',
        name: 'CyberDefenders',
        college: "Tula's University",
        joinCode: 'HTG-ABC12345',
        status: 'Pending',
        currentLevel: 1,
        totalScore: 0,
        isDisqualified: false,
        leaderId: {
          _id: 'user_leader_1',
          fullName: 'Alice Commander',
          email: 'alice@example.com',
          role: 'TEAM_LEADER',
          isActive: true,
        },
        members: [
          {
            _id: 'user_leader_1',
            fullName: 'Alice Commander',
            email: 'alice@example.com',
            role: 'TEAM_LEADER',
            isActive: true,
          },
          {
            _id: 'user_m2',
            fullName: 'Bob Operative',
            email: 'bob@tulas.edu.in',
            role: 'TEAM_MEMBER',
            isActive: true,
          },
          {
            _id: 'user_m3',
            fullName: 'Charlie Operative',
            email: 'charlie@tulas.edu.in',
            role: 'TEAM_MEMBER',
            isActive: true,
          },
        ],
      },
    ];

    fixture.getAllTeamsMock.mockResolvedValueOnce({
      success: true,
      data: { teams: mockTeams },
    });

    fixture.approveTeamMock.mockResolvedValueOnce({
      success: true,
      message: 'Team "CyberDefenders" has been approved and activated for gameplay',
      data: {
        team: {
          ...mockTeams[0],
          status: 'Active',
        },
      },
    });

    render(
      <MemoryRouter>
        <TeamManagementPage />
      </MemoryRouter>
    );

    // Total Participants should be 3
    const teamNameOccurrences = await screen.findAllByText('CyberDefenders');
    expect(teamNameOccurrences.length).toBeGreaterThan(0);
    const statCards = screen.getAllByRole('article');
    const participantCard = statCards.find((c) => c.textContent.includes('Total Participants'));
    expect(participantCard.textContent).toContain('3');

    // Selected team member section should show 3 members
    expect(screen.getByText(/Team Members \(3\)/i)).toBeTruthy();
    expect(screen.getByText('Bob Operative')).toBeTruthy();
    expect(screen.getByText(/bob@tulas\.edu\.in/i)).toBeTruthy();
    expect(screen.getByText('Charlie Operative')).toBeTruthy();
    expect(screen.getByText(/charlie@tulas\.edu\.in/i)).toBeTruthy();

    // Approve Team button should be present for Pending team with >= 2 members
    const approveBtn = screen.getByText('✓ Approve Team');
    expect(approveBtn).toBeTruthy();

    // Mock confirm dialog
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    fireEvent.click(approveBtn);

    await waitFor(() => {
      expect(fixture.approveTeamMock).toHaveBeenCalledWith('team_cyber_123');
    });

    // After approval, team status badge should update to Active and Approve button should disappear
    await waitFor(() => {
      expect(screen.queryByText('✓ Approve Team')).toBeNull();
    });
  });

  it('3. Regression: Pending team with 3 members (like Techbaaz) displays functional Approve Team button and transitions to Active', async () => {
    const techbaazTeam = {
      _id: 'team_techbaaz_999',
      name: 'Techbaaz',
      college: "Tula's University",
      joinCode: 'TBZ-778899',
      status: 'Pending',
      currentLevel: 1,
      totalScore: 0,
      isDisqualified: false,
      leaderId: {
        _id: 'user_tbz_leader',
        fullName: 'Techbaaz Leader',
        email: 'tbz_leader@tulas.edu.in',
        role: 'TEAM_LEADER',
        isActive: true,
      },
      members: [
        {
          _id: 'user_tbz_leader',
          fullName: 'Techbaaz Leader',
          email: 'tbz_leader@tulas.edu.in',
          role: 'TEAM_LEADER',
          isActive: true,
        },
        {
          _id: 'user_tbz_m2',
          fullName: 'Operative Two',
          email: 'op2@tulas.edu.in',
          role: 'TEAM_MEMBER',
          isActive: true,
        },
        {
          _id: 'user_tbz_m3',
          fullName: 'Operative Three',
          email: 'op3@tulas.edu.in',
          role: 'TEAM_MEMBER',
          isActive: true,
        },
      ],
    };

    fixture.getAllTeamsMock.mockResolvedValueOnce({
      success: true,
      data: { teams: [techbaazTeam] },
    });

    fixture.approveTeamMock.mockResolvedValueOnce({
      success: true,
      message: 'Team "Techbaaz" has been approved and activated for gameplay',
      data: {
        team: {
          ...techbaazTeam,
          status: 'Active',
        },
      },
    });

    render(
      <MemoryRouter>
        <TeamManagementPage />
      </MemoryRouter>
    );

    // Verify Techbaaz is rendered with Pending status and 3 members
    const teamNameOccurrences = await screen.findAllByText('Techbaaz');
    expect(teamNameOccurrences.length).toBeGreaterThan(0);
    expect(screen.getByText(/Team Members \(3\)/i)).toBeTruthy();

    // The Approve Team button MUST be visible and functional for Techbaaz
    const approveBtn = screen.getByText('✓ Approve Team');
    expect(approveBtn).toBeTruthy();
    expect(approveBtn.hasAttribute('disabled')).toBe(false);

    // Click Approve Team
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    fireEvent.click(approveBtn);

    await waitFor(() => {
      expect(fixture.approveTeamMock).toHaveBeenCalledWith('team_techbaaz_999');
    });

    // UI updates to Active status and Approve button disappears
    await waitFor(() => {
      expect(screen.queryByText('✓ Approve Team')).toBeNull();
    });
    expect(screen.getAllByText('Active').length).toBeGreaterThan(0);
  });

  it('4. Pending undersized team (< 2 members) displays clear eligibility explanation and disabled button', async () => {
    const soloTeam = {
      _id: 'team_solo_111',
      name: 'SoloSquad',
      college: "Tula's University",
      joinCode: 'SOLO-112233',
      status: 'Pending',
      currentLevel: 1,
      totalScore: 0,
      isDisqualified: false,
      leaderId: {
        _id: 'user_solo_1',
        fullName: 'Solo Commander',
        email: 'solo@tulas.edu.in',
        role: 'TEAM_LEADER',
        isActive: true,
      },
      members: [
        {
          _id: 'user_solo_1',
          fullName: 'Solo Commander',
          email: 'solo@tulas.edu.in',
          role: 'TEAM_LEADER',
          isActive: true,
        },
      ],
    };

    fixture.getAllTeamsMock.mockResolvedValueOnce({
      success: true,
      data: { teams: [soloTeam] },
    });

    render(
      <MemoryRouter>
        <TeamManagementPage />
      </MemoryRouter>
    );

    const soloNames = await screen.findAllByText('SoloSquad');
    expect(soloNames.length).toBeGreaterThan(0);
    expect(screen.getByText(/Team Members \(1\)/i)).toBeTruthy();

    // Must show clear eligibility explanation
    expect(
      screen.getByText(/Squad requires at least 2 members for gameplay approval \(currently 1 of 2\)/i)
    ).toBeTruthy();

    // Disabled button indicating the requirement
    const disabledBtn = screen.getByText(/Approve Team \(Requires 2\+ Members\)/i);
    expect(disabledBtn).toBeTruthy();
    expect(disabledBtn.hasAttribute('disabled')).toBe(true);

    // Clicking should NOT trigger approveTeamMock
    fireEvent.click(disabledBtn);
    expect(fixture.approveTeamMock).not.toHaveBeenCalled();
  });

  it('5. Active and Disqualified teams do not render the Approve Team action', async () => {
    const activeTeam = {
      _id: 'team_active_1',
      name: 'ActiveSquad',
      college: "Tula's University",
      joinCode: 'ACT-111111',
      status: 'Active',
      currentLevel: 2,
      totalScore: 100,
      isDisqualified: false,
      leaderId: { _id: 'u1', fullName: 'Leader 1', email: 'l1@tulas.edu.in', role: 'TEAM_LEADER', isActive: true },
      members: [
        { _id: 'u1', fullName: 'Leader 1', email: 'l1@tulas.edu.in', role: 'TEAM_LEADER', isActive: true },
        { _id: 'u2', fullName: 'Member 2', email: 'm2@tulas.edu.in', role: 'TEAM_MEMBER', isActive: true },
      ],
    };

    const disqTeam = {
      _id: 'team_disq_2',
      name: 'DisqualifiedSquad',
      college: "Tula's University",
      joinCode: 'DSQ-222222',
      status: 'Disqualified',
      isDisqualified: true,
      currentLevel: 1,
      totalScore: 0,
      leaderId: { _id: 'u3', fullName: 'Leader 3', email: 'l3@tulas.edu.in', role: 'TEAM_LEADER', isActive: true },
      members: [
        { _id: 'u3', fullName: 'Leader 3', email: 'l3@tulas.edu.in', role: 'TEAM_LEADER', isActive: true },
        { _id: 'u4', fullName: 'Member 4', email: 'm4@tulas.edu.in', role: 'TEAM_MEMBER', isActive: true },
      ],
    };

    fixture.getAllTeamsMock.mockResolvedValueOnce({
      success: true,
      data: { teams: [activeTeam, disqTeam] },
    });

    render(
      <MemoryRouter>
        <TeamManagementPage />
      </MemoryRouter>
    );

    const activeNames = await screen.findAllByText('ActiveSquad');
    expect(activeNames.length).toBeGreaterThan(0);
    // For Active squad, Approve Team button MUST NOT be present
    expect(screen.queryByText(/✓ Approve Team/i)).toBeNull();

    // Select DisqualifiedSquad
    const disqElements = screen.getAllByText('DisqualifiedSquad');
    fireEvent.click(disqElements[0]);

    // For Disqualified squad, Approve Team button MUST NOT be present
    expect(screen.queryByText(/✓ Approve Team/i)).toBeNull();
    // Restore button is shown instead
    expect(screen.getByText('Restore Team')).toBeTruthy();
  });

  it('6. API failure displays visible error and preserves Pending status', async () => {
    const pendingTeam = {
      _id: 'team_fail_1',
      name: 'FailSquad',
      college: "Tula's University",
      joinCode: 'FAIL-123456',
      status: 'Pending',
      currentLevel: 1,
      totalScore: 0,
      isDisqualified: false,
      leaderId: { _id: 'u1', fullName: 'Leader 1', email: 'l1@tulas.edu.in', role: 'TEAM_LEADER', isActive: true },
      members: [
        { _id: 'u1', fullName: 'Leader 1', email: 'l1@tulas.edu.in', role: 'TEAM_LEADER', isActive: true },
        { _id: 'u2', fullName: 'Member 2', email: 'm2@tulas.edu.in', role: 'TEAM_MEMBER', isActive: true },
      ],
    };

    fixture.getAllTeamsMock.mockResolvedValueOnce({
      success: true,
      data: { teams: [pendingTeam] },
    });

    fixture.approveTeamMock.mockRejectedValueOnce({
      response: {
        data: {
          success: false,
          message: 'Server authorization expired. Admin re-authentication required.',
        },
      },
    });

    render(
      <MemoryRouter>
        <TeamManagementPage />
      </MemoryRouter>
    );

    const failNames = await screen.findAllByText('FailSquad');
    expect(failNames.length).toBeGreaterThan(0);
    const approveBtn = screen.getByText('✓ Approve Team');

    vi.spyOn(window, 'confirm').mockReturnValue(true);
    fireEvent.click(approveBtn);

    // Visible error message must appear
    expect(
      await screen.findByText('Server authorization expired. Admin re-authentication required.')
    ).toBeTruthy();

    // Team status must NOT be falsely set to Active; Approve Team button must still be available
    expect(screen.getByText('✓ Approve Team')).toBeTruthy();
  });
});
