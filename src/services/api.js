import axios from 'axios';

// WordPress REST API base URL - update this to your WordPress site URL
const WP_API_BASE_URL = process.env.REACT_APP_WP_API_URL || 'https://starcast.co.za/wp-json';

const api = axios.create({
  baseURL: WP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Package services using WordPress REST API
export const packageService = {
  getFibrePackages: () => api.get('/starcast/v1/packages/fibre'),
  getLTEPackages: () => api.get('/starcast/v1/packages/lte'),
  getPackageById: (id) => api.get(`/wp/v2/fibre_packages/${id}`), // WordPress default endpoint
  getLTEPackageById: (id) => api.get(`/wp/v2/lte_packages/${id}`), // WordPress LTE endpoint
};

// Booking services using WordPress REST API
export const bookingService = {
  createBooking: (bookingData) => api.post('/starcast/v1/bookings', bookingData),
  checkAvailability: (date) => api.get(`/starcast/v1/bookings/availability/${date}`),
};

// Signup services using WordPress REST API
export const signupService = {
  createSignup: (signupData) => api.post('/starcast/v1/signup', signupData),
};

// Contact form service using WordPress REST API
export const contactService = {
  sendContactEmail: (contactData) => api.post('/starcast/v1/contact', contactData),
};

// Fibre application submission service
export const submitFibreApplication = async (applicationData) => {
  try {
    // Create FormData for file upload
    const formData = new FormData();
    
    // Add all fields to FormData
    if (applicationData instanceof FormData) {
      // If already FormData, use as is
      const response = await axios.post(`${WP_API_BASE_URL}/starcast/v1/fibre-application`, applicationData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Convert object to FormData
      Object.keys(applicationData).forEach(key => {
        if (applicationData[key] !== null && applicationData[key] !== undefined) {
          formData.append(key, applicationData[key]);
        }
      });
      
      const response = await axios.post(`${WP_API_BASE_URL}/starcast/v1/fibre-application`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }
  } catch (error) {
    console.error('Error submitting fibre application:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to submit application. Please try again.',
    };
  }
};

// LTE application submission service
export const submitLTEApplication = async (applicationData) => {
  try {
    // Create FormData for file upload
    const formData = new FormData();
    
    // Add all fields to FormData
    if (applicationData instanceof FormData) {
      // If already FormData, use as is
      const response = await axios.post(`${WP_API_BASE_URL}/starcast/v1/lte-application`, applicationData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Convert object to FormData
      Object.keys(applicationData).forEach(key => {
        if (applicationData[key] !== null && applicationData[key] !== undefined) {
          formData.append(key, applicationData[key]);
        }
      });
      
      const response = await axios.post(`${WP_API_BASE_URL}/starcast/v1/lte-application`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }
  } catch (error) {
    console.error('Error submitting LTE application:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to submit application. Please try again.',
    };
  }
};

// Promo code validation service
export const validatePromoCode = async (promoCode, packageId, packageType) => {
  try {
    const response = await api.post('/starcast/v1/validate-promo', {
      promo_code: promoCode,
      package_id: packageId,
      package_type: packageType,
    });
    return response.data;
  } catch (error) {
    console.error('Error validating promo code:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Invalid promo code',
    };
  }
};

// Default export for backward compatibility
export default {
  packageService,
  bookingService,
  signupService,
  contactService,
  submitFibreApplication,
  submitLTEApplication,
  validatePromoCode,
}; 