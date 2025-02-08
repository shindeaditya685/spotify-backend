import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
  if (!req.auth.userId) {
    res.status(401).json({
      message: "Unauthorized - you must be logged in",
    });
    return;
  }

  next();
};

export const requireAdmin = async (req, res, next) => {
  try {
    const currnetUser = await clerkClient.users.getUser(req.auth.userId);
    const isAdmin =
      process.env.ADMIN_EMAIL === currnetUser.primaryEmailAddress?.emailAddress;

    if (!isAdmin) {
      res.status(403).json({ message: "Unauthorized - you must be an admin" });
    }
    next();
  } catch (error) {
    console.log("Error in requireAdmin auth middleware: ", error);
    next(error);
  }
};
