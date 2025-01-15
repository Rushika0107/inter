import { SlidersHorizontal, Star, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

const MovieList = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  const [movies, setMovies] = useState<any[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [genres, setGenres] = useState<any[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<Set<number>>(new Set());
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [ratingRange, setRatingRange] = useState<[number, number]>([0, 10]);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiKey = "859afbb4b98e3b467da9c99ac390e950";
        const movieUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
        const genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;

        const [movieResponse, genreResponse] = await Promise.all([
          fetch(movieUrl),
          fetch(genreUrl),
        ]);

        const movieData = await movieResponse.json();
        const genreData = await genreResponse.json();

        setMovies(
          movieData.results.map((movie: any) => ({
            id: movie.id,
            title: movie.title,
            rating: movie.vote_average,
            image: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
            year: new Date(movie.release_date).getFullYear(),
            genre: movie.genre_ids,
            videoUrl: `https://www.youtube.com/embed/${movie.id}`,
          }))
        );

        setGenres(genreData.genres);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleChipClick = (genreId: number) => {
    const updatedGenres = new Set(selectedGenres);
    if (updatedGenres.has(genreId)) {
      updatedGenres.delete(genreId);
    } else {
      updatedGenres.add(genreId);
    }
    setSelectedGenres(updatedGenres);
  };

  const handleYearClick = (year: string) => {
    setSelectedYear(year === selectedYear ? null : year);
  };

  const handleClearFilters = () => {
    setSelectedGenres(new Set());
    setSelectedYear(null);
    setRatingRange([0, 10]);
  };

  const handleRatingClick = (rating: number, isMin: boolean) => {
    if (isMin) {
      setRatingRange([rating, ratingRange[1]]);
    } else {
      setRatingRange([ratingRange[0], rating]);
    }
  };

  const filteredMovies = movies.filter((movie) => {
    const genreMatch =
      selectedGenres.size === 0 || movie.genre.some((id: number) => selectedGenres.has(id));
    const yearMatch = !selectedYear || movie.year.toString() === selectedYear;
    const ratingMatch =
      movie.rating >= ratingRange[0] && movie.rating <= ratingRange[1];

    return genreMatch && yearMatch && ratingMatch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-100 mb-4 md:mb-0">
          {search ? `Search Results for "${search}"` : "Popular Movies"}
        </h1>
        <button
          className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="mb-4">
          <button
            className="text-white bg-red-600 px-4 py-2 rounded-lg mb-4"
            onClick={handleClearFilters}
          >
            Clear All Filters
          </button>

          <div className="flex gap-2 flex-wrap mb-4">
            {genres.map((genre) => (
              <div
                key={genre.id}
                onClick={() => handleChipClick(genre.id)}
                className={`${
                  selectedGenres.has(genre.id)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300"
                } px-4 py-2 rounded-full cursor-pointer transition-colors`}
              >
                {genre.name}
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-4">
            {["2023", "2024"].map((year) => (
              <div
                key={year}
                onClick={() => handleYearClick(year)}
                className={`${
                  selectedYear === year
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300"
                } px-4 py-2 rounded-full cursor-pointer transition-colors`}
              >
                {year}
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label className="text-white">Rating Range: {ratingRange[0]} - {ratingRange[1]}</label>
            <div className="flex gap-1">
              {[...Array(10)].map((_, i) => (
                <Star
                  key={i}
                  className={`cursor-pointer ${
                    i + 1 <= ratingRange[0] ? "text-yellow-500" : "text-gray-400"
                  }`}
                  onClick={() => handleRatingClick(i + 1, true)}
                />
              ))}
              <span className="text-white">to</span>
              {[...Array(10)].map((_, i) => (
                <Star
                  key={i + 10}
                  className={`cursor-pointer ${
                    i + 1 <= ratingRange[1] ? "text-yellow-500" : "text-gray-400"
                  }`}
                  onClick={() => handleRatingClick(i + 1, false)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredMovies.map((movie) => (
          <Link key={movie.id} to={`/movie/${movie.id}`}>
            <div
              className="bg-gray-800 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300"
              onMouseEnter={() => handleMouseEnter(movie.id)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative aspect-video group">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:opacity-80 transition-opacity duration-300"
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-yellow-500 font-medium">
                    {movie.rating.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold text-white mb-2">
                  {movie.title}
                </h2>
                <span className="text-gray-400 text-sm">{movie.year}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MovieList;
