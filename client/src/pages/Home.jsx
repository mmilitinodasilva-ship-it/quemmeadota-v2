import React, { useEffect, useState } from 'react';
import { Search, Heart, MapPin, ChevronRight, CheckCircle, ArrowRight, Shield, Info, FileText, Star, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useFavorites } from '../context/FavoriteContext';

const API_URL = import.meta.env.VITE_API_URL || window.location.origin;

const Home = () => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [heroData, setHeroData] = useState({
    title: "Encontre um amigo para a vida toda",
    subtitle: "Dê um novo começo para um animal que espera por você. Adote com responsabilidade e receba amor incondicional.",
    imageUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1200"
  });
  const [pets, setPets] = useState([]);
  const [ngos, setNgos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroRes, petsRes, ngosRes] = await Promise.all([
          axios.get(`${API_URL}/api/hero`),
          axios.get(`${API_URL}/api/pets?status=available`),
          axios.get(`${API_URL}/api/ngos`)
        ]);
        if (heroRes.data) setHeroData(heroRes.data);
        setPets(petsRes.data.slice(0, 4));
        setNgos(ngosRes.data.slice(0, 3)); // Mostra apenas as 3 primeiras (parceiras)
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gray-50/50">
        <div className="absolute top-0 left-0 w-full h-full bg-primary/5 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-primary/10 text-primary-dark rounded-full font-bold text-sm uppercase tracking-widest">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Plataforma de Adoção Responsável
              </div>
              <h1 className="text-6xl lg:text-8xl font-black text-primary-dark leading-[0.9] tracking-tighter">
                {heroData.title}
              </h1>
              <p className="text-xl text-gray-500 max-w-xl leading-relaxed">
                {heroData.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link to="/pets" className="btn-primary px-10 py-5 text-xl flex items-center justify-center gap-3 group">
                  Encontrar um Pet
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#how-it-works" className="px-10 py-5 text-xl font-bold text-primary-dark border-4 border-primary-light rounded-3xl hover:bg-primary-light/30 transition-all flex items-center justify-center">
                  Como Funciona
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                <img 
                  src={heroData.imageUrl.startsWith('http') ? heroData.imageUrl : `${API_URL}${heroData.imageUrl}`} 
                  alt="Happy Pet" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer" 
                />
              </div>
              {/* Floating Stats */}
              <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hidden sm:block animate-bounce-slow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                    <Heart className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-primary-dark">500+</p>
                    <p className="text-xs text-gray-400 font-bold uppercase">Adoções Realizadas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section id="how-it-works" className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-primary-light/10 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-24 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary-dark rounded-full text-xs font-black uppercase tracking-[0.2em]">
              <Star className="w-4 h-4 fill-current" /> Guia Prático
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-primary-dark leading-tight">Como funciona a adoção?</h2>
            <p className="text-gray-500 text-xl max-w-2xl mx-auto leading-relaxed">
              O processo é simples, seguro e focado no bem-estar do animal. Veja o passo a passo para encontrar seu novo melhor amigo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-16 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/3 left-0 w-full h-1 border-t-4 border-dashed border-primary/20 -z-10" />
            
            {[
              {
                step: "01",
                title: "Escolha seu Amigo",
                desc: "Navegue pela nossa lista de pets e use os filtros para encontrar aquele que mais combina com seu estilo de vida.",
                img: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=400",
                color: "bg-blue-50 text-blue-600",
                icon: Search
              },
              {
                step: "02",
                title: "Inicie uma Conversa",
                desc: "Tire suas dúvidas diretamente com a ONG responsável através do nosso chat integrado em tempo real.",
                img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400",
                color: "bg-primary-light text-primary-dark",
                icon: MessageSquare
              },
              {
                step: "03",
                title: "Solicite a Adoção",
                desc: "Preencha o formulário de interesse. A ONG analisará seu perfil para garantir uma adoção responsável e feliz.",
                img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=400",
                color: "bg-green-50 text-green-600",
                icon: Heart
              }
            ].map((step, i) => (
              <div key={i} className="group relative">
                <div className="relative z-10 p-10 rounded-[50px] bg-white border border-gray-100 shadow-soft group-hover:shadow-2xl group-hover:-translate-y-4 transition-all duration-500">
                  <div className="absolute -top-6 -left-6 w-16 h-16 bg-primary-dark text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl">
                    {step.step}
                  </div>
                  
                  <div className="aspect-[4/3] rounded-3xl overflow-hidden mb-10 shadow-lg border-4 border-gray-50">
                    <img src={step.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                  </div>
                  
                  <div className="space-y-4">
                    <div className={`w-12 h-12 ${step.color} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform`}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-black text-primary-dark">{step.title}</h3>
                    <p className="text-gray-500 font-medium leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Pets */}
      <section className="py-32 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-center md:text-left">
            <div>
              <h2 className="text-5xl font-black text-primary-dark mb-6">Amigos esperando por você</h2>
              <p className="text-gray-500 text-xl max-w-xl">Conheça alguns dos nossos moradores que estão prontos para ganhar um lar.</p>
            </div>
            <Link to="/pets" className="btn-primary px-8 py-4 flex items-center gap-2 group whitespace-nowrap">
              Ver todos os pets
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {pets.map((pet) => (
              <div key={pet._id} className="group bg-white rounded-[40px] overflow-hidden shadow-soft border border-gray-100 card-hover relative flex flex-col h-full">
                <Link to={`/pets/${pet._id}`} className="flex flex-col h-full">
                  <div className="relative aspect-[4/5] overflow-hidden m-4 rounded-[32px]">
                    <img 
                      src={pet.images[0].startsWith('http') ? pet.images[0] : `${API_URL}${pet.images[0]}`} 
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
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                      <span className="px-4 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-widest text-primary-dark shadow-sm">
                        {pet.age}
                      </span>
                      <span className="px-4 py-1.5 bg-primary/90 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-widest text-primary-dark shadow-sm capitalize">
                        {pet.gender}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8 pt-4 flex flex-col flex-grow text-center">
                    <h3 className="text-2xl font-bold text-primary-dark mb-2">{pet.name}</h3>
                    <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-6">
                      <MapPin className="w-4 h-4" />
                      <span>{pet.ngoId?.location?.city}, {pet.ngoId?.location?.state}</span>
                    </div>
                    <div className="mt-auto pt-6 border-t border-gray-50 text-primary-dark font-bold group-hover:text-primary transition-colors">
                      Ver detalhes →
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ONGs Parceiras Section */}
      <section id="ngos" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-center md:text-left">
            <div>
              <h2 className="text-5xl font-black text-primary-dark mb-6">ONGs Parceiras</h2>
              <p className="text-gray-500 text-xl max-w-xl">Trabalhamos com instituições que dedicam suas vidas ao resgate e cuidado animal.</p>
            </div>
            <Link to="/ngos" className="btn-primary px-8 py-4 flex items-center gap-2 group whitespace-nowrap">
              Ver todas as ONGs
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {ngos.map((ngo) => (
              <div key={ngo._id} className="group bg-gray-50/50 rounded-[40px] p-10 border border-gray-100 hover:bg-white hover:shadow-2xl transition-all text-center">
                <img 
                  src={ngo.logo.startsWith('http') ? ngo.logo : `${API_URL}${ngo.logo}`} 
                  className="w-24 h-24 rounded-3xl object-cover bg-white shadow-lg mx-auto mb-8 group-hover:scale-110 transition-transform" 
                  alt={ngo.name} 
                  referrerPolicy="no-referrer" 
                />
                <h4 className="font-black text-2xl text-primary-dark mb-4">{ngo.name}</h4>
                <p className="text-gray-500 mb-8 line-clamp-3 leading-relaxed">{ngo.description}</p>
                <div className="pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-primary font-bold">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{ngo.location.city}, {ngo.location.state}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Novas Abas / Informações Gerais */}
      <section className="py-32 bg-primary-dark text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-3 gap-16">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-primary">
                <Info className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black">Sobre Nós</h3>
              <p className="text-white/60 leading-relaxed">
                Somos uma ponte entre corações solidários e animais que precisam de um lar. Nossa missão é facilitar a adoção responsável através da tecnologia e transparência.
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                Conheça nossa história <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-primary">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black">ONGs Parceiras</h3>
              <p className="text-white/60 leading-relaxed">
                Trabalhamos em conjunto com instituições sérias que dedicam suas vidas ao resgate e cuidado animal em todo o Brasil.
              </p>
              <Link to="/ngos" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                Ver Localizações <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-primary">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black">Termos de Uso</h3>
              <p className="text-white/60 leading-relaxed">
                Ao utilizar nossa plataforma, você concorda com nossas diretrizes de adoção responsável e respeito aos animais.
              </p>
              <Link to="/terms" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                Ler Termos <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
