// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Helper to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper for API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // If body is FormData, remove Content-Type to let browser set it with boundary
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  // Add auth token if available
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: async (userData) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
    }
    return data;
  },

  login: async (credentials) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    return apiRequest('/auth/profile');
  },

  updateProfile: async (userData) => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  isAuthenticated: () => {
    return !!getAuthToken();
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// Bus API
export const busAPI = {
  getAll: async () => {
    return apiRequest('/buses');
  },

  getById: async (id) => {
    return apiRequest(`/buses/${id}`);
  },

  create: async (busData) => {
    return apiRequest('/buses', {
      method: 'POST',
      body: JSON.stringify(busData),
    });
  },

  update: async (id, busData) => {
    return apiRequest(`/buses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(busData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/buses/${id}`, {
      method: 'DELETE',
    });
  },
};

// Route API
export const routeAPI = {
  getAll: async () => {
    return apiRequest('/routes');
  },

  search: async (params) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/routes/search?${queryString}`);
  },

  getById: async (id) => {
    return apiRequest(`/routes/${id}`);
  },

  create: async (routeData) => {
    return apiRequest('/routes', {
      method: 'POST',
      body: JSON.stringify(routeData),
    });
  },

  update: async (id, routeData) => {
    return apiRequest(`/routes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(routeData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/routes/${id}`, {
      method: 'DELETE',
    });
  },
};

// Booking API
export const bookingAPI = {
  create: async (bookingData) => {
    return apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  getMyBookings: async () => {
    return apiRequest('/bookings/my');
  },

  getById: async (id) => {
    return apiRequest(`/bookings/${id}`);
  },

  cancel: async (id) => {
    return apiRequest(`/bookings/${id}/cancel`, {
      method: 'PUT',
    });
  },

  // Admin only
  getAll: async () => {
    return apiRequest('/bookings');
  },

  getDashboardStats: async () => {
    return apiRequest('/bookings/stats');
  },
};

export default {
  auth: authAPI,
  bus: busAPI,
  route: routeAPI,
  booking: bookingAPI,
};
