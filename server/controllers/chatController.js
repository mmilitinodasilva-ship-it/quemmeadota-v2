const ChatMessage = require('../models/ChatMessage');

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.find().sort('timestamp').populate('petId');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessagesByPet = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ petId: req.params.petId }).sort('timestamp');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const message = new ChatMessage(req.body);
    await message.save();
    
    // Populate petId before returning so the client has full details
    const populatedMessage = await ChatMessage.findById(message._id).populate('petId');
    
    // Emit via socket immediately from the controller
    const io = req.app.get('io');
    const roomId = message.petId.toString();
    io.to(roomId).emit('receive_message', populatedMessage);
    // Also notify admins
    io.to('admin_room').emit('receive_message', populatedMessage);
    
    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
