import React, { useEffect, useState } from 'react';
import { db } from '../firebase.ts'; 
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

interface Review {
    id: string;
    author: string;
    content: string;
    timestamp: any; 
    title: string;
}

const ReviewList: React.FC<{ userId: string }> = ({ userId }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        const reviewsRef = collection(db, `users/${userId}/reviews`);
        const q = query(reviewsRef, orderBy("timestamp", "desc")); 
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedReviews = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Review[];
            setReviews(fetchedReviews);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    if (loading) {
        return <p>Loading reviews...</p>;
    }

    if (reviews.length === 0) {
        return <p>No reviews available.</p>;
    }

    return (
        <ul>
            {reviews.map((review) => (
                <li key={review.id} className="bg-gray-800 p-4 rounded mb-2">
                    <h3 className="text-lg font-bold">{review.title}</h3>
                    <p className="italic">By: {review.author}</p>
                    <p>{review.content}</p>
                    <small className="text-gray-400">
                        {review.timestamp.toDate().toLocaleString()}
                    </small>
                </li>
            ))}
        </ul>
    );
};

export default ReviewList;
