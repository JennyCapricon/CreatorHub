import { create } from "zustand";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const initial = () => {
  const firebaseUser = auth.currentUser;
  if (firebaseUser) return { user: { id: firebaseUser.uid, email: firebaseUser.email }, loading: true };
  return { user: null, loading: true };
};

const useAuthStore = create((set) => ({
  ...initial(),

  initAuth: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const snap = await getDoc(doc(db, "users", firebaseUser.uid));
        const profile = snap.data() || {};
        set({ user: { id: firebaseUser.uid, email: firebaseUser.email, ...profile }, loading: false });
      } else {
        set({ user: null, loading: false });
      }
    });
  },

  login: async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const snap = await getDoc(doc(db, "users", cred.user.uid));
    const profile = snap.data() || {};
    const user = { id: cred.user.uid, email: cred.user.email, ...profile };
    set({ user });
    return user;
  },

  register: async (email, password, name) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const profile = {
      email,
      name: name || "",
      username: email.split("@")[0] + Math.floor(Math.random() * 1000),
      avatar: "",
      bio: "",
      plan: "free",
      linkinbio: { profilePic: "", bio: "", links: [], socialLinks: {}, theme: "dark" },
      preferences: { darkMode: true, emailNotifications: true },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(doc(db, "users", cred.user.uid), profile);
    const user = { id: cred.user.uid, email: cred.user.email, ...profile };
    set({ user });
    return user;
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null });
  },

  updateUser: (userData) => set({ user: userData }),

  setLoading: (loading) => set({ loading }),
}));

export default useAuthStore;
