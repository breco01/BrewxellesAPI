import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'geheimestekst';

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer token"

  if (!token) return res.status(401).json({ message: 'Geen token, toegang geweigerd' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Ongeldige of verlopen token' });
    req.user = user;
    next();
  });
}