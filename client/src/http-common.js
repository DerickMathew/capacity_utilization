import axios from 'axios';

export const XOLA_API = axios.create({
  baseURL: process.env.XOLA_API_URL
});
