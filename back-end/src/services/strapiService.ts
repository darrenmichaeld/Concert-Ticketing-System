import axios from 'axios';
const config = require('../config');

// It's a good practice to create an axios instance with default config
const strapiApi = axios.create({
  baseURL: config.STRAPI_URL,
  headers: {
    Authorization: `Bearer ${config.STRAPI_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export const strapiService = {
  async get(endpoint: string) {
    const response = await strapiApi.get(`/api/${endpoint}`);
    console.log("RESPONSE", response);
    return response.data;
  },

  async getById(endpoint: string, id: number | string) {
    const response = await strapiApi.get(`/api/${endpoint}/${id}`);
    return response.data;
  },

  async post(endpoint: string, data: any) {
    const response = await strapiApi.post(`/api/${endpoint}`, { data });
    return response.data;
  },

  async put(endpoint: string, id: number | string, data: any) {
    const response = await strapiApi.put(`/api/${endpoint}/${id}`, { data });
    return response.data;
  },

  async delete(endpoint: string, id: number | string) {
    const response = await strapiApi.delete(`/api/${endpoint}/${id}`);
    return response.data;
  },
};