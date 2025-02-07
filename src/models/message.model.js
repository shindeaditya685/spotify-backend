import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      // clerk user id
      type: String,
      required: true,
    },
    receiverId: {
      // clerk user id
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Message = mongoose.model("Message", messageSchema);
