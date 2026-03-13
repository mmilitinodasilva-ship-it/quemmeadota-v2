import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoriteContext';
import axios from 'axios';
import { formatImageUrl } from '../utils/imageHelper';

const API_URL = import.meta.env.VITE_API_URL || window.location.origin;

const Favorites = () => {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [favoritePets, setFavoritePets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoritePets = async () => {
      if (favorites.length === 0) {
        setFavoritePets([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch only available pets and filter them by favorites IDs
        const response = await axios.get(`${API_URL}/api/pets?status=available`);
        const filtered = response.data.filter(pet => favorites.includes(pet._id));
        setFavoritePets(filtered);
      } catch (error) {
        console.error('Error fetching favorite pets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritePets();
  }, [favorites]);

  return (
    <div className="min-h-screen bg-gray-50/50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20">
          <h1 className="text-5xl font-black text-primary-dark mb-6 tracking-tight">Meus Favoritos</h1>
          <p className="text-gray-500 text-xl max-w-2xl leading-relaxed">
            Aqui estão os amiguinhos que ganharam seu coração. Salve seus pets favoritos para acompanhar suas histórias e decidir sobre a adoção.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-[40px] h-[450px] animate-pulse shadow-soft border border-gray-100" />
            ))}
          </div>
        ) : favoritePets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <AnimatePresence>
              {favoritePets.map((pet, idx) => (
                <motion.div
                  key={pet._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group bg-white rounded-[40px] overflow-hidden shadow-soft border border-gray-100 card-hover relative flex flex-col h-full"
                >
                  <Link to={`/pets/${pet._id}`} className="flex flex-col h-full">
                  <div className="relative aspect-square overflow-hidden m-4 rounded-[32px]">
                    <img 
                      src={formatImageUrl(pet.images[0], API_URL)} 
                      alt={pet.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute top-4 right-4">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            toggleFavorite(pet._id);
                          }}
                          className={`p-3 bg-white/90 backdrop-blur-sm rounded-full transition-all shadow-xl hover:scale-110 active:scale-95 ${isFavorite(pet._id) ? 'text-red-500' : 'text-gray-400'}`}
                        >
                          <Heart className={`w-5 h-5 ${isFavorite(pet._id) ? 'fill-current' : ''}`} />
                        </button>
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
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[60px] shadow-soft border border-gray-100 px-8 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
            <div className="w-24 h-24 bg-primary-light text-primary rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-lg shadow-primary/10">
              <Heart className="w-12 h-12" />
            </div>
            <h3 className="text-3xl font-black text-primary-dark mb-4">Sua lista está vazia</h3>
            <p className="text-gray-500 text-lg mb-12 max-w-sm mx-auto">
              Nenhum pet foi favoritado ainda. Explore nossa lista e encontre seu novo melhor amigo!
            </p>
            <Link to="/pets" className="btn-primary inline-flex items-center gap-3 px-10 py-5 text-xl group">
              Explorar Pets
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
