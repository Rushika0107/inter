import { SlidersHorizontal, Star, X, Grid, List } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
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
  const [customFilters, setCustomFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [inputValue, setInputValue] = useState<string>("");

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
            description: movie.overview,
          }))
        );

        setGenres(genreData.genres);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChipClick = (genreId: number) => {
    const updatedGenres = new Set(selectedGenres);
    if (updatedGenres.has(genreId)) {
      updatedGenres.delete(genreId);
    } else {
      updatedGenres.add(genreId);
    }
    setSelectedGenres(updatedGenres);
  };

  const handleClearFilters = () => {
    setSelectedGenres(new Set());
    setSelectedYear(null);
    setRatingRange([0, 10]);
    setCustomFilters([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputSubmit = () => {
    if (inputValue.trim() && !customFilters.includes(inputValue.trim())) {
      setCustomFilters([...customFilters, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveChip = (filter: string) => {
    setCustomFilters(customFilters.filter((item) => item !== filter));
  };

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const genreMatch =
        selectedGenres.size === 0 || movie.genre.some((id: number) => selectedGenres.has(id));
      const yearMatch =
        !selectedYear || movie.year.toString() === selectedYear || customFilters.some((filter) => filter === movie.year.toString());
      const ratingMatch =
        movie.rating >= ratingRange[0] && movie.rating <= ratingRange[1];
      const customFilterMatch =
        customFilters.length === 0 ||
        customFilters.some((filter) =>
          movie.title.toLowerCase().includes(filter.toLowerCase())
        );

      return genreMatch && yearMatch && ratingMatch && customFilterMatch;
    });
  }, [movies, selectedGenres, selectedYear, ratingRange, customFilters]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-100 mb-4 md:mb-0">
          {search ? `Search Results for "${search}"` : "Popular Movies"}
        </h1>
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal /> Filters
          </button>
          <button
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? <List /> : <Grid />}
            {viewMode === "grid" ? "List View" : "Grid View"}
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-4">
          <button
            className="text-white bg-red-600 px-4 py-2 rounded-lg mb-4"
            onClick={handleClearFilters}
          >
            Clear All Filters
          </button>

          {/* Genre Chips */}
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

          {/* Custom Filter Input */}
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Type and press Enter (Year or Actor)"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white"
              onKeyDown={(e) => e.key === "Enter" && handleInputSubmit()}
            />
            <button
              onClick={handleInputSubmit}
              className="bg-blue-600 px-4 py-2 rounded-lg text-white hover:bg-blue-500"
            >
              Add
            </button>
          </div>

          {/* Custom Filter Chips */}
          <div className="flex gap-2 flex-wrap mb-4">
            {customFilters.map((filter, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white"
              >
                {filter}
                <X
                  className="cursor-pointer"
                  onClick={() => handleRemoveChip(filter)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Movies */}
      <div
        className={`${
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            : "flex flex-col gap-4"
        }`}
      >
        {filteredMovies.map((movie) =>
          viewMode === "grid" ? (
            <Link key={movie.id} to={`/movie/${movie.id}`}>
              <div className="bg-gray-800 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300">
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
          ) : (
            <div
              key={movie.id}
              className="flex gap-4 p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition"
            >
              <img
                src={movie.image}
                alt={movie.title}
                className="w-32 h-48 object-cover rounded-lg"
              />
              <div className="flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    {movie.title}
                  </h2>
                  <p className="text-gray-300 text-sm mb-2">
                    {movie.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-yellow-500 font-medium">
                    {movie.rating.toFixed(1)}
                  </span>
                  <span className="text-gray-400">({movie.year})</span>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MovieList;
