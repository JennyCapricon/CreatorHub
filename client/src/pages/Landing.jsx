import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles, Calendar, TrendingUp, BarChart3, Lightbulb, Link as LinkIcon,
  Smartphone, Zap, Shield, ChevronRight, Star, Hash, Clock, Users,
  PenTool, Palette, Video, Music, MessageSquare, Globe, Image,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function Landing() {
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
    <div className="min-h-screen bg-gray-950">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold">
              <span className="gradient-text">Creator</span>Hub
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary text-sm !py-2.5">
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      <section className="pt-32 pb-20 px-4">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm mb-8">
            <Zap size={14} />
            Your all-in-one creator workspace
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            Create, Plan,<br />
            <span className="gradient-text">Grow</span> Your Content
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
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
          <motion.div variants={fadeUp} className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-brand-400" />
              No credit card
            </div>
            <div className="flex items-center gap-2">
              <Smartphone size={16} className="text-brand-400" />
              Mobile-first
            </div>
            <div className="flex items-center gap-2">
              <Star size={16} className="text-brand-400" />
              Free plan available
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section id="features" className="py-16 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-10 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 px-2">
              Everything you need to <span className="gradient-text">create</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto px-4">
              Stop juggling five apps. CreatorHub brings everything into one beautiful workspace.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 px-2 sm:px-0">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="card-hover p-4 sm:p-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(index * 0.05, 0.5) }}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-2 sm:mb-3">
                  <feature.icon size={18} className="sm:size-5 text-brand-400" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold mb-1">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to level up your content?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Join creators who use CreatorHub to plan, create, and grow consistently.
            </p>
            <Link to="/register" className="btn-primary text-lg !py-4 !px-10">
              Get Started Free
              <ChevronRight size={18} className="inline ml-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-gray-800/50 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-brand-400" />
            <span>CreatorHub — Built for creators</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-white transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
