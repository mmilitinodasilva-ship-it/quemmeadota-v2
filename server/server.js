const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// Route imports
const petRoutes = require('./routes/petRoutes');
const ngoRoutes = require('./routes/ngoRoutes');
const adoptionRoutes = require('./routes/adoptionRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const chatRoutes = require('./routes/chatRoutes');
const blogRoutes = require('./routes/blogRoutes');
const successStoryRoutes = require('./routes/successStoryRoutes');
const heroRoutes = require('./routes/heroRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Pass io to express app
app.set('io', io);

// Middleware
app.use(cors({
  origin: "*"
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quem-me-adota')
  .then(() => console.log('✅ Conectado ao MongoDB'))
  .catch((err) => console.error('❌ Erro ao conectar ao MongoDB:', err));

// Routes
app.use('/api/pets', petRoutes);
app.use('/api/ngos', ngoRoutes);
app.use('/api/adoptions', adoptionRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/stories', successStoryRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/admin', adminRoutes);

// Static files for frontend build
const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  // Se for uma rota de API que não existe, retorna 404 em JSON
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'API route not found' });
  }
  // Caso contrário, serve o index.html do React
  res.sendFile(path.join(distPath, 'index.html'));
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('🔌 Usuário conectado:', socket.id);

  socket.on('join_chat', (petId) => {
    socket.join(petId);
    console.log(`👤 Usuário entrou no chat do pet: ${petId}`);
  });

  socket.on('join_admin', () => {
    socket.join('admin_room');
    console.log('👤 Administrador entrou na sala global de admin');
  });

  socket.on('send_message', (data) => {
    // Ensure petId is a string for the room
    const roomId = data.petId?._id || data.petId;
    io.to(roomId).emit('receive_message', data);
    // Also send to admin room so the dashboard is updated
    io.to('admin_room').emit('receive_message', data);
  });

  socket.on('new_pet_notification', (pet) => {
    socket.broadcast.emit('show_notification', {
      message: `Novo pet disponível para adoção: ${pet.name}!`,
      petId: pet._id
    });
  });

  socket.on('disconnect', () => {
    console.log('🔌 Usuário desconectado');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log('--- SERVER READY ---');
});
