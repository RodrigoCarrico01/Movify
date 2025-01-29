const axios = require('axios');
const API_KEY = process.env.OMDB_API_KEY;
const VERIFY_KEY = process.env.VERIFY_KEY;

async function fetchPage(searchTerm, page = 1) {
  try {
    if (!searchTerm) {
      throw new Error('Search term is required');
    }
    
    if (searchTerm.length < 3) {
      throw new Error('Search term must be at least 3 characters long. The API does not support shorter queries.');
    }

    const baseURL = `http://www.omdbapi.com/`;
    const resultsPerPage = 9;

    console.log(`Fetching total results for: ${searchTerm}`);
    const totalResultsResponse = await axios.get(baseURL, {
      params: {
        s: searchTerm,
        apikey: API_KEY,
        VERIFYKEY: VERIFY_KEY,
      },
    });

    const totalResultsData = totalResultsResponse.data;
    if (totalResultsData.Response === 'False') {
      throw new Error(totalResultsData.Error);
    }

    const totalResults = parseInt(totalResultsData.totalResults, 10);
    const totalPages = Math.ceil(totalResults / resultsPerPage);

    console.log(`Total results found: ${totalResults}, Total pages: ${totalPages}`);

    const results = [];
    const startPage = Math.floor((page - 1) * resultsPerPage / 10) + 1;
    const endPage = Math.ceil((page * resultsPerPage) / 10);

    console.log(`Fetching results from page ${startPage} to ${endPage}`);

    for (let currentPage = startPage; currentPage <= endPage; currentPage++) {
      try {
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
          Poster: movie.Poster !== 'N/A' ? movie.Poster : '/images/No_Image_Available.jpg',
          imdbID: movie.imdbID 
        })));
      } catch (error) {
        console.error(`Error fetching page ${currentPage}:`, error.message);
      }
    }

    const paginatedResults = results.slice((page - 1) * resultsPerPage % 10, ((page - 1) * resultsPerPage % 10) + resultsPerPage);

    console.log(`Returning ${paginatedResults.length} results for page ${page}`);

    return {
      results: paginatedResults,
      totalResults,
      totalPages,
      currentPage: page
    };
  } catch (error) {
    console.error('Error in fetchPage:', error.message);
    return {
      results: [],
      totalResults: 0,
      totalPages: 0,
      currentPage: page,
      error: error.message
    };
  }
}

module.exports = { fetchPage };