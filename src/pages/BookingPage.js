import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { bookingService } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './BookingPage.css';

const BookingPage = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // null, 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [successData, setSuccessData] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    setSubmissionStatus(null);
    setErrorMessage('');

    try {
      const response = await bookingService.createBooking(data);
      if (response.success) {
        setSubmissionStatus('success');
        setSuccessData(response.data);
        reset();
      } else {
        setSubmissionStatus('error');
        setErrorMessage(response.message || 'An unexpected error occurred.');
      }
    } catch (error) {
      setSubmissionStatus('error');
      setErrorMessage(error.response?.data?.message || 'Failed to submit booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page">
      <div className="container">
        <div className="booking-card">
          <h2 className="booking-title">Book a Technician <span>Site Visit</span></h2>

          {submissionStatus === 'success' ? (
            <div className="success-message">
              <h3>Booking Request Submitted!</h3>
              <p>Thank you! Your request has been received. Your reference number is <strong>#{successData.booking_reference}</strong>.</p>
              <p>Our team will contact you within 24 hours to confirm.</p>
            </div>
          ) : (
            <>
              <p className="booking-description">Need technical assistance or a site survey? Fill out the form below to request a visit from one of our qualified technicians.</p>
              {submissionStatus === 'error' && <div className="error-message">{errorMessage}</div>}
              <form onSubmit={handleSubmit(onSubmit)} id="booking-form" className="booking-form">
                <div className="form-section">
                  <h4>Your Details</h4>
                  <div className="form-row name-row">
                    <div className="form-group">
                      <label htmlFor="contact_name">First Name:</label>
                      <input type="text" id="contact_name" {...register('contact_name', { required: true })} />
                      {errors.contact_name && <span className="error-message">First name is required</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="contact_surname">Surname:</label>
                      <input type="text" id="contact_surname" {...register('contact_surname', { required: true })} />
                      {errors.contact_surname && <span className="error-message">Surname is required</span>}
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="contact_email">Email Address:</label>
                      <input type="email" id="contact_email" {...register('contact_email', { required: true, pattern: /\S+@\S+\.\S+/ })} />
                      {errors.contact_email && <span className="error-message">Please provide a valid email address</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="contact_phone">Phone Number:</label>
                      <input type="tel" id="contact_phone" {...register('contact_phone', { required: true })} />
                      {errors.contact_phone && <span className="error-message">Phone number is required</span>}
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="visit_address">Address for Site Visit:</label>
                    <input type="text" id="visit_address" placeholder="Full street address including suburb and postal code" {...register('visit_address', { required: true })} />
                    {errors.visit_address && <span className="error-message">Address is required</span>}
                  </div>
                </div>
                <div className="form-section">
                  <h4>Preferred Date & Time</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="preferred_date">Preferred Date:</label>
                      <input type="date" id="preferred_date" min={new Date().toISOString().split('T')[0]} {...register('preferred_date', { required: true })} />
                      {errors.preferred_date && <span className="error-message">Preferred date is required</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="preferred_time">Preferred Time:</label>
                      <select id="preferred_time" {...register('preferred_time', { required: true })}>
                        <option value="">Select a time slot</option>
                        <option value="08:00-12:00">Morning (8:00 AM - 12:00 PM)</option>
                        <option value="12:00-17:00">Afternoon (12:00 PM - 5:00 PM)</option>
                        <option value="flexible">Any time</option>
                      </select>
                      {errors.preferred_time && <span className="error-message">Preferred time is required</span>}
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="special_instructions">Reason for visit or special instructions (Optional):</label>
                    <textarea id="special_instructions" rows="3" placeholder="e.g., Poor signal, new setup query, gate access code..." {...register('special_instructions')}></textarea>
                  </div>
                </div>
                <button type="submit" id="submit-button" className="btn-submit" disabled={loading}>
                  {loading ? <LoadingSpinner size="small" /> : 'Request Booking'}
                </button>
                <p className="terms-note">Please note that this is a request. Our team will contact you to confirm the final date and time for the technician's visit.</p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};


export default BookingPage;