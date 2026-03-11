"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
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

    // 彩色粒子配置
    const colors = [
      "rgba(0, 242, 255, 0.6)",   // cyan neon
      "rgba(188, 19, 254, 0.6)",  // purple neon
      "rgba(255, 230, 0, 0.6)",   // yellow neon
      "rgba(99, 102, 241, 0.6)",  // indigo
      "rgba(236, 72, 153, 0.6)",  // pink
    ];

    // 创建粒子
    const particles: Particle[] = [];
    const particleCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 20000));

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // 动画循环
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 更新粒子位置
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // 边界检测
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
      });

      // 绘制粒子连线（当粒子距离较近时）
      const connectionDistance = 150;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = 1 - distance / connectionDistance;
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacity * 0.3})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // 绘制粒子
      particles.forEach((particle) => {
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
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
      <div className="absolute inset-0 bg-[#05050a]" />

      {/* Layer 2: Neon Glows (original cyan/purple/yellow) */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-cyan-400/10 rounded-full blur-[140px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[140px]" />
      <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-yellow-400/5 rounded-full blur-[120px]" />

      {/* Layer 3: Particles with connections (Canvas) */}
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
