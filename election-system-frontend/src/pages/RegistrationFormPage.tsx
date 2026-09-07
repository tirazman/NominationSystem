import { useState, type FormEvent } from "react";
import { api, ApiError } from "../api/client";
import type { CandidateFormInput, Gender } from "../types";

const emptyForm: CandidateFormInput = {
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

export function RegistrationFormPage() {
  const [form, setForm] = useState<CandidateFormInput>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successSerial, setSuccessSerial] = useState<string | null>(null);

  function update<K extends keyof CandidateFormInput>(key: K, value: CandidateFormInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function updatePerson(role: "proposer" | "seconder", field: "name" | "matricNumber" | "phoneNumber", value: string) {
    setForm((f) => ({ ...f, [role]: { ...f[role], [field]: value } }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await api.post<{ serialNumber: string }>("/api/candidates", form, false);
      setSuccessSerial(res.serialNumber);
      setForm(emptyForm);
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
        <p>Your serial number is:</p>
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
      <h2>Nomination Form — Candidate Registration</h2>
      <p className="muted">Complete this form when purchasing your nomination form. Open to the public.</p>

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
            <input value={form.faculty} onChange={(e) => update("faculty", e.target.value)} required />
          </label>
          <label>
            Residential College
            <input
              value={form.residentialCollege}
              onChange={(e) => update("residentialCollege", e.target.value)}
              required
            />
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
