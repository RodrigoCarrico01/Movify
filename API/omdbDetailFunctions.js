const axios = require('axios');
const API_KEY = process.env.OMDB_API_KEY;
const VERIFY_KEY = process.env.VERIFY_KEY;

async function fetchMovieDetails(imdbID) {
  try {
    if (!imdbID) {
      throw new Error('Movie ID is required');
    }

    const baseURL = `http://www.omdbapi.com/`;
    console.log(`Fetching details for movie ID: ${imdbID}`);

    const response = await axios.get(baseURL, {
      params: {
        i: imdbID,
        apikey: API_KEY,
        VERIFYKEY: VERIFY_KEY,
      },
    });

    const data = response.data;
    if (data.Response === 'False') {
      throw new Error(data.Error);
    }

    return {
      title: data.Title,
      year: data.Year,
      rated: data.Rated,
      released: data.Released,
      runtime: data.Runtime,
      genre: data.Genre,
      director: data.Director,
      writer: data.Writer,
      actors: data.Actors,
      plot: data.Plot,
      language: data.Language,
      country: data.Country,
      awards: data.Awards,
      poster: data.Poster !== 'N/A' ? data.Poster : '/images/No_Image_Available.jpg',
      ratings: data.Ratings,
      metascore: data.Metascore,
      imdbRating: data.imdbRating,
      imdbVotes: data.imdbVotes,
      imdbID: data.imdbID,
      type: data.Type,
      boxOffice: data.BoxOffice,
      production: data.Production,
      website: data.Website,
    };
  } catch (error) {
    console.error('Error fetching movie details:', error.message);
    return { error: error.message };
  }
}

module.exports = { fetchMovieDetails };