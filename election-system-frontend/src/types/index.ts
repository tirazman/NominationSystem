export type Role =
  | "ADMIN"
  | "SYSTEM_UNIT"
  | "DOCUMENTATION_UNIT"
  | "REGISTRATION_PIC"
  | "SECRETARY_PIC";

export type Gender = "MALE" | "FEMALE";

export type SeatCategory = "GENERAL" | "FACULTY";

export interface PersonRef {
  id?: string;
  name: string;
  matricNumber: string;
  phoneNumber: string;
}

export interface Candidate {
  id: string;
  serialNumber: string;
  category: SeatCategory;
  name: string;
  gender: Gender;
  icNumber: string;
  matricNumber: string;
  phoneNumber: string;
  faculty: string;
  residentialCollege: string;
  fieldOfStudy: string;

  photoUrl: string | null;
  attendance: boolean;
  attendanceTime: string | null;
  registeredBy: string | null;

  depositPaid: boolean;
  eligible: boolean;
  verifiedBy: string | null;
  verifiedAt: string | null;
  posterStamped: boolean;

  proposer: PersonRef;
  seconder: PersonRef;

  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  username: string;
  role: Role;
}

export interface CandidateFormInput {
  category: SeatCategory;
  name: string;
  gender: Gender;
  icNumber: string;
  matricNumber: string;
  phoneNumber: string;
  faculty: string;
  residentialCollege: string;
  fieldOfStudy: string;
  proposer: PersonRef;
  seconder: PersonRef;
}
