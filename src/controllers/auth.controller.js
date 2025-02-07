import { User } from "../models/user.model.js";

const authCallback = async (req, res) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body;

    // check if user already exists
    const user = await User.findOne({ clerkId: id });

    if (!user) {
      await User.create({
        clerkId: id,
        fullName: `${firstName} ${lastName}`,
        imageUrl,
      });
    }

    res.status(201).json({ success: true });
  } catch (error) {
    console.log("Error in callback route: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { authCallback };
