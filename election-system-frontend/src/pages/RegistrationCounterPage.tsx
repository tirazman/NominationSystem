import { useState, type FormEvent } from "react";
import { api, ApiError } from "../api/client";
import type { Candidate } from "../types";
import { CandidateDetail } from "../components/CandidateDetail";

export function RegistrationCounterPage() {
  const [serial, setSerial] = useState("");
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
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
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No candidate found for that reference number");
    } finally {
      setLoading(false);
    }
  }

  async function handleUploadPhoto() {
    if (!candidate || !photoFile) return;
    setError(null);
    const fd = new FormData();
    fd.append("photo", photoFile);
    try {
      const res = await api.post<{ candidate: Candidate }>(
        `/api/candidates/${candidate.serialNumber}/photo`,
        fd
      );
      setCandidate(res.candidate);
      setPhotoFile(null);
      setActionMsg("Photo uploaded.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Photo upload failed");
    }
  }

  async function handleMarkHadir() {
    if (!candidate) return;
    setError(null);
    try {
      const res = await api.patch<{ candidate: Candidate; message: string }>(
        `/api/candidates/${candidate.serialNumber}/attendance`,
        { attendance: true }
      );
      setCandidate(res.candidate);
      setActionMsg(res.message);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to mark attendance");
    }
  }

  return (
    <div className="card">
      <h2>Registration Counter — Pendaftaran</h2>
      <p className="muted">Enter the candidate's reference number to pull up their record.</p>

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
          <CandidateDetail
            candidate={candidate}
            headerExtra={
              <div className="photo-upload-row">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                />
                <button onClick={handleUploadPhoto} disabled={!photoFile}>
                  Upload Photo
                </button>
              </div>
            }
          />

          <p className="muted verify-note">
            Review the candidate, proposer, and seconder details above with the candidate before proceeding.
          </p>

          <button
            className="primary-action"
            onClick={handleMarkHadir}
            disabled={candidate.attendance}
          >
            {candidate.attendance ? "Already marked Hadir" : "Mark as Hadir (Present)"}
          </button>
        </div>
      )}
    </div>
  );
}
