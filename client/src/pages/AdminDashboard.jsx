import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Dog, Heart, MessageSquare, 
  Settings, LogOut, Plus, Edit2, Trash2, 
  CheckCircle, XCircle, BarChart3, Users, 
  FileText, ArrowRight, User, Send, X, Camera, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { useSocket } from '../context/SocketContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const API_URL = import.meta.env.VITE_API_URL || window.location.origin;

const AdminDashboard = () => {
  const { token, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState(null);
  const [adoptedPets, setAdoptedPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !token) {
      navigate('/login');
    }
  }, [token, authLoading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, petsRes] = await Promise.all([
          axios.get(`${API_URL}/api/pets/stats`),
          axios.get(`${API_URL}/api/pets`)
        ]);
        setStats(statsRes.data);
        setAdoptedPets(petsRes.data.filter(pet => pet.status === 'adopted'));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  if (authLoading || !token) return null;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Dog, label: 'Gerenciar Pets', path: '/admin/pets' },
    { icon: Users, label: 'ONGs', path: '/admin/ngos' },
    { icon: Heart, label: 'Adoções', path: '/admin/adoptions' },
    { icon: MessageSquare, label: 'Mensagens', path: '/admin/messages' },
    { icon: FileText, label: 'Blog', path: '/admin/blog' },
    { icon: Settings, label: 'Configurações', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col p-6 fixed h-full z-10 shadow-xl shadow-gray-200/50 overflow-y-auto no-scrollbar">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-xl text-primary-dark shadow-lg shadow-primary/20">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h2 className="font-black text-lg text-primary-dark tracking-tight leading-none">Admin</h2>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Quem Me Adota</p>
          </div>
        </div>

        <nav className="flex-grow space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-2xl font-bold text-sm transition-all transform hover:scale-105 active:scale-95 ${location.pathname === item.path ? 'bg-primary-dark text-white shadow-xl shadow-primary-dark/20' : 'text-gray-400 hover:text-primary-dark hover:bg-primary-light/50'}`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <button 
          onClick={logout}
          className="flex items-center gap-3 p-3 rounded-2xl font-bold text-sm text-red-400 hover:bg-red-50 transition-all mt-auto"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair do Painel</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow ml-64 p-12">
        <header className="flex justify-between items-center mb-16">
          <div>
            <h1 className="text-4xl font-black text-primary-dark mb-2">Bem-vindo, Admin! 👋</h1>
            <p className="text-gray-500 text-lg">Aqui está o que está acontecendo na plataforma hoje.</p>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/admin/messages" className="relative p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <MessageSquare className="w-6 h-6 text-gray-400" />
              <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
            </Link>
            <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                <User className="w-6 h-6" />
              </div>
              <p className="font-bold text-primary-dark">Administrador</p>
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<DashboardOverview stats={stats} adoptedPets={adoptedPets} loading={loading} />} />
          <Route path="/pets" element={<AdminPets />} />
          <Route path="/ngos" element={<AdminNgos />} />
          <Route path="/adoptions" element={<AdminAdoptions />} />
          <Route path="/blog" element={<AdminBlog />} />
          <Route path="/messages" element={<AdminMessages />} />
          <Route path="/settings" element={<AdminSettings />} />
          {/* Add other admin routes as needed */}
        </Routes>
        </main>
      </div>
    );
  };

const DashboardOverview = ({ stats, adoptedPets, loading }) => {
  if (!stats) return null;

  const barData = {
    labels: stats.petsBySpecies.map(s => s._id === 'cachorro' ? 'Cachorros' : 'Gatos'),
    datasets: [{
      label: 'Pets por Espécie',
      data: stats.petsBySpecies.map(s => s.count),
      backgroundColor: ['#26416d', '#f5bebd'],
      borderRadius: 12,
    }]
  };

  const pieData = {
    labels: ['Disponíveis', 'Adotados', 'Reservados'],
    datasets: [{
      data: [stats.availablePets, stats.adoptedPets, stats.reservedPets],
      backgroundColor: ['#26416d', '#f5bebd', '#f3f4f6'],
      borderWidth: 0,
    }]
  };

  return (
    <div className="space-y-12">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: Dog, label: 'Total Pets', value: stats.totalPets, color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: Heart, label: 'Adoções', value: stats.adoptedPets, color: 'text-red-600', bg: 'bg-red-50' },
          { icon: Users, label: 'Solicitações', value: 12, color: 'text-orange-600', bg: 'bg-orange-50' }, // Hardcoded for demo
          { icon: CheckCircle, label: 'Taxa Sucesso', value: '85%', color: 'text-green-600', bg: 'bg-green-50' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-[40px] shadow-soft border border-gray-100 flex items-center gap-6">
            <div className={`w-16 h-16 ${item.bg} ${item.color} rounded-3xl flex items-center justify-center`}>
              <item.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{item.label}</p>
              <p className="text-3xl font-black text-primary-dark">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="bg-white p-10 rounded-[50px] shadow-soft border border-gray-100">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black text-primary-dark">Distribuição por Espécie</h3>
            <BarChart3 className="text-gray-300" />
          </div>
          <div className="h-[300px] flex items-center justify-center">
            <Bar data={barData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </div>
        
        <div className="bg-white p-10 rounded-[50px] shadow-soft border border-gray-100">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black text-primary-dark">Status das Adoções</h3>
            <BarChart3 className="text-gray-300" />
          </div>
          <div className="h-[300px] flex items-center justify-center">
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Relatório de Pets Adotados */}
      <div className="bg-white rounded-[50px] shadow-soft border border-gray-100 overflow-hidden">
        <div className="p-10 border-b border-gray-100 bg-gray-50/30">
          <h2 className="text-2xl font-black text-primary-dark">Relatório de Pets Adotados</h2>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center animate-pulse text-gray-400 font-bold uppercase tracking-widest">Carregando relatório...</div>
          ) : adoptedPets.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-10 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Pet</th>
                  <th className="px-10 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">ONG</th>
                  <th className="px-10 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Espécie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {adoptedPets.map((pet) => (
                  <tr key={pet._id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <img src={pet.images[0]?.startsWith('http') ? pet.images[0] : `${API_URL}${pet.images[0]}`} className="w-12 h-12 rounded-xl object-cover" alt="" referrerPolicy="no-referrer" />
                        <span className="font-bold text-primary-dark">{pet.name}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="text-gray-500 font-medium">{pet.ngoId?.name}</span>
                    </td>
                    <td className="px-10 py-6">
                      <span className="text-gray-400 capitalize">{pet.species}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest">
              Nenhum pet adotado ainda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminPets = () => {
  const [pets, setPets] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    species: 'cachorro',
    gender: 'macho',
    color: '',
    age: '',
    size: 'médio',
    healthCondition: '',
    vaccinationStatus: '',
    personality: '',
    likes: '',
    story: '',
    images: [],
    ngoId: '',
    status: 'available'
  });
  const [imageFiles, setImageFiles] = useState([]);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/pets`);
      setPets(res.data);
    } catch (err) {
      console.error('Error fetching pets:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNgos = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/ngos`);
      setNgos(res.data);
    } catch (err) {
      console.error('Error fetching ngos:', err);
    }
  };

  useEffect(() => {
    fetchPets();
    fetchNgos();
  }, []);

  const handleOpenModal = (pet = null) => {
    setImageFiles([]);
    if (pet) {
      setEditingPet(pet);
      setFormData({
        ...pet,
        ngoId: pet.ngoId?._id || pet.ngoId
      });
    } else {
      setEditingPet(null);
      setFormData({
        name: '',
        species: 'cachorro',
        gender: 'macho',
        color: '',
        age: '',
        size: 'médio',
        healthCondition: '',
        vaccinationStatus: '',
        personality: '',
        likes: '',
        story: '',
        images: [],
        ngoId: ngos[0]?._id || '',
        status: 'available'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== 'images') {
        data.append(key, formData[key]);
      }
    });
    
    // Add new files
    imageFiles.forEach(file => {
      data.append('images', file);
    });

    // If editing, tell backend which existing images to keep
    if (editingPet) {
      formData.images.forEach(img => {
        data.append('existingImages', img);
      });
    }

    try {
      const config = {
        headers: { 
          Authorization: `Bearer ${token}`
        }
      };

      if (editingPet) {
        await axios.put(`${API_URL}/api/pets/${editingPet._id}`, data, config);
      } else {
        await axios.post(`${API_URL}/api/pets`, data, config);
      }
      setIsModalOpen(false);
      fetchPets();
    } catch (err) {
      console.error('Error saving pet:', err);
      alert('Erro ao salvar pet. Verifique os campos.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este pet?')) return;
    const token = localStorage.getItem('admin_token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.delete(`${API_URL}/api/pets/${id}`, { headers });
      fetchPets();
    } catch (err) {
      console.error('Error deleting pet:', err);
    }
  };

  return (
    <div className="bg-white rounded-[50px] shadow-soft border border-gray-100 overflow-hidden">
      <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
        <h2 className="text-2xl font-black text-primary-dark">Gerenciar Pets</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-primary py-4 px-8 flex items-center gap-2 text-sm"
        >
          <Plus className="w-5 h-5" /> Adicionar Pet
        </button>
      </div>
      
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-20 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Carregando pets...</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-10 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Pet</th>
                <th className="px-10 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-10 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">ONG</th>
                <th className="px-10 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pets.map((pet) => (
                <tr key={pet._id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <img src={pet.images[0]?.startsWith('http') ? pet.images[0] : `${API_URL}${pet.images[0]}`} className="w-14 h-14 rounded-2xl object-cover" alt={pet.name} referrerPolicy="no-referrer" />
                      <div>
                        <p className="font-bold text-primary-dark text-lg leading-tight">{pet.name}</p>
                        <p className="text-sm text-gray-400 capitalize">{pet.species} • {pet.age}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      pet.status === 'available' ? 'bg-green-100 text-green-600' : 
                      pet.status === 'adopted' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {pet.status === 'available' ? 'Disponível' : pet.status === 'adopted' ? 'Adotado' : 'Reservado'}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    <p className="text-gray-500 font-medium">{pet.ngoId?.name || 'Não atribuída'}</p>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(pet)}
                        className="p-3 text-gray-400 hover:text-primary-dark hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-gray-100 transition-all"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(pet._id)}
                        className="p-3 text-gray-400 hover:text-red-500 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-gray-100 transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Adicionar/Editar */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-primary-dark/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                <h3 className="text-2xl font-black text-primary-dark">
                  {editingPet ? 'Editar Pet' : 'Novo Pet'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-primary-dark transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 overflow-y-auto no-scrollbar space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Nome do Pet</label>
                    <input 
                      type="text" required
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Espécie</label>
                    <select 
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={formData.species}
                      onChange={(e) => setFormData({...formData, species: e.target.value})}
                    >
                      <option value="cachorro">Cachorro</option>
                      <option value="gato">Gato</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Gênero</label>
                    <select 
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    >
                      <option value="macho">Macho</option>
                      <option value="fêmea">Fêmea</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Cor do Pet</label>
                    <input 
                      type="text" required placeholder="Ex: Preto, Branco, Caramelo"
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={formData.color}
                      onChange={(e) => setFormData({...formData, color: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Idade</label>
                    <input 
                      type="text" required placeholder="Ex: 2 anos"
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Porte</label>
                    <select 
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={formData.size}
                      onChange={(e) => setFormData({...formData, size: e.target.value})}
                    >
                      <option value="pequeno">Pequeno</option>
                      <option value="médio">Médio</option>
                      <option value="grande">Grande</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">ONG Responsável</label>
                    <select required
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={formData.ngoId}
                      onChange={(e) => setFormData({...formData, ngoId: e.target.value})}
                    >
                      <option value="">Selecione uma ONG</option>
                      {ngos.map(ngo => (
                        <option key={ngo._id} value={ngo._id}>{ngo.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Status</label>
                    <select 
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="available">Disponível</option>
                      <option value="adopted">Adotado</option>
                      <option value="reserved">Reservado</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Fotos do Pet</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {/* Existing Images */}
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-200 group">
                        <img src={img.startsWith('http') ? img : `${API_URL}${img}`} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                        <button 
                          type="button"
                          onClick={() => setFormData({...formData, images: formData.images.filter((_, i) => i !== idx)})}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    
                    {/* New Selected Files Preview */}
                    {imageFiles.map((file, idx) => (
                      <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-primary/30 bg-primary/5 group">
                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="" />
                        <button 
                          type="button"
                          onClick={() => setImageFiles(imageFiles.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {/* Add Button */}
                    <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-primary gap-2">
                      <Camera className="w-6 h-6" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Adicionar</span>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => setImageFiles([...imageFiles, ...Array.from(e.target.files)])}
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">História do Pet</label>
                  <textarea required rows="4"
                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    value={formData.story}
                    onChange={(e) => setFormData({...formData, story: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Condição de Saúde</label>
                    <input 
                      type="text" required placeholder="Ex: Saudável, castrado"
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={formData.healthCondition}
                      onChange={(e) => setFormData({...formData, healthCondition: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Vacinação</label>
                    <input 
                      type="text" required placeholder="Ex: Todas em dia"
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={formData.vaccinationStatus}
                      onChange={(e) => setFormData({...formData, vaccinationStatus: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Personalidade</label>
                    <input 
                      type="text" required placeholder="Ex: Brincalhão, calmo"
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={formData.personality}
                      onChange={(e) => setFormData({...formData, personality: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">O que gosta</label>
                    <input 
                      type="text" required placeholder="Ex: Brincar de bola, dormir"
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={formData.likes}
                      onChange={(e) => setFormData({...formData, likes: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-4 font-bold text-gray-400 hover:text-primary-dark transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="btn-primary py-4 px-12"
                  >
                    {editingPet ? 'Salvar Alterações' : 'Criar Pet'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AdminNgos = () => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNgo, setEditingNgo] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: {
      address: '',
      city: '',
      state: '',
      latitude: -23.5505,
      longitude: -46.6333
    },
    contact: {
      phone: '',
      email: '',
      social: {
        instagram: '',
        facebook: ''
      }
    },
    logo: ''
  });

  const fetchNgos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/ngos`);
      setNgos(res.data);
    } catch (err) {
      console.error('Error fetching ngos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNgos();
  }, []);

  const handleOpenModal = (ngo = null) => {
    setLogoFile(null);
    if (ngo) {
      setEditingNgo(ngo);
      setFormData({
        name: ngo.name,
        description: ngo.description,
        location: { ...ngo.location },
        contact: { 
          ...ngo.contact,
          social: {
            instagram: ngo.contact.social?.instagram || '',
            facebook: ngo.contact.social?.facebook || ''
          }
        },
        logo: ngo.logo
      });
    } else {
      setEditingNgo(null);
      setFormData({
        name: '',
        description: '',
        location: { address: '', city: '', state: '', latitude: -23.5505, longitude: -46.6333 },
        contact: { 
          phone: '', 
          email: '',
          social: {
            instagram: '',
            facebook: ''
          }
        },
        logo: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    
    console.log('Submitting NGO:', formData);
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('location[address]', formData.location.address);
    data.append('location[city]', formData.location.city);
    data.append('location[state]', formData.location.state);
    data.append('location[latitude]', formData.location.latitude.toString());
    data.append('location[longitude]', formData.location.longitude.toString());
    data.append('contact[phone]', formData.contact.phone);
    data.append('contact[email]', formData.contact.email);
    data.append('contact[social][instagram]', formData.contact.social?.instagram || '');
    data.append('contact[social][facebook]', formData.contact.social?.facebook || '');
    
    if (logoFile) {
      data.append('logo', logoFile);
    } else if (formData.logo) {
      data.append('logo', formData.logo);
    }

    try {
      const config = {
        headers: { 
          Authorization: `Bearer ${token}`
        }
      };

      if (editingNgo) {
        console.log('Updating NGO:', editingNgo._id);
        await axios.put(`${API_URL}/api/ngos/${editingNgo._id}`, data, config);
      } else {
        console.log('Creating new NGO');
        await axios.post(`${API_URL}/api/ngos`, data, config);
      }
      
      alert('ONG salva com sucesso!');
      setIsModalOpen(false);
      fetchNgos();
    } catch (err) {
      console.error('Error saving ngo:', err);
      alert('Erro ao salvar ONG: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir esta ONG?')) return;
    const token = localStorage.getItem('admin_token');
    try {
      await axios.delete(`${API_URL}/api/ngos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNgos();
    } catch (err) {
      console.error('Error deleting ngo:', err);
    }
  };

  return (
    <div className="bg-white rounded-[50px] shadow-soft border border-gray-100 overflow-hidden">
      <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
        <h2 className="text-2xl font-black text-primary-dark">Gerenciar ONGs</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-primary py-4 px-8 flex items-center gap-2 text-sm"
        >
          <Plus className="w-5 h-5" /> Adicionar ONG
        </button>
      </div>

      <div className="p-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-50 rounded-[40px] animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ngos.map((ngo) => (
              <div key={ngo._id} className="group bg-gray-50/50 rounded-[40px] p-8 border border-gray-100 hover:bg-white hover:shadow-xl transition-all relative overflow-hidden">
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src={ngo.logo?.startsWith('http') ? ngo.logo : `${API_URL}${ngo.logo}`} 
                    className="w-16 h-16 rounded-2xl object-cover bg-white shadow-sm" 
                    alt={ngo.name} 
                    referrerPolicy="no-referrer" 
                  />
                  <div>
                    <h3 className="font-bold text-primary-dark text-xl">{ngo.name}</h3>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{ngo.location.city}, {ngo.location.state}</p>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mb-8 line-clamp-2">{ngo.description}</p>
                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  <div className="text-xs font-bold text-primary uppercase tracking-widest">
                    {ngo.animalCount || 0} Pets
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenModal(ngo)} className="p-3 bg-white text-gray-400 hover:text-primary-dark rounded-xl shadow-sm border border-gray-100">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(ngo._id)} className="p-3 bg-white text-gray-400 hover:text-red-500 rounded-xl shadow-sm border border-gray-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal ONG */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-primary-dark/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                <h3 className="text-2xl font-black text-primary-dark">{editingNgo ? 'Editar ONG' : 'Nova ONG'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-primary-dark transition-colors"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 overflow-y-auto no-scrollbar space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Nome da ONG</label>
                    <input type="text" required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Logo da ONG</label>
                    <div className="flex gap-4">
                      <label className="flex-grow px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer text-gray-400 flex items-center gap-3">
                        <Camera className="w-5 h-5" />
                        <span className="text-sm">{logoFile ? logoFile.name : 'Selecionar imagem...'}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => setLogoFile(e.target.files[0])} />
                      </label>
                      <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                        {(logoFile || formData.logo) && (
                          <img 
                            src={logoFile ? URL.createObjectURL(logoFile) : (formData.logo.startsWith('http') ? formData.logo : `${API_URL}${formData.logo}`)} 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer" 
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Descrição</label>
                  <textarea rows="3" required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none resize-none" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Endereço</label>
                    <input type="text" required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none" value={formData.location.address} onChange={(e) => setFormData({...formData, location: {...formData.location, address: e.target.value}})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Cidade</label>
                    <input type="text" required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none" value={formData.location.city} onChange={(e) => setFormData({...formData, location: {...formData.location, city: e.target.value}})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Estado</label>
                    <input type="text" required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none" value={formData.location.state} onChange={(e) => setFormData({...formData, location: {...formData.location, state: e.target.value}})} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Telefone</label>
                    <input type="text" required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none" value={formData.contact.phone} onChange={(e) => setFormData({...formData, contact: {...formData.contact, phone: e.target.value}})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">E-mail</label>
                    <input type="email" required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none" value={formData.contact.email} onChange={(e) => setFormData({...formData, contact: {...formData.contact, email: e.target.value}})} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Instagram (Link)</label>
                    <input type="text" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none" value={formData.contact.social?.instagram} onChange={(e) => setFormData({...formData, contact: {...formData.contact, social: {...formData.contact.social, instagram: e.target.value}}})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Facebook (Link)</label>
                    <input type="text" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none" value={formData.contact.social?.facebook} onChange={(e) => setFormData({...formData, contact: {...formData.contact, social: {...formData.contact.social, facebook: e.target.value}}})} />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Latitude (Mapa)</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none" 
                        value={formData.location.latitude} 
                        onChange={(e) => setFormData({...formData, location: {...formData.location, latitude: e.target.value}})} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Longitude (Mapa)</label>
                      <input 
                        type="text" 
                        required 
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none" 
                        value={formData.location.longitude} 
                        onChange={(e) => setFormData({...formData, location: {...formData.location, longitude: e.target.value}})} 
                      />
                    </div>
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${formData.location.address} ${formData.location.city} ${formData.location.state}`}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline ml-4"
                    >
                      <MapPin className="w-4 h-4" /> Buscar coordenadas no Google Maps
                    </a>
                  </div>
                  
                  {/* Map Preview (Simple Iframe) */}
                  <div className="rounded-[32px] overflow-hidden border border-gray-100 bg-gray-50 aspect-video md:aspect-auto h-full min-h-[150px]">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      frameBorder="0" 
                      style={{ border: 0 }} 
                      src={`https://maps.google.com/maps?q=${formData.location.latitude},${formData.location.longitude}&z=15&output=embed`} 
                      allowFullScreen
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 font-bold text-gray-400 hover:text-primary-dark">Cancelar</button>
                  <button type="submit" className="btn-primary py-4 px-12">{editingNgo ? 'Salvar Alterações' : 'Criar ONG'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AdminAdoptions = () => {
  const [adoptions, setAdoptions] = useState([]);
  const [adoptedPets, setAdoptedPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdoptions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const [adoptionsRes, petsRes] = await Promise.all([
        axios.get(`${API_URL}/api/adoptions`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/api/pets`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      // Sort by status and date to make it a better report
      const sortedAdoptions = adoptionsRes.data.sort((a, b) => {
        if (a.status === 'pending') return -1;
        if (b.status === 'pending') return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setAdoptions(sortedAdoptions);
      
      // Filter adopted pets
      const adopted = petsRes.data.filter(pet => pet.status === 'adopted');
      setAdoptedPets(adopted);
    } catch (err) {
      console.error('Error fetching adoptions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdoptions();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    const token = localStorage.getItem('admin_token');
    try {
      await axios.patch(`${API_URL}/api/adoptions/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAdoptions();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const adoptedCount = adoptions.filter(a => a.status === 'approved').length;

  return (
    <div className="space-y-12">
      {/* Relatório Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[40px] shadow-soft border border-gray-100">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Total Solicitado</p>
          <p className="text-4xl font-black text-primary-dark">{adoptions.length}</p>
        </div>
        <div className="bg-white p-8 rounded-[40px] shadow-soft border border-gray-100">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Adoções Concluídas</p>
          <p className="text-4xl font-black text-green-500">{adoptedCount}</p>
        </div>
        <div className="bg-white p-8 rounded-[40px] shadow-soft border border-gray-100">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Aguardando Análise</p>
          <p className="text-4xl font-black text-orange-500">{adoptions.filter(a => a.status === 'pending').length}</p>
        </div>
      </div>

      <div className="bg-white rounded-[50px] shadow-soft border border-gray-100 overflow-hidden">
        <div className="p-10 border-b border-gray-100 bg-gray-50/30">
          <h2 className="text-2xl font-black text-primary-dark">Solicitações de Adoção</h2>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center animate-pulse text-gray-400 font-bold uppercase tracking-widest">Carregando solicitações...</div>
          ) : adoptions.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-10 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Interessado</th>
                  <th className="px-10 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Pet</th>
                  <th className="px-10 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-10 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {adoptions.map((adoption) => (
                  <tr key={adoption._id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-10 py-6">
                      <p className="font-bold text-primary-dark">{adoption.fullName}</p>
                      <p className="text-sm text-gray-400">{adoption.phone}</p>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <img src={adoption.petId?.images[0]} className="w-10 h-10 rounded-xl object-cover" alt="" referrerPolicy="no-referrer" />
                        <span className="font-bold text-gray-600">{adoption.petId?.name}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        adoption.status === 'pending' ? 'bg-orange-100 text-orange-600' : 
                        adoption.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {adoption.status === 'pending' ? 'Pendente' : adoption.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      {adoption.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleStatusUpdate(adoption._id, 'approved')}
                            className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors"
                            title="Aprovar"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(adoption._id, 'rejected')}
                            className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                            title="Rejeitar"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-32">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                <Heart className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-black text-primary-dark">Nenhuma solicitação nova</h3>
              <p className="text-gray-500 mt-4">Tudo em dia por aqui!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminMessages = () => {
  const socket = useSocket();
  const [conversations, setConversations] = useState({});
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const res = await axios.get(`${API_URL}/api/chat`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Group messages by petId
        const grouped = res.data.reduce((acc, msg) => {
          const id = msg.petId?._id || 'unknown';
          if (!acc[id]) {
            acc[id] = {
              pet: msg.petId,
              messages: []
            };
          }
          acc[id].messages.push(msg);
          return acc;
        }, {});
        
        setConversations(grouped);
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    socket.emit('join_admin');
    
    socket.on('receive_message', (data) => {
      setConversations(prev => {
        const petId = data.petId?._id || data.petId;
        const newConversations = { ...prev };
        
        if (!newConversations[petId]) {
          newConversations[petId] = { 
            pet: data.petId || { _id: petId, name: 'Nova Mensagem', images: [] }, 
            messages: [] 
          };
        }
        
        // Check for duplicates
        const exists = newConversations[petId].messages.some(
          m => (m._id && m._id === data._id) || (m.timestamp === data.timestamp && m.message === data.message)
        );
        
        if (!exists) {
          newConversations[petId].messages = [...newConversations[petId].messages, data];
        }
        return newConversations;
      });
    });

    return () => socket.off('receive_message');
  }, [socket]);

  useEffect(() => {
    if (selectedPetId) {
      socket.emit('join_chat', selectedPetId);
    }
  }, [selectedPetId, socket]);

  useEffect(() => {
    // Scroll to bottom when messages change
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, selectedPetId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedPetId) return;

    const currentPet = conversations[selectedPetId]?.pet;

    const messageData = {
      petId: selectedPetId,
      sender: 'Admin',
      message: newMessage,
      timestamp: new Date(),
      // Add pet details so the client knows which pet this is about if they aren't in a room
      petDetails: currentPet 
    };

    try {
      await axios.post(`${API_URL}/api/chat`, messageData);
      
      // No need to manually emit socket event since the server does it now
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const activeConversations = Object.values(conversations);

  return (
    <div className="bg-white rounded-[50px] shadow-soft border border-gray-100 overflow-hidden h-[75vh] flex">
      {/* Sidebar de Chats */}
      <div className="w-1/3 border-r border-gray-100 flex flex-col">
        <div className="p-8 border-b border-gray-100 bg-gray-50/30">
          <h2 className="text-xl font-black text-primary-dark">Conversas</h2>
        </div>
        <div className="flex-grow overflow-y-auto no-scrollbar">
          {loading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-50 rounded-2xl animate-pulse" />)}
            </div>
          ) : activeConversations.length > 0 ? (
            activeConversations.map((conv) => (
              <button 
                key={conv.pet?._id}
                onClick={() => setSelectedPetId(conv.pet?._id)}
                className={`w-full text-left p-6 flex gap-4 hover:bg-gray-50 transition-colors border-b border-gray-50 ${selectedPetId === conv.pet?._id ? 'bg-primary-light/30' : ''}`}
              >
                <img 
                  src={conv.pet?.images?.[0]?.startsWith('http') ? conv.pet.images[0] : (conv.pet?.images?.[0] ? `${API_URL}${conv.pet.images[0]}` : '')} 
                  className="w-14 h-14 rounded-2xl object-cover" 
                  alt={conv.pet?.name}
                  referrerPolicy="no-referrer"
                />
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-primary-dark truncate">{conv.pet?.name}</h4>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest shrink-0">
                      {new Date(conv.messages[conv.messages.length - 1]?.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {conv.messages[conv.messages.length - 1]?.message}
                  </p>
                </div>
              </button>
            ))
          ) : (
            <div className="p-10 text-center">
              <p className="text-gray-400">Nenhuma conversa ativa.</p>
            </div>
          )}
        </div>
      </div>

      {/* Janela de Chat */}
      <div className="flex-grow flex flex-col bg-gray-50/20">
        {selectedPetId ? (
          <>
            {/* Header do Chat */}
            <div className="p-6 bg-white border-b border-gray-100 flex items-center gap-4">
              <img 
                src={conversations[selectedPetId]?.pet?.images?.[0]?.startsWith('http') ? conversations[selectedPetId].pet.images[0] : (conversations[selectedPetId]?.pet?.images?.[0] ? `${API_URL}${conversations[selectedPetId].pet.images[0]}` : '')} 
                className="w-10 h-10 rounded-xl object-cover" 
                alt={conversations[selectedPetId]?.pet?.name}
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="font-bold text-primary-dark">{conversations[selectedPetId]?.pet?.name}</h3>
                <p className="text-xs text-green-500 font-bold uppercase tracking-widest">Ativo agora</p>
              </div>
            </div>

            {/* Mensagens */}
            <div className="flex-grow overflow-y-auto p-8 space-y-4 no-scrollbar">
              {conversations[selectedPetId]?.messages?.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.sender === 'Admin' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[70%] p-4 rounded-3xl text-sm shadow-sm ${
                    msg.sender === 'Admin' 
                      ? 'bg-primary-dark text-white rounded-tr-none' 
                      : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'
                  }`}>
                    {msg.message}
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-widest">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-8 bg-white border-t border-gray-100">
              <form onSubmit={handleSendMessage} className="relative">
                <input 
                  type="text" 
                  placeholder="Responda para o interessado..." 
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
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-20">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 text-primary">
              <MessageSquare className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-black text-primary-dark mb-4">Selecione uma conversa</h3>
            <p className="text-gray-500 max-w-xs">Escolha um pet na lista à esquerda para ver o histórico e responder mensagens em tempo real.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Dicas',
    content: '',
    image: ''
  });

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/blog`);
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching blog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleOpenModal = (post = null) => {
    setImageFile(null);
    if (post) {
      setEditingPost(post);
      setFormData({ ...post });
    } else {
      setEditingPost(null);
      setFormData({ title: '', category: 'Dicas', content: '', image: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('content', formData.content);
    
    if (imageFile) {
      data.append('image', imageFile);
    } else {
      data.append('image', formData.image);
    }

    try {
      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      if (editingPost) {
        await axios.put(`${API_URL}/api/blog/${editingPost._id}`, data, config);
      } else {
        await axios.post(`${API_URL}/api/blog`, data, config);
      }
      setIsModalOpen(false);
      fetchPosts();
    } catch (err) {
      console.error('Error saving post:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir esta postagem?')) return;
    const token = localStorage.getItem('admin_token');
    try {
      await axios.delete(`${API_URL}/api/blog/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  return (
    <div className="bg-white rounded-[50px] shadow-soft border border-gray-100 overflow-hidden">
      <div className="p-10 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
        <h2 className="text-2xl font-black text-primary-dark">Blog & Galeria</h2>
        <button onClick={() => handleOpenModal()} className="btn-primary py-4 px-8 flex items-center gap-2 text-sm">
          <Plus className="w-5 h-5" /> Nova Postagem
        </button>
      </div>

      <div className="p-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map(i => <div key={i} className="h-64 bg-gray-50 rounded-[40px] animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <div key={post._id} className="group bg-white rounded-[40px] border border-gray-100 overflow-hidden hover:shadow-xl transition-all">
                <div className="relative h-48 overflow-hidden">
                  <img src={post.image?.startsWith('http') ? post.image : `${API_URL}${post.image}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 left-4 px-4 py-1 bg-primary text-primary-dark text-[10px] font-black uppercase rounded-full tracking-widest">
                    {post.category}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-primary-dark mb-4">{post.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-6">{post.content}</p>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleOpenModal(post)} className="p-3 text-gray-400 hover:text-primary-dark"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(post._id)} className="p-3 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Blog */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-primary-dark/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-2xl font-black text-primary-dark">{editingPost ? 'Editar Postagem' : 'Novo Post'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 overflow-y-auto no-scrollbar space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Título</label>
                  <input type="text" required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Categoria</label>
                    <select className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                      <option value="Dicas">Dicas de Cuidados</option>
                      <option value="Adoção">Guia de Adoção</option>
                      <option value="Histórias">Histórias de Sucesso</option>
                      <option value="Eventos">Eventos</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Imagem do Post (JPG/PNG)</label>
                    <div className="flex gap-4">
                      <label className="flex-grow px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer text-gray-400 flex items-center gap-3">
                        <Camera className="w-5 h-5" />
                        <span className="text-sm">{imageFile ? imageFile.name : 'Selecionar imagem...'}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files[0])} />
                      </label>
                      <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                        {(imageFile || formData.image) && (
                          <img 
                            src={imageFile ? URL.createObjectURL(imageFile) : (formData.image.startsWith('http') ? formData.image : `${API_URL}${formData.image}`)} 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer" 
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Conteúdo do Post</label>
                  <textarea rows="6" required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:outline-none resize-none" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} />
                </div>
                <div className="flex justify-end gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 font-bold text-gray-400">Cancelar</button>
                  <button type="submit" className="btn-primary py-4 px-12">Publicar</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AdminSettings = () => {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [heroFile, setHeroFile] = useState(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/hero`);
        setHero(res.data);
      } catch (err) {
        console.error('Error fetching hero:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHero();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    
    const data = new FormData();
    data.append('title', hero.title);
    data.append('subtitle', hero.subtitle);
    data.append('primaryButtonText', hero.primaryButtonText || '');
    data.append('primaryButtonLink', hero.primaryButtonLink || '');
    data.append('secondaryButtonText', hero.secondaryButtonText || '');
    data.append('secondaryButtonLink', hero.secondaryButtonLink || '');
    
    if (heroFile) {
      data.append('image', heroFile);
    } else {
      data.append('imageUrl', hero.imageUrl);
    }

    try {
      await axios.put(`${API_URL}/api/hero`, data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Configurações salvas!');
    } catch (err) {
      console.error('Error saving hero:', err);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-gray-400 font-bold uppercase tracking-widest">Carregando configurações...</div>;

  return (
    <div className="bg-white rounded-[50px] shadow-soft border border-gray-100 overflow-hidden">
      <div className="p-10 border-b border-gray-100 bg-gray-50/30">
        <h2 className="text-2xl font-black text-primary-dark">Configurações do Site</h2>
      </div>
      <form onSubmit={handleSubmit} className="p-10 space-y-10">
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-primary-dark border-l-4 border-primary pl-4">Hero Section (Página Inicial)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Título Principal</label>
              <input type="text" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100" value={hero?.title} onChange={(e) => setHero({...hero, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Imagem de Fundo</label>
              <div className="flex gap-4">
                <label className="flex-grow px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer text-gray-400 flex items-center gap-3">
                  <Camera className="w-5 h-5" />
                  <span className="text-sm">{heroFile ? heroFile.name : 'Alterar imagem...'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setHeroFile(e.target.files[0])} />
                </label>
                <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                  {(heroFile || hero?.imageUrl) && (
                    <img 
                      src={heroFile ? URL.createObjectURL(heroFile) : (hero.imageUrl.startsWith('http') ? hero.imageUrl : `${API_URL}${hero.imageUrl}`)} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer" 
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Subtítulo</label>
            <textarea rows="2" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 resize-none" value={hero?.subtitle} onChange={(e) => setHero({...hero, subtitle: e.target.value})} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="space-y-4">
              <h4 className="font-bold text-gray-500 uppercase text-[10px] tracking-widest ml-4">Botão Primário</h4>
              <input type="text" placeholder="Texto do botão" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 mb-2" value={hero?.primaryButtonText} onChange={(e) => setHero({...hero, primaryButtonText: e.target.value})} />
              <input type="text" placeholder="Link (ex: /pets)" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100" value={hero?.primaryButtonLink} onChange={(e) => setHero({...hero, primaryButtonLink: e.target.value})} />
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-gray-500 uppercase text-[10px] tracking-widest ml-4">Botão Secundário</h4>
              <input type="text" placeholder="Texto do botão" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 mb-2" value={hero?.secondaryButtonText} onChange={(e) => setHero({...hero, secondaryButtonText: e.target.value})} />
              <input type="text" placeholder="Link (ex: #how-it-works)" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100" value={hero?.secondaryButtonLink} onChange={(e) => setHero({...hero, secondaryButtonLink: e.target.value})} />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="btn-primary py-4 px-12">Salvar Configurações</button>
        </div>
      </form>
    </div>
  );
};

export default AdminDashboard;
