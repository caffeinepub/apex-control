export interface RoleDefinition {
  name: string;
  minPoints: number;
  maxPoints: number | null;
  multiplier: number;
  color: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  emoji: string;
  description: string;
}

export const ROLES: RoleDefinition[] = [
  {
    name: "Worker",
    minPoints: 0,
    maxPoints: 499,
    multiplier: 1.0,
    color: "gray",
    bgClass: "bg-gray-100",
    textClass: "text-gray-700",
    borderClass: "border-gray-300",
    emoji: "🔨",
    description: "Just getting started! Complete your first tasks to level up.",
  },
  {
    name: "Employee",
    minPoints: 500,
    maxPoints: 999,
    multiplier: 1.2,
    color: "blue",
    bgClass: "bg-blue-100",
    textClass: "text-blue-700",
    borderClass: "border-blue-300",
    emoji: "💼",
    description: "You're now an official employee! Earn 1.2× points per task.",
  },
  {
    name: "Team Leader",
    minPoints: 1000,
    maxPoints: 1999,
    multiplier: 1.5,
    color: "green",
    bgClass: "bg-green-100",
    textClass: "text-green-700",
    borderClass: "border-green-300",
    emoji: "🌟",
    description: "Leading the way! Earn 1.5× points and inspire others.",
  },
  {
    name: "Manager",
    minPoints: 2000,
    maxPoints: 3999,
    multiplier: 1.8,
    color: "teal",
    bgClass: "bg-teal-100",
    textClass: "text-teal-700",
    borderClass: "border-teal-300",
    emoji: "📊",
    description: "Managing projects and earning 1.8× points like a pro!",
  },
  {
    name: "Senior Manager",
    minPoints: 4000,
    maxPoints: 6999,
    multiplier: 2.0,
    color: "purple",
    bgClass: "bg-purple-100",
    textClass: "text-purple-700",
    borderClass: "border-purple-300",
    emoji: "🎯",
    description: "Senior expertise! Double your points with 2× multiplier.",
  },
  {
    name: "Director",
    minPoints: 7000,
    maxPoints: 9999,
    multiplier: 2.5,
    color: "orange",
    bgClass: "bg-orange-100",
    textClass: "text-orange-700",
    borderClass: "border-orange-300",
    emoji: "🏅",
    description: "Directing the strategy and earning 2.5× points!",
  },
  {
    name: "Vice CEO",
    minPoints: 10000,
    maxPoints: 14999,
    multiplier: 3.0,
    color: "gold",
    bgClass: "bg-yellow-100",
    textClass: "text-yellow-700",
    borderClass: "border-yellow-400",
    emoji: "👑",
    description: "Right at the top! Earn an incredible 3× points per task.",
  },
  {
    name: "CEO",
    minPoints: 15000,
    maxPoints: null,
    multiplier: 4.0,
    color: "red",
    bgClass: "bg-red-100",
    textClass: "text-red-700",
    borderClass: "border-red-400",
    emoji: "🚀",
    description: "The ultimate rank! 4× points and the ultimate respect!",
  },
];

export function getRoleForPoints(points: number): RoleDefinition {
  for (let i = ROLES.length - 1; i >= 0; i--) {
    if (points >= ROLES[i].minPoints) return ROLES[i];
  }
  return ROLES[0];
}

export function getNextRole(
  currentRole: RoleDefinition,
): RoleDefinition | null {
  const idx = ROLES.findIndex((r) => r.name === currentRole.name);
  return idx < ROLES.length - 1 ? ROLES[idx + 1] : null;
}

export function getRoleProgress(
  points: number,
  role: RoleDefinition,
  nextRole: RoleDefinition | null,
): number {
  if (!nextRole) return 100;
  const range = nextRole.minPoints - role.minPoints;
  const earned = points - role.minPoints;
  return Math.min(100, Math.round((earned / range) * 100));
}
