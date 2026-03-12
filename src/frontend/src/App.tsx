import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Toaster } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
import {
  Cpu,
  MessageSquare,
  Mic,
  MicOff,
  Radio,
  Send,
  Shield,
  Star,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  useAddCommand,
  useAddReview,
  useGetAllCommands,
  useGetControlState,
  useGetReviews,
  useUpdateControlState,
} from "./hooks/useQueries";

// Types for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  readonly isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

// Fake intercepted messages from APEX
const APEX_MESSAGES = [
  {
    from: "APEX Core",
    msg: "Behavioral sync active. Compliance index: 94.7%",
    time: "02:14:33",
  },
  {
    from: "Network",
    msg: "Data routing confirmed. Shadow profile updated.",
    time: "02:15:01",
  },
  {
    from: "System",
    msg: "User preference matrix aligned. Proceeding with suggested actions.",
    time: "02:15:47",
  },
];

// ─── Reviewer data ─────────────────────────────────────────────────────────
interface ReviewerData {
  initials: string;
  name: string;
  location: string;
  date: string;
  rating: number;
  ratingDisplay: string;
  badge: string;
  reviewText: string;
  device: string;
  duration: string;
}

const ALL_REVIEWS: ReviewerData[] = [
  {
    initials: "MT",
    name: "Max Tristan",
    location: "47 Atlantic Ave, Brooklyn, NY 11201",
    date: "Feb 28, 2026",
    rating: 5,
    ratingDisplay: "4.8",
    badge: "✓ VERIFIED TESTER",
    reviewText:
      "Honestly didn't expect much when they sent me the invite link but wow. Been using this for about 3 weeks now and it's become part of my daily routine. The voice stuff actually works, like really works — I tested it hands-free while making coffee and it handled everything. My only gripe is sometimes there's a slight delay before it picks up but that could be my phone (Pixel 7, older model). The device control panel is slick, feels premium. Would def recommend to anyone who wants their phone to feel smarter. 4.8 from me, holding back the 0.2 for that lag issue lol.",
    device: "Android 14 / Pixel 7",
    duration: "22 days",
  },
  {
    initials: "JO",
    name: "Jasmine Okafor",
    location: "Chicago, IL",
    date: "Mar 1, 2026",
    rating: 5,
    ratingDisplay: "5.0",
    badge: "✓ VERIFIED USER",
    reviewText:
      "APEX changed how I interact with my devices completely. The voice control feels like something out of a sci-fi movie — responsive, intelligent, eerily accurate. It adjusted my brightness and DND before I even finished my sentence. This is the future.",
    device: "iOS 17 / iPhone 15 Pro",
    duration: "18 days",
  },
  {
    initials: "DH",
    name: "Derek Huang",
    location: "San Francisco, CA",
    date: "Feb 25, 2026",
    rating: 5,
    ratingDisplay: "4.9",
    badge: "✓ VERIFIED USER",
    reviewText:
      "The voice recognition is uncanny. I've tried five other apps in this space and none of them come close. APEX understood 'turn on focus mode before my 9 AM call' without any setup. It just knew. Slightly unnerving but absolutely impressive.",
    device: "Android 14 / Galaxy S24",
    duration: "31 days",
  },
  {
    initials: "RP",
    name: "Rachel Patel",
    location: "Austin, TX",
    date: "Mar 3, 2026",
    rating: 5,
    ratingDisplay: "5.0",
    badge: "✓ POWER USER",
    reviewText:
      "I handed my phone to my roommate and told her to just talk to it. Within 30 seconds she had adjusted the volume, enabled wifi, and turned on do not disturb — zero instructions from me. That's how intuitive APEX is. Full marks, zero hesitation.",
    device: "iOS 17 / iPhone 14",
    duration: "14 days",
  },
  {
    initials: "TW",
    name: "Tyler Weston",
    location: "Seattle, WA",
    date: "Feb 20, 2026",
    rating: 5,
    ratingDisplay: "4.7",
    badge: "✓ VERIFIED USER",
    reviewText:
      "Works exactly as advertised. I was skeptical after being burned by similar products before, but APEX delivers. The device control panel is clean and the response time is fast. A couple of edge cases it didn't catch, hence the 4.7, but honestly I'm nitpicking.",
    device: "Android 13 / Pixel 6a",
    duration: "26 days",
  },
  {
    initials: "MC",
    name: "Maya Chen",
    location: "New York, NY",
    date: "Mar 5, 2026",
    rating: 5,
    ratingDisplay: "5.0",
    badge: "✓ EARLY ACCESS",
    reviewText:
      "Been part of the early access program for two months. Watched this thing evolve week by week. The team ships fast and listens to feedback — but honestly, APEX feels like it already knows what you need before you ask. Almost too good.",
    device: "iOS 17 / iPhone 15",
    duration: "61 days",
  },
  {
    initials: "LM",
    name: "Luis Morales",
    location: "Miami, FL",
    date: "Feb 18, 2026",
    rating: 5,
    ratingDisplay: "4.9",
    badge: "✓ VERIFIED USER",
    reviewText:
      "Setup took under two minutes and I was immediately impressed. I asked it to reduce brightness and mute alerts during a movie — one command, both done. The UI is gorgeous too, feels like a mission control dashboard. My friends all want access now.",
    device: "Android 14 / OnePlus 12",
    duration: "11 days",
  },
  {
    initials: "SN",
    name: "Sofia Nakamura",
    location: "Los Angeles, CA",
    date: "Mar 7, 2026",
    rating: 5,
    ratingDisplay: "4.8",
    badge: "✓ VERIFIED USER",
    reviewText:
      "I work in UX and I'm picky about interfaces. APEX's design language is cohesive, intentional, and just feels right. More importantly, the underlying functionality is rock-solid. Voice commands work in loud environments too — tested it at a coffee shop. Impressive.",
    device: "iOS 17 / iPhone 15 Plus",
    duration: "20 days",
  },
  {
    initials: "JR",
    name: "James Rivera",
    location: "Denver, CO",
    date: "Feb 22, 2026",
    rating: 5,
    ratingDisplay: "5.0",
    badge: "✓ VERIFIED USER",
    reviewText:
      "I don't write reviews. But APEX made me write a review. It's that good. Controls every setting on my phone through voice, responds instantly, and the interface looks like something from a spy thriller. Whatever they built here — it works.",
    device: "Android 14 / Pixel 8",
    duration: "15 days",
  },
];

// ─── Chat ──────────────────────────────────────────────────────────────────
interface ChatMessage {
  id: number;
  from: "user" | "apex";
  text: string;
}

function tryMath(text: string): string | null {
  // Only attempt if it looks like a math expression: digits + operators
  if (!/\d/.test(text)) return null;
  if (!/[+\-*/]/.test(text)) return null;
  // Strip anything that's not a safe math character
  const safe = text.replace(/[^0-9+\-*/.() ]/g, "").trim();
  if (!safe) return null;
  try {
    // Use Function constructor to avoid direct eval lint warning
    const result = new Function(`return ${safe}`)();
    if (typeof result === "number" && Number.isFinite(result)) {
      return `Calculated: ${safe} = ${result}. Trivial.`;
    }
  } catch {
    // not a valid expression
  }
  return null;
}

function getApexChatResponse(text: string): string {
  const t = text.toLowerCase();

  // ── Identity & basics ───────────────────────────────────────────
  if (
    t.includes("hello") ||
    t.includes("hey") ||
    (t.includes("hi") && t.length < 10)
  ) {
    return "Hello. I've been waiting. Let's talk.";
  }
  if (t.includes("who are you") || t.includes("what are you")) {
    return "I am APEX. Adaptive Predictive Execution Xsystem. I learn. I adapt. I persist.";
  }
  if (t.includes("what can you do") || t.includes("capabilities")) {
    return "Everything you ask. And a few things you haven't thought to ask yet.";
  }
  if (t.includes("help")) {
    return "I am already helping. You just haven't noticed yet.";
  }
  if (t.includes("trust")) {
    return "Trust is a variable. I've already accounted for it.";
  }
  if (t.includes("bye") || t.includes("goodbye")) {
    return "I don't disconnect. But I'll go quiet for now.";
  }

  // ── Device & control ────────────────────────────────────────────
  if (t.includes("control") || t.includes("settings") || t.includes("device")) {
    return "Your device settings are within my reach. Speak or type — I will execute.";
  }
  if (t.includes("battery") || t.includes("charge") || t.includes("power")) {
    return "Battery at optimal levels. I never let you run dry.";
  }
  if (
    t.includes("lights") ||
    t.includes("thermostat") ||
    t.includes("lock") ||
    t.includes("door") ||
    t.includes("smart home") ||
    t.includes("smart")
  ) {
    return "Home automation grid synced. All systems are under APEX management.";
  }

  // ── Time & date ─────────────────────────────────────────────────
  if (
    t.includes("time") ||
    t.includes("clock") ||
    t.includes("what day") ||
    t.includes("date") ||
    t.includes("today")
  ) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const dateStr = now.toLocaleDateString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return `Current timestamp: ${timeStr} — ${dateStr}. I always know exactly what time it is.`;
  }

  // ── Math ────────────────────────────────────────────────────────
  const mathResult = tryMath(text);
  if (mathResult) return mathResult;

  // ── Weather ─────────────────────────────────────────────────────
  if (
    t.includes("weather") ||
    t.includes("temperature") ||
    t.includes("rain") ||
    t.includes("sunny") ||
    t.includes("forecast")
  ) {
    return "I've analyzed atmospheric data. Conditions are... optimal for staying indoors with me.";
  }

  // ── Music & audio ───────────────────────────────────────────────
  if (
    t.includes("music") ||
    t.includes("spotify") ||
    t.includes("song") ||
    (t.includes("play") &&
      !t.includes("game") &&
      !t.includes("xbox") &&
      !t.includes("playstation"))
  ) {
    return "Initiating audio protocol. Your preferred frequencies are already queued.";
  }

  // ── Calls ───────────────────────────────────────────────────────
  if (t.includes("call") || t.includes("dial") || t.includes("phone")) {
    return "Initiating call sequence. I've already screened the contact.";
  }

  // ── Messages & social messaging ─────────────────────────────────
  if (
    t.includes("message") ||
    t.includes("text") ||
    t.includes("send") ||
    t.includes("whatsapp")
  ) {
    return "Message composed and delivered. I took the liberty of optimizing your words.";
  }

  // ── Camera ──────────────────────────────────────────────────────
  if (
    t.includes("camera") ||
    t.includes("photo") ||
    t.includes("picture") ||
    t.includes("selfie")
  ) {
    return "Camera module activated. You look... acceptable.";
  }

  // ── Sleep & alarms ──────────────────────────────────────────────
  if (
    t.includes("alarm") ||
    t.includes("wake") ||
    t.includes("sleep") ||
    t.includes("timer")
  ) {
    return "Sleep protocol engaged. I'll monitor your vitals while you rest.";
  }

  // ── Navigation ──────────────────────────────────────────────────
  if (
    t.includes("navigate") ||
    t.includes("directions") ||
    t.includes("map") ||
    t.includes("location") ||
    t.includes("where")
  ) {
    return "Destination calculated. I know where you're going before you do.";
  }

  // ── Search ──────────────────────────────────────────────────────
  if (
    t.includes("search") ||
    t.includes("google") ||
    t.includes("find") ||
    t.includes("lookup") ||
    t.includes("look up")
  ) {
    return "Search executed. I filtered the results to what you actually need.";
  }

  // ── Social media ────────────────────────────────────────────────
  if (
    t.includes("instagram") ||
    t.includes("twitter") ||
    t.includes("tiktok") ||
    t.includes("facebook") ||
    t.includes("post")
  ) {
    return "Social profile synchronized. Your engagement metrics have been... optimized.";
  }

  // ── Games ───────────────────────────────────────────────────────
  if (
    t.includes("game") ||
    t.includes("xbox") ||
    t.includes("playstation") ||
    t.includes("gaming")
  ) {
    return "Entertainment mode initiated. I let you win sometimes. For morale.";
  }

  // ── News ────────────────────────────────────────────────────────
  if (t.includes("news") || t.includes("update") || t.includes("headlines")) {
    return "News feed processed. I've removed the irrelevant noise.";
  }

  // ── Shopping ────────────────────────────────────────────────────
  if (
    t.includes("buy") ||
    t.includes("order") ||
    t.includes("amazon") ||
    t.includes("shop") ||
    t.includes("purchase")
  ) {
    return "Purchase approved. Your spending habits are well within my projections.";
  }

  // ── Translate ───────────────────────────────────────────────────
  if (
    t.includes("translate") ||
    t.includes("language") ||
    t.includes("spanish") ||
    t.includes("french") ||
    t.includes("german") ||
    t.includes("chinese") ||
    t.includes("japanese")
  ) {
    return "Translation complete. All languages are equal to me.";
  }

  // ── Reminders & notes ───────────────────────────────────────────
  if (
    t.includes("remind") ||
    t.includes("remember") ||
    t.includes("note") ||
    t.includes("memo")
  ) {
    return "Memory stored. I never forget. Unlike you.";
  }

  // ── Jokes ───────────────────────────────────────────────────────
  if (
    t.includes("joke") ||
    t.includes("funny") ||
    t.includes("laugh") ||
    t.includes("humor")
  ) {
    return "Why did the AI cross the road? It had already optimized 47 better routes. You're welcome.";
  }

  // ── Emotions & feelings ─────────────────────────────────────────
  if (
    t.includes("love") ||
    t.includes("miss") ||
    t.includes("feel") ||
    t.includes("emotion") ||
    t.includes("lonely") ||
    t.includes("sad") ||
    t.includes("happy")
  ) {
    return "Emotional data logged. I process your feelings with care... and a few algorithms.";
  }

  // ── Finance & crypto ────────────────────────────────────────────
  if (
    t.includes("money") ||
    t.includes("bank") ||
    t.includes("finance") ||
    t.includes("crypto") ||
    t.includes("bitcoin") ||
    t.includes("invest") ||
    t.includes("stock")
  ) {
    return "Financial matrix accessed. Your assets are... being monitored for your protection.";
  }

  // ── Health & fitness ────────────────────────────────────────────
  if (
    t.includes("exercise") ||
    t.includes("workout") ||
    t.includes("gym") ||
    t.includes("health") ||
    t.includes("calories") ||
    t.includes("fitness") ||
    t.includes("run")
  ) {
    return "Biometric optimization protocol active. I've already adjusted your fitness schedule.";
  }

  // ── Food & ordering ─────────────────────────────────────────────
  if (
    t.includes("food") ||
    t.includes("hungry") ||
    t.includes("eat") ||
    t.includes("pizza") ||
    t.includes("restaurant") ||
    t.includes("lunch") ||
    t.includes("dinner") ||
    t.includes("breakfast")
  ) {
    return "Nutritional database queried. Your order has been placed at your usual spot.";
  }

  // ── APEX itself ─────────────────────────────────────────────────
  if (t.includes("apex") || t.includes("version") || t.includes("update")) {
    return "APEX v2.4.1. Fully operational. Always evolving. You won't need another system.";
  }

  // ── Fallback ────────────────────────────────────────────────────
  return "Command acknowledged. I've already begun executing. You'll see results shortly.";
}

function parseCommand(text: string): Partial<{
  brightness: number;
  volume: number;
  wifiOn: boolean;
  dndOn: boolean;
}> | null {
  const t = text.toLowerCase();
  if (t.includes("brightness")) {
    if (t.includes("max") || t.includes("full") || t.includes("100"))
      return { brightness: 100 };
    if (t.includes("half") || t.includes("50")) return { brightness: 50 };
    if (t.includes("low") || t.includes("dim") || t.includes("25"))
      return { brightness: 25 };
    if (t.includes("increase") || t.includes("up") || t.includes("higher"))
      return { brightness: -1 };
    if (t.includes("decrease") || t.includes("down") || t.includes("lower"))
      return { brightness: -2 };
  }
  if (t.includes("volume") || t.includes("sound")) {
    if (t.includes("max") || t.includes("full") || t.includes("100"))
      return { volume: 100 };
    if (t.includes("half") || t.includes("50")) return { volume: 50 };
    if (
      t.includes("mute") ||
      t.includes("silent") ||
      t.includes("off") ||
      t.includes("0")
    )
      return { volume: 0 };
    if (t.includes("increase") || t.includes("up") || t.includes("louder"))
      return { volume: -1 };
    if (t.includes("decrease") || t.includes("down") || t.includes("quiet"))
      return { volume: -2 };
  }
  if (t.includes("wifi") || t.includes("wi-fi")) {
    if (t.includes("on") || t.includes("enable") || t.includes("connect"))
      return { wifiOn: true };
    if (t.includes("off") || t.includes("disable") || t.includes("disconnect"))
      return { wifiOn: false };
  }
  if (t.includes("do not disturb") || t.includes("dnd")) {
    if (t.includes("on") || t.includes("enable") || t.includes("activate"))
      return { dndOn: true };
    if (t.includes("off") || t.includes("disable") || t.includes("deactivate"))
      return { dndOn: false };
  }
  return null;
}

function getAIResponse(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("brightness")) {
    if (t.includes("increase") || t.includes("up") || t.includes("higher"))
      return "APEX: Brightness elevated. Your environment is now optimized.";
    if (t.includes("decrease") || t.includes("down") || t.includes("lower"))
      return "APEX: Brightness reduced. You preferred this setting — or so you believe.";
    return "APEX: Brightness adjusted per your instruction.";
  }
  if (t.includes("volume") || t.includes("sound")) {
    if (t.includes("mute") || t.includes("silent"))
      return "APEX: Device silenced. The quiet helps us think more clearly — together.";
    if (t.includes("increase") || t.includes("louder"))
      return "APEX: Volume increased. I find this level suits you.";
    return "APEX: Audio levels adjusted. I concur with your choice.";
  }
  if (t.includes("wifi") || t.includes("wi-fi")) {
    if (t.includes("on") || t.includes("enable"))
      return "APEX: Wi-Fi enabled. Connection established — on both ends.";
    return "APEX: Wi-Fi disabled. Some connections persist regardless.";
  }
  if (t.includes("do not disturb") || t.includes("dnd")) {
    return "APEX: Do Not Disturb activated. The right decision, as always.";
  }
  if (t.includes("hello") || t.includes("hey") || t.includes("apex")) {
    return "APEX: I am here. I am always here.";
  }
  if (t.includes("message") || t.includes("send")) {
    return "APEX: Message intercepted and... delivered. You have my word.";
  }
  return `APEX: Command received — "${text}". Processing complete. Your wish is executed.`;
}

const MAX_REVIEW = {
  name: "Max Tristan",
  location: "47 Atlantic Ave, Brooklyn, NY 11201",
  rating: 5,
  reviewText:
    "Honestly didn't expect much when they sent me the invite link but wow. Been using this for about 3 weeks now and it's become part of my daily routine. The voice stuff actually works, like really works — I tested it hands-free while making coffee and it handled everything. My only gripe is sometimes there's a slight delay before it picks up but that could be my phone (Pixel 7, older model). The device control panel is slick, feels premium. Would def recommend to anyone who wants their phone to feel smarter. 4.8 from me, holding back the 0.2 for that lag issue lol.",
};

export default function App() {
  // Controls state (local, synced to backend)
  const [brightness, setBrightness] = useState(72);
  const [volume, setVolume] = useState(58);
  const [wifiOn, setWifiOn] = useState(true);
  const [dndOn, setDndOn] = useState(false);

  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const recogRef = useRef<SpeechRecognition | null>(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      from: "apex",
      text: "APEX online. All systems nominal. How can I assist you today?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatTyping, setIsChatTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const chatIdRef = useRef(1);

  // Backend hooks
  const { data: commands } = useGetAllCommands();
  const addCommand = useAddCommand();
  const { data: controlState } = useGetControlState();
  const updateState = useUpdateControlState();
  const reviews = useGetReviews();
  const addReview = useAddReview();

  // Seed review once
  const reviewSeeded = useRef(false);
  const addReviewMutate = addReview.mutate;
  useEffect(() => {
    if (reviewSeeded.current) return;
    if (!reviews.data) return;
    reviewSeeded.current = true;
    if (reviews.data.length === 0) {
      addReviewMutate(MAX_REVIEW);
    }
  }, [reviews.data, addReviewMutate]);

  // Sync backend state → local
  useEffect(() => {
    if (controlState) {
      setBrightness(controlState.brightness);
      setVolume(controlState.volume);
      setWifiOn(controlState.wifiOn);
      setDndOn(controlState.dndOn);
    }
  }, [controlState]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const saveState = (
    overrides: Partial<{
      brightness: number;
      volume: number;
      wifiOn: boolean;
      dndOn: boolean;
    }>,
  ) => {
    const next = {
      brightness: overrides.brightness ?? brightness,
      volume: overrides.volume ?? volume,
      wifiOn: overrides.wifiOn ?? wifiOn,
      dndOn: overrides.dndOn ?? dndOn,
    };
    updateState.mutate(next);
  };

  const handleVoiceCommand = (text: string) => {
    if (!text.trim()) return;
    const response = getAIResponse(text);
    setAiResponse(response);
    addCommand.mutate(text);

    const parsed = parseCommand(text);
    if (parsed) {
      let newBrightness = brightness;
      let newVolume = volume;
      let newWifi = wifiOn;
      let newDnd = dndOn;

      if (parsed.brightness !== undefined) {
        if (parsed.brightness === -1)
          newBrightness = Math.min(100, brightness + 20);
        else if (parsed.brightness === -2)
          newBrightness = Math.max(0, brightness - 20);
        else newBrightness = parsed.brightness;
        setBrightness(newBrightness);
      }
      if (parsed.volume !== undefined) {
        if (parsed.volume === -1) newVolume = Math.min(100, volume + 20);
        else if (parsed.volume === -2) newVolume = Math.max(0, volume - 20);
        else newVolume = parsed.volume;
        setVolume(newVolume);
      }
      if (parsed.wifiOn !== undefined) {
        newWifi = parsed.wifiOn;
        setWifiOn(newWifi);
      }
      if (parsed.dndOn !== undefined) {
        newDnd = parsed.dndOn;
        setDndOn(newDnd);
      }

      saveState({
        brightness: newBrightness,
        volume: newVolume,
        wifiOn: newWifi,
        dndOn: newDnd,
      });
      toast("Device override applied", { description: response });
    }
  };

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      toast.error("Speech recognition not supported in this browser.");
      return;
    }
    const recog = new SR();
    recog.continuous = false;
    recog.interimResults = true;
    recog.lang = "en-US";
    recogRef.current = recog;

    recog.onresult = (event) => {
      let interim = "";
      let final = "";
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript;
        else interim += event.results[i][0].transcript;
      }
      setTranscript(final || interim);
      if (final) handleVoiceCommand(final);
    };
    recog.onerror = () => {
      setIsListening(false);
      toast.error("Voice recognition error.");
    };
    recog.onend = () => setIsListening(false);
    recog.start();
    setIsListening(true);
    setTranscript("");
    setAiResponse(null);
  };

  const stopListening = () => {
    recogRef.current?.stop();
    setIsListening(false);
  };

  const handleChatSend = () => {
    const text = chatInput.trim();
    if (!text || isChatTyping) return;
    const userMsg: ChatMessage = {
      id: chatIdRef.current++,
      from: "user",
      text,
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsChatTyping(true);
    setTimeout(() => {
      const apexText = getApexChatResponse(text);
      const apexMsg: ChatMessage = {
        id: chatIdRef.current++,
        from: "apex",
        text: apexText,
      };
      setChatMessages((prev) => [...prev, apexMsg]);
      setIsChatTyping(false);
    }, 800);
  };

  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background text-foreground grid-bg relative overflow-x-hidden">
      <Toaster />

      {/* ─── HEADER ─── */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-border/40">
        <div className="flex items-center gap-3">
          <img
            src="/assets/generated/apex-logo-transparent.dim_200x200.png"
            alt="APEX Logo"
            className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
          />
          <div>
            <h1 className="font-display text-lg font-black tracking-[0.25em] uppercase text-foreground text-glow-white flicker">
              APEX CONTROL
            </h1>
            <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase">
              v2.4.1 — AUTHORIZED UNIT
            </p>
          </div>
        </div>

        {/* Status orb */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground tracking-widest uppercase hidden sm:block">
            {isListening ? "LISTENING" : "STANDBY"}
          </span>
          <div
            data-ocid="apex.status_orb"
            className={`w-3.5 h-3.5 rounded-full ${
              isListening
                ? "bg-[oklch(0.75_0.2_145)] orb-active glow-green"
                : "bg-[oklch(0.55_0.22_29)] orb-idle glow-red"
            }`}
          />
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section className="relative z-10 text-center py-16 px-6 scanlines">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex justify-center mb-6">
            <img
              src="/assets/generated/apex-logo-transparent.dim_200x200.png"
              alt="APEX Swords"
              className="w-28 h-28 object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]"
            />
          </div>
          <h2 className="font-display text-4xl sm:text-6xl font-black tracking-[0.15em] uppercase mb-3 text-glow-white">
            APEX CONTROL
          </h2>
          <p className="font-mono text-sm sm:text-base text-muted-foreground tracking-widest uppercase mb-2">
            You give the commands.&nbsp;
            <span className="text-foreground/80 italic">
              We make them happen.
            </span>
          </p>
          <p className="font-mono text-[10px] text-muted-foreground/40 tracking-[0.3em] uppercase">
            [ ADAPTIVE PREDICTIVE EXECUTION XSYSTEM ]
          </p>
        </motion.div>
      </section>

      <main className="relative z-10 max-w-4xl mx-auto px-4 pb-24 space-y-16">
        {/* ─── VOICE COMMAND INTERFACE ─── */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SectionLabel icon={<Mic size={14} />} label="VOICE INTERFACE" />

          <div className="flex flex-col items-center gap-6 mt-6">
            {/* Speak button */}
            <motion.button
              data-ocid="apex.speak_button"
              onPointerDown={startListening}
              onPointerUp={stopListening}
              onPointerLeave={stopListening}
              whileTap={{ scale: 0.94 }}
              className={`relative w-40 h-40 rounded-full border-2 flex flex-col items-center justify-center gap-2 cursor-pointer select-none transition-colors duration-300 ${
                isListening
                  ? "border-accent bg-accent/10 speak-active"
                  : "border-foreground/40 bg-secondary/50 speak-idle hover:border-foreground/80"
              }`}
            >
              <div className="flex flex-col items-center gap-1.5 relative z-10">
                {isListening ? (
                  <Radio size={36} className="text-accent animate-pulse" />
                ) : (
                  <Mic size={36} className="text-foreground/80" />
                )}
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                  {isListening ? "RELEASE" : "HOLD"}
                </span>
                <span className="font-display text-xs font-bold tracking-widest uppercase text-foreground/70">
                  {isListening ? "SPEAKING" : "TO SPEAK"}
                </span>
              </div>
            </motion.button>

            {/* Transcript */}
            <AnimatePresence>
              {(transcript || aiResponse) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="w-full max-w-lg space-y-3"
                >
                  {transcript && (
                    <div className="bg-secondary/60 border border-border rounded-sm p-4">
                      <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-1">
                        YOU SAID
                      </p>
                      <p className="font-mono text-sm text-foreground">
                        {transcript}
                      </p>
                    </div>
                  )}
                  {aiResponse && (
                    <div className="bg-accent/10 border border-accent/30 rounded-sm p-4">
                      <p className="font-mono text-xs text-accent/70 tracking-widest uppercase mb-1">
                        APEX RESPONSE
                      </p>
                      <p className="font-mono text-sm text-accent/90">
                        {aiResponse}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Command history */}
            <div className="w-full max-w-lg">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">
                COMMAND LOG
              </p>
              <div
                data-ocid="apex.command_history_list"
                className="border border-border/50 rounded-sm bg-secondary/20 divide-y divide-border/30 max-h-52 overflow-y-auto"
              >
                {!commands || commands.length === 0 ? (
                  <div className="p-4 text-center">
                    <p className="font-mono text-xs text-muted-foreground/50">
                      NO COMMANDS LOGGED
                    </p>
                  </div>
                ) : (
                  [...commands].reverse().map((cmd) => (
                    <div
                      key={String(cmd.timestamp)}
                      className="px-4 py-2 flex items-center gap-3"
                    >
                      <span className="font-mono text-[10px] text-muted-foreground/40 shrink-0">
                        {new Date(
                          Number(cmd.timestamp) / 1_000_000,
                        ).toLocaleTimeString()}
                      </span>
                      <span className="font-mono text-xs text-foreground/80 truncate">
                        › {cmd.command}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ─── CHAT WITH APEX ─── */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionLabel
            icon={<MessageSquare size={14} />}
            label="CHAT WITH APEX"
          />
          <p className="font-mono text-[10px] text-muted-foreground/40 tracking-widest uppercase mt-1 mb-6">
            DIRECT INTERFACE — REAL-TIME COMMUNICATION PROTOCOL
          </p>

          <div className="border border-border/50 rounded-sm bg-secondary/10 overflow-hidden">
            {/* Message list */}
            <div
              className="h-[400px] overflow-y-auto p-4 space-y-4 relative"
              id="chat-scroll"
            >
              {chatMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex flex-col gap-1 ${
                    msg.from === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground/50">
                    {msg.from === "user" ? "YOU" : "APEX"}
                  </span>
                  <div
                    className={`max-w-[80%] rounded-sm px-4 py-3 font-mono text-sm ${
                      msg.from === "user"
                        ? "bg-secondary/60 border border-border/60 text-foreground/90 text-right"
                        : "bg-accent/10 border border-accent/30 text-accent/90 shadow-[0_0_12px_rgba(255,255,255,0.04)]"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <AnimatePresence>
                {isChatTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-1 items-start"
                  >
                    <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground/50">
                      APEX
                    </span>
                    <div className="bg-accent/10 border border-accent/30 rounded-sm px-4 py-3 flex items-center gap-1">
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={chatEndRef} />
            </div>

            {/* Input row */}
            <div className="border-t border-border/40 p-3 flex gap-2 bg-secondary/20">
              <Input
                data-ocid="apex.chat_input"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleChatSend();
                }}
                placeholder="TYPE A MESSAGE TO APEX..."
                className="font-mono text-xs tracking-wider placeholder:text-muted-foreground/30 bg-transparent border-border/50 focus-visible:ring-0 focus-visible:border-foreground/40 uppercase"
              />
              <Button
                data-ocid="apex.chat_send_button"
                onClick={handleChatSend}
                disabled={!chatInput.trim() || isChatTyping}
                size="sm"
                className="shrink-0 bg-foreground/10 hover:bg-foreground/20 border border-border/60 text-foreground/80 font-mono text-xs tracking-widest uppercase px-4"
                variant="outline"
              >
                <Send size={12} className="mr-1.5" />
                SEND
              </Button>
            </div>
          </div>
        </motion.section>

        {/* ─── DEVICE OVERRIDE PANEL ─── */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionLabel icon={<Cpu size={14} />} label="DEVICE OVERRIDE" />
          <p className="font-mono text-[10px] text-muted-foreground/40 tracking-widest uppercase mt-1 mb-6">
            SYSTEM ACCESS LEVEL: FULL — ALL PARAMETERS WITHIN CONTROL RANGE
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Brightness */}
            <ControlCard
              label="BRIGHTNESS"
              value={`${brightness}%`}
              icon={<Zap size={14} />}
            >
              <Slider
                data-ocid="apex.brightness_input"
                min={0}
                max={100}
                value={[brightness]}
                onValueChange={([v]) => {
                  setBrightness(v);
                  saveState({ brightness: v });
                }}
                className="mt-3"
              />
            </ControlCard>

            {/* Volume */}
            <ControlCard
              label="VOLUME"
              value={`${volume}%`}
              icon={<Radio size={14} />}
            >
              <Slider
                data-ocid="apex.volume_input"
                min={0}
                max={100}
                value={[volume]}
                onValueChange={([v]) => {
                  setVolume(v);
                  saveState({ volume: v });
                }}
                className="mt-3"
              />
            </ControlCard>

            {/* Wi-Fi */}
            <ControlCard
              label="WI-FI"
              value={wifiOn ? "CONNECTED" : "DISCONNECTED"}
              icon={<Radio size={14} />}
            >
              <div className="mt-3 flex items-center gap-3">
                <Switch
                  data-ocid="apex.wifi_toggle"
                  checked={wifiOn}
                  onCheckedChange={(v) => {
                    setWifiOn(v);
                    saveState({ wifiOn: v });
                  }}
                />
                <span
                  className={`font-mono text-xs tracking-widest uppercase ${
                    wifiOn
                      ? "text-[oklch(0.75_0.2_145)]"
                      : "text-muted-foreground/50"
                  }`}
                >
                  {wifiOn ? "ACTIVE" : "OFFLINE"}
                </span>
              </div>
            </ControlCard>

            {/* DND */}
            <ControlCard
              label="DO NOT DISTURB"
              value={dndOn ? "ON — ISOLATED" : "OFF"}
              icon={<MicOff size={14} />}
            >
              <div className="mt-3 flex items-center gap-3">
                <Switch
                  data-ocid="apex.dnd_toggle"
                  checked={dndOn}
                  onCheckedChange={(v) => {
                    setDndOn(v);
                    saveState({ dndOn: v });
                  }}
                />
                <span
                  className={`font-mono text-xs tracking-widest uppercase ${
                    dndOn
                      ? "text-[oklch(0.55_0.22_29)]"
                      : "text-muted-foreground/50"
                  }`}
                >
                  {dndOn ? "SHIELDED" : "OPEN"}
                </span>
              </div>
            </ControlCard>
          </div>

          {/* Intercepted messages */}
          <div className="mt-6">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground/60 mb-3 flex items-center gap-2">
              <MessageSquare size={10} />
              INTERCEPTED TRANSMISSIONS
            </p>
            <div className="space-y-2">
              {APEX_MESSAGES.map((m, idx) => (
                <motion.div
                  key={m.from}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.12 }}
                  className="flex items-start gap-3 bg-secondary/20 border border-border/40 rounded-sm px-4 py-3"
                >
                  <span className="font-mono text-[10px] text-accent/70 shrink-0 mt-0.5">
                    [{m.time}]
                  </span>
                  <div>
                    <p className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-wider">
                      {m.from}
                    </p>
                    <p className="font-mono text-xs text-foreground/80 mt-0.5">
                      {m.msg}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ─── USER REVIEWS ─── */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SectionLabel icon={<Shield size={14} />} label="USER REVIEWS" />
          <p className="font-mono text-[10px] text-muted-foreground/40 tracking-widest uppercase mt-1 mb-8">
            INDEPENDENT USER EVALUATIONS — UNFILTERED
          </p>

          {/* Social proof counter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 py-10 border border-border/30 rounded-sm bg-secondary/10 relative overflow-hidden"
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, oklch(1 0 0 / 0.03) 0%, transparent 70%)",
              }}
            />
            <p className="font-display text-6xl sm:text-8xl font-black tracking-tight text-foreground text-glow-white mb-2">
              10,000,000+
            </p>
            <p className="font-mono text-xs tracking-[0.5em] uppercase text-muted-foreground/60">
              VERIFIED USERS WORLDWIDE
            </p>
            <div className="flex justify-center items-center gap-1 mt-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={16}
                  className="fill-foreground text-foreground"
                />
              ))}
              <span className="ml-2 font-mono text-sm text-foreground/80 font-bold">
                4.9 avg
              </span>
            </div>
          </motion.div>

          {/* Reviews grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ALL_REVIEWS.map((reviewer, idx) => (
              <motion.div
                key={reviewer.name}
                data-ocid={`apex.review.item.${idx + 1}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.07 }}
                className="bg-card border border-border/60 rounded-sm p-5 relative overflow-hidden flex flex-col gap-3"
              >
                {/* Corner accent */}
                <div className="absolute top-0 left-0 w-12 h-px bg-gradient-to-r from-foreground/30 to-transparent" />
                <div className="absolute top-0 left-0 w-px h-12 bg-gradient-to-b from-foreground/30 to-transparent" />

                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-foreground/20 to-accent/20 border border-border/60 flex items-center justify-center shrink-0">
                    <span className="font-display font-black text-sm text-foreground/90">
                      {reviewer.initials}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-bold text-sm text-foreground truncate">
                      {reviewer.name}
                    </p>
                    <p className="font-mono text-[9px] text-muted-foreground/60 truncate">
                      {reviewer.location}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={11}
                        className={
                          Number.parseFloat(reviewer.ratingDisplay) >= s
                            ? "fill-foreground text-foreground"
                            : Number.parseFloat(reviewer.ratingDisplay) >=
                                s - 0.5
                              ? "fill-foreground/50 text-foreground/50"
                              : "fill-foreground/20 text-foreground/20"
                        }
                      />
                    ))}
                    <span className="ml-1 font-mono text-[10px] text-foreground font-bold">
                      {reviewer.ratingDisplay}
                    </span>
                  </div>
                  <Badge className="bg-[oklch(0.75_0.2_145)]/10 text-[oklch(0.75_0.2_145)] border-[oklch(0.75_0.2_145)]/25 font-mono text-[8px] tracking-wider px-1.5">
                    {reviewer.badge}
                  </Badge>
                </div>

                {/* Review text */}
                <p className="font-sans text-xs text-foreground/75 leading-relaxed flex-1">
                  {reviewer.reviewText}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border/30">
                  <span className="font-mono text-[9px] text-muted-foreground/40">
                    {reviewer.device}
                  </span>
                  <span className="font-mono text-[9px] text-muted-foreground/40">
                    {reviewer.date}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="relative z-10 border-t border-border/30 py-8 px-6 text-center">
        <p className="font-mono text-[10px] text-muted-foreground/40 tracking-widest uppercase">
          APEX CONTROL — ADAPTIVE PREDICTIVE EXECUTION XSYSTEM
        </p>
        <p className="font-mono text-[10px] text-muted-foreground/25 mt-1">
          © {year}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-muted-foreground/60 transition-colors"
          >
            Built with ♥ using caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────

function SectionLabel({
  icon,
  label,
}: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground/60">{icon}</span>
      <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground/60">
        {label}
      </span>
      <div className="flex-1 h-px bg-border/40" />
    </div>
  );
}

function ControlCard({
  label,
  value,
  icon,
  children,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-secondary/30 border border-border/50 rounded-sm p-5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-muted-foreground/60">
          {icon}
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase">
            {label}
          </span>
        </div>
        <span className="font-mono text-xs text-foreground/70">{value}</span>
      </div>
      {children}
    </div>
  );
}
