import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.ts';
import { Link } from 'react-router-dom';

const FavoriteActorsPage = () => {
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    fetchFavoriteActors();
  }, []);

  const fetchFavoriteActors = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'favorites'));
      const favActors = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFavorites(favActors);
    } catch (error) {
      console.error('Error fetching favorite actors:', error);
    }
  };

  return (
    <div className="p-4 bg-gray-1000 text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">Favorite Actors</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {favorites.map((actor) => (
          <Link to={`/actor/${actor.id}`} key={actor.id}>
            <div className="actor-card bg-gray-800 rounded-lg shadow-lg hover:scale-105 transition-transform">
              <img
                src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                alt={actor.name}
                className="w-full h-72 object-cover object-center"
              />
              <div className="p-4">
                <h2 className="text-2xl font-semibold">{actor.name}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FavoriteActorsPage;
