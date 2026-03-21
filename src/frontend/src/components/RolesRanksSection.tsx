import { motion } from "motion/react";
import { ROLES, getRoleForPoints } from "../utils/roles";

interface RolesRanksSectionProps {
  currentPoints: number;
}

export function RolesRanksSection({ currentPoints }: RolesRanksSectionProps) {
  const currentRole = getRoleForPoints(currentPoints);

  return (
    <section className="py-10 px-4" data-ocid="roles.section">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-extrabold text-foreground">
            🏆 Roles &amp; Ranks
          </h2>
          <p className="text-muted-foreground mt-1">
            Climb the ranks, unlock better rewards and higher point multipliers!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ROLES.map((role, idx) => {
            const isCurrentRole = role.name === currentRole.name;
            const isUnlocked = currentPoints >= role.minPoints;

            return (
              <motion.div
                key={role.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                data-ocid={`roles.item.${idx + 1}`}
                className={`relative rounded-2xl border-2 p-4 transition-all ${
                  isCurrentRole
                    ? `${role.bgClass} ${role.borderClass} shadow-lg scale-[1.02]`
                    : isUnlocked
                      ? `${role.bgClass} ${role.borderClass} opacity-90`
                      : "bg-gray-50 border-gray-200 opacity-50"
                }`}
              >
                {isCurrentRole && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-white border-2 border-current text-xs font-bold px-2 py-0.5 rounded-full text-gray-700">
                      YOU ARE HERE
                    </span>
                  </div>
                )}

                <div className="text-center mb-3">
                  <div className="text-4xl mb-1">{role.emoji}</div>
                  <h3
                    className={`font-extrabold text-base ${isUnlocked ? role.textClass : "text-gray-400"}`}
                  >
                    {role.name}
                  </h3>
                  <p
                    className={`text-xs font-semibold mt-0.5 ${isUnlocked ? role.textClass : "text-gray-400"} opacity-70`}
                  >
                    {role.minPoints.toLocaleString()}
                    {role.maxPoints
                      ? `–${role.maxPoints.toLocaleString()}`
                      : "+"}{" "}
                    pts
                  </p>
                </div>

                <div
                  className={`rounded-xl p-2 text-center ${
                    isUnlocked ? "bg-white/60" : "bg-gray-100"
                  }`}
                >
                  <p
                    className={`text-2xl font-extrabold ${isUnlocked ? role.textClass : "text-gray-400"}`}
                  >
                    {role.multiplier}×
                  </p>
                  <p className="text-xs text-gray-500">points per task</p>
                </div>

                <p
                  className={`text-xs mt-2 text-center leading-snug ${
                    isUnlocked ? "opacity-70" : "text-gray-400"
                  }`}
                >
                  {role.description}
                </p>

                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl">
                    <span className="text-2xl">🔒</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 bg-secondary/50 rounded-2xl p-4 text-center border border-border">
          <p className="text-sm text-muted-foreground">
            💡 Your current multiplier means you earn{" "}
            <strong>{currentRole.multiplier}× credit points</strong> for every
            completed task! Keep learning to reach <strong>CEO</strong> and earn
            4× points on everything! 🚀
          </p>
        </div>
      </div>
    </section>
  );
}
