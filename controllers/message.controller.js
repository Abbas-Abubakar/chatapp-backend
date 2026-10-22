import Conversation from "../model/conversation.model.js"
import Message from "../model/message.model.js"
import { getReceiverSocketId, io } from "../socket/socket.js"

export const sendMessage = async (req, res) => {
  try {
    const {message} = req.body
    const {id: receiverId } = req.params
    const senderId = req.user._id

    let conversation = await Conversation.findOne({participants: {$all: [senderId, receiverId]}})

    if(!conversation){
      conversation = await Conversation.create({
        participants: [senderId, receiverId]
      })
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message
    })


    conversation.messages.push(newMessage._id)
    await Promise.all([newMessage.save(), conversation.save()])

    const receiverSocketId = getReceiverSocketId(receiverId)
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage", newMessage)
    }

    res.status(201).json({
      message: "Message sent successfully",
      newMessage
    })

  } catch (err) {
    console.log("Error in send message controller", err.message);
    
    return res.status(500).json({error: "Internal Server Error"})
  }
}

export const getMessage = async (req, res) => {
  try { 
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json([]);
    }

    const messages = conversation.messages

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessage controller:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
