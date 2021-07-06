import express from 'express';
import Chat from '../models/chatModel.js';

const chatRouter = express.Router();
chatRouter.get('/', async (req, res) => {
  const chats = await Chat.find({});
  res.send(chats);
});
chatRouter.get('/:id', async (req, res) => {
  const chat = await Chat.findById(req.params.id);
  res.send(chat);
});
chatRouter.delete('/:id', async (req, res) => {
  const chat = await Chat.findByIdAndRemove(req.params.id);

  res.send(chat);
});
chatRouter.post('/', async (req, res) => {
  const createdChat = await new Chat({
    username: req.body.username,
    message: req.body.messages[0].body,
    messages: req.body.messages,
  }).save();
  res
    .status(201)
    .send({ message: 'chat saved successfully', chat: createdChat });
});
export default chatRouter;
