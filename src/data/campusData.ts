/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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

export const mockProfile: StudentProfile = {
  name: "Alexander Mercer",
  rollNumber: "CS-2023-0842",
  email: "a.mercer@college.edu",
  semester: "5th Semester",
  major: "Computer Science & Engineering",
  cgpa: 3.84,
  cgpaHistory: [
    { semester: "1st Sem", gpa: 3.75 },
    { semester: "2nd Sem", gpa: 3.80 },
    { semester: "3rd Sem", gpa: 3.91 },
    { semester: "4th Sem", gpa: 3.90 }
  ],
  hostelStatus: "Day Scholar",
  transportMode: "College Bus",
  busRouteId: "Route 14",
  avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80"
};

export const mockTimetable: TimetableSlot[] = [
  // Monday
  {
    id: "t1",
    day: "Monday",
    subject: "Database Management Systems",
    code: "CS-302",
    instructor: "Dr. Evelyn Vance",
    time: "09:00 AM - 10:30 AM",
    startHour24: 9,
    endHour24: 10.5,
    location: "Block C",
    room: "Lab 302",
    status: "Completed"
  },
  {
    id: "t2",
    day: "Monday",
    subject: "Design and Analysis of Algorithms",
    code: "CS-301",
    instructor: "Prof. Kenneth Sterling",
    time: "10:45 AM - 12:15 PM",
    startHour24: 10.75,
    endHour24: 12.25,
    location: "Block C",
    room: "Classroom 101",
    status: "Completed"
  },
  {
    id: "t3",
    day: "Monday",
    subject: "Artificial Intelligence",
    code: "CS-304",
    instructor: "Dr. Marcus Thorne",
    time: "01:30 PM - 03:00 PM",
    startHour24: 13.5,
    endHour24: 15,
    location: "Block A",
    room: "Seminar Room 3",
    status: "Completed"
  },

  // Tuesday
  {
    id: "t4",
    day: "Tuesday",
    subject: "Software Engineering",
    code: "CS-303",
    instructor: "Dr. Sarah Jenkins",
    time: "09:00 AM - 10:30 AM",
    startHour24: 9,
    endHour24: 10.5,
    location: "Block B",
    room: "Room 404",
    status: "Completed"
  },
  {
    id: "t5",
    day: "Tuesday",
    subject: "Database Management Systems",
    code: "CS-302",
    instructor: "Dr. Evelyn Vance",
    time: "11:00 AM - 12:30 PM",
    startHour24: 11,
    endHour24: 12.5,
    location: "Block C",
    room: "Lab 302",
    status: "Completed"
  },
  {
    id: "t6",
    day: "Tuesday",
    subject: "Compiler Design",
    code: "CS-305",
    instructor: "Prof. Helena Carter",
    time: "02:00 PM - 03:30 PM",
    startHour24: 14,
    endHour24: 15.5,
    location: "Block B",
    room: "Room 201",
    status: "Completed"
  },

  // Wednesday (Today is Wednesday in local time context 2026-07-08 is Wednesday)
  {
    id: "t7",
    day: "Wednesday",
    subject: "Design and Analysis of Algorithms",
    code: "CS-301",
    instructor: "Prof. Kenneth Sterling",
    time: "09:00 AM - 10:30 AM",
    startHour24: 9,
    endHour24: 10.5,
    location: "Block C",
    room: "Classroom 101",
    status: "Completed"
  },
  {
    id: "t8",
    day: "Wednesday",
    subject: "Artificial Intelligence",
    code: "CS-304",
    instructor: "Dr. Marcus Thorne",
    time: "11:00 AM - 12:30 PM",
    startHour24: 11,
    endHour24: 12.5,
    location: "Block A",
    room: "Seminar Room 3",
    status: "Active"
  },
  {
    id: "t9",
    day: "Wednesday",
    subject: "Compiler Design",
    code: "CS-305",
    instructor: "Prof. Helena Carter",
    time: "01:30 PM - 03:00 PM",
    startHour24: 13.5,
    endHour24: 15,
    location: "Block B",
    room: "Room 201",
    status: "Upcoming"
  },
  {
    id: "t10",
    day: "Wednesday",
    subject: "Student Support & Placement Seminar",
    code: "CS-PL-01",
    instructor: "Placement Cell Lead",
    time: "03:15 PM - 04:30 PM",
    startHour24: 15.25,
    endHour24: 16.5,
    location: "Block A",
    room: "Auditorium",
    status: "Upcoming"
  },

  // Thursday
  {
    id: "t11",
    day: "Thursday",
    subject: "Software Engineering",
    code: "CS-303",
    instructor: "Dr. Sarah Jenkins",
    time: "09:00 AM - 10:30 AM",
    startHour24: 9,
    endHour24: 10.5,
    location: "Block B",
    room: "Room 404",
    status: "Free"
  },
  {
    id: "t12",
    day: "Thursday",
    subject: "Design and Analysis of Algorithms",
    code: "CS-301",
    instructor: "Prof. Kenneth Sterling",
    time: "11:00 AM - 12:30 PM",
    startHour24: 11,
    endHour24: 12.5,
    location: "Block C",
    room: "Classroom 101",
    status: "Free"
  },
  {
    id: "t13",
    day: "Thursday",
    subject: "AI Project Laboratory",
    code: "CS-304L",
    instructor: "Dr. Marcus Thorne",
    time: "01:30 PM - 04:30 PM",
    startHour24: 13.5,
    endHour24: 16.5,
    location: "Block A",
    room: "Lab 5 (AI Lab)",
    status: "Free"
  },

  // Friday
  {
    id: "t14",
    day: "Friday",
    subject: "Database Management Systems",
    code: "CS-302",
    instructor: "Dr. Evelyn Vance",
    time: "09:00 AM - 10:30 AM",
    startHour24: 9,
    endHour24: 10.5,
    location: "Block C",
    room: "Lab 302",
    status: "Free"
  },
  {
    id: "t15",
    day: "Friday",
    subject: "Software Engineering",
    code: "CS-303",
    instructor: "Dr. Sarah Jenkins",
    time: "11:00 AM - 12:30 PM",
    startHour24: 11,
    endHour24: 12.5,
    location: "Block B",
    room: "Room 404",
    status: "Free"
  }
];

export const mockFaculty: FacultyMember[] = [
  {
    id: "f1",
    name: "Dr. Evelyn Vance",
    role: "Associate Professor",
    department: "Computer Science & Engineering",
    email: "e.vance@college.edu",
    office: "Block C, 3rd Floor, Cabin C-308",
    status: "Available",
    officeHours: "Mon & Fri: 02:00 PM - 04:00 PM",
    subjects: ["Database Management Systems", "Advanced DBMS"],
    avatarColor: "bg-blue-100 text-blue-700"
  },
  {
    id: "f2",
    name: "Prof. Kenneth Sterling",
    role: "Head of Department",
    department: "Computer Science & Engineering",
    email: "k.sterling@college.edu",
    office: "Block C, 1st Floor, HoD Suite",
    status: "In Class",
    officeHours: "Tue & Wed: 10:00 AM - 12:00 PM",
    subjects: ["Design and Analysis of Algorithms", "Complexity Theory"],
    avatarColor: "bg-purple-100 text-purple-700"
  },
  {
    id: "f3",
    name: "Dr. Marcus Thorne",
    role: "Assistant Professor",
    department: "Computer Science & Engineering",
    email: "m.thorne@college.edu",
    office: "Block A, 2nd Floor, Cabin A-215",
    status: "In Class",
    officeHours: "Wed & Thu: 03:00 PM - 05:00 PM",
    subjects: ["Artificial Intelligence", "Machine Learning"],
    avatarColor: "bg-emerald-100 text-emerald-700"
  },
  {
    id: "f4",
    name: "Dr. Sarah Jenkins",
    role: "Senior Lecturer",
    department: "Computer Science & Engineering",
    email: "s.jenkins@college.edu",
    office: "Block B, 4th Floor, Cabin B-402",
    status: "Available",
    officeHours: "Tue & Thu: 01:00 PM - 03:00 PM",
    subjects: ["Software Engineering", "UI/UX Foundations"],
    avatarColor: "bg-amber-100 text-amber-700"
  },
  {
    id: "f5",
    name: "Prof. Helena Carter",
    role: "Professor",
    department: "Computer Science & Engineering",
    email: "h.carter@college.edu",
    office: "Block B, 2nd Floor, Cabin B-210",
    status: "Away",
    officeHours: "Mon & Wed: 11:00 AM - 01:00 PM",
    subjects: ["Compiler Design", "Formal Languages"],
    avatarColor: "bg-rose-100 text-rose-700"
  }
];

export const mockAttendance: AttendanceRecord[] = [
  {
    id: "a1",
    subject: "Database Management Systems",
    code: "CS-302",
    attended: 18,
    total: 20,
    percentage: 90.0,
    targetPercentage: 75.0,
    history: [
      { date: "2026-07-06", status: "Present" },
      { date: "2026-07-01", status: "Present" },
      { date: "2026-06-29", status: "Absent" },
      { date: "2026-06-24", status: "Present" }
    ]
  },
  {
    id: "a2",
    subject: "Design and Analysis of Algorithms",
    code: "CS-301",
    attended: 16,
    total: 21,
    percentage: 76.2,
    targetPercentage: 75.0,
    history: [
      { date: "2026-07-08", status: "Present" },
      { date: "2026-07-06", status: "Present" },
      { date: "2026-07-01", status: "Absent" },
      { date: "2026-06-29", status: "Absent" }
    ]
  },
  {
    id: "a3",
    subject: "Artificial Intelligence",
    code: "CS-304",
    attended: 10,
    total: 15,
    percentage: 66.7, // Urgent attention!
    targetPercentage: 75.0,
    history: [
      { date: "2026-07-08", status: "Absent" }, // Bunked today!
      { date: "2026-07-01", status: "Present" },
      { date: "2026-06-24", status: "Absent" },
      { date: "2026-06-17", status: "Present" }
    ]
  },
  {
    id: "a4",
    subject: "Software Engineering",
    code: "CS-303",
    attended: 17,
    total: 18,
    percentage: 94.4,
    targetPercentage: 75.0,
    history: [
      { date: "2026-07-07", status: "Present" },
      { date: "2026-06-30", status: "Present" },
      { date: "2026-06-23", status: "Present" }
    ]
  },
  {
    id: "a5",
    subject: "Compiler Design",
    code: "CS-305",
    attended: 13,
    total: 16,
    percentage: 81.3,
    targetPercentage: 75.0,
    history: [
      { date: "2026-07-07", status: "Present" },
      { date: "2026-06-30", status: "Present" },
      { date: "2026-06-23", status: "Absent" }
    ]
  }
];

export const mockAssignments: Assignment[] = [
  {
    id: "as1",
    title: "SQL Schema Design & Normalization Study",
    subject: "Database Management Systems",
    code: "CS-302",
    dueDate: "2026-07-11", // in 3 days
    description: "Design a 3NF normalized database schema for a university bookstore including ER diagram and DDL scripts.",
    status: "Pending",
    priority: "High"
  },
  {
    id: "as2",
    title: "Greedy Algorithms vs Dynamic Programming",
    subject: "Design and Analysis of Algorithms",
    code: "CS-301",
    dueDate: "2026-07-15", // in 7 days
    description: "Solve the fractional vs 0/1 knapsack problems and write a comparative analysis of their space-time complexity.",
    status: "Pending",
    priority: "Medium"
  },
  {
    id: "as3",
    title: "Project Proposal: Heuristics Search Game Agent",
    subject: "Artificial Intelligence",
    code: "CS-304",
    dueDate: "2026-07-08", // Due Today!
    description: "Submit a 2-page project roadmap detailing your game environment and customized heuristic function for Alpha-Beta pruning.",
    status: "Submitted",
    priority: "High"
  },
  {
    id: "as4",
    title: "Agile SRS Document Draft",
    subject: "Software Engineering",
    code: "CS-303",
    dueDate: "2026-07-20",
    description: "Compile a comprehensive Software Requirements Specification document for your assigned campus app projects.",
    status: "Pending",
    priority: "Low"
  }
];

export const mockExams: Exam[] = [
  {
    id: "e1",
    subject: "Database Management Systems (Midterm-II)",
    code: "CS-302",
    date: "2026-07-13", // Monday next week
    time: "10:00 AM - 12:00 PM",
    room: "Block C, Lab 302",
    seat: "C3-Row 4-Seat 12",
    countdownDays: 5,
    syllabus: [
      "Relational Query Processing and Optimization",
      "Transaction Management & ACID properties",
      "Concurrency Control Protocols (2PL, Timestamping)",
      "Crash Recovery and Logging"
    ],
    preparationPercentage: 75
  },
  {
    id: "e2",
    subject: "Design and Analysis of Algorithms (Midterm-II)",
    code: "CS-301",
    date: "2026-07-14",
    time: "10:00 AM - 12:00 PM",
    room: "Block C, Exam Hall 1A",
    seat: "C1-Row 2-Seat 08",
    countdownDays: 6,
    syllabus: [
      "Dynamic Programming (LCS, Matrix Chain)",
      "Greedy Strategy and Spanning Trees",
      "Graph traversals (BFS, DFS, Dijkstra, Bellman-Ford)",
      "Amortized Analysis Overview"
    ],
    preparationPercentage: 60
  },
  {
    id: "e3",
    subject: "Compiler Design (Theoretical)",
    code: "CS-305",
    date: "2026-07-16",
    time: "02:00 PM - 04:00 PM",
    room: "Block B, Room 201",
    seat: "B2-Row 5-Seat 03",
    countdownDays: 8,
    syllabus: [
      "Lexical Analysis and Finite Automata",
      "Syntax Analysis: LL(1) and LR(1) Parsers",
      "Syntax Directed Translation Schemes",
      "Intermediate Code Generation"
    ],
    preparationPercentage: 40
  }
];

export const mockNotices: NoticeItem[] = [
  {
    id: "n1",
    title: "Microsoft Campus Recruitment Drive 2027",
    category: "Placement",
    date: "2026-07-07",
    content: "Registration for Microsoft Core Engineering Drive closes on July 10, 2026. Eligible branches: CSE, IT, ECE. Minimum CGPA: 8.5. Coding round on Sunday, July 12.",
    isUrgent: true,
    author: "Prof. R. Harrison, Placement Cell"
  },
  {
    id: "n2",
    title: "Midterm Examination General Advisory",
    category: "Academic",
    date: "2026-07-05",
    content: "All students must carry physical admit cards and College ID badges to the examination blocks. Bags, smartwatches, and cellphones are strictly prohibited inside the exam halls.",
    isUrgent: false,
    author: "Office of the Controller of Exams"
  },
  {
    id: "n3",
    title: "Annual Hackathon 'HACK-STORM 2026' Registrations Open",
    category: "Events",
    date: "2026-07-02",
    content: "Registrations are open for the 36-hour continuous Hack-Storm hackathon. Theme: AI for Sustainability. Win prize pools worth $10,000. Team size: 2-4 members.",
    isUrgent: false,
    author: "CSE Student Society"
  },
  {
    id: "n4",
    title: "Temporary Power Shutdown - Block B",
    category: "Admin",
    date: "2026-07-08",
    content: "Please note that there will be a scheduled power shutdown in Block B tomorrow (July 9) from 06:00 AM to 08:30 AM for main grid maintenance. Elevators will remain non-operational during this window.",
    isUrgent: true,
    author: "Infrastructure Maintenance Dept"
  }
];

export const mockBuses: BusSchedule[] = [
  {
    id: "b1",
    busNumber: "Bus 14",
    route: "Downtown Hub to College Campus (Direct Express)",
    driverName: "Robert Miller",
    phone: "+1-555-0192",
    timing: "07:30 AM (Departure) - 08:30 AM (Arrival)",
    stops: [
      { stop: "Downtown Station", time: "07:30 AM" },
      { stop: "Grand Plaza Mall", time: "07:45 AM" },
      { stop: "North Avenue Circle", time: "08:00 AM" },
      { stop: "Engineering Blocks Gate", time: "08:25 AM" },
      { stop: "Main Admin Dropoff", time: "08:30 AM" }
    ],
    delayMinutes: 0,
    status: "On Time"
  },
  {
    id: "b2",
    busNumber: "Bus 09",
    route: "South Suburbs to College Campus",
    driverName: "Gregory Peck",
    phone: "+1-555-0125",
    timing: "07:15 AM (Departure) - 08:45 AM (Arrival)",
    stops: [
      { stop: "South Terminal", time: "07:15 AM" },
      { stop: "Parkway Crossing", time: "07:35 AM" },
      { stop: "Metro St. Station 4", time: "07:55 AM" },
      { stop: "Main Admin Dropoff", time: "08:45 AM" }
    ],
    delayMinutes: 15,
    status: "Delayed"
  }
];

export const mockLibraryBooks: LibraryBook[] = [
  {
    id: "l1",
    title: "Database System Concepts (7th Edition)",
    author: "Abraham Silberschatz",
    dueDate: "2026-07-18",
    status: "Issued",
    shelf: "Ais-C2-R4"
  },
  {
    id: "l2",
    title: "Introduction to Algorithms (4th Edition)",
    author: "Thomas H. Cormen (CLRS)",
    dueDate: "2026-07-25",
    status: "Issued",
    shelf: "Ais-D1-R2"
  },
  {
    id: "l3",
    title: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell & Peter Norvig",
    dueDate: undefined,
    status: "Available",
    shelf: "Ais-E4-R1"
  },
  {
    id: "l4",
    title: "Compilers: Principles, Techniques, and Tools",
    author: "Alfred Aho & Monica Lam (Dragon Book)",
    dueDate: undefined,
    status: "Available",
    shelf: "Ais-F2-R5"
  }
];

export const mockNavigationPaths: NavigationPath[] = [
  {
    start: "Main Gate",
    destination: "Block C Lab 302",
    estimatedTime: "4 mins",
    distance: "320 meters",
    steps: [
      { text: "Walk straight past the Central Library lawns for 100 meters", distance: "100m", type: "go-straight" },
      { text: "Turn right after the fountain and cross the walkway", distance: "50m", type: "turn-right" },
      { text: "Enter through the glass lobby doors of Block C", distance: "20m", type: "go-straight" },
      { text: "Take the central elevator or staircase to the 3rd Floor", distance: "Elevator", type: "elevator" },
      { text: "Step out of the elevator, take a sharp left, and proceed down the corridor", distance: "150m", type: "turn-left" },
      { text: "Lab 302 is the last room on your left side (opposite Cabin C-308)", distance: "Ready", type: "go-straight" }
    ],
    mapRoutePoints: [
      { x: 50, y: 350 },
      { x: 150, y: 350 },
      { x: 150, y: 220 },
      { x: 280, y: 220 },
      { x: 280, y: 80 },
      { x: 380, y: 80 }
    ]
  },
  {
    start: "Block B Cafeteria",
    destination: "Block C Lab 302",
    estimatedTime: "3 mins",
    distance: "220 meters",
    steps: [
      { text: "Exit the Cafeteria lobby and walk past the Student Center courtyard", distance: "60m", type: "go-straight" },
      { text: "Turn left at the campus radio kiosk, heading towards Block C entrance", distance: "40m", type: "turn-left" },
      { text: "Enter Block C side gate", distance: "20m", type: "go-straight" },
      { text: "Take the stairs near Room 102 up to the 3rd Floor", distance: "Stairs", type: "stairs" },
      { text: "Walk down the main corridor towards the eastern wing", distance: "100m", type: "go-straight" },
      { text: "Lab 302 is on your right side", distance: "Ready", type: "go-straight" }
    ],
    mapRoutePoints: [
      { x: 450, y: 320 },
      { x: 350, y: 320 },
      { x: 350, y: 220 },
      { x: 280, y: 220 },
      { x: 280, y: 80 },
      { x: 380, y: 80 }
    ]
  },
  {
    start: "Block A Lobby",
    destination: "Block C Seminar Hall",
    estimatedTime: "5 mins",
    distance: "400 meters",
    steps: [
      { text: "Exit Block A main entrance", distance: "20m", type: "go-straight" },
      { text: "Turn right onto the shaded pedestrian pathway", distance: "120m", type: "turn-right" },
      { text: "Keep walking past the sports arena towards Block C", distance: "150m", type: "go-straight" },
      { text: "Enter through the primary Block C lobby", distance: "30m", type: "go-straight" },
      { text: "Take the central escalator or elevator to the 2nd Floor", distance: "Elevator", type: "elevator" },
      { text: "The Seminar Hall is directly opposite the elevator exit doors", distance: "Ready", type: "go-straight" }
    ],
    mapRoutePoints: [
      { x: 100, y: 80 },
      { x: 100, y: 150 },
      { x: 240, y: 150 },
      { x: 240, y: 80 },
      { x: 360, y: 80 }
    ]
  }
];
