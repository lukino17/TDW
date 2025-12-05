// Models/pratos.js
const mongoose = require('mongoose');

const PratoSchema = new mongoose.Schema({
  cod: {
    type: Number,
    required: [true, 'O código do prato é obrigatório'],
    unique: true,
    min: [1, 'O código deve ser >= 1']
  },
  nome: {
    type: String,
    required: [true, 'O nome do prato é obrigatório'],
    minlength: [3, 'O nome tem de ter pelo menos 3 caracteres'],
    maxlength: [80, 'O nome pode ter no máximo 80 caracteres']
  },
  categoria: {
    type: String,
    required: [true, 'A categoria é obrigatória'],
    minlength: [3, 'Categoria muito curta'],
    maxlength: [30, 'Categoria muito longa']
  },
  tipo: {
    type: String,
    required: [true, 'O tipo é obrigatório'],
    minlength: [3, 'Tipo muito curto'],
    maxlength: [30, 'Tipo muito longo']
  },
  preco: {
    type: Number,
    min: [0.01, 'O preço tem de ser maior que 0'],
    validate: {
      validator: v => v == null || v > 0,
      message: 'O preço tem de ser maior que 0'
    }
  }
}, { timestamps: true });

// exporta o modelo (collection ficará "pratos" automaticamente)
module.exports = mongoose.model('Prato', PratoSchema);
