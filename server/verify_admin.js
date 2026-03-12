const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const dotenv = require('dotenv');

dotenv.config();

const verifyAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quem-me-adota');
    const admin = await Admin.findOne({ username: 'administrador' });
    if (admin) {
      console.log('Admin user found:', admin.username);
    } else {
      console.log('Admin user NOT found with username: administrador');
      const allAdmins = await Admin.find({});
      console.log('Current admins in DB:', allAdmins.map(a => a.username));
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

verifyAdmin();