const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing DB connection...');
console.log('URI:', process.env.MONGODB_URI ? 'Exists' : 'Missing');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected successfully to MongoDB Atlas');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB Atlas');
    console.error(err);
    process.exit(1);
  });
