/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  StudentProfile,
  TimetableSlot,
  FacultyMember,
  AttendanceRecord,
  Assignment,
  Exam,
  NoticeItem,
  BusSchedule,
  LibraryBook,
  NavigationPath
} from "../types";
import {
  mockProfile,
  mockTimetable,
  mockFaculty,
  mockAttendance,
  mockAssignments,
  mockExams,
  mockNotices,
  mockBuses,
  mockLibraryBooks,
  mockNavigationPaths
} from "../data/campusData";
import NavigationMap from "./NavigationMap";
import { SubjectAttendanceCard, CgpaChart } from "./AttendanceChart";
import {
  Calendar, CheckSquare, Clock, MapPin, Search, GraduationCap, AlertCircle, CheckCircle2,
  BookOpen, ChevronRight, Bell, User, Settings as SettingsIcon, Map, Mail, Phone,
  FileText, Award, Bus, Menu, Moon, Sun, Volume2, ShieldCheck, RefreshCw, Barcode
} from "lucide-react";

interface DashboardProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  overrideNavigationPath: NavigationPath | null;
  setOverrideNavigationPath: (path: NavigationPath | null) => void;
  darkTheme: boolean;
  setDarkTheme: (dark: boolean) => void;
  studentName?: string;
  studentEmail?: string;
}

export default function Dashboard({
  currentTab,
  setCurrentTab,
  overrideNavigationPath,
  setOverrideNavigationPath,
  darkTheme,
  setDarkTheme,
  studentName,
  studentEmail
}: DashboardProps) {
  // Dynamic Avatar Selection based on name gender
  function getStudentAvatar(name: string): string {
    const lowercaseName = name.toLowerCase();
    const femaleKeywords = [
      "alexandra", "emma", "sarah", "helena", "evelyn", "jane", "mary", "olivia", 
      "sophia", "isabella", "mia", "charlotte", "amelia", "harper", "abigail", 
      "emily", "elizabeth", "sofia", "avery", "ella", "scarlett", "grace", 
      "lily", "chloe", "clara", "zoe", "claire", "audrey", "stella", "anna", "jenny", "lisa"
    ];
    const isFemale = femaleKeywords.some(keyword => lowercaseName.includes(keyword)) || 
      (lowercaseName.endsWith("a") && !lowercaseName.includes("alexander") && !lowercaseName.includes("luca") && !lowercaseName.includes("joshua"));
    
    if (isFemale) {
      return "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80"; // Female student portrait
    }
    return "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80"; // Male student portrait
  }

  // Application-wide state to simulate full interactivity
  const [profile, setProfile] = useState<StudentProfile>(mockProfile);

  // Synchronize dynamic student personalization from onboarding / login
  useEffect(() => {
    if (studentName) {
      setProfile((prev) => ({
        ...prev,
        name: studentName,
        email: studentEmail || prev.email,
        avatarUrl: getStudentAvatar(studentName)
      }));
    }
  }, [studentName, studentEmail]);
  const [timetable, setTimetable] = useState<TimetableSlot[]>(mockTimetable);
  const [faculty, setFaculty] = useState<FacultyMember[]>(mockFaculty);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockAttendance);
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [exams, setExams] = useState<Exam[]>(mockExams);
  const [notices, setNotices] = useState<NoticeItem[]>(mockNotices);
  const [buses, setBuses] = useState<BusSchedule[]>(mockBuses);

  // Search state for smart-search overlay (CMD-K)
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  // Navigation state
  const [selectedNavPath, setSelectedNavPath] = useState<NavigationPath>(mockNavigationPaths[0]);

  // Timetable active day selector
  const [selectedTimetableDay, setSelectedTimetableDay] = useState<"Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday">("Wednesday");

  // Faculty department filter
  const [facultyFilter, setFacultyFilter] = useState("All");

  // Settings mock states
  const [notifSound, setNotifSound] = useState(true);
  const [gpsTracking, setGpsTracking] = useState(true);
  const [aiSpeed, setAiSpeed] = useState("Balanced");

  // Check if there is an incoming navigation path from the AI assistant chat
  useEffect(() => {
    if (overrideNavigationPath) {
      setSelectedNavPath(overrideNavigationPath);
      setCurrentTab("navigation");
      setOverrideNavigationPath(null); // Clear override after loading
    }
  }, [overrideNavigationPath]);

  // Command-K smart search simulation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Search logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const q = searchQuery.toLowerCase().trim();
    const matches: any[] = [];

    // Filter faculty
    faculty.forEach((f) => {
      if (f.name.toLowerCase().includes(q) || f.role.toLowerCase().includes(q) || f.department.toLowerCase().includes(q)) {
        matches.push({ id: f.id, type: "faculty", title: f.name, subtitle: `${f.role} - ${f.department}`, icon: <User className="w-4 h-4 text-slate-500" /> });
      }
    });

    // Filter Timetable slots
    timetable.forEach((t) => {
      if (t.subject.toLowerCase().includes(q) || t.code.toLowerCase().includes(q)) {
        matches.push({ id: t.id, type: "timetable", title: t.subject, subtitle: `${t.day} • ${t.time} (${t.room})`, icon: <Calendar className="w-4 h-4 text-blue-500" /> });
      }
    });

    // Filter Assignments
    assignments.forEach((a) => {
      if (a.title.toLowerCase().includes(q) || a.subject.toLowerCase().includes(q)) {
        matches.push({ id: a.id, type: "assignment", title: a.title, subtitle: `Due ${a.dueDate} - ${a.status}`, icon: <CheckSquare className="w-4 h-4 text-emerald-500" /> });
      }
    });

    setSearchResults(matches);
  }, [searchQuery, faculty, timetable, assignments]);

  // Simulate Completing an Assignment
  const toggleAssignmentStatus = (id: string) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: a.status === "Pending" ? "Submitted" : "Pending" } : a
      )
    );
  };

  // Simulate Toggling Syllabus checklist on exams
  const toggleSyllabusTopic = (examId: string, topicIndex: number) => {
    setExams((prev) =>
      prev.map((e) => {
        if (e.id === examId) {
          // Increment or decrement preparation percentage
          const currentPrep = e.preparationPercentage;
          const delta = 100 / e.syllabus.length;
          const isCompleting = currentPrep < 90; // mock toggle direction
          return {
            ...e,
            preparationPercentage: Math.min(100, Math.max(0, Math.round(isCompleting ? currentPrep + delta : currentPrep - delta)))
          };
        }
        return e;
      })
    );
  };

  return (
    <div className={`font-sans min-h-screen transition-colors duration-200 ${darkTheme ? "bg-[#0B0F19] text-slate-100" : "bg-[#FAFAF8] text-slate-800"}`}>
      {/* Smart Search CMD-K Modal Backdrop */}
      {showSearch && (
        <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-xs flex items-start justify-center pt-[15vh] z-50 transition-all">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                id="modal-smart-search-input"
                type="text"
                placeholder="Search classrooms, faculty, assignments... (e.g. DBMS)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-0 outline-hidden focus:ring-0 text-slate-800 text-sm placeholder-slate-400"
                autoFocus
              />
              <button
                id="btn-close-search"
                onClick={() => { setShowSearch(false); setSearchQuery(""); }}
                className="text-xs font-mono bg-slate-150 text-slate-500 px-2 py-1 rounded border border-slate-200"
              >
                ESC
              </button>
            </div>

            <div className="p-2 max-h-[300px] overflow-y-auto">
              {searchResults.length > 0 ? (
                searchResults.map((res, index) => (
                  <div
                    key={res.id + "-" + index}
                    onClick={() => {
                      if (res.type === "faculty") setCurrentTab("faculty");
                      if (res.type === "timetable") setCurrentTab("timetable");
                      if (res.type === "assignment") setCurrentTab("assignments");
                      setShowSearch(false);
                      setSearchQuery("");
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition"
                  >
                    <div className="p-2 bg-slate-100 rounded-lg">
                      {res.icon}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-800 leading-snug">{res.title}</h5>
                      <p className="text-xs text-slate-400 font-sans">{res.subtitle}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 ml-auto" />
                  </div>
                ))
              ) : searchQuery ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No direct database matches. Ask Gemini Student Brain for assistance.
                </div>
              ) : (
                <div className="p-4 text-xs text-slate-400 font-sans space-y-2">
                  <span className="font-semibold block uppercase tracking-wider text-[10px] text-slate-400">Quick Filters</span>
                  <div className="flex flex-wrap gap-2">
                    <button id="search-filter-dbms" onClick={() => setSearchQuery("DBMS")} className="bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200/50">DBMS</button>
                    <button id="search-filter-vance" onClick={() => setSearchQuery("Vance")} className="bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200/50">Dr. Vance</button>
                    <button id="search-filter-algorithms" onClick={() => setSearchQuery("algorithms")} className="bg-slate-50 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200/50">Algorithms</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Grid Workspace */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        
        {/* TAB 1: BENTO HOME DASHBOARD */}
        {currentTab === "home" && (
          <div className="space-y-6">
            
            {/* Real-time Welcome banner */}
            <div className={`border rounded-[20px] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between shadow-xs gap-4 ${darkTheme ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
              <div className="flex items-center gap-4">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className={`w-16 h-16 rounded-[16px] object-cover border shadow-xs animate-pulse ${darkTheme ? "border-slate-700" : "border-slate-200"}`}
                />
                <div>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${darkTheme ? "text-blue-400 bg-blue-950/40" : "text-[#2563EB] bg-blue-50"}`}>{profile.rollNumber} • {profile.semester}</span>
                  <h2 className={`text-xl md:text-2xl font-bold tracking-tight font-display mt-1.5 ${darkTheme ? "text-slate-100" : "text-slate-800"}`}>Welcome Back, {profile.name.split(" ")[0]}</h2>
                  <p className={`text-sm font-sans mt-0.5 ${darkTheme ? "text-slate-400" : "text-slate-500"}`}>{profile.major}</p>
                </div>
              </div>
              <div className="text-right hidden md:block">
                <div className={`text-sm font-bold font-display ${darkTheme ? "text-blue-400" : "text-[#2563EB]"}`}>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Realtime Dashboard Sync</div>
              </div>
            </div>

            {/* AI Command Bar - Central Hub */}
            <div 
              onClick={() => setShowSearch(true)}
              className={`border shadow-xs rounded-[20px] flex items-center h-16 px-6 gap-4 cursor-pointer hover:border-blue-400 hover:shadow-sm transition-all duration-200 ${darkTheme ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}
            >
              <Search className="w-5 h-5 text-[#2563EB] shrink-0" />
              <div className="flex-1 text-sm md:text-base text-slate-450 font-semibold select-none">
                Ask CampusOne... "Where is my next class?" or "Show my attendance"
              </div>
              <div className="flex gap-1.5 shrink-0">
                <kbd className={`px-2 py-1 border rounded-md text-[10px] font-bold font-mono ${darkTheme ? "bg-slate-800 border-slate-700 text-slate-450" : "bg-slate-100 border-slate-200 text-slate-500"}`}>⌘</kbd>
                <kbd className={`px-2 py-1 border rounded-md text-[10px] font-bold font-mono ${darkTheme ? "bg-slate-800 border-slate-700 text-slate-450" : "bg-slate-100 border-slate-200 text-slate-500"}`}>K</kbd>
              </div>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Up Next Lecture */}
              <div className="bg-[#334155] text-white rounded-[20px] border border-slate-800 p-6 shadow-xs flex flex-col justify-between relative overflow-hidden h-[240px] hover:shadow-md transition-all group">
                <div className="absolute bottom-[-20px] right-[-20px] opacity-10 pointer-events-none text-white group-hover:scale-105 transition-transform duration-300">
                  <Calendar className="w-44 h-44" />
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-blue-300 font-semibold bg-blue-900/60 px-2 py-0.5 rounded-full uppercase tracking-wider">Active Lecture (Now)</span>
                    <span className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-bold rounded-md uppercase tracking-wide animate-pulse">Live</span>
                  </div>
                  <h3 className="text-xl font-bold font-display leading-tight mt-4">Artificial Intelligence</h3>
                  <p className="text-slate-300 text-xs font-sans mt-1">Dr. Marcus Thorne • Room Sem Rm 3</p>
                </div>
                <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between z-10">
                  <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                    <Clock className="w-4 h-4 text-blue-300" />
                    <span>11:00 AM - 12:30 PM</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-800 bg-slate-100 px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    Sem Rm 3
                  </span>
                </div>
              </div>

              {/* Card 2: Attendance Circular Gauge */}
              <div className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-xs flex flex-col justify-between h-[240px] hover:shadow-md transition-all">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Attendance Tracker</h3>
                  <span className="text-[10px] font-mono text-rose-500 font-bold bg-rose-50 px-2 py-0.5 rounded-md uppercase border border-rose-100">Critical Warning</span>
                </div>
                <div className="flex items-center justify-between gap-4 py-1">
                  <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
                      <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="301" strokeDashoffset={301 - (301 * 66.7) / 100} className="text-rose-500 transition-all duration-500" />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-2xl font-bold font-display text-rose-500">66.7%</span>
                      <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Bunk Risk</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 text-xs">
                    <div className="text-slate-500 font-semibold font-sans">Required: <span className="text-slate-800 font-bold">75.0%</span></div>
                    <div className="text-slate-400 font-sans text-[11px]">Must attend next <b className="text-rose-500">3 lectures</b></div>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-sans">
                  <span>Syllabus covered: <b>60%</b></span>
                  <button
                    id="btn-bento-view-attendance"
                    onClick={() => setCurrentTab("attendance")}
                    className="text-[#2563EB] font-semibold hover:underline flex items-center cursor-pointer"
                  >
                    Audit Details <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Card 3: Recent Notice Bullet Board */}
              <div className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-xs flex flex-col justify-between h-[240px] hover:shadow-md transition-all">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-purple-600 font-bold uppercase tracking-wider block">Urgent Announcement</span>
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display text-slate-800 leading-snug line-clamp-2 mt-2">Microsoft Core Engineering Drive 2027</h3>
                  <p className="text-xs text-slate-500 font-sans mt-2 line-clamp-3">Registrations close on July 10, 2026. Minimum CGPA: 8.5. Online coding exam scheduled for Sunday.</p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">By Prof. R. Harrison</span>
                  <button
                    id="btn-bento-view-notices"
                    onClick={() => setCurrentTab("notices")}
                    className="text-xs font-semibold text-[#2563EB] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
                  >
                    View Notice
                  </button>
                </div>
              </div>

            </div>

            {/* Middle Section: Pending Assignments & Transport Tracker */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Columns 1 & 2: Pending Tasks Checklist */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[20px] p-6 shadow-xs hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Pending Academic Assignments</h3>
                    <p className="text-xs text-slate-500 font-sans mt-0.5">Manage your homework status checklist</p>
                  </div>
                  <button
                    id="btn-bento-view-assignments"
                    onClick={() => setCurrentTab("assignments")}
                    className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
                  >
                    View All {assignments.length} Tasks
                  </button>
                </div>

                <div className="space-y-3">
                  {assignments.slice(0, 3).map((as) => (
                    <div key={as.id} className="flex items-center justify-between p-3 px-4 hover:bg-slate-50 rounded-[12px] border border-slate-100 transition shadow-2xs">
                      <div className="flex items-center gap-3">
                        <button
                          id={`btn-toggle-task-bento-${as.id}`}
                          onClick={() => toggleAssignmentStatus(as.id)}
                          className={`w-5 h-5 rounded-md border flex items-center justify-center transition shrink-0 ${as.status === "Submitted" ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-slate-300 hover:border-blue-500 cursor-pointer"}`}
                        >
                          {as.status === "Submitted" && <CheckSquare className="w-3.5 h-3.5" />}
                        </button>
                        <div>
                          <span className={`text-xs font-bold font-sans leading-snug ${as.status === "Submitted" ? "line-through text-slate-400 font-normal" : "text-slate-800"}`}>{as.title}</span>
                          <span className="text-[10px] text-slate-400 font-sans block mt-0.5">{as.subject}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded block uppercase mb-1 ${as.priority === "High" ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-slate-100 text-slate-600"}`}>
                          {as.priority}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Due {as.dueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3: GPS Transport coordinate tracker */}
              <div className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase tracking-wider block bg-emerald-50 px-2 py-1 rounded w-fit mb-3 border border-emerald-100">Live Transit Status</span>
                  <h3 className="text-base font-bold font-display text-slate-800">College Transit Line</h3>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">Your coordinate route bus: <b>Bus 14</b></p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-[12px] my-4">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-slate-500">Driver</span>
                    <span className="text-slate-700 font-semibold">{buses[0].driverName}</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-slate-500">Departure</span>
                    <span className="text-slate-700 font-semibold">07:30 AM</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-500">Live Status</span>
                    <span className="text-emerald-600 font-bold">On Time</span>
                  </div>
                </div>

                <button
                  id="btn-bento-call-driver"
                  onClick={() => alert(`Dialing bus driver ${buses[0].driverName}: ${buses[0].phone}`)}
                  className="w-full text-center text-xs font-semibold text-slate-700 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-slate-400" />
                  Call Transit Captain
                </button>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: TIMETABLE WEEKLY SPREADSHEET */}
        {currentTab === "timetable" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-800 font-sans">Lecture Timetable Registry</h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">Explore weekly scheduled slots and room coordinates</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200/40">
                {(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const).map((day) => (
                  <button
                    id={`btn-day-select-${day.toLowerCase()}`}
                    key={day}
                    onClick={() => setSelectedTimetableDay(day)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${selectedTimetableDay === day ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    {day.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* List slots */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {timetable
                .filter((slot) => slot.day === selectedTimetableDay)
                .map((slot) => (
                  <div key={slot.id} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between min-h-[190px] h-full gap-2 relative hover:shadow-md transition">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-bold">{slot.code}</span>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${slot.status === "Active" ? "bg-emerald-100 text-emerald-800 animate-pulse" : slot.status === "Completed" ? "bg-slate-100 text-slate-500" : "bg-blue-100 text-blue-800"}`}>
                          {slot.status}
                        </span>
                      </div>
                      <h4 className="font-sans font-bold text-slate-800 text-sm mt-3 leading-snug">{slot.subject}</h4>
                      <p className="text-xs text-slate-500 font-sans mt-0.5">{slot.instructor}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {slot.time}</span>
                      <span className="flex items-center gap-1 font-semibold text-slate-600"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {slot.location} • {slot.room}</span>
                    </div>
                  </div>
                ))}
              
              {timetable.filter((slot) => slot.day === selectedTimetableDay).length === 0 && (
                <div className="col-span-full text-center py-12 text-slate-400 text-xs">
                  No lectures are scheduled on {selectedTimetableDay}. Enjoy your academic breather!
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: ATTENDANCE TRACKER METRICS */}
        {currentTab === "attendance" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-800 font-sans">Attendance Tracker</h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">Verify subject safe bunk thresholds under academic norms</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {attendance.map((rec) => (
                <SubjectAttendanceCard key={rec.id} record={rec} />
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ASSIGNMENTS DEADLINES */}
        {currentTab === "assignments" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-800 font-sans">Homework & Task Assignments</h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">Toggle status checklist items to simulate real-time submission</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assignments.map((as) => (
                <div key={as.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[200px]">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <span className="text-[10px] font-mono text-slate-400">{as.code} • {as.subject}</span>
                      <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${as.priority === "High" ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-600"}`}>
                        {as.priority} Priority
                      </span>
                    </div>

                    <div className="flex items-start gap-3 mt-4">
                      <button
                        id={`btn-assignment-toggle-${as.id}`}
                        onClick={() => toggleAssignmentStatus(as.id)}
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition ${as.status === "Submitted" ? "bg-emerald-500 border-emerald-500 text-white animate-pulse" : "bg-white border-slate-300 hover:border-blue-500"}`}
                      >
                        {as.status === "Submitted" && <CheckSquare className="w-4 h-4" />}
                      </button>
                      <div>
                        <h4 className={`text-sm font-bold text-slate-800 leading-snug font-sans ${as.status === "Submitted" ? "line-through text-slate-400" : ""}`}>{as.title}</h4>
                        <p className="text-xs text-slate-500 font-sans mt-1 leading-relaxed">{as.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Due Date: <b className="text-slate-600">{as.dueDate}</b></span>
                    <span className={`font-semibold ${as.status === "Submitted" ? "text-emerald-600" : "text-rose-500"}`}>
                      Status: {as.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: EXAM COUNTDOWNS & SYLLABUS CHECKLISTS */}
        {currentTab === "exams" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-800 font-sans">Examination Countdown & Syllabus Checklist</h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">Review seating allocations, dates, and click syllabus bullets to coordinate prep status</p>
            </div>

            <div className="space-y-6">
              {exams.map((exam) => (
                <div key={exam.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Exam Seat Info */}
                  <div className="border-b lg:border-b-0 lg:border-r border-slate-100 pb-4 lg:pb-0 lg:pr-6 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-amber-800 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full font-bold">{exam.code}</span>
                      <h4 className="text-base font-black text-slate-800 font-sans tracking-tight mt-3">{exam.subject}</h4>
                    </div>

                    <div className="mt-4 space-y-2 text-xs font-mono text-slate-600 bg-slate-50 p-3.5 rounded-xl">
                      <div className="flex justify-between">
                        <span>Date & Time</span>
                        <span className="text-slate-800 font-bold">{exam.date} @ {exam.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Seating Hall</span>
                        <span className="text-slate-800 font-bold">{exam.room}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Assigned Seat</span>
                        <span className="text-slate-800 font-bold">{exam.seat}</span>
                      </div>
                    </div>
                  </div>

                  {/* Exam Prep Countdown */}
                  <div className="border-b lg:border-b-0 lg:border-r border-slate-100 pb-4 lg:pb-0 lg:pr-6 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-amber-100/60 flex items-center justify-center text-amber-800 font-mono text-2xl font-black mb-2">
                      {exam.countdownDays}
                    </div>
                    <span className="text-xs font-semibold text-slate-700 font-sans">Days Remaining</span>
                    <span className="text-[10px] font-mono text-slate-400 mt-1">Midterm Stage - Level 2</span>

                    <div className="w-full mt-4">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                        <span>Syllabus Covered</span>
                        <span>{exam.preparationPercentage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${exam.preparationPercentage}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Interactively Toggle Syllabus topics to simulate study tracker */}
                  <div>
                    <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Syllabus Topics (Simulate Study)</h5>
                    <div className="space-y-2">
                      {exam.syllabus.map((topic, index) => (
                        <div
                          key={index}
                          onClick={() => toggleSyllabusTopic(exam.id, index)}
                          className="flex items-center gap-2 text-xs font-sans text-slate-600 hover:text-slate-800 cursor-pointer p-1.5 hover:bg-slate-50 rounded transition border border-transparent hover:border-slate-100"
                        >
                          <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${exam.preparationPercentage > (index + 1) * (100 / exam.syllabus.length) - 5 ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-slate-300"}`}>
                            {exam.preparationPercentage > (index + 1) * (100 / exam.syllabus.length) - 5 && <CheckSquare className="w-2.5 h-2.5" />}
                          </div>
                          <span className="line-clamp-1">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: CAMPUS VECTOR NAVIGATION */}
        {currentTab === "navigation" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-800 font-sans">GPS Campus Route Finder</h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">Navigate block structures with precise vector walkways</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold font-sans">Route:</span>
                <select
                  id="select-nav-destination"
                  value={mockNavigationPaths.indexOf(selectedNavPath)}
                  onChange={(e) => {
                    const idx = parseInt(e.target.value, 10);
                    if (!isNaN(idx) && mockNavigationPaths[idx]) {
                      setSelectedNavPath(mockNavigationPaths[idx]);
                    }
                  }}
                  className="bg-white text-slate-800 border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 text-xs font-sans focus:outline-hidden"
                >
                  {mockNavigationPaths.map((path, idx) => (
                    <option key={idx} value={idx}>
                      {path.start} → {path.destination} ({path.estimatedTime})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Render Navigation component */}
            <NavigationMap 
              activePath={selectedNavPath} 
              darkTheme={darkTheme}
              onSelectPath={(destName) => {
                const match = mockNavigationPaths.find((n) => n.destination === destName || n.start.includes(destName) || n.destination.includes(destName));
                if (match) setSelectedNavPath(match);
              }}
            />
          </div>
        )}

        {/* TAB 7: FACULTY DIRECTORY */}
        {currentTab === "faculty" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-800 font-sans">Computer Science Faculty Directory</h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">Locate associate offices and coordinate direct click-to-email actions</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold font-sans">Department:</span>
                <select
                  id="select-faculty-department"
                  value={facultyFilter}
                  onChange={(e) => setFacultyFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden"
                >
                  <option value="All">All Departments</option>
                  <option value="Computer Science & Engineering">CSE Only</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {faculty
                .filter((f) => facultyFilter === "All" || f.department === facultyFilter)
                .map((f) => (
                  <div key={f.id} className={`p-5 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[240px] h-full gap-4 border ${darkTheme ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800"}`}>
                    <div>
                      <div className="flex items-center justify-between">
                        <div className={`w-9 h-9 rounded-full ${f.avatarColor} flex items-center justify-center text-xs font-bold`}>
                          {f.name.split(" ").slice(-1)[0][0]}
                        </div>
                        <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${f.status === "Available" ? "bg-emerald-500/20 text-emerald-400 animate-pulse" : (darkTheme ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500")}`}>
                          {f.status}
                        </span>
                      </div>
                      <h4 className={`font-sans font-bold text-sm mt-3 ${darkTheme ? "text-slate-100" : "text-slate-800"}`}>{f.name}</h4>
                      <p className={`text-xs font-sans ${darkTheme ? "text-slate-400" : "text-slate-500"}`}>{f.role} • {f.department}</p>
                    </div>

                    <div className={`space-y-2.5 text-xs font-mono pt-3 border-t ${darkTheme ? "border-slate-800/80 text-slate-400" : "border-slate-100 text-slate-500"}`}>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Office</span>
                        <span className={`font-semibold leading-snug ${darkTheme ? "text-slate-200" : "text-slate-800"}`}>{f.office}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Office Hours</span>
                        <span className={`font-semibold leading-snug ${darkTheme ? "text-slate-200" : "text-slate-800"}`}>{f.officeHours}</span>
                      </div>
                    </div>

                    <div className="pt-1 text-[10px] font-mono">
                      <a
                        id={`link-faculty-email-${f.id}`}
                        href={`mailto:${f.email}`}
                        className="text-blue-500 hover:text-blue-400 flex items-center gap-1.5 font-semibold"
                      >
                        <Mail className="w-3.5 h-3.5" /> Direct Message Office
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 8: BULLETIN NOTICE BOARD */}
        {currentTab === "notices" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-800 font-sans">Smart notice board & Bulletins</h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">Important campus announcements, placement schedules, and admin notifications</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {notices.map((notice) => (
                <div key={notice.id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm relative hover:shadow-md transition">
                  {notice.isUrgent && (
                    <span className="absolute top-6 right-6 bg-rose-50 text-rose-600 border border-rose-200 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
                      Urgent Alert
                    </span>
                  )}

                  <div>
                    <span className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase ${notice.category === "Placement" ? "bg-purple-100 text-purple-700 font-semibold" : "bg-slate-100 text-slate-600"}`}>
                      {notice.category}
                    </span>
                    <h4 className="text-base font-bold text-slate-800 leading-snug font-sans mt-3">{notice.title}</h4>
                    <p className="text-xs text-slate-500 font-sans leading-relaxed mt-3">{notice.content}</p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span>Issued: {notice.date}</span>
                    <span>By: {notice.author}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: STUDENT PROFILE CARD */}
        {currentTab === "profile" && (
          <div className="space-y-6">
            
            {/* Split screen: Digital Badge & CGPA progression */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Digit ID Badge */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-lg flex flex-col justify-between items-center relative overflow-hidden h-[400px]">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500" />
                <div className="text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-4">University Smart Pass</span>
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-slate-800 shadow-md mx-auto"
                  />
                  <h3 className="text-lg font-black font-sans mt-3 tracking-tight">{profile.name}</h3>
                  <span className="text-xs font-mono text-blue-400 font-semibold uppercase">{profile.rollNumber}</span>
                </div>

                <div className="w-full space-y-2 text-[11px] font-mono text-slate-400 px-4 py-3 bg-slate-800/50 rounded-xl text-center">
                  <div>CSE Major • Semester V</div>
                  <div>Hostel: {profile.hostelStatus}</div>
                  <div>Transport: {profile.transportMode}</div>
                </div>

                {/* Simulated digital Pass Barcode */}
                <div className="text-center w-full pb-2">
                  <div className="flex justify-center items-center gap-1 opacity-80 mb-1">
                    <Barcode className="w-40 h-8 text-white stroke-[1.5]" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">MERCER.CSE.2023.RFID.GATE</span>
                </div>
              </div>

              {/* CGPA progressions & stats */}
              <div className="lg:col-span-2 space-y-6">
                <CgpaChart history={profile.cgpaHistory} currentCgpa={profile.cgpa} />

                {/* Extra stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Classroom Rank</span>
                    <span className="text-xl font-black text-slate-800 font-mono mt-1 block">#04</span>
                    <span className="text-[10px] font-sans text-slate-500 mt-0.5 block">out of 120 CSE batch</span>
                  </div>
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Library Credits</span>
                    <span className="text-xl font-black text-slate-800 font-mono mt-1 block">8.5 / 10.0</span>
                    <span className="text-[10px] font-sans text-slate-500 mt-0.5 block">Safe borrow limit status</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 10: SETTINGS CONTROLS */}
        {currentTab === "settings" && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-800 font-sans">Settings & Preferences</h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">Configure your AI assistant voice and student transit details</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Coordinate Real-time GPS Tracker</h4>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">Integrate transit coordinates automatically inside routing maps</p>
                </div>
                <button
                  id="toggle-settings-gps"
                  onClick={() => setGpsTracking(!gpsTracking)}
                  className={`w-11 h-6 rounded-full transition relative ${gpsTracking ? "bg-blue-600" : "bg-slate-300"}`}
                >
                  <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-all ${gpsTracking ? "translate-x-5" : ""}`} />
                </button>
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Acoustic Notice Alerts</h4>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">Emit low-pitch notification sounds on urgent placement alerts</p>
                </div>
                <button
                  id="toggle-settings-sound"
                  onClick={() => setNotifSound(!notifSound)}
                  className={`w-11 h-6 rounded-full transition relative ${notifSound ? "bg-blue-600" : "bg-slate-300"}`}
                >
                  <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-all ${notifSound ? "translate-x-5" : ""}`} />
                </button>
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Gemini Reasoning Speed</h4>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">Speed controls for structured server-side queries</p>
                </div>
                <select
                  id="select-settings-speed"
                  value={aiSpeed}
                  onChange={(e) => setAiSpeed(e.target.value)}
                  className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-hidden font-semibold"
                >
                  <option value="Turbo">Turbo Latency (Lite)</option>
                  <option value="Balanced">Balanced Speed (3.5 Flash)</option>
                  <option value="Ultra">Ultra Reasoning (3.1 Pro)</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Interface Contrast Preset</h4>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">Switch default ambient off-white display contrasts</p>
                </div>
                <button
                  id="toggle-settings-theme"
                  onClick={() => setDarkTheme(!darkTheme)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2 border border-slate-200/50"
                >
                  {darkTheme ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-500" />}
                  <span>{darkTheme ? "Classic Light" : "High Contrast"}</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
