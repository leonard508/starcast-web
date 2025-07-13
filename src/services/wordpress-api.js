import axios from 'axios';

// WordPress REST API base URL - update this to your WordPress site URL
const WP_API_BASE_URL = process.env.REACT_APP_WP_API_URL || 'https://starcast.co.za/wp-json';

const wpApi = axios.create({
  baseURL: WP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// WordPress REST API services
export const wordpressApiService = {
  // Package services
  getFibrePackages: () => wpApi.get('/starcast/v1/packages/fibre'),
  getLTEPackages: () => wpApi.get('/starcast/v1/packages/lte'),
  
  // Booking services
  createBooking: (bookingData) => wpApi.post('/starcast/v1/bookings', bookingData),
  checkAvailability: (date) => wpApi.get(`/starcast/v1/bookings/availability/${date}`),
  
  // Signup services
  createSignup: (signupData) => wpApi.post('/starcast/v1/signup', signupData),
  
  // Contact form
  sendContactEmail: (contactData) => wpApi.post('/starcast/v1/contact', contactData),
};

export default wordpressApiService; 