import React, { useEffect, useState } from "react";
import axios from "axios";
import { Youtube, Award, Instagram, Star, Twitter } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const Actordetails = () => {
  const { id } = useParams();
  const [actor, setActor] = useState<any>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const tmdbAPIKey = "859afbb4b98e3b467da9c99ac390e950"; 

  useEffect(() => {
    const fetchActorData = async () => {
      try {
        const actorRes = await axios.get(
          `https://api.themoviedb.org/3/person/${id}?api_key=${tmdbAPIKey}&language=en-US`
        );
        setActor(actorRes.data);

        const moviesRes = await axios.get(
          `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${tmdbAPIKey}&language=en-US`
        );
        setMovies(moviesRes.data.cast);

        const socialRes = await axios.get(
          `https://api.themoviedb.org/3/person/${id}/external_ids?api_key=${tmdbAPIKey}`
        );
        setActor((prevActor: any) => ({
          ...prevActor,
          ...socialRes.data,
        }));
      } catch (error) {
        console.error("Error fetching actor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActorData();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="relative h-[300px] md:h-[400px] mb-6 md:mb-8 rounded-xl overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${actor?.profile_path})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80" />
        </div>
        <div className="relative h-full container flex flex-col-reverse md:flex-row items-start md:items-end pb-4 md:pb-8">
          <img
            src={`https://image.tmdb.org/t/p/w500${actor?.profile_path}`}
            alt={actor?.name}
            className="w-28 h-28 md:w-48 md:h-48 rounded-xl object-cover border-4 border-gray-900"
          />
          <div className="mt-4 md:mt-0 md:ml-6">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">{actor?.name}</h1>
            <div className="flex items-center gap-3 text-sm md:text-base">
              <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
              <span>{actor?.popularity} Popularity</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        <div>
          <div className="bg-gray-800 rounded-xl p-4 md:p-6">
            <h2 className="font-semibold mb-4">Personal Info</h2>
            <dl className="space-y-2 text-sm md:text-base">
              <div>
                <dt className="text-gray-400">Born</dt>
                <dd>{actor?.birthday}</dd>
              </div>
              <div>
                <dt className="text-gray-400">Place of Birth</dt>
                <dd>{actor?.place_of_birth}</dd>
              </div>
              <div>
                <dt className="text-gray-400">Movies</dt>
                <dd>{movies.length} titles</dd>
              </div>
              <div>
                <dt className="text-gray-400">Social Media</dt>
                <div className="flex gap-3">
                  {actor?.instagram_id && (
                    <a
                      href={`https://instagram.com/${actor?.instagram_id}`}
                      className="text-gray-200 hover:text-white"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Instagram className="w-6 h-6" />
                    </a>
                  )}
                  {actor?.twitter_id && (
                    <a
                      href={`https://twitter.com/${actor?.twitter_id}`}
                      className="text-gray-200 hover:text-white"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter className="w-6 h-6" />
                    </a>
                  )}
                  {actor?.youtube_id && (
                    <a
                      href={`https://youtube.com/${actor?.youtube_id}`}
                      className="text-gray-200 hover:text-white"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Youtube className="w-6 h-6" />
                    </a>
                  )}
                </div>
              </div>
            </dl>
          </div>
        </div>

        <div className="md:col-span-2">
          <section className="mb-6 md:mb-12">
            <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">Biography</h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              {actor?.biography || "Biography not available."}
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">Known For</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
              {movies.slice(0, 6).map((movie: any) => (
                <Link key={movie.id} to={`/movie/${movie.id}`}>
                  <div className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform">
                    <div className="relative aspect-[2/3]">
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-black/60 px-2 py-1 rounded-md flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-yellow-500 font-medium">
                          {movie.vote_average}
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm md:text-base">{movie.title}</h3>
                      <p className="text-gray-400 text-xs md:text-sm">as {movie.character}</p>
                      <p className="text-gray-500 text-xs">{movie.release_date?.split("-")[0]}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Actordetails;
