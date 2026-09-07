import { useState, type FormEvent } from "react";
import { api, ApiError } from "../api/client";
import type { Candidate } from "../types";
import { CandidateDetail } from "../components/CandidateDetail";

export function SecretaryCounterPage() {
  const [serial, setSerial] = useState("");
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [depositPaid, setDepositPaid] = useState(false);
  const [eligible, setEligible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setActionMsg(null);
    setCandidate(null);
    setLoading(true);
    try {
      const res = await api.get<{ candidate: Candidate }>(`/api/candidates/${encodeURIComponent(serial.trim())}`);
      setCandidate(res.candidate);
      setDepositPaid(res.candidate.depositPaid);
      setEligible(res.candidate.eligible);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No candidate found for that reference number");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    if (!candidate) return;
    setError(null);
    setActionMsg(null);
    try {
      const res = await api.patch<{ candidate: Candidate; message: string }>(
        `/api/candidates/${candidate.serialNumber}/verify`,
        { depositPaid, eligible }
      );
      setCandidate(res.candidate);
      setActionMsg(res.message);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Verification failed");
    }
  }

  return (
    <div className="card">
      <h2>Secretary Counter — Setiausaha</h2>
      <p className="muted">Enter the candidate's reference number for final clearance before poster stamping.</p>

      <form onSubmit={handleSearch} className="inline-form">
        <input
          placeholder="Enter reference number e.g. 001"
          value={serial}
          onChange={(e) => setSerial(e.target.value)}
          autoFocus
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Find candidate"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {actionMsg && <p className="success-text">{actionMsg}</p>}

      {candidate && (
        <div className="counter-card">
          <CandidateDetail candidate={candidate} />

          {!candidate.attendance && (
            <p className="warning-text">
              This candidate hasn't been checked in at the Registration Counter yet — verification will be
              rejected until they are.
            </p>
          )}

          <label className="toggle-row">
            <input
              type="checkbox"
              checked={depositPaid}
              onChange={(e) => setDepositPaid(e.target.checked)}
            />
            Sudah bayar deposit (Deposit paid)
          </label>

          <label className="toggle-row">
            <input
              type="checkbox"
              checked={eligible}
              onChange={(e) => setEligible(e.target.checked)}
            />
            Layak bertanding (Eligible to contest)
          </label>

          <button
            className="primary-action"
            onClick={handleVerify}
            disabled={!candidate.attendance}
          >
            Save verification
          </button>
        </div>
      )}
    </div>
  );
}
