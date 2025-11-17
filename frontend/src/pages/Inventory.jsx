import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './inventory.css';
import logo from '../assets/salespoint-logo.png';

const Inventory = () => {
  const location = useLocation();
  const categories = ["Hot Drinks", "Cold Drinks", "Food", "Snacks"];
  const [items, setItems] = useState([
    { id: 1, name: "Americano", category: "Hot Drinks", stock: 100, price: 50 },
    { id: 2, name: "Frappuccino", category: "Cold Drinks", stock: 75, price: 165 },
    { id: 3, name: "Burger", category: "Food", stock: 50, price: 95 },
    { id: 4, name: "Donut", category: "Snacks", stock: 120, price: 35 }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Hot Drinks',
    stock: 0,
    price: 0
  });

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateOverallCost = (stock, price) => stock * price;

  const handleAddItem = (e) => {
    e.preventDefault();
    const id = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
    setItems([...items, { ...newItem, id }]);
    setNewItem({ name: '', category: 'Hot Drinks', stock: 0, price: 0 });
    setShowAddModal(false);
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarExpanded ? "expanded" : ""}`}>
        <div>
          <div className="nav-toggle" onClick={() => setSidebarExpanded(!sidebarExpanded)}>☰</div>
          <Link to="/dashboard" className={`nav-icon ${location.pathname === "/dashboard" ? "active" : ""}`}>
            🏠 {sidebarExpanded && <span>Dashboard</span>}
          </Link>
          <Link to="/roles" className={`nav-icon ${location.pathname === "/roles" ? "active" : ""}`}>
            👥 {sidebarExpanded && <span>Roles</span>}
          </Link>
          <Link to="/inventory" className={`nav-icon ${location.pathname === "/inventory" ? "active" : ""}`}>
            📦 {sidebarExpanded && <span>Inventory</span>}
          </Link>
          <Link to="/order" className={`nav-icon ${location.pathname === "/order" ? "active" : ""}`}>
            🧾 {sidebarExpanded && <span>Order Entries</span>}
          </Link>
          <Link to="/audit" className={`nav-icon ${location.pathname === "/audit" ? "active" : ""}`}>
            🕵️ {sidebarExpanded && <span>Audit Logs</span>}
          </Link>
          <Link to="/shift" className={`nav-icon ${location.pathname === "/shift" ? "active" : ""}`}>
            📅 {sidebarExpanded && <span>Shift Board</span>}
          </Link>
        </div>
        <div>
          <Link to="/settings" className={`nav-icon ${location.pathname === "/settings" ? "active" : ""}`}>
            ⚙️ {sidebarExpanded && <span>Settings</span>}
          </Link>
          <Link to="/login" className="nav-icon">
            🔓 {sidebarExpanded && <span>Sign Out</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-bar">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="top-icons">
            <span className="user">John Doe Owner</span>
          </div>
        </header>

        <section className="inventory-header">
          <h1>Inventory Management</h1>
          <button className="add-item-button" onClick={() => setShowAddModal(true)}>
            Add Item
          </button>
        </section>

        <section className="inventory-table-container">
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
        </section>

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
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category:</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Stock:</label>
                  <input
                    type="number"
                    value={newItem.stock}
                    onChange={(e) => setNewItem({ ...newItem, stock: parseInt(e.target.value) })}
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price:</label>
                  <input
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
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
      </main>
    </div>
  );
};

export default Inventory;