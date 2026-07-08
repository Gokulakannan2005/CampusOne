/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StudentProfile {
  name: string;
  rollNumber: string;
  email: string;
  semester: string;
  major: string;
  cgpa: number;
  cgpaHistory: { semester: string; gpa: number }[];
  hostelStatus: "Hostelite" | "Day Scholar";
  transportMode: "College Bus" | "Metro" | "Self Drive";
  busRouteId?: string;
  avatarUrl?: string;
}

export interface TimetableSlot {
  id: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";
  subject: string;
  code: string;
  instructor: string;
  time: string;
  startHour24: number; // For rendering calendar layout
  endHour24: number;
  location: string;
  room: string;
  status: "Upcoming" | "Active" | "Completed" | "Free";
}

export interface FacultyMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  office: string;
  status: "Available" | "In Class" | "Away" | "On Leave";
  officeHours: string;
  subjects: string[];
  avatarColor: string;
}

export interface AttendanceRecord {
  id: string;
  subject: string;
  code: string;
  attended: number;
  total: number;
  percentage: number;
  targetPercentage: number;
  history: { date: string; status: "Present" | "Absent" }[];
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  code: string;
  dueDate: string;
  description: string;
  status: "Pending" | "Submitted" | "Graded";
  grade?: string;
  priority: "High" | "Medium" | "Low";
}

export interface Exam {
  id: string;
  subject: string;
  code: string;
  date: string;
  time: string;
  room: string;
  seat: string;
  countdownDays: number;
  syllabus: string[];
  preparationPercentage: number;
}

export interface NoticeItem {
  id: string;
  title: string;
  category: "Academic" | "Placement" | "Events" | "Admin";
  date: string;
  content: string;
  isUrgent: boolean;
  author: string;
}

export interface BusSchedule {
  id: string;
  busNumber: string;
  route: string;
  driverName: string;
  phone: string;
  timing: string;
  stops: { stop: string; time: string }[];
  delayMinutes: number;
  status: "On Time" | "Delayed" | "Completed";
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  dueDate?: string;
  status: "Issued" | "Available";
  shelf: string;
}

export interface NavigationStep {
  text: string;
  distance: string;
  type: "turn-left" | "turn-right" | "go-straight" | "elevator" | "stairs";
}

export interface NavigationPath {
  start: string;
  destination: string;
  steps: NavigationStep[];
  estimatedTime: string;
  distance: string;
  mapRoutePoints: { x: number; y: number }[]; // For canvas drawing
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  timestamp: string;
  text: string;
  cardType?: "timetable_item" | "exam_card" | "attendance_card" | "assignment_card" | "navigation_card" | "faculty_card" | "notice_card" | "bus_card";
  cardData?: any;
}
