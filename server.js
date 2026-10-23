const express = require('express');
const cors = require('cors');
const fs = require('fs');

require('dotenv').config()

const { buscarCotacao } = require('./services/cotacoes')

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


app.get('/cotacao/:ticker', async (req, res) => {
  try {
    const ticker = String(req.params.ticker).toUpperCase()

    if (!/^[A-Z0-9]{5,12}$/.test(ticker)) {
      return res.status(400).json({
        erro: 'Ticker inválido',
      })
    }

    const dados = await buscarCotacao(ticker)

    return res.json(dados)
  } catch (erro) {
    console.error('Erro ao consultar cotação:', erro.message)

    return res.status(502).json({
      erro: 'Não foi possível obter a cotação',
    })
  }
})


app.get('/historico/:ticker', async (req, res) => {
  try {
    const ticker = String(req.params.ticker)
      .trim()
      .toUpperCase()

    if (!/^[A-Z0-9]{5,12}$/.test(ticker)) {
      return res.status(400).json({
        erro: 'Ticker inválido'
      })
    }

    if (!process.env.BRAPI_TOKEN) {
      return res.status(500).json({
        erro: 'Token não configurado'
      })
    }

    const url = new URL(
      `https://brapi.dev/api/quote/${ticker}`
    )

    url.searchParams.set('range', '3mo')
    url.searchParams.set('interval', '1d')

    const resposta = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.BRAPI_TOKEN}`
      },
      signal: AbortSignal.timeout(15000)
    })

    if (!resposta.ok) {
      return res.status(502).json({
        erro: 'Erro na consulta histórica',
        status: resposta.status
      })
    }

    const json = await resposta.json()
    const ativo = json.results?.find(
      item => item.symbol === ticker
    )

    const historico = ativo?.historicalDataPrice

    if (!Array.isArray(historico) || !historico.length) {
      return res.status(404).json({
        erro: 'Histórico não disponível'
      })
    }

    const precos = historico
      .filter(item =>
        Number.isFinite(Number(item.date)) &&
        Number.isFinite(Number(item.close)) &&
        Number(item.close) > 0
      )
      .map(item => ({
        data: new Date(Number(item.date) * 1000)
          .toISOString()
          .slice(0, 10),
        fechamento: Number(item.close)
      }))
      .sort((a, b) => a.data.localeCompare(b.data))

    return res.json({
      ticker,
      fonte: 'brapi.dev',
      total: precos.length,
      inicio: precos[0]?.data ?? null,
      fim: precos.at(-1)?.data ?? null,
      precos
    })

  } catch (erro) {
    console.error(erro.message)

    return res.status(500).json({
      erro: 'Falha ao processar o histórico'
    })
  }
})


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});