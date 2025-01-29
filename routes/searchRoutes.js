const express = require('express');
const { fetchPage } = require('../API/omdbSearchFunctions');

const router = express.Router();

router.get('/searchApi', async (req, res) => {
  const { q: searchTerm, page = 1 } = req.query;

  if (!searchTerm) {
    return res.status(400).send('Missing search query');
  }

  try {
    const { results, totalResults, totalPages, currentPage } = await fetchPage(searchTerm, page);
    res.render('search', { results, searchTerm, totalPages, currentPage });
  } catch (error) {
    res.status(500).send('An error occurred while fetching data.');
  }
});

module.exports = router;
