# 🏢 Belmar State — Plataforma de Investimentos em FIIs

**Uma plataforma interativa para explorar, acompanhar e analisar investimentos em Fundos de Investimento Imobiliário (FIIs).**

A **Belmar State** é um projeto de desenvolvimento web que busca oferecer uma experiência diferenciada no acompanhamento de investimentos imobiliários, combinando análise de dados, visualizações interativas, ferramentas de organização financeira e gamificação.

O objetivo é ir além da simples consulta de cotações, permitindo que investidores visualizem seu patrimônio, explorem informações históricas e acompanhem sua evolução ao longo do tempo.

## 🚀 Funcionalidades

### 📊 Dashboard Financeiro
- Visualização do capital investido e valor de mercado.
- Cálculo de lucro ou prejuízo não realizado.
- Consulta de cotações pela API brapi.dev.
- Gráfico de distribuição patrimonial por FII.
- Gráfico de evolução histórica do patrimônio.
- Indicadores de desempenho da carteira.

### 💼 Minha Carteira
- Cadastro de compras e vendas de FIIs.
- Cálculo automático do preço médio.
- Controle de quantidade de cotas.
- Histórico de operações.
- Comparação entre preço de aquisição e cotação de mercado.
- Armazenamento local dos registros.

### 📅 Calendário Inteligente de Dividendos
- Calendário interativo de pagamentos.
- Cadastro de proventos confirmados e estimados.
- Cálculo dos rendimentos conforme a quantidade de cotas na data-com.
- Resumo mensal dos proventos.
- Integração com as operações da carteira.

### 🏆 Conquistas do Investidor
Sistema de gamificação que recompensa o progresso dentro da plataforma.

Inclui:
- Medalhas por objetivos alcançados.
- Sistema de experiência (XP).
- Níveis de investidor.
- Desafios relacionados a operações, patrimônio e diversificação.
- Acompanhamento do progresso individual.

### 🧬 DNA do Investidor
Questionário interativo que identifica preferências do usuário em relação ao acompanhamento de investimentos.

Perfis disponíveis:
- 💰 Caçador de Dividendos
- 📈 Construtor de Patrimônio
- 🛡️ Guardião da Estabilidade
- 🧭 Explorador de Oportunidades

O resultado apresenta um perfil predominante e a distribuição das características identificadas.

### 🔎 Explorar FIIs
- Pesquisa por ticker e setor.
- Filtros por tipo de fundo.
- Filtro por Dividend Yield mínimo.
- Ordenação por preço e DY.
- Consulta dos fundos cadastrados no backend.

### 📈 Reconstrução Histórica e Desempenho
- Consulta de fechamentos históricos de FIIs.
- Reconstrução das posições a partir de compras e vendas.
- Visualização histórica do capital investido e valor de mercado.
- Filtros por períodos.
- Modo Desempenho (%) com cálculo aproximado de retorno, buscando separar a valorização do efeito dos aportes.

A reconstrução histórica está limitada à disponibilidade dos dados da API e ainda não contempla todos os eventos corporativos.

## 🛠️ Tecnologias Utilizadas

**Frontend**
- Vue.js 3
- Vite
- JavaScript
- HTML5 e CSS3
- Vue Router
- Chart.js
- vue-chartjs

**Backend**
- Node.js
- Express.js
- API REST
- dotenv
- brapi.dev (dados de mercado)

**Ferramentas de Desenvolvimento**
- Visual Studio Code
- Git e GitHub
- WSL / Ubuntu
- NPM

## 🏗️ Arquitetura

A aplicação possui frontend e backend separados.

O frontend Vue 3 é responsável pela interface, navegação, gráficos e interatividade.

O backend Express disponibiliza endpoints para consulta de FIIs, cotações e históricos, realizando a comunicação com a API externa.

Os dados pessoais da carteira, proventos, conquistas e preferências são armazenados localmente no navegador por meio do `localStorage`.

## ⚙️ Como Executar o Projeto

### Pré-requisitos

- Node.js e NPM instalados
- Git
- Token da API brapi.dev para consultas de mercado

### 1. Clonar o repositório

```bash
git clone https://github.com/Daaish/Site-de-investimento-em-FIIs.git
cd Site-de-investimento-em-FIIs
```

### 2. Instalar as dependências do backend

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto e adicione:

```env
BRAPI_TOKEN=seu_token_aqui
```

O token pode ser obtido em https://brapi.dev/.

**Nunca compartilhe seu token ou envie o arquivo `.env` para o GitHub.**

### 4. Iniciar o backend

```bash
npm start
```

O servidor será iniciado, por padrão, em:

`http://localhost:3000`

### 5. Instalar e iniciar o frontend

Abra outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Acesse o endereço exibido pelo Vite, normalmente:

`http://localhost:5173`

## 🔗 Principais Endpoints

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/buscar` | Consulta fundos cadastrados na base local |
| GET | `/cotacao/:ticker` | Consulta cotação de um ativo |
| GET | `/historico/:ticker` | Consulta fechamentos históricos de um ativo |

No ambiente de desenvolvimento, o frontend acessa essas rotas utilizando o prefixo `/api`, configurado por meio do proxy do Vite.

## 📂 Organização do Projeto

```text
Site-de-investimento-em-FIIs/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── composables/
│   │   ├── router/
│   │   ├── services/
│   │   ├── views/
│   │   └── App.vue
│   └── package.json
├── services/
│   └── cotacoes.js
├── server.js
├── package.json
└── README.md
```

## 🎯 Diferenciais da Plataforma

A Belmar State procura oferecer uma experiência que combina **informação financeira, personalização e interatividade**.

Seus principais diferenciais são:

1. **Reconstrução histórica:** permite visualizar a evolução de carteiras a partir de operações registradas anteriormente, dentro da cobertura de preços disponível.
2. **Gamificação:** transforma objetivos e atividades de investimento em conquistas e níveis.
3. **DNA do Investidor:** oferece uma experiência personalizada baseada nas preferências declaradas pelo usuário.
4. **Calendário vinculado à carteira:** estima os proventos considerando as cotas registradas na data-com.
5. **Análise de desempenho:** diferencia visualmente o crescimento do patrimônio causado por aportes da variação percentual estimada dos investimentos.

## 🔮 Próximas Melhorias

- Importação de operações antigas por CSV.
- Ampliação da cobertura de cotações históricas.
- Integração automática de anúncios de dividendos.
- Cálculos de retorno total incluindo proventos.
- Banco de dados PostgreSQL.
- Sistema de autenticação e contas de usuário.
- Sincronização de carteiras entre dispositivos.
- Tratamento de desdobramentos, amortizações e outros eventos corporativos.

## ⚠️ Observações

Este projeto está em desenvolvimento e possui finalidade acadêmica e educativa.

As informações financeiras podem apresentar atrasos ou limitações de cobertura. Os cálculos de desempenho ainda são aproximados e não devem ser utilizados como referência definitiva para decisões financeiras.

O DNA do Investidor é uma ferramenta recreativa, não substituindo uma avaliação formal de perfil de risco.

**A plataforma não oferece recomendações personalizadas de investimentos.**

## 👨‍💻 Desenvolvimento

Projeto desenvolvido para aplicação prática de conhecimentos em desenvolvimento web, integração de APIs, visualização de dados e engenharia de software.

**Repositório:** https://github.com/Daaish/Site-de-investimento-em-FIIs

---

**Belmar State — Acompanhe seu patrimônio. Explore sua evolução.**