import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SideNav } from "./components/SideNav";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { RegisterChoicePage } from "./pages/RegisterChoicePage";
import { GeneralSeatFormPage } from "./pages/GeneralSeatFormPage";
import { FacultySeatFormPage } from "./pages/FacultySeatFormPage";
import { CandidateDataPage } from "./pages/CandidateDataPage";
import { RegistrationCounterPage } from "./pages/RegistrationCounterPage";
import { SecretaryCounterPage } from "./pages/SecretaryCounterPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-shell">
          <SideNav />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Navigate to="/register" replace />} />
              <Route path="/login" element={<LoginPage />} />

              <Route path="/register" element={<RegisterChoicePage />} />
              <Route path="/register/general" element={<GeneralSeatFormPage />} />
              <Route path="/register/faculty" element={<FacultySeatFormPage />} />

              <Route
                path="/candidates"
                element={
                  <ProtectedRoute allowedRoles={["SYSTEM_UNIT", "DOCUMENTATION_UNIT"]}>
                    <CandidateDataPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/counter/registration"
                element={
                  <ProtectedRoute allowedRoles={["REGISTRATION_PIC"]}>
                    <RegistrationCounterPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/counter/secretary"
                element={
                  <ProtectedRoute allowedRoles={["SECRETARY_PIC"]}>
                    <SecretaryCounterPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
