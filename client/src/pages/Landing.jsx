import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import {
  Sparkles, Calendar, TrendingUp, BarChart3, Lightbulb, Link as LinkIcon,
  Smartphone, Zap, Shield, ChevronRight, Star, Hash, Clock, Users,
  PenTool, Palette, Video, Music, MessageSquare, Globe, Image,
  Sun, Moon,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: Math.min(i * 0.04, 0.4), duration: 0.5 },
  }),
};

const orbs = [
  {
    size: 600,
    color: "rgba(34,197,94,0.12)",
    x: ["-10%", "15%", "-5%", "-10%"],
    y: ["10%", "-5%", "20%", "10%"],
    duration: 20,
  },
  {
    size: 500,
    color: "rgba(168,85,247,0.1)",
    x: ["60%", "45%", "70%", "60%"],
    y: ["-10%", "20%", "5%", "-10%"],
    duration: 25,
  },
  {
    size: 400,
    color: "rgba(34,197,94,0.08)",
    x: ["30%", "50%", "20%", "30%"],
    y: ["40%", "25%", "55%", "40%"],
    duration: 18,
  },
];

export default function Landing() {
  const heroRef = useRef(null);
  const ctaRef = useRef(null);
  const { darkMode, toggleDarkMode } = useTheme();
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const { scrollYProgress: ctaProgress } = useScroll({ target: ctaRef, offset: ["start bottom", "end top"] });
  const bgY = useTransform(heroProgress, [0, 1], [0, 100]);
  const bgScale = useTransform(heroProgress, [0, 1], [1, 1.08]);
  const ctaBgY = useTransform(ctaProgress, [0, 1], [0, -60]);
  const ctaBgScale = useTransform(ctaProgress, [0, 1], [1.1, 1]);

  const features = [
    { icon: Sparkles, title: "AI Caption Generator", desc: "Generate viral captions, hooks, and hashtags in seconds based on topic and mood." },
    { icon: Hash, title: "Hashtag Suggestions", desc: "Get relevant, trending hashtags to boost your content reach organically." },
    { icon: Calendar, title: "Content Planner", desc: "Schedule posts visually with a full calendar. Never miss an upload again." },
    { icon: TrendingUp, title: "Trend Tracker", desc: "Save trending sounds, transitions, and formats. Mark used and organize by category." },
    { icon: BarChart3, title: "Analytics Dashboard", desc: "Track followers, views, engagement rate, and find your best posting times." },
    { icon: Lightbulb, title: "Idea Vault", desc: "Save and organize content ideas, scripts, hooks, and transitions by type and status." },
    { icon: LinkIcon, title: "Link-in-Bio", desc: "Your own customizable link page with social buttons. Like Linktree, but yours." },
    { icon: Clock, title: "Post Schedule", desc: "Plan weekly and monthly upload schedules. Set reminders for posting times." },
    { icon: Users, title: "Collab Hub", desc: "Find and manage collaboration partners. Keep track of brand deals and shoutouts." },
    { icon: PenTool, title: "Script Writer", desc: "Write and save video scripts with built-in formatting and timestamp markers." },
    { icon: Palette, title: "Brand Kit", desc: "Store your brand colors, fonts, and aesthetic references all in one place." },
    { icon: Music, title: "Sound Library", desc: "Bookmark trending audio tracks and save them with notes for future videos." },
    { icon: MessageSquare, title: "POV Lines", desc: "Generate engaging point-of-view captions that hook viewers from the first second." },
    { icon: Globe, title: "Multi-Platform", desc: "Manage both TikTok and Instagram content from a single unified dashboard." },
    { icon: Video, title: "Content Ideas", desc: "Get inspired with video concept prompts tailored to your niche and audience." },
    { icon: Image, title: "Thumbnail Ideas", desc: "Plan and organize thumbnail concepts, shots, and visual references." },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-800/50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
              <span className="gradient-text">Creator</span>Hub
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={toggleDarkMode} className="btn-ghost" aria-label="Toggle theme">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/login" className="hidden sm:block text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary text-sm !py-2.5 !px-4 sm:!px-6">
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-20 px-4">
        <motion.div className="absolute inset-0" style={{ y: bgY }}>
          <motion.div
            className="absolute inset-0"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          >
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop&auto=format"
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = "https://picsum.photos/seed/hero/1920/1080"; }}
            />
            {darkMode ? (
              <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/60 to-gray-900 transition-opacity duration-500" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white/80 transition-opacity duration-500" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 via-transparent to-purple-500/10" />
          </motion.div>
        </motion.div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {orbs.map((orb, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: orb.size,
                height: orb.size,
                background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
              }}
              animate={{
                x: orb.x,
                y: orb.y,
              }}
              transition={{
                duration: orb.duration,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        <motion.div
          className="max-w-4xl mx-auto text-center relative z-10"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/15 border border-brand-500/25 text-brand-600 dark:text-brand-400 text-sm mb-8 backdrop-blur-sm">
            <Zap size={14} />
            Your all-in-one creator workspace
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1] text-gray-900 dark:text-white drop-shadow-sm"
          >
            Create. Plan.<br />
            <span className="gradient-text">Grow</span> Your Content
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl text-gray-800 dark:text-gray-500 max-w-2xl mx-auto mb-10"
          >
            The workspace for TikTok and Instagram creators. Generate captions, plan content,
            track trends, and analyze growth — all in one place.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-primary text-lg !py-4 !px-8">
              Start Free
              <ChevronRight size={18} className="inline ml-1" />
            </Link>
            <a href="#features" className="btn-secondary text-lg !py-4 !px-8">
              See Features
            </a>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-brand-500 dark:text-brand-400" />
              No credit card
            </div>
            <div className="flex items-center gap-2">
              <Smartphone size={16} className="text-brand-500 dark:text-brand-400" />
              Mobile-first
            </div>
            <div className="flex items-center gap-2">
              <Star size={16} className="text-brand-500 dark:text-brand-400" />
              Free plan available
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            className="w-6 h-10 rounded-full border-2 border-gray-400 dark:border-gray-500 flex items-start justify-center p-1.5"
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-gray-400"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-950 to-transparent pointer-events-none z-[2] transition-colors duration-300" />
      </section>

      <section id="features" className="py-16 sm:py-20 px-4 relative bg-white dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-10 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white transition-colors duration-300">
              Everything you need to <span className="gradient-text">create</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto px-4 transition-colors duration-300">
              Stop juggling five apps. CreatorHub brings everything into one beautiful workspace.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 px-2 sm:px-0">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="card-hover p-4 sm:p-5"
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-2 sm:mb-3">
                  <feature.icon size={18} className="sm:size-5 text-brand-500" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold mb-1 text-gray-900 dark:text-white transition-colors duration-300">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed transition-colors duration-300">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section ref={ctaRef} className="relative py-24 sm:py-32 px-4 overflow-hidden bg-white dark:bg-gray-950 transition-colors duration-300">
        <motion.div className="absolute inset-0" style={{ y: ctaBgY, scale: ctaBgScale }}>
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=800&fit=crop&auto=format"
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = "https://picsum.photos/seed/cta/1920/800"; }}
          />
          <div className="absolute inset-0 bg-white/70 dark:bg-gray-950/75 backdrop-blur-[2px] transition-colors duration-300" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 via-transparent to-purple-500/10" />
        </motion.div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white transition-colors duration-300">
              Ready to level up your content?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto transition-colors duration-300">
              Join creators who use CreatorHub to plan, create, and grow consistently.
            </p>
            <Link to="/register" className="btn-primary text-lg !py-4 !px-10 inline-flex items-center gap-2">
              Get Started Free
              <ChevronRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-gray-200 dark:border-gray-800/50 py-8 px-4 bg-white dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-500 transition-colors duration-300">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-brand-500" />
            <span>CreatorHub — Built for creators</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-gray-900 dark:hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-gray-900 dark:hover:text-white transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
