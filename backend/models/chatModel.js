import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    username: String,
    message: String,
    messages: [{ name: String, body: String }],
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
