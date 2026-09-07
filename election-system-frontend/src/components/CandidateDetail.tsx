import { resolvePhotoUrl } from "../api/client";
import type { Candidate } from "../types";

interface Props {
  candidate: Candidate;
  /** Extra content rendered inside the header area, e.g. a photo upload control */
  headerExtra?: React.ReactNode;
}

export function CandidateDetail({ candidate, headerExtra }: Props) {
  return (
    <div className="record-detail">
      <div className="record-header">
        <div>
          <h3>
            {candidate.serialNumber} — {candidate.name}
          </h3>
          <span className={`category-tag category-${candidate.category.toLowerCase()}`}>
            {candidate.category === "GENERAL" ? "General Seat" : "Faculty Seat"}
          </span>
        </div>
        {candidate.photoUrl ? (
          <img
            src={resolvePhotoUrl(candidate.photoUrl)}
            alt={candidate.name}
            className="candidate-photo"
          />
        ) : (
          <div className="candidate-photo candidate-photo-placeholder">No photo</div>
        )}
      </div>

      {headerExtra}

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
  );
}

function StatusPill({ ok }: { ok: boolean }) {
  return <span className={`pill ${ok ? "pill-ok" : "pill-pending"}`}>{ok ? "Yes" : "No"}</span>;
}
