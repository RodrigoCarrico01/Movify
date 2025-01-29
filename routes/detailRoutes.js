const express = require('express');
const { fetchMovieDetails } = require('../API/omdbDetailFunctions');

const router = express.Router();

// Rota para exibir detalhes do filme
router.get('/movie/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const movieDetails = await fetchMovieDetails(id);
    
    if (movieDetails.error) {
      return res.status(404).render('error', { message: 'Filme não encontrado.' });
    }

    res.render('movieDetail', { movie: movieDetails });
  } catch (error) {
    console.error('Error fetching movie details:', error.message);
    res.status(500).render('error', { message: 'Erro ao buscar detalhes do filme.' });
  }
});

module.exports = router;