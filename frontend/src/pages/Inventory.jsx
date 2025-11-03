import React, { useState } from 'react';
import './inventory.css';
import logo from '../assets/salespoint-logo.png';

const Inventory = () => {
  const categories = ["Hot Drinks", "Cold Drinks", "Food", "Snacks"];
  const [items, setItems] = useState([
    { id: 1, name: "Americano", category: "Hot Drinks", stock: 100, price: 50 },
    { id: 2, name: "Frappuccino", category: "Cold Drinks", stock: 75, price: 165 },
    { id: 3, name: "Burger", category: "Food", stock: 50, price: 95 },
    { id: 4, name: "Donut", category: "Snacks", stock: 120, price: 35 }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Hot Drinks',
    stock: 0,
    price: 0
  });

  // Filter items based on search term
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate overall cost for an item
  const calculateOverallCost = (stock, price) => stock * price;

  // Handle adding new item
  const handleAddItem = (e) => {
    e.preventDefault();
    const id = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
    setItems([...items, { ...newItem, id }]);
    setNewItem({ name: '', category: 'Hot Drinks', stock: 0, price: 0 });
    setShowAddModal(false);
  };


  return (
    <div className="pos-container">
      {/* Left Sidebar */}
      <div className="sidebar">
        <div className="nav-icon">🏠</div>
        <div className="nav-icon">🧾</div>
        <div className="nav-icon">⚙️</div>
      </div>

      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="logo-container">
            <img src={logo} alt="Sales Point Logo" className="logo" />
          </div>
          <div className="header-content">
            <h1>Inventory Management</h1>
            <div className="search-add-container">
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button
                className="add-item-button"
                onClick={() => setShowAddModal(true)}
              >
                Add Item
              </button>
            </div>
          </div>
          <div className="user-profile">John Doe Owner</div>
        </div>

        <div className="inventory-table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Overall Cost</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.stock}</td>
                  <td>₱{item.price}</td>
                  <td>₱{calculateOverallCost(item.stock, item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Item Modal */}
        {showAddModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Add New Item</h2>
              <form onSubmit={handleAddItem}>
                <div className="form-group">
                  <label>Item Name:</label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category:</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Stock:</label>
                  <input
                    type="number"
                    value={newItem.stock}
                    onChange={(e) => setNewItem({...newItem, stock: parseInt(e.target.value)})}
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price:</label>
                  <input
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value)})}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="modal-buttons">
                  <button type="submit">Add Item</button>
                  <button type="button" onClick={() => setShowAddModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;