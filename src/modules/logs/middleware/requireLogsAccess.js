import User from "../../users/models/Users.js";

const LOG_READER_ROLES = new Set(["admin", "developer"]);

export const requireLogsAccess = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = await User.findById(userId).select("userType");
    if (!user) {
      return res.status(401).json({ message: "Authenticated user not found" });
    }

    const role = user.userType?.trim().toLowerCase();
    if (!role || !LOG_READER_ROLES.has(role)) {
      return res.status(403).json({ message: "You are not allowed to view logs" });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};
