import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' }
});

// Naya ticket submit karo
export const submitTicket = (data) => API.post('/api/tickets', data);

// Saare tickets lao
export const getTickets = (params) => API.get('/api/tickets', { params });

// Single ticket lao
export const getTicket = (id) => API.get(`/api/tickets/${id}`);