import { useEffect, useState, useCallback } from "react";
import { api, ApiError } from "../api/client";
import type { Candidate, SeatCategory } from "../types";
import { FACULTY_OPTIONS, RESIDENTIAL_COLLEGE_OPTIONS } from "../constants/options";
import { CandidateEditModal } from "../components/CandidateEditModal";

export function CandidateDataPage() {
  const [category, setCategory] = useState<SeatCategory>("GENERAL");
  const [search, setSearch] = useState("");
  const [faculty, setFaculty] = useState("");
  const [residentialCollege, setResidentialCollege] = useState("");

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Candidate | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("category", category);
      if (search.trim()) params.set("search", search.trim());
      if (faculty) params.set("faculty", faculty);
      if (residentialCollege) params.set("residentialCollege", residentialCollege);

      const res = await api.get<{ candidates: Candidate[] }>(`/api/candidates?${params.toString()}`);
      setCandidates(res.candidates);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load candidates");
    } finally {
      setLoading(false);
    }
  }, [category, search, faculty, residentialCollege]);

  useEffect(() => {
    load();
  }, [load]);

  function handleTabChange(next: SeatCategory) {
    setCategory(next);
    setFaculty("");
    setResidentialCollege("");
  }

  return (
    <div className="card wide">
      <h2>Candidate Data</h2>
      <p className="muted">Browse, search, and edit submitted candidate records.</p>

      <div className="tabs">
        <button
          className={`tab ${category === "GENERAL" ? "tab-active" : ""}`}
          onClick={() => handleTabChange("GENERAL")}
        >
          General Seat
        </button>
        <button
          className={`tab ${category === "FACULTY" ? "tab-active" : ""}`}
          onClick={() => handleTabChange("FACULTY")}
        >
          Faculty Seat
        </button>
      </div>

      <div className="filter-row">
        <input
          placeholder="Search by reference number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={faculty} onChange={(e) => setFaculty(e.target.value)}>
          <option value="">All faculties</option>
          {FACULTY_OPTIONS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
        <select value={residentialCollege} onChange={(e) => setResidentialCollege(e.target.value)}>
          <option value="">All residential colleges</option>
          {RESIDENTIAL_COLLEGE_OPTIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {error && <p className="error">{error}</p>}

      <table className="data-table">
        <thead>
          <tr>
            <th>Reference No.</th>
            <th>Name</th>
            <th>IC Number</th>
            <th>Matric Number</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr><td colSpan={5} className="muted table-empty">Loading...</td></tr>
          )}
          {!loading && candidates.length === 0 && (
            <tr><td colSpan={5} className="muted table-empty">No candidates match these filters.</td></tr>
          )}
          {!loading && candidates.map((c) => (
            <tr key={c.id}>
              <td className="ref-cell">{c.serialNumber}</td>
              <td>{c.name}</td>
              <td>{c.icNumber}</td>
              <td>{c.matricNumber}</td>
              <td>
                <button className="link-button" onClick={() => setEditing(c)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <CandidateEditModal
          candidate={editing}
          onClose={() => setEditing(null)}
          onSaved={(updated) => {
            setCandidates((list) => list.map((c) => (c.id === updated.id ? updated : c)));
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
