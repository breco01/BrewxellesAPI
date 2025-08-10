import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'geheimestekst';

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username en wachtwoord zijn verplicht' });

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Gebruiker bestaat al' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: 'Gebruiker aangemaakt', userId: newUser._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username en wachtwoord zijn verplicht' });

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Ongeldige inloggegevens' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Ongeldige inloggegevens' });

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Inloggen gelukt', token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
