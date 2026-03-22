import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Gift, Rocket, Star } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { useCreateProfile } from "../hooks/useQueries";

const AVATARS = ["🦁", "🐯", "🦊", "🐻", "🦄", "🐸", "🐧", "🦅", "🐉", "🌟"];

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [name, setName] = useState("Saransh");
  const [age, setAge] = useState("11");
  const [avatar, setAvatar] = useState("🦁");
  const createProfile = useCreateProfile();
  const { actor } = useActor();

  const handleSubmit = async () => {
    if (!name.trim() || !age) {
      toast.error("Please enter your name and age!");
      return;
    }
    const ageNum = Number.parseInt(age);
    if (ageNum < 5 || ageNum > 18) {
      toast.error("Age must be between 5 and 18!");
      return;
    }
    try {
      await createProfile.mutateAsync({
        name: name.trim(),
        age: ageNum,
        pic: avatar,
      });
      try {
        if (actor) {
          await actor.earnCredits(1_000_000n);
        }
      } catch {
        // silent
      }
      toast.success(
        `Welcome back, ${name}! 🎉 Your 1,000,000 pts & Manager rank are ready!`,
      );
      onComplete();
    } catch {
      toast.error("Something went wrong. Please try again!");
    }
  };

  return (
    <div className="min-h-screen hero-mint flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white rounded-3xl shadow-float p-8 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <img
            src="/assets/generated/kidbiz-logo-transparent.dim_300x300.png"
            alt="KidBiz Academy"
            className="w-20 h-20 mx-auto mb-2 object-contain"
          />
          <h1 className="text-3xl font-display font-extrabold text-kidbiz-teal">
            KidBiz Academy
          </h1>
          <p className="text-muted-foreground mt-1">Learn. Earn. Grow. 🚀</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { icon: BookOpen, label: "Fun Tasks", color: "text-kidbiz-teal" },
            { icon: Star, label: "Earn Points", color: "text-kidbiz-yellow" },
            { icon: Gift, label: "Real Rewards", color: "text-kidbiz-orange" },
            { icon: Rocket, label: "AI Buddy", color: "text-kidbiz-green" },
          ].map(({ icon: Icon, label, color }) => (
            <div
              key={label}
              className="flex items-center gap-2 bg-secondary/60 rounded-xl p-3"
            >
              <Icon className={`w-5 h-5 ${color}`} />
              <span className="text-sm font-semibold">{label}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="onboarding-name"
              className="block text-sm font-bold mb-1 text-foreground"
            >
              Your Name
            </label>
            <Input
              id="onboarding-name"
              data-ocid="onboarding.input"
              placeholder="e.g. Aarav, Priya, Riya..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl text-base"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          <div>
            <label
              htmlFor="onboarding-age"
              className="block text-sm font-bold mb-1 text-foreground"
            >
              Your Age
            </label>
            <Input
              id="onboarding-age"
              data-ocid="onboarding.input"
              type="number"
              placeholder="5–18"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="rounded-xl text-base"
              min={5}
              max={18}
            />
          </div>
          <div>
            <label
              htmlFor="avatar-group"
              className="block text-sm font-bold mb-2 text-foreground"
            >
              Pick Your Avatar
            </label>
            <div className="grid grid-cols-5 gap-2">
              {AVATARS.map((em) => (
                <button
                  type="button"
                  key={em}
                  onClick={() => setAvatar(em)}
                  className={`text-2xl p-2 rounded-xl transition-all ${
                    avatar === em
                      ? "bg-primary/20 ring-2 ring-primary scale-110"
                      : "bg-muted hover:bg-secondary"
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            data-ocid="onboarding.submit_button"
            className="btn-orange w-full text-base py-3 disabled:opacity-60"
            onClick={handleSubmit}
            disabled={createProfile.isPending}
          >
            {createProfile.isPending
              ? "Setting up..."
              : `Let's Start Learning! 🎓`}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
