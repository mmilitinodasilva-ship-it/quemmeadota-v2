import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Star, Shield, Heart, Info, Coffee, HelpCircle, ArrowRight } from 'lucide-react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const questions = [
    {
      question: "Como funciona o processo de adoção?",
      answer: "O processo começa com a escolha de um pet no catálogo. Após isso, você entra em contato com a ONG via chat e preenche um formulário de interesse. A ONG analisará seu perfil para garantir uma adoção responsável.",
      icon: Heart,
      color: "text-red-500",
      bg: "bg-red-50"
    },
    {
      question: "Quais os requisitos para adotar um pet?",
      answer: "Os requisitos variam entre as ONGs, mas geralmente incluem: ser maior de 18 anos, ter um local seguro para o animal (sem rotas de fuga), concordar com as diretrizes de posse responsável e possuir condições financeiras para os cuidados básicos.",
      icon: Shield,
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      question: "Existe algum custo para adotar?",
      answer: "Nossa plataforma não cobra taxas de adoção. Algumas ONGs parceiras podem solicitar uma contribuição voluntária ou ajuda de custo para as despesas veterinárias (vacinas, castração) realizadas no pet resgatado.",
      icon: Coffee,
      color: "text-orange-500",
      bg: "bg-orange-50"
    },
    {
      question: "Como posso falar com a ONG?",
      answer: "Cada pet em nossa plataforma possui um botão 'Quero Adotar' que abre um chat direto com a ONG responsável. Você pode tirar dúvidas e enviar fotos do seu local de moradia por lá.",
      icon: HelpCircle,
      color: "text-primary-dark",
      bg: "bg-primary-light/50"
    },
    {
      question: "Posso devolver o pet se houver problemas?",
      answer: "A adoção é um compromisso para toda a vida. No entanto, se houver problemas graves de adaptação, a ONG deve ser contatada imediatamente para orientações ou devolução responsável, garantindo que o animal não seja abandonado.",
      icon: Info,
      color: "text-green-500",
      bg: "bg-green-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <section className="max-w-4xl mx-auto text-center mb-24 space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary-dark rounded-full text-xs font-black uppercase tracking-[0.2em]"
        >
          <Star className="w-4 h-4 fill-current" /> Perguntas Frequentes
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-black text-primary-dark leading-tight">
          Dúvidas? <span className="text-primary italic">Nós respondemos</span>.
        </h1>
        <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
          Encontre respostas rápidas para as dúvidas mais comuns sobre o processo de adoção e o funcionamento da nossa plataforma.
        </p>
      </section>

      <section className="max-w-3xl mx-auto space-y-6">
        {questions.map((q, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[40px] shadow-soft border border-gray-100 overflow-hidden hover:shadow-xl transition-all"
          >
            <button 
              onClick={() => setActiveIndex(activeIndex === i ? null : i)}
              className="w-full p-10 flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-8">
                <div className={`w-14 h-14 ${q.bg} ${q.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <q.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-primary-dark leading-tight">{q.question}</h3>
              </div>
              <div className={`p-4 rounded-xl bg-gray-50 text-gray-400 group-hover:text-primary transition-colors ${activeIndex === i ? 'bg-primary/10 text-primary rotate-180' : ''}`}>
                <ChevronDown className="w-6 h-6" />
              </div>
            </button>
            
            <AnimatePresence>
              {activeIndex === i && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-10 pb-12 pt-4 flex gap-8">
                    <div className="w-14 h-14 flex-shrink-0" /> {/* Spacer */}
                    <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-xl">
                      {q.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </section>

      <section className="max-w-4xl mx-auto mt-32">
        <div className="bg-primary-dark rounded-[60px] p-12 lg:p-24 text-center space-y-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -ml-32 -mt-32 opacity-30" />
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight relative z-10">
            Ainda tem dúvidas? <br /> <span className="text-primary italic">Fale conosco agora mesmo</span>.
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
            <motion.a 
              href="mailto:contato@quemmeadota.com.br"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 bg-primary text-primary-dark font-black rounded-full shadow-2xl shadow-primary/20 transition-all flex items-center gap-4"
            >
              Enviar E-mail <ArrowRight className="w-6 h-6" />
            </motion.a>
            <motion.a 
              href="/about"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 bg-white/10 text-white font-black rounded-full border border-white/20 hover:bg-white/20 transition-all"
            >
              Conheça nossa história
            </motion.a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;