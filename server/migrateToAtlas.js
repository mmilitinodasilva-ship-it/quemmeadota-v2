const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Carregar variáveis de ambiente
dotenv.config({ path: path.join(__dirname, '.env') });

const migrateData = async () => {
  try {
    const localUri = 'mongodb://localhost:27017/quem-me-adota';
    const atlasUri = process.env.MONGODB_URI;

    console.log('🔌 Conectando ao MongoDB LOCAL...');
    const localConn = await mongoose.createConnection(localUri).asPromise();
    console.log('✅ Conectado ao Local');

    console.log('🔌 Conectando ao MongoDB ATLAS (Nuvem)...');
    const atlasConn = await mongoose.createConnection(atlasUri).asPromise();
    console.log('✅ Conectado ao Atlas');

    const collections = [
      'admins', 
      'pets', 
      'ngos', 
      'chatmessages', 
      'blogposts', 
      'adoptions', 
      'favorites', 
      'herosections', 
      'successstories'
    ];
    
    for (const colName of collections) {
      console.log(`📦 Migrando coleção: ${colName}...`);
      const data = await localConn.collection(colName).find({}).toArray();
      
      if (data.length > 0) {
        // Limpar destino antes
        await atlasConn.collection(colName).deleteMany({}); 
        // Inserir dados mantendo os IDs originais para preservar relacionamentos
        await atlasConn.collection(colName).insertMany(data);
        console.log(`✅ ${data.length} itens migrados em ${colName}`);
      } else {
        console.log(`ℹ️ Nenhun dado encontrado em ${colName}`);
      }
    }

    console.log('✨ Migração concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na migração:', error);
    process.exit(1);
  }
};

migrateData();
