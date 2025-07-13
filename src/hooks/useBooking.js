import { useState } from 'react';
import { bookingService } from '../services/api';

export const useBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createBooking = async (bookingData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookingService.createBooking(bookingData);
      setSuccess(true);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    createBooking,
    loading,
    error,
    success,
    resetState,
  };
}; 