import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import Admin from '../models/adminModel.js';
import Movie from '../models/movieModel.js';
import Theatre from '../models/theatreModel.js';
import Show from '../models/showModel.js';
import dayjs from 'dayjs';

export const generateSeatTier = (rows, cols) => {
  const seats = {};
  rows.forEach((r) => {
    for (let c = 1; c <= cols; c++) {
      seats[`${r}${c}`] = { available: true };
    }
  });
  return { rows, cols, seats };
};

export const generateShowsForMovie = async (movie, theatres) => {
  if (!theatres || theatres.length === 0) return [];
  const showTimes = ['10:30 AM', '02:00 PM', '06:15 PM', '09:45 PM'];
  const showDocs = [];

  for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
    const dateStr = dayjs().add(dayOffset, 'day').format('YYYY-MM-DD');
    const targetTheatres = theatres.slice(0, 2);

    for (const theatre of targetTheatres) {
      for (const time of showTimes.slice(0, 2)) {
        const showId = `SHOW-${movie._id.toString().slice(-4)}-${theatre.theatreId}-${dateStr}-${time.replace(/[\s:]/g, '')}`;

        // Check if show already exists
        const exists = await Show.findOne({ showId });
        if (exists) continue;

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

        // Pre-book seats for realism
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

  if (showDocs.length > 0) {
    await Show.insertMany(showDocs);
  }
  return showDocs;
};

export const richBlockbusterMovies = [
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
  },
  {
    movieName: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    genres: ['Action', 'Crime', 'Drama'],
    releaseDate: new Date('2008-07-18'),
    language: 'English',
    duration: '2h 32m',
    certification: 'UA',
    posterUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine'],
    director: 'Christopher Nolan',
    rating: 9.0,
  },
  {
    movieName: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    releaseDate: new Date('2010-07-16'),
    language: 'English',
    duration: '2h 28m',
    certification: 'UA',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy'],
    director: 'Christopher Nolan',
    rating: 8.8,
  },
  {
    movieName: 'Gladiator II',
    description: 'Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered.',
    genres: ['Action', 'Adventure', 'Drama'],
    releaseDate: new Date('2024-11-22'),
    language: 'English',
    duration: '2h 28m',
    certification: 'A',
    posterUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=4rgYUipGJNo',
    cast: ['Paul Mescal', 'Pedro Pascal', 'Denzel Washington', 'Connie Nielsen'],
    director: 'Ridley Scott',
    rating: 8.4,
  },
  {
    movieName: 'Avatar: The Way of Water',
    description: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race.',
    genres: ['Action', 'Adventure', 'Fantasy', 'Sci-Fi'],
    releaseDate: new Date('2022-12-16'),
    language: 'English',
    duration: '3h 12m',
    certification: 'UA',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=d9MyW72ELq0',
    cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver', 'Stephen Lang'],
    director: 'James Cameron',
    rating: 8.5,
  },
  {
    movieName: 'Top Gun: Maverick',
    description: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN\'s elite graduates.',
    genres: ['Action', 'Drama'],
    releaseDate: new Date('2022-05-27'),
    language: 'English',
    duration: '2h 10m',
    certification: 'UA',
    posterUrl: 'https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=giXco2jaZ_4',
    cast: ['Tom Cruise', 'Miles Teller', 'Jennifer Connelly', 'Jon Hamm'],
    director: 'Joseph Kosinski',
    rating: 8.7,
  },
  {
    movieName: 'The Batman',
    description: 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city\'s hidden corruption.',
    genres: ['Action', 'Crime', 'Drama'],
    releaseDate: new Date('2022-03-04'),
    language: 'English',
    duration: '2h 56m',
    certification: 'UA 16+',
    posterUrl: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=mqqft2x_Aa4',
    cast: ['Robert Pattinson', 'Zoë Kravitz', 'Jeffrey Wright', 'Colin Farrell'],
    director: 'Matt Reeves',
    rating: 8.3,
  },
  {
    movieName: 'John Wick: Chapter 4',
    description: 'John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe.',
    genres: ['Action', 'Crime', 'Thriller'],
    releaseDate: new Date('2023-03-24'),
    language: 'English',
    duration: '2h 49m',
    certification: 'A',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=qEVUtrk8_B4',
    cast: ['Keanu Reeves', 'Donnie Yen', 'Bill Skarsgård', 'Laurence Fishburne'],
    director: 'Chad Stahelski',
    rating: 8.6,
  },
  {
    movieName: 'Avengers: Endgame',
    description: 'After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos\' actions.',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    releaseDate: new Date('2019-04-26'),
    language: 'English',
    duration: '3h 01m',
    certification: 'UA',
    posterUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
    cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo', 'Chris Hemsworth', 'Scarlett Johansson'],
    director: 'Anthony Russo, Joe Russo',
    rating: 8.8,
  },
  {
    movieName: 'Barbie',
    description: 'Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans.',
    genres: ['Adventure', 'Comedy', 'Fantasy'],
    releaseDate: new Date('2023-07-21'),
    language: 'English',
    duration: '1h 54m',
    certification: 'UA',
    posterUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=pBk4NYhWNMM',
    cast: ['Margot Robbie', 'Ryan Gosling', 'America Ferrera', 'Kate McKinnon'],
    director: 'Greta Gerwig',
    rating: 8.0,
  },
  {
    movieName: 'Joker: Folie à Deux',
    description: 'Arthur Fleck is institutionalized at Arkham awaiting trial for his crimes as Joker. While struggling with his dual identity, Arthur not only stumbles upon true love, but also finds the music that\'s always been inside him.',
    genres: ['Crime', 'Drama', 'Musical'],
    releaseDate: new Date('2024-10-04'),
    language: 'English',
    duration: '2h 18m',
    certification: 'A',
    posterUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=_OKAwz2NiOI',
    cast: ['Joaquin Phoenix', 'Lady Gaga', 'Brendan Gleeson', 'Catherine Keener'],
    director: 'Todd Phillips',
    rating: 7.9,
  },
  {
    movieName: 'Everything Everywhere All at Once',
    description: 'A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes and connecting with the lives she could have led.',
    genres: ['Action', 'Adventure', 'Comedy', 'Sci-Fi'],
    releaseDate: new Date('2022-04-08'),
    language: 'English',
    duration: '2h 19m',
    certification: 'A',
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=wxN1T1uxQ2g',
    cast: ['Michelle Yeoh', 'Stephanie Hsu', 'Ke Huy Quan', 'Jamie Lee Curtis'],
    director: 'Daniel Kwan, Daniel Scheinert',
    rating: 8.8,
  },
  {
    movieName: 'Poor Things',
    description: 'The incredible tale about the fantastical evolution of Bella Baxter, a young woman brought back to life by the brilliant and unorthodox scientist Dr. Godwin Baxter.',
    genres: ['Comedy', 'Drama', 'Romance', 'Sci-Fi'],
    releaseDate: new Date('2023-12-08'),
    language: 'English',
    duration: '2h 21m',
    certification: 'A',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=RlbR5N6veqw',
    cast: ['Emma Stone', 'Mark Ruffalo', 'Willem Dafoe', 'Ramy Youssef'],
    director: 'Yorgos Lanthimos',
    rating: 8.5,
  },
  {
    movieName: 'RRR',
    description: 'A fearless revolutionary and an officer in the British force, who once shared a deep bond, decide to join forces and chart out an inspiring path of freedom against the despotic rulers.',
    genres: ['Action', 'Drama', 'History'],
    releaseDate: new Date('2022-03-25'),
    language: 'Hindi',
    duration: '3h 07m',
    certification: 'UA',
    posterUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1460881680858-30d870d7b388?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=NgBoMJy3_6M',
    cast: ['N.T. Rama Rao Jr.', 'Ram Charan', 'Ajay Devgn', 'Alia Bhatt'],
    director: 'S.S. Rajamouli',
    rating: 8.8,
  },
  {
    movieName: 'Stree 2: Sarkate Ka Aatank',
    description: 'After the events of Stree, the town of Chanderi is being haunted again. This time, women are mysteriously abducted by a headless entity known as Sarkata.',
    genres: ['Comedy', 'Horror'],
    releaseDate: new Date('2024-08-15'),
    language: 'Hindi',
    duration: '2h 27m',
    certification: 'UA',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=KVnsh4xWp_g',
    cast: ['Rajkummar Rao', 'Shraddha Kapoor', 'Pankaj Tripathi', 'Aparshakti Khurana'],
    director: 'Amar Kaushik',
    rating: 8.2,
  },
  {
    movieName: 'Jawan',
    description: 'A high-octane action thriller that outlines the emotional journey of a man who is set to rectify the wrongs in the society while fulfilling a promise made years ago.',
    genres: ['Action', 'Thriller'],
    releaseDate: new Date('2023-09-07'),
    language: 'Hindi',
    duration: '2h 49m',
    certification: 'UA',
    posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=COv52Qyctws',
    cast: ['Shah Rukh Khan', 'Nayanthara', 'Vijay Sethupathi', 'Deepika Padukone'],
    director: 'Atlee',
    rating: 8.1,
  },
  {
    movieName: 'Animal',
    description: 'A father-son relationship carved in blood and vengeance. A son goes on a destructive rampage when he learns of an assassination attempt on his father.',
    genres: ['Action', 'Crime', 'Drama'],
    releaseDate: new Date('2023-12-01'),
    language: 'Hindi',
    duration: '3h 24m',
    certification: 'A',
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=Dydmpfo68DA',
    cast: ['Ranbir Kapoor', 'Anil Kapoor', 'Bobby Deol', 'Rashmika Mandanna'],
    director: 'Sandeep Reddy Vanga',
    rating: 7.9,
  },
  {
    movieName: 'Alien: Romulus',
    description: 'While scavenging the deep ends of a derelict space station, a group of young space colonizers come face to face with the most terrifying life form in the universe.',
    genres: ['Horror', 'Sci-Fi', 'Thriller'],
    releaseDate: new Date('2024-08-16'),
    language: 'English',
    duration: '1h 59m',
    certification: 'A',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=x0XDEhP4MQs',
    cast: ['Cailee Spaeny', 'David Jonsson', 'Archie Renaux', 'Isabela Merced'],
    director: 'Fede Álvarez',
    rating: 8.2,
  },
  {
    movieName: 'Inside Out 2',
    description: 'Joy, Sadness, Anger, Fear and Disgust have been running a successful operation by all accounts. However, when Anxiety, Envy, Ennui and Embarrassment show up, things get chaotic.',
    genres: ['Animation', 'Adventure', 'Comedy'],
    releaseDate: new Date('2024-06-14'),
    language: 'English',
    duration: '1h 36m',
    certification: 'U',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=LEjhY15eCx0',
    cast: ['Amy Poehler', 'Maya Hawke', 'Kensington Tallman', 'Liza Lapira'],
    director: 'Kelsey Mann',
    rating: 8.6,
  },
  {
    movieName: 'The Wild Robot',
    description: 'After a shipwreck, an intelligent robot called Roz is stranded on an uninhabited island. To survive the harsh environment, Roz bonds with the island\'s animals and cares for an orphaned baby goose.',
    genres: ['Animation', 'Adventure', 'Sci-Fi'],
    releaseDate: new Date('2024-09-27'),
    language: 'English',
    duration: '1h 42m',
    certification: 'U',
    posterUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=67vbA5ZJdKQ',
    cast: ['Lupita Nyong\'o', 'Pedro Pascal', 'Kit Connor', 'Bill Nighy'],
    director: 'Chris Sanders',
    rating: 8.7,
  },
  {
    movieName: 'Wicked',
    description: 'Elphaba, a misunderstood young woman born with emerald-green skin, and Glinda, an exceptionally popular blonde, become unlikely friends in the magical Land of Oz.',
    genres: ['Adventure', 'Fantasy', 'Musical'],
    releaseDate: new Date('2024-11-22'),
    language: 'English',
    duration: '2h 40m',
    certification: 'U',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=6COmYeLsz4c',
    cast: ['Cynthia Erivo', 'Ariana Grande', 'Jonathan Bailey', 'Jeff Goldblum'],
    director: 'Jon M. Chu',
    rating: 8.3,
  }
];

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

    // 3. Seed Theatres
    const theatreCount = await Theatre.countDocuments();
    let theatres = [];
    if (theatreCount === 0) {
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

    // 4. Seed Movies
    for (const movie of richBlockbusterMovies) {
      let m = await Movie.findOne({ movieName: movie.movieName });
      if (!m) {
        m = await Movie.create(movie);
      }
      // Ensure shows exist for this movie
      const hasShows = await Show.findOne({ movieId: m._id.toString() });
      if (!hasShows) {
        await generateShowsForMovie(m, theatres);
      }
    }
    const finalMovieCount = await Movie.countDocuments();
    console.log(`[Seed] Database ready with ${finalMovieCount} blockbuster movies`);

  } catch (error) {
    console.error('[Seed Error]', error);
  }
};

export default seedDatabase;
