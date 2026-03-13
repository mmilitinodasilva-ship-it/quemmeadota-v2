import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Globe, Instagram, Facebook, Heart, Info, Star } from 'lucide-react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { formatImageUrl } from '../utils/imageHelper';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const API_URL = import.meta.env.VITE_API_URL || window.location.origin;

const Ngos = () => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNgos = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/ngos`);
        setNgos(res.data);
      } catch (err) {
        console.error('Error fetching ngos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNgos();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-dark"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="text-center mb-24 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary-dark rounded-full text-xs font-black uppercase tracking-[0.2em]"
          >
            <Heart className="w-4 h-4 fill-current" /> Nossas Parceiras
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-primary-dark leading-tight">
            ONGs que fazem a <span className="text-primary italic">Diferença</span>.
          </h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
            Conheça as instituições dedicadas ao resgate e cuidado animal que transformam o destino de milhares de pets.
          </p>
        </section>

        {/* Map Section */}
        <section className="mb-24">
          <div className="bg-white p-8 rounded-[60px] shadow-soft border border-gray-100 overflow-hidden">
            <h2 className="text-2xl font-black text-primary-dark mb-8 flex items-center gap-4">
              <MapPin className="text-primary" /> Localização das ONGs
            </h2>
            <div className="h-[500px] rounded-[40px] overflow-hidden border border-gray-100 relative z-0">
              <MapContainer 
                center={ngos.length > 0 ? [ngos[0].location.latitude, ngos[0].location.longitude] : [-23.5505, -46.6333]} 
                zoom={ngos.length > 0 ? 12 : 10} 
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {ngos.map((ngo) => (
                  <Marker 
                    key={ngo._id} 
                    position={[ngo.location.latitude || -23.5505, ngo.location.longitude || -46.6333]}
                  >
                    <Popup>
                      <div className="p-2 space-y-2">
                        <img 
                          src={formatImageUrl(ngo.logo, API_URL)} 
                          className="w-12 h-12 rounded-lg object-cover mb-2" 
                          alt="" 
                        />
                        <h4 className="font-bold text-primary-dark">{ngo.name}</h4>
                        <p className="text-xs text-gray-500">{ngo.location.city}, {ngo.location.state}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </section>

        {/* NGOs List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {ngos.map((ngo, i) => (
            <motion.div 
              key={ngo._id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[50px] p-10 shadow-soft border border-gray-100 group hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
            >
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-gray-50 bg-white shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform">
                  <img 
                    src={formatImageUrl(ngo.logo, API_URL)} 
                    className="w-full h-full object-cover" 
                    alt={ngo.name} 
                    referrerPolicy="no-referrer" 
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-primary-dark leading-tight">{ngo.name}</h3>
                  <div className="flex items-center gap-2 text-primary font-bold text-sm mt-2">
                    <Star className="w-4 h-4 fill-current" /> ONG Parceira
                  </div>
                </div>
              </div>

              <p className="text-gray-500 font-medium leading-relaxed mb-8 line-clamp-3">
                {ngo.description}
              </p>

              <div className="space-y-4 pt-8 border-t border-gray-50 mt-auto">
                <div className="flex items-center gap-4 text-gray-500 group-hover:text-primary-dark transition-colors">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-primary/10">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold">{ngo.location.city}, {ngo.location.state}</span>
                </div>
                <div className="flex items-center gap-4 text-gray-500 group-hover:text-primary-dark transition-colors">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-primary/10">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold">{ngo.contact.phone}</span>
                </div>
                <div className="flex items-center gap-4 text-gray-500 group-hover:text-primary-dark transition-colors">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-primary/10">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold truncate">{ngo.contact.email}</span>
                </div>
              </div>

              {ngo.contact.social && (
                <div className="flex gap-4 mt-8 pt-8 border-t border-gray-50">
                  {ngo.contact.social.instagram && (
                    <a href={ngo.contact.social.instagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-primary hover:bg-primary/10 transition-all">
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {ngo.contact.social.facebook && (
                    <a href={ngo.contact.social.facebook} target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all">
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ngos;