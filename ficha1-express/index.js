const express = require('express');
const app = express();
app.use(express.json());

const logger = require('./middlewares/logger');
app.use(logger);

const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://davidelucchino16_db_user:12345@cluster0.mxofthh.mongodb.net/?appName=Cluster0")
  .then(() => console.log("MongoDB ligado com sucesso!"))
  .catch((err) => console.log("Erro ao ligar MongoDB:", err));

// Importa apenas o controller de menu
const menuController = require('./Controllers/menu_do_dia_db');
app.use('/menu', menuController);

const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send("API do restaurante a funcionar. Use /menu");
});

app.listen(port, () => {
  console.log(`Servidor a correr na porta ${port}`);
});

module.exports = app;
