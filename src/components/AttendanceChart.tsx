/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AttendanceRecord } from "../types";
import { AlertCircle, CheckCircle2, Info, ArrowUpRight } from "lucide-react";

interface SubjectAttendanceCardProps {
  record: AttendanceRecord;
  darkTheme?: boolean;
  key?: any;
}

export function SubjectAttendanceCard({ record, darkTheme = false }: SubjectAttendanceCardProps) {
  const isUrgent = record.percentage < record.targetPercentage;
  
  // Calculate Bunk status or Attendance required status
  const target = record.targetPercentage / 100; // 0.75
  const potentialBunks = Math.floor((record.attended - target * record.total) / target);
  
  const requiredClasses = Math.ceil((target * record.total - record.attended) / (1 - target));

  // Circular gauge config
  const radius = 32;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (record.percentage / 100) * circumference;

  return (
    <div className={`p-5 rounded-[20px] border transition shadow-sm ${
      darkTheme 
        ? (isUrgent ? "bg-rose-950/20 border-rose-900/50" : "bg-slate-900 border-slate-800") 
        : (isUrgent ? "bg-white border-rose-100" : "bg-white border-slate-200")
    } hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div>
          <span className={`text-xs font-mono block mb-1 ${darkTheme ? "text-slate-500" : "text-slate-400"}`}>{record.code}</span>
          <h4 className={`text-sm font-bold leading-tight font-sans mb-1 ${darkTheme ? "text-slate-200" : "text-slate-800"}`}>{record.subject}</h4>
          <span className={`text-xs font-sans ${darkTheme ? "text-slate-400" : "text-slate-500"}`}>
            Attended: <b className={darkTheme ? "text-slate-200" : "text-slate-800"}>{record.attended}</b> of <b className={darkTheme ? "text-slate-200" : "text-slate-800"}>{record.total}</b> lectures
          </span>
        </div>

        {/* Custom SVG Circular Progress Ring */}
        <div className="relative flex items-center justify-center">
          <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
            {/* Background Track */}
            <circle
              stroke={isUrgent ? (darkTheme ? "#4C0519" : "#FFE4E6") : (darkTheme ? "#1E293B" : "#F1F5F9")}
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Active Progress */}
            <circle
              stroke={isUrgent ? "#EF4444" : (darkTheme ? "#60A5FA" : "#2563EB")}
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + " " + circumference}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>
          <div className={`absolute text-xs font-mono font-bold ${darkTheme ? "text-slate-200" : "text-slate-800"}`}>
            {Math.round(record.percentage)}%
          </div>
        </div>
      </div>

      {/* Advisory Alert Banner */}
      <div className={`mt-4 p-3 rounded-xl flex items-start gap-2 text-xs font-sans ${
        isUrgent 
          ? (darkTheme ? "bg-rose-950/40 text-rose-300" : "bg-rose-50 text-rose-700") 
          : (darkTheme ? "bg-blue-950/40 text-blue-300" : "bg-blue-50/50 text-blue-700")
      }`}>
        {isUrgent ? (
          <>
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">Below Safe Threshold (75%)</span>
              <span>You must attend the next <b>{requiredClasses}</b> classes consecutively to restore safe attendance level.</span>
            </div>
          </>
        ) : (
          <>
            <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${darkTheme ? "text-emerald-400" : "text-emerald-500"}`} />
            <div>
              <span className="font-semibold block mb-0.5">Attendance Safe</span>
              <span>
                {potentialBunks > 0 ? (
                  <>You can safely bunk the next <b>{potentialBunks}</b> classes without falling below 75%.</>
                ) : (
                  <>Attendance is stable. Bunking the next class will put you at risk.</>
                )}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface CgpaChartProps {
  history: { semester: string; gpa: number }[];
  currentCgpa: number;
}

export function CgpaChart({ history, currentCgpa }: CgpaChartProps) {
  // Simple sparkline path building
  // Assume width = 400, height = 120
  const width = 400;
  const height = 120;
  const padding = 20;

  const pointsCount = history.length;
  const xStep = (width - padding * 2) / (pointsCount - 1);
  const minVal = 3.5; // Custom scaling for CGPA
  const maxVal = 4.0;
  const valRange = maxVal - minVal;

  const getCoordinates = (index: number, gpa: number) => {
    const x = padding + index * xStep;
    // inverse height scaling
    const y = height - padding - ((gpa - minVal) / valRange) * (height - padding * 2);
    return { x, y };
  };

  // Build SVG path
  let pathString = "";
  let areaString = "";
  
  if (pointsCount > 0) {
    const firstCoord = getCoordinates(0, history[0].gpa);
    pathString = `M ${firstCoord.x} ${firstCoord.y}`;
    areaString = `M ${firstCoord.x} ${height - padding} L ${firstCoord.x} ${firstCoord.y}`;

    for (let i = 1; i < pointsCount; i++) {
      const coord = getCoordinates(i, history[i].gpa);
      pathString += ` L ${coord.x} ${coord.y}`;
      areaString += ` L ${coord.x} ${coord.y}`;
    }

    const lastCoord = getCoordinates(pointsCount - 1, history[pointsCount - 1].gpa);
    areaString += ` L ${lastCoord.x} ${height - padding} Z`;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Academic Standings</span>
          <h4 className="text-2xl font-black text-slate-800 font-sans tracking-tight">
            {currentCgpa.toFixed(2)} <span className="text-xs text-slate-400 font-normal">/ 4.00 Cumulative GPA</span>
          </h4>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            Top 5% of Batch
          </span>
        </div>
      </div>

      {/* SVG Progression Chart */}
      <div className="relative w-full overflow-hidden mt-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#F1F5F9" strokeDasharray="4 4" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#F1F5F9" strokeDasharray="4 4" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#F1F5F9" strokeDasharray="4 4" />

          {/* Area Fill */}
          {areaString && (
            <path
              d={areaString}
              fill="url(#gpaAreaGradient)"
              opacity="0.3"
            />
          )}

          {/* Sparkline Path */}
          {pathString && (
            <path
              d={pathString}
              fill="transparent"
              stroke="#2563EB"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data Points */}
          {history.map((pt, index) => {
            const { x, y } = getCoordinates(index, pt.gpa);
            return (
              <g key={index} className="group cursor-pointer">
                <circle
                  cx={x}
                  cy={y}
                  r="4.5"
                  fill="#FFFFFF"
                  stroke="#2563EB"
                  strokeWidth="2"
                />
                <text
                  x={x}
                  y={y - 10}
                  textAnchor="middle"
                  className="text-[9px] font-mono font-bold fill-slate-700 opacity-80"
                >
                  {pt.gpa.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="gpaAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
          </defs>
        </svg>

        {/* Labels bar */}
        <div className="flex justify-between px-5 pt-1 text-[10px] font-mono text-slate-400 uppercase">
          {history.map((pt, index) => (
            <span key={index}>{pt.semester}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
