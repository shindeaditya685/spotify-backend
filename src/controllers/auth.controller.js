import { User } from "../models/user.model.js";

const authCallback = async (req, res, next) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;

    // check if user already exists
    const user = await User.findOne({ clerkId: id });

    if (!user) {
      // sign up
      await User.create({
        clerkId: id,
        fullName: `${firstName || ""} ${lastName || ""}`.trim(),
        imageUrl,
      });
    }

    res.status(201).json({ success: true });
  } catch (error) {
    console.log("Error in callback route: ", error);
    next(error);
  }
};

export { authCallback };
