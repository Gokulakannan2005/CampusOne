/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { NavigationPath } from "../types";
import { Compass, Clock, MapPin, Milestone } from "lucide-react";

interface NavigationMapProps {
  activePath: NavigationPath;
  darkTheme?: boolean;
  onSelectPath?: (key: string) => void;
}

export default function NavigationMap({ activePath, darkTheme = false, onSelectPath }: NavigationMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [resetCount, setResetCount] = useState(0);
  const [hoveredBuildingIndex, setHoveredBuildingIndex] = useState<number | null>(null);

  const buildings = [
    { 
      name: "Main Gate & Entry", 
      x: 30, 
      y: 310, 
      w: 100, 
      h: 60, 
      color: darkTheme ? "#1E293B" : "#F8FAFC", 
      textColor: darkTheme ? "#94A3B8" : "#64748B", 
      key: "Main Gate" 
    },
    { 
      name: "Block A (Admin & Audi)", 
      x: 40, 
      y: 40, 
      w: 140, 
      h: 90, 
      color: darkTheme ? "#1E293B" : "#FFFFFF", 
      textColor: darkTheme ? "#CBD5E1" : "#334155", 
      key: "Block A Lobby" 
    },
    { 
      name: "Central Library Lawns", 
      x: 190, 
      y: 150, 
      w: 120, 
      h: 100, 
      isGarden: true, 
      color: darkTheme ? "#064E3B" : "#F0FDF4", 
      textColor: darkTheme ? "#86EFAC" : "#166534", 
      key: "Library" 
    },
    { 
      name: "Block C (CSE Labs)", 
      x: 330, 
      y: 40, 
      w: 140, 
      h: 90, 
      color: darkTheme ? "#1E293B" : "#FFFFFF", 
      textColor: darkTheme ? "#CBD5E1" : "#334155", 
      key: "Block C Lab 302" 
    },
    { 
      name: "Block B (Cafeteria)", 
      x: 340, 
      y: 260, 
      w: 130, 
      h: 80, 
      color: darkTheme ? "#1E293B" : "#FFFFFF", 
      textColor: darkTheme ? "#CBD5E1" : "#334155", 
      key: "Block B Cafeteria" 
    },
  ];

  // Redraw path when activePath or resetCount changes
  useEffect(() => {
    setAnimationProgress(0);
    const interval = setInterval(() => {
      setAnimationProgress((prev) => {
        if (prev >= 1) {
          clearInterval(interval);
          return 1;
        }
        return prev + 0.05;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [activePath, resetCount]);

  // Canvas drawing logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas and draw theme background
    ctx.fillStyle = darkTheme ? "#0F172A" : "#F8FAFC";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid background (subtle dots)
    const dotColor = darkTheme ? "#334155" : "#E2E8F0";
    for (let x = 20; x < canvas.width; x += 40) {
      for (let y = 20; y < canvas.height; y += 40) {
        ctx.fillStyle = dotColor;
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw Gardens & Lawns first
    buildings.forEach((b, idx) => {
      const isHovered = hoveredBuildingIndex === idx;
      if (b.isGarden) {
        ctx.fillStyle = isHovered ? (darkTheme ? "#022C22" : "#DCFCE7") : b.color;
        ctx.strokeStyle = isHovered ? (darkTheme ? "#4ADE80" : "#22C55E") : (darkTheme ? "#0F5132" : "#BBF7D0");
        ctx.lineWidth = isHovered ? 2.5 : 2;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(b.x, b.y, b.w, b.h, 12);
        } else {
          ctx.rect(b.x, b.y, b.w, b.h);
        }
        ctx.fill();
        ctx.stroke();

        // Draw lawn details (some green lines)
        ctx.strokeStyle = isHovered ? (darkTheme ? "#22C55E" : "#86EFAC") : (darkTheme ? "#0F5132" : "#BBF7D0");
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(b.x + 20, b.y + b.h / 2);
        ctx.lineTo(b.x + b.w - 20, b.y + b.h / 2);
        ctx.stroke();
      }
    });

    // Draw Walkways (Background road paths)
    const walkwayOuter = darkTheme ? "#1E293B" : "#E2E8F0";
    const walkwayInner = darkTheme ? "#0F172A" : "#F1F5F9";

    ctx.strokeStyle = walkwayOuter;
    ctx.lineWidth = 24;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(80, 310);
    ctx.lineTo(150, 310);
    ctx.lineTo(150, 200);
    ctx.lineTo(280, 200);
    ctx.lineTo(280, 85);
    ctx.lineTo(400, 85);
    ctx.stroke();

    ctx.strokeStyle = walkwayInner;
    ctx.lineWidth = 20;
    ctx.stroke();

    // Draw Buildings
    buildings.forEach((b, idx) => {
      const isHovered = hoveredBuildingIndex === idx;
      if (!b.isGarden) {
        ctx.shadowColor = isHovered ? (darkTheme ? "rgba(96, 165, 250, 0.3)" : "rgba(37, 99, 235, 0.2)") : "rgba(148, 163, 184, 0.05)";
        ctx.shadowBlur = isHovered ? 12 : 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = isHovered ? 6 : 4;

        ctx.fillStyle = isHovered ? (darkTheme ? "#1E293B" : "#EFF6FF") : b.color;
        ctx.strokeStyle = isHovered ? (darkTheme ? "#60A5FA" : "#3B82F6") : (darkTheme ? "#334155" : "#E2E8F0");
        ctx.lineWidth = isHovered ? 2.5 : 1.5;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(b.x, b.y, b.w, b.h, 8);
        } else {
          ctx.rect(b.x, b.y, b.w, b.h);
        }
        ctx.fill();
        ctx.stroke();

        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
      }

      // Labels
      ctx.fillStyle = isHovered 
        ? (b.isGarden ? (darkTheme ? "#4ADE80" : "#15803D") : (darkTheme ? "#60A5FA" : "#1D4ED8")) 
        : b.textColor;
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(b.name, b.x + b.w / 2, b.y + b.h / 2 + 3);
    });

    // Draw active animated route path
    const points = activePath.mapRoutePoints;
    if (points && points.length > 0) {
      ctx.strokeStyle = darkTheme ? "#60A5FA" : "#2563EB"; // Bright accent for high contrast
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      
      // Shadow for active path
      ctx.shadowColor = darkTheme ? "rgba(96, 165, 250, 0.5)" : "rgba(37, 99, 235, 0.4)";
      ctx.shadowBlur = 6;

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      // Interpolate points based on progress
      const totalSegments = points.length - 1;
      const progressSegment = animationProgress * totalSegments;
      const activeSegmentIndex = Math.floor(progressSegment);
      const segmentPercent = progressSegment - activeSegmentIndex;

      for (let i = 1; i <= activeSegmentIndex; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }

      if (activeSegmentIndex < totalSegments) {
        const startPt = points[activeSegmentIndex];
        const endPt = points[activeSegmentIndex + 1];
        const currentX = startPt.x + (endPt.x - startPt.x) * segmentPercent;
        const currentY = startPt.y + (endPt.y - startPt.y) * segmentPercent;
        ctx.lineTo(currentX, currentY);
      }

      ctx.stroke();
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      // Draw Animated Pulse at leading tip
      const leadingIndex = Math.min(activeSegmentIndex + 1, totalSegments);
      const startPt = points[Math.min(activeSegmentIndex, totalSegments)];
      const endPt = points[leadingIndex];
      const tipX = startPt.x + (endPt.x - startPt.x) * segmentPercent;
      const tipY = startPt.y + (endPt.y - startPt.y) * segmentPercent;

      ctx.fillStyle = darkTheme ? "#60A5FA" : "#2563EB";
      ctx.beginPath();
      ctx.arc(tipX, tipY, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = darkTheme ? "rgba(96, 165, 250, 0.5)" : "rgba(37, 99, 235, 0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(tipX, tipY, 10 + Math.sin(Date.now() / 150) * 3, 0, Math.PI * 2);
      ctx.stroke();

      // Draw Pin at Start
      ctx.fillStyle = darkTheme ? "#94A3B8" : "#334155";
      ctx.beginPath();
      ctx.arc(points[0].x, points[0].y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Draw Map Pin at Destination
      const destPt = points[points.length - 1];
      ctx.fillStyle = "#EF4444"; // Destination Error/Red
      ctx.beginPath();
      ctx.arc(destPt.x, destPt.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [activePath, animationProgress, hoveredBuildingIndex, darkTheme]);

  // Mouse moves over canvas
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    let foundIdx = null;
    for (let i = 0; i < buildings.length; i++) {
      const b = buildings[i];
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
        foundIdx = i;
        break;
      }
    }
    setHoveredBuildingIndex(foundIdx);
  };

  const handleMouseLeave = () => {
    setHoveredBuildingIndex(null);
  };

  const handleCanvasClick = () => {
    if (hoveredBuildingIndex !== null && onSelectPath) {
      const b = buildings[hoveredBuildingIndex];
      onSelectPath(b.key);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* Visual Canvas Container */}
      <div className={`lg:col-span-2 border rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden h-[400px] ${darkTheme ? "bg-slate-900 border-slate-800" : "bg-[#F1F5F9] border-slate-200"}`}>
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 items-center z-10">
          <div className={`flex items-center gap-2 backdrop-blur-sm px-3 py-1.5 rounded-full border shadow-sm ${darkTheme ? "bg-slate-900/95 border-slate-800 text-slate-200" : "bg-white/95 border-slate-200/50 text-slate-700"}`}>
            <Compass className="w-4 h-4 text-blue-500 animate-spin-slow" />
            <span className="text-xs font-bold font-sans">Interactive Campus Map</span>
          </div>
          <span className="text-[10px] bg-blue-600 text-white font-bold px-2.5 py-1 rounded-full shadow-xs animate-pulse">
            Tip: Click on buildings to switch paths!
          </span>
        </div>

        <canvas
          id="navigation-vector-canvas"
          ref={canvasRef}
          width={500}
          height={380}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleCanvasClick}
          style={{ cursor: hoveredBuildingIndex !== null ? "pointer" : "default" }}
          className={`max-w-full max-h-full rounded-xl transition-all shadow-xs ${darkTheme ? "bg-slate-950" : "bg-slate-50"}`}
        />

        <div className={`absolute bottom-4 right-4 px-3 py-1.5 rounded-lg text-xs font-mono ${darkTheme ? "bg-slate-800/90 text-slate-300" : "bg-slate-800/90 text-white"}`}>
          Route Scale: 1:1000
        </div>
      </div>

      {/* Step-by-Step Instructions Panel */}
      <div className={`border rounded-2xl p-6 flex flex-col justify-between h-[400px] shadow-sm ${darkTheme ? "bg-[#0F172A] border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800"}`}>
        <div>
          <div className={`flex items-center justify-between mb-4 pb-4 border-b ${darkTheme ? "border-slate-800" : "border-slate-100"}`}>
            <div>
              <span className={`text-xs font-medium uppercase tracking-wider block ${darkTheme ? "text-slate-500" : "text-slate-400"}`}>Walking Route</span>
              <h4 className="text-base font-bold font-sans leading-tight">
                {activePath.start} → {activePath.destination}
              </h4>
            </div>
            <div className="text-right">
              <span className={`text-xs font-mono font-bold px-2 py-1 rounded-md flex items-center gap-1 ${darkTheme ? "text-blue-400 bg-blue-950/40" : "text-blue-600 bg-blue-50"}`}>
                <Clock className="w-3.5 h-3.5" />
                {activePath.estimatedTime}
              </span>
            </div>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[220px] pr-2 custom-scrollbar">
            {activePath.steps.map((step, index) => (
              <div key={index} className="flex gap-3 text-sm">
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${index === 0 ? (darkTheme ? "bg-blue-600 text-white" : "bg-slate-800 text-white") : (darkTheme ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500")}`}>
                    {index + 1}
                  </div>
                  {index < activePath.steps.length - 1 && (
                    <div className={`w-0.5 h-full my-1 min-h-[16px] ${darkTheme ? "bg-slate-800" : "bg-slate-100"}`} />
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <p className={`font-sans leading-relaxed ${darkTheme ? "text-slate-300" : "text-slate-600"}`}>{step.text}</p>
                  <span className={`text-xs font-semibold font-mono ${darkTheme ? "text-slate-500" : "text-slate-400"}`}>{step.distance}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`pt-4 border-t flex items-center justify-between ${darkTheme ? "border-slate-800" : "border-slate-100"}`}>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-sans">
            <Milestone className="w-4 h-4 text-slate-400" />
            <span>Total Distance: <b className={darkTheme ? "text-slate-200" : "text-slate-700"}>{activePath.distance}</b></span>
          </div>
          <button
            id={`btn-route-gps-sync-${activePath.destination.replace(/\s+/g, '-').toLowerCase()}`}
            onClick={() => setResetCount(prev => prev + 1)}
            className={`text-xs font-medium flex items-center gap-1 px-3 py-1.5 rounded-lg transition cursor-pointer ${darkTheme ? "bg-blue-950/40 hover:bg-blue-950/80 text-blue-400" : "bg-blue-50 hover:bg-blue-100 text-blue-600"}`}
          >
            <MapPin className="w-3.5 h-3.5" />
            Restart Animation
          </button>
        </div>
      </div>
    </div>
  );
}
