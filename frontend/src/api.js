import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const fetchProducts = async () => {
  const response = await API.get('/products');
  return response.data;
};

export const deleteProduct = async (id) => {
  return [
    { id: 1, name: "Product 1", price: 100, stock: 10 },
    { id: 2, name: "Product 2", price: 200, stock: 5 },
  ];
};

export default API;



//const response = await API.get('/products');
  //return response.data;