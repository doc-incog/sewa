"use client";

const colors = [
  "from-primary-400 to-primary-600",
  "from-secondary-400 to-secondary-600",
  "from-accent-400 to-accent-600",
  "from-warmgray-400 to-warmgray-600",
  "from-primary-500 to-secondary-600",
  "from-secondary-500 to-accent-600",
];

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-lg",
  xl: "w-20 h-20 text-2xl",
};

export default function Avatar({ name, size = "md", className = "" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const colorClass = colors[hashName(name) % colors.length];

  return (
    <div
      className={`${sizeMap[size]} bg-gradient-to-br ${colorClass} rounded-full flex items-center justify-center text-white font-semibold shrink-0 shadow-warm ${className}`}
    >
      {initials}
    </div>
  );
}
