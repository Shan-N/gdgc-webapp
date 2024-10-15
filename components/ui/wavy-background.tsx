"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  waveWidth,
  blur = 10,
  speed = "fast", // Default speed is now "slow"
  waveOpacity = 0.5,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  waveWidth?: number;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: unknown;
}) => {
  const noise = createNoise3D();
  let w: number,
    h: number,
    nt: number,
    i: number,
    x: number,
    ctx: CanvasRenderingContext2D | null;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);

  // Speed control: adjust the value to change the animation speed
  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 0.0001; // Very slow speed
      case "fast":
        return 0.0003;
      default:
        return 0.0001; // Default to slow speed
    }
  };

  // Initialize the canvas and context
  const init = () => {
    canvas.current = canvasRef.current;
    if (!canvas.current) return;
    ctx = canvas.current.getContext("2d");
    if (!ctx) return;
    w = ctx.canvas.width = window.innerWidth;
    h = ctx.canvas.height = window.innerHeight;
    ctx.filter = `blur(${blur}px)`;
    nt = 0;

    // Handle window resize
    window.onresize = function () {
      if (!ctx) return;
      w = ctx.canvas.width = window.innerWidth;
      h = ctx.canvas.height = window.innerHeight;
      ctx.filter = `blur(${blur}px)`;
    };

    // Start the animation
    render();
  };

  // GDSC color theme
  const waveColors = [
    "#4285F4", // Google Blue
    "#DB4437", // Google Red
    "#F4B400", // Google Yellow
    "#0F9D58", // Google Green
  ];

  // Draw a wave on the canvas
// Draw a wave on the canvas
const drawWave = (n: number) => {
  if (!ctx) return;
  nt += getSpeed();
  const smoothFactor = 0.05; // Adjust this value for smoother waves
  let lastY: number | null = null;
  for (i = 0; i < n; i++) {
    ctx.beginPath();
    ctx.lineWidth = waveWidth || 50;
    ctx.strokeStyle = waveColors[i % waveColors.length];
    
    for (x = 0; x < w; x += 2) {
      const noiseValue = noise(x / 800, 0.3 * i, nt) * 100;
      const y: number = (1 - smoothFactor) * (lastY || 0) + smoothFactor * noiseValue;
      ctx.lineTo(x, y + h * 0.5);
      lastY = y; // Store the last Y for smoothing
    }
    
    ctx.stroke();
    ctx.closePath();
  }
};

  // Main animation loop
  const render = () => {
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h); // Clear the entire canvas
    ctx.globalAlpha = waveOpacity;
    drawWave(4);
    requestAnimationFrame(render);
  };

  // Toggle the animation on/off
  const [isAnimating] = useState(true);
  useEffect(() => {
    if (isAnimating) {
      init();
    } else {
      if (canvas.current) {
        canvas.current.width = 0;
        canvas.current.height = 0;
      }
    }
  }, [init, isAnimating]);

  // Safari-specific fix
  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        containerClassName
      )}
    >
      <canvas
        className="absolute inset-0 z-0 w-full"
        ref={canvasRef}
        id="canvas"
        style={isSafari ? { filter: `blur(${blur}px)` } : {}}
      ></canvas>
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};