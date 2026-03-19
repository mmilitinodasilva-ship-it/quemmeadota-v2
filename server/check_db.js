const mongoose = require('mongoose');
const Pet = require('./models/Pet');
const NGO = require('./models/NGO');
require('dotenv').config();

async function checkDB() {
  await mongoose.connect(process.env.MONGODB_URI);
  const pets = await Pet.find().populate('ngoId');
  console.log('--- PETS ---');
  pets.forEach(p => {
    console.log(`Pet: ${p.name}, Images: ${JSON.stringify(p.images)}`);
  });
  const ngos = await NGO.find();
  console.log('--- NGOS ---');
  ngos.forEach(n => {
    console.log(`NGO: ${n.name}, Logo: ${n.logo}`);
  });
  process.exit(0);
}

checkDB();
