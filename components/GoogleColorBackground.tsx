"use client";
import React, { useEffect, useRef } from 'react';

interface Cube {
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  growing: boolean;
}

const GoogleColorBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    const googleColors: string[] = [
      'rgb(66, 133, 244)',  // Blue
      'rgb(219, 68, 55)',   // Red
      'rgb(244, 180, 0)',   // Yellow
      'rgb(15, 157, 88)'    // Green
    ];

    let cubes: Cube[] = [];

    const initCubes = () => {
      cubes = [];
      const numCubes = 20;
      for (let i = 0; i < numCubes; i++) {
        cubes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 100 + 50,
          color: googleColors[Math.floor(Math.random() * googleColors.length)],
          opacity: Math.random() * 0.5,
          growing: Math.random() > 0.5
        });
      }
    };

    const drawCube = (cube: Cube) => {
      if (!ctx) return;
      ctx.globalAlpha = cube.opacity;
      ctx.fillStyle = cube.color;
      ctx.fillRect(cube.x - cube.size / 2, cube.y - cube.size / 2, cube.size, cube.size);
    };

    const updateCube = (cube: Cube) => {
      const opacitySpeed = 0.0025;
      const sizeSpeed = 0.005;

      if (cube.growing) {
        cube.opacity += opacitySpeed;
        cube.size += sizeSpeed;
        if (cube.opacity >= 0.5 || cube.size >= 150) cube.growing = false;
      } else {
        cube.opacity -= opacitySpeed;
        cube.size -= sizeSpeed;
        if (cube.opacity <= 0.1 || cube.size <= 50) cube.growing = true;
      }

      cube.opacity = Math.max(0.1, Math.min(0.5, cube.opacity));
      cube.size = Math.max(50, Math.min(150, cube.size));
    };

    const animate = () => {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      cubes.forEach(cube => {
        updateCube(cube);
        drawCube(cube);
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    initCubes();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        backdropFilter : 'blur(50%)'
      }}
    />
  );
};

export default GoogleColorBackground;
