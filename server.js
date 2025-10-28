const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());

// Lê os dados do arquivo JSON
const dados = JSON.parse(
  fs.readFileSync('a0cd551e-ae8e-4657-b557-3a64020a14de.json', 'utf8')
);

// Rota de busca com filtros
app.get('/buscar', (req, res) => {
  let { tipo, min_dy } = req.query;
  let filtrados = dados;

  if (tipo) {
    filtrados = filtrados.filter(fii =>
      fii.tipo.toLowerCase().includes(tipo.toLowerCase())
    );
  }

  if (min_dy) {
    filtrados = filtrados.filter(fii =>
      fii.dy >= parseFloat(min_dy)
    );
  }

  res.json(filtrados);
});

// Inicia servidor local
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});