import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useGetAllTasks, useSubmitTaskAnswers } from "../hooks/useQueries";

const LESSONS = [
  {
    id: "money",
    title: "💰 Money Basics",
    emoji: "💰",
    color: "kid-card-teal",
    messages: [
      "Hello! I'm Mr. Arjun, your AI Teacher! 👨‍🏫 Today we're learning about **Money Basics**!",
      "Money is a tool we use to buy goods and services. In India, our currency is the **Rupee (₹)**. Did you know there are coins (1, 2, 5, 10) and notes (10, 20, 50, 100, 200, 500)?",
      "**Saving money** means keeping some money aside instead of spending it all. If you earn ₹100 and save ₹20 every week, after 5 weeks you'll have ₹100 saved! 🏦",
      "Great job! You now understand money basics. Remember: Save first, spend wisely! You're ready to complete this lesson! 🌟",
    ],
  },
  {
    id: "entrepreneurship",
    title: "🚀 Entrepreneurship",
    emoji: "🚀",
    color: "kid-card-orange",
    messages: [
      "Welcome back! Today's lesson is **Entrepreneurship** — how to start your own business! 🚀",
      "An **entrepreneur** is someone who creates a business to solve a problem or provide something people need. Famous entrepreneurs include Ratan Tata, Mukesh Ambani, and Sundar Pichai!",
      "Steps to start a business: 1️⃣ Find a problem, 2️⃣ Think of a solution, 3️⃣ Test your idea, 4️⃣ Tell people about it, 5️⃣ Grow! Even kids can start: tutoring, selling crafts, or a lemonade stand!",
      "Amazing work! You're thinking like an entrepreneur now! The world needs more young business stars like you! ⭐",
    ],
  },
  {
    id: "leadership",
    title: "👑 Leadership",
    emoji: "👑",
    color: "kid-card-purple",
    messages: [
      "Great choice! Today we explore **Leadership** — the skill of guiding and inspiring others! 👑",
      "A great leader listens first, then speaks. Leaders like APJ Abdul Kalam and Indira Gandhi showed that true leadership is about **serving others**, not commanding them.",
      "Key leadership skills: ✅ Clear communication, ✅ Teamwork, ✅ Decision-making, ✅ Empathy. Practice by being a good friend and class representative at school!",
      "You have the heart of a leader! Keep practising these skills every day and you'll inspire everyone around you! 🏅",
    ],
  },
  {
    id: "digital",
    title: "💻 Digital Skills",
    emoji: "💻",
    color: "kid-card-green",
    messages: [
      "Tech lesson time! Today: **Digital Skills** — the tools of tomorrow's business world! 💻",
      "Digital skills include using computers, the internet, apps, and staying safe online. In India, over 800 million people use the internet — that's a HUGE opportunity for business!",
      "Important digital tools: 📧 Email for communication, 📊 Spreadsheets for budgets, 🎥 Video calls for meetings, 📱 UPI/Paytm for payments. You're already using digital tools by being here!",
      "Superstar! Digital skills will open so many doors for you. Keep learning and stay safe online! 🌐",
    ],
  },
  {
    id: "math",
    title: "🔢 Math in Business",
    emoji: "🔢",
    color: "kid-card-yellow",
    messages: [
      "Number time! Today's lesson: **Math in Business** — why numbers matter in every business! 🔢",
      "Profit = Revenue − Expenses. If you sell 10 samosas at ₹5 each (revenue = ₹50) and spent ₹30 on ingredients, your profit is ₹20! Maths makes you a smart business person!",
      "Percentages are everywhere in business. 20% discount on ₹500 = ₹100 off, so you pay ₹400. GST (Goods & Services Tax) is a % added to prices in India. Math helps you understand all of this!",
      "Brilliant work! You've mastered business math. Numbers are your superpower now! 🧮✨",
    ],
  },
];

/** Render a message string with **bold** markers as React nodes. */
function BoldMessage({ text }: { text: string }) {
  const parts = text.split("**");
  return (
    <>
      {parts.map((part, j) =>
        j % 2 === 1 ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: static string split, order never changes
          <strong key={j} className="text-kidbiz-teal">
            {part}
          </strong>
        ) : (
          // biome-ignore lint/suspicious/noArrayIndexKey: static string split, order never changes
          <span key={j}>{part}</span>
        ),
      )}
    </>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center px-4 py-3 bg-white rounded-2xl rounded-bl-sm shadow-sm w-fit">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-kidbiz-teal"
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 0.6,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}

function CelebrationBurst() {
  const emojis = ["🎉", "⭐", "🏆", "🎊", "💰", "🌟", "🎯", "🚀"];
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          // biome-ignore lint/suspicious/noArrayIndexKey: purely decorative
          key={i}
          className="absolute text-3xl"
          initial={{
            x: `${Math.random() * 100}vw`,
            y: "100vh",
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            y: "-20vh",
            opacity: 0,
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: 1.5 + Math.random(),
            delay: Math.random() * 0.5,
            ease: "easeOut",
          }}
        >
          {emojis[Math.floor(Math.random() * emojis.length)]}
        </motion.div>
      ))}
    </div>
  );
}

function LessonChat({
  lesson,
  kidName,
  onBack,
  onComplete,
  alreadyDone,
}: {
  lesson: (typeof LESSONS)[0];
  kidName: string;
  onBack: () => void;
  onComplete: (lessonId: string) => void;
  alreadyDone: boolean;
}) {
  const [shownCount, setShownCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [done, setDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const submitAnswers = useSubmitTaskAnswers();
  const { data: tasks = [] } = useGetAllTasks();
  const [celebrating, setCelebrating] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional incremental reveal keyed on shownCount
  useEffect(() => {
    if (shownCount >= lesson.messages.length) {
      setDone(true);
      return;
    }
    setIsTyping(true);
    const delay = shownCount === 0 ? 500 : 1800;
    const timer = setTimeout(() => {
      setIsTyping(false);
      setShownCount((prev) => prev + 1);
    }, delay);
    return () => clearTimeout(timer);
  }, [shownCount]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on any message or typing state change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [shownCount]);

  const handleComplete = async () => {
    const teacherTask = tasks.find((t) => t.title === "AI Teacher Lesson");
    const taskId = teacherTask?.id ?? 1n;
    try {
      await submitAnswers.mutateAsync({ taskId, answers: [] });
    } catch {
      // points shown locally even if backend call fails
    }
    setCelebrating(true);
    onComplete(lesson.id);
    toast.success(`🎉 +500 pts earned! You completed "${lesson.title}"!`, {
      duration: 4000,
    });
    setTimeout(() => setCelebrating(false), 3000);
  };

  const today = new Date().toISOString().slice(0, 10);
  const storageKey = `kidbiz_lesson_${lesson.id}_${today}`;
  const isDoneToday = alreadyDone || !!localStorage.getItem(storageKey);

  return (
    <div className="flex flex-col h-full">
      {celebrating && <CelebrationBurst />}

      {/* Chat header */}
      <div className="flex items-center gap-3 p-4 bg-white border-b border-border sticky top-0 z-10">
        <button
          type="button"
          onClick={onBack}
          className="text-kidbiz-teal font-bold text-lg hover:opacity-70 transition-opacity"
          data-ocid="teacher.lesson.back_button"
        >
          ← Back
        </button>
        <div className="w-10 h-10 rounded-full bg-kidbiz-teal/10 flex items-center justify-center text-2xl">
          👨‍🏫
        </div>
        <div>
          <p className="font-display font-extrabold text-kidbiz-teal">
            Mr. Arjun
          </p>
          <p className="text-xs text-muted-foreground">{lesson.title}</p>
        </div>
        {isDoneToday && (
          <Badge className="ml-auto bg-green-100 text-green-700 border-0">
            ✅ Completed Today
          </Badge>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 pb-4">
          {/* Kid bubble intro */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex justify-end"
          >
            <div className="bg-kidbiz-orange text-white rounded-2xl rounded-br-sm px-4 py-2.5 max-w-xs text-sm font-medium shadow-sm">
              Hi Mr. Arjun! I want to learn about {lesson.emoji} today!
            </div>
          </motion.div>

          {/* Mr. Arjun messages */}
          {lesson.messages.slice(0, shownCount).map((msg, i) => (
            <motion.div
              // biome-ignore lint/suspicious/noArrayIndexKey: order is fixed
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-end gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-kidbiz-teal/10 flex items-center justify-center text-lg flex-shrink-0">
                👨‍🏫
              </div>
              <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 max-w-sm shadow-sm text-sm leading-relaxed">
                <BoldMessage text={msg} />
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-end gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-kidbiz-teal/10 flex items-center justify-center text-lg flex-shrink-0">
                  👨‍🏫
                </div>
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Complete button */}
          <AnimatePresence>
            {done && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex justify-center pt-4"
              >
                {isDoneToday ? (
                  <div className="text-center">
                    <div className="text-4xl mb-2">✅</div>
                    <p className="font-display font-bold text-green-600">
                      Lesson completed today!
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Come back tomorrow to earn more points.
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn-orange text-lg px-8 py-4 shadow-float bounce-soft"
                    onClick={handleComplete}
                    disabled={submitAnswers.isPending}
                    data-ocid="teacher.lesson.submit_button"
                  >
                    {submitAnswers.isPending
                      ? "Saving... ⏳"
                      : "Complete Lesson & Earn 500 pts 🎉"}
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Kid name tag */}
      <div className="p-3 border-t bg-secondary/30 text-center">
        <p className="text-xs text-muted-foreground">
          Learning as{" "}
          <span className="font-bold text-kidbiz-teal">{kidName}</span>
        </p>
      </div>
    </div>
  );
}

export function AiTeacherTab({ kidName }: { kidName: string }) {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [completedToday, setCompletedToday] = useState<Set<string>>(() => {
    const today = new Date().toISOString().slice(0, 10);
    const completed = new Set<string>();
    for (const lesson of LESSONS) {
      if (localStorage.getItem(`kidbiz_lesson_${lesson.id}_${today}`)) {
        completed.add(lesson.id);
      }
    }
    return completed;
  });

  const handleComplete = (lessonId: string) => {
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem(`kidbiz_lesson_${lessonId}_${today}`, "1");
    setCompletedToday((prev) => new Set([...prev, lessonId]));
  };

  const currentLesson = LESSONS.find((l) => l.id === selectedLesson);

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 min-h-[80vh] flex flex-col">
      <AnimatePresence mode="wait">
        {currentLesson ? (
          <motion.div
            key="chat"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="flex-1 flex flex-col bg-secondary/30 rounded-3xl overflow-hidden border border-border"
            style={{ minHeight: "70vh" }}
          >
            <LessonChat
              lesson={currentLesson}
              kidName={kidName}
              onBack={() => setSelectedLesson(null)}
              onComplete={handleComplete}
              alreadyDone={completedToday.has(currentLesson.id)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-24 h-24 rounded-full bg-kidbiz-teal/10 flex items-center justify-center text-6xl mx-auto mb-4"
              >
                👨‍🏫
              </motion.div>
              <h1 className="text-3xl font-display font-extrabold text-kidbiz-teal mb-2">
                Meet Mr. Arjun!
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your personal AI Teacher! Complete any lesson to earn{" "}
                <span className="font-bold text-kidbiz-orange">500 points</span>
                . Each lesson is available once per day.
              </p>
            </div>

            {/* Stats row */}
            <div className="flex justify-center gap-4 mb-8">
              <div className="bg-white rounded-2xl px-5 py-3 shadow-sm text-center">
                <p className="text-2xl font-extrabold text-kidbiz-teal">
                  {completedToday.size}
                </p>
                <p className="text-xs text-muted-foreground">Done Today</p>
              </div>
              <div className="bg-white rounded-2xl px-5 py-3 shadow-sm text-center">
                <p className="text-2xl font-extrabold text-kidbiz-orange">
                  {completedToday.size * 500}
                </p>
                <p className="text-xs text-muted-foreground">Pts Earned</p>
              </div>
              <div className="bg-white rounded-2xl px-5 py-3 shadow-sm text-center">
                <p className="text-2xl font-extrabold text-kidbiz-teal">
                  {LESSONS.length - completedToday.size}
                </p>
                <p className="text-xs text-muted-foreground">Available</p>
              </div>
            </div>

            {/* Lesson cards */}
            <div className="space-y-3" data-ocid="teacher.list">
              {LESSONS.map((lesson, i) => {
                const isDone = completedToday.has(lesson.id);
                return (
                  <motion.button
                    type="button"
                    key={lesson.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={!isDone ? { scale: 1.02 } : {}}
                    whileTap={!isDone ? { scale: 0.98 } : {}}
                    onClick={() => setSelectedLesson(lesson.id)}
                    data-ocid={`teacher.lesson.item.${i + 1}`}
                    className={`w-full text-left rounded-3xl p-5 flex items-center gap-4 transition-all ${
                      isDone
                        ? "bg-green-50 border-2 border-green-200 opacity-80"
                        : `${lesson.color} hover:shadow-float cursor-pointer`
                    }`}
                  >
                    <div
                      className={`text-4xl flex-shrink-0 ${
                        isDone ? "" : "bounce-soft"
                      }`}
                    >
                      {isDone ? "✅" : lesson.emoji}
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`text-xl font-display font-extrabold ${
                          isDone ? "text-green-700" : "text-white"
                        }`}
                      >
                        {lesson.title}
                      </h3>
                      <p
                        className={`text-sm mt-0.5 ${
                          isDone ? "text-green-600" : "text-white/80"
                        }`}
                      >
                        {isDone
                          ? "Completed today! Come back tomorrow."
                          : "Interactive lesson with Mr. Arjun"}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      {isDone ? (
                        <span className="text-green-600 font-bold text-sm">
                          +500 pts ✓
                        </span>
                      ) : (
                        <div className="rounded-2xl px-3 py-1.5 bg-white/20 text-white font-bold text-sm">
                          +500 pts 🎉
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Info box */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 bg-kidbiz-teal/5 border border-kidbiz-teal/20 rounded-3xl p-5 text-center"
              data-ocid="teacher.info.card"
            >
              <p className="text-sm text-kidbiz-teal font-semibold">
                💡 Each lesson takes about 2 minutes. Mr. Arjun will guide you
                step by step!
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Lessons reset daily at midnight. Up to {LESSONS.length * 500}{" "}
                pts per day!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
