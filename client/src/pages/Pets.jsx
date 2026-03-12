import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MapPin, Heart, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useFavorites } from '../context/FavoriteContext';

const API_URL = import.meta.env.VITE_API_URL || window.location.origin;

const Pets = () => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    species: '',
    size: '',
    age: '',
    gender: '',
    color: '',
    search: ''
  });

  const fetchPets = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/pets`, { 
        params: { ...filters, status: 'available' } 
      });
      setPets(response.data);
    } catch (err) {
      console.error('Error fetching pets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Search */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary-dark mb-6 tracking-tight">Encontre seu novo melhor amigo</h1>
          <div className="relative group max-w-xl mx-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              name="search"
              placeholder="Buscar por nome do pet..." 
              value={filters.search}
              onChange={handleFilterChange}
              className="w-full pl-16 pr-8 py-5 bg-white rounded-3xl border border-gray-100 shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/20 text-lg transition-all"
            />
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
            <Filter className="w-4 h-4 text-gray-400" />
            <select name="species" value={filters.species} onChange={handleFilterChange} className="bg-transparent focus:outline-none font-medium text-gray-600 cursor-pointer">
              <option value="">Espécie</option>
              <option value="cachorro">Cachorros</option>
              <option value="gato">Gatos</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
            <select name="size" value={filters.size} onChange={handleFilterChange} className="bg-transparent focus:outline-none font-medium text-gray-600 cursor-pointer">
              <option value="">Porte</option>
              <option value="pequeno">Pequeno</option>
              <option value="médio">Médio</option>
              <option value="grande">Grande</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
            <select name="age" value={filters.age} onChange={handleFilterChange} className="bg-transparent focus:outline-none font-medium text-gray-600 cursor-pointer">
              <option value="">Idade</option>
              <option value="filhote">Filhote</option>
              <option value="adulto">Adulto</option>
              <option value="sênior">Sênior</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
            <select name="gender" value={filters.gender} onChange={handleFilterChange} className="bg-transparent focus:outline-none font-medium text-gray-600 cursor-pointer">
              <option value="">Gênero</option>
              <option value="macho">Macho</option>
              <option value="fêmea">Fêmea</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
            <select name="color" value={filters.color} onChange={handleFilterChange} className="bg-transparent focus:outline-none font-medium text-gray-600 cursor-pointer">
              <option value="">Cor</option>
              <option value="preto">Preto</option>
              <option value="branco">Branco</option>
              <option value="caramelo">Caramelo</option>
              <option value="marrom">Marrom</option>
              <option value="cinza">Cinza</option>
              <option value="malhado">Malhado</option>
            </select>
          </div>

          <button 
            onClick={() => setFilters({ species: '', size: '', age: '', gender: '', color: '', search: '' })}
            className="text-primary-dark font-bold text-sm underline px-4 py-2 hover:opacity-70 transition-opacity"
          >
            Limpar filtros
          </button>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          <AnimatePresence>
            {loading ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-[40px] h-[450px] animate-pulse overflow-hidden shadow-soft border border-gray-100">
                  <div className="bg-gray-200 h-[300px]" />
                  <div className="p-8 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </div>
                </div>
              ))
            ) : pets.length > 0 ? (
              pets.map((pet, idx) => (
                <motion.div
                  key={pet._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="group bg-white rounded-[40px] overflow-hidden shadow-soft border border-gray-100 card-hover relative flex flex-col h-full"
                >
                  <Link to={`/pets/${pet._id}`} className="flex flex-col h-full">
                    <div className="relative aspect-[1/1] overflow-hidden m-4 rounded-[32px]">
                      <img 
                        src={pet.images[0]?.startsWith('http') ? pet.images[0] : `${API_URL}${pet.images[0]}`} 
                        alt={pet.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 right-4">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            toggleFavorite(pet._id);
                          }}
                          className={`p-3 bg-white/90 backdrop-blur-sm rounded-full transition-all shadow-xl hover:scale-110 active:scale-95 ${isFavorite(pet._id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                        >
                          <Heart className={`w-5 h-5 ${isFavorite(pet._id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <span className="px-4 py-1.5 bg-primary-dark/80 backdrop-blur-sm text-white text-xs font-bold rounded-full uppercase tracking-widest">
                          {pet.species}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-8 flex flex-col flex-grow">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-primary-dark">{pet.name}</h3>
                        <span className="text-primary font-bold">{pet.age}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                        <MapPin className="w-4 h-4" />
                        <span>{pet.ngoId?.location?.city}, {pet.ngoId?.location?.state}</span>
                      </div>
                      
                      <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                          <span>{pet.size}</span>
                        </div>
                        <span className="text-primary-dark font-bold group-hover:translate-x-1 transition-transform">
                          Ver detalhes →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-primary-dark" />
                </div>
                <h3 className="text-2xl font-bold text-primary-dark mb-2">Nenhum pet encontrado</h3>
                <p className="text-gray-500">Tente ajustar seus filtros para encontrar outros amigos.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Pets;
