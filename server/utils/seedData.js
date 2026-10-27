import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import Admin from '../models/adminModel.js';
import Movie from '../models/movieModel.js';
import Theatre from '../models/theatreModel.js';
import Show from '../models/showModel.js';
import dayjs from 'dayjs';

export const seedDatabase = async () => {
  try {
    // 1. Seed Admin
    const existingAdmin = await Admin.findOne({
      $or: [{ email: 'admin@imovies.com' }, { username: 'admin' }],
    });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Admin.create({
        username: 'admin',
        email: 'admin@imovies.com',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('[Seed] Admin account created (admin@imovies.com / admin123)');
    }

    // 2. Seed Demo User
    const existingUser = await User.findOne({
      $or: [{ email: 'user@imovies.com' }, { username: 'cinephile' }],
    });
    if (!existingUser) {
      const hashedUserPassword = await bcrypt.hash('user123', 10);
      await User.create({
        username: 'cinephile',
        email: 'user@imovies.com',
        password: hashedUserPassword,
        role: 'user',
        phone: '+91 9876543210',
      });
      console.log('[Seed] Demo user account created (user@imovies.com / user123)');
    }

    // 3. Seed Movies
    const movieCount = await Movie.countDocuments();
    let movies = [];
    if (movieCount === 0) {
      const movieData = [
        {
          movieName: 'Dune: Part Two',
          description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
          genres: ['Action', 'Adventure', 'Sci-Fi'],
          releaseDate: new Date('2024-03-01'),
          language: 'English',
          duration: '2h 46m',
          certification: 'UA 16+',
          posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
          trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
          cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
          director: 'Denis Villeneuve',
          rating: 8.8,
        },
        {
          movieName: 'Interstellar',
          description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival as Earth faces extinction.',
          genres: ['Adventure', 'Drama', 'Sci-Fi'],
          releaseDate: new Date('2014-11-07'),
          language: 'English',
          duration: '2h 49m',
          certification: 'UA',
          posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
          trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
          cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
          director: 'Christopher Nolan',
          rating: 8.9,
        },
        {
          movieName: 'Oppenheimer',
          description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during WWII.',
          genres: ['Biography', 'Drama', 'History'],
          releaseDate: new Date('2023-07-21'),
          language: 'English',
          duration: '3h 00m',
          certification: 'A',
          posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1200&q=80',
          trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
          cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
          director: 'Christopher Nolan',
          rating: 8.9,
        },
        {
          movieName: 'Spider-Man: Across the Spider-Verse',
          description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
          genres: ['Animation', 'Action', 'Adventure'],
          releaseDate: new Date('2023-06-02'),
          language: 'English',
          duration: '2h 20m',
          certification: 'U',
          posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=600&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
          trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
          cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Daniel Kaluuya'],
          director: 'Joaquim Dos Santos',
          rating: 8.7,
        },
        {
          movieName: 'Deadpool & Wolverine',
          description: 'Wolverine is recovering from his injuries when he crosses paths with the loudmouth, unpredictable merc with a mouth, Deadpool.',
          genres: ['Action', 'Comedy', 'Sci-Fi'],
          releaseDate: new Date('2024-07-26'),
          language: 'English',
          duration: '2h 07m',
          certification: 'A',
          posterUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
          trailerUrl: 'https://www.youtube.com/watch?v=73_1biulkYk',
          cast: ['Ryan Reynolds', 'Hugh Jackman', 'Emma Corrin'],
          director: 'Shawn Levy',
          rating: 8.1,
        },
        {
          movieName: 'Kalki 2898 AD',
          description: 'A modern-day avatar of Vishnu, a Hindu god, who is believed to have descended to the earth to protect the world from evil forces.',
          genres: ['Action', 'Sci-Fi', 'Fantasy'],
          releaseDate: new Date('2024-06-27'),
          language: 'Hindi',
          duration: '3h 01m',
          certification: 'UA',
          posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
          bannerUrl: 'https://images.unsplash.com/photo-1460881680858-30d870d7b388?auto=format&fit=crop&w=1200&q=80',
          trailerUrl: 'https://www.youtube.com/watch?v=kQDd1AhGIHk',
          cast: ['Prabhas', 'Amitabh Bachchan', 'Kamal Haasan', 'Deepika Padukone'],
          director: 'Nag Ashwin',
          rating: 8.0,
        }
      ];
      movies = await Movie.insertMany(movieData);
      console.log(`[Seed] Inserted ${movies.length} blockbuster movies`);
    } else {
      movies = await Movie.find({});
    }

    // 4. Seed Theatres
    const theatreCount = await Theatre.countDocuments();
    let theatres = [];
    if (theatreCount === 0) {
      const generateSeatTier = (rows, cols) => {
        const seats = {};
        rows.forEach((r) => {
          for (let c = 1; c <= cols; c++) {
            seats[`${r}${c}`] = { available: true };
          }
        });
        return { rows, cols, seats };
      };

      const theatreData = [
        {
          theatreName: 'PVR ICON: Gold Class, Phoenix Palladium',
          theatreId: 'THTR-001',
          location: 'Lower Parel, Mumbai',
          balconySeatPrice: 450,
          middleSeatPrice: 320,
          lowerSeatPrice: 200,
          balconySeats: generateSeatTier(['A', 'B'], 10),
          middleSeats: generateSeatTier(['C', 'D', 'E'], 10),
          lowerSeats: generateSeatTier(['F', 'G'], 10),
        },
        {
          theatreName: 'IMAX Cinemax: Forum Mall',
          theatreId: 'THTR-002',
          location: 'Koramangala, Bangalore',
          balconySeatPrice: 500,
          middleSeatPrice: 350,
          lowerSeatPrice: 220,
          balconySeats: generateSeatTier(['A', 'B'], 10),
          middleSeats: generateSeatTier(['C', 'D', 'E'], 10),
          lowerSeats: generateSeatTier(['F', 'G'], 10),
        },
        {
          theatreName: 'INOX Megaplex: Inorbit Mall',
          theatreId: 'THTR-003',
          location: 'Madhapur, Hyderabad',
          balconySeatPrice: 400,
          middleSeatPrice: 280,
          lowerSeatPrice: 180,
          balconySeats: generateSeatTier(['A', 'B'], 10),
          middleSeats: generateSeatTier(['C', 'D', 'E'], 10),
          lowerSeats: generateSeatTier(['F', 'G'], 10),
        },
        {
          theatreName: 'Cinepolis: DLF Avenue',
          theatreId: 'THTR-004',
          location: 'Saket, New Delhi',
          balconySeatPrice: 420,
          middleSeatPrice: 300,
          lowerSeatPrice: 190,
          balconySeats: generateSeatTier(['A', 'B'], 10),
          middleSeats: generateSeatTier(['C', 'D', 'E'], 10),
          lowerSeats: generateSeatTier(['F', 'G'], 10),
        }
      ];
      theatres = await Theatre.insertMany(theatreData);
      console.log(`[Seed] Inserted ${theatres.length} luxury cinema theatres`);
    } else {
      theatres = await Theatre.find({});
    }

    // 5. Seed Shows
    const showCount = await Show.countDocuments();
    if (showCount === 0 && movies.length > 0 && theatres.length > 0) {
      const showTimes = ['10:30 AM', '02:00 PM', '06:15 PM', '09:45 PM'];
      const showDocs = [];

      for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
        const dateStr = dayjs().add(dayOffset, 'day').format('YYYY-MM-DD');

        for (const movie of movies) {
          // Schedule in 2 theatres per movie
          const targetTheatres = theatres.slice(0, 2);
          for (const theatre of targetTheatres) {
            for (const time of showTimes.slice(0, 2)) {
              const showId = `SHOW-${movie._id.toString().slice(-4)}-${theatre.theatreId}-${dateStr}-${time.replace(/[\s:]/g, '')}`;

              // Build initial tickets map
              const tickets = {};
              ['A', 'B'].forEach((r) => {
                for (let c = 1; c <= 10; c++) {
                  tickets[`${r}${c}`] = { status: 'available', price: theatre.balconySeatPrice, tier: 'balcony' };
                }
              });
              ['C', 'D', 'E'].forEach((r) => {
                for (let c = 1; c <= 10; c++) {
                  tickets[`${r}${c}`] = { status: 'available', price: theatre.middleSeatPrice, tier: 'middle' };
                }
              });
              ['F', 'G'].forEach((r) => {
                for (let c = 1; c <= 10; c++) {
                  tickets[`${r}${c}`] = { status: 'available', price: theatre.lowerSeatPrice, tier: 'lower' };
                }
              });

              // Pre-book a couple seats to show realism
              tickets['D5'] = { status: 'booked', price: theatre.middleSeatPrice, tier: 'middle' };
              tickets['D6'] = { status: 'booked', price: theatre.middleSeatPrice, tier: 'middle' };

              showDocs.push({
                adminEmail: 'admin@imovies.com',
                showId,
                movieId: movie._id.toString(),
                theatreName: theatre.theatreName,
                theatreId: theatre.theatreId,
                showDate: dateStr,
                showTime: time,
                tickets,
              });
            }
          }
        }
      }

      await Show.insertMany(showDocs);
      console.log(`[Seed] Inserted ${showDocs.length} show schedules across dates and theatres`);
    }
  } catch (error) {
    console.error('[Seed Error]', error);
  }
};

export default seedDatabase;
