import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Coins, Crown, Gift, Smartphone, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Reward } from "../backend.d";
import {
  useGetCreditPoints,
  useGetRewardsStore,
  useRedeemReward,
  useRedeemSubscription,
} from "../hooks/useQueries";

interface PaytmModalProps {
  open: boolean;
  onClose: () => void;
  reward: Reward | null;
  onConfirm: (mobile: string) => void;
  isPending: boolean;
}

function PaytmModal({
  open,
  onClose,
  reward,
  onConfirm,
  isPending,
}: PaytmModalProps) {
  const [mobile, setMobile] = useState("");
  const [done, setDone] = useState(false);

  const handleConfirm = () => {
    if (mobile.length !== 10) {
      toast.error("Enter a valid 10-digit mobile number!");
      return;
    }
    onConfirm(mobile);
    setDone(true);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        onClose();
        setDone(false);
        setMobile("");
      }}
    >
      <DialogContent data-ocid="paytm.dialog" className="max-w-sm rounded-3xl">
        {done ? (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-center py-8"
          >
            <div className="text-7xl mb-4">🎉</div>
            <h3 className="text-2xl font-display font-extrabold text-kidbiz-green mb-2">
              Payout Initiated!
            </h3>
            <p className="text-muted-foreground">
              Your <strong>{reward?.name}</strong> is being processed.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              ₹500 notes will arrive in your Paytm wallet within 24–48 hours!
            </p>
            <div className="text-5xl mt-4">💸</div>
            <button
              type="button"
              className="btn-teal mt-6 w-full"
              onClick={() => {
                onClose();
                setDone(false);
                setMobile("");
              }}
              data-ocid="paytm.close_button"
            >
              Awesome!
            </button>
          </motion.div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                💰 Paytm Payout
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-kidbiz-mint rounded-2xl p-4 text-center">
                <div className="text-4xl mb-2">💵</div>
                <p className="font-bold text-kidbiz-teal">{reward?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {reward?.description}
                </p>
                <p className="text-2xl font-extrabold text-kidbiz-orange mt-1">
                  Cost: {Number(reward?.cost)} pts
                </p>
              </div>
              <div>
                <label
                  htmlFor="paytm-mobile"
                  className="block text-sm font-bold mb-1"
                >
                  Paytm Mobile Number
                </label>
                <Input
                  id="paytm-mobile"
                  data-ocid="paytm.input"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={mobile}
                  onChange={(e) =>
                    setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  className="rounded-xl"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn-teal flex-1"
                  onClick={onClose}
                  data-ocid="paytm.cancel_button"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-orange flex-1 disabled:opacity-50"
                  onClick={handleConfirm}
                  disabled={isPending}
                  data-ocid="paytm.confirm_button"
                >
                  {isPending ? "Processing..." : "Confirm Payout"}
                </button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

const rewardIcons: Record<string, string> = {
  subscription: "👑",
  inr_payout: "💸",
  badge: "🏅",
};

interface CreditsTabProps {
  kidName: string;
}

export function CreditsTab({ kidName: _kidName }: CreditsTabProps) {
  const { data: credits = 0n } = useGetCreditPoints();
  const { data: rewards = [], isLoading } = useGetRewardsStore();
  const redeemReward = useRedeemReward();
  const redeemSubscription = useRedeemSubscription();
  const [paytmModal, setPaytmModal] = useState<{
    open: boolean;
    reward: Reward | null;
  }>({ open: false, reward: null });

  const handleRedeem = (reward: Reward) => {
    if (credits < reward.cost) {
      toast.error(
        `You need ${Number(reward.cost)} points but only have ${Number(credits)}!`,
      );
      return;
    }
    setPaytmModal({ open: true, reward });
  };

  const handlePaytmConfirm = async (mobile: string) => {
    if (!paytmModal.reward) return;
    try {
      const isSubscription = paytmModal.reward.rewardType === "subscription";
      if (isSubscription) {
        await redeemSubscription.mutateAsync(paytmModal.reward.id);
      } else {
        await redeemReward.mutateAsync(paytmModal.reward.id);
      }
      toast.success(`🎉 Redemption successful! Payout to ${mobile} initiated!`);
    } catch {
      toast.error("Redemption failed. Please try again!");
    }
  };

  const creditPoints = Number(credits);
  const inrValue = Math.floor(creditPoints / 2); // 2 points = ₹1

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="kid-card-orange rounded-3xl p-6 mb-6 text-white"
      >
        <div className="flex items-center gap-3 mb-4">
          <Coins className="w-8 h-8" />
          <h2 className="text-xl font-display font-extrabold">
            My Credit Balance
          </h2>
        </div>
        <div className="flex items-end gap-4 flex-wrap">
          <div>
            <p className="text-white/70 text-sm">Credit Points</p>
            <p className="text-5xl font-extrabold">
              {creditPoints.toLocaleString()}
            </p>
          </div>
          <div className="bg-white/20 rounded-2xl px-4 py-2">
            <p className="text-white/70 text-xs">≈ Indian Rupees</p>
            <p className="text-2xl font-extrabold">
              ₹{inrValue.toLocaleString()}
            </p>
          </div>
        </div>
        <p className="text-white/60 text-xs mt-3">
          🇮🇳 Points convert to ₹500 notes via Paytm!
        </p>
      </motion.div>

      {/* INR Conversion Banner */}
      <div className="bg-secondary rounded-3xl p-4 mb-6 flex items-center gap-4 border-2 border-dashed border-primary/30">
        <div className="text-4xl">💵</div>
        <div>
          <p className="font-bold text-foreground">Points → Indian Rupees!</p>
          <p className="text-sm text-muted-foreground">
            Redeem your points for real ₹500 Paytm payouts. Earn more tasks,
            earn more money!
          </p>
        </div>
      </div>

      {/* Rewards Store */}
      <h2 className="text-2xl font-display font-extrabold mb-4">
        🎁 Rewards Store
      </h2>

      {isLoading && (
        <div data-ocid="rewards.loading_state" className="text-center py-10">
          <div className="text-4xl bounce-soft">🎁</div>
          <p className="text-muted-foreground mt-2">Loading rewards...</p>
        </div>
      )}

      {!isLoading && rewards.length === 0 && (
        <div data-ocid="rewards.empty_state" className="text-center py-10">
          <div className="text-4xl">🏪</div>
          <p className="font-bold mt-2">Rewards coming soon!</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rewards.map((reward, idx) => {
          const canAfford = credits >= reward.cost;
          const icon = rewardIcons[reward.rewardType] ?? "🎁";
          return (
            <motion.div
              key={String(reward.id)}
              data-ocid={`rewards.item.${idx + 1}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              className={`bg-white rounded-3xl p-5 shadow-card border-2 transition-all ${
                canAfford
                  ? "border-kidbiz-green/50 hover:shadow-float"
                  : "border-border opacity-70"
              }`}
            >
              <div className="text-4xl mb-3">{icon}</div>
              <h3 className="font-display font-extrabold text-lg mb-1">
                {reward.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {reward.description}
              </p>
              <div className="flex items-center justify-between">
                <span
                  className={`font-extrabold text-lg ${canAfford ? "text-kidbiz-orange" : "text-muted-foreground"}`}
                >
                  {Number(reward.cost)} pts
                </span>
                <button
                  type="button"
                  className={
                    canAfford
                      ? "btn-orange text-sm py-2"
                      : "btn-teal text-sm py-2 opacity-50 cursor-not-allowed"
                  }
                  onClick={() => canAfford && handleRedeem(reward)}
                  disabled={!canAfford}
                  data-ocid={`rewards.edit_button.${idx + 1}`}
                >
                  {canAfford ? "Redeem!" : "Need More Pts"}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <PaytmModal
        open={paytmModal.open}
        onClose={() => setPaytmModal({ open: false, reward: null })}
        reward={paytmModal.reward}
        onConfirm={handlePaytmConfirm}
        isPending={redeemReward.isPending || redeemSubscription.isPending}
      />
    </div>
  );
}
