import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Clock } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const TMDB_API_KEY = "859afbb4b98e3b467da9c99ac390e950";
const TMDB_API_URL = "https://api.themoviedb.org/3";

const MovieCarousel = () => {
  const [trendingMovies, setTrendingMovies] = useState<any[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<any[]>([]);
  const [firebaseRatings, setFirebaseRatings] = useState<Record<number, number>>({});
  const visibleMovies = 4;

  // Fetch movie data from TMDb API
  const fetchMovies = async (endpoint: string) => {
    try {
      const response = await fetch(
        `${TMDB_API_URL}${endpoint}?api_key=${TMDB_API_KEY}&language=en-US&page=1`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();
      return data.results.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        rating: movie.vote_average,
        image: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
        year: new Date(movie.release_date).getFullYear(),
        genre: movie.genre_ids.slice(0, 2), // Include top genres
      }));
    } catch (error) {
      console.error("Error fetching movies:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadMovies = async () => {
      const [trending, upcoming] = await Promise.all([
        fetchMovies("/trending/movie/week"),
        fetchMovies("/movie/upcoming"),
      ]);
      setTrendingMovies(trending);
      setUpcomingMovies(upcoming);
    };

    loadMovies();
  }, []);

  const MovieCard = ({ movie }: { movie: any }) => (
    <div className="bg-zinc-900/50 rounded-xl overflow-hidden movie-card-hover backdrop-blur-sm">
      <div className="relative aspect-[12/9]">
        <img
          src={movie.image}
          alt={movie.title}
          className="w-full h-full object-cover hover-glow"
        />
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex flex-col items-center gap-1">
          <span className="text-yellow-500 font-medium">{movie.rating}</span>
          <span className="text-zinc-400 text-xs">
            User Rating: {firebaseRatings[movie.id] || "N/A"}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg truncate text-glow">{movie.title}</h3>
          <span className="text-zinc-400 text-sm">{movie.year}</span>
        </div>
        {movie.genre && (
          <div className="flex flex-wrap gap-2">
            {movie.genre.map((g: string, index: number) => (
              <span key={index} className="text-xs px-2 py-1 bg-zinc-800 rounded-full text-zinc-300">
                {g}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      {/* Trending Movies Section */}
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <TrendingUp className="w-6 h-6" />
        Trending Now
      </h2>
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={10}
        slidesPerView={visibleMovies}
        loop={true}
        navigation
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
      >
        {trendingMovies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <Link to={`/movie/${movie.id}`}>
              <MovieCard movie={movie} />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Upcoming Movies Section */}
      <h2 className="text-2xl font-bold flex items-center gap-2 mt-8">
        <Clock className="w-6 h-6" />
        Coming Soon
      </h2>
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={10}
        slidesPerView={visibleMovies}
        loop={true}
        navigation
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
      >
        {upcomingMovies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <Link to={`/movie/${movie.id}`}>
              <MovieCard movie={movie} />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MovieCarousel;
