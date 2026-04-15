import React, { memo, useMemo } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  AbsoluteFill,
} from "remotion";

// 粒子组件
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
}

const ParticlesBackground: React.FC = memo(() => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // 生成固定数量的粒子，使用伪随机但确定的位置
  const particles = useMemo(() => {
    const particleList: Particle[] = [];
    const seed = 12345; // 固定种子确保每帧一致
    for (let i = 0; i < 50; i++) {
      const random = () => {
        const x = Math.sin(seed + i) * 10000;
        return x - Math.floor(x);
      };
      particleList.push({
        id: i,
        x: random() * width,
        y: random() * height,
        size: random() * 3 + 1,
        opacity: random() * 0.5 + 0.1,
        speedX: (random() - 0.5) * 0.5,
        speedY: (random() - 0.5) * 0.5,
      });
    }
    return particleList;
  }, [width, height]);

  return (
    <AbsoluteFill>
      {particles.map((particle) => {
        const newX = particle.x + frame * particle.speedX;
        const newY = particle.y + frame * particle.speedY;
        const opacity = interpolate(
          Math.sin(frame * 0.05 + particle.id),
          [-1, 1],
          [0.1, particle.opacity]
        );

        return (
          <div
            key={particle.id}
            style={{
              position: "absolute",
              left: newX,
              top: newY,
              width: particle.size,
              height: particle.size,
              backgroundColor: "rgba(0, 255, 255, 0.3)",
              borderRadius: "50%",
              opacity,
              filter: "blur(1px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
});

ParticlesBackground.displayName = "ParticlesBackground";

// 主标题组件
interface TitleProps {
  title: string;
}

export const CodeFlowIntro: React.FC<TitleProps> = ({ title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 使用 spring 实现带弹跳的放大效果
  const springConfig = { damping: 12, stiffness: 80 };

  const scaleProgress = spring({
    frame,
    fps,
    config: springConfig,
    durationInFrames: 60, // 2 秒完成动画
  });

  // 透明度淡入
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // 计算缩放值：从 0.5 到 1.0
  const scale = interpolate(scaleProgress, [0, 1], [0.5, 1.1]);

  // 最终稳定在 1.0
  const finalScale = frame > 90 ? 1 : scale;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* 粒子背景 */}
      <ParticlesBackground />

      {/* 主标题 */}
      <div
        style={{
          transform: `scale(${finalScale})`,
          opacity,
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontSize: "120px",
            fontWeight: "900",
            margin: 0,
            background: "linear-gradient(135deg, #00d9ff 0%, #a855f7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-2px",
            textShadow: "0 0 80px rgba(0, 217, 255, 0.5)",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          }}
        >
          {title}
        </h1>

        {/* 副标题 */}
        <p
          style={{
            fontSize: "24px",
            color: "rgba(255, 255, 255, 0.7)",
            margin: "20px 0 0 0",
            letterSpacing: "4px",
            textTransform: "uppercase",
            fontWeight: "300",
          }}
        >
          TECH CHANNEL
        </p>
      </div>
    </AbsoluteFill>
  );
};
