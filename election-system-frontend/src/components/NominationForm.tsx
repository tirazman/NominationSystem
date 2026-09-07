import { useState, type FormEvent } from "react";
import { api, ApiError } from "../api/client";
import type { CandidateFormInput, Gender, SeatCategory } from "../types";
import { FACULTY_OPTIONS, RESIDENTIAL_COLLEGE_OPTIONS } from "../constants/options";

function emptyForm(category: SeatCategory): CandidateFormInput {
  return {
    category,
    name: "",
    gender: "MALE",
    icNumber: "",
    matricNumber: "",
    phoneNumber: "",
    faculty: "",
    residentialCollege: "",
    fieldOfStudy: "",
    proposer: { name: "", matricNumber: "", phoneNumber: "" },
    seconder: { name: "", matricNumber: "", phoneNumber: "" },
  };
}

interface Props {
  category: SeatCategory;
  title: string;
  description: string;
}

export function NominationForm({ category, title, description }: Props) {
  const [form, setForm] = useState<CandidateFormInput>(() => emptyForm(category));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successSerial, setSuccessSerial] = useState<string | null>(null);

  function update<K extends keyof CandidateFormInput>(key: K, value: CandidateFormInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function updatePerson(
    role: "proposer" | "seconder",
    field: "name" | "matricNumber" | "phoneNumber",
    value: string
  ) {
    setForm((f) => ({ ...f, [role]: { ...f[role], [field]: value } }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await api.post<{ serialNumber: string }>("/api/candidates", form, false);
      setSuccessSerial(res.serialNumber);
      setForm(emptyForm(category));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (successSerial) {
    return (
      <div className="card narrow success-card">
        <h2>Form submitted successfully</h2>
        <p>Your reference number is:</p>
        <p className="serial-display">{successSerial}</p>
        <p className="muted">
          Keep this number — you'll need it at the Registration Counter on Nomination Day.
        </p>
        <button onClick={() => setSuccessSerial(null)}>Submit another form</button>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>{title}</h2>
      <p className="muted">{description}</p>

      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Candidate Details</legend>
          <label>
            Full Name
            <input value={form.name} onChange={(e) => update("name", e.target.value)} required />
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
            <input value={form.icNumber} onChange={(e) => update("icNumber", e.target.value)} required />
          </label>
          <label>
            Matric Number
            <input value={form.matricNumber} onChange={(e) => update("matricNumber", e.target.value)} required />
          </label>
          <label>
            Phone Number
            <input value={form.phoneNumber} onChange={(e) => update("phoneNumber", e.target.value)} required />
          </label>
          <label>
            Faculty
            <select value={form.faculty} onChange={(e) => update("faculty", e.target.value)} required>
              <option value="" disabled>Select faculty</option>
              {FACULTY_OPTIONS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </label>
          <label>
            Residential College
            <select
              value={form.residentialCollege}
              onChange={(e) => update("residentialCollege", e.target.value)}
              required
            >
              <option value="" disabled>Select residential college</option>
              {RESIDENTIAL_COLLEGE_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Field of Study
            <input value={form.fieldOfStudy} onChange={(e) => update("fieldOfStudy", e.target.value)} required />
          </label>
        </fieldset>

        <fieldset>
          <legend>Proposer</legend>
          <label>
            Name
            <input
              value={form.proposer.name}
              onChange={(e) => updatePerson("proposer", "name", e.target.value)}
              required
            />
          </label>
          <label>
            Matric Number
            <input
              value={form.proposer.matricNumber}
              onChange={(e) => updatePerson("proposer", "matricNumber", e.target.value)}
              required
            />
          </label>
          <label>
            Phone Number
            <input
              value={form.proposer.phoneNumber}
              onChange={(e) => updatePerson("proposer", "phoneNumber", e.target.value)}
              required
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Seconder</legend>
          <label>
            Name
            <input
              value={form.seconder.name}
              onChange={(e) => updatePerson("seconder", "name", e.target.value)}
              required
            />
          </label>
          <label>
            Matric Number
            <input
              value={form.seconder.matricNumber}
              onChange={(e) => updatePerson("seconder", "matricNumber", e.target.value)}
              required
            />
          </label>
          <label>
            Phone Number
            <input
              value={form.seconder.phoneNumber}
              onChange={(e) => updatePerson("seconder", "phoneNumber", e.target.value)}
              required
            />
          </label>
        </fieldset>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Form"}
        </button>
      </form>
    </div>
  );
}
