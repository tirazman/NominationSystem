import { useState, type FormEvent } from "react";
import { api, ApiError, API_BASE } from "../api/client";
import type { Candidate } from "../types";

export function LookupPage() {
  const [serial, setSerial] = useState("");
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setCandidate(null);
    setLoading(true);
    try {
      const res = await api.get<{ candidate: Candidate }>(`/api/candidates/${encodeURIComponent(serial.trim())}`);
      setCandidate(res.candidate);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Phase 2 — Serial Number Lookup</h2>
      <p className="muted">
        Enter a serial number to instantly pull up the candidate, proposer, and seconder records for
        data-integrity testing before Nomination Day.
      </p>

      <form onSubmit={handleSearch} className="inline-form">
        <input
          placeholder="e.g. CAND-001"
          value={serial}
          onChange={(e) => setSerial(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Look up"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {candidate && (
        <div className="record-detail">
          <div className="record-header">
            <h3>{candidate.serialNumber} — {candidate.name}</h3>
            {candidate.photoUrl && (
              <img
                src={`${API_BASE}${candidate.photoUrl}`}
                alt={candidate.name}
                className="candidate-photo"
              />
            )}
          </div>

          <table className="detail-table">
            <tbody>
              <tr><td>Gender</td><td>{candidate.gender}</td></tr>
              <tr><td>IC Number</td><td>{candidate.icNumber}</td></tr>
              <tr><td>Matric Number</td><td>{candidate.matricNumber}</td></tr>
              <tr><td>Phone</td><td>{candidate.phoneNumber}</td></tr>
              <tr><td>Faculty</td><td>{candidate.faculty}</td></tr>
              <tr><td>Residential College</td><td>{candidate.residentialCollege}</td></tr>
              <tr><td>Field of Study</td><td>{candidate.fieldOfStudy}</td></tr>
            </tbody>
          </table>

          <h4>Proposer</h4>
          <table className="detail-table">
            <tbody>
              <tr><td>Name</td><td>{candidate.proposer.name}</td></tr>
              <tr><td>Matric</td><td>{candidate.proposer.matricNumber}</td></tr>
              <tr><td>Phone</td><td>{candidate.proposer.phoneNumber}</td></tr>
            </tbody>
          </table>

          <h4>Seconder</h4>
          <table className="detail-table">
            <tbody>
              <tr><td>Name</td><td>{candidate.seconder.name}</td></tr>
              <tr><td>Matric</td><td>{candidate.seconder.matricNumber}</td></tr>
              <tr><td>Phone</td><td>{candidate.seconder.phoneNumber}</td></tr>
            </tbody>
          </table>

          <h4>Nomination Day Status</h4>
          <table className="detail-table">
            <tbody>
              <tr><td>Hadir (Attendance)</td><td><StatusPill ok={candidate.attendance} /></td></tr>
              <tr><td>Deposit Paid</td><td><StatusPill ok={candidate.depositPaid} /></td></tr>
              <tr><td>Eligible</td><td><StatusPill ok={candidate.eligible} /></td></tr>
              <tr><td>Poster Stamped</td><td><StatusPill ok={candidate.posterStamped} /></td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusPill({ ok }: { ok: boolean }) {
  return <span className={`pill ${ok ? "pill-ok" : "pill-pending"}`}>{ok ? "Yes" : "No"}</span>;
}
