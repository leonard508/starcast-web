// Format price for display
export const formatPrice = (price) => {
  if (!price) return 'N/A';
  return `R${price.toLocaleString()}`;
};

// Format speed for display
export const formatSpeed = (speed) => {
  if (!speed) return 'N/A';
  return `${speed}Mbps`;
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (South African format)
export const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^(\+27|0)[0-9]{9}$/;
  return phoneRegex.test(phone);
};

// Format date for display
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-ZA');
};

// Debounce function
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}; 