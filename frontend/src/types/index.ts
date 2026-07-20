export interface UserProfile {
  ieltsScore?: number;
  gpa?: number;
  budgetUSD?: number;
  preferredCountries?: string[];
  fieldOfInterest?: string;
  educationLevel?: "Bachelor" | "Master" | "PhD" | "Diploma";
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "student" | "admin";
  profile: UserProfile;
}

export interface University {
  _id: string;
  name: string;
  country: string;
  city: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string;
  gallery: string[];
  tuitionUSD: number;
  livingCostUSD: number;
  ranking: number;
  rating: number;
  reviewCount: number;
  courses: string[];
  minIELTS: number;
  minGPA: number;
  scholarshipAvailable: boolean;
  applicationDeadline: string;
  intakeSeasons: string[];
  tags: string[];
  createdBy: string;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Recommendation {
  university: University;
  matchScore: number;
  reason: string;
}

export interface Review {
  _id: string;
  university: string;
  user: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ChatEntry {
  role: "user" | "assistant";
  content: string;
}
