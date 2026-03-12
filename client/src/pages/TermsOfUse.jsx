import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, AlertCircle, Info, Star, Gavel } from 'lucide-react';

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-[60px] shadow-soft border border-gray-100 overflow-hidden"
      >
        {/* Header */}
        <div className="p-12 md:p-20 bg-primary-dark text-white text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32 opacity-30" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-light/10 rounded-full blur-3xl -ml-32 -mb-32 opacity-30" />
          
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-3xl text-primary-dark shadow-2xl shadow-primary/20 mb-4">
            <Gavel className="w-10 h-10" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black leading-tight">Termos de Uso</h1>
            <p className="text-white/60 text-sm font-bold uppercase tracking-[0.2em]">Versão 2.1 - Atualizado em Março 2026</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-12 md:p-20 space-y-16">
          <section className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Info className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-primary-dark">Sobre a Plataforma</h2>
            </div>
            <p className="text-gray-500 font-medium leading-relaxed">
              O Quem Me Adota é uma plataforma que conecta interessados em adotar pets com ONGs e protetores. Ao utilizar nossos serviços, você concorda em cumprir as diretrizes aqui estabelecidas para garantir um ambiente seguro e amoroso para todos.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { 
                icon: CheckCircle, 
                title: 'Responsabilidade', 
                text: 'Ao demonstrar interesse em um pet, você se compromete a fornecer informações verídicas e estar ciente das responsabilidades de uma adoção.' 
              },
              { 
                icon: AlertCircle, 
                title: 'Restrições', 
                text: 'É proibido o uso da plataforma para comercialização de animais, maus-tratos ou qualquer atividade ilegal.' 
              },
              { 
                icon: Star, 
                title: 'Processo de Adoção', 
                text: 'Cada ONG possui seus próprios critérios de avaliação. A plataforma não garante a aprovação de todas as solicitações.' 
              },
              { 
                icon: FileText, 
                title: 'Propriedade Intelectual', 
                text: 'As fotos e textos publicados no site são de propriedade dos seus respectivos autores e da plataforma.' 
              }
            ].map((item, i) => (
              <div key={i} className="space-y-4 p-8 bg-gray-50 rounded-[40px] border border-gray-100 group hover:bg-white hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-white text-primary rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-primary-dark">{item.title}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{item.text}</p>
              </div>
            ))}
          </section>

          <section className="p-12 bg-primary/5 rounded-[50px] border border-primary/10 space-y-6">
            <h2 className="text-2xl font-black text-primary-dark">Atualizações dos Termos</h2>
            <p className="text-gray-500 font-medium leading-relaxed">
              Podemos atualizar estes termos ocasionalmente para refletir mudanças em nossos serviços ou na legislação. Recomendamos que você revise esta página periodicamente. O uso continuado da plataforma após as alterações constitui aceitação dos novos termos.
            </p>
          </section>

          <section className="text-center pt-10">
            <p className="text-xs text-gray-400 font-medium max-w-sm mx-auto">
              Ao continuar navegando no Quem Me Adota, você concorda com nossos termos e com o compromisso de tratar todos os animais com respeito e carinho.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsOfUse;