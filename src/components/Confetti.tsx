import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
}

export const Confetti = () => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const colors = [
      "hsl(180 100% 42%)", // cyan
      "hsl(335 100% 50%)", // pink
      "hsl(280 60% 50%)", // purple
      "hsl(45 100% 50%)", // gold
      "hsl(120 60% 50%)", // green
    ];

    const pieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    setConfetti(pieces);

    // Remove confetti after animation
    const timer = setTimeout(() => {
      setConfetti([]);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute top-0 w-2 h-2 opacity-0"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            animation: `fall ${piece.duration}s linear ${piece.delay}s forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
