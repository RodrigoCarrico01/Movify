const axios = require('axios');
const API_KEY = process.env.OMDB_API_KEY;
const VERIFY_KEY = process.env.VERIFY_KEY;

async function fetchPage(searchTerm, page = 1) {
  const baseURL = `http://www.omdbapi.com/`;

  const resultsPerPage = 9; // Mostrar 9 resultados por página
  const totalResults = await axios.get(baseURL, {
    params: {
      s: searchTerm,
      apikey: API_KEY,
      VERIFYKEY: VERIFY_KEY,
    },
  }).then(response => {
    const data = response.data;
    if (data.Response === 'False') {
      throw new Error(data.Error);
    }
    return parseInt(data.totalResults, 10);
  });

  const totalPages = Math.ceil(totalResults / resultsPerPage);

  const results = [];
  const startPage = Math.floor((page - 1) * resultsPerPage / 10) + 1;
  const endPage = Math.ceil((page * resultsPerPage) / 10);

  for (let currentPage = startPage; currentPage <= endPage; currentPage++) {
    const response = await axios.get(baseURL, {
      params: {
        s: searchTerm,
        apikey: API_KEY,
        VERIFYKEY: VERIFY_KEY,
        page: currentPage,
      },
    });

    const data = response.data;

    if (data.Response === 'False') {
      throw new Error(data.Error);
    }

    results.push(...data.Search.map(movie => ({
      ...movie,
      Poster: movie.Poster !== 'N/A' ? movie.Poster : '/images/No_Image_Available.jpg'
    })));
  }

  const paginatedResults = results.slice((page - 1) * resultsPerPage % 10, ((page - 1) * resultsPerPage % 10) + resultsPerPage);

  return {
    results: paginatedResults,
    totalResults,
    totalPages,
    currentPage: page
  };
}

module.exports = { fetchPage };