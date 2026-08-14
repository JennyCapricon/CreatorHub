import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, TrendingUp, Users, Eye, Heart, MessageCircle, Share2,
  Download,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import { analytics as analyticsApi } from "../utils/api";

const COLORS = ["#4ade80", "#22c55e", "#16a34a", "#15803d", "#86efac"];

const generateMockData = () => {
  const days = 30;
  const data = [];
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      views: Math.floor(Math.random() * 5000) + 500,
      likes: Math.floor(Math.random() * 1000) + 100,
      followers: Math.floor(Math.random() * 200) + 10,
      engagement: (Math.random() * 8 + 1).toFixed(1),
    });
  }
  return data;
};

const generatePieData = () => [
  { name: "TikTok", value: 65 },
  { name: "Instagram", value: 35 },
];

const generateBestTimes = () => [
  { time: "6AM", engagement: 2.1 },
  { time: "9AM", engagement: 4.5 },
  { time: "12PM", engagement: 6.8 },
  { time: "3PM", engagement: 8.2 },
  { time: "6PM", engagement: 9.5 },
  { time: "9PM", engagement: 7.3 },
  { time: "12AM", engagement: 3.2 },
];

export default function AnalyticsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30");

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: apiData } = await analyticsApi.get({ days: period });
      if (apiData.data && apiData.data.length > 0) {
        const chartData = apiData.data.map((d) => ({
          date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          views: d.views,
          likes: d.likes,
          followers: d.followers,
          engagement: d.totalLikes ? ((d.likes / d.views) * 100).toFixed(1) : 0,
        }));
        setData(chartData);
      } else {
        setData(generateMockData());
      }
    } catch {
      setData(generateMockData());
    } finally {
      setLoading(false);
    }
  };

  const totals = data.reduce(
    (acc, cur) => ({
      views: acc.views + cur.views,
      likes: acc.likes + cur.likes,
      followers: Math.max(acc.followers, cur.followers),
      engagement: Math.max(acc.engagement, cur.engagement),
    }),
    { views: 0, likes: 0, followers: 0, engagement: 0 }
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-3 rounded-xl text-sm">
          <p className="text-gray-400 mb-1">{label}</p>
          {payload.map((entry, i) => (
            <p key={i} style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const statCards = [
    { label: "Total Views", value: totals.views.toLocaleString(), icon: Eye, color: "text-blue-400", change: "+12%" },
    { label: "Total Likes", value: totals.likes.toLocaleString(), icon: Heart, color: "text-red-400", change: "+8%" },
    { label: "Followers", value: totals.followers.toLocaleString(), icon: Users, color: "text-green-400", change: "+5%" },
    { label: "Engagement", value: `${totals.engagement}%`, icon: TrendingUp, color: "text-purple-400", change: "+2.1%" },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shrink-0">
              <BarChart3 size={20} className="text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold">Analytics</h1>
              <p className="text-sm text-gray-400">Track your growth and engagement</p>
            </div>
          </div>
          <div className="flex gap-2">
            {["7", "30", "90"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all shrink-0 ${
                  period === p
                    ? "bg-brand-500/20 text-brand-400 border border-brand-500/30"
                    : "text-gray-400 hover:text-white border border-transparent"
                }`}
              >
                {p}d
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {statCards.map((stat) => (
              <div key={stat.label} className="card">
                <div className="flex items-center justify-between mb-3">
                  <stat.icon size={20} className={stat.color} />
                  <span className="text-xs text-green-400 font-medium">{stat.change}</span>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-semibold mb-4">Views Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} minTickGap={24} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#4ade80"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#viewsGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="font-semibold mb-4">Likes & Followers</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} minTickGap={24} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="likes" fill="#4ade80" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="followers" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="font-semibold mb-4">Platform Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={generatePieData()}
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {generatePieData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="font-semibold mb-4">Best Posting Times</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={generateBestTimes()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="time" stroke="#6b7280" fontSize={12} minTickGap={16} />
                  <YAxis stroke="#6b7280" fontSize={12} unit="%" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="engagement"
                    stroke="#4ade80"
                    strokeWidth={2}
                    dot={{ fill: "#4ade80", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
