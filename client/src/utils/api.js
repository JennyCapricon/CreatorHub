import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp,
} from "firebase/firestore";
import { db, auth as firebaseAuth } from "../firebase/config";

const uid = () => firebaseAuth.currentUser?.uid;
const userCol = (name) => (uid() ? collection(db, "users", uid(), name) : null);

const moods = {
  funny: ["Laughing at how real this is", "Not me actually ", "I'm not crying, you're crying"],
  inspirational: ["Your sign to ", "Stop waiting. Start doing.", "The glow up starts now"],
  aesthetic: ["A vibe that hits different", "POV: you found your aesthetic", "Soft era loading"],
  educational: ["Save this for later ", "Here's what nobody tells you", "The truth about "],
  relatable: ["We all do this and it's okay", "That awkward moment when", "Nobody:                        Me:"],
};

function generateCaptions(topic, mood, audience) {
  const moodCaptions = moods[mood?.toLowerCase()] || moods.relatable;
  return {
    captions: [
      `${moodCaptions[0]} ${topic}${mood === "funny" ? " 😭" : ""}`,
      `${moodCaptions[1]} ${topic} ✨`,
      `${moodCaptions[2]} ${topic} 👏`,
      `Saving this if you're a ${audience || "creator"} who needs to hear this: ${topic}`,
      `${topic} is the new era and we're here for it 🔥`,
    ],
    hooks: [
      `STOP SCROLLING if you ${topic}`,
      `The truth about ${topic} nobody talks about`,
      `${topic} changed my life`,
    ],
    povLines: [
      `POV: you finally ${topic.toLowerCase()}`,
      `POV: ${audience || "creators"} when ${topic}`,
      `POV: the ${topic} era begins now`,
    ],
    hashtags: [
      `#${topic.replace(/\s+/g, "")}`,
      `#${topic.replace(/\s+/g, "")}Tok`,
      "#creatorhub", "#contentcreator", "#growyourpage", "#viral", "#fyp",
    ],
  };
}

export const auth = {
  getMe: async () => {
    const snap = await getDoc(doc(db, "users", uid()));
    return { data: { user: { id: uid(), ...snap.data() } } };
  },
  updateProfile: async (body) => {
    const { name, username, bio, avatar } = body;
    await updateDoc(doc(db, "users", uid()), { name, username, bio, avatar, updatedAt: serverTimestamp() });
    const snap = await getDoc(doc(db, "users", uid()));
    return { data: { user: { id: uid(), ...snap.data() } } };
  },
  updatePreferences: async (body) => {
    const { darkMode, emailNotifications } = body;
    await updateDoc(doc(db, "users", uid()), { preferences: { darkMode, emailNotifications }, updatedAt: serverTimestamp() });
    const snap = await getDoc(doc(db, "users", uid()));
    return { data: { user: { id: uid(), ...snap.data() } } };
  },
};

export const captions = {
  generate: async (body) => {
    const { topic, mood, audience } = body;
    if (!topic) throw new Error("Topic is required");
    const result = generateCaptions(topic, mood, audience);
    const ref = await addDoc(userCol("captions"), {
      topic, mood: mood || "", audience: audience || "",
      ...result, saved: false,
      createdAt: serverTimestamp(),
    });
    return { data: { ...result, _id: ref.id } };
  },
  getHistory: async () => {
    const q = query(userCol("captions"), orderBy("createdAt", "desc"), limit(20));
    const snap = await getDocs(q);
    const captions = snap.docs.map((d) => ({ _id: d.id, ...d.data() }));
    return { data: { captions } };
  },
  save: async (id) => {
    await updateDoc(doc(db, "users", uid(), "captions", id), { saved: true });
    return { data: { caption: { _id: id, saved: true } } };
  },
};

export const ideas = {
  getAll: async () => {
    const q = query(userCol("ideas"), orderBy("updatedAt", "desc"));
    const snap = await getDocs(q);
    const ideas = snap.docs.map((d) => ({ _id: d.id, ...d.data() }));
    return { data: { ideas } };
  },
  create: async (body) => {
    const ref = await addDoc(userCol("ideas"), {
      ...body, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
    });
    const snap = await getDoc(doc(db, "users", uid(), "ideas", ref.id));
    return { data: { idea: { _id: ref.id, ...snap.data() } } };
  },
  update: async (id, body) => {
    await updateDoc(doc(db, "users", uid(), "ideas", id), { ...body, updatedAt: serverTimestamp() });
    const snap = await getDoc(doc(db, "users", uid(), "ideas", id));
    return { data: { idea: { _id: id, ...snap.data() } } };
  },
  delete: async (id) => {
    await deleteDoc(doc(db, "users", uid(), "ideas", id));
    return { data: { message: "Idea deleted" } };
  },
};

export const posts = {
  getAll: async (params) => {
    const q = query(userCol("posts"), orderBy("scheduledDate", "asc"));
    const snap = await getDocs(q);
    let all = snap.docs.map((d) => ({ _id: d.id, ...d.data(), scheduledDate: d.data().scheduledDate?.toDate?.() || d.data().scheduledDate }));
    if (params?.month && params?.year) {
      all = all.filter((p) => {
        const d = new Date(p.scheduledDate);
        return d.getMonth() + 1 === Number(params.month) && d.getFullYear() === Number(params.year);
      });
    }
    return { data: { posts: all } };
  },
  create: async (body) => {
    const ref = await addDoc(userCol("posts"), {
      ...body, scheduledDate: new Date(body.scheduledDate),
      createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
    });
    const snap = await getDoc(doc(db, "users", uid(), "posts", ref.id));
    return { data: { post: { _id: ref.id, ...snap.data() } } };
  },
  update: async (id, body) => {
    const updateData = { ...body, updatedAt: serverTimestamp() };
    if (body.scheduledDate) updateData.scheduledDate = new Date(body.scheduledDate);
    await updateDoc(doc(db, "users", uid(), "posts", id), updateData);
    const snap = await getDoc(doc(db, "users", uid(), "posts", id));
    return { data: { post: { _id: id, ...snap.data() } } };
  },
  delete: async (id) => {
    await deleteDoc(doc(db, "users", uid(), "posts", id));
    return { data: { message: "Post deleted" } };
  },
};

export const trends = {
  getAll: async () => {
    const q = query(userCol("trends"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const trends = snap.docs.map((d) => ({ _id: d.id, ...d.data() }));
    return { data: { trends } };
  },
  create: async (body) => {
    const ref = await addDoc(userCol("trends"), {
      ...body, used: false,
      createdAt: serverTimestamp(),
    });
    const snap = await getDoc(doc(db, "users", uid(), "trends", ref.id));
    return { data: { trend: { _id: ref.id, ...snap.data() } } };
  },
  update: async (id, body) => {
    await updateDoc(doc(db, "users", uid(), "trends", id), body);
    const snap = await getDoc(doc(db, "users", uid(), "trends", id));
    return { data: { trend: { _id: id, ...snap.data() } } };
  },
  delete: async (id) => {
    await deleteDoc(doc(db, "users", uid(), "trends", id));
    return { data: { message: "Trend deleted" } };
  },
};

export const analytics = {
  get: async (params) => {
    const days = params?.days || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));
    const q = query(userCol("analytics"), orderBy("date", "asc"));
    const snap = await getDocs(q);
    let data = snap.docs.map((d) => ({ _id: d.id, ...d.data(), date: d.data().date?.toDate?.() || d.data().date }));
    data = data.filter((d) => new Date(d.date) >= startDate);
    const totals = data.reduce(
      (acc, cur) => ({
        followers: Math.max(acc.followers, cur.followers || 0),
        views: acc.views + (cur.views || 0),
        likes: acc.likes + (cur.likes || 0),
        comments: acc.comments + (cur.comments || 0),
        shares: acc.shares + (cur.shares || 0),
      }),
      { followers: 0, views: 0, likes: 0, comments: 0, shares: 0 }
    );
    const engagementRate = totals.views > 0
      ? parseFloat((((totals.likes + totals.comments + totals.shares) / totals.views) * 100).toFixed(2))
      : 0;
    return { data: { data, totals, engagementRate } };
  },
  sync: async (body) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const q = query(userCol("analytics"), orderBy("date", "desc"), limit(50));
    const snap = await getDocs(q);
    const existing = snap.docs.find((d) => {
      const dDate = d.data().date?.toDate?.() || new Date(d.data().date);
      return dDate >= today && d.data().platform === body.platform;
    });
    if (existing) {
      await updateDoc(doc(db, "users", uid(), "analytics", existing.id), {
        ...body, updatedAt: serverTimestamp(),
      });
    } else {
      await addDoc(userCol("analytics"), {
        ...body, date: today,
        createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
    }
    return { data: { entry: { ...body } } };
  },
};

export const linkinbio = {
  get: async () => {
    const snap = await getDoc(doc(db, "users", uid()));
    const data = snap.data();
    return { data: { linkinbio: data?.linkinbio || { links: [], socialLinks: {}, bio: "", profilePic: "", theme: "dark" }, name: data?.name, username: data?.username, avatar: data?.avatar } };
  },
  update: async (body) => {
    const { profilePic, bio, links, socialLinks, theme } = body;
    const linkinbio = { profilePic: profilePic || "", bio: bio ?? "", links: links || [], socialLinks: socialLinks || {}, theme: theme || "dark" };
    await updateDoc(doc(db, "users", uid()), { linkinbio, updatedAt: serverTimestamp() });
    return { data: { linkinbio } };
  },
  getPublic: async (username) => {
    const q = query(collection(db, "users"), where("username", "==", username), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) throw new Error("User not found");
    const userData = snap.docs[0].data();
    return { data: { user: { linkinbio: userData.linkinbio, name: userData.name, username: userData.username, avatar: userData.avatar } } };
  },
};
