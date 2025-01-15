import React from "react";
import Hero from "../components/Hero.tsx";
import { Award, Clock, Star, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import MovieCarousel from "../components/MovieCarousel.tsx";

const Home = () => {
  const trendingMovies = [];
  const upcomingMovies = [];

  return (
    <div>
      <Hero />
      <main className="container mx-auto px-4 py-8">
      
        <div className="overflow-x-auto mb-12">
          <div className="flex space-x-4">
            {[
              {
                icon: TrendingUp,
                label: "Trending",
                path: "/movies?sort=trending",
                color: "bg-yellow-500",
              },
              {
                icon: Star,
                label: "Top Rated",
                path: "/top-rated",
                color: "bg-purple-500",
              },
              {
                icon: Clock,
                label: "Coming Soon",
                path: "/coming-soon",
                color: "bg-blue-500",
              },
              {
                icon: Award,
                label: "Awards",
                path: "/awards",
                color: "bg-red-500",
              },
            ].map((category, index) => (
              <Link
                key={index}
                to={category.path}
                className={`${category.color} p-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-70 transition-opacity`}
              >
                <category.icon className="w-5 h-5" />
                <span className="font-medium">{category.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <section className="mb-12">
          <div className="flex justify-between items-center mb-6"></div>
          <MovieCarousel movies={trendingMovies} />
        </section>
      </main>
    </div>
  );
};

export default Home;
