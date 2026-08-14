import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Copy, Check, RefreshCw, Hash, Instagram, Music2, Linkedin, Twitter, Facebook,
} from "lucide-react";
import { captions as captionsApi } from "../utils/api";
import { generateContent, CONTENT_TYPES } from "../utils/contentEngine";

const platforms = [
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "tiktok", label: "TikTok", icon: Music2 },
  { value: "linkedin", label: "LinkedIn", icon: Linkedin },
  { value: "x", label: "X", icon: Twitter },
  { value: "facebook", label: "Facebook", icon: Facebook },
];

const tones = [
  { value: "casual", label: "Casual" },
  { value: "honest", label: "Honest" },
  { value: "witty", label: "Witty" },
  { value: "energetic", label: "Energetic" },
  { value: "chill", label: "Chill" },
  { value: "professional", label: "Professional" },
];

const audiences = [
  { value: "creators", label: "Creators" },
  { value: "genz", label: "Gen Z" },
  { value: "professionals", label: "Professionals" },
  { value: "students", label: "Students" },
  { value: "everyone", label: "Everyone" },
];

const counts = [1, 3, 5, 10];

const nicheSuggestions = [
  "Web developer", "Fashion creator", "Student", "Business owner", "Tech creator",
  "Lifestyle creator", "Fitness", "Photographer", "Food", "Artist", "Gamer",
  "Marketer", "Designer", "Writer", "Musician", "Travel", "Health & wellness", "Beauty",
];

export default function CaptionGenerator() {
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [contentType, setContentType] = useState("auto");
  const [tone, setTone] = useState("casual");
  const [audience, setAudience] = useState("everyone");
  const [count, setCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(null);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setError("");
    setLoading(true);
    try {
      const { data } = await captionsApi.generate({
        topic: topic.trim(),
        niche: niche.trim(),
        platform,
        contentType,
        tone,
        audience,
        count,
      });
      setResult(data);
    } catch (err) {
      setError("Couldn't save to your account, but here are your posts anyway.");
      setResult(generateContent({ topic: topic.trim(), niche: niche.trim(), platform, contentType, tone, audience, count }));
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = () => {
    if (!result) return;
    const all = [...result.posts.map((p) => p.text), result.hashtags.join(" ")].join("\n\n---\n\n");
    copyText(all, "all");
  };

  const chipClass = (active) =>
    `p-2 rounded-xl text-sm transition-all ${
      active
        ? "bg-brand-500/20 border border-brand-500/40 text-brand-400"
        : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
    }`;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Content Generator</h1>
            <p className="text-sm text-gray-400">Posts that sound like you — built for your niche and platform</p>
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

        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Topic <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="input-field"
                placeholder="e.g. my new side project, exam week, why I raised my prices..."
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your niche <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                list="niche-suggestions"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="input-field"
                placeholder="e.g. web developer, fashion creator, student..."
              />
              <datalist id="niche-suggestions">
                {nicheSuggestions.map((n) => (
                  <option key={n} value={n} />
                ))}
              </datalist>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Platform</label>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {platforms.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPlatform(p.value)}
                  className={`flex flex-col items-center gap-1.5 p-2.5 px-3 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                    platform === p.value
                      ? "bg-brand-500/20 border border-brand-500/40 text-brand-400"
                      : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  <p.icon size={18} />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Content type</label>
            <div className="flex flex-wrap gap-2">
              {CONTENT_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setContentType(t.value)}
                  className={chipClass(contentType === t.value)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tone</label>
              <div className="flex flex-wrap gap-2">
                {tones.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTone(t.value)}
                    className={chipClass(tone === t.value)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Target audience</label>
              <div className="flex flex-wrap gap-2">
                {audiences.map((a) => (
                  <button
                    key={a.value}
                    onClick={() => setAudience(a.value)}
                    className={chipClass(audience === a.value)}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Number of posts</label>
              <div className="grid grid-cols-4 gap-2">
                {counts.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCount(c)}
                    className={chipClass(count === c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Writing your posts...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Posts
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
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">
                {result.count} {result.count === 1 ? "post" : "posts"} for{" "}
                <span className="text-gray-200 capitalize">{result.platform}</span>
                {result.niche && (
                  <>
                    {" "}· <span className="text-gray-200 capitalize">{result.niche}</span>
                  </>
                )}
              </p>
            </div>

            <div className="space-y-4">
              {result.posts.map((post, i) => (
                <motion.div
                  key={`${i}-${post.text.slice(0, 12)}`}
                  className="card p-4 sm:p-5 group"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400">
                      {post.label}
                    </span>
                    <button
                      onClick={() => copyText(post.text, `post-${i}`)}
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      {copied === `post-${i}` ? (
                        <><Check size={14} className="text-green-400" /> Copied</>
                      ) : (
                        <><Copy size={14} /> Copy</>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">{post.text}</p>
                  {post.onScreen && (
                    <div className="mt-3 pt-3 border-t border-gray-800/50">
                      <p className="text-xs text-gray-500 mb-1.5">On-screen text ideas</p>
                      <div className="flex flex-wrap gap-1.5">
                        {post.onScreen.map((line, j) => (
                          <span key={j} className="text-xs px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-400">
                            {line}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {result.hashtags.length > 0 && (
              <div className="card p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Hash size={16} className="text-orange-400" />
                    <h3 className="font-medium text-sm">Hashtags</h3>
                  </div>
                  <button
                    onClick={() => copyText(result.hashtags.join(" "), "hashtags")}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {copied === "hashtags" ? (
                      <><Check size={14} className="text-green-400" /> Copied</>
                    ) : (
                      <><Copy size={14} /> Copy</>
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-300">
                  {result.hashtags.map((h) => (
                    <span key={h} className="inline-block mr-2">{h}</span>
                  ))}
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-4">
              <button onClick={handleGenerate} className="btn-secondary flex items-center gap-2">
                <RefreshCw size={16} />
                Regenerate
              </button>
              <button onClick={copyAll} className="btn-secondary flex items-center gap-2">
                <Copy size={16} />
                Copy All
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}