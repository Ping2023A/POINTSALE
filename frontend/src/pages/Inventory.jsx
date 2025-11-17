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

  // Edit / Restock / Delete states
  const [editingItem, setEditingItem] = useState(null);
  const [restockItem, setRestockItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  // Handlers for edit
  const openEdit = (item) => setEditingItem(item);
  const saveEdit = (updated) => {
    setItems(items.map(it => (it.id === updated.id ? { ...it, name: updated.name, category: updated.category, price: updated.price } : it)));
    setEditingItem(null);
  };

  // Handlers for restock
  const openRestock = (item) => setRestockItem(item);
  const confirmRestock = (id, added) => {
    setItems(items.map(it => (it.id === id ? { ...it, stock: it.stock + added } : it)));
    setRestockItem(null);
  };

  // Handlers for delete
  const openDelete = (item) => setDeletingItem(item);
  const confirmDelete = (id) => {
    setItems(items.filter(it => it.id !== id));
    setDeletingItem(null);
  };

  // --- Inline reusable form components ---
  const EditItemForm = ({ item, categories, onSave, onCancel }) => {
    const [form, setForm] = useState({ name: item.name, category: item.category, price: item.price });
    const [error, setError] = useState('');

    const handleSave = () => {
      if (!form.name || form.name.trim() === '') return setError('Name is required');
      if (isNaN(form.price) || Number(form.price) < 0) return setError('Price must be >= 0');
      onSave({ ...item, name: form.name.trim(), category: form.category, price: Number(form.price) });
    };

    return (
      <div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="form-group">
          <label>Item Name:</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Category:</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={handleSave}>Save</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    );
  };

  const RestockForm = ({ item, onConfirm, onCancel }) => {
    const [addQty, setAddQty] = useState(0);

    const newStock = (Number(item.stock) || 0) + (Number(addQty) || 0);

    const handleConfirm = () => {
      const added = Number(addQty) || 0;
      if (added <= 0) return; // only allow adding
      onConfirm(added);
    };

    return (
      <div>
        <div className="form-group">
          <label>Item:</label>
          <input value={item.name} readOnly />
        </div>
        <div className="form-group">
          <label>Current Stock:</label>
          <input value={item.stock} readOnly />
        </div>
        <div className="form-group">
          <label>Add Stock:</label>
          <input type="number" min="0" value={addQty} onChange={(e) => setAddQty(e.target.value)} />
        </div>
        <div className="form-group">
          <label>New Stock:</label>
          <input value={newStock} readOnly />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={handleConfirm}>Confirm</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    );
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
          <div className="logo-container">
            <img src={logo} alt="Sales Point Logo" className="logo" />
          </div>
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
            Add New Item
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
                <th>Actions</th>
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
                  <td>
                    <div className="action-buttons">
                      <button className="icon-btn" title="Edit Item" onClick={() => openEdit(item)}>✏️</button>
                      <button className="icon-btn" title="Restock Item" onClick={() => openRestock(item)}>📦</button>
                      <button className="icon-btn delete" title="Delete Item" onClick={() => openDelete(item)}>🗑️</button>
                    </div>
                  </td>
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

        {/* Edit Item Modal */}
        {editingItem && (
          <div className="modal">
            <div className="modal-content">
              <h2>Edit Item</h2>
              <EditItemForm
                item={editingItem}
                categories={categories}
                onSave={(updated) => saveEdit(updated)}
                onCancel={() => setEditingItem(null)}
              />
            </div>
          </div>
        )}

        {/* Restock Modal */}
        {restockItem && (
          <div className="modal">
            <div className="modal-content">
              <h2>Restock Item</h2>
              <RestockForm
                item={restockItem}
                onConfirm={(added) => confirmRestock(restockItem.id, added)}
                onCancel={() => setRestockItem(null)}
              />
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {deletingItem && (
          <div className="modal">
            <div className="modal-content">
              <h3>Confirm Delete</h3>
              <p>Are you sure you want to delete <strong>{deletingItem.name}</strong>?</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button onClick={() => confirmDelete(deletingItem.id)} className="modal-delete">Delete</button>
                <button onClick={() => setDeletingItem(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Inventory;