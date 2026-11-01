const express = require('express');
const pedidoRoutes = require('./routes/pedidoRoutes');

const app = express();

app.use(express.json());
app.use(pedidoRoutes);

// Rota que não existe -> 404 em JSON
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

// Tratamento de erros que acontecem antes do controller (ex.: JSON malformado)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido no corpo da requisição.' });
  }
  console.error(err);
  return res.status(500).json({ erro: 'Erro interno no servidor.' });
});

module.exports = app;
