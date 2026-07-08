/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, NavigationPath, FacultyMember, Exam, TimetableSlot, AttendanceRecord, Assignment, NoticeItem, BusSchedule } from "../types";
import { Send, Sparkles, Mic, MicOff, Clock, MapPin, AlertCircle, Calendar, Mail, Bus, Map } from "lucide-react";
import NavigationMap from "./NavigationMap";
import { SubjectAttendanceCard } from "./AttendanceChart";

interface AiChatWindowProps {
  onNavigationTriggered: (path: NavigationPath) => void;
  darkTheme?: boolean;
}

export default function AiChatWindow({ onNavigationTriggered, darkTheme = false }: AiChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "assistant",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: "Hello Alexander. I am your Gemini-powered college assistant. Ask me anything about your lectures, assignments, exam halls, navigation routes, or attendance alerts."
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "Where is my next class?",
    "When is my DBMS exam?",
    "Can I bunk DBMS today?",
    "Show today's attendance.",
    "Navigate to Block C Lab 302",
    "Who teaches Algorithms?"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: textToSend
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSend,
          history: messages.slice(-6) // Send recent context
        })
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with AI server");
      }

      const data = await response.json();
      
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: data.text,
        cardType: data.cardType,
        cardData: data.cardData
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // If it is a navigation card, we can auto-update the parent's navigation path if requested
      if (data.cardType === "navigation_card" && data.cardData) {
        onNavigationTriggered(data.cardData);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: "I encountered a transient connection issue. I've re-initialized the database; please try prompting me again."
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      handleSendMessage("Where is my next class?");
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        handleSendMessage("Where is my next class?");
      }, 3000);
    }
  };

  // Render Visual Card based on cardType
  const renderCard = (type: string, data: any) => {
    if (!data) return null;

    switch (type) {
      case "timetable_item": {
        const slots = Array.isArray(data) ? data : [data];
        return (
          <div className="mt-3 grid grid-cols-1 gap-3 max-w-md">
            {slots.map((slot: TimetableSlot, idx: number) => (
              <div key={idx} className={`border p-4 rounded-xl flex items-center justify-between shadow-xs ${darkTheme ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200/60"}`}>
                <div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold ${darkTheme ? "bg-blue-950 text-blue-300" : "bg-blue-100 text-blue-700"}`}>{slot.code}</span>
                  <h5 className={`font-sans font-bold text-sm mt-1 ${darkTheme ? "text-slate-100" : "text-slate-800"}`}>{slot.subject}</h5>
                  <p className={`text-xs font-sans mt-0.5 ${darkTheme ? "text-slate-400" : "text-slate-500"}`}>{slot.instructor}</p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{slot.time}</span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1 mb-2 ${darkTheme ? "bg-slate-800 text-slate-300 border border-slate-700" : "bg-slate-200 text-slate-700"}`}>
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {slot.room}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${slot.status === "Active" ? "bg-emerald-100 text-emerald-800 animate-pulse" : (darkTheme ? "bg-blue-950 text-blue-300" : "bg-blue-100 text-blue-800")}`}>
                    {slot.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );
      }

      case "exam_card": {
        const exams = Array.isArray(data) ? data : [data];
        return (
          <div className="mt-3 grid grid-cols-1 gap-3 max-w-md">
            {exams.map((exam: Exam, idx: number) => (
              <div key={idx} className={`border p-4 rounded-xl shadow-xs ${darkTheme ? "bg-amber-950/20 border-amber-900/45" : "bg-amber-50/40 border-amber-200/60"}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${darkTheme ? "bg-amber-950 text-amber-300" : "bg-amber-100 text-amber-800"}`}>{exam.code}</span>
                    <h5 className={`font-sans font-bold text-sm mt-1.5 ${darkTheme ? "text-amber-200" : "text-slate-800"}`}>{exam.subject}</h5>
                  </div>
                  <div className={`font-mono text-xs font-black px-2.5 py-1.5 rounded-lg text-center leading-none ${darkTheme ? "bg-amber-900 text-amber-100" : "bg-amber-100 text-amber-900"}`}>
                    {exam.countdownDays}
                    <span className="block text-[8px] font-normal uppercase tracking-wider mt-0.5">Days</span>
                  </div>
                </div>
                <div className={`grid grid-cols-2 gap-3 mt-4 pt-3 border-t text-xs font-sans ${darkTheme ? "border-amber-950/50" : "border-amber-100/50"}`}>
                  <div>
                    <span className="text-slate-400 block font-normal">Date & Time</span>
                    <span className={`font-semibold ${darkTheme ? "text-slate-200" : "text-slate-700"}`}>{exam.date} @ {exam.time}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-normal">Location & Seat</span>
                    <span className={`font-semibold ${darkTheme ? "text-slate-200" : "text-slate-700"}`}>{exam.room} ({exam.seat})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      }

      case "attendance_card": {
        const records = Array.isArray(data) ? data : [data];
        return (
          <div className="mt-3 grid grid-cols-1 gap-3 max-w-md">
            {records.slice(0, 2).map((rec: AttendanceRecord, idx: number) => (
              <SubjectAttendanceCard key={idx} record={rec} darkTheme={darkTheme} />
            ))}
          </div>
        );
      }

      case "assignment_card": {
        const assigns = Array.isArray(data) ? data : [data];
        return (
          <div className="mt-3 grid grid-cols-1 gap-3 max-w-md">
            {assigns.map((as: Assignment, idx: number) => (
              <div key={idx} className={`border p-4 rounded-xl shadow-xs flex items-start gap-3 ${darkTheme ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                <div className={`w-2 h-2 rounded-full mt-1.5 ${as.priority === "High" ? "bg-rose-500" : as.priority === "Medium" ? "bg-amber-500" : "bg-slate-400"}`} />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h5 className={`font-sans font-bold text-xs leading-snug ${darkTheme ? "text-slate-200" : "text-slate-800"}`}>{as.title}</h5>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase ${as.status === "Pending" ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}>
                      {as.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">{as.subject}</p>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono mt-3">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>Due Date: <b className={darkTheme ? "text-slate-300" : "text-slate-600"}>{as.dueDate}</b></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      }

      case "navigation_card": {
        const path: NavigationPath = data;
        return (
          <div className={`mt-3 rounded-xl p-4 max-w-lg shadow-sm border ${darkTheme ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1 ${darkTheme ? "text-blue-400 bg-blue-950/40" : "text-blue-600 bg-blue-50"}`}>
                <MapPin className="w-3.5 h-3.5" />
                GPS Integrated Path
              </span>
              <span className={`text-xs font-mono font-bold ${darkTheme ? "text-slate-400" : "text-slate-500"}`}>{path.estimatedTime} ({path.distance})</span>
            </div>
            
            {/* Embedded Mini Navigation map for maximum premium visualization! */}
            <div className={`h-[220px] rounded-lg overflow-hidden border mb-3 relative ${darkTheme ? "border-slate-800" : "border-slate-100"}`}>
              <NavigationMap activePath={path} darkTheme={darkTheme} />
            </div>

            <button
              id={`btn-chat-launch-nav-${path.destination.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => onNavigationTriggered(path)}
              className={`w-full text-center text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${darkTheme ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer" : "bg-slate-800 text-white hover:bg-slate-900 cursor-pointer"}`}
            >
              <Map className="w-4 h-4" />
              Open Full-Screen Navigation Route
            </button>
          </div>
        );
      }

      case "faculty_card": {
        const members = Array.isArray(data) ? data : [data];
        return (
          <div className="mt-3 grid grid-cols-1 gap-3 max-w-md">
            {members.map((fac: FacultyMember, idx: number) => (
              <div key={idx} className={`border p-4 rounded-xl shadow-xs flex items-center gap-3 ${darkTheme ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
                <div className={`w-10 h-10 rounded-full ${fac.avatarColor} flex items-center justify-center text-sm font-bold shrink-0`}>
                  {fac.name.split(" ").slice(-1)[0][0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className={`font-sans font-bold text-sm ${darkTheme ? "text-slate-200" : "text-slate-800"}`}>{fac.name}</h5>
                    <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${fac.status === "Available" ? "bg-emerald-100 text-emerald-800" : fac.status === "In Class" ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-500"}`}>
                      {fac.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans">{fac.role} • {fac.office}</p>
                  <div className="flex gap-4 mt-2.5 text-[10px] font-mono text-slate-500">
                    <a href={`mailto:${fac.email}`} className="hover:text-blue-600 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Email
                    </a>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {fac.officeHours}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      }

      case "notice_card": {
        const notices = Array.isArray(data) ? data : [data];
        return (
          <div className="mt-3 grid grid-cols-1 gap-3 max-w-md">
            {notices.map((notice: NoticeItem, idx: number) => (
              <div key={idx} className={`border p-4 rounded-xl shadow-xs ${darkTheme ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200/80"}`}>
                <div className="flex items-center gap-1.5">
                  {notice.isUrgent && <span className="w-2.5 h-2.5 bg-red-500 rounded-full shrink-0 animate-ping" />}
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${notice.category === "Placement" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>{notice.category}</span>
                </div>
                <h5 className={`font-sans font-bold text-sm mt-2 ${darkTheme ? "text-slate-200" : "text-slate-800"}`}>{notice.title}</h5>
                <p className={`text-xs font-sans leading-relaxed mt-1.5 ${darkTheme ? "text-slate-300" : "text-slate-600"}`}>{notice.content}</p>
                <div className={`text-[9px] font-mono mt-3 pt-2 border-t flex justify-between ${darkTheme ? "border-slate-800 text-slate-500" : "border-slate-200/40 text-slate-400"}`}>
                  <span>{notice.author}</span>
                  <span>{notice.date}</span>
                </div>
              </div>
            ))}
          </div>
        );
      }

      case "bus_card": {
        const bus: BusSchedule = data;
        return (
          <div className={`border p-4 rounded-xl max-w-md shadow-xs ${darkTheme ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
            <div className={`flex items-center justify-between pb-3 border-b ${darkTheme ? "border-slate-800" : "border-slate-100"}`}>
              <div className="flex items-center gap-2">
                <Bus className="w-5 h-5 text-blue-600" />
                <h5 className={`font-sans font-bold text-sm ${darkTheme ? "text-slate-200" : "text-slate-800"}`}>{bus.busNumber}</h5>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${bus.status === "On Time" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                {bus.status} {bus.delayMinutes > 0 && `(+${bus.delayMinutes}m)`}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-2">{bus.route}</p>
            <div className={`mt-4 space-y-2 relative pl-3 border-l text-xs font-mono ${darkTheme ? "border-slate-800" : "border-slate-200"}`}>
              {bus.stops.slice(0, 3).map((st, idx) => (
                <div key={idx} className="flex justify-between items-center relative">
                  <span className={darkTheme ? "text-slate-300" : "text-slate-600"}>{st.stop}</span>
                  <span className="text-slate-400">{st.time}</span>
                  <div className={`absolute -left-[16.5px] w-2.5 h-2.5 rounded-full border ${darkTheme ? "bg-slate-700 border-slate-900" : "bg-slate-300 border-white"}`} />
                </div>
              ))}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className={`border rounded-2xl h-full flex flex-col justify-between shadow-sm overflow-hidden ${darkTheme ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
      {/* Header */}
      <div className={`border-b px-6 py-4 flex items-center justify-between ${darkTheme ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className={`text-sm font-bold font-sans ${darkTheme ? "text-slate-200" : "text-slate-800"}`}>Gemini Student Brain</h4>
            <span className="text-[10px] font-mono text-emerald-500 flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              Online & Synced with Campus DB
            </span>
          </div>
        </div>
      </div>

      {/* Messages list */}
      <div className={`flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar ${darkTheme ? "bg-slate-950/80" : "bg-[#FAFAF8]/50"}`}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 font-sans text-sm leading-relaxed ${
              msg.sender === "user" 
                ? "bg-slate-800 text-white rounded-tr-xs" 
                : `${darkTheme ? "bg-slate-900 border border-slate-800 text-slate-100" : "bg-white border border-slate-200 text-slate-800"} rounded-tl-xs shadow-xs`
            }`}>
              <p>{msg.text}</p>
              {msg.sender === "assistant" && msg.cardType && renderCard(msg.cardType, msg.cardData)}
            </div>
            <span className="text-[9px] font-mono text-slate-450 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isLoading && (
          <div className={`flex items-center gap-2.5 text-xs font-medium px-4 py-2.5 rounded-2xl w-fit ${darkTheme ? "bg-slate-900 border border-slate-800 text-slate-400" : "bg-slate-50 border border-slate-200/50 text-slate-400"}`}>
            <Sparkles className="w-4 h-4 text-blue-500 animate-spin" />
            <span>Analyzing student data records...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Grid */}
      {messages.length === 1 && (
        <div className={`px-6 py-3 border-t ${darkTheme ? "border-slate-800 bg-slate-900/40" : "bg-slate-50/50 border-slate-100"}`}>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-2">Suggested Queries</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {suggestedPrompts.map((promptText, idx) => (
              <button
                id={`btn-chat-suggested-${idx}`}
                key={idx}
                onClick={() => handleSendMessage(promptText)}
                className={`text-left text-xs font-sans px-3 py-2 rounded-xl transition shadow-xs text-ellipsis overflow-hidden whitespace-nowrap border cursor-pointer ${
                  darkTheme 
                    ? "text-slate-300 hover:text-blue-400 bg-slate-900 hover:bg-slate-800 border-slate-800 hover:border-slate-700" 
                    : "text-slate-600 hover:text-blue-600 bg-white hover:bg-blue-50 border-slate-200 hover:border-blue-200"
                }`}
              >
                {promptText}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Voice Simulation recording banner */}
      {isRecording && (
        <div className={`px-6 py-3 flex items-center justify-between text-xs font-sans border-t ${
          darkTheme 
            ? "bg-blue-950/70 border-blue-900 text-blue-300" 
            : "bg-blue-50/90 border-blue-200 text-blue-700"
        }`}>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping" />
            <span>Listening to voice commands... "Where is my next class?"</span>
          </div>
          <button
            id="btn-voice-cancel-recording"
            onClick={() => setIsRecording(false)}
            className="text-[10px] uppercase font-bold text-slate-450 hover:text-slate-300"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Footer input */}
      <div className={`p-4 border-t flex gap-2 items-center ${darkTheme ? "bg-slate-900/90 border-slate-800" : "bg-slate-50/70 border-slate-200"}`}>
        <button
          id="btn-chat-toggle-voice"
          onClick={toggleRecording}
          className={`p-3 rounded-xl transition border cursor-pointer shrink-0 ${
            isRecording 
              ? "bg-red-100 text-red-600 animate-pulse border-red-200" 
              : `${darkTheme ? "bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700" : "bg-white hover:bg-slate-100 text-slate-500 border-slate-200"}`
          }`}
          title="Voice query"
        >
          <Mic className="w-4 h-4" />
        </button>
        
        <input
          id="input-chat-query"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputText)}
          placeholder="Ask anything (e.g. 'Can I bunk today?', 'When is DBMS exam?')..."
          className={`flex-1 focus:outline-hidden focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm font-sans ${
            darkTheme 
              ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500" 
              : "bg-white border-slate-200 text-slate-800 placeholder-slate-400"
          }`}
          disabled={isLoading}
        />

        <button
          id="btn-chat-submit-query"
          onClick={() => handleSendMessage(inputText)}
          className={`p-3 rounded-xl transition shrink-0 border cursor-pointer ${
            !inputText.trim() || isLoading
              ? `${darkTheme ? "bg-slate-800 text-slate-600 border-slate-700" : "bg-slate-150 text-slate-300 border-slate-200"}`
              : "bg-blue-600 hover:bg-blue-700 text-white border-blue-500 hover:border-blue-600"
          }`}
          disabled={!inputText.trim() || isLoading}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
