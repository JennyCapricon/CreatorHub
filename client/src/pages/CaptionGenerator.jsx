import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Copy, Check, RefreshCw, Heart, FileText, MessageCircle, Hash,
} from "lucide-react";
import { captions as captionsApi } from "../utils/api";

const moods = [
  { value: "funny", label: "Funny", emoji: "😂" },
  { value: "inspirational", label: "Inspirational", emoji: "✨" },
  { value: "aesthetic", label: "Aesthetic", emoji: "🌸" },
  { value: "educational", label: "Educational", emoji: "📚" },
  { value: "relatable", label: "Relatable", emoji: "🤝" },
];

const audiences = [
  { value: "creators", label: "Creators" },
  { value: "genz", label: "Gen Z" },
  { value: "professionals", label: "Professionals" },
  { value: "students", label: "Students" },
  { value: "everyone", label: "Everyone" },
];

export default function CaptionGenerator() {
  const [topic, setTopic] = useState("");
  const [mood, setMood] = useState("relatable");
  const [audience, setAudience] = useState("everyone");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a video topic");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { data } = await captionsApi.generate({ topic, mood, audience });
      setResult(data);
    } catch (err) {
      setError("Failed to generate captions. Using local fallback.");
      const fallbackResult = {
        captions: [
          `The ${topic} era is loading ✨`,
          `Saving this if you're a ${audience} who needs ${topic}`,
          `${topic} changed the game 🔥`,
          `Not me gatekeeping ${topic} anymore`,
          `We all need a little ${topic} energy`,
        ],
        hooks: [
          `STOP SCROLLING if you love ${topic}`,
          `The truth about ${topic} nobody talks about`,
          `${topic} is the secret to everything`,
        ],
        povLines: [
          `POV: you finally mastered ${topic}`,
          `POV: ${audience} discovering ${topic}`,
          `POV: the ${topic} era begins now`,
        ],
        hashtags: [`#${topic.replace(/\s+/g, "")}`, "#creatorhub", "#viral", "#fyp", "#contentcreator"],
      };
      setResult(fallbackResult);
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const Section = ({ title, icon: Icon, items, color }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon size={18} className={color} />
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={i}
            className="group flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            onClick={() => copyText(item, `${title}-${i}`)}
          >
            <span className="text-sm text-gray-300 flex-1">{item}</span>
            {copiedIndex === `${title}-${i}` ? (
              <Check size={16} className="text-green-400 shrink-0 mt-0.5" />
            ) : (
              <Copy size={16} className="text-gray-600 group-hover:text-gray-400 shrink-0 mt-0.5" />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Caption Generator</h1>
            <p className="text-sm text-gray-400">Generate viral captions, hooks, and hashtags</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Video Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="input-field"
              placeholder="e.g., Glow up transformation, Morning routine, GRWM..."
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mood</label>
              <div className="grid grid-cols-3 gap-2">
                {moods.slice(0, 3).map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setMood(m.value)}
                    className={`p-2 rounded-xl text-sm transition-all ${
                      mood === m.value
                        ? "bg-brand-500/20 border border-brand-500/40 text-brand-400"
                        : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {m.emoji} {m.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {moods.slice(3).map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setMood(m.value)}
                    className={`p-2 rounded-xl text-sm transition-all ${
                      mood === m.value
                        ? "bg-brand-500/20 border border-brand-500/40 text-brand-400"
                        : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {m.emoji} {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Target Audience</label>
              <div className="grid grid-cols-2 gap-2">
                {audiences.map((a) => (
                  <button
                    key={a.value}
                    onClick={() => setAudience(a.value)}
                    className={`p-2 rounded-xl text-sm transition-all ${
                      audience === a.value
                        ? "bg-brand-500/20 border border-brand-500/40 text-brand-400"
                        : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Captions
              </>
            )}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {result && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="card p-6 space-y-6">
              <Section title="Captions" icon={FileText} color="text-brand-400" items={result.captions} />
              <div className="border-t border-gray-800/50" />
              <Section title="Hooks" icon={MessageCircle} color="text-blue-400" items={result.hooks} />
              <div className="border-t border-gray-800/50" />
              <Section title="POV Lines" icon={FileText} color="text-purple-400" items={result.povLines} />
              <div className="border-t border-gray-800/50" />
              <Section title="Hashtags" icon={Hash} color="text-orange-400" items={result.hashtags} />
            </div>

            <div className="flex items-center justify-center gap-4">
              <button onClick={handleGenerate} className="btn-secondary flex items-center gap-2">
                <RefreshCw size={16} />
                Regenerate
              </button>
              <button className="btn-secondary flex items-center gap-2">
                <Heart size={16} />
                Save All
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
