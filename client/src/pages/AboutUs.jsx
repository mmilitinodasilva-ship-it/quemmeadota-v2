import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Shield, Target, Award, Star } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white pt-24 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 relative">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-primary-light/10 rounded-full blur-3xl -z-10" />
        
        <div className="text-center max-w-3xl mx-auto space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary-dark rounded-full text-xs font-black uppercase tracking-[0.2em]"
          >
            <Heart className="w-4 h-4 fill-current" /> Nossa História
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-primary-dark leading-[1.1] tracking-tight"
          >
            Conectando Corações e <span className="text-primary italic">Transformando Vidas</span>.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-500 font-medium leading-relaxed"
          >
            O Quem Me Adota nasceu de um sonho simples: garantir que nenhum animal de estimação fique sem um lar cheio de amor e que nenhuma pessoa fique sem a alegria de ter um melhor amigo de quatro patas.
          </motion.p>
        </div>
      </section>

      {/* Values Grid */}
      <section className="bg-gray-50 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                icon: Target, 
                title: 'Nossa Missão', 
                text: 'Facilitar o encontro entre pets resgatados e adotantes responsáveis através de tecnologia e amor.',
                color: 'text-blue-500',
                bg: 'bg-blue-50'
              },
              { 
                icon: Shield, 
                title: 'Adoção Responsável', 
                text: 'Promovemos a educação sobre os cuidados necessários para garantir o bem-estar animal por toda a vida.',
                color: 'text-green-500',
                bg: 'bg-green-50'
              },
              { 
                icon: Users, 
                title: 'Nossa Comunidade', 
                text: 'Trabalhamos lado a lado com ONGs e protetores independentes para fortalecer a causa animal.',
                color: 'text-red-500',
                bg: 'bg-red-50'
              }
            ].map((value, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-12 rounded-[50px] shadow-soft border border-gray-100 space-y-6 group hover:-translate-y-2 transition-all"
              >
                <div className={`w-16 h-16 ${value.bg} ${value.color} rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-primary-dark">{value.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{value.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team/Impact Section */}
      <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-primary-dark">Por que existimos?</h2>
            <p className="text-lg text-gray-500 font-medium leading-relaxed">
              No Brasil, estima-se que existam milhões de animais vivendo em situação de rua ou em abrigos superlotados. Ao mesmo tempo, milhares de pessoas buscam por um companheiro, mas não sabem por onde começar. Nós somos a ponte.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Pets Adotados', value: '1,200+' },
              { label: 'ONGs Parceiras', value: '85+' },
              { label: 'Cidades Atendidas', value: '42' },
              { label: 'Vidas Mudadas', value: '2,400+' },
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <p className="text-4xl font-black text-primary">{stat.value}</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-primary-dark rounded-[60px] p-12 md:p-24 text-center space-y-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -ml-32 -mt-32" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-light/10 rounded-full blur-3xl -mr-32 -mb-32" />
          
          <h2 className="text-4xl md:text-5xl font-black text-white max-w-2xl mx-auto leading-tight relative z-10">
            Pronto para começar uma história de amor?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <motion.a 
              href="/pets"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 bg-primary text-primary-dark font-black rounded-full shadow-2xl shadow-primary/20 transition-all"
            >
              Encontrar meu Pet
            </motion.a>
            <motion.a 
              href="/#ngos"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 bg-white/10 text-white font-black rounded-full border border-white/20 hover:bg-white/20 transition-all"
            >
              Ver ONGs Parceiras
            </motion.a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;