import React from 'react';
import { useNavigate } from 'react-router-dom';


const actors = [
    {
        id: 1190668,
        name: 'Timothée Chalamet',
        image: 'https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/535891_v9_bc.jpg',
        movies: ['Dune: Part Two', 'Wonka', 'Dune'],
    },
    {
        id: 505710,
        name: 'Zendaya',
        image: 'https://m.media-amazon.com/images/M/MV5BNzUzZTEwZjItM2I1Zi00N2UzLThiMzctYTA3ZTJkMDFiZjkyXkEyXkFqcGc@._V1_.jpg',
        movies: ['Dune', 'Smallfoot', 'Malcolm and Marie'],
    },
    {
        id: 109513,
        name: 'Florence Pugh',
        image: 'https://m.media-amazon.com/images/M/MV5BM2E4MTNkZDAtMjFjZi00ZGE5LTg0NDItNTNkZmM1MmM3YjRiXkEyXkFqcGc@._V1_.jpg',
        movies: ['Little Women', 'Black Widow', 'Midsommar'],
    },
    {
        id: 880,
        name: 'Robert Pattinson',
        image: 'https://m.media-amazon.com/images/M/MV5BMTkxOTQ4MTQ2OF5BMl5BanBnXkFtZTcwOTAxMDYwMg@@._V1_.jpg',
        movies: ['The Batman', 'Tenet', 'Twilight'],
    },
];

const ActorProfilePage = () => {
    const navigate = useNavigate();

    const handleCardClick = (id: number) => {
        navigate(`/actor/${id}`);
    };

    return (
        <div className="actor-profile-page p-4 bg-gray-1000 text-white">
            <h1 className="text-3xl font-bold mb-8 text-center">Popular Actors</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {actors.map((actor) => (
                    <div
                        key={actor.id}
                        className="actor-card bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl cursor-pointer transition-shadow"
                        onClick={() => handleCardClick(actor.id)}
                    >
                        <img
                            src={actor.image}
                            alt={actor.name}
                            className="w-full h-72 object-cover object-center transition-all duration-300 transform hover:scale-105"
                        />
                        <div className="p-4">
                            <h2 className="text-2xl font-semibold">{actor.name}</h2>
                            <h3 className="text-lg font-medium text-gray-300 mt-2">Movies:</h3>
                            <ul className="list-disc pl-5 text-sm text-gray-400">
                                {actor.movies.map((movie, index) => (
                                    <li key={index}>{movie}</li>
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
