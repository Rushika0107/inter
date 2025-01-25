import React, { useState } from "react";
import { Star } from "lucide-react";

const RatingSection = ({ user, onSubmitRating }: { user: boolean; onSubmitRating: (rating: number) => void }) => {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [selectedStar, setSelectedStar] = useState<number | null>(null);

  const handleRatingSubmit = () => {
    if (selectedStar !== null) {
      onSubmitRating(selectedStar);
      alert(`You rated this movie ${selectedStar}/10!`);
    } else {
      alert("Please select a rating before submitting!");
    }
  };
  

  return (
    <section className="my-12 px-4">
      <h2 className="text-3xl font-bold text-white mb-8 border-b-2 border-gray-700">Rate this Movie (/10)</h2>
      {user ? (
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            {Array.from({ length: 10 }, (_, index) => index + 1).map((star) => (
              <Star
                key={star}
                className={`w-8 h-8 cursor-pointer transition-transform ${
                  (hoveredStar || selectedStar) >= star ? "text-yellow-500" : "text-gray-400"
                }`}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(null)}
                onClick={() => setSelectedStar(star)}
              />
            ))}
          </div>
          <button
            onClick={handleRatingSubmit}
            className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-yellow-400 hover:shadow-xl transition-all transform hover:scale-105"
          >
            Submit Rating
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-400 text-lg mt-6">Log in to rate this movie.</p>
      )}
    </section>
  );
};

export default RatingSection;
