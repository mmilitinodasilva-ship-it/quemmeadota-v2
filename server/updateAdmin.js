const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const dotenv = require('dotenv');

dotenv.config();

const updateAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quem-me-adota');
    console.log('✅ Conectado ao MongoDB');

    // Tentar encontrar o admin existente (pelo email ou username anterior se soubesse, mas vamos buscar qualquer admin ou criar se não houver)
    let admin = await Admin.findOne();
    
    if (admin) {
      console.log('👤 Admin encontrado, atualizando credenciais...');
      admin.username = 'administrador';
      admin.password = '12345'; // O middleware pre('save') no modelo Admin fará o hash automaticamente
      await admin.save();
      console.log('✅ Credenciais do administrador atualizadas com sucesso!');
    } else {
      console.log('👤 Nenhum admin encontrado. Criando novo administrador...');
      const newAdmin = new Admin({
        username: 'administrador',
        password: '12345',
        email: 'admin@quemmeadota.com.br' // Email padrão obrigatório pelo schema
      });
      await newAdmin.save();
      console.log('✅ Novo administrador criado com sucesso!');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao atualizar admin:', error);
    process.exit(1);
  }
};

updateAdmin();
