const express = require('express');
const { fetchPage } = require('../API/omdbSearchFunctions');

const router = express.Router();

router.get('/searchApi', async (req, res) => {
  const { q: searchTerm, page = 1 } = req.query;

  if (!searchTerm) {
    return res.status(400).render('error', { message: 'Search query is required.' });
  }

  try {
    const { results, totalResults, totalPages, currentPage } = await fetchPage(searchTerm, page);
    res.render('search', { results, searchTerm, totalPages, currentPage });
  } catch (error) {
    console.error('Error fetching search results:', error.message);
    res.status(500).render('error', { message: 'An error occurred while fetching search results. Please try again later.' });
  }
});

module.exports = router;