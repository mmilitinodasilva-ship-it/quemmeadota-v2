import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, ChevronRight, AlertCircle, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(username, password);
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50/50 py-20 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-[50px] p-12 shadow-2xl border border-gray-100 overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-primary-dark" />
        
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary-light rounded-3xl flex items-center justify-center mx-auto mb-8 text-primary-dark">
            <Heart className="w-10 h-10 fill-current" />
          </div>
          <h1 className="text-4xl font-black text-primary-dark mb-4">Acesso Restrito</h1>
          <p className="text-gray-500 text-lg">Área exclusiva para administradores da plataforma.</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-5 bg-red-50 text-red-600 rounded-3xl flex items-center gap-3 border border-red-100"
          >
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-bold uppercase tracking-widest">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-6">Usuário</label>
            <div className="relative">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                required
                placeholder="Ex: admin"
                className="w-full pl-16 pr-8 py-5 bg-gray-50 rounded-[30px] border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-6">Senha</label>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full pl-16 pr-8 py-5 bg-gray-50 rounded-[30px] border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary py-6 text-xl mt-8 flex items-center justify-center gap-3 group disabled:opacity-50"
          >
            {loading ? 'Entrando...' : (
              <>
                Entrar no Painel
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-12 text-center">
          <Link to="/" className="text-gray-400 hover:text-primary-dark font-bold text-sm underline transition-colors">
            Voltar para o site
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
