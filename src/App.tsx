/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Dashboard from "./components/Dashboard";
import AiChatWindow from "./components/AiChatWindow";
import { NavigationPath } from "./types";
import {
  Sparkles, Calendar, CheckSquare, Clock, MapPin, GraduationCap, AlertCircle,
  User, Settings, Bell, Bus, LogOut, Compass, ChevronRight, Mail, Shield, BookOpen, Map, Terminal
} from "lucide-react";

export default function App() {
  // Navigation Flow State: "splash" | "login" | "onboarding" | "main"
  const [flowState, setFlowState] = useState<"splash" | "login" | "onboarding" | "main">("splash");
  const [currentTab, setCurrentTab] = useState("home");
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [overrideNavPath, setOverrideNavPath] = useState<NavigationPath | null>(null);
  const [darkTheme, setDarkTheme] = useState(false);

  // Dynamic Student profile customization
  const [studentName, setStudentName] = useState("Alexander Mercer");
  const [studentEmail, setStudentEmail] = useState("a.mercer@college.edu");

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

  // Personalization Onboarding State
  const [onboardMajor, setOnboardMajor] = useState("Computer Science & Engineering");
  const [onboardHostel, setOnboardHostel] = useState<"Hostelite" | "Day Scholar">("Day Scholar");
  const [onboardTransport, setOnboardTransport] = useState<"College Bus" | "Metro" | "Self Drive">("College Bus");

  // Timer simulation to progress from Splash to Login or direct simulation
  useEffect(() => {
    if (flowState === "splash") {
      const timer = setTimeout(() => {
        setFlowState("login");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [flowState]);

  // Sidebar Tabs Config
  const tabs = [
    { id: "home", label: "Dashboard", icon: <Compass className="w-4 h-4" /> },
    { id: "timetable", label: "Timetable", icon: <Calendar className="w-4 h-4" /> },
    { id: "attendance", label: "Attendance", icon: <AwardIcon className="w-4 h-4" /> },
    { id: "assignments", label: "Assignments", icon: <CheckSquare className="w-4 h-4" /> },
    { id: "exams", label: "Midterm Exams", icon: <Clock className="w-4 h-4" /> },
    { id: "navigation", label: "Campus Navigation", icon: <Map className="w-4 h-4" /> },
    { id: "faculty", label: "Faculty Directory", icon: <User className="w-4 h-4" /> },
    { id: "notices", label: "Notice Board", icon: <Bell className="w-4 h-4" /> },
    { id: "profile", label: "Student Profile", icon: <GraduationCap className="w-4 h-4" /> },
    { id: "settings", label: "Preferences", icon: <Settings className="w-4 h-4" /> },
  ];

  // Helper Custom Award icon
  function AwardIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    );
  }

  // Handle Onboarding Completion
  const handleOnboardingComplete = () => {
    setFlowState("main");
    setCurrentTab("home");
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-slate-800 antialiased font-sans flex flex-col justify-between">
      
      {/* 1. SPLASH SCREEN */}
      {flowState === "splash" && (
        <div className="fixed inset-0 bg-[#FAFAF8] flex flex-col items-center justify-center p-6 z-50 animate-fade-in">
          <div className="text-center space-y-6 max-w-sm">
            {/* Minimal High-Contrast logo with clean border and subtle bounce */}
            <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center mx-auto shadow-xl transition-transform hover:scale-105 animate-bounce">
              <Sparkles className="w-8 h-8 text-white stroke-[1.5]" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-black text-slate-800 tracking-tight font-sans">CampusOne</h1>
              <p className="text-xs text-slate-400 font-mono uppercase tracking-widest">Digital Campus Operating System</p>
            </div>
            
            {/* Soft, pixel-perfect loading visualizer */}
            <div className="w-32 bg-slate-100 h-1 rounded-full overflow-hidden mx-auto">
              <div className="bg-slate-800 h-full rounded-full animate-pulse-line w-full" style={{ animationDuration: '2s' }} />
            </div>
          </div>
        </div>
      )}

      {/* 2. PREMIUM LOGIN SCREEN */}
      {flowState === "login" && (
        <div className="fixed inset-0 bg-[#FAFAF8] flex items-center justify-center p-6 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-2xl w-full max-w-md space-y-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 font-sans tracking-tight">University ID Passport</h2>
              <p className="text-xs text-slate-400 font-sans mt-1">Access your college portal, timetables, and navigation guides</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Student Full Name</label>
                <input
                  id="input-login-name"
                  type="text"
                  placeholder="Alexander Mercer"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-blue-500 font-sans text-slate-700"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Student Mail ID</label>
                <input
                  id="input-login-email"
                  type="email"
                  placeholder="a.mercer@college.edu"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-blue-500 font-sans text-slate-700"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Secret Access Password</label>
                <input
                  id="input-login-password"
                  type="password"
                  placeholder="••••••••••••"
                  defaultValue="password"
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-blue-500 font-sans text-slate-700"
                />
              </div>
            </div>

            {/* Identity options */}
            <div className="space-y-3 pt-2">
              <button
                id="btn-login-sso"
                onClick={() => setFlowState("onboarding")}
                className="w-full text-center text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Shield className="w-4 h-4 text-slate-300" />
                <span>Single Sign-On (SSO) Portal</span>
              </button>
              
              <div className="flex items-center gap-2 justify-center text-[10px] text-slate-400 font-sans">
                <span className="w-8 h-px bg-slate-200" />
                <span>or connect sandbox</span>
                <span className="w-8 h-px bg-slate-200" />
              </div>

              <button
                id="btn-login-demo"
                onClick={() => setFlowState("main")}
                className="w-full text-center text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 py-2.5 rounded-xl border border-slate-200/50 transition"
              >
                Launch Sandbox Mode (Instant Bypass)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. AI ONBOARDING CONFIGURATION PANEL */}
      {flowState === "onboarding" && (
        <div className="fixed inset-0 bg-[#FAFAF8] flex items-center justify-center p-6 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-2xl w-full max-w-lg space-y-8">
            <div>
              <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">Step 2: AI Customization</span>
              <h2 className="text-xl font-bold text-slate-800 font-sans tracking-tight mt-3">Personalize Assistant Engine</h2>
              <p className="text-xs text-slate-400 font-sans mt-1">Specify your academic major, commute, and lodging status to preseed the dashboard.</p>
            </div>

            <div className="space-y-5 text-sm font-sans">
              
              {/* Question 1: Department selection */}
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-2">Academic Major</label>
                <div className="grid grid-cols-2 gap-3">
                  {["Computer Science & Engineering", "Electronics & Comm Engineering"].map((major) => (
                    <button
                      id={`btn-onboard-major-${major.split(' ')[0].toLowerCase()}`}
                      key={major}
                      onClick={() => setOnboardMajor(major)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition ${onboardMajor === major ? "border-blue-500 bg-blue-50/50 text-blue-800" : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"}`}
                    >
                      {major}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Hostel Status */}
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-2">Lodging Preference</label>
                <div className="grid grid-cols-2 gap-3">
                  {(["Hostelite", "Day Scholar"] as const).map((status) => (
                    <button
                      id={`btn-onboard-hostel-${status.replace(/\s+/g, '-').toLowerCase()}`}
                      key={status}
                      onClick={() => setOnboardHostel(status)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition ${onboardHostel === status ? "border-blue-500 bg-blue-50/50 text-blue-800" : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3: Commute Mode */}
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase block mb-2">Transit Commute</label>
                <div className="grid grid-cols-3 gap-3">
                  {(["College Bus", "Metro", "Self Drive"] as const).map((mode) => (
                    <button
                      id={`btn-onboard-transit-${mode.replace(/\s+/g, '-').toLowerCase()}`}
                      key={mode}
                      onClick={() => setOnboardTransport(mode)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition ${onboardTransport === mode ? "border-blue-500 bg-blue-50/50 text-blue-800" : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"}`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Launch Operating System */}
            <button
              id="btn-complete-onboarding"
              onClick={handleOnboardingComplete}
              className="w-full text-center text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Build & Sync Student Ecosystem</span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
          </div>
        </div>
      )}

      {/* 4. MAIN FULL-STACK OPERATING SYSTEM VIEW */}
      {flowState === "main" && (
        <div className={`flex-grow flex flex-col lg:flex-row relative min-h-0 ${darkTheme ? "bg-[#0B0F19] text-slate-100" : "bg-[#FAFAF8] text-slate-800"}`}>
          
          {/* Main left navigation bar */}
          <aside className={`w-full lg:w-64 border-b lg:border-b-0 lg:border-r p-5 flex flex-col justify-between shrink-0 transition-colors duration-200 ${darkTheme ? "bg-[#0F172A] border-slate-800 text-slate-100" : "bg-white border-slate-200/80 text-slate-800"}`}>
            <div>
              {/* Logo / Header */}
              <div className="flex items-center gap-2 mb-6">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 ${darkTheme ? "bg-blue-600" : "bg-slate-900"}`}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs font-sans tracking-tight">CampusOne OS</h3>
                  <span className={`text-[9px] font-mono tracking-wider block ${darkTheme ? "text-slate-500" : "text-slate-400"}`}>PREMIUM OS v1.0.4</span>
                </div>
              </div>

              {/* Navigation list */}
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    id={`sidebar-tab-${tab.id}`}
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all duration-150 ${currentTab === tab.id ? (darkTheme ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-800") : (darkTheme ? "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800")}`}
                  >
                    <span className={currentTab === tab.id ? "text-blue-500 font-bold" : (darkTheme ? "text-slate-500" : "text-slate-400")}>
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* User Session Profile bottom summary */}
            <div className={`mt-8 pt-4 border-t flex flex-col gap-3.5 ${darkTheme ? "border-slate-800" : "border-slate-100"}`}>
              <button
                id="btn-sidebar-trigger-ai-chat"
                onClick={() => setIsChatDrawerOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask Gemini Brain</span>
              </button>

              <div className="flex items-center gap-3">
                <img
                  src={getStudentAvatar(studentName)}
                  alt={studentName}
                  className={`w-9 h-9 rounded-full object-cover border ${darkTheme ? "border-slate-700" : "border-slate-200"}`}
                />
                <div className="flex-1 min-w-0">
                  <h4 className={`text-xs font-bold truncate font-sans ${darkTheme ? "text-slate-200" : "text-slate-800"}`}>{studentName}</h4>
                  <span className={`text-[9px] font-mono block truncate ${darkTheme ? "text-slate-500" : "text-slate-400"}`}>{studentEmail}</span>
                </div>
                <button
                  id="btn-sidebar-logout"
                  onClick={() => setFlowState("login")}
                  className={`p-1.5 rounded-lg transition ${darkTheme ? "text-slate-500 hover:text-rose-400 hover:bg-slate-800" : "text-slate-400 hover:text-rose-500 hover:bg-rose-50"}`}
                  title="Logout Session"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </aside>

          {/* Main workspace container */}
          <div className="flex-1 flex flex-row overflow-hidden relative">
            
            {/* Center Workspace Body Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
              
              {/* Top workspace action bar */}
              <header className={`h-16 px-6 md:px-8 flex items-center justify-between border-b sticky top-0 z-20 shrink-0 transition-colors duration-200 ${darkTheme ? "border-slate-800 bg-[#0F172A]/90 backdrop-blur-md text-slate-100" : "border-slate-200 bg-white/95 backdrop-blur-md text-slate-800"}`}>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-black tracking-tight font-display">CampusOS</span>
                  </div>
                  
                  <nav className="hidden md:flex gap-6 text-sm font-medium h-full items-center">
                    <button 
                      onClick={() => setCurrentTab("home")} 
                      className={`${currentTab === "home" ? "text-blue-500 font-bold border-b-2 border-blue-500" : (darkTheme ? "text-slate-400 hover:text-slate-100" : "text-slate-500 hover:text-slate-900")} h-16 flex items-center transition-all px-1 cursor-pointer`}
                    >
                      Dashboard
                    </button>
                    <button 
                      onClick={() => setCurrentTab("timetable")} 
                      className={`${currentTab === "timetable" ? "text-blue-500 font-bold border-b-2 border-blue-500" : (darkTheme ? "text-slate-400 hover:text-slate-100" : "text-slate-500 hover:text-slate-900")} h-16 flex items-center transition-all px-1 cursor-pointer`}
                    >
                      Timetable
                    </button>
                    <button 
                      onClick={() => setCurrentTab("attendance")} 
                      className={`${currentTab === "attendance" ? "text-blue-500 font-bold border-b-2 border-blue-500" : (darkTheme ? "text-slate-400 hover:text-slate-100" : "text-slate-500 hover:text-slate-900")} h-16 flex items-center transition-all px-1 cursor-pointer`}
                    >
                      Academics
                    </button>
                    <button 
                      onClick={() => setCurrentTab("navigation")} 
                      className={`${currentTab === "navigation" ? "text-blue-500 font-bold border-b-2 border-blue-500" : (darkTheme ? "text-slate-400 hover:text-slate-100" : "text-slate-500 hover:text-slate-900")} h-16 flex items-center transition-all px-1 cursor-pointer`}
                    >
                      Map
                    </button>
                  </nav>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    id="btn-header-trigger-chat"
                    onClick={() => setIsChatDrawerOpen(true)}
                    className={`p-2 px-3 rounded-xl transition text-xs font-semibold flex items-center gap-1.5 border cursor-pointer ${darkTheme ? "bg-blue-950/40 text-blue-400 border-blue-900/55 hover:bg-blue-950" : "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100"}`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Ask Student Brain</span>
                  </button>

                  <div className="hidden sm:flex flex-col text-right">
                    <div className={`text-xs font-bold ${darkTheme ? "text-slate-200" : "text-slate-800"}`}>{studentName}</div>
                    <div className={`text-[9px] uppercase tracking-widest font-mono ${darkTheme ? "text-slate-500" : "text-slate-400"}`}>Year 2 • CSE Major</div>
                  </div>
                  
                  <div className={`w-9 h-9 rounded-full overflow-hidden border ${darkTheme ? "bg-slate-800 border-slate-700" : "bg-slate-200 border-slate-200"}`}>
                    <img 
                      src={getStudentAvatar(studentName)} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>
              </header>

              {/* Dashboard Workspace */}
              <div className="flex-1 p-4 md:p-6 lg:p-8">
                <Dashboard
                  currentTab={currentTab}
                  setCurrentTab={setCurrentTab}
                  overrideNavigationPath={overrideNavPath}
                  setOverrideNavigationPath={setOverrideNavPath}
                  darkTheme={darkTheme}
                  setDarkTheme={setDarkTheme}
                  studentName={studentName}
                  studentEmail={studentEmail}
                />
              </div>

              {/* Bottom Status Bar inside main workspace */}
              <footer className={`h-8 px-6 md:px-8 border-t flex items-center justify-between text-[10px] font-bold tracking-wider uppercase shrink-0 ${darkTheme ? "bg-[#0F172A] border-slate-800 text-slate-500" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    AI Assistant: Online
                  </div>
                  <div>Sync: Active</div>
                </div>
                <div className="flex gap-4">
                  <span>Support</span>
                  <span>Help</span>
                  <span className={`${darkTheme ? "text-slate-600" : "text-slate-300"} font-medium italic`}>CampusOS v1.4.2</span>
                </div>
              </footer>
            </main>

            {/* Widescreen docked AI workspace panel (eliminates overlays and cutoffs) */}
            <AnimatePresence>
              {isChatDrawerOpen && (
                <motion.aside
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 420, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={`hidden xl:flex flex-col shrink-0 border-l overflow-hidden ${darkTheme ? "bg-[#0F172A] border-slate-800 text-slate-100" : "bg-[#FAFAF8] border-slate-200 text-slate-800"} h-full`}
                >
                  {/* Header controls */}
                  <div className={`border-b px-6 py-4 flex items-center justify-between shrink-0 ${darkTheme ? "bg-[#0F172A] border-slate-800 text-slate-200" : "bg-white border-slate-200 text-slate-800"}`}>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
                      <h3 className="font-sans font-bold text-sm">Gemini Academic Workspace</h3>
                    </div>
                    <button
                      id="btn-close-chat-pane"
                      onClick={() => setIsChatDrawerOpen(false)}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition ${darkTheme ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700" : "bg-slate-50 text-slate-400 border-slate-200/50 hover:bg-slate-100"}`}
                    >
                      Hide
                    </button>
                  </div>

                  {/* AI Chat Window instance */}
                  <div className="flex-1 overflow-hidden">
                    <AiChatWindow
                      onNavigationTriggered={(path) => {
                        setOverrideNavPath(path);
                      }}
                      darkTheme={darkTheme}
                    />
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

          </div>

          {/* Floating overlay drawer for standard/smaller viewports (< xl) */}
          <AnimatePresence>
            {isChatDrawerOpen && (
              <div className="xl:hidden fixed inset-0 z-45">
                {/* Close backdrop trigger */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsChatDrawerOpen(false)} 
                  className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs cursor-pointer" 
                />
                
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 220 }}
                  className={`absolute right-0 top-0 bottom-0 w-full sm:w-[480px] shadow-2xl z-50 flex flex-col h-full border-l ${darkTheme ? "bg-[#0F172A] border-slate-800 text-slate-100" : "bg-[#FAFAF8] border-slate-200 text-slate-800"}`}
                >
                  {/* Header controls */}
                  <div className={`border-b px-6 py-4 flex items-center justify-between shrink-0 ${darkTheme ? "bg-[#0F172A] border-slate-800 text-slate-200" : "bg-white border-slate-200 text-slate-800"}`}>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
                      <h3 className="font-sans font-bold text-sm">Gemini Academic Workspace</h3>
                    </div>
                    <button
                      id="btn-close-chat-drawer"
                      onClick={() => setIsChatDrawerOpen(false)}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition ${darkTheme ? "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700" : "bg-slate-50 text-slate-400 border-slate-200/50 hover:bg-slate-100"}`}
                    >
                      Hide
                    </button>
                  </div>

                  {/* AI Chat Window instance */}
                  <div className="flex-1 overflow-hidden">
                    <AiChatWindow
                      onNavigationTriggered={(path) => {
                        setOverrideNavPath(path);
                        setIsChatDrawerOpen(false); // Close drawer to display navigation map clearly
                      }}
                      darkTheme={darkTheme}
                    />
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      )}

      {/* Styled inline Tailwind custom animations via standard CSS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.99); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulseLine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .animate-pulse-line {
          animation: pulseLine 2s infinite linear;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94A3B8;
        }
      `}</style>
    </div>
  );
}
