"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export function CyberBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 性能检测 - 低性能设备禁用粒子
    const isLowPerformance = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;

    // 设置画布尺寸
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    if (isLowPerformance) {
      return () => window.removeEventListener("resize", resize);
    }

    // 创建粒子 - 减少密度
    const particles: Particle[] = [];
    const particleCount = Math.min(30, Math.floor((canvas.width * canvas.height) / 30000));

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
      });
    }

    // 动画循环
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制和更新粒子
      particles.forEach((particle) => {
        ctx.fillStyle = "rgba(99, 102, 241, 0.4)";
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // 更新位置
        particle.x += particle.vx;
        particle.y += particle.vy;

        // 边界检测
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Layer 1: Base - Deep abyss black */}
      <div className="absolute inset-0 bg-[#030308]" />

      {/* Layer 2: Aurora Gradient Mesh - Subtle flowing colors */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-500/8 rounded-full blur-[180px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-500/6 rounded-full blur-[180px] animate-pulse" style={{ animationDelay: "2s" }} />
      <div className="absolute top-[30%] left-[30%] w-[50%] h-[50%] bg-cyan-500/5 rounded-full blur-[160px] animate-pulse" style={{ animationDelay: "4s" }} />
      <div className="absolute top-[60%] left-[60%] w-[40%] h-[40%] bg-pink-500/4 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: "1s" }} />

      {/* Layer 3: Subtle radial glow from center */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(ellipse at center, rgba(79, 70, 229, 0.08) 0%, transparent 70%)",
        }}
      />

      {/* Layer 4: Particles (Canvas) - Reduced density */}
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
