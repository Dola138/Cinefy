// src/components/BuyTicketButton.jsx
import React, { useState, useEffect } from "react";
import { getShow, buyTicket } from "../api";

const BuyTicketButton = ({ showId }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [remainingSeats, setRemainingSeats] = useState(null);

  const fetchShowData = async () => {
    try {
      const response = await getShow(showId);
      setRemainingSeats(response.data.remainingSeats);
    } catch (error) {
      console.error("Failed to fetch show data", error);
    }
  };

  useEffect(() => {
    fetchShowData();
  }, [showId]);

  const handleBuyTicket = async () => {
    setLoading(true);
    setMessage("");
    const token = localStorage.getItem("token");

    try {
      const response = await buyTicket(showId, token);
      setMessage(response.data.message);
      setRemainingSeats(prev => (prev !== null ? prev - 1 : null));
    } catch (error) {
      setMessage(error.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p>Remaining Seats: {remainingSeats !== null ? remainingSeats : "Loading..."}</p>
      <button onClick={handleBuyTicket} disabled={loading || remainingSeats === 0}>
        {loading ? "Booking..." : remainingSeats === 0 ? "Sold Out" : "Buy Ticket"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default BuyTicketButton;
