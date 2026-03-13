import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, MapPin, CheckCircle, Info, MessageCircle, 
  ChevronLeft, ChevronRight, X, Phone, Mail, Send 
} from 'lucide-react';
import axios from 'axios';
import { useFavorites } from '../context/FavoriteContext';
import { useSocket } from '../context/SocketContext';
import { formatImageUrl } from '../utils/imageHelper';

const API_URL = import.meta.env.VITE_API_URL || window.location.origin;

const PetDetails = () => {
  const socket = useSocket();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    adoptionOption: 'retirada no local'
  });

  const [adoptionStatus, setAdoptionStatus] = useState(null); // 'idle', 'loading', 'success', 'error'

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/pets/${id}`);
        setPet(res.data);
        
        const messagesRes = await axios.get(`${API_URL}/api/chat/${id}`);
        setChatMessages(messagesRes.data);
      } catch (err) {
        console.error('Error fetching pet:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPet();

    socket.emit('join_chat', id);
    
    socket.on('receive_message', (data) => {
      if (data.petId === id || (data.petId?._id === id)) {
        setChatMessages((prev) => {
          // Check for duplicates
          const exists = prev.some(m => (m._id && m._id === data._id) || (m.timestamp === data.timestamp && m.message === data.message));
          if (exists) return prev;
          return [...prev, data];
        });
      }
    });

    return () => {
      socket.off('receive_message');
    };
  }, [id, socket]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      petId: id,
      sender: 'Interessado',
      message: newMessage,
      timestamp: new Date()
    };

    try {
      const response = await axios.post(`${API_URL}/api/chat`, messageData);
      
      // No need to manually emit socket event since the server does it now
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleAdoptionSubmit = async (e) => {
    e.preventDefault();
    setAdoptionStatus('loading');
    try {
      await axios.post(`${API_URL}/api/adoptions`, {
        ...formData,
        petId: id
      });
      setAdoptionStatus('success');
      setTimeout(() => {
        setShowForm(false);
        setAdoptionStatus(null);
      }, 3000);
    } catch (err) {
      setAdoptionStatus('error');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-dark"></div>
    </div>
  );

  if (!pet) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold">Pet não encontrado</h2>
      <Link to="/pets" className="text-primary-dark underline">Voltar para a lista</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/pets" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-dark font-bold mb-12 group">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Voltar para a busca
        </Link>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Gallery */}
          <div className="space-y-6">
            <motion.div 
              layoutId="pet-image"
              className="aspect-square rounded-[60px] overflow-hidden shadow-2xl border-8 border-primary-light"
            >
              <img 
                src={formatImageUrl(pet.images[activeImage], API_URL)} 
                alt={pet.name} 
                className="w-full h-full object-cover" 
              />
            </motion.div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {pet.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`flex-shrink-0 w-24 h-24 rounded-3xl overflow-hidden border-4 transition-all ${activeImage === idx ? 'border-primary' : 'border-transparent opacity-60'}`}
                >
                  <img src={formatImageUrl(img, API_URL)} alt={`${pet.name} ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-12">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="px-4 py-1 bg-primary/10 text-primary font-bold rounded-full uppercase text-xs tracking-widest">
                  {pet.species}
                </span>
                <span className={`px-4 py-1 font-bold rounded-full uppercase text-xs tracking-widest flex items-center gap-1 ${
                  pet.status === 'available' ? 'bg-green-50 text-green-600' : 
                  pet.status === 'adopted' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                }`}>
                  {pet.status === 'available' ? (
                    <><CheckCircle className="w-3 h-3" /> Disponível</>
                  ) : pet.status === 'adopted' ? (
                    <><CheckCircle className="w-3 h-3" /> Já Adotado!</>
                  ) : (
                    <><CheckCircle className="w-3 h-3" /> Reservado</>
                  )}
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-primary-dark mb-4 leading-tight flex items-center gap-6">
                {pet.name}
                <button 
                  onClick={() => toggleFavorite(pet._id)}
                  className={`p-4 rounded-full transition-all shadow-lg hover:scale-110 active:scale-95 bg-white border border-gray-100 ${isFavorite(pet._id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                >
                  <Heart className={`w-8 h-8 ${isFavorite(pet._id) ? 'fill-current' : ''}`} />
                </button>
              </h1>
              <div className="flex items-center gap-2 text-gray-500 text-lg mb-8">
                <MapPin className="w-5 h-5" />
                <span>{pet.ngoId.location.city}, {pet.ngoId.location.state}</span>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { label: 'Idade', value: pet.age },
                { label: 'Porte', value: pet.size },
                { label: 'Cor', value: pet.color },
                { label: 'Gênero', value: pet.gender }
              ].map((stat, i) => (
                <div key={i} className="bg-primary-light/50 p-6 rounded-3xl border border-primary/10">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">{stat.label}</p>
                  <p className="text-primary-dark font-bold text-lg capitalize">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-8">
              <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100">
                <h3 className="text-2xl font-bold text-primary-dark mb-4 flex items-center gap-2">
                  <Info className="w-6 h-6 text-primary" /> Personalidade
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {pet.personality} {pet.likes}
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-primary-dark mb-4">Minha história</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {pet.story}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-6 pt-8">
              {pet.status === 'available' ? (
                <>
                  <button 
                    onClick={() => setShowForm(true)}
                    className="flex-grow btn-primary py-5 text-xl flex items-center justify-center gap-3 shadow-2xl shadow-primary-dark/20"
                  >
                    Quero adotar agora
                  </button>
                  <button 
                    onClick={() => setShowChat(true)}
                    className="btn-secondary py-5 px-10 text-xl flex items-center justify-center gap-3"
                  >
                    <MessageCircle className="w-6 h-6" /> Falar com a ONG
                  </button>
                </>
              ) : (
                <div className="flex-grow p-8 bg-gray-50 rounded-[40px] border border-gray-100 text-center">
                  <p className="text-xl font-bold text-primary-dark">Este amiguinho já encontrou um lar feliz! ❤️</p>
                  <Link to="/pets" className="text-primary font-bold hover:underline mt-4 inline-block">Procurar outros amiguinhos</Link>
                </div>
              )}
            </div>
            
            {/* Responsible NGO */}
            <div className="pt-12 border-t border-gray-100 flex items-center gap-6">
              <img src={formatImageUrl(pet.ngoId.logo, API_URL)} className="w-16 h-16 rounded-2xl object-cover bg-gray-50" alt={pet.ngoId.name} />
              <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">ONG Responsável</p>
                <h4 className="font-bold text-xl text-primary-dark">{pet.ngoId.name}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Adoption Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="absolute inset-0 bg-primary-dark/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-[60px] p-12 overflow-hidden shadow-2xl"
            >
              <button onClick={() => setShowForm(false)} className="absolute top-8 right-8 text-gray-400 hover:text-primary-dark transition-colors">
                <X className="w-8 h-8" />
              </button>
              
              {adoptionStatus === 'success' ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle className="w-12 h-12" />
                  </div>
                  <h3 className="text-4xl font-bold text-primary-dark mb-4">Pedido enviado!</h3>
                  <p className="text-gray-500 text-lg">A ONG {pet.ngoId.name} entrará em contato com você em breve.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-4xl font-black text-primary-dark mb-4">Quase lá!</h2>
                  <p className="text-gray-500 text-lg mb-10">Preencha seus dados para que a ONG possa entrar em contato.</p>
                  
                  <form onSubmit={handleAdoptionSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Nome completo</label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-8 py-5 bg-gray-50 rounded-3xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Telefone (WhatsApp)</label>
                      <input 
                        type="tel" 
                        required
                        className="w-full px-8 py-5 bg-gray-50 rounded-3xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Endereço</label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-8 py-5 bg-gray-50 rounded-3xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Como deseja adotar?</label>
                      <div className="flex gap-4">
                        {['retirada no local', 'entrega em casa'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setFormData({...formData, adoptionOption: opt})}
                            className={`flex-1 py-4 rounded-2xl border-2 font-bold capitalize transition-all ${formData.adoptionOption === opt ? 'bg-primary-dark text-white border-primary-dark' : 'bg-white text-gray-400 border-gray-100'}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={adoptionStatus === 'loading'}
                      className="w-full btn-primary py-6 text-xl mt-6 disabled:opacity-50"
                    >
                      {adoptionStatus === 'loading' ? 'Enviando...' : 'Confirmar Interesse'}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Chat Sidebar/Modal */}
      <AnimatePresence>
        {showChat && (
          <div className="fixed inset-0 z-[100] flex items-center justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowChat(false)}
              className="absolute inset-0 bg-primary-dark/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative bg-white w-full max-w-md h-full flex flex-col shadow-2xl"
            >
              {/* Chat Header */}
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={pet.ngoId.logo} className="w-12 h-12 rounded-xl object-cover" alt={pet.ngoId.name} referrerPolicy="no-referrer" />
                  <div>
                    <h3 className="font-bold text-primary-dark">{pet.ngoId.name}</h3>
                    <p className="text-xs text-green-500 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Online agora
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowChat(false)} className="p-2 text-gray-400 hover:text-primary-dark transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-grow overflow-y-auto p-8 space-y-6 no-scrollbar">
                <div className="text-center">
                  <span className="px-4 py-1 bg-gray-50 text-gray-400 text-[10px] font-bold uppercase rounded-full tracking-widest">Início da conversa sobre {pet.name}</span>
                </div>
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col ${msg.sender === 'Interessado' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-3xl text-sm leading-relaxed ${msg.sender === 'Interessado' ? 'bg-primary-dark text-white rounded-tr-none' : 'bg-gray-100 text-gray-700 rounded-tl-none'}`}>
                      {msg.message}
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-widest">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-8 border-t border-gray-100">
                <form onSubmit={handleSendMessage} className="relative">
                  <input 
                    type="text" 
                    placeholder="Escreva sua mensagem..." 
                    className="w-full pl-6 pr-16 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button 
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-primary-dark text-white rounded-xl hover:opacity-90 transition-opacity"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PetDetails;
