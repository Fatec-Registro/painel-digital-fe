
export enum UserRole {
  ADMIN = "admin",
  DIRECTOR = "director",
  DESIGNER = "designer"
}

export enum AnnouncementStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  AWAITING_APPROVAL = "awaiting_approval",
  PUBLISHED = "published"
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  status: AnnouncementStatus;
  createdAt: string;
  updatedAt: string;
  requestedBy: string;
  assignedTo?: string;
  imageUrl?: string;
  displayDuration?: number; // duration in seconds
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AnnouncementFormData {
  title: string;
  description: string;
}

export interface UpdateAnnouncementData {
  status?: AnnouncementStatus;
  imageUrl?: string;
  displayDuration?: number;
}

export interface DashboardStats {
  pending: number;
  inProgress: number;
  awaitingApproval: number;
  published: number;
  total: number;
  recentAnnouncements: Announcement[];
}
