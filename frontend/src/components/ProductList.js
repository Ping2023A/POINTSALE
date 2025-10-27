// frontend/src/components/ProductList.js
/* eslint-disable no-restricted-globals */

import React, { useEffect, useState } from "react";
import { fetchProducts, deleteProduct } from "../api";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  async function load() {
    try {
      const res = await fetchProducts();
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    await deleteProduct(id);
    load();
  }

  return (
    <div>
      <h2>Products</h2>
      <table style={{width:"100%", borderCollapse:"collapse"}}>
        <thead>
          <tr><th>Name</th><th>Price</th><th>Stock</th><th>Action</th></tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.stock}</td>
              <td>
                <button onClick={() => handleDelete(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
