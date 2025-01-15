import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.tsx';
import { getAuth, signOut } from 'firebase/auth';
import { db, storage } from '../firebase.ts';
import { doc, setDoc, deleteDoc, getDoc, collection, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import ReviewList from '../components/ReviewList.tsx';
import axios from 'axios';

const genreToId = {
  'Action': 28,
  'Comedy': 35,
  'Drama': 18,
  'Fantasy': 14,
  'Horror': 27,
  'Mystery': 9648,
  'Romance': 10749,
  'Science Fiction': 878,
  'Thriller': 53,
  'Western': 37,
};

const BASE_POSTER_URL = 'https://image.tmdb.org/t/p/original/';
const TMDB_API_KEY = '859afbb4b98e3b467da9c99ac390e950';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [username, setUsername] = useState(user?.username || '');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(user?.preferences?.split(',') || []);
  const [ratedMovies, setRatedMovies] = useState<{ id: string; title: string; posterPath: string; rating: number }[]>([]);
  const navigate = useNavigate();
  const [isFileTooLarge, setIsFileTooLarge] = useState(false);
  const [watchlist, setWatchlist] = useState<{ id: string; title: string; posterPath: string }[]>([]);
  const [recommendations, setRecommendations] = useState<{ id: string; title: string; posterPath: string }[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecommendations = async (genres: string[]) => {
    const genreIds = genres
      .filter(genre => genre)
      .map(genre => genreToId[genre])
      .join(',');

    try {
      const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          with_genres: genreIds,
          page: 1,
        },
      });

      const movies = response.data.results.map((movie: any) => ({
        id: movie.id.toString(),
        title: movie.title,
        posterPath: BASE_POSTER_URL + movie.poster_path,
        image: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
      }));

      return movies;
    } catch (error) {
      console.error('Error fetching movie recommendations:', error);
      return [];
    }
  };

  const handleRemoveFromWatchlist = async (movieId: string) => {
    const movieRef = doc(db, `users/${user.uid}/watchlist`, movieId);
    await deleteDoc(movieRef);
  };

  useEffect(() => {
    if (user?.uid) {
      const fetchUserData = async () => {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUsername(userData.username);
          setProfilePicture(userData.profilePicture);
          setSelectedGenres(userData.preferences.split(','));
        }
      };

      const watchlistRef = collection(db, `users/${user.uid}/watchlist`);
      const unsubscribeWatchlist = onSnapshot(watchlistRef, (snapshot) => {
        const updatedWatchlist = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          posterPath: `${BASE_POSTER_URL}${doc.data().posterPath}`,
        }));
        setWatchlist(updatedWatchlist);
      });

      const ratingsRef = collection(db, `users/${user.uid}/ratings`);
      const unsubscribeRatings = onSnapshot(ratingsRef, (snapshot) => {
        const moviesMap = new Map();
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          if (!moviesMap.has(data.title)) {
            moviesMap.set(data.title, {
              id: doc.id,
              title: data.title,
              posterPath: `${BASE_POSTER_URL}${data.posterPath}`,
              rating: data.rating,
            });
          }
        });
        setRatedMovies(Array.from(moviesMap.values()));
      });

      fetchUserData();
      return () => {
        unsubscribeRatings();
      };
    }
  }, [user?.uid]);

  useEffect(() => {
    const fetchAndSetRecommendations = async () => {
      const fetchedRecommendations = await fetchRecommendations(selectedGenres);
      setRecommendations(fetchedRecommendations.slice(0, 6));
    };

    fetchAndSetRecommendations();
  }, [selectedGenres]);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setIsFileTooLarge(true);
        return;
      }
      if (file.size > 1048576) {
        setIsFileTooLarge(true);
        return;
      }
      setIsFileTooLarge(false);
      setProfilePicture(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const userRef = doc(db, 'users', user.uid);
      let imageUrl = profilePicture;

      if (typeof profilePicture === 'object' && profilePicture instanceof File) {
        const storageRef = ref(storage, `users/${user.uid}/profilePicture`);
        const snapshot = await uploadBytes(storageRef, profilePicture);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      await setDoc(
        userRef,
        {
          username,
          profilePicture: imageUrl,
          preferences: selectedGenres.join(','),
        },
        { merge: true }
      );

      setProfilePicture(imageUrl);
      setUsername(username);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error updating profile, please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  };

  const handleRecommendationClick = (movieId: string) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="profile-page bg-black text-white min-h-screen p-6">
      {isFileTooLarge && (
        <div className="error-message text-red-500 mb-4">
          The file size exceeds the limit of 1MB. Please upload a smaller image.
        </div>
      )}

      <div className="profile-container max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Profile Information Section */}
        <div className="left-section flex-1">
          <h1 className="text-4xl font-bold mb-8 text-yellow-500">Profile Page</h1>

          <div className="profile-header flex flex-col lg:flex-row gap-6 mb-8">
  {profilePicture ? (
    <img
      src={`${profilePicture}?${new Date().getTime()}`}
      alt="Profile"
      className="w-36 h-36 rounded-full border-4 border-yellow-500 object-cover"
    />
  ) : (
    <div className="w-36 h-36 rounded-full border-4 border-yellow-500 flex items-center justify-center bg-gray-700">
      {/* SVG Human Icon as Default */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        className="w-16 h-16"
      >
        <circle cx="12" cy="7" r="4" stroke="none" fill="white" />
        <path d="M12 13c-5 0-7 3-7 3v3h14v-3s-2-3-7-3z" fill="none" stroke="white" />
      </svg>
    </div>
  )}
  <div className="flex flex-col gap-4">
    <input
      type="text"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      placeholder="Edit Username"
      className="bg-gray-800 text-white p-3 rounded-lg"
    />

  </div>
</div>



          {/* Preferences Section */}
          <div className="preferences mb-8">
            <h2 className="text-2xl font-semibold mb-4">Preferences</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {Object.keys(genreToId).map((genre) => (
                <button
                  key={genre}
                  className={`px-5 py-2 rounded-lg ${
                    selectedGenres.includes(genre) ? 'bg-yellow-500' : 'bg-gray-700'
                  }`}
                  onClick={() => setSelectedGenres((prev) =>
                    prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
                  )}
                >
                  {genre}
                </button>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={handleSave}
                className={`mt-4 px-8 py-3 rounded-lg ${
                  isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-cyan-600'
                }`}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="reviews-section mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Reviews</h2>
            <ReviewList userId={user?.uid} />
          </div>

          <button
            onClick={handleLogout}
            className="mt-4 bg-red-500 px-8 py-3 rounded-lg hover:bg-red-600 w-full"
          >
            Logout
          </button>
        </div>

        {/* Right Sidebar: Rated Movies, Watchlist, and Recommendations */}
        <div className="right-section flex-1">
         {/* Rated Movies Section */}
<div className="rated-movies mb-8">
  <h2 className="text-2xl font-semibold mb-4">Your Rated Movies</h2>
  <div className="flex flex-wrap gap-4">
    {ratedMovies.length === 0 ? (
      <p className="text-gray-500">No rated movies yet</p>
    ) : (
      ratedMovies.map((movie) => (
        <div key={movie.id} className="text-center bg-gray-800 p-4 rounded-lg shadow-md">
          
          <p className="text-white text-lg">{movie.title}</p>
          <p className="text-yellow-400 text-sm">{movie.rating} / 10</p>
        </div>
      ))
    )}
  </div>
</div>


          {/* Watchlist Section */}
          <div className="watchlist mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Watchlist</h2>
            <div className="flex flex-wrap gap-4">
              {watchlist.length === 0 ? (
                <p className="text-gray-500">No movies in watchlist yet</p>
              ) : (
                watchlist.map((movie) => (
                  <div key={movie.id} className="text-center">
                    <img src={movie.posterPath} alt={movie.title} className="w-24 h-32" />
                    <p>{movie.title}</p>
                    <button
                      onClick={() => handleRemoveFromWatchlist(movie.id)}
                      className="text-red-500 mt-2"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recommendations Section */}
          {showRecommendations && recommendations.length > 0 && (
            <div className="mt-6">
              <h2 className="text-2xl font-semibold mb-4">Recommendations</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {recommendations.map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => handleRecommendationClick(movie.id)}
                    className="cursor-pointer bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                  >
                    <img
                      src={movie.posterPath}
                      alt={movie.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <p className="text-center text-lg font-medium text-white">{movie.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center mt-4">
            <button
              onClick={() => setShowRecommendations(!showRecommendations)}
              className="mt-4 bg-yellow-500 px-8 py-3 rounded-lg hover:bg-yellow-600 w-full"
            >
              {showRecommendations ? 'Hide Recommendations' : 'See Recommendations'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
