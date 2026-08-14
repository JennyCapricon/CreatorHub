import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage, auth } from "../firebase/config";

export const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const AVATAR_MAX_MB = 5;

const friendlyError = (err, fallback) => {
  switch (err?.code) {
    case "storage/unauthorized":
      return "You don't have permission to upload a profile picture. Please sign in and try again.";
    case "storage/quota-exceeded":
      return "Storage quota exceeded. Please try again later.";
    case "storage/retry-limit-exceeded":
    case "storage/network-error":
    case "storage/network-invalid-response":
      return "Network error. Check your connection and try again.";
    case "storage/invalid-argument":
      return "The image could not be uploaded. Please try a different file.";
    default:
      return fallback || "Upload failed. Please try again.";
  }
};

export const validateAvatarFile = (file) => {
  if (!file) return "No file selected.";
  if (!AVATAR_TYPES.includes(file.type)) {
    return "Unsupported file type. Please choose a JPG, JPEG, PNG, or WebP image.";
  }
  if (file.size > AVATAR_MAX_MB * 1024 * 1024) {
    return `File is too large. Maximum size is ${AVATAR_MAX_MB} MB.`;
  }
  return null;
};

export const removeStoredAvatar = async (url) => {
  if (!url || !url.includes("firebasestorage.googleapis.com")) return;
  try {
    await deleteObject(storageRef(storage, url));
  } catch {
    // old file may already be gone; never block the profile update on cleanup
  }
};

export const uploadAvatar = async (file, onProgress) => {
  const validationError = validateAvatarFile(file);
  if (validationError) throw new Error(validationError);

  const user = auth.currentUser;
  if (!user) throw new Error("You must be signed in to upload a profile picture.");

  const safeName = (file.name || "avatar")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .slice(-50);
  const ref = storageRef(storage, `avatars/${user.uid}/${Date.now()}-${safeName}`);

  try {
    const task = uploadBytesResumable(ref, file, { contentType: file.type });
    const snapshot = await new Promise((resolve, reject) => {
      task.on(
        "state_changed",
        (snap) => {
          if (onProgress && snap.totalBytes > 0) {
            onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
          }
        },
        reject,
        resolve
      );
    });
    return await getDownloadURL(snapshot.ref);
  } catch (err) {
    throw new Error(friendlyError(err));
  }
};
