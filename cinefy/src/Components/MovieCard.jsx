import { StarIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import timeFormat from "../lib/timeFormat";
import axios from 'axios';


const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [seats, setSeats] = useState(movie.remainingSeats || 0);

  const handleBuyTicket = async () => {
    if (seats <= 0) {
      setMessage("No seats available");
      return;
    }

    setLoading(true);
    setMessage('');
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/tickets/buy`,
        { showId: movie.id, seats: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update remaining seats locally
      setSeats(prev => prev - 1);
      setMessage(response.data.message || 'Ticket booked successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col justify-between p-3 bg-grey-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-66'>
      <img
        onClick={() => { navigate(`/movie/${movie.id}`); window.scrollTo(0, 0); }}
        src={movie.backdrop_path} alt=""
        className='rounded-lg h-52 w-full object-cover object-right-bottom cursor-pointer'
      />
      <p className='font-semibold mt-2 truncate'>{movie.title}</p>
      <p className='text-sm text-grey-400 mt-2'>
        {movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}.
        {movie.genres?.slice(0, 2).map(genre => genre.name).join(" | ") ?? ""}.
        {timeFormat(movie.runtime) ?? "N/A"}
      </p>

      <div className='flex items-center justify-between mt-4 pb-3'>
        <button
          onClick={handleBuyTicket}
          className={`px-4 py-2 text-xs transition rounded-full font-medium cursor-pointer ${seats > 0 ? 'bg-primary hover:bg-primary-dull' : 'bg-gray-600 cursor-not-allowed'}`}
          disabled={loading || seats <= 0}
        >
          {loading ? "Booking..." : seats > 0 ? "Buy Tickets" : "Sold Out"}
        </button>
        <p className='flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1'>
          <StarIcon className='w-4 h-4 text-primary fill-primary' />
          {movie.vote_average?.toFixed(1) ?? "N/A"}
        </p>
      </div>

      <p className="text-xs text-green-500 mt-1">
        {message}
      </p>

      <p className="text-xs text-gray-300 mt-1">
        Remaining Seats: {seats}
      </p>
    </div>
  );
};

export default MovieCard;
