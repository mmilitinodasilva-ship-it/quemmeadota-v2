import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Heart, Star, Shield, Info, ArrowRight, UserCheck, Search, MessageSquare } from 'lucide-react';

const AdoptionGuide = () => {
  const steps = [
    {
      title: "Pesquise seu Pet",
      desc: "Navegue pelo nosso catálogo de animais. Considere o porte, o comportamento e a compatibilidade com sua rotina.",
      icon: Search,
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      title: "Entre em Contato",
      desc: "Tire suas dúvidas através do chat integrado com a ONG responsável. Conheça a história e as necessidades do pet.",
      icon: MessageSquare,
      color: "text-primary-dark",
      bg: "bg-primary-light/50"
    },
    {
      title: "Solicite a Adoção",
      desc: "Preencha o formulário com suas informações. A ONG analisará seu perfil para garantir uma adoção responsável.",
      icon: UserCheck,
      color: "text-green-500",
      bg: "bg-green-50"
    },
    {
      title: "Aprovado para Adoção",
      desc: "Após a aprovação, você receberá as instruções para buscar seu novo amigo e formalizar o termo de adoção.",
      icon: Heart,
      color: "text-red-500",
      bg: "bg-red-50"
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 overflow-hidden">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-24 relative">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary-dark rounded-full text-xs font-black uppercase tracking-[0.2em] mb-8"
        >
          <Heart className="w-4 h-4 fill-current" /> Guia Completo
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-black text-primary-dark leading-tight mb-6">
          Guia de <span className="text-primary italic">Adoção Responsável</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Tudo o que você precisa saber para transformar a vida de um animal e a sua também.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 relative">
        <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 w-1 border-l-4 border-dashed border-primary/20 -translate-x-1/2 -z-10" />
        
        {steps.map((step, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 ${i % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}
          >
            <div className="lg:w-1/2 flex justify-center">
              <div className={`w-32 h-32 lg:w-48 lg:h-48 ${step.bg} ${step.color} rounded-[40px] flex items-center justify-center shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform`}>
                <step.icon className="w-16 h-16 lg:w-24 lg:h-24" />
              </div>
            </div>
            <div className={`lg:w-1/2 text-center lg:text-left space-y-6 ${i % 2 === 0 ? 'lg:text-left' : 'lg:text-right'}`}>
              <div className="inline-block px-4 py-1 bg-primary-dark text-white rounded-full text-sm font-black uppercase tracking-widest">
                Passo {i + 1}
              </div>
              <h3 className="text-3xl lg:text-4xl font-black text-primary-dark">{step.title}</h3>
              <p className="text-lg lg:text-xl text-gray-500 font-medium leading-relaxed">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-48">
        <div className="bg-gray-50 rounded-[60px] p-12 lg:p-24 border border-gray-100 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-primary-dark">Pronto para dar esse passo?</h2>
            <p className="text-lg text-gray-500 font-medium leading-relaxed">
              Temos centenas de animais esperando por um lar amoroso agora mesmo. Comece sua busca hoje e encontre seu novo melhor amigo.
            </p>
            <motion.a 
              href="/pets"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-4 px-12 py-5 bg-primary text-primary-dark font-black rounded-full shadow-2xl shadow-primary/20 transition-all"
            >
              Encontrar meu Pet <ArrowRight className="w-6 h-6" />
            </motion.a>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="aspect-square bg-white p-8 rounded-[40px] shadow-soft border border-gray-100 flex flex-col items-center justify-center text-center space-y-4">
              <Shield className="w-12 h-12 text-blue-500" />
              <p className="font-bold text-primary-dark">Segurança Garantida</p>
            </div>
            <div className="aspect-square bg-white p-8 rounded-[40px] shadow-soft border border-gray-100 flex flex-col items-center justify-center text-center space-y-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
              <p className="font-bold text-primary-dark">Acompanhamento</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdoptionGuide;