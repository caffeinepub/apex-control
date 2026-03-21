import { Toaster } from "@/components/ui/sonner";
import {
  BookOpen,
  Bot,
  Coins,
  Gift,
  LayoutDashboard,
  Menu,
  Star,
  Trophy,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { AiBuddyTab } from "./components/AiBuddyTab";
import { CreditsTab } from "./components/CreditsTab";
import { LeaderboardTab } from "./components/LeaderboardTab";
import { Onboarding } from "./components/Onboarding";
import { ReviewsSection } from "./components/ReviewsSection";
import { RoleBadge } from "./components/RoleBadge";
import { RolesRanksSection } from "./components/RolesRanksSection";
import { TasksTab } from "./components/TasksTab";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import {
  useAddReview,
  useCreateReward,
  useCreateTask,
  useGetAllReviews,
  useGetAllTasks,
  useGetCreditPoints,
  useGetProfile,
  useGetRewardsStore,
} from "./hooks/useQueries";
import { getRoleForPoints } from "./utils/roles";

// Seed data helpers
const SEED_TASKS = [
  {
    title: "Money Basics Quiz",
    description:
      "Test your knowledge about money, savings, and how the Indian economy works!",
    taskType: "quiz",
    pointsReward: 50,
    difficulty: 1,
    questions: [
      {
        questionText: "What is the currency of India?",
        options: ["Dollar", "Rupee", "Pound", "Euro"],
        correctAnswerIndex: 1n,
        points: 10n,
      },
      {
        questionText: "What does 'saving money' mean?",
        options: [
          "Spending all your money",
          "Keeping some money for later",
          "Borrowing money",
          "Losing money",
        ],
        correctAnswerIndex: 1n,
        points: 10n,
      },
      {
        questionText: "Which is better: saving or spending all your money?",
        options: ["Spending all", "Saving some", "Neither", "Borrowing"],
        correctAnswerIndex: 1n,
        points: 10n,
      },
      {
        questionText: "What is a business?",
        options: [
          "A type of school",
          "Selling products or services to earn money",
          "A government office",
          "A bank",
        ],
        correctAnswerIndex: 1n,
        points: 10n,
      },
      {
        questionText: "What is a budget?",
        options: [
          "A type of food",
          "A plan for how to spend money",
          "A bank account",
          "A credit card",
        ],
        correctAnswerIndex: 1n,
        points: 10n,
      },
    ],
  },
  {
    title: "Business Ideas for Kids",
    description:
      "Learn about creative business ideas kids can start and how to turn ideas into income!",
    taskType: "presentation",
    pointsReward: 75,
    difficulty: 2,
    questions: [
      {
        questionText: "What is an entrepreneur?",
        options: [
          "Someone who works for others",
          "Someone who starts their own business",
          "A type of teacher",
          "A bank employee",
        ],
        correctAnswerIndex: 1n,
        points: 15n,
      },
      {
        questionText: "Which of these is a business idea for kids?",
        options: [
          "Homework helper service",
          "Building a factory",
          "Starting a bank",
          "Opening a hospital",
        ],
        correctAnswerIndex: 0n,
        points: 15n,
      },
      {
        questionText: "What is profit?",
        options: [
          "Money you owe",
          "Money you lose",
          "Money left after paying expenses",
          "Money borrowed",
        ],
        correctAnswerIndex: 2n,
        points: 15n,
      },
    ],
  },
  {
    title: "Digital Skills Quiz",
    description:
      "Test your knowledge about computers, internet safety, and digital tools used in business!",
    taskType: "quiz",
    pointsReward: 60,
    difficulty: 1,
    questions: [
      {
        questionText: "What is the internet?",
        options: [
          "A type of food",
          "A global network of computers",
          "A television channel",
          "A book",
        ],
        correctAnswerIndex: 1n,
        points: 12n,
      },
      {
        questionText: "What is email used for?",
        options: [
          "Cooking food",
          "Sending messages online",
          "Drawing pictures",
          "Playing games",
        ],
        correctAnswerIndex: 1n,
        points: 12n,
      },
      {
        questionText: "What does 'download' mean?",
        options: [
          "Going downstairs",
          "Getting a file from the internet",
          "Sending a file",
          "Deleting a file",
        ],
        correctAnswerIndex: 1n,
        points: 12n,
      },
      {
        questionText: "What is a password used for?",
        options: [
          "Opening doors",
          "Protecting your account",
          "Sending messages",
          "Making calls",
        ],
        correctAnswerIndex: 1n,
        points: 12n,
      },
      {
        questionText: "What is UPI in India?",
        options: [
          "A social media app",
          "A payment system",
          "A government scheme",
          "A school program",
        ],
        correctAnswerIndex: 1n,
        points: 12n,
      },
    ],
  },
  {
    title: "Math in Business",
    description:
      "Learn how math is used in real businesses — from calculating profits to managing budgets!",
    taskType: "quiz",
    pointsReward: 80,
    difficulty: 2,
    questions: [
      {
        questionText: "If you earn ₹100 and spend ₹60, how much do you save?",
        options: ["₹30", "₹40", "₹50", "₹60"],
        correctAnswerIndex: 1n,
        points: 20n,
      },
      {
        questionText: "What is 20% of ₹500?",
        options: ["₹50", "₹100", "₹150", "₹200"],
        correctAnswerIndex: 1n,
        points: 20n,
      },
      {
        questionText:
          "If you sell 5 items at ₹30 each, what is your total revenue?",
        options: ["₹100", "₹120", "₹150", "₹180"],
        correctAnswerIndex: 2n,
        points: 20n,
      },
      {
        questionText: "What is profit = revenue − ?",
        options: ["Tax", "Expenses", "Savings", "Loan"],
        correctAnswerIndex: 1n,
        points: 20n,
      },
    ],
  },
  {
    title: "Leadership & Communication",
    description:
      "Discover the key skills that make great business leaders and how to communicate effectively!",
    taskType: "presentation",
    pointsReward: 100,
    difficulty: 3,
    questions: [
      {
        questionText: "What is leadership?",
        options: [
          "Telling people what to do",
          "Inspiring and guiding others",
          "Working alone",
          "Avoiding responsibility",
        ],
        correctAnswerIndex: 1n,
        points: 25n,
      },
      {
        questionText: "What makes a good communicator?",
        options: [
          "Talking very loudly",
          "Listening and speaking clearly",
          "Never listening",
          "Using difficult words",
        ],
        correctAnswerIndex: 1n,
        points: 25n,
      },
      {
        questionText: "What is teamwork?",
        options: [
          "Working alone",
          "Competing with others",
          "Working together toward a goal",
          "Avoiding others",
        ],
        correctAnswerIndex: 2n,
        points: 25n,
      },
    ],
  },
];

const SEED_REWARDS = [
  {
    name: "Premium Subscription",
    description: "Unlock all advanced tasks and AI features for 30 days!",
    cost: 500,
    rewardType: "subscription",
    value: 30,
  },
  {
    name: "₹500 Paytm Payout",
    description:
      "Convert your points into ₹500 Indian Rupees sent to your Paytm wallet!",
    cost: 1000,
    rewardType: "inr_payout",
    value: 500,
  },
  {
    name: "₹1000 Paytm Payout",
    description:
      "Convert your points into ₹1000 Indian Rupees sent to your Paytm wallet!",
    cost: 2000,
    rewardType: "inr_payout",
    value: 1000,
  },
  {
    name: "Achievement Badge",
    description: "Show off your KidBiz Achievement Badge on your profile!",
    cost: 200,
    rewardType: "badge",
    value: null,
  },
];

const SEED_REVIEWS = [
  {
    username: "Parent of Aarav, Mumbai",
    rating: 5,
    comment:
      "My son earned his first ₹500 through this app! He's so motivated to learn business skills now.",
  },
  {
    username: "Priya K., Age 12",
    rating: 5,
    comment:
      "I love the quizzes and the AI buddy BUDDY. It helps me understand money and business in a fun way!",
  },
];

function DashboardHome({
  name,
  credits,
  onTabChange,
}: { name: string; credits: number; onTabChange: (tab: string) => void }) {
  const role = getRoleForPoints(credits);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-mint relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16 flex flex-col md:flex-row items-center gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 text-center md:text-left"
          >
            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-kidbiz-teal leading-tight mb-4">
              Learn Business,
              <br />
              <span className="text-kidbiz-orange">Earn Real Rupees!</span> 🚀
            </h1>
            <p className="text-lg text-foreground/70 mb-6 max-w-md">
              Complete fun tasks, earn credit points, and convert them to real
              Indian Rupees via Paytm!
            </p>
            <button
              type="button"
              className="btn-orange text-lg px-8 py-3 shadow-float"
              onClick={() => onTabChange("learn")}
              data-ocid="dashboard.primary_button"
            >
              Start Learning! 🎓
            </button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-1 flex justify-center"
          >
            <img
              src="/assets/generated/kidbiz-hero-kids.dim_600x500.png"
              alt="Kids learning business"
              className="w-full max-w-sm object-contain"
            />
          </motion.div>
        </div>
        {/* Wave divider */}
        <svg
          aria-hidden="true"
          className="w-full"
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z"
            fill="oklch(0.97 0.005 200)"
          />
        </svg>
      </section>

      {/* Welcome back */}
      <div className="text-center py-8">
        <h2 className="text-3xl font-display font-extrabold">
          Welcome Back, {name}! 👋
        </h2>
        <p className="text-muted-foreground mt-1">
          You have{" "}
          <span className="font-bold text-kidbiz-orange">
            {credits} credit points
          </span>
          . Keep going!
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="max-w-6xl mx-auto px-4 pb-6">
        {/* Role Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-4"
        >
          <RoleBadge points={credits} />
        </motion.div>

        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="kid-card-teal rounded-3xl p-6 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => onTabChange("learn")}
            data-ocid="dashboard.card"
          >
            <BookOpen className="w-8 h-8 mb-3 opacity-90" />
            <h3 className="text-xl font-display font-extrabold mb-1">
              My Tasks & Learning
            </h3>
            <p className="text-white/80 text-sm">
              Complete quizzes and presentations to earn points!
            </p>
            <div className="mt-4 text-2xl">📚</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="kid-card-orange rounded-3xl p-6 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => onTabChange("rewards")}
            data-ocid="dashboard.card"
          >
            <Coins className="w-8 h-8 mb-3 opacity-90" />
            <h3 className="text-xl font-display font-extrabold mb-1">
              Credit Balance
            </h3>
            <p className="text-white/80 text-sm mb-3">
              Your total credit points
            </p>
            <div className="text-4xl font-extrabold">{credits}</div>
            <p className="text-white/70 text-xs mt-1">
              ≈ ₹{Math.floor(credits / 2)} INR
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="kid-card-yellow rounded-3xl p-6 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => onTabChange("leaderboard")}
            data-ocid="dashboard.card"
          >
            <Trophy className="w-8 h-8 mb-3 opacity-80" />
            <h3 className="text-xl font-display font-extrabold mb-1">
              Leaderboard
            </h3>
            <p className="text-amber-800/80 text-sm">
              See where you rank among top kids!
            </p>
            <div className="mt-4 text-2xl">🏆</div>
          </motion.div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="kid-card-orange rounded-3xl p-6 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => onTabChange("rewards")}
            data-ocid="dashboard.card"
          >
            <Gift className="w-8 h-8 mb-3 opacity-90" />
            <h3 className="text-xl font-display font-extrabold mb-1">
              Rewards Store
            </h3>
            <p className="text-white/80 text-sm">
              Convert points to ₹500 notes via Paytm! 💵
            </p>
            <div className="mt-4 flex gap-2 text-2xl">💸 🎁 👑</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="kid-card-green rounded-3xl p-6 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => onTabChange("buddy")}
            data-ocid="dashboard.card"
          >
            <Bot className="w-8 h-8 mb-3 opacity-90" />
            <h3 className="text-xl font-display font-extrabold mb-1">
              AI Study Buddy
            </h3>
            <p className="text-white/80 text-sm">
              Chat, voice, or video call with BUDDY — your AI coach!
            </p>
            <div className="mt-4 text-2xl bounce-soft">🤖</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="kid-card-purple rounded-3xl p-6 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => onTabChange("roles")}
            data-ocid="dashboard.roles.card"
          >
            <span className="text-3xl mb-3 block">{role.emoji}</span>
            <h3 className="text-xl font-display font-extrabold mb-1">
              Roles & Ranks
            </h3>
            <p className="text-white/80 text-sm">
              You are a <strong>{role.name}</strong>! Earn {role.multiplier}×
              points!
            </p>
            <div className="mt-4 text-2xl">🏅</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { actor } = useActor();
  const { data: profile, isLoading: profileLoading } = useGetProfile();
  const { data: credits = 0n } = useGetCreditPoints();
  const { data: tasks = [] } = useGetAllTasks();
  const { data: reviews = [] } = useGetAllReviews();
  const { data: rewards = [] } = useGetRewardsStore();
  const createTask = useCreateTask();
  const createReward = useCreateReward();
  const addReview = useAddReview();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [seeded, setSeeded] = useState(false);

  // Seed data once actor and profile are ready
  // biome-ignore lint/correctness/useExhaustiveDependencies: seed runs once
  useEffect(() => {
    if (!actor || !profile || seeded) return;
    const seed = async () => {
      setSeeded(true);
      try {
        if (tasks.length === 0) {
          await Promise.all(SEED_TASKS.map((t) => createTask.mutateAsync(t)));
        }
        if (rewards.length === 0) {
          await Promise.all(
            SEED_REWARDS.map((r) => createReward.mutateAsync(r)),
          );
        }
        if (reviews.length === 0) {
          await Promise.all(SEED_REVIEWS.map((r) => addReview.mutateAsync(r)));
        }
      } catch {
        // Silently handle seed errors
      }
    };
    seed();
  }, [actor, profile, seeded]);

  const kidName = profile?.name ?? "Champion";
  const creditPoints = Number(credits);
  const currentRole = getRoleForPoints(creditPoints);

  const NAV_TABS = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "learn", label: "Learn", icon: BookOpen },
    { id: "rewards", label: "My Rewards", icon: Gift },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "buddy", label: "AI Buddy", icon: Bot },
    { id: "roles", label: "Roles", icon: Star },
  ];

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center hero-mint">
        <div className="text-center">
          <div className="text-7xl bounce-soft mb-4">🚀</div>
          <p className="text-xl font-display font-bold text-kidbiz-teal">
            Loading KidBiz Academy...
          </p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="min-h-screen hero-mint flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-float p-8 w-full max-w-md text-center"
        >
          <img
            src="/assets/generated/kidbiz-logo-transparent.dim_300x300.png"
            alt="KidBiz"
            className="h-20 w-auto mx-auto mb-4 object-contain"
          />
          <h1 className="text-3xl font-display font-extrabold text-kidbiz-teal mb-2">
            KidBiz Academy
          </h1>
          <p className="text-muted-foreground mb-6">
            Learn business skills, earn credit points, and convert them to real
            Indian Rupees!
          </p>
          <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
            <div className="bg-secondary rounded-2xl p-3">
              <span className="text-2xl">📚</span>
              <p className="font-semibold mt-1">Fun Tasks</p>
            </div>
            <div className="bg-secondary rounded-2xl p-3">
              <span className="text-2xl">🏆</span>
              <p className="font-semibold mt-1">Earn Points</p>
            </div>
            <div className="bg-secondary rounded-2xl p-3">
              <span className="text-2xl">💸</span>
              <p className="font-semibold mt-1">₹500 Paytm</p>
            </div>
            <div className="bg-secondary rounded-2xl p-3">
              <span className="text-2xl">🤖</span>
              <p className="font-semibold mt-1">AI Coach</p>
            </div>
          </div>
          <button
            type="button"
            className="btn-orange w-full text-base py-3"
            onClick={login}
            disabled={loginStatus === "logging-in"}
            data-ocid="auth.primary_button"
          >
            {loginStatus === "logging-in" ? "Connecting..." : "Get Started! 🚀"}
          </button>
          <p className="text-xs text-muted-foreground mt-3">
            Safe & secure login for kids
          </p>
        </motion.div>
      </div>
    );
  }

  if (!profile) {
    return <Onboarding onComplete={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Toaster position="top-center" />

      {/* Utility Bar */}
      <div className="bg-kidbiz-teal text-white px-4 py-2 flex items-center justify-between text-sm">
        <span>👋 Hi, {kidName}! Keep it up!</span>
        <div className="flex items-center gap-3">
          <span
            className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
              currentRole.bgClass
            } ${currentRole.textClass}`}
          >
            {currentRole.emoji} {currentRole.name}
          </span>
          <span className="flex items-center gap-1 font-bold">
            <Star className="w-4 h-4 fill-kidbiz-yellow text-kidbiz-yellow" />
            {creditPoints.toLocaleString()} pts
          </span>
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-base">
            {profile.profilePicture || "🦁"}
          </div>
        </div>
      </div>

      {/* Header / Nav */}
      <header className="bg-white border-b border-border sticky top-0 z-50 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo — 48px height */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <img
              src="/assets/generated/kidbiz-logo-transparent.dim_300x300.png"
              alt="KidBiz Academy Logo"
              className="h-12 w-auto object-contain"
            />
            <span className="font-display font-extrabold text-kidbiz-teal text-xl hidden sm:block">
              KidBiz Academy
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_TABS.map((tab) => (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                data-ocid={`nav.${tab.id}.link`}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn-orange text-sm py-1.5 px-4 hidden sm:block"
              onClick={() => setActiveTab("learn")}
              data-ocid="nav.start_learning.primary_button"
            >
              Start Learning! 🎓
            </button>
            {/* Mobile menu toggle */}
            <button
              type="button"
              className="md:hidden p-2 rounded-xl hover:bg-secondary transition-all"
              onClick={() => setMobileMenuOpen((v) => !v)}
              data-ocid="nav.menu.toggle"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t bg-white overflow-hidden"
            >
              <div className="p-3 space-y-1">
                {NAV_TABS.map((tab) => (
                  <button
                    type="button"
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    data-ocid={`nav.mobile_${tab.id}.link`}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                      activeTab === tab.id
                        ? "bg-primary text-white"
                        : "hover:bg-secondary"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "dashboard" && (
              <DashboardHome
                name={kidName}
                credits={creditPoints}
                onTabChange={setActiveTab}
              />
            )}
            {activeTab === "learn" && <TasksTab kidName={kidName} />}
            {activeTab === "rewards" && <CreditsTab kidName={kidName} />}
            {activeTab === "leaderboard" && <LeaderboardTab />}
            {activeTab === "buddy" && <AiBuddyTab kidName={kidName} />}
            {activeTab === "roles" && (
              <div className="max-w-6xl mx-auto py-6">
                <div className="px-4 mb-6">
                  <RoleBadge points={creditPoints} />
                </div>
                <RolesRanksSection currentPoints={creditPoints} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Reviews Section — shown only on dashboard */}
        {activeTab === "dashboard" && <ReviewsSection />}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-40 flex">
        {NAV_TABS.map((tab) => (
          <button
            type="button"
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            data-ocid={`bottom_nav.${tab.id}.link`}
            className={`flex-1 flex flex-col items-center py-2 text-xs font-semibold transition-all ${
              activeTab === tab.id ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <tab.icon
              className={`w-5 h-5 mb-0.5 ${activeTab === tab.id ? "text-primary" : ""}`}
            />
            <span className="truncate text-[10px]">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <footer className="bg-kidbiz-teal text-white py-10 px-4 md:mb-0 mb-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/kidbiz-logo-transparent.dim_300x300.png"
                alt="KidBiz"
                className="h-12 w-auto object-contain"
              />
              <div>
                <h3 className="font-display font-extrabold text-xl">
                  KidBiz Academy
                </h3>
                <p className="text-white/70 text-sm">Learn. Earn. Grow. 🚀</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-white/80 justify-center">
              <button
                type="button"
                onClick={() => setActiveTab("learn")}
                className="hover:text-white transition-colors"
                data-ocid="footer.learn.link"
              >
                Learn
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("rewards")}
                className="hover:text-white transition-colors"
                data-ocid="footer.rewards.link"
              >
                Rewards
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("leaderboard")}
                className="hover:text-white transition-colors"
                data-ocid="footer.leaderboard.link"
              >
                Leaderboard
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("buddy")}
                className="hover:text-white transition-colors"
                data-ocid="footer.buddy.link"
              >
                AI Buddy
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("roles")}
                className="hover:text-white transition-colors"
                data-ocid="footer.roles.link"
              >
                Roles & Ranks
              </button>
            </div>
          </div>
          <div className="border-t border-white/20 pt-4 text-center text-white/60 text-xs">
            <p>
              🇮🇳 Made with ❤️ for Indian children | Points convert to ₹500 Paytm
              payouts
            </p>
            <p className="mt-1">
              © {new Date().getFullYear()}. Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                className="underline hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
