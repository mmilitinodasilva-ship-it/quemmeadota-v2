const mongoose = require('mongoose');
const NGO = require('./models/NGO');
const Pet = require('./models/Pet');
const Admin = require('./models/Admin');
const HeroSection = require('./models/HeroSection');
const dotenv = require('dotenv');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quem-me-adota');
    console.log('🌱 Iniciando seed...');

    // Clear existing data
    await NGO.deleteMany({});
    await Pet.deleteMany({});
    await Admin.deleteMany({});
    await HeroSection.deleteMany({});

    // Create Admin
    const admin = new Admin({
      username: 'administrador',
      password: '12345',
      email: 'admin@quemmeadota.com.br'
    });
    await admin.save();
    console.log('✅ Admin criado');

    // Create Hero Section
    const hero = new HeroSection({
      title: "Encontre um amigo para a vida toda",
      subtitle: "Adote um cão ou gato e transforme duas vidas.",
      imageUrl: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=1200",
      primaryButtonText: "Ver pets disponíveis",
      primaryButtonLink: "/pets",
      secondaryButtonText: "Como funciona",
      secondaryButtonLink: "#how-it-works"
    });
    await hero.save();
    console.log('✅ Hero Section criado');

    // Create NGOs
    const ngos = await NGO.insertMany([
      {
        name: "Amigos de Patas",
        description: "ONG dedicada ao resgate e reabilitação de animais de rua.",
        location: {
          address: "Rua dos Animais, 123",
          city: "São Paulo",
          state: "SP",
          latitude: -23.5505,
          longitude: -46.6333
        },
        contact: {
          phone: "(11) 98765-4321",
          email: "contato@amigosdepatas.org"
        },
        logo: "https://images.unsplash.com/photo-1591154664416-087a9a8c1303?q=80&w=200"
      },
      {
        name: "Gatinhos de Ouro",
        description: "Especializada em gatos, cuidamos e encontramos lares amorosos.",
        location: {
          address: "Avenida Felina, 456",
          city: "Rio de Janeiro",
          state: "RJ",
          latitude: -22.9068,
          longitude: -43.1729
        },
        contact: {
          phone: "(21) 91234-5678",
          email: "oi@gatinhosdeouro.org"
        },
        logo: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=200"
      }
    ]);
    console.log('✅ ONGs criadas');

    // Create Pets
    await Pet.insertMany([
      {
        name: "Bento",
        species: "cachorro",
        gender: "macho",
        age: "2 anos",
        size: "médio",
        healthCondition: "Saudável, castrado",
        vaccinationStatus: "Todas as vacinas em dia",
        personality: "Dócil, brincalhão e enérgico",
        likes: "Correr no parque e ganhar carinho na barriga",
        story: "Resgatado de uma rodovia, Bento hoje é o cachorro mais feliz do mundo esperando um lar.",
        images: ["https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600"],
        ngoId: ngos[0]._id,
        status: 'available'
      },
      {
        name: "Luna",
        species: "gato",
        gender: "fêmea",
        age: "6 meses",
        size: "pequeno",
        healthCondition: "Saudável, vermifugada",
        vaccinationStatus: "V5 em dia",
        personality: "Tímida no início, mas muito carinhosa",
        likes: "Brincar com bolinhas de lã e dormir no sol",
        story: "Luna foi encontrada em uma caixa com seus irmãos, agora é a única que ainda espera adoção.",
        images: ["https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=600"],
        ngoId: ngos[1]._id,
        status: 'available'
      },
      {
        name: "Rex",
        species: "cachorro",
        gender: "macho",
        age: "5 anos",
        size: "grande",
        healthCondition: "Excelente saúde",
        vaccinationStatus: "V10 e Raiva em dia",
        personality: "Protetor, calmo e obediente",
        likes: "Longas caminhadas e ossos de brinquedo",
        story: "Seu antigo dono mudou-se para outro país e não pôde levá-lo.",
        images: ["https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=600"],
        ngoId: ngos[0]._id,
        status: 'available'
      }
    ]);
    console.log('✅ Pets criados');

    console.log('🌱 Seed finalizado com sucesso!');
    process.exit();
  } catch (error) {
    console.error('❌ Erro no seed:', error);
    process.exit(1);
  }
};

seedData();
