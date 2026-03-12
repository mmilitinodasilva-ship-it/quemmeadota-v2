import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary-dark text-white pt-16 pb-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative w-10 h-10 bg-primary flex items-center justify-center rounded-xl text-primary-dark shadow-xl shadow-primary/10">
                <Heart className="w-6 h-6 fill-current" />
              </div>
              <span className="text-xl font-black tracking-tight">Quem Me Adota</span>
            </Link>
            <p className="text-white/50 text-base leading-relaxed">
              Conectando corações e transformando vidas através da adoção responsável de cães e gatos em todo o Brasil.
            </p>
            <div className="flex space-x-4">
              {[
                { Icon: Instagram, href: "https://instagram.com" },
                { Icon: Facebook, href: "https://facebook.com" },
                { Icon: Twitter, href: "https://twitter.com" }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-primary hover:text-primary-dark transition-all group"
                >
                  <social.Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold border-l-4 border-primary pl-4">Explorar</h4>
            <ul className="space-y-3">
              <li><Link to="/pets" className="text-white/50 hover:text-white transition-colors text-sm">Ver pets disponíveis</Link></li>
              <li><Link to="/adoption-guide" className="text-white/50 hover:text-white transition-colors text-sm">Como funciona</Link></li>
              <li><Link to="/ngos" className="text-white/50 hover:text-white transition-colors text-sm">ONGs parceiras</Link></li>
              <li><Link to="/favorites" className="text-white/50 hover:text-white transition-colors text-sm">Favoritos</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold border-l-4 border-primary pl-4">Recursos</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-white/50 hover:text-white transition-colors text-sm">Sobre nós</Link></li>
              <li><Link to="/care-tips" className="text-white/50 hover:text-white transition-colors text-sm">Dicas de cuidados</Link></li>
              <li><Link to="/adoption-guide" className="text-white/50 hover:text-white transition-colors text-sm">Guia de adoção</Link></li>
              <li><Link to="/faq" className="text-white/50 hover:text-white transition-colors text-sm">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold border-l-4 border-primary pl-4">Contato</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:11999999999" className="flex items-center gap-3 text-white/50 text-sm hover:text-white transition-colors">
                  <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <span>(11) 99999-9999</span>
                </a>
              </li>
              <li>
                <a href="mailto:contato@quemmeadota.com.br" className="flex items-center gap-3 text-white/50 text-sm hover:text-white transition-colors">
                  <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <span>contato@quemmeadota.com.br</span>
                </a>
              </li>
              <li>
                <a href="https://maps.google.com/?q=São+Paulo,+SP+-+Brasil" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/50 text-sm hover:text-white transition-colors">
                  <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <span>São Paulo, SP - Brasil</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs font-medium">
            © {new Date().getFullYear()} Quem Me Adota. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-white/30 text-[10px] font-bold uppercase tracking-widest">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacidade</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Termos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
