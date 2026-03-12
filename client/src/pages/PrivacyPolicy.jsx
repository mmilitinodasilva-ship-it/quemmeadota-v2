import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Bell, UserCheck, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
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
            <Shield className="w-10 h-10" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black leading-tight">Política de Privacidade</h1>
            <p className="text-white/60 text-sm font-bold uppercase tracking-[0.2em]">Última atualização: 10 de Março, 2026</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-12 md:p-20 space-y-16">
          <section className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-primary-dark">Compromisso com a Segurança</h2>
            </div>
            <p className="text-gray-500 font-medium leading-relaxed">
              No Quem Me Adota, levamos a privacidade dos seus dados tão a sério quanto o bem-estar dos nossos pets. Esta política descreve como coletamos, usamos e protegemos as suas informações pessoais quando você utiliza a nossa plataforma.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              { 
                icon: UserCheck, 
                title: 'Dados que Coletamos', 
                text: 'Nome completo, e-mail, telefone e endereço para facilitar o processo de adoção e contato com as ONGs.' 
              },
              { 
                icon: Eye, 
                title: 'Transparência', 
                text: 'Seus dados são compartilhados apenas com a ONG responsável pelo pet que você demonstrou interesse.' 
              },
              { 
                icon: Bell, 
                title: 'Comunicações', 
                text: 'Enviamos atualizações sobre o seu processo de adoção e novidades da plataforma, sempre com sua permissão.' 
              },
              { 
                icon: Shield, 
                title: 'Seus Direitos', 
                text: 'Você pode solicitar a exclusão ou alteração dos seus dados a qualquer momento através do nosso suporte.' 
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
            <h2 className="text-2xl font-black text-primary-dark">Segurança Técnica</h2>
            <p className="text-gray-500 font-medium leading-relaxed">
              Utilizamos criptografia de ponta a ponta e servidores seguros para garantir que suas informações estejam protegidas contra acessos não autorizados. Regularmente revisamos nossos processos internos de segurança.
            </p>
          </section>

          <section className="text-center space-y-6 pt-10">
            <div className="inline-flex items-center gap-4 px-8 py-4 bg-gray-50 rounded-full border border-gray-100">
              <Mail className="w-5 h-5 text-gray-400" />
              <span className="text-gray-500 font-bold">privacidade@quemmeadota.com.br</span>
            </div>
            <p className="text-xs text-gray-400 font-medium max-w-sm mx-auto">
              Dúvidas sobre como tratamos seus dados? Entre em contato com o nosso encarregado de proteção de dados (DPO).
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;