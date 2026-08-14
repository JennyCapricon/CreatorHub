import { auth } from "../firebase/config";

export const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const AVATAR_MAX_MB = 5;

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

let uploadInFlight = false;

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

const friendlyError = (cloudinaryMessage) => {
  if (!cloudinaryMessage) return "Upload failed. Please try again.";
  const msg = cloudinaryMessage.toLowerCase();
  if (msg.includes("too large")) return `The image is too large. Maximum size is ${AVATAR_MAX_MB} MB.`;
  if (msg.includes("format")) return "Unsupported file type. Please choose a JPG, JPEG, PNG, or WebP image.";
  if (msg.includes("not authorised") || msg.includes("unauthor") || msg.includes("permission")) {
    return "Upload not permitted. Check that the upload preset is configured as unsigned.";
  }
  return "Upload failed. Please try again.";
};

export const uploadAvatar = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const validationError = validateAvatarFile(file);
    if (validationError) return reject(new Error(validationError));

    if (uploadInFlight) {
      return reject(new Error("An upload is already in progress. Please wait."));
    }
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      return reject(new Error("Profile picture uploads are not configured. Please try again later."));
    }

    const user = auth.currentUser;
    if (!user) return reject(new Error("You must be signed in to upload a profile picture."));

    const uid = user.uid;

    // Fixed public id per user under the preset-locked folder (creator-hub/avatars),
    // with overwrite=true so re-uploading REPLACES the same asset (no duplicates).
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", UPLOAD_PRESET);
    form.append("public_id", `${uid}/avatar`);
    form.append("overwrite", "true");

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
    xhr.responseType = "json";

    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && e.total > 0) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
    }

    xhr.onload = () => {
      uploadInFlight = false;
      const json = xhr.response;
      if (xhr.status >= 200 && xhr.status < 300 && json && json.secure_url) {
        resolve(json.secure_url);
      } else if (json && json.error && json.error.message) {
        reject(new Error(friendlyError(json.error.message)));
      } else {
        reject(new Error("Upload failed. Please try again."));
      }
    };

    xhr.onerror = () => {
      uploadInFlight = false;
      reject(new Error("Network error. Check your connection and try again."));
    };
    xhr.onabort = () => {
      uploadInFlight = false;
      reject(new Error("Upload was cancelled."));
    };

    uploadInFlight = true;
    xhr.send(form);
  });
};