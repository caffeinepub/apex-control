import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Brain, ChevronRight, Loader2, RefreshCw, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Task } from "../backend.d";
import {
  useEarnCredits,
  useGetAllTasks,
  useLogAiSession,
  useSubmitTaskAnswers,
} from "../hooks/useQueries";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface LocalQuestion {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  points: number;
}

interface BankTask {
  id: number;
  title: string;
  description: string;
  taskType: "quiz" | "presentation";
  pointsReward: number;
  difficulty: 1 | 2 | 3;
  questions: LocalQuestion[];
}

// ---------------------------------------------------------------------------
// Featured PowerPoint Task
// ---------------------------------------------------------------------------
const POWERPOINT_TASK: BankTask = {
  id: 999,
  title: "Create a Business Presentation",
  description:
    "Make a PowerPoint or Google Slides presentation on a business topic and share it with KidBiz Academy for review!",
  taskType: "presentation",
  pointsReward: 500,
  difficulty: 2,
  questions: [],
};

const POWERPOINT_SLIDES = [
  {
    emoji: "🎯",
    title: "What Makes a Great Presentation?",
    content:
      "A great business presentation tells a story! It has a clear beginning, middle, and end. Every slide should have ONE main idea.",
  },
  {
    emoji: "🎨",
    title: "Design Matters",
    content:
      "Use bold colors and big fonts. Keep backgrounds clean. Only 3-4 bullet points per slide. Add pictures and icons to make ideas visual!",
  },
  {
    emoji: "💡",
    title: "Choose a Great Topic",
    content:
      "Pick a topic you know! Ideas: My Business Idea, How to Save Money, Why Teamwork Wins, or My Dream Company. Be specific!",
  },
  {
    emoji: "📊",
    title: "Use Data & Facts",
    content:
      "Numbers make you look smart! Add a chart or graph. Example: 'Kids who save ₹10/day will have ₹3,650 in a year!' Wow!",
  },
  {
    emoji: "🚀",
    title: "Your Turn!",
    content:
      "Now create your PowerPoint or Google Slides presentation! Save it and share the Google Drive link with KidBiz Academy to earn 500 points!",
  },
];

// ---------------------------------------------------------------------------
// Huge Task Bank (50+ tasks)
// ---------------------------------------------------------------------------
const TASK_BANK: BankTask[] = [
  // MATH
  {
    id: 1001,
    title: "Money Math Challenge",
    description:
      "Solve real-world money problems using addition and subtraction.",
    taskType: "quiz",
    pointsReward: 100,
    difficulty: 1,
    questions: [
      {
        questionText: "You have ₹50 and spend ₹23. How much do you have left?",
        options: ["₹27", "₹37", "₹17", "₹33"],
        correctAnswerIndex: 0,
        points: 25,
      },
      {
        questionText:
          "If you earn ₹200 doing chores and save ₹80, how much do you spend?",
        options: ["₹100", "₹120", "₹80", "₹140"],
        correctAnswerIndex: 1,
        points: 25,
      },
      {
        questionText: "A book costs ₹75. You buy 2 books. Total cost?",
        options: ["₹125", "₹150", "₹175", "₹200"],
        correctAnswerIndex: 1,
        points: 25,
      },
      {
        questionText: "What is 15% of ₹1000?",
        options: ["₹100", "₹150", "₹200", "₹250"],
        correctAnswerIndex: 1,
        points: 25,
      },
    ],
  },
  {
    id: 1002,
    title: "Multiplication Magic",
    description: "Sharpen your multiplication skills with fun challenges!",
    taskType: "quiz",
    pointsReward: 80,
    difficulty: 1,
    questions: [
      {
        questionText: "What is 9 × 8?",
        options: ["63", "72", "81", "64"],
        correctAnswerIndex: 1,
        points: 20,
      },
      {
        questionText: "What is 12 × 12?",
        options: ["120", "132", "144", "156"],
        correctAnswerIndex: 2,
        points: 20,
      },
      {
        questionText: "What is 7 × 6?",
        options: ["36", "42", "48", "54"],
        correctAnswerIndex: 1,
        points: 20,
      },
      {
        questionText: "What is 15 × 4?",
        options: ["45", "50", "55", "60"],
        correctAnswerIndex: 3,
        points: 20,
      },
    ],
  },
  {
    id: 1003,
    title: "Fractions & Percentages",
    description: "Learn how fractions and percentages work in real business!",
    taskType: "quiz",
    pointsReward: 120,
    difficulty: 2,
    questions: [
      {
        questionText: "What is 1/4 as a percentage?",
        options: ["20%", "25%", "30%", "40%"],
        correctAnswerIndex: 1,
        points: 30,
      },
      {
        questionText:
          "A shirt costs ₹500 and has a 20% discount. What is the discount amount?",
        options: ["₹80", "₹100", "₹120", "₹150"],
        correctAnswerIndex: 1,
        points: 30,
      },
      {
        questionText: "What is 3/4 of 200?",
        options: ["100", "125", "150", "175"],
        correctAnswerIndex: 2,
        points: 30,
      },
      {
        questionText:
          "If 40% of students like football, and there are 50 students, how many like football?",
        options: ["15", "20", "25", "30"],
        correctAnswerIndex: 1,
        points: 30,
      },
    ],
  },
  // SCIENCE
  {
    id: 1010,
    title: "Solar System Explorer",
    description: "Test your knowledge about planets, stars and space!",
    taskType: "quiz",
    pointsReward: 90,
    difficulty: 1,
    questions: [
      {
        questionText: "Which planet is closest to the Sun?",
        options: ["Venus", "Earth", "Mercury", "Mars"],
        correctAnswerIndex: 2,
        points: 22,
      },
      {
        questionText: "How many planets are in our solar system?",
        options: ["7", "8", "9", "10"],
        correctAnswerIndex: 1,
        points: 23,
      },
      {
        questionText: "What is the biggest planet?",
        options: ["Saturn", "Neptune", "Jupiter", "Uranus"],
        correctAnswerIndex: 2,
        points: 22,
      },
      {
        questionText: "The Sun is a:",
        options: ["Planet", "Moon", "Star", "Comet"],
        correctAnswerIndex: 2,
        points: 23,
      },
    ],
  },
  {
    id: 1011,
    title: "Human Body Basics",
    description: "Discover how your amazing body works!",
    taskType: "quiz",
    pointsReward: 95,
    difficulty: 1,
    questions: [
      {
        questionText: "Which organ pumps blood through our body?",
        options: ["Lungs", "Liver", "Heart", "Kidney"],
        correctAnswerIndex: 2,
        points: 23,
      },
      {
        questionText: "How many bones are in the adult human body?",
        options: ["106", "186", "206", "256"],
        correctAnswerIndex: 2,
        points: 24,
      },
      {
        questionText: "What do lungs do?",
        options: [
          "Digest food",
          "Filter blood",
          "Help us breathe",
          "Store energy",
        ],
        correctAnswerIndex: 2,
        points: 24,
      },
      {
        questionText: "Which vitamin do we get from sunlight?",
        options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"],
        correctAnswerIndex: 3,
        points: 24,
      },
    ],
  },
  {
    id: 1012,
    title: "Ecology & Environment",
    description: "Why is protecting nature so important for our future?",
    taskType: "quiz",
    pointsReward: 110,
    difficulty: 2,
    questions: [
      {
        questionText: "What does photosynthesis produce?",
        options: ["Carbon Dioxide", "Water", "Oxygen", "Nitrogen"],
        correctAnswerIndex: 2,
        points: 27,
      },
      {
        questionText: "Which gas is mainly responsible for global warming?",
        options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
        correctAnswerIndex: 2,
        points: 28,
      },
      {
        questionText: "The 3 Rs of sustainability are:",
        options: [
          "Read, Recite, Review",
          "Reduce, Reuse, Recycle",
          "Restore, Replace, Renew",
          "Run, Rest, Repeat",
        ],
        correctAnswerIndex: 1,
        points: 27,
      },
      {
        questionText: "Which energy source is renewable?",
        options: ["Coal", "Petrol", "Solar Power", "Natural Gas"],
        correctAnswerIndex: 2,
        points: 28,
      },
    ],
  },
  // BUSINESS
  {
    id: 1020,
    title: "Business Basics 101",
    description: "Learn the key terms every young entrepreneur should know!",
    taskType: "quiz",
    pointsReward: 150,
    difficulty: 2,
    questions: [
      {
        questionText: "What is a 'profit'?",
        options: [
          "Money spent on supplies",
          "Money earned minus money spent",
          "Money borrowed from bank",
          "Tax paid to government",
        ],
        correctAnswerIndex: 1,
        points: 37,
      },
      {
        questionText: "What does CEO stand for?",
        options: [
          "Chief Education Officer",
          "Company Executive Official",
          "Chief Executive Officer",
          "Corporate Enterprise Officer",
        ],
        correctAnswerIndex: 2,
        points: 38,
      },
      {
        questionText:
          "A business that sells lemonade needs to buy lemons. The lemons are called:",
        options: ["Profit", "Revenue", "Expenses", "Investment"],
        correctAnswerIndex: 2,
        points: 37,
      },
      {
        questionText: "What is a 'startup'?",
        options: [
          "A very old company",
          "A government agency",
          "A brand new business",
          "A store that opens early",
        ],
        correctAnswerIndex: 2,
        points: 38,
      },
    ],
  },
  {
    id: 1021,
    title: "Marketing & Branding",
    description:
      "Why do people buy certain brands? Discover the power of marketing!",
    taskType: "quiz",
    pointsReward: 160,
    difficulty: 2,
    questions: [
      {
        questionText: "What is a brand?",
        options: [
          "A type of clothing",
          "A product label",
          "The identity and image of a company",
          "A price tag",
        ],
        correctAnswerIndex: 2,
        points: 40,
      },
      {
        questionText: "Which of these is a marketing strategy?",
        options: [
          "Keeping the product secret",
          "Advertising on social media",
          "Charging very high prices",
          "Selling only to adults",
        ],
        correctAnswerIndex: 1,
        points: 40,
      },
      {
        questionText: "What does 'target audience' mean?",
        options: [
          "People who compete with you",
          "Your investors",
          "The specific group of people you want to sell to",
          "Your employees",
        ],
        correctAnswerIndex: 2,
        points: 40,
      },
      {
        questionText: "A logo helps a brand by:",
        options: [
          "Making products cheaper",
          "Making it recognizable",
          "Reducing taxes",
          "Hiring more staff",
        ],
        correctAnswerIndex: 1,
        points: 40,
      },
    ],
  },
  {
    id: 1022,
    title: "Supply & Demand",
    description: "Understand the forces that drive prices in any market!",
    taskType: "quiz",
    pointsReward: 200,
    difficulty: 3,
    questions: [
      {
        questionText:
          "When demand increases and supply stays the same, price will:",
        options: ["Fall", "Stay the same", "Rise", "Disappear"],
        correctAnswerIndex: 2,
        points: 50,
      },
      {
        questionText: "What does 'supply' mean in business?",
        options: [
          "How much buyers want",
          "How much sellers offer",
          "The price of goods",
          "The shipping cost",
        ],
        correctAnswerIndex: 1,
        points: 50,
      },
      {
        questionText:
          "If many shops sell the same toy, the price will usually:",
        options: ["Go up", "Go down", "Double", "Stay the same always"],
        correctAnswerIndex: 1,
        points: 50,
      },
      {
        questionText: "What is a 'market'?",
        options: [
          "Only a physical store",
          "A place (real or virtual) where buyers and sellers meet",
          "A government building",
          "A bank",
        ],
        correctAnswerIndex: 1,
        points: 50,
      },
    ],
  },
  // ENGLISH
  {
    id: 1030,
    title: "Grammar Power!",
    description:
      "Master nouns, verbs, and adjectives to communicate like a pro!",
    taskType: "quiz",
    pointsReward: 75,
    difficulty: 1,
    questions: [
      {
        questionText: "Which word is a noun?",
        options: ["Run", "Happy", "School", "Quickly"],
        correctAnswerIndex: 2,
        points: 18,
      },
      {
        questionText: "Which word is a verb?",
        options: ["Beautiful", "Swim", "Chair", "Yellow"],
        correctAnswerIndex: 1,
        points: 19,
      },
      {
        questionText: "Which word is an adjective?",
        options: ["Sing", "Mountain", "Bright", "Slowly"],
        correctAnswerIndex: 2,
        points: 19,
      },
      {
        questionText: "Correct sentence: ",
        options: [
          "She go to school",
          "She goes to school",
          "Her go school",
          "She gone school",
        ],
        correctAnswerIndex: 1,
        points: 19,
      },
    ],
  },
  {
    id: 1031,
    title: "Vocabulary Builder",
    description: "Expand your English vocabulary with powerful business words!",
    taskType: "quiz",
    pointsReward: 90,
    difficulty: 1,
    questions: [
      {
        questionText: "What does 'negotiate' mean?",
        options: [
          "To drive fast",
          "To discuss to reach an agreement",
          "To calculate numbers",
          "To create something new",
        ],
        correctAnswerIndex: 1,
        points: 22,
      },
      {
        questionText: "What does 'revenue' mean?",
        options: [
          "A type of tax",
          "Money earned by a business",
          "A business expense",
          "A type of loan",
        ],
        correctAnswerIndex: 1,
        points: 23,
      },
      {
        questionText: "What does 'innovative' mean?",
        options: [
          "Very old",
          "Introducing new ideas",
          "Very expensive",
          "Hard to understand",
        ],
        correctAnswerIndex: 1,
        points: 22,
      },
      {
        questionText: "What does 'collaborate' mean?",
        options: [
          "To work alone",
          "To celebrate",
          "To work together",
          "To argue",
        ],
        correctAnswerIndex: 2,
        points: 23,
      },
    ],
  },
  {
    id: 1032,
    title: "Reading Comprehension",
    description: "Read a short business story and answer questions about it!",
    taskType: "quiz",
    pointsReward: 130,
    difficulty: 2,
    questions: [
      {
        questionText:
          "Priya started a lemonade stand. She bought lemons for ₹30 and sold lemonade for ₹100. What was her profit?",
        options: ["₹30", "₹70", "₹100", "₹130"],
        correctAnswerIndex: 1,
        points: 32,
      },
      {
        questionText:
          "Arjun wrote a business plan before starting his shop. Why is a business plan important?",
        options: [
          "It is just for decoration",
          "Banks require it",
          "It guides decisions and planning",
          "It replaces money",
        ],
        correctAnswerIndex: 2,
        points: 33,
      },
      {
        questionText: "A company's 'mission statement' describes:",
        options: [
          "Its product prices",
          "Its purpose and goals",
          "Its employee list",
          "Its office address",
        ],
        correctAnswerIndex: 1,
        points: 32,
      },
      {
        questionText: "What is 'customer satisfaction'?",
        options: [
          "When a customer gets a refund",
          "When a customer is happy with a product or service",
          "When a customer buys twice",
          "When a customer leaves a review",
        ],
        correctAnswerIndex: 1,
        points: 33,
      },
    ],
  },
  // LIFE SKILLS
  {
    id: 1040,
    title: "Time Management Pro",
    description: "Learn how to manage your day for maximum productivity!",
    taskType: "quiz",
    pointsReward: 110,
    difficulty: 2,
    questions: [
      {
        questionText: "What is the best way to start your day?",
        options: [
          "Check social media first",
          "Make a to-do list",
          "Watch TV",
          "Play video games",
        ],
        correctAnswerIndex: 1,
        points: 27,
      },
      {
        questionText: "Procrastination means:",
        options: [
          "Working very fast",
          "Delaying tasks unnecessarily",
          "Helping others",
          "Planning carefully",
        ],
        correctAnswerIndex: 1,
        points: 28,
      },
      {
        questionText: "The Pomodoro Technique involves:",
        options: [
          "Eating tomatoes to focus",
          "Working 25 mins, then 5 min break",
          "Working 8 hours non-stop",
          "Meditating before studying",
        ],
        correctAnswerIndex: 1,
        points: 27,
      },
      {
        questionText: "Which task should you do FIRST?",
        options: [
          "The easiest one",
          "The most fun one",
          "The most important and urgent one",
          "The shortest one",
        ],
        correctAnswerIndex: 2,
        points: 28,
      },
    ],
  },
  {
    id: 1041,
    title: "Communication Skills",
    description:
      "How to speak, listen, and write clearly to get what you want!",
    taskType: "quiz",
    pointsReward: 120,
    difficulty: 2,
    questions: [
      {
        questionText: "Active listening means:",
        options: [
          "Listening while doing something else",
          "Fully focusing and understanding the speaker",
          "Interrupting with your thoughts",
          "Nodding without paying attention",
        ],
        correctAnswerIndex: 1,
        points: 30,
      },
      {
        questionText: "Which is an example of good communication?",
        options: [
          "Yelling when angry",
          "Ignoring messages",
          "Being clear and respectful",
          "Assuming people know what you mean",
        ],
        correctAnswerIndex: 2,
        points: 30,
      },
      {
        questionText: "Eye contact during a conversation shows:",
        options: [
          "Aggression",
          "Confidence and respect",
          "Boredom",
          "You are lying",
        ],
        correctAnswerIndex: 1,
        points: 30,
      },
      {
        questionText: "A good email should:",
        options: [
          "Be very long with no structure",
          "Have a clear subject, greeting, and message",
          "Use all caps",
          "Skip the greeting",
        ],
        correctAnswerIndex: 1,
        points: 30,
      },
    ],
  },
  {
    id: 1042,
    title: "Goal Setting Challenge",
    description: "Learn how to set SMART goals and achieve your dreams!",
    taskType: "quiz",
    pointsReward: 140,
    difficulty: 2,
    questions: [
      {
        questionText:
          "SMART goals stand for Specific, Measurable, Achievable, Relevant, and:",
        options: ["Tasty", "Time-bound", "Terrific", "Tactical"],
        correctAnswerIndex: 1,
        points: 35,
      },
      {
        questionText: "Which is a SMART goal?",
        options: [
          "I want to be rich",
          "I will save ₹50 every week for 3 months",
          "I will be happy",
          "I will study more",
        ],
        correctAnswerIndex: 1,
        points: 35,
      },
      {
        questionText: "Breaking a big goal into smaller steps helps you:",
        options: [
          "Forget the goal",
          "Feel overwhelmed",
          "Make steady progress",
          "Give up faster",
        ],
        correctAnswerIndex: 2,
        points: 35,
      },
      {
        questionText: "If you miss a deadline for your goal, you should:",
        options: [
          "Give up completely",
          "Blame others",
          "Review, adjust, and try again",
          "Pretend it never happened",
        ],
        correctAnswerIndex: 2,
        points: 35,
      },
    ],
  },
  // COMPUTER SKILLS
  {
    id: 1050,
    title: "Internet Safety Champion",
    description: "Stay safe online — know the rules of the digital world!",
    taskType: "quiz",
    pointsReward: 130,
    difficulty: 1,
    questions: [
      {
        questionText: "You should never share your password with:",
        options: [
          "Your parents",
          "Your best friend",
          "Anyone online you don't know",
          "Your teacher",
        ],
        correctAnswerIndex: 2,
        points: 32,
      },
      {
        questionText: "Cyberbullying is:",
        options: [
          "Playing multiplayer games",
          "Being mean or cruel online",
          "Sending funny memes",
          "Chatting with friends",
        ],
        correctAnswerIndex: 1,
        points: 33,
      },
      {
        questionText: "A strong password should:",
        options: [
          "Be your name",
          "Be easy to remember and short",
          "Have a mix of letters, numbers and symbols",
          "Be the same for all accounts",
        ],
        correctAnswerIndex: 2,
        points: 32,
      },
      {
        questionText:
          "If a stranger online asks for your home address, you should:",
        options: [
          "Tell them",
          "Ignore and block them",
          "Tell your friend",
          "Give a fake address",
        ],
        correctAnswerIndex: 1,
        points: 33,
      },
    ],
  },
  {
    id: 1051,
    title: "Spreadsheet Skills",
    description:
      "Learn how Excel and Google Sheets help businesses track data!",
    taskType: "quiz",
    pointsReward: 180,
    difficulty: 3,
    questions: [
      {
        questionText: "A cell in a spreadsheet is identified by:",
        options: [
          "Its color",
          "A letter and number (e.g. A1)",
          "Its size",
          "The data inside it",
        ],
        correctAnswerIndex: 1,
        points: 45,
      },
      {
        questionText: "The SUM formula in Excel/Sheets is used to:",
        options: [
          "Multiply numbers",
          "Add up numbers",
          "Find the average",
          "Delete numbers",
        ],
        correctAnswerIndex: 1,
        points: 45,
      },
      {
        questionText: "Charts in spreadsheets help you:",
        options: [
          "Print documents",
          "Visualize data",
          "Write reports",
          "Send emails",
        ],
        correctAnswerIndex: 1,
        points: 45,
      },
      {
        questionText: "A budget in a spreadsheet tracks:",
        options: [
          "Social media posts",
          "Income and expenses",
          "Movie reviews",
          "Homework marks",
        ],
        correctAnswerIndex: 1,
        points: 45,
      },
    ],
  },
  {
    id: 1052,
    title: "Coding Fundamentals",
    description: "Understand the basics of how computers think and code works!",
    taskType: "quiz",
    pointsReward: 200,
    difficulty: 3,
    questions: [
      {
        questionText: "What is an algorithm?",
        options: [
          "A type of computer",
          "A step-by-step set of instructions",
          "A programming language",
          "A keyboard shortcut",
        ],
        correctAnswerIndex: 1,
        points: 50,
      },
      {
        questionText: "Which of these is a programming language?",
        options: ["Microsoft Word", "Google Chrome", "Python", "Zoom"],
        correctAnswerIndex: 2,
        points: 50,
      },
      {
        questionText: "What does a 'loop' do in coding?",
        options: [
          "Deletes the code",
          "Prints a document",
          "Repeats a set of instructions",
          "Saves a file",
        ],
        correctAnswerIndex: 2,
        points: 50,
      },
      {
        questionText: "A 'bug' in coding means:",
        options: [
          "An insect on your keyboard",
          "An error in the program",
          "A virus",
          "A deleted file",
        ],
        correctAnswerIndex: 1,
        points: 50,
      },
    ],
  },
  // FINANCE
  {
    id: 1060,
    title: "Saving & Investing Basics",
    description: "Discover how to make your money grow over time!",
    taskType: "quiz",
    pointsReward: 170,
    difficulty: 2,
    questions: [
      {
        questionText: "Compound interest means:",
        options: [
          "Interest on the loan only",
          "Interest earned on interest plus the original amount",
          "A flat fee for savings",
          "Monthly bank charges",
        ],
        correctAnswerIndex: 1,
        points: 42,
      },
      {
        questionText: "What is a mutual fund?",
        options: [
          "A charity fund",
          "A pool of money from many investors",
          "A government tax",
          "A type of bank account",
        ],
        correctAnswerIndex: 1,
        points: 43,
      },
      {
        questionText: "Why is diversification important in investing?",
        options: [
          "To earn more in one stock",
          "To spread risk across different investments",
          "To avoid paying taxes",
          "To invest in just one company",
        ],
        correctAnswerIndex: 1,
        points: 42,
      },
      {
        questionText: "What is a budget?",
        options: [
          "A wish list",
          "A plan for how to spend and save money",
          "A receipt",
          "A bank statement",
        ],
        correctAnswerIndex: 1,
        points: 43,
      },
    ],
  },
  {
    id: 1061,
    title: "Banking & Paytm Knowledge",
    description: "Learn how digital payments and banking work in India!",
    taskType: "quiz",
    pointsReward: 150,
    difficulty: 2,
    questions: [
      {
        questionText: "UPI stands for:",
        options: [
          "Unified Payment Interface",
          "Universal Payment Internet",
          "United Paytm India",
          "User Payment Index",
        ],
        correctAnswerIndex: 0,
        points: 37,
      },
      {
        questionText: "Paytm is primarily a:",
        options: [
          "Social media app",
          "Digital payments app",
          "Gaming platform",
          "News app",
        ],
        correctAnswerIndex: 1,
        points: 38,
      },
      {
        questionText: "A savings account earns:",
        options: [
          "Zero interest",
          "Interest on deposited money",
          "Only cashback",
          "Credit points",
        ],
        correctAnswerIndex: 1,
        points: 37,
      },
      {
        questionText: "What is a transaction?",
        options: [
          "A type of loan",
          "An exchange of money or goods",
          "A bank penalty",
          "An investment",
        ],
        correctAnswerIndex: 1,
        points: 38,
      },
    ],
  },
  {
    id: 1062,
    title: "Taxes & Money for Kids",
    description: "What are taxes and why do we pay them? A simple guide!",
    taskType: "quiz",
    pointsReward: 180,
    difficulty: 3,
    questions: [
      {
        questionText: "What are taxes used for by the government?",
        options: [
          "Personal expenses of politicians",
          "Building roads, schools and hospitals",
          "Paying credit card bills",
          "Buying stocks",
        ],
        correctAnswerIndex: 1,
        points: 45,
      },
      {
        questionText: "GST stands for:",
        options: [
          "General Savings Tax",
          "Goods and Services Tax",
          "Government School Tax",
          "General Store Tax",
        ],
        correctAnswerIndex: 1,
        points: 45,
      },
      {
        questionText: "Income tax is paid on:",
        options: [
          "Money you spend",
          "Money you save",
          "Money you earn",
          "Money you invest",
        ],
        correctAnswerIndex: 2,
        points: 45,
      },
      {
        questionText: "Which profession helps people with their taxes?",
        options: ["Doctor", "Accountant", "Architect", "Engineer"],
        correctAnswerIndex: 1,
        points: 45,
      },
    ],
  },
  // COMMUNICATION
  {
    id: 1070,
    title: "Public Speaking Superstar",
    description:
      "Overcome stage fright and speak confidently in front of others!",
    taskType: "quiz",
    pointsReward: 160,
    difficulty: 2,
    questions: [
      {
        questionText: "The biggest fear during public speaking is usually:",
        options: [
          "Forgetting the topic",
          "Being judged by the audience",
          "Speaking too slowly",
          "Using a microphone",
        ],
        correctAnswerIndex: 1,
        points: 40,
      },
      {
        questionText: "Good posture while speaking shows:",
        options: ["Tiredness", "Confidence", "Boredom", "Nervousness"],
        correctAnswerIndex: 1,
        points: 40,
      },
      {
        questionText: "Filler words (um, uh, like) should be:",
        options: [
          "Used as much as possible",
          "Replaced with a pause",
          "Spoken faster",
          "Written down",
        ],
        correctAnswerIndex: 1,
        points: 40,
      },
      {
        questionText: "To engage your audience you should:",
        options: [
          "Read from your notes only",
          "Avoid eye contact",
          "Ask questions and use stories",
          "Speak in a monotone voice",
        ],
        correctAnswerIndex: 2,
        points: 40,
      },
    ],
  },
  {
    id: 1071,
    title: "Teamwork & Leadership",
    description:
      "What makes a great leader? Learn the skills to lead any team!",
    taskType: "quiz",
    pointsReward: 175,
    difficulty: 2,
    questions: [
      {
        questionText: "A good leader should:",
        options: [
          "Take all credit",
          "Listen to team members",
          "Make all decisions alone",
          "Blame others for failures",
        ],
        correctAnswerIndex: 1,
        points: 43,
      },
      {
        questionText: "Delegation means:",
        options: [
          "Doing all the work yourself",
          "Assigning tasks to team members",
          "Avoiding responsibility",
          "Arguing with the team",
        ],
        correctAnswerIndex: 1,
        points: 44,
      },
      {
        questionText: "Conflict in a team should be resolved by:",
        options: [
          "Ignoring it",
          "Shouting at each other",
          "Open and respectful discussion",
          "Quitting the team",
        ],
        correctAnswerIndex: 2,
        points: 44,
      },
      {
        questionText: "Which quality is essential for a great team player?",
        options: [
          "Always being right",
          "Taking all the work",
          "Communicating and cooperating",
          "Working in isolation",
        ],
        correctAnswerIndex: 2,
        points: 44,
      },
    ],
  },
  {
    id: 1072,
    title: "Email Writing Pro",
    description: "Write professional emails that get results!",
    taskType: "quiz",
    pointsReward: 140,
    difficulty: 2,
    questions: [
      {
        questionText: "What should ALWAYS be in an email?",
        options: [
          "Lots of emojis",
          "A clear subject line",
          "Attachment",
          "A joke",
        ],
        correctAnswerIndex: 1,
        points: 35,
      },
      {
        questionText: "A professional email greeting is:",
        options: ["Hey!", "Yo", "Dear Mr./Ms. [Name]", "Wassup"],
        correctAnswerIndex: 2,
        points: 35,
      },
      {
        questionText: "Before sending, you should:",
        options: [
          "Press send immediately",
          "Proofread for errors",
          "Delete the subject",
          "Use caps lock throughout",
        ],
        correctAnswerIndex: 1,
        points: 35,
      },
      {
        questionText: "CC in email means:",
        options: [
          "Certified Copy",
          "Carbon Copy (send a copy to another person)",
          "Confidential Content",
          "Cancel Command",
        ],
        correctAnswerIndex: 1,
        points: 35,
      },
    ],
  },
  // EXTRA BONUS TASKS
  {
    id: 1080,
    title: "Entrepreneurship Challenge",
    description:
      "Think like an entrepreneur! Solve business problems creatively.",
    taskType: "quiz",
    pointsReward: 250,
    difficulty: 3,
    questions: [
      {
        questionText: "What is an 'elevator pitch'?",
        options: [
          "A way to fix elevators",
          "A short and powerful summary of your business idea",
          "A type of marketing",
          "A financial report",
        ],
        correctAnswerIndex: 1,
        points: 62,
      },
      {
        questionText: "MVP in startup world means:",
        options: [
          "Most Valuable Player",
          "Minimum Viable Product",
          "Maximum Value Plan",
          "Major Vision Project",
        ],
        correctAnswerIndex: 1,
        points: 63,
      },
      {
        questionText: "Why do most startups fail?",
        options: [
          "Too much profit",
          "Too many employees",
          "Running out of money or no market need",
          "Too many customers",
        ],
        correctAnswerIndex: 2,
        points: 62,
      },
      {
        questionText: "Venture capital is:",
        options: [
          "A savings account",
          "Funding given to startups by investors",
          "A type of bank loan",
          "Government grant",
        ],
        correctAnswerIndex: 1,
        points: 63,
      },
    ],
  },
  {
    id: 1081,
    title: "Social Media for Business",
    description:
      "How do businesses use Instagram, YouTube and WhatsApp to sell?",
    taskType: "quiz",
    pointsReward: 220,
    difficulty: 3,
    questions: [
      {
        questionText: "An 'influencer' in marketing is:",
        options: [
          "A government official",
          "Someone with a large following who promotes products",
          "A bank manager",
          "A CEO",
        ],
        correctAnswerIndex: 1,
        points: 55,
      },
      {
        questionText:
          "The best type of social media content for businesses is:",
        options: [
          "Random personal posts",
          "Valuable, educational, or entertaining content",
          "Daily complaints",
          "Competitor criticism",
        ],
        correctAnswerIndex: 1,
        points: 55,
      },
      {
        questionText: "Engagement on social media includes:",
        options: [
          "Having a big office",
          "Likes, comments, and shares",
          "Printing flyers",
          "TV advertisements",
        ],
        correctAnswerIndex: 1,
        points: 55,
      },
      {
        questionText: "Going 'viral' means:",
        options: [
          "Getting a computer virus",
          "Content spreading rapidly and widely",
          "Having many employees",
          "Selling internationally",
        ],
        correctAnswerIndex: 1,
        points: 55,
      },
    ],
  },
  {
    id: 1082,
    title: "Indian Business Giants",
    description:
      "Learn about India's most inspiring entrepreneurs and companies!",
    taskType: "quiz",
    pointsReward: 170,
    difficulty: 2,
    questions: [
      {
        questionText: "Tata Group was founded by:",
        options: [
          "Mukesh Ambani",
          "Jamsetji Tata",
          "Ratan Tata",
          "Azim Premji",
        ],
        correctAnswerIndex: 1,
        points: 42,
      },
      {
        questionText: "Reliance Industries is associated with which family?",
        options: ["Tata", "Birla", "Ambani", "Premji"],
        correctAnswerIndex: 2,
        points: 43,
      },
      {
        questionText: "Infosys is a company in which sector?",
        options: ["Oil & Gas", "Retail", "IT & Software", "Textiles"],
        correctAnswerIndex: 2,
        points: 42,
      },
      {
        questionText: "Byju's is a company focused on:",
        options: [
          "Food delivery",
          "Online education",
          "Real estate",
          "Fashion",
        ],
        correctAnswerIndex: 1,
        points: 43,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const PAGE_SIZE = 20;

const difficultyLabel = (d: number | bigint) => {
  const num = typeof d === "bigint" ? Number(d) : d;
  if (num <= 1) return { label: "Easy", color: "bg-kidbiz-green text-white" };
  if (num <= 2)
    return { label: "Medium", color: "bg-kidbiz-yellow text-amber-900" };
  return { label: "Hard", color: "bg-kidbiz-orange text-white" };
};

// ---------------------------------------------------------------------------
// AiMeetingModal
// ---------------------------------------------------------------------------
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
    `You're doing fantastic! Consistency is the secret to success, ${kidName}! 🔥`,
    "Remember: the more you learn, the more you earn! KidBiz Academy believes in you! 🚀",
    "Great! Keep exploring the tasks. Each one teaches you real business skills! 📚",
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

// ---------------------------------------------------------------------------
// ShareWorkModal — shown after finishing the PowerPoint task
// ---------------------------------------------------------------------------
interface ShareWorkModalProps {
  open: boolean;
  onContinue: () => void;
}

function ShareWorkModal({ open, onContinue }: ShareWorkModalProps) {
  const [mode, setMode] = useState<"camera" | "link">("camera");
  const [link, setLink] = useState("");
  const [shared, setShared] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch {
      setCameraError(
        "Could not access camera. Please allow camera permission or use the link option.",
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      for (const t of stream.getTracks()) t.stop();
      setStream(null);
    }
  };

  const handleModeChange = (newMode: "camera" | "link") => {
    setMode(newMode);
    if (newMode !== "camera") stopCamera();
    if (newMode === "camera") setCapturedPhoto(null);
  };

  const handleTakePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 360;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setCapturedPhoto(dataUrl);
      stopCamera();
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  const handleShare = () => {
    if (mode === "link") {
      if (!link.trim()) {
        toast.error("Please paste your Google Drive link or file name!");
        return;
      }
    } else {
      if (!capturedPhoto) {
        toast.error("Please take a photo of your presentation first!");
        return;
      }
    }
    stopCamera();
    setShared(true);
  };

  const handleDialogClose = () => {
    if (shared) {
      stopCamera();
      onContinue();
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    if (open && mode === "camera" && !capturedPhoto) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" }, audio: false })
        .then((mediaStream) => {
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.play().catch(() => {});
          }
        })
        .catch(() =>
          setCameraError(
            "Could not access camera. Please allow camera permission or use the link option.",
          ),
        );
    }
    if (!open) {
      setStream((s) => {
        if (s) {
          for (const t of s.getTracks()) t.stop();
        }
        return null;
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent
        data-ocid="share_work.dialog"
        className="max-w-md rounded-3xl p-0 overflow-hidden"
      >
        <div className="bg-gradient-to-br from-kidbiz-teal to-teal-600 p-6 text-center">
          <div className="text-5xl mb-2">📤</div>
          <h2 className="text-2xl font-display font-extrabold text-white">
            Share Your Presentation with KidBiz!
          </h2>
          <p className="text-white/80 text-sm mt-1">
            Share your work so a KidBiz teacher can review it!
          </p>
        </div>
        <div className="p-6">
          {!shared ? (
            <>
              {/* Mode toggle */}
              <div className="flex rounded-xl overflow-hidden border border-border mb-5">
                <button
                  type="button"
                  onClick={() => handleModeChange("camera")}
                  className={`flex-1 py-2 text-sm font-semibold transition-colors ${mode === "camera" ? "bg-kidbiz-teal text-white" : "bg-background text-muted-foreground hover:bg-muted"}`}
                >
                  📸 Take a Photo
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange("link")}
                  className={`flex-1 py-2 text-sm font-semibold transition-colors ${mode === "link" ? "bg-kidbiz-teal text-white" : "bg-background text-muted-foreground hover:bg-muted"}`}
                >
                  🔗 Paste a Link
                </button>
              </div>

              {mode === "camera" && (
                <div className="mb-4">
                  {capturedPhoto ? (
                    <div>
                      <img
                        data-ocid="share_work.captured_photo"
                        src={capturedPhoto}
                        alt="Captured presentation"
                        className="w-full rounded-xl mb-3 object-cover"
                        style={{ aspectRatio: "16/9" }}
                      />
                      <div className="flex gap-2 mb-3">
                        <Button
                          data-ocid="share_work.retake_button"
                          variant="outline"
                          className="flex-1 rounded-xl"
                          onClick={handleRetake}
                        >
                          🔄 Retake
                        </Button>
                        <Button
                          data-ocid="share_work.submit_photo_button"
                          className="flex-1 btn-teal rounded-xl font-bold"
                          onClick={handleShare}
                        >
                          Submit This Photo ✅
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {cameraError ? (
                        <div
                          data-ocid="share_work.camera_preview"
                          className="w-full rounded-xl bg-muted flex flex-col items-center justify-center gap-2 p-6 text-center mb-3"
                          style={{ aspectRatio: "16/9" }}
                        >
                          <span className="text-3xl">📷</span>
                          <p className="text-sm text-muted-foreground">
                            {cameraError}
                          </p>
                        </div>
                      ) : !stream ? (
                        <div
                          data-ocid="share_work.camera_preview"
                          className="w-full rounded-xl bg-muted flex flex-col items-center justify-center gap-2 p-6 text-center mb-3"
                          style={{ aspectRatio: "16/9" }}
                        >
                          <span className="text-3xl">📷</span>
                          <p className="text-sm text-muted-foreground">
                            Camera not started
                          </p>
                          <Button
                            size="sm"
                            className="btn-teal rounded-lg mt-1"
                            onClick={startCamera}
                          >
                            Open Camera
                          </Button>
                        </div>
                      ) : (
                        <video
                          data-ocid="share_work.camera_preview"
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full rounded-xl mb-3 object-cover bg-black"
                          style={{ aspectRatio: "16/9" }}
                          onLoadedMetadata={(e) =>
                            (e.currentTarget as HTMLVideoElement).play()
                          }
                        />
                      )}
                      <canvas ref={canvasRef} className="hidden" />
                      {stream && (
                        <Button
                          data-ocid="share_work.take_photo_button"
                          className="w-full btn-teal rounded-xl py-3 text-base font-bold"
                          onClick={handleTakePhoto}
                        >
                          📸 Take Photo
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {mode === "link" && (
                <>
                  <label
                    htmlFor="share-link-input"
                    className="block text-sm font-semibold text-foreground mb-2"
                  >
                    Paste your Google Drive link or file name
                  </label>
                  <Input
                    id="share-link-input"
                    data-ocid="share_work.input"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="mb-4 rounded-xl"
                  />
                  <Button
                    data-ocid="share_work.submit_button"
                    className="w-full btn-teal rounded-xl py-3 text-base font-bold"
                    onClick={handleShare}
                  >
                    Share with KidBiz Academy 🎓
                  </Button>
                </>
              )}
            </>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-4"
              data-ocid="share_work.success_state"
            >
              <div className="text-5xl mb-3">✅</div>
              <p className="font-bold text-lg text-foreground mb-2">
                Your presentation has been shared!
              </p>
              <p className="text-muted-foreground text-sm mb-6">
                A KidBiz teacher will review it soon and you'll earn your 500
                points!
              </p>
              <Button
                data-ocid="share_work.close_button"
                className="btn-orange w-full rounded-xl py-3 text-base font-bold"
                onClick={onContinue}
              >
                Continue to Growth Meeting 🚀
              </Button>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Backend TaskPlayer (for tasks from the backend)
// ---------------------------------------------------------------------------
interface TaskPlayerProps {
  task: Task;
  kidName: string;
  onComplete: (pointsEarned: number) => void;
  onBack: () => void;
}

const PRESENTATION_SLIDES_DEFAULT = [
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
];

function TaskPlayer({ task, onComplete, onBack }: TaskPlayerProps) {
  const [phase, setPhase] = useState<"slides" | "quiz">(
    task.taskType === "presentation" ? "slides" : "quiz",
  );
  const [slideIndex, setSlideIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<bigint[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const submitAnswers = useSubmitTaskAnswers();

  const slides = PRESENTATION_SLIDES_DEFAULT;
  const questions = task.questions;

  const handleNextSlide = () => {
    if (slideIndex < slides.length - 1) {
      setSlideIndex((s) => s + 1);
    } else {
      setPhase("quiz");
    }
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) return;
    const newAnswers = [...selectedAnswers, BigInt(selectedOption)];
    setSelectedAnswers(newAnswers);
    setSelectedOption(null);
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((q) => q + 1);
    } else {
      submitAnswers.mutate(
        { taskId: task.id, answers: newAnswers },
        {
          onSuccess: () => {
            setShowResult(true);
            setTimeout(() => onComplete(Number(task.pointsReward)), 2000);
          },
          onError: () => toast.error("Failed to submit. Try again!"),
        },
      );
    }
  };

  if (showResult) {
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
            +{Number(task.pointsReward)} points
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
            onClick={() => setSelectedOption(i)}
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

// ---------------------------------------------------------------------------
// LocalTaskPlayer — for TASK_BANK tasks (no backend)
// ---------------------------------------------------------------------------
interface LocalTaskPlayerProps {
  task: BankTask;
  onComplete: (points: number) => void;
  onBack: () => void;
  onShareWork?: () => void; // used for task id 999
}

function LocalTaskPlayer({
  task,
  onComplete,
  onBack,
  onShareWork,
}: LocalTaskPlayerProps) {
  const isPowerPoint = task.id === 999;
  const slides = isPowerPoint ? POWERPOINT_SLIDES : PRESENTATION_SLIDES_DEFAULT;

  const [phase, setPhase] = useState<"slides" | "quiz">(
    task.taskType === "presentation" ? "slides" : "quiz",
  );
  const [slideIndex, setSlideIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const questions = task.questions;

  const handleNextSlide = () => {
    if (slideIndex < slides.length - 1) {
      setSlideIndex((s) => s + 1);
    } else {
      if (isPowerPoint && onShareWork) {
        onShareWork();
      } else if (questions.length > 0) {
        setPhase("quiz");
      } else {
        finish();
      }
    }
  };

  const finish = () => {
    setDone(true);
    setTimeout(() => onComplete(task.pointsReward), 1800);
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) return;
    setSelectedOption(null);
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((q) => q + 1);
    } else {
      finish();
    }
  };

  if (done) {
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
            +{task.pointsReward} points
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
          {slideIndex < slides.length - 1
            ? "Next Slide →"
            : isPowerPoint
              ? "Share My Presentation 📤"
              : questions.length > 0
                ? "Start Quiz! 🎯"
                : "Complete Task! 🏆"}
        </button>
      </motion.div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-xl font-bold mb-2">Task Complete!</h3>
        <button type="button" className="btn-teal" onClick={finish}>
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
            +{q.points} pts
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
            onClick={() => setSelectedOption(i)}
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
        disabled={selectedOption === null}
        onClick={handleNextQuestion}
        data-ocid="tasks.submit_button"
      >
        {questionIndex < questions.length - 1
          ? "Next Question →"
          : "Finish! 🎉"}
      </button>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// TaskCard — shared display for backend Task & BankTask
// ---------------------------------------------------------------------------
interface TaskCardBackend {
  kind: "backend";
  task: Task;
}
interface TaskCardLocal {
  kind: "local";
  task: BankTask;
}
type TaskCardData = TaskCardBackend | TaskCardLocal;

function getTaskCardInfo(card: TaskCardData) {
  if (card.kind === "backend") {
    const t = card.task;
    return {
      id: String(t.id),
      title: t.title,
      description: t.description,
      taskType: t.taskType,
      points: Number(t.pointsReward),
      difficulty: Number(t.difficulty),
      isPowerPoint: false,
    };
  }
  const t = card.task;
  return {
    id: String(t.id),
    title: t.title,
    description: t.description,
    taskType: t.taskType,
    points: t.pointsReward,
    difficulty: t.difficulty,
    isPowerPoint: t.id === 999,
  };
}

// ---------------------------------------------------------------------------
// Main TasksTab
// ---------------------------------------------------------------------------
interface TasksTabProps {
  kidName: string;
}

export function TasksTab({ kidName }: TasksTabProps) {
  const { data: backendTasks = [], isLoading } = useGetAllTasks();
  const earnCredits = useEarnCredits();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // active task state
  const [activeBackend, setActiveBackend] = useState<Task | null>(null);
  const [activeLocal, setActiveLocal] = useState<BankTask | null>(null);

  // meeting state
  const [showMeeting, setShowMeeting] = useState(false);
  const [meetingPoints, setMeetingPoints] = useState(0);
  const [meetingTitle, setMeetingTitle] = useState("");

  // share work modal (for PowerPoint task)
  const [showShareWork, setShowShareWork] = useState(false);
  const [pendingPowerPointComplete, setPendingPowerPointComplete] =
    useState(false);

  // Build merged visible list
  // - PowerPoint featured task is always first
  // - Backend tasks come next
  // - Then TASK_BANK fills the rest (cycling with modulo for infinite)
  const buildCards = (): TaskCardData[] => {
    const cards: TaskCardData[] = [];
    // Featured
    cards.push({ kind: "local", task: POWERPOINT_TASK });
    // Backend tasks
    for (const t of backendTasks) {
      cards.push({ kind: "backend", task: t });
    }
    // Fill remaining from TASK_BANK (cycling)
    const needed = Math.max(0, visibleCount - cards.length);
    for (let i = 0; i < needed; i++) {
      cards.push({ kind: "local", task: TASK_BANK[i % TASK_BANK.length] });
    }
    return cards.slice(0, visibleCount);
  };

  const cards = buildCards();

  const handleBackendComplete = (points: number) => {
    setMeetingPoints(points);
    setMeetingTitle(activeBackend?.title ?? "the task");
    setActiveBackend(null);
    setShowMeeting(true);
  };

  const handleLocalComplete = (task: BankTask, points: number) => {
    earnCredits.mutate(points);
    setMeetingPoints(points);
    setMeetingTitle(task.title);
    setActiveLocal(null);
    setShowMeeting(true);
  };

  const handleLocalShareWork = () => {
    // Pause the local player, show share modal
    setShowShareWork(true);
    setPendingPowerPointComplete(true);
  };

  const handleShareContinue = () => {
    setShowShareWork(false);
    if (pendingPowerPointComplete) {
      setPendingPowerPointComplete(false);
      earnCredits.mutate(500);
      setActiveLocal(null);
      setMeetingPoints(500);
      setMeetingTitle(POWERPOINT_TASK.title);
      setShowMeeting(true);
    }
  };

  // Render active task
  if (activeBackend) {
    return (
      <div className="max-w-xl mx-auto p-4">
        <TaskPlayer
          task={activeBackend}
          kidName={kidName}
          onComplete={handleBackendComplete}
          onBack={() => setActiveBackend(null)}
        />
      </div>
    );
  }

  if (activeLocal) {
    return (
      <div className="max-w-xl mx-auto p-4">
        <LocalTaskPlayer
          task={activeLocal}
          onComplete={(pts) => handleLocalComplete(activeLocal, pts)}
          onBack={() => setActiveLocal(null)}
          onShareWork={
            activeLocal.id === 999 ? handleLocalShareWork : undefined
          }
        />
        <ShareWorkModal open={showShareWork} onContinue={handleShareContinue} />
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
        <div data-ocid="tasks.loading_state" className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-2" />
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card, idx) => {
          const info = getTaskCardInfo(card);
          const diff = difficultyLabel(info.difficulty);
          const isQuiz = info.taskType === "quiz";
          return (
            <motion.div
              key={`${info.id}-${idx}`}
              data-ocid={`tasks.item.${idx + 1}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.04, 0.5) }}
              className={`bg-white rounded-3xl p-5 shadow-card border transition-all group hover:shadow-float ${
                info.isPowerPoint
                  ? "border-kidbiz-teal ring-2 ring-kidbiz-teal/30"
                  : "border-border"
              }`}
            >
              {info.isPowerPoint && (
                <div className="bg-gradient-to-r from-kidbiz-teal to-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                  ⭐ FEATURED · 500 PTS
                </div>
              )}
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                    info.isPowerPoint
                      ? "bg-kidbiz-teal/10"
                      : isQuiz
                        ? "bg-secondary"
                        : "bg-accent/10"
                  }`}
                >
                  {info.isPowerPoint ? "📊" : isQuiz ? "🧩" : "📋"}
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${diff.color}`}
                >
                  {diff.label}
                </span>
              </div>
              <h3 className="font-display font-extrabold text-lg mb-1">
                {info.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {info.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-kidbiz-yellow">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-sm">{info.points} pts</span>
                </div>
                <button
                  type="button"
                  className={`text-sm py-2 px-4 ${info.isPowerPoint ? "btn-orange" : "btn-teal"}`}
                  onClick={() => {
                    if (card.kind === "backend") {
                      setActiveBackend(card.task);
                    } else {
                      setActiveLocal(card.task);
                    }
                  }}
                  data-ocid={`tasks.edit_button.${idx + 1}`}
                >
                  {info.isPowerPoint ? "Create & Share 🚀" : "Start"}{" "}
                  <ChevronRight className="w-4 h-4 inline" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Load More */}
      <div className="text-center mt-8">
        <Button
          data-ocid="tasks.pagination_next"
          variant="outline"
          className="px-8 py-3 rounded-full font-bold border-2 border-kidbiz-teal text-kidbiz-teal hover:bg-kidbiz-teal hover:text-white transition-all"
          onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Load More Tasks
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          Showing {cards.length} tasks · More tasks load infinitely!
        </p>
      </div>

      <AiMeetingModal
        open={showMeeting}
        onClose={() => setShowMeeting(false)}
        kidName={kidName}
        pointsEarned={meetingPoints}
        taskTitle={meetingTitle || "the task"}
      />
    </div>
  );
}
