  const express = require('express');
  const router = express.Router();
  const Prato = require('../Models/PratoModel');
const auth = require('../middlewares/basicAuth');


  // GET nomes dos pratos
  router.get('/nomes', async (req, res) => {
    try {
      const pratos = await Prato.find().select('nome -_id');
      res.status(200).json(pratos);
    } catch (err) {
      res.status(500).json({ error: "Erro interno" });
    }
  });



  // GET pratos por categoria
  router.get('/categoria/:nome', async (req, res) => {
   try {
    const categoria = req.params.nome;

    const pratos = await Prato.find({ categoria });

    if (pratos.length === 0)
    return res.status(404).json({ error: "Categoria não encontrada" });

    res.status(200).json(pratos);
   } catch (err) {
    res.status(500).json({ error: "Erro interno" });
   }
  });

  // GET pratos com preco <= X
  router.get('/preco/:max', async (req, res) => {
   try {
    const max = Number(req.params.max);
    const pratos = await Prato.find({ preco: { $lte: max } });
    res.status(200).json(pratos);
   } catch (err) {
    res.status(500).json({ error: "Erro interno" });
   }
  });

  // GET estatísticas
  router.get('/stats', async (req, res) => {
    try {
      const pratos = await Prato.find();

      if (pratos.length === 0)
        return res.status(200).json({
          total: 0,
          precoMedio: 0,
          maisCaro: null
        });

      const total = pratos.length;
      const precoMedio =
        pratos.reduce((s, p) => s + (p.preco || 0), 0) / total;

      const maisCaro = pratos.reduce((a, b) =>
        (a.preco || 0) > (b.preco || 0) ? a : b
      );

      res.status(200).json({
        total,
        precoMedio: Number(precoMedio.toFixed(2)),
        maisCaro
      });

    } catch (err) {
      res.status(500).json({ error: "Erro interno" });
    }
  });


  // GET all
  router.get('/', async (req, res) => {
    try {
      const lista = await Prato.find().sort({ cod: 1 });
      res.status(200).json(lista);
    } catch (err) {
      res.status(500).json({ error: "Erro interno" });
    }
  });

  // GET por código (ÚLTIMA rota GET!)
  router.get('/:cod', async (req, res) => {
    const cod = Number(req.params.cod);

    if (isNaN(cod)) {
      return res.status(400).json({ error: "O código tem de ser numérico" });
    }

    try {
      const prato = await Prato.findOne({ cod });

      if (!prato) {
        return res.status(404).json({ error: "Código não encontrado" });
      }

      res.status(200).json(prato);
    } catch (err) {
      res.status(500).json({ error: "Erro interno" });
    }
  });

  // POST - AGORA PROTEGIDA POR basicAuth
  router.post('/', auth, async (req, res) => {
    const { cod, nome, categoria, tipo, preco } = req.body;

    if (!cod || !nome || !categoria || !tipo) {
      return res.status(400).json({ error: "Body inválido — faltam campos" });
    }

    try {
      const prato = new Prato({ cod, nome, categoria, tipo, preco });
      await prato.save();
      res.status(201).json(prato);
    } catch (err) {
      res.status(500).json({ error: "Erro ao inserir no MongoDB" });
    }
  });

  // PATCH - AGORA PROTEGIDA POR basicAuth
  router.patch('/:cod', auth, async (req, res) => {
    try {
      const prato = await Prato.findOne({ cod: req.params.cod });
      if (!prato) return res.status(404).json({ error: "Código não encontrado" });

      Object.assign(prato, req.body);
      await prato.save();

      res.status(200).json({ message: "Prato atualizado", prato });
    } catch (err) {
      res.status(500).json({ error: "Erro interno" });
    }
  });

  // DELETE por código - AGORA PROTEGIDA POR basicAuth
  router.delete('/:cod', auth, async (req, res) => {
    try {
      const removido = await Prato.findOneAndDelete({ cod: req.params.cod });

      if (!removido) return res.status(404).json({ error: "Código não encontrado" });

      res.status(200).json({ message: "Prato removido", removido });
    } catch (err) {
      res.status(500).json({ error: "Erro interno" });
    }
  });

  // DELETE tudo - AGORA PROTEGIDA POR basicAuth
  router.delete('/', auth, async (req, res) => {
    try {
      await Prato.deleteMany({});
      res.status(200).json({ message: "Todos os pratos removidos" });
    } catch (err) {
      res.status(500).json({ error: "Erro interno" });
    }
  });

  module.exports = router;