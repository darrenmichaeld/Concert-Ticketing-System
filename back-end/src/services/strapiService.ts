import axios from 'axios';

// It's a good practice to create an axios instance with default config
export const strapiApi = axios.create({
  baseURL: "http://localhost:1337",
  headers: {
    Authorization: `Bearer 98d11447c62f35e0fbe019cdcf33187fc911f642b01d50080e6376d89d328b64cd942cd54fa29a93b26e4d189c9f770d0551226584abf42ef0b85fa35e2b1409e26aee8a2d337a0fb72d72b934f437db4e533b333d67d676e96a8c32c1225a9358366c2bcaad9da9920a54aa85591f3e32ac35f99779149abf2080209231393c`,
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