import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface KnownFor {
  title?: string;
  name?: string;
}

interface Actor {
  id: number;
  name: string;
  profile_path: string;
  known_for: KnownFor[];
}

const API_KEY = '859afbb4b98e3b467da9c99ac390e950';
const BASE_URL = 'https://api.themoviedb.org/3';

const ActorProfilePage = () => {
  const [actors, setActors] = useState<Actor[]>([]); // Explicitly typing the state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchPopularActors = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${BASE_URL}/person/popular?api_key=${API_KEY}&language=en-US&page=1`);
      const data = await response.json();
      if (data.results) {
        setActors(data.results);
      } else {
        setError('Failed to fetch actors.');
      }
    } catch (err) {
      console.error('Error fetching popular actors:', err);
      setError('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularActors();
  }, []);

  const handleCardClick = (id: number) => {
    navigate(`/actor/${id}`);
  };

  return (
    <div className="actor-profile-page p-4 bg-gray-1000 text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">Popular Actors</h1>
      {loading && <p className="text-center text-gray-400">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {!loading &&
          !error &&
          actors.map((actor) => (
            <div
              key={actor.id}
              className="actor-card bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl cursor-pointer transition-shadow"
              onClick={() => handleCardClick(actor.id)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                alt={actor.name}
                className="w-full h-72 object-cover object-center transition-all duration-300 transform hover:scale-105"
              />
              <div className="p-4">
                <h2 className="text-2xl font-semibold">{actor.name}</h2>
                <h3 className="text-lg font-medium text-gray-300 mt-2">Known For:</h3>
                <ul className="list-disc pl-5 text-sm text-gray-400">
                  {actor.known_for.map((movie, index) => (
                    <li key={index}>{movie.title || movie.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ActorProfilePage;
