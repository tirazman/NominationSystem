import { useState } from "react";
import { api, ApiError } from "../api/client";
import type { Candidate, Gender } from "../types";
import { FACULTY_OPTIONS, RESIDENTIAL_COLLEGE_OPTIONS } from "../constants/options";

interface Props {
  candidate: Candidate;
  onClose: () => void;
  onSaved: (updated: Candidate) => void;
}

interface EditableFields {
  name: string;
  gender: Gender;
  icNumber: string;
  matricNumber: string;
  phoneNumber: string;
  faculty: string;
  residentialCollege: string;
  fieldOfStudy: string;
  proposer: { name: string; matricNumber: string; phoneNumber: string };
  seconder: { name: string; matricNumber: string; phoneNumber: string };
}

function toEditable(c: Candidate): EditableFields {
  return {
    name: c.name,
    gender: c.gender,
    icNumber: c.icNumber,
    matricNumber: c.matricNumber,
    phoneNumber: c.phoneNumber,
    faculty: c.faculty,
    residentialCollege: c.residentialCollege,
    fieldOfStudy: c.fieldOfStudy,
    proposer: { ...c.proposer },
    seconder: { ...c.seconder },
  };
}

export function CandidateEditModal({ candidate, onClose, onSaved }: Props) {
  const [form, setForm] = useState<EditableFields>(() => toEditable(candidate));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof EditableFields>(key: K, value: EditableFields[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function updatePerson(
    role: "proposer" | "seconder",
    field: "name" | "matricNumber" | "phoneNumber",
    value: string
  ) {
    setForm((f) => ({ ...f, [role]: { ...f[role], [field]: value } }));
  }

  async function handleSave() {
    setError(null);
    setSaving(true);
    try {
      const res = await api.patch<{ candidate: Candidate }>(`/api/candidates/${candidate.serialNumber}`, form);
      onSaved(res.candidate);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit {candidate.serialNumber} — {candidate.name}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="modal-body">
          <fieldset>
            <legend>Candidate Details</legend>
            <label>
              Full Name
              <input value={form.name} onChange={(e) => update("name", e.target.value)} />
            </label>
            <label>
              Gender
              <select value={form.gender} onChange={(e) => update("gender", e.target.value as Gender)}>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </label>
            <label>
              IC Number
              <input value={form.icNumber} onChange={(e) => update("icNumber", e.target.value)} />
            </label>
            <label>
              Matric Number
              <input value={form.matricNumber} onChange={(e) => update("matricNumber", e.target.value)} />
            </label>
            <label>
              Phone Number
              <input value={form.phoneNumber} onChange={(e) => update("phoneNumber", e.target.value)} />
            </label>
            <label>
              Faculty
              <select value={form.faculty} onChange={(e) => update("faculty", e.target.value)}>
                {FACULTY_OPTIONS.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </label>
            <label>
              Residential College
              <select value={form.residentialCollege} onChange={(e) => update("residentialCollege", e.target.value)}>
                {RESIDENTIAL_COLLEGE_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
            <label>
              Field of Study
              <input value={form.fieldOfStudy} onChange={(e) => update("fieldOfStudy", e.target.value)} />
            </label>
          </fieldset>

          <fieldset>
            <legend>Proposer</legend>
            <label>
              Name
              <input value={form.proposer.name} onChange={(e) => updatePerson("proposer", "name", e.target.value)} />
            </label>
            <label>
              Matric Number
              <input
                value={form.proposer.matricNumber}
                onChange={(e) => updatePerson("proposer", "matricNumber", e.target.value)}
              />
            </label>
            <label>
              Phone Number
              <input
                value={form.proposer.phoneNumber}
                onChange={(e) => updatePerson("proposer", "phoneNumber", e.target.value)}
              />
            </label>
          </fieldset>

          <fieldset>
            <legend>Seconder</legend>
            <label>
              Name
              <input value={form.seconder.name} onChange={(e) => updatePerson("seconder", "name", e.target.value)} />
            </label>
            <label>
              Matric Number
              <input
                value={form.seconder.matricNumber}
                onChange={(e) => updatePerson("seconder", "matricNumber", e.target.value)}
              />
            </label>
            <label>
              Phone Number
              <input
                value={form.seconder.phoneNumber}
                onChange={(e) => updatePerson("seconder", "phoneNumber", e.target.value)}
              />
            </label>
          </fieldset>

          {error && <p className="error">{error}</p>}
        </div>

        <div className="modal-footer">
          <button className="secondary-action" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
