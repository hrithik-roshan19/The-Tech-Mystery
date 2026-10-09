import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { challengeService } from "../../services/challenge.service";
import { teamService } from "../../services/team.service";
import { ROUTES } from "../../constants/routes";
import "../../styles/FinalFlagPage.css";

/**
 * Hack the Grid — Final Flag / Victory UI
 * Authenticated submission for Stage 10 Master Flag.
 * Connected to live backend endpoint via challengeService.submitFlag(10, flag).
 */
export default function FinalFlagPage() {
  const { isAuthenticated, user } = useAuth();
  const [team, setTeam] = useState(null);
  const [flag, setFlag] = useState("");
  const [status, setStatus] = useState("idle"); // idle | checking | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [solveStats, setSolveStats] = useState(null);

  const normalizedFlag = useMemo(() => flag.trim(), [flag]);

  // Load team context on mount and verify current progression level
  useEffect(() => {
    let isMounted = true;
    async function loadTeam() {
      if (isAuthenticated) {
        try {
          const res = await teamService.getMyTeam();
          if (isMounted && res.success && res.data?.team) {
            const teamData = res.data.team;
            setTeam(teamData);

            // If Level 10 was already solved (currentLevel > 10)
            if (teamData.currentLevel > 10) {
              setStatus("success");
            } else if (teamData.currentLevel < 10) {
              setNoticeMessage(
                `Progression Protocol: Your squad is currently on Level ${teamData.currentLevel}. Clear Levels 1 through 9 to unlock verified Master Flag submission.`
              );
            }
          }
        } catch {
          // Non-blocking for unauthenticated preview mode
        }
      }
    }
    loadTeam();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  async function onSubmitFlag(event) {
    event.preventDefault();
    if (!normalizedFlag || status === "checking" || status === "success") return;

    if (!isAuthenticated) {
      setStatus("error");
      setErrorMessage("Authentication required. Please log in with your team credentials to submit the Final Flag.");
      return;
    }

    if (team && team.currentLevel < 10) {
      setStatus("error");
      setErrorMessage(
        `Access Denied: Your squad is currently at Level ${team.currentLevel}. The Final Gate requires completing all 9 preceding challenge checkpoints first.`
      );
      return;
    }

    setStatus("checking");
    setErrorMessage("");

    try {
      // Connect to authenticated backend endpoint: POST /api/v1/submissions/submit
      const result = await challengeService.submitFlag(10, normalizedFlag);

      if (result.success && result.data?.isCorrect) {
        setStatus("success");
        setSolveStats(result.data);
      } else {
        setStatus("error");
        setErrorMessage(
          result.message || "Invalid flag string. Ensure the format matches HTG{...} and character casing is accurate."
        );
      }
    } catch (err) {
      setStatus("error");
      const serverMessage =
        err.response?.data?.message || err.message || "Flag verification failed. Check server connectivity.";

      // Handle already solved level
      if (serverMessage.toLowerCase().includes("already been solved") || serverMessage.toLowerCase().includes("already solved")) {
        setStatus("success");
      } else {
        setErrorMessage(serverMessage);
      }
    }
  }

  return (
    <main className="final-flag-page">
      <div className="ff-noise" aria-hidden="true" />
      <div className="ff-grid-glow" aria-hidden="true" />

      <header className="ff-topbar">
        <Link className="ff-brand" to={ROUTES.HOME} aria-label="Hack the Grid home">
          <span className="ff-brand-mark"><span /></span>
          <span className="ff-brand-copy">
            <strong>HACK THE GRID</strong>
            <small>CODESPHERE × UTKRISHT 2026</small>
          </span>
        </Link>
        <div className="ff-topbar-right">
          <span className="ff-live-dot" />
          <span>MISSION CONTROL</span>
          <span className="ff-topbar-divider" />
          <Link to={ROUTES.DASHBOARD}>DASHBOARD <span aria-hidden="true">↗</span></Link>
        </div>
      </header>

      <section className="ff-breadcrumb" aria-label="Breadcrumb">
        <Link to={ROUTES.DASHBOARD}>PARTICIPANT PORTAL</Link>
        <span>/</span>
        <Link to={ROUTES.CHALLENGES}>MISSION MAP</Link>
        <span>/</span>
        <strong>FINAL FLAG</strong>
      </section>

      {status === "success" ? (
        <section className="ff-success-state" aria-live="polite">
          <div className="ff-success-orbit">
            <div className="ff-success-check">✓</div>
            <span className="ff-orbit orbit-one" />
            <span className="ff-orbit orbit-two" />
          </div>
          <p className="ff-eyebrow"><span /> ALL SYSTEMS VERIFIED</p>
          <h1>MISSION <em>ACCOMPLISHED.</em></h1>
          <p className="ff-success-copy">
            The final master flag has been authenticated and recorded by the server. Your team’s run across the Grid is complete.
          </p>
          <div className="ff-success-stats">
            <div><small>MISSION STATUS</small><strong>COMPLETE</strong></div>
            <div><small>FINAL LEVEL</small><strong>10 / 10</strong></div>
            <div><small>TEAM RESULT</small><strong>VERIFIED</strong></div>
            {solveStats?.pointsAwarded && (
              <div><small>FINAL SOLVE</small><strong>+{solveStats.pointsAwarded} PTS</strong></div>
            )}
          </div>
          <Link className="ff-primary-button" to={ROUTES.LEADERBOARD}>VIEW LEADERBOARD <span>↗</span></Link>
          <Link className="ff-secondary-link" to={ROUTES.DASHBOARD}>Return to dashboard</Link>
        </section>
      ) : (
        <>
          <section className="ff-hero">
            <div className="ff-hero-copy">
              <div className="ff-terminal-status"><span /> ENDGAME PROTOCOL <b>LEVEL 10</b></div>
              <p className="ff-kicker">THE FINAL GATE</p>
              <h1>SYSTEM<br /><em>BREACHED.</em></h1>
              <p className="ff-hero-description">
                You’ve decoded the grid, cleared every checkpoint, and reached the final gate.
                One last flag stands between your team and victory.
              </p>
              <div className="ff-progress-row">
                <div className="ff-progress-label"><span>MISSION PROGRESS</span><strong>10 / 10 LEVELS</strong></div>
                <div className="ff-progress-track"><span /></div>
              </div>
              <div className="ff-hero-footnote"><span className="ff-mini-lock">⌑</span> FINAL SUBMISSION IS TEAM-LOCKED</div>
            </div>

            <div className="ff-flag-art" aria-label="Master flag illustration">
              <div className="ff-art-topline"><span>ROOT ACCESS</span><span>AUTH // 010</span></div>
              <div className="ff-art-ring ring-a" />
              <div className="ff-art-ring ring-b" />
              <div className="ff-art-crosshair cross-x" />
              <div className="ff-art-crosshair cross-y" />
              <div className="ff-flag-pole" />
              <div className="ff-flag-cloth">
                <div className="ff-flag-corner">HTG</div>
                <div className="ff-flag-symbol">⚑</div>
                <div className="ff-flag-code">MASTER_FLAG<br />10.10.10</div>
              </div>
              <div className="ff-art-scanline" />
              <div className="ff-art-caption"><span>MASTER FLAG FOUND</span><small>AWAITING VALIDATION</small></div>
              <div className="ff-art-coordinate">30.3165° N<br />78.0322° E</div>
            </div>
          </section>

          <section className="ff-main-grid">
            <article className="ff-submit-panel">
              <div className="ff-panel-heading">
                <div>
                  <p className="ff-kicker">FINAL CHECKPOINT // 10.10</p>
                  <h2>Submit the <em>Master Flag.</em></h2>
                </div>
                <span className="ff-panel-icon">⌁</span>
              </div>
              <p className="ff-panel-description">
                Enter the exact flag discovered by your team. The server will verify your submission
                and record the result.
              </p>

              {noticeMessage && (
                <div className="ff-inline-notice" role="status">
                  <span>ℹ</span>
                  {noticeMessage}
                </div>
              )}

              <form onSubmit={onSubmitFlag}>
                <label className="ff-input-label" htmlFor="master-flag">FLAG STRING <span>REQUIRED</span></label>
                <div className={`ff-input-wrap ${status === "error" ? "has-error" : ""}`}>
                  <span className="ff-input-prefix">HTG</span>
                  <input
                    id="master-flag"
                    type="text"
                    autoComplete="off"
                    spellCheck="false"
                    placeholder="HTG{enter_your_final_flag}"
                    value={flag}
                    onChange={(event) => {
                      setFlag(event.target.value);
                      if (status === "error") setStatus("idle");
                      setErrorMessage("");
                    }}
                    disabled={status === "checking"}
                    aria-describedby="ff-flag-help"
                  />
                  <span className="ff-input-cursor" aria-hidden="true" />
                </div>
                <p id="ff-flag-help" className="ff-input-help">Flags are case-sensitive. Check every character before submitting.</p>

                {errorMessage && <div className="ff-inline-error" role="alert"><span>!</span>{errorMessage}</div>}

                <button className="ff-primary-button ff-submit-button" type="submit" disabled={!normalizedFlag || status === "checking"}>
                  {status === "checking" ? <><span className="ff-spinner" /> VERIFYING FLAG…</> : <>SUBMIT FINAL FLAG <span>↗</span></>}
                </button>
              </form>

              <div className="ff-panel-separator" />
              <button className="ff-hint-toggle" type="button" onClick={() => setShowHint((value) => !value)}>
                <span className="ff-hint-icon">i</span>
                <span><strong>Before you submit</strong><small>Final checklist and submission rules</small></span>
                <span className={`ff-chevron ${showHint ? "is-open" : ""}`}>⌄</span>
              </button>
              {showHint && (
                <div className="ff-hint-content">
                  <ul>
                    <li>Submit only the flag your team discovered during the event.</li>
                    <li>Do not share flags or tokens with other teams.</li>
                    <li>Repeated submissions may be rate-limited by the server.</li>
                    <li>Victory is confirmed only after server-side validation.</li>
                  </ul>
                </div>
              )}
            </article>

            <aside className="ff-side-column">
              <article className="ff-victory-card">
                <div className="ff-victory-card-top"><span className="ff-trophy">✦</span><span className="ff-card-tag">ENDGAME</span></div>
                <p className="ff-kicker">YOUR OBJECTIVE</p>
                <h3>Claim the<br /><em>Grid.</em></h3>
                <p>One final proof. One team. One place in the leaderboard.</p>
                <div className="ff-victory-divider" />
                <div className="ff-victory-row"><span>FINAL LEVEL</span><strong>MASTER FLAG</strong></div>
                <div className="ff-victory-row"><span>VALIDATION</span><strong><i /> SERVER-SIDE</strong></div>
              </article>

              <article className="ff-protocol-card">
                <div className="ff-protocol-heading"><span className="ff-protocol-symbol">⌘</span><span>VICTORY PROTOCOL</span></div>
                <ol>
                  <li><span>01</span><div><strong>Submit</strong><small>Enter your final flag</small></div></li>
                  <li><span>02</span><div><strong>Verify</strong><small>Server validates the token</small></div></li>
                  <li><span>03</span><div><strong>Celebrate</strong><small>Record your team's finish</small></div></li>
                </ol>
                <div className="ff-protocol-note"><span /> NO SHORTCUTS. JUST SKILL.</div>
              </article>
            </aside>
          </section>
        </>
      )}

      <footer className="ff-footer">
        <span>© 2026 CODESPHERE CODING CLUB</span>
        <span className="ff-footer-center"><i /> GRID STATUS: ACTIVE</span>
        <span>BUILT FOR THE CURIOUS <b>↗</b></span>
      </footer>
    </main>
  );
}
