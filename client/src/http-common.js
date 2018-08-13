import axios from 'axios';

export const HTTP = axios.create({
  baseURL: 'http://xola.local/',
  headers: {
    Authorization: 'Bearer {token}'
  }
});
