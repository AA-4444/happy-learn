import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const registerUser = async (email: string, password: string, name: string) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  await initUserProgress(cred.user.uid);
  return cred.user;
};

export const loginUser = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);

export const logoutUser = () => signOut(auth);

export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

export const onAuthChange = (callback: (user: User | null) => void) => onAuthStateChanged(auth, callback);

export interface UserProgress {
  unlockedUpTo: number;
  elementStates: {
    expanded: boolean;
    step: "video" | "quiz" | "homework" | "completed";
    quizScore: number | null;
  }[];
}

const DEFAULT_PROGRESS = (totalElements: number): UserProgress => ({
  unlockedUpTo: 0,
  elementStates: Array.from({ length: totalElements }, (_, i) => ({
    expanded: i === 0,
    step: "video",
    quizScore: null,
  })),
});

export const initUserProgress = async (uid: string, totalElements = 10) => {
  const ref = doc(db, "progress", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, DEFAULT_PROGRESS(totalElements));
  }
};

export const loadUserProgress = async (uid: string, totalElements = 10): Promise<UserProgress> => {
  const ref = doc(db, "progress", uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return snap.data() as UserProgress;
  }
  const defaults = DEFAULT_PROGRESS(totalElements);
  await setDoc(ref, defaults);
  return defaults;
};

export const saveUserProgress = async (uid: string, progress: UserProgress) => {
  const ref = doc(db, "progress", uid);
  await updateDoc(ref, progress as Record<string, unknown>);
};
