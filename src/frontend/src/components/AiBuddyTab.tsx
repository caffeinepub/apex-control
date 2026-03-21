import { Mic, Phone, Send, Video } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useLogAiSession } from "../hooks/useQueries";

const GREETINGS = [
  "Hi there! I'm BUDDY, your personal AI learning coach! 🤖 What would you like to talk about today?",
  "Hey champion! 🌟 Ready to level up your learning? I'm here to help!",
];

const AI_RESPONSES: Record<string, string> = {
  default:
    "That's a great question! Keep learning and growing every day. Every small step leads to big success! 🌟",
  money:
    "Money is like a superpower when you understand it! 💰 Earn it by doing tasks, save it wisely, and invest it to make more. You're already on the right path!",
  quiz: "Quizzes are the best way to check what you know! 🧩 Take your time, think carefully, and don't be afraid to be wrong — every mistake teaches you something!",
  points:
    "Your credit points are super valuable! 🪙 Keep completing tasks to earn more. When you have enough, you can convert them to real ₹500 Indian Rupee notes via Paytm!",
  reward:
    "Rewards are waiting for you! 🎁 Check the My Rewards tab to see what you can get with your points. The best one is the Paytm payout!",
  help: "I'm here to help you learn, grow, and earn! 🚀 Ask me anything about tasks, points, rewards, or business skills!",
  study:
    "Study tip: break big tasks into small pieces, take breaks, and reward yourself when done! 📚 You're doing amazing!",
  business:
    "Business is about solving problems for people! 💼 The best businesses help others while making money. You can start learning with our tasks!",
};

function getAiResponse(text: string): string {
  const lower = text.toLowerCase();
  if (
    lower.includes("money") ||
    lower.includes("rupee") ||
    lower.includes("inr")
  )
    return AI_RESPONSES.money;
  if (lower.includes("quiz") || lower.includes("question"))
    return AI_RESPONSES.quiz;
  if (lower.includes("point") || lower.includes("credit"))
    return AI_RESPONSES.points;
  if (
    lower.includes("reward") ||
    lower.includes("paytm") ||
    lower.includes("payout")
  )
    return AI_RESPONSES.reward;
  if (lower.includes("help") || lower.includes("how")) return AI_RESPONSES.help;
  if (
    lower.includes("study") ||
    lower.includes("learn") ||
    lower.includes("task")
  )
    return AI_RESPONSES.study;
  if (
    lower.includes("business") ||
    lower.includes("work") ||
    lower.includes("earn")
  )
    return AI_RESPONSES.business;
  return AI_RESPONSES.default;
}

const QUICK_PROMPTS = [
  "How do I earn more points? 🪙",
  "Tell me about business! 💼",
  "What rewards can I get? 🎁",
  "How does Paytm payout work? 💵",
  "Give me a study tip! 📚",
];

interface Msg {
  id: number;
  from: "ai" | "user";
  text: string;
}

interface AiBuddyTabProps {
  kidName: string;
}

export function AiBuddyTab({ kidName }: AiBuddyTabProps) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 0,
      from: "ai",
      text: GREETINGS[0].replace("there", kidName || "there"),
    },
  ]);
  const msgIdRef = { current: 1 };
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [callMode, setCallMode] = useState<"chat" | "voice" | "video">("chat");
  const [inCall, setInCall] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const logSession = useLogAiSession();

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional scroll trigger
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const uid = msgIdRef.current++;
    setMessages((prev) => [...prev, { id: uid, from: "user", text }]);
    setInput("");
    setIsTyping(true);
    setTimeout(
      () => {
        const reply = getAiResponse(text);
        const aid = msgIdRef.current++;
        setMessages((prev) => [...prev, { id: aid, from: "ai", text: reply }]);
        setIsTyping(false);
        logSession.mutate(
          `Chat session: user asked about "${text.slice(0, 50)}".`,
        );
      },
      1000 + Math.random() * 800,
    );
  };

  const startCall = (mode: "voice" | "video") => {
    setCallMode(mode);
    setInCall(true);
    logSession.mutate(`${mode} call session with ${kidName}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="kid-card-teal rounded-3xl p-4 mb-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-3xl bounce-soft">
          🤖
        </div>
        <div className="flex-1">
          <h2 className="font-display font-extrabold text-xl text-white">
            BUDDY — AI Study Coach
          </h2>
          <p className="text-white/80 text-sm">
            Always here to help you learn & grow!
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
            onClick={() => startCall("voice")}
            data-ocid="ai_buddy.toggle"
            title="Voice Call"
          >
            <Mic className="w-4 h-4 text-white" />
          </button>
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
            onClick={() => startCall("video")}
            data-ocid="ai_buddy.toggle"
            title="Video Call"
          >
            <Video className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Call UI */}
      <AnimatePresence>
        {inCall && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-3xl shadow-card border border-border mb-4 overflow-hidden"
            data-ocid="ai_buddy.modal"
          >
            <div className="kid-card-green p-6 text-center">
              <div className="text-6xl bounce-soft mb-3">🤖</div>
              <p className="text-white font-bold text-lg">
                BUDDY is {callMode === "video" ? "on video" : "on voice call"}{" "}
                with you!
              </p>
              <p className="text-white/80 text-sm mt-1">
                "Hi {kidName}! I'm so proud of your progress! Keep it up! 🌟"
              </p>
              <div className="flex justify-center gap-3 mt-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((b) => (
                    <div
                      key={b}
                      className="w-1 rounded-full bg-white/60 animate-pulse"
                      style={{
                        height: `${8 + b * 6}px`,
                        animationDelay: `${b * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
              <button
                type="button"
                className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2 rounded-full transition-all"
                onClick={() => setInCall(false)}
                data-ocid="ai_buddy.close_button"
              >
                End Call
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick prompts */}
      <div className="flex gap-2 flex-wrap mb-3">
        {QUICK_PROMPTS.map((p) => (
          <button
            type="button"
            key={p}
            onClick={() => sendMessage(p)}
            className="text-xs bg-white border border-border rounded-full px-3 py-1.5 hover:bg-secondary transition-all font-medium"
            data-ocid="ai_buddy.tab"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat */}
      <div className="bg-white rounded-3xl shadow-card border border-border overflow-hidden">
        <div className="h-80 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} items-end gap-2`}
            >
              {msg.from === "ai" && <span className="text-xl">🤖</span>}
              <div
                className={`max-w-[80%] p-3 text-sm leading-relaxed ${
                  msg.from === "ai"
                    ? "ai-bubble text-foreground"
                    : "user-bubble"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex items-end gap-2">
              <span className="text-xl">🤖</span>
              <div className="ai-bubble p-3">
                <div className="flex gap-1">
                  <span
                    className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t p-3 flex gap-2">
          <input
            data-ocid="ai_buddy.input"
            className="flex-1 border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            placeholder="Ask BUDDY anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          />
          <button
            type="button"
            className="btn-teal px-4 text-sm flex items-center gap-1"
            onClick={() => sendMessage(input)}
            data-ocid="ai_buddy.submit_button"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
