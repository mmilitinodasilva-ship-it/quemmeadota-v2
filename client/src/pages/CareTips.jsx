import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, CheckCircle, Info, Star, Coffee, Home, Activity } from 'lucide-react';

const CareTips = () => {
  const tips = [
    {
      title: "Alimentação Balanceada",
      desc: "Ofereça ração de qualidade adequada à idade e ao porte do seu pet. Mantenha sempre água fresca disponível.",
      icon: Coffee,
      color: "text-orange-500",
      bg: "bg-orange-50"
    },
    {
      title: "Saúde e Vacinação",
      desc: "Mantenha as vacinas e o vermífugo em dia. Consultas regulares ao veterinário são essenciais para prevenir doenças.",
      icon: Activity,
      color: "text-red-500",
      bg: "bg-red-50"
    },
    {
      title: "Ambiente Seguro",
      desc: "Prepare a casa para receber o novo amigo. Retire objetos perigosos e instale telas em janelas se necessário.",
      icon: Home,
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      title: "Higiene e Bem-estar",
      desc: "Dê banhos regulares, escove os pelos e mantenha o local de dormir limpo e confortável.",
      icon: Shield,
      color: "text-green-500",
      bg: "bg-green-50"
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary-dark rounded-full text-xs font-black uppercase tracking-[0.2em] mb-8"
        >
          <Star className="w-4 h-4 fill-current" /> Dicas Preciosas
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-black text-primary-dark leading-tight mb-6">
          Cuidados com seu <span className="text-primary">Novo Amigo</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Ter um pet é uma responsabilidade maravilhosa. Preparamos algumas dicas para ajudar você a cuidar bem do seu companheiro.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
        {tips.map((tip, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-8 p-10 bg-gray-50 rounded-[40px] border border-gray-100 group hover:bg-white hover:shadow-2xl transition-all duration-500"
          >
            <div className={`w-20 h-20 ${tip.bg} ${tip.color} rounded-3xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
              <tip.icon className="w-10 h-10" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-primary-dark">{tip.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">{tip.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 text-center">
        <div className="bg-primary-dark rounded-[50px] p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32 opacity-30" />
          <h2 className="text-3xl font-black mb-6 relative z-10">Amor e Paciência</h2>
          <p className="text-white/60 text-lg leading-relaxed relative z-10">
            Lembre-se que cada animal tem seu tempo de adaptação. Seja paciente e ofereça muito carinho. O retorno será um amor incondicional para toda a vida!
          </p>
        </div>
      </section>
    </div>
  );
};

export default CareTips;