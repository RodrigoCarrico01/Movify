const axios = require('axios');
const API_KEY = process.env.OMDB_API_KEY;
const VERIFY_KEY = process.env.VERIFY_KEY;

async function fetchPage(searchTerm, page = 1) {
  const baseURL = `http://www.omdbapi.com/`;

  const response = await axios.get(baseURL, {
    params: {
      s: searchTerm,
      apikey: API_KEY,
      VERIFYKEY: VERIFY_KEY,
      page: page,
    },
  });

  const data = response.data;

  if (data.Response === 'False') {
    throw new Error(data.Error);
  }

  const totalResults = parseInt(data.totalResults, 10);
  const totalPages = Math.ceil(totalResults / 9); // Dividir os resultados por 9 por página

  const results = data.Search.map(movie => ({
    ...movie,
    Poster: movie.Poster !== 'N/A' ? movie.Poster : '/images/No_Image_Available.jpg'
  }));

  return {
    results,
    totalResults,
    totalPages,
    currentPage: page
  };
}

module.exports = { fetchPage };