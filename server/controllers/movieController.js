import Movie from '../models/movieModel.js';
import Review from '../models/reviewModel.js';
import Theatre from '../models/theatreModel.js';
import { generateShowsForMovie, richBlockbusterMovies } from '../utils/seedData.js';

// TMDB Genre ID mapping
const TMDB_GENRES = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

// GET ALL MOVIES (with pagination, search, genre, language, and category filters)
export const getMovies = async (req, res) => {
  try {
    const {
      search,
      genre,
      language,
      category,
      page,
      limit,
      all,
      sort,
    } = req.query;

    const filter = {};

    // 1. Text search across name, director, or cast
    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      filter.$or = [
        { movieName: searchRegex },
        { director: searchRegex },
        { cast: searchRegex },
        { description: searchRegex },
      ];
    }

    // 2. Genre filter
    if (genre && genre !== 'All') {
      filter.genres = { $in: [genre] };
    }

    // 3. Language filter
    if (language && language !== 'All') {
      filter.language = { $regex: new RegExp(`^${language}$`, 'i') };
    }

    // 4. Sorting logic
    let sortOptions = { releaseDate: -1, createdAt: -1 };
    if (category === 'trending' || category === 'top_rated' || sort === 'rating') {
      sortOptions = { rating: -1, releaseDate: -1 };
    } else if (category === 'now_showing' || sort === 'latest') {
      sortOptions = { releaseDate: -1, createdAt: -1 };
    } else if (sort === 'oldest') {
      sortOptions = { releaseDate: 1 };
    } else if (sort === 'name') {
      sortOptions = { movieName: 1 };
    }

    // 5. Total count before pagination
    const totalCount = await Movie.countDocuments(filter);

    // 6. Pagination calculation
    const isFetchAll = all === 'true' || limit === '0' || limit === 'all' || (!page && !limit);
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = isFetchAll ? 0 : Math.max(1, parseInt(limit, 10) || 20);

    let query = Movie.find(filter).sort(sortOptions);
    if (!isFetchAll && limitNum > 0) {
      query = query.skip((pageNum - 1) * limitNum).limit(limitNum);
    }

    const movies = await query.exec();

    return res.status(200).json({
      success: true,
      total: totalCount,
      count: movies.length,
      page: isFetchAll ? 1 : pageNum,
      limit: isFetchAll ? totalCount : limitNum,
      totalPages: isFetchAll || limitNum === 0 ? 1 : Math.ceil(totalCount / limitNum),
      hasMore: isFetchAll || limitNum === 0 ? false : pageNum * limitNum < totalCount,
      movies,
    });
  } catch (error) {
    console.error('getMovies Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve movies.' });
  }
};

// GET CURATED SECTIONS (Amazon Prime Video style category rails)
export const getCuratedSections = async (req, res) => {
  try {
    const allMovies = await Movie.find({}).sort({ releaseDate: -1 });

    const trending = [...allMovies].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 10);
    const nowShowing = [...allMovies].slice(0, 10);
    const action = allMovies.filter((m) => m.genres?.some((g) => ['Action', 'Thriller', 'Adventure'].includes(g))).slice(0, 10);
    const scifi = allMovies.filter((m) => m.genres?.some((g) => ['Sci-Fi', 'Fantasy', 'Animation'].includes(g))).slice(0, 10);
    const drama = allMovies.filter((m) => m.genres?.some((g) => ['Drama', 'Biography', 'Crime', 'Comedy'].includes(g))).slice(0, 10);

    const sections = [
      {
        id: 'trending',
        title: 'Trending Now',
        tag: 'Prime Pick',
        subtitle: 'Top rated blockbusters and viewer favorites',
        movies: trending,
      },
      {
        id: 'now_showing',
        title: 'Now Showing in Theatres',
        tag: 'In Cinemas',
        subtitle: 'Book seats for the latest releases in luxury screens',
        movies: nowShowing,
      },
      {
        id: 'action',
        title: 'Action & Adventure',
        tag: 'High Octane',
        subtitle: 'Adrenaline-packed cinematic spectacles',
        movies: action,
      },
      {
        id: 'scifi',
        title: 'Sci-Fi & Future Worlds',
        tag: 'Visual Spectacle',
        subtitle: 'Mind-bending journeys across time and space',
        movies: scifi,
      },
      {
        id: 'drama',
        title: 'Critically Acclaimed Drama & Comedy',
        tag: 'Must Watch',
        subtitle: 'Award-winning storytelling and comedy',
        movies: drama,
      },
    ];

    return res.status(200).json({
      success: true,
      sections,
    });
  } catch (error) {
    console.error('getCuratedSections Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to load curated sections.' });
  }
};

// SYNC TMDB / EXTENDED CATALOG
export const syncTMDBMovies = async (req, res) => {
  try {
    const apiKey =
      req.query.apiKey ||
      req.body.apiKey ||
      process.env.TMDB_API_KEY ||
      '';

    const theatres = await Theatre.find({});
    let syncedMoviesCount = 0;

    if (apiKey) {
      console.log(`[TMDB Sync] Initiating TMDB sync across pages 1 to 5 with API key...`);
      const pagesToFetch = [1, 2, 3, 4, 5];
      const tmdbMovies = [];

      for (const p of pagesToFetch) {
        try {
          const [popRes, nowRes] = await Promise.all([
            fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${p}`),
            fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=${p}`),
          ]);

          if (popRes.ok) {
            const popData = await popRes.json();
            if (popData.results) tmdbMovies.push(...popData.results);
          }
          if (nowRes.ok) {
            const nowData = await nowRes.json();
            if (nowData.results) tmdbMovies.push(...nowData.results);
          }
        } catch (pageErr) {
          console.warn(`[TMDB Sync] Page ${p} fetch failed:`, pageErr.message);
        }
      }

      // Deduplicate by title
      const uniqueTmdb = new Map();
      tmdbMovies.forEach((m) => {
        if (m.title && !uniqueTmdb.has(m.title.toLowerCase())) {
          uniqueTmdb.set(m.title.toLowerCase(), m);
        }
      });

      for (const [_, tm] of uniqueTmdb) {
        const movieName = tm.title.trim();
        const exists = await Movie.findOne({ movieName: { $regex: new RegExp(`^${movieName}$`, 'i') } });

        const genres = (tm.genre_ids || [])
          .map((id) => TMDB_GENRES[id])
          .filter(Boolean);

        const moviePayload = {
          movieName,
          description: tm.overview && tm.overview.length >= 10 ? tm.overview : 'Experience the latest cinematic masterpiece on the big screen.',
          genres: genres.length > 0 ? genres : ['Action', 'Drama'],
          releaseDate: tm.release_date ? new Date(tm.release_date) : new Date(),
          language: tm.original_language === 'hi' ? 'Hindi' : 'English',
          duration: `${Math.floor(Math.random() * 2) + 2}h ${Math.floor(Math.random() * 45) + 10}m`,
          certification: 'UA',
          posterUrl: tm.poster_path
            ? `https://image.tmdb.org/t/p/w500${tm.poster_path}`
            : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
          bannerUrl: tm.backdrop_path
            ? `https://image.tmdb.org/t/p/original${tm.backdrop_path}`
            : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80',
          trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          rating: tm.vote_average ? Number(tm.vote_average.toFixed(1)) : 8.0,
          cast: ['Featured Star', 'Ensemble Cast'],
          director: 'Acclaimed Director',
        };

        let movieDoc;
        if (!exists) {
          movieDoc = await Movie.create(moviePayload);
          await generateShowsForMovie(movieDoc, theatres);
          syncedMoviesCount++;
        } else {
          movieDoc = await Movie.findByIdAndUpdate(exists._id, moviePayload, { new: true });
        }
      }
    }

    // Always ensure all rich blockbuster movies from seed dataset exist
    for (const movie of richBlockbusterMovies) {
      let m = await Movie.findOne({ movieName: movie.movieName });
      if (!m) {
        m = await Movie.create(movie);
        syncedMoviesCount++;
      }
      const hasShows = await Movie.findOne({ movieId: m._id.toString() });
      if (!hasShows) {
        await generateShowsForMovie(m, theatres);
      }
    }

    const totalCount = await Movie.countDocuments();
    return res.status(200).json({
      success: true,
      message: `Sync completed successfully! Total ${totalCount} movies in catalog.`,
      syncedMoviesCount,
      totalCount,
    });
  } catch (error) {
    console.error('syncTMDBMovies Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to synchronize movies.', error: error.message });
  }
};

// GET MOVIE BY ID (with reviews)
export const getMovieById = async (req, res) => {
  try {
    const { movieId } = req.params;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found.' });
    }

    const reviews = await Review.find({ movieId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      movie,
      reviews,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch movie details.' });
  }
};

// CREATE MOVIE (Admin)
export const createMovie = async (req, res) => {
  try {
    const {
      movieName,
      description,
      genres,
      releaseDate,
      language,
      duration,
      certification,
      posterUrl,
      bannerUrl,
      trailerUrl,
      cast,
      director,
      rating,
    } = req.body;

    if (!movieName || !description || !genres || !releaseDate || !language || !duration) {
      return res.status(400).json({ success: false, message: 'Please provide all required movie fields.' });
    }

    const parsedGenres = Array.isArray(genres)
      ? genres
      : String(genres).split(',').map((g) => g.trim());

    const parsedCast = Array.isArray(cast)
      ? cast
      : cast ? String(cast).split(',').map((c) => c.trim()) : [];

    const movie = await Movie.create({
      movieName,
      description,
      genres: parsedGenres,
      releaseDate: new Date(releaseDate),
      language,
      duration,
      certification: certification || 'UA',
      posterUrl: posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
      bannerUrl: bannerUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80',
      trailerUrl: trailerUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      cast: parsedCast,
      director: director || 'Director',
      rating: rating ? Number(rating) : 8.0,
    });

    // Auto-generate shows across theatres for this movie
    const theatres = await Theatre.find({});
    await generateShowsForMovie(movie, theatres);

    return res.status(201).json({
      success: true,
      message: 'Movie added successfully!',
      movie,
    });
  } catch (error) {
    console.error('createMovie Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to add movie.' });
  }
};

// UPDATE MOVIE (Admin)
export const updateMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const updated = await Movie.findByIdAndUpdate(movieId, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Movie not found.' });
    }
    return res.status(200).json({ success: true, message: 'Movie updated successfully.', movie: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update movie.' });
  }
};

// DELETE MOVIE (Admin)
export const deleteMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const deleted = await Movie.findByIdAndDelete(movieId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Movie not found.' });
    }
    return res.status(200).json({ success: true, message: 'Movie deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete movie.' });
  }
};
