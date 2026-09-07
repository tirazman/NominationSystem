import { Link } from "react-router-dom";

export function RegisterChoicePage() {
  return (
    <div className="card">
      <h2>Nomination Form — Form Submission</h2>
      <p className="muted">
        Select which seat you're contesting for to open the correct nomination form.
      </p>

      <div className="choice-grid">
        <Link to="/register/general" className="choice-card">
          <h3>General Seat</h3>
          <p className="muted">For candidates contesting a general (university-wide) seat.</p>
        </Link>

        <Link to="/register/faculty" className="choice-card">
          <h3>Faculty Seat</h3>
          <p className="muted">For candidates contesting a faculty representative seat.</p>
        </Link>
      </div>
    </div>
  );
}
