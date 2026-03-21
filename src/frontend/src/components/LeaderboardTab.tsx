import { Medal, Star, Trophy } from "lucide-react";
import { motion } from "motion/react";
import { useGetLeaderboard } from "../hooks/useQueries";

const AVATARS = ["🦁", "🐯", "🦊", "🐻", "🦄", "🐸", "🐧", "🦅", "🐉", "🌟"];

export function LeaderboardTab() {
  const { data: leaders = [], isLoading } = useGetLeaderboard();

  const sorted = [...leaders].sort(
    (a, b) => Number(b.totalCreditPoints) - Number(a.totalCreditPoints),
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-display font-extrabold text-foreground">
          🏆 Leaderboard
        </h2>
        <p className="text-muted-foreground">Top earners in KidBiz Academy!</p>
      </div>

      {/* Top 3 Podium */}
      {sorted.length >= 3 && (
        <div className="flex items-end justify-center gap-3 mb-8">
          {/* 2nd */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-2xl mx-auto mb-1">
              {AVATARS[1]}
            </div>
            <p className="font-bold text-sm truncate max-w-20">
              {sorted[1]?.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {Number(sorted[1]?.totalCreditPoints)} pts
            </p>
            <div className="bg-gray-200 rounded-t-xl w-20 h-16 mx-auto flex items-end justify-center pb-2 mt-2">
              <span className="text-2xl">🥈</span>
            </div>
          </motion.div>
          {/* 1st */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full bg-kidbiz-yellow flex items-center justify-center text-2xl mx-auto mb-1 ring-4 ring-kidbiz-yellow">
              {AVATARS[0]}
            </div>
            <p className="font-bold text-sm truncate max-w-24">
              {sorted[0]?.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {Number(sorted[0]?.totalCreditPoints)} pts
            </p>
            <div className="bg-kidbiz-yellow rounded-t-xl w-24 h-24 mx-auto flex items-end justify-center pb-2 mt-2">
              <span className="text-3xl">🥇</span>
            </div>
          </motion.div>
          {/* 3rd */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="w-14 h-14 rounded-full bg-orange-200 flex items-center justify-center text-2xl mx-auto mb-1">
              {AVATARS[2]}
            </div>
            <p className="font-bold text-sm truncate max-w-20">
              {sorted[2]?.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {Number(sorted[2]?.totalCreditPoints)} pts
            </p>
            <div className="bg-orange-200 rounded-t-xl w-20 h-12 mx-auto flex items-end justify-center pb-2 mt-2">
              <span className="text-2xl">🥉</span>
            </div>
          </motion.div>
        </div>
      )}

      {isLoading && (
        <div
          data-ocid="leaderboard.loading_state"
          className="text-center py-10"
        >
          <div className="text-4xl bounce-soft">🏆</div>
          <p className="text-muted-foreground mt-2">Loading leaders...</p>
        </div>
      )}

      {!isLoading && sorted.length === 0 && (
        <div
          data-ocid="leaderboard.empty_state"
          className="text-center py-10 bg-white rounded-3xl shadow-card"
        >
          <div className="text-5xl mb-3">🏆</div>
          <p className="font-bold text-lg">Be the first on the leaderboard!</p>
          <p className="text-muted-foreground">
            Complete tasks to earn points and climb the ranks!
          </p>
        </div>
      )}

      {/* Full list */}
      <div className="space-y-3">
        {sorted.map((user, idx) => (
          <motion.div
            key={`${user.name}-${Number(user.totalCreditPoints)}`}
            data-ocid={`leaderboard.item.${idx + 1}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white rounded-2xl px-5 py-4 flex items-center gap-4 shadow-card"
          >
            <span className="text-2xl w-10 text-center">
              {idx === 0
                ? "🥇"
                : idx === 1
                  ? "🥈"
                  : idx === 2
                    ? "🥉"
                    : `#${idx + 1}`}
            </span>
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl">
              {user.profilePicture || AVATARS[idx % AVATARS.length]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground">
                🔥 {Number(user.streakDays)} day streak
              </p>
            </div>
            <div className="text-right">
              <p className="font-extrabold text-kidbiz-orange">
                {Number(user.totalCreditPoints).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">pts</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
