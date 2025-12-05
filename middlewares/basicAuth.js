const User = require('../Models/UserModel');

module.exports = async function (req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ error: "Autenticação necessária" });
  }

  try {
    const base64 = authHeader.split(' ')[1];
    const decoded = Buffer.from(base64, 'base64').toString();
    const [username, password] = decoded.split(':');

    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    next(); // autenticado com sucesso
  } catch (err) {
    return res.status(401).json({ error: "Header de autenticação inválido" });
  }
};
