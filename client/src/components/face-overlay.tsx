import { useEffect, useState } from "react";

interface LandmarkPoint {
  x: number;
  y: number;
}

interface FaceOverlayProps {
  landmarks?: LandmarkPoint[];
}

export function FaceOverlay({ landmarks }: FaceOverlayProps) {
  const [animatedLandmarks, setAnimatedLandmarks] = useState<LandmarkPoint[]>([]);

  // Default landmark positions for demonstration
  const defaultLandmarks: LandmarkPoint[] = [
    { x: 20, y: 16 }, // forehead left
    { x: 80, y: 20 }, // forehead right
    { x: 50, y: 32 }, // nose bridge
    { x: 50, y: 60 }, // nose tip
    { x: 30, y: 45 }, // left cheek
    { x: 70, y: 45 }, // right cheek
    { x: 50, y: 75 }, // mouth center
    { x: 50, y: 90 }, // chin
  ];

  useEffect(() => {
    const points = landmarks || defaultLandmarks;
    setAnimatedLandmarks(points);
  }, [landmarks]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {animatedLandmarks.map((point, index) => (
        <div
          key={index}
          className="absolute w-2 h-2 bg-korean-bronze rounded-full animate-pulse"
          style={{
            left: `${point.x}%`,
            top: `${point.y}%`,
            transform: 'translate(-50%, -50%)',
            animationDelay: `${index * 0.1}s`,
          }}
        />
      ))}
      
      {/* Connecting lines for facial structure */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        {/* Face outline */}
        <path
          d="M30 20 Q50 15 70 20 Q75 30 75 45 Q75 60 70 75 Q50 85 30 75 Q25 60 25 45 Q25 30 30 20 Z"
          fill="none"
          stroke="rgba(139, 90, 60, 0.3)"
          strokeWidth="0.5"
          className="animate-pulse"
        />
      </svg>
    </div>
  );
}
