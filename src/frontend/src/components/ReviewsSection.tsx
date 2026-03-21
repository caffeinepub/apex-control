import { Star } from "lucide-react";
import { motion } from "motion/react";
import { useGetAllReviews } from "../hooks/useQueries";

const SAMPLE_REVIEWS = [
  {
    parentName: "Priya Sharma",
    location: "Mumbai, Maharashtra",
    childName: "Aarav",
    comment:
      "My son Aarav completed 10 tasks in one week and earned ₹500 via Paytm! He is more focused on learning than ever. Best investment for my child's future! 🙌",
    rating: 5,
  },
  {
    parentName: "Rajesh Gupta",
    location: "Delhi, Delhi",
    childName: "Ananya",
    comment:
      "My daughter Ananya loves the quiz tasks! She now knows more about money and business than most adults in our family. KidBiz Academy is truly life-changing! ⭐",
    rating: 5,
  },
  {
    parentName: "Sunita Reddy",
    location: "Bangalore, Karnataka",
    childName: "Rohan",
    comment:
      "Rohan used to waste time on games, now he's earning credit points every day! He converted 1000 points to ₹500 Paytm — he was so proud of himself! 🎉",
    rating: 5,
  },
  {
    parentName: "Kavitha Nair",
    location: "Chennai, Tamil Nadu",
    childName: "Shriya",
    comment:
      "The AI Buddy BUDDY is amazing! My daughter Shriya has video calls with it after finishing tasks. It's like having a personal business coach for kids! 🤖",
    rating: 5,
  },
  {
    parentName: "Mohammed Raza",
    location: "Hyderabad, Telangana",
    childName: "Zara",
    comment:
      "Zara's confidence has skyrocketed since using KidBiz Academy. She even gave a small business presentation to our family! The presentation tasks are brilliant! 💼",
    rating: 5,
  },
  {
    parentName: "Neha Joshi",
    location: "Pune, Maharashtra",
    childName: "Kabir",
    comment:
      "My son Kabir is now a Team Leader rank! He understands concepts like profit, savings, and budgeting better than children twice his age. Wonderful app! 🌟",
    rating: 5,
  },
  {
    parentName: "Arun Kumar Banerjee",
    location: "Kolkata, West Bengal",
    childName: "Ishaan",
    comment:
      "Ishaan completed the Math in Business quiz and scored 100%! He explained percentage calculations to me the next day. I am a very proud parent! 🏅",
    rating: 5,
  },
  {
    parentName: "Pooja Sharma",
    location: "Jaipur, Rajasthan",
    childName: "Diya",
    comment:
      "Diya is already an Employee rank and climbing! The leaderboard keeps her motivated. She checks her rank every morning before school — totally hooked! 🔥",
    rating: 5,
  },
  {
    parentName: "Vikram Patel",
    location: "Ahmedabad, Gujarat",
    childName: "Aryan",
    comment:
      "Aryan learned about UPI, internet safety, and entrepreneurship all in one week! The digital skills quiz is excellent. Highly recommend to all parents! 📱",
    rating: 5,
  },
  {
    parentName: "Meera Srivastava",
    location: "Lucknow, Uttar Pradesh",
    childName: "Riya",
    comment:
      "Riya is only 9 years old but already understands what a budget is and why saving money matters. KidBiz Academy teaches real-world skills in such a fun way! 💡",
    rating: 5,
  },
  {
    parentName: "Deepak Menon",
    location: "Mumbai, Maharashtra",
    childName: "Vivaan",
    comment:
      "Vivaan has reached Manager rank — 2000+ points! He proudly told his school teacher about his KidBiz achievements. The role system is so motivating for kids! 👑",
    rating: 5,
  },
  {
    parentName: "Lakshmi Iyer",
    location: "Bangalore, Karnataka",
    childName: "Krish",
    comment:
      "My son Krish attended the AI meeting after completing Leadership & Communication task. The feedback he received helped him in school the next day! 🎯",
    rating: 5,
  },
  {
    parentName: "Sanjay Singh",
    location: "Delhi, Delhi",
    childName: "Mira",
    comment:
      "Mira's teachers have noticed a huge improvement in her communication skills since she started KidBiz Academy 2 months ago. The best ₹0 investment I've made! 📚",
    rating: 5,
  },
  {
    parentName: "Anita Verma",
    location: "Hyderabad, Telangana",
    childName: "Dev",
    comment:
      "Dev loves that he can earn real money! He's saving his Paytm payouts to buy a gift for his sister. Teaching financial responsibility through fun. 10/10! 💸",
    rating: 5,
  },
  {
    parentName: "Pradeep Bose",
    location: "Kolkata, West Bengal",
    childName: "Tara",
    comment:
      "Tara completed 25 tasks in her first month and earned over ₹1500 via Paytm payouts! She's already thinking about starting her own small business one day! 🚀",
    rating: 5,
  },
  {
    parentName: "Swati Kulkarni",
    location: "Pune, Maharashtra",
    childName: "Nikhil",
    comment:
      "Nikhil is shy but the AI Buddy helped him gain confidence through voice and chat sessions. He now presents in class without hesitation. Transformed our boy! ❤️",
    rating: 5,
  },
  {
    parentName: "Ramesh Chandra",
    location: "Jaipur, Rajasthan",
    childName: "Aditi",
    comment:
      "Aditi earned the Team Leader badge and was over the moon! She put it on her school notebook. The way KidBiz gamifies learning is pure genius! ⭐",
    rating: 5,
  },
  {
    parentName: "Fatima Shaikh",
    location: "Ahmedabad, Gujarat",
    childName: "Zaid",
    comment:
      "Zaid finished the Business Ideas for Kids task and immediately wrote his own 5-point business plan. I couldn't believe a 10-year-old could do that! Incredible! 💼",
    rating: 5,
  },
  {
    parentName: "Geeta Pillai",
    location: "Chennai, Tamil Nadu",
    childName: "Sai",
    comment:
      "Sai is now Senior Manager rank at just 11 years old! The point multipliers make high ranks feel very rewarding. This app is perfectly designed for children! 🏆",
    rating: 5,
  },
  {
    parentName: "Amitabh Saxena",
    location: "Lucknow, Uttar Pradesh",
    childName: "Pari",
    comment:
      "Pari uses KidBiz Academy every evening instead of TV. We've seen her math improve, her vocabulary grow, and her confidence soar. A parent's dream come true! 🌟",
    rating: 5,
  },
];

export function ReviewsSection() {
  const { data: reviews = [] } = useGetAllReviews();

  // Merge backend reviews with sample reviews
  const backendReviews = reviews.slice(0, 3).map((r) => ({
    parentName: r.username,
    location: "India",
    childName: "",
    comment: r.comment,
    rating: Number(r.rating),
  }));

  const displayReviews = [...backendReviews, ...SAMPLE_REVIEWS].slice(0, 20);

  return (
    <section className="py-16 bg-secondary/30" data-ocid="reviews.section">
      <div className="max-w-6xl mx-auto px-4">
        {/* Big badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-3 bg-kidbiz-yellow/20 border-2 border-kidbiz-yellow rounded-2xl px-6 py-3 mb-5">
            <span className="text-3xl">⭐</span>
            <div className="text-left">
              <p className="text-2xl font-display font-extrabold text-amber-800">
                1,000,000+ Five Star Reviews
              </p>
              <p className="text-sm text-amber-700 font-semibold">
                Trusted by families across every state in India
              </p>
            </div>
            <span className="text-3xl">⭐</span>
          </div>

          <h2 className="text-3xl font-display font-extrabold text-foreground">
            What Parents &amp; Kids Are Saying
          </h2>
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className="w-6 h-6 fill-kidbiz-yellow text-kidbiz-yellow"
              />
            ))}
            <span className="font-bold text-lg ml-2">5.0 / 5.0</span>
            <span className="text-muted-foreground ml-1">(1M+ Reviews)</span>
          </div>
        </motion.div>

        {/* Scrollable reviews grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayReviews.map((r, idx) => (
            <motion.div
              key={`${r.parentName}-${idx}`}
              data-ocid={`reviews.item.${idx + 1}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (idx % 8) * 0.06 }}
              className="bg-white rounded-3xl p-5 shadow-card border border-border flex flex-col"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 rounded-full kid-card-teal flex items-center justify-center text-lg font-extrabold flex-shrink-0">
                  {r.parentName[0]}
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold text-sm truncate">
                    {r.parentName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {r.location}
                  </p>
                  <div className="flex gap-0.5 mt-0.5">
                    {Array.from({ length: 5 }, (_, sn) => sn + 1).map(
                      (starNum) => (
                        <Star
                          key={starNum}
                          className="w-3 h-3 fill-kidbiz-yellow text-kidbiz-yellow"
                        />
                      ),
                    )}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {r.comment}
              </p>
              {r.childName && (
                <div className="mt-3 pt-3 border-t border-border">
                  <span className="inline-flex items-center gap-1 bg-secondary rounded-full text-xs font-semibold px-2 py-0.5 text-secondary-foreground">
                    👦 Parent of {r.childName}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-muted-foreground text-sm">
            🇮🇳 Join{" "}
            <span className="font-bold text-foreground">1,000,000+</span> Indian
            families already learning with KidBiz Academy!
          </p>
        </div>
      </div>
    </section>
  );
}
