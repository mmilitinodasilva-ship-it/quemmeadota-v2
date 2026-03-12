const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { adminId: admin._id },
      process.env.JWT_SECRET || 'sua_chave_secreta_super_segura',
      { expiresIn: '1d' }
    );

    res.json({ token, admin: { id: admin._id, username: admin.username, email: admin.email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.register = async (req, res) => {
  // Only for initial setup or authorized creation
  try {
    const admin = new Admin(req.body);
    await admin.save();
    res.status(201).json({ message: 'Admin criado com sucesso' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
