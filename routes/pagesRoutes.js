const express = require('express');
const { fetchPage } = require('../API/omdbSearchFunctions');

const router = express.Router();

// Rota para renderizar a página inicial
router.get('/', (req, res) => {
  res.render('home');
});

// Rota para renderizar a página de busca com filmes populares por padrão
router.get('/search', async (req, res) => {
  const searchTerm = req.query.q || 'popular'; // Define "popular" como pesquisa padrão
  const page = parseInt(req.query.page, 10) || 1;

  try {
    const { results, totalResults, totalPages, currentPage } = await fetchPage(searchTerm, page);
    res.render('search', { results, searchTerm, totalPages, currentPage });
  } catch (error) {
    res.render('search', { results: [], searchTerm, totalPages: 0, currentPage: 1, error: 'Erro ao buscar filmes populares.' });
  }
});

module.exports = router;