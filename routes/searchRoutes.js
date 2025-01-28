const express = require('express');
const { fetchPage } = require('../API/omdbSearchFunctions');

const router = express.Router();

router.get('/', async (req, res) => {
  const { q: searchTerm, page = 1 } = req.query;

  if (!searchTerm) {
    return res.status(400).send('Missing search query');
  }

  try {
    const { results, totalResults } = await fetchPage(searchTerm, page);
    const totalPages = Math.ceil(totalResults / 10);
    
    res.render('search', {
      results,
      searchTerm,
      currentPage: parseInt(page, 10),
      totalPages,
    });
  } catch (error) {
    res.status(500).send('An error occurred while fetching data.');
  }
});

module.exports = router;
