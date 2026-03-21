import { Progress } from "@/components/ui/progress";
import { motion } from "motion/react";
import { getNextRole, getRoleForPoints, getRoleProgress } from "../utils/roles";

interface RoleBadgeProps {
  points: number;
  compact?: boolean;
}

export function RoleBadge({ points, compact = false }: RoleBadgeProps) {
  const role = getRoleForPoints(points);
  const nextRole = getNextRole(role);
  const progress = getRoleProgress(points, role, nextRole);

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${role.bgClass} ${role.textClass} ${role.borderClass}`}
        data-ocid="role.badge"
      >
        <span>{role.emoji}</span>
        <span>{role.name}</span>
      </span>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-2xl border-2 p-4 ${role.bgClass} ${role.borderClass}`}
      data-ocid="role.card"
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{role.emoji}</span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide opacity-60">
            Current Rank
          </p>
          <p className={`text-xl font-extrabold ${role.textClass}`}>
            {role.name}
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs opacity-60">Multiplier</p>
          <p className={`text-lg font-extrabold ${role.textClass}`}>
            {role.multiplier}×
          </p>
        </div>
      </div>

      <p className="text-sm opacity-70 mb-3">{role.description}</p>

      {nextRole ? (
        <div data-ocid="role.progress_section">
          <div className="flex justify-between text-xs font-semibold mb-1 opacity-70">
            <span>{points.toLocaleString()} pts</span>
            <span>
              Next: {nextRole.name} ({nextRole.minPoints.toLocaleString()} pts)
            </span>
          </div>
          <Progress
            value={progress}
            className="h-2"
            data-ocid="role.loading_state"
          />
          <p className="text-xs mt-1 opacity-60">
            {(nextRole.minPoints - points).toLocaleString()} more points to{" "}
            {nextRole.name} {nextRole.emoji}
          </p>
        </div>
      ) : (
        <div className={`text-center font-bold text-sm ${role.textClass}`}>
          🏆 You have reached the highest rank!
        </div>
      )}
    </motion.div>
  );
}
