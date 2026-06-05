import jwt from "jsonwebtoken";
import User from "../models/User.js";
import store from "../store.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (global.USE_MEMORY_STORE) {
      const user = store.findUserById(decoded.id);
      if (!user) return res.status(401).json({ message: "User not found" });
      const { password, ...safe } = user;
      req.user = safe;
    } else {
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return res.status(401).json({ message: "User not found" });
      req.user = user;
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized" });
  }
};

export const premiumOnly = (req, res, next) => {
  if (req.user.plan !== "premium") {
    return res.status(403).json({ message: "Premium plan required" });
  }
  next();
};
