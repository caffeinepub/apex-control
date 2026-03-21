import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Bot,
  Brain,
  ChevronRight,
  Play,
  Presentation,
  Star,
  Trophy,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Task } from "../backend.d";
import {
  useGetAllTasks,
  useLogAiSession,
  useSubmitTaskAnswers,
} from "../hooks/useQueries";

const PRESENTATION_SLIDES: Record<
  string,
  { title: string; content: string; emoji: string }[]
> = {
  default: [
    {
      title: "What is Money?",
      content:
        "Money is what we use to buy things we need and want. There are coins and notes. In India, we use Rupees (₹)!",
      emoji: "💰",
    },
    {
      title: "Saving is Smart!",
      content:
        "When you earn money, always save some! Even small savings grow big over time. A good habit is saving 20% of what you earn.",
      emoji: "🐷",
    },
    {
      title: "Earning by Working",
      content:
        "You earn money by doing work. Completing tasks on KidBiz Academy earns you Credit Points which can become real Rupees!",
      emoji: "⭐",
    },
    {
      title: "Spending Wisely",
      content:
        "Before buying something, ask: Do I need it? Can I afford it? Is there a better use for my money?",
      emoji: "🛒",
    },
    {
      title: "You Did It!",
      content:
        "Great job learning about money! Now take the quiz to earn your credit points!",
      emoji: "🏆",
    },
  ],
};

const difficultyLabel = (d: bigint) => {
  if (d <= 1n) return { label: "Easy", color: "bg-kidbiz-green text-white" };
  if (d <= 2n)
    return { label: "Medium", color: "bg-kidbiz-yellow text-amber-900" };
  return { label: "Hard", color: "bg-kidbiz-orange text-white" };
};

interface AiMeetingModalProps {
  open: boolean;
  onClose: () => void;
  kidName: string;
  pointsEarned: number;
  taskTitle: string;
}

function AiMeetingModal({
  open,
  onClose,
  kidName,
  pointsEarned,
  taskTitle,
}: AiMeetingModalProps) {
  const logSession = useLogAiSession();
  const [messages, setMessages] = useState<
    { id: number; from: string; text: string }[]
  >([
    {
      id: 0,
      from: "ai",
      text: `🎉 Amazing work, ${kidName}! You just completed "${taskTitle}" and earned ${pointsEarned} credit points!`,
    },
    {
      id: 1,
      from: "ai",
      text: "I'm BUDDY, your AI growth coach! How are you feeling after that task? 😊",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const aiReplies = [
    `That's wonderful, ${kidName}! Keep up the great work! Every task you complete makes you smarter and richer! 🌟`,
    "Learning about business and money is a superpower! You're building skills most adults wish they had! 💪",
    "Your credit points are growing! Soon you can convert them to real Rupees via Paytm! 💰",
    `Wow, you're doing fantastic! Your streak is growing too. Consistency is the secret to success, ${kidName}! 🔥`,
    "Remember: the more you learn, the more you earn! KidBiz Academy believes in you! 🚀",
    "Great question! Keep exploring the tasks in the Learn tab. Each one teaches you real business skills! 📚",
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [
      ...prev,
      { id: prev.length, from: "user", text: userMsg },
    ]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const reply = aiReplies[Math.floor(Math.random() * aiReplies.length)];
      setMessages((prev) => [
        ...prev,
        { id: prev.length, from: "ai", text: reply },
      ]);
      setIsTyping(false);
      logSession.mutate(
        `Growth meeting with ${kidName} after completing ${taskTitle}. Points earned: ${pointsEarned}`,
      );
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        data-ocid="ai_meeting.dialog"
        className="max-w-md rounded-3xl p-0 overflow-hidden"
      >
        {/* Header */}
        <div className="kid-card-teal p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl bounce-soft">
            🤖
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">AI Growth Meeting</h3>
            <p className="text-white/80 text-sm">
              BUDDY is here to celebrate with you!
            </p>
          </div>
          <div className="ml-auto bg-white/20 rounded-full px-3 py-1">
            <span className="text-white text-sm font-bold">
              +{pointsEarned} pts!
            </span>
          </div>
        </div>

        {/* Chat */}
        <div className="h-64 overflow-y-auto p-4 space-y-3 bg-secondary/30">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.from === "ai" && <span className="text-xl mr-2">🤖</span>}
              <div
                className={
                  msg.from === "ai"
                    ? "ai-bubble p-3 text-sm max-w-[80%]"
                    : "user-bubble p-3 text-sm max-w-[80%]"
                }
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <span className="text-xl mr-2">🤖</span>
              <div className="ai-bubble p-3 text-sm">BUDDY is typing...</div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 flex gap-2 border-t">
          <input
            data-ocid="ai_meeting.input"
            className="flex-1 border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            placeholder="Say something to BUDDY..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            type="button"
            className="btn-teal text-sm"
            onClick={handleSend}
            data-ocid="ai_meeting.submit_button"
          >
            Send
          </button>
        </div>

        <div className="p-4 pt-0">
          <button
            type="button"
            className="btn-orange w-full"
            onClick={onClose}
            data-ocid="ai_meeting.close_button"
          >
            Back to Tasks 🚀
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface TaskPlayerProps {
  task: Task;
  kidName: string;
  onComplete: (pointsEarned: number) => void;
  onBack: () => void;
}

function TaskPlayer({
  task,
  kidName: _kidName,
  onComplete,
  onBack,
}: TaskPlayerProps) {
  const [phase, setPhase] = useState<"slides" | "quiz">(
    task.taskType === "presentation" ? "slides" : "quiz",
  );
  const [slideIndex, setSlideIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<bigint[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const submitAnswers = useSubmitTaskAnswers();

  const slides = PRESENTATION_SLIDES.default;
  const questions = task.questions;

  const handleNextSlide = () => {
    if (slideIndex < slides.length - 1) {
      setSlideIndex((s) => s + 1);
    } else {
      setPhase("quiz");
    }
  };

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) return;
    const newAnswers = [...selectedAnswers, BigInt(selectedOption)];
    setSelectedAnswers(newAnswers);
    setSelectedOption(null);

    if (questionIndex < questions.length - 1) {
      setQuestionIndex((q) => q + 1);
    } else {
      // submit
      submitAnswers.mutate(
        { taskId: task.id, answers: newAnswers },
        {
          onSuccess: (_result) => {
            setShowResult(true);
            setTimeout(() => {
              onComplete(Number(task.pointsReward));
            }, 2000);
          },
          onError: () => toast.error("Failed to submit. Try again!"),
        },
      );
    }
  };

  if (showResult) {
    const result = submitAnswers.data;
    const pointsEarned = result ? Number(task.pointsReward) : 0;
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-16"
      >
        <div className="text-8xl mb-4">🏆</div>
        <h2 className="text-3xl font-display font-extrabold text-kidbiz-teal mb-2">
          Task Complete!
        </h2>
        <p className="text-lg text-muted-foreground mb-4">
          You earned{" "}
          <span className="font-bold text-kidbiz-orange">
            +{pointsEarned} points
          </span>
          !
        </p>
        <p className="text-muted-foreground">
          Opening your Growth Meeting with BUDDY...
        </p>
      </motion.div>
    );
  }

  if (phase === "slides") {
    const slide = slides[slideIndex];
    return (
      <motion.div
        key={slideIndex}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        className=""
      >
        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back
          </button>
          <span className="text-sm text-muted-foreground">
            Slide {slideIndex + 1}/{slides.length}
          </span>
        </div>
        <Progress
          value={((slideIndex + 1) / slides.length) * 100}
          className="mb-6"
        />
        <div className="kid-card-teal rounded-3xl p-8 text-center min-h-48 flex flex-col items-center justify-center mb-6">
          <div className="text-7xl mb-4">{slide.emoji}</div>
          <h3 className="text-2xl font-display font-extrabold mb-3">
            {slide.title}
          </h3>
          <p className="text-white/90 text-base leading-relaxed max-w-md">
            {slide.content}
          </p>
        </div>
        <button
          type="button"
          className="btn-orange w-full text-base"
          onClick={handleNextSlide}
        >
          {slideIndex < slides.length - 1 ? "Next Slide →" : "Start Quiz! 🎯"}
        </button>
      </motion.div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-xl font-bold mb-2">Task Complete!</h3>
        <button
          type="button"
          className="btn-teal"
          onClick={() => onComplete(Number(task.pointsReward))}
        >
          Claim Points!
        </button>
      </div>
    );
  }

  const q = questions[questionIndex];
  return (
    <motion.div
      key={questionIndex}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back
        </button>
        <span className="text-sm text-muted-foreground">
          Question {questionIndex + 1}/{questions.length}
        </span>
      </div>
      <Progress
        value={((questionIndex + 1) / questions.length) * 100}
        className="mb-6"
      />

      <div className="bg-secondary/50 rounded-3xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-5 h-5 text-primary" />
          <span className="text-sm font-semibold text-primary">
            +{Number(q.points)} pts
          </span>
        </div>
        <h3 className="text-lg font-display font-bold text-foreground">
          {q.questionText}
        </h3>
      </div>

      <div className="space-y-3 mb-6">
        {q.options.map((opt, i) => (
          <button
            type="button"
            key={opt}
            onClick={() => handleSelectOption(i)}
            className={`w-full text-left p-4 rounded-2xl border-2 font-medium transition-all ${
              selectedOption === i
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-white hover:border-primary/50"
            }`}
          >
            <span className="inline-block w-7 h-7 rounded-full bg-muted text-center leading-7 text-sm font-bold mr-3">
              {String.fromCharCode(65 + i)}
            </span>
            {opt}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="btn-orange w-full text-base disabled:opacity-50"
        disabled={selectedOption === null || submitAnswers.isPending}
        onClick={handleNextQuestion}
        data-ocid="tasks.submit_button"
      >
        {submitAnswers.isPending
          ? "Submitting..."
          : questionIndex < questions.length - 1
            ? "Next Question →"
            : "Finish! 🎉"}
      </button>
    </motion.div>
  );
}

interface TasksTabProps {
  kidName: string;
}

export function TasksTab({ kidName }: TasksTabProps) {
  const { data: tasks = [], isLoading } = useGetAllTasks();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showMeeting, setShowMeeting] = useState(false);
  const [meetingPoints, setMeetingPoints] = useState(0);

  const handleTaskComplete = (points: number) => {
    setMeetingPoints(points);
    setActiveTask(null);
    setShowMeeting(true);
  };

  if (activeTask) {
    return (
      <div className="max-w-xl mx-auto p-4">
        <TaskPlayer
          task={activeTask}
          kidName={kidName}
          onComplete={handleTaskComplete}
          onBack={() => setActiveTask(null)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-display font-extrabold text-foreground">
          My Tasks 📚
        </h2>
        <p className="text-muted-foreground">
          Complete tasks to earn credit points!
        </p>
      </div>

      {isLoading && (
        <div data-ocid="tasks.loading_state" className="text-center py-16">
          <div className="text-5xl mb-4 bounce-soft">📚</div>
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      )}

      {!isLoading && tasks.length === 0 && (
        <div data-ocid="tasks.empty_state" className="text-center py-16">
          <div className="text-5xl mb-4">🎉</div>
          <p className="text-lg font-bold">Tasks are being set up for you!</p>
          <p className="text-muted-foreground">Check back in a moment.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tasks.map((task, idx) => {
          const diff = difficultyLabel(task.difficulty);
          const isQuiz = task.taskType === "quiz";
          return (
            <motion.div
              key={String(task.id)}
              data-ocid={`tasks.item.${idx + 1}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              className="bg-white rounded-3xl p-5 shadow-card border border-border hover:shadow-float transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${isQuiz ? "bg-secondary" : "bg-accent/10"}`}
                >
                  {isQuiz ? "🧩" : "📊"}
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${diff.color}`}
                >
                  {diff.label}
                </span>
              </div>
              <h3 className="font-display font-extrabold text-lg mb-1">
                {task.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {task.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-kidbiz-yellow">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-sm">
                    {Number(task.pointsReward)} pts
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-teal text-sm py-2 px-4"
                  onClick={() => setActiveTask(task)}
                  data-ocid={`tasks.edit_button.${idx + 1}`}
                >
                  Start <ChevronRight className="w-4 h-4 inline" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AiMeetingModal
        open={showMeeting}
        onClose={() => setShowMeeting(false)}
        kidName={kidName}
        pointsEarned={meetingPoints}
        taskTitle={"the task"}
      />
    </div>
  );
}
