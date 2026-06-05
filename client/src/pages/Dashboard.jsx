import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles, Calendar, BarChart3, TrendingUp, Lightbulb, Link as LinkIcon,
  ArrowRight, Clock, Zap, Target,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { analytics as analyticsApi } from "../utils/api";

const quickActions = [
  { to: "/captions", icon: Sparkles, label: "Generate Captions", color: "from-green-500 to-emerald-600", desc: "AI-powered captions" },
  { to: "/ideas", icon: Lightbulb, label: "New Idea", color: "from-blue-500 to-indigo-600", desc: "Save content ideas" },
  { to: "/planner", icon: Calendar, label: "Schedule Post", color: "from-purple-500 to-pink-600", desc: "Plan your content" },
  { to: "/trends", icon: TrendingUp, label: "Track Trends", color: "from-orange-500 to-red-600", desc: "Follow trending sounds" },
];

const statsCards = [
  { label: "Total Views", value: "12.4K", change: "+12%", icon: BarChart3, color: "text-blue-400" },
  { label: "Followers", value: "3,842", change: "+5.2%", icon: Target, color: "text-green-400" },
  { label: "Engagement", value: "8.3%", change: "+2.1%", icon: Zap, color: "text-purple-400" },
  { label: "Posts This Month", value: "18", change: "+6", icon: Clock, color: "text-orange-400" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold">
          {greeting}, {user?.name || "Creator"} 👋
        </h1>
        <p className="text-gray-400 mt-1">Here's your creator overview</p>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {statsCards.map((stat, i) => (
          <div key={stat.label} className="card" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="flex items-center justify-between mb-3">
              <stat.icon size={20} className={stat.color} />
              <span className="text-xs text-green-400 font-medium">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.to} to={action.to}>
              <div className="card-hover group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3`}>
                  <action.icon size={22} className="text-white" />
                </div>
                <h3 className="font-semibold mb-1">{action.label}</h3>
                <p className="text-sm text-gray-500">{action.desc}</p>
                <ArrowRight size={16} className="text-brand-400 mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Activity</h3>
            <Link to="/ideas" className="text-sm text-brand-400 hover:text-brand-300">View all</Link>
          </div>
          <div className="space-y-3">
            {[
              { text: "Created 3 new captions", time: "2 hours ago" },
              { text: "Scheduled post for tomorrow", time: "5 hours ago" },
              { text: "Added 2 trending sounds", time: "1 day ago" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-brand-400" />
                <span className="text-gray-300 flex-1">{item.text}</span>
                <span className="text-gray-500 text-xs">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Upcoming Posts</h3>
            <Link to="/planner" className="text-sm text-brand-400 hover:text-brand-300">View all</Link>
          </div>
          <div className="space-y-3">
            {[
              { title: "Glow Up Transformation", platform: "TikTok", date: "Tomorrow" },
              { title: "GRWM Vlog", platform: "Instagram", date: "Fri, Jun 7" },
              { title: "Productivity Tips", platform: "Both", date: "Mon, Jun 10" },
            ].map((post, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div>
                  <p className="text-sm font-medium">{post.title}</p>
                  <p className="text-xs text-gray-500">{post.platform}</p>
                </div>
                <span className="text-xs text-brand-400">{post.date}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="card gradient-border p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center mx-auto mb-4">
          <Sparkles size={32} className="text-white" />
        </div>
        <h3 className="text-xl font-bold mb-2">Unlock Premium Features</h3>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          Get unlimited AI generations, advanced analytics, trend alerts, and more.
        </p>
        <Link to="/settings" className="btn-primary">
          Upgrade to Premium
        </Link>
      </motion.div>
    </div>
  );
}
