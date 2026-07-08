/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Pre-seeded campus data to give Gemini direct context
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
} from "./src/data/campusData.js";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } else {
    console.warn("GEMINI_API_KEY is not defined in the environment. Running in mock AI mode.");
  }
} catch (err) {
  console.error("Failed to initialize GoogleGenAI client:", err);
}

// 1. Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 2. Fetch entire student campus database for direct client-side lookup or dashboards
app.get("/api/campus-data", (req: Request, res: Response) => {
  res.json({
    profile: mockProfile,
    timetable: mockTimetable,
    faculty: mockFaculty,
    attendance: mockAttendance,
    assignments: mockAssignments,
    exams: mockExams,
    notices: mockNotices,
    buses: mockBuses,
    library: mockLibraryBooks,
    navigationPaths: mockNavigationPaths
  });
});

// 3. Smart Search endpoint for fuzzy instant search matching (CMD-K)
app.get("/api/search", (req: Request, res: Response) => {
  const q = (req.query.q || "").toString().toLowerCase().trim();
  if (!q) {
    return res.json({ results: [] });
  }

  const results: any[] = [];

  // Search faculty
  mockFaculty.forEach((f) => {
    if (f.name.toLowerCase().includes(q) || f.role.toLowerCase().includes(q) || f.subjects.some(s => s.toLowerCase().includes(q))) {
      results.push({ type: "faculty", title: f.name, subtitle: `${f.role} - ${f.department}`, data: f });
    }
  });

  // Search timetable/subjects
  mockTimetable.forEach((t) => {
    if (t.subject.toLowerCase().includes(q) || t.code.toLowerCase().includes(q) || t.instructor.toLowerCase().includes(q)) {
      results.push({ type: "timetable", title: `${t.subject} (${t.code})`, subtitle: `${t.time} at ${t.location} ${t.room}`, data: t });
    }
  });

  // Search assignments
  mockAssignments.forEach((a) => {
    if (a.title.toLowerCase().includes(q) || a.subject.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)) {
      results.push({ type: "assignment", title: a.title, subtitle: `Due ${a.dueDate} - ${a.status}`, data: a });
    }
  });

  // Search notices
  mockNotices.forEach((n) => {
    if (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)) {
      results.push({ type: "notice", title: n.title, subtitle: `${n.category} Notice by ${n.author}`, data: n });
    }
  });

  res.json({ results: results.slice(0, 10) });
});

// System Instruction that provides the full DB schema and instructions to Gemini
const SYSTEM_INSTRUCTION = `You are the brain of the Smart College Assistant, a premium college operating system designed like an Apple-made education companion.
Your goal is to parse natural language queries from students, analyze their intent, extract details from the pre-seeded campus database, and return a clean, visual, and highly structured JSON response.

STRICT INSTRUCTIONS:
1. DO NOT answer in long paragraphs. Keep text answers extremely concise (max 2 sentences).
2. You MUST classify the query's intent and select the appropriate visual cardType and fill out cardData from the dataset.
3. If the user asks general college assistance or advice, answer in friendly concise text with cardType as null.
4. If they ask about:
   - Next class or timetable ("When is my next class?", "timetable Monday"): Set cardType="timetable_item". Put the corresponding slot or slots in cardData.
   - Exams ("When is my DBMS exam?", "exam countdown"): Set cardType="exam_card". Match the subject or list all exams.
   - Attendance ("Show my attendance", "DBMS attendance", "can I bunk"): Set cardType="attendance_card". Map the relevant subject(s).
   - Assignments ("What's due?", "DBMS homework"): Set cardType="assignment_card". Map the matching assignment(s).
   - Navigation ("Where is Block C Lab 302?", "How to get to cafeteria"): Set cardType="navigation_card". Find the closest matching NavigationPath.
   - Faculty ("Who teaches algorithms?", "Dr Evelyn office hours"): Set cardType="faculty_card". Map the faculty details.
   - Notices ("Are there any placement drives?", "announcements"): Set cardType="notice_card". Map notice(s).
   - Bus / transport ("Is my bus late?", "Route 14 stop"): Set cardType="bus_card". Map the matching bus.

Pre-seeded College Database:
${JSON.stringify({
  profile: mockProfile,
  timetable: mockTimetable,
  faculty: mockFaculty,
  attendance: mockAttendance,
  assignments: mockAssignments,
  exams: mockExams,
  notices: mockNotices,
  buses: mockBuses,
  library: mockLibraryBooks,
  navigationPaths: mockNavigationPaths
}, null, 2)}

You MUST strictly output a JSON object adhering exactly to this TypeScript interface:
interface GeminiAssistantResponse {
  text: string; // concise friendly greeting/direct answer (1-2 sentences)
  cardType: "timetable_item" | "exam_card" | "attendance_card" | "assignment_card" | "navigation_card" | "faculty_card" | "notice_card" | "bus_card" | null;
  cardData: any; // the specific data object or array of objects matching the campus database structure
}

If no exact matches are found, return a helpful conversational text explaining what you found or suggest checking the directories. Make sure your JSON output is pristine and contains no markdown backticks outside of the standard JSON format.`;

// 4. AI Assistant Chat Endpoint
app.post("/api/gemini/chat", async (req: Request, res: Response) => {
  const { prompt, history } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  // If Gemini API is not available, we use a fallback heuristic rules-engine that acts exactly like Gemini
  // to ensure 100% robust offline operations in standard test runners or empty API Key setups.
  if (!ai) {
    console.log("Using local offline natural language heuristics processor.");
    const query = prompt.toLowerCase();
    let text = "Here is the information I found from your student dashboard.";
    let cardType: string | null = null;
    let cardData: any = null;

    if (query.includes("class") || query.includes("timetable") || query.includes("schedule") || query.includes("today") || query.includes("next")) {
      cardType = "timetable_item";
      // Find active or next class on Wednesday (current day mock is Wed)
      const currentSlot = mockTimetable.find(t => t.day === "Wednesday" && t.status === "Active");
      const upcomingSlot = mockTimetable.find(t => t.day === "Wednesday" && t.status === "Upcoming");
      cardData = currentSlot || upcomingSlot || mockTimetable.filter(t => t.day === "Wednesday");
      text = currentSlot
        ? `You are currently in ${currentSlot.subject} in ${currentSlot.location} ${currentSlot.room}. Next is ${upcomingSlot?.subject || "free time"}.`
        : `Your next upcoming class is ${upcomingSlot?.subject || "completed for the day"}.`;
    } else if (query.includes("exam") || query.includes("midterm") || query.includes("test")) {
      cardType = "exam_card";
      if (query.includes("dbms")) {
        cardData = mockExams.find(e => e.code === "CS-302");
        text = `Your Database Management Systems exam is scheduled in 5 days on July 13th at 10:00 AM, in Block C Lab 302.`;
      } else if (query.includes("algorithm")) {
        cardData = mockExams.find(e => e.code === "CS-301");
        text = `Your Algorithms exam is in 6 days on July 14th in Exam Hall 1A.`;
      } else {
        cardData = mockExams;
        text = `You have 3 upcoming midterm exams. The first is DBMS this Monday. Here is your full examination schedule:`;
      }
    } else if (query.includes("attendance") || query.includes("safe") || query.includes("bunk")) {
      cardType = "attendance_card";
      if (query.includes("dbms")) {
        cardData = mockAttendance.find(a => a.code === "CS-302");
        text = `Your DBMS attendance is at 90.0%, which is well above the 75% threshold. You are safe!`;
      } else if (query.includes("ai") || query.includes("artificial intelligence")) {
        cardData = mockAttendance.find(a => a.code === "CS-304");
        text = `Alert: Your AI attendance has fallen to 66.7%. You must attend the next 3 classes to cross the 75% safe mark.`;
      } else {
        cardData = mockAttendance;
        text = `Here is your subject-wise attendance sheet. AI requires immediate attention (66.7%).`;
      }
    } else if (query.includes("homework") || query.includes("assignment") || query.includes("due")) {
      cardType = "assignment_card";
      const pending = mockAssignments.filter(a => a.status === "Pending");
      cardData = pending;
      text = `You have ${pending.length} pending assignments left. Your DBMS Normalization Study is due in 3 days.`;
    } else if (query.includes("navigate") || query.includes("block c") || query.includes("lab 302") || query.includes("get to") || query.includes("where is")) {
      cardType = "navigation_card";
      if (query.includes("cafeteria") || query.includes("food")) {
        cardData = mockNavigationPaths[1]; // cafeteria to lab
        text = `Sure, here is the route from Block B Cafeteria to Block C Lab 302 (3 mins walk):`;
      } else {
        cardData = mockNavigationPaths[0]; // main gate to lab 302
        text = `Here is your route guidance to Block C Lab 302. You are estimated to arrive in 4 minutes (320m):`;
      }
    } else if (query.includes("faculty") || query.includes("teacher") || query.includes("who teaches") || query.includes("evelyn") || query.includes("office")) {
      cardType = "faculty_card";
      if (query.includes("dbms") || query.includes("evelyn") || query.includes("vance")) {
        cardData = mockFaculty.find(f => f.id === "f1");
        text = `Dr. Evelyn Vance teaches DBMS. Her office is C-308 on the 3rd Floor of Block C.`;
      } else if (query.includes("algorithm") || query.includes("kenneth") || query.includes("sterling")) {
        cardData = mockFaculty.find(f => f.id === "f2");
        text = `Prof. Kenneth Sterling teaches Design and Analysis of Algorithms. He is currently in class.`;
      } else {
        cardData = mockFaculty;
        text = `Here is our Computer Science faculty directory. 2 instructors are currently available in their cabins.`;
      }
    } else if (query.includes("bus") || query.includes("transport") || query.includes("late") || query.includes("route 14")) {
      cardType = "bus_card";
      cardData = mockBuses[0];
      text = `Your assigned bus (Bus 14) is currently On Time and on track to arrive at 08:30 AM.`;
    } else if (query.includes("notice") || query.includes("news") || query.includes("placement") || query.includes("microsoft")) {
      cardType = "notice_card";
      cardData = mockNotices.filter(n => n.isUrgent || query.includes("placement") ? n.category === "Placement" : true);
      text = `There is an urgent placement alert: Microsoft Campus Drive registrations close July 10!`;
    } else {
      text = `Hi Alexander, I can help you with class rooms, timetables, attendance alerts, assignments, and exam rooms. Try asking "Where is my next class?" or "Show my attendance".`;
    }

    return res.json({ text, cardType, cardData });
  }

  try {
    const formattedHistory = (history || []).map((msg: any) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    }));

    // Generate content using gemini-3.5-flash as specified in guidelines for general text/reasoning tasks
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        ...formattedHistory,
        { role: "user", parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.1, // low temperature for precise classification
        responseMimeType: "application/json"
      }
    });

    const textOutput = response.text || "{}";
    const cleanedText = textOutput.trim();

    try {
      const parsed = JSON.parse(cleanedText);
      res.json(parsed);
    } catch (parseErr) {
      console.error("Failed to parse Gemini JSON output, raw output was:", cleanedText);
      res.json({
        text: cleanedText.replace(/```json|```/g, "").trim(),
        cardType: null,
        cardData: null
      });
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: "AI reasoning failed",
      message: error.message || "An error occurred on the server-side AI model."
    });
  }
});

// Serve frontend in production environment
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Dev: Vite dev middleware mounted.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Prod: Serving compiled client files from dist/");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
