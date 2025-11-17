// OrderPage.jsx
import React, { useState } from "react";
import "./order.css";
import logo from "../assets/salespoint-logo.png";
import { Link, useLocation } from "react-router-dom";

function OrderPage() {
  const location = useLocation();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // Default categories and items
  const [categories, setCategories] = useState(["All", "Hot Drinks", "Cold Drinks", "Food", "Snacks"]);
  const [items, setItems] = useState([
    { id: 1, name: "Americano", price: 50, category: "Hot Drinks" },
    { id: 2, name: "Frappuccino", price: 165, category: "Cold Drinks" },
    { id: 3, name: "Burger", price: 95, category: "Food", variants: ["Small", "Medium", "Large"] },
    { id: 4, name: "Donut", price: 35, category: "Snacks" },
    { id: 5, name: "Hot Chocolate", price: 70, category: "Hot Drinks" },
  ]);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  // Manage Menu Modal
  const [showManageMenuModal, setShowManageMenuModal] = useState(false);

  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const openItemModal = (item) => {
    setSelectedItem(item);
    setSelectedVariant(item.variants ? item.variants[0] : "");
    setShowItemModal(true);
  };

  const addToCart = () => {
    if (!selectedItem) return;
    const itemKey = selectedItem.id + (selectedVariant || "");
    setCart((prev) => {
      const existing = prev.find((i) => i.key === itemKey);
      if (existing) {
        return prev.map((i) =>
          i.key === itemKey ? { ...i, qty: i.qty + 1 } : i
        );
      } else {
        return [
          ...prev,
          {
            key: itemKey,
            id: selectedItem.id,
            name: selectedItem.name,
            price: selectedItem.price,
            variant: selectedVariant,
            qty: 1,
          },
        ];
      }
    });
    setShowItemModal(false);
  };

  const updateQty = (key, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.key === key ? { ...item, qty: item.qty + delta } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const finalTotal = Math.max(total - discount, 0);

  // --- Manage Menu Functions ---
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemCategory, setNewItemCategory] = useState(categories[1] || "");
  const [newItemVariants, setNewItemVariants] = useState("");

  const addCategory = () => {
    if (!newCategoryName.trim()) return;
    if (!categories.includes(newCategoryName)) {
      setCategories([...categories, newCategoryName]);
      setNewCategoryName("");
    }
  };

  const deleteCategory = (cat) => {
    if (cat === "All") return;
    if (window.confirm(`Delete category "${cat}"? Items in this category will also be deleted.`)) {
      setCategories(categories.filter((c) => c !== cat));
      setItems(items.filter((i) => i.category !== cat));
      if (selectedCategory === cat) setSelectedCategory("All");
    }
  };

  const addItem = () => {
    if (!newItemName.trim() || !newItemPrice || !newItemCategory) return;
    const variantsArray = newItemVariants
      ? newItemVariants.split(",").map((v) => v.trim())
      : [];
    const newItem = {
      id: Date.now(),
      name: newItemName,
      price: parseFloat(newItemPrice),
      category: newItemCategory,
      variants: variantsArray.length ? variantsArray : undefined,
    };
    setItems([...items, newItem]);
    setNewItemName("");
    setNewItemPrice("");
    setNewItemVariants("");
    setNewItemCategory(categories[1] || "");
  };

  const deleteItem = (id) => {
    if (window.confirm("Delete this item?")) {
      setItems(items.filter((i) => i.id !== id));
    }
  };

  return (
    <div className="pos-container">
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

      {/* Main POS Area */}
      <div className="left-panel">
        <div className="top-bar">
          <div className="logo-container">
            <img src={logo} alt="Sales Point Logo" className="logo" />
          </div>
          <input type="text" placeholder="Search..." />
          <div className="user-profile">John Doe Owner</div>
        </div>

        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={cat === selectedCategory ? "active" : ""}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="item-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="item-card" onClick={() => openItemModal(item)}>
              <div className="item-name">{item.name}</div>
              <div className="item-price">₱{item.price}</div>
            </div>
          ))}
        </div>

        <button className="add-item-btn" onClick={() => setShowManageMenuModal(true)}>Manage Menu</button>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <h3>Items</h3>
        {cart.length === 0 ? (
          <p className="empty-cart">No item is listed</p>
        ) : (
          <ul className="cart-list">
            {cart.map((item) => (
              <li key={item.key}>
                <div className="cart-item">
                  <span>{item.name} {item.variant && `(${item.variant})`}</span>
                  <span>₱{item.price * item.qty}</span>
                </div>
                <div className="qty-controls">
                  <button onClick={() => updateQty(item.key, -1)}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.key, 1)}>+</button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="discount-section">
          <label>Discount:</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
          />
        </div>

        <div className="total-section">
          <p>Total: ₱{finalTotal}</p>
        </div>

        <div className="payment-methods">
          <label>Payment Method:</label>
          <div className="payment-buttons">
            {["GCash", "Cash", "Card"].map((method) => (
              <button
                key={method}
                className={paymentMethod === method ? "selected" : ""}
                onClick={() => setPaymentMethod(method)}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={() => alert("Receipt printed!")}>Print Receipt</button>
          <button onClick={clearCart}>Clear</button>
        </div>
      </div>

      {/* Item Preview Modal */}
      {showItemModal && selectedItem && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedItem.name}</h3>
            <p>₱{selectedItem.price}</p>
            {selectedItem.variants && (
              <select
                value={selectedVariant}
                onChange={(e) => setSelectedVariant(e.target.value)}
              >
                {selectedItem.variants.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            )}
            <button onClick={addToCart}>Add to List</button>
            <button onClick={() => setShowItemModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Manage Menu Modal */}
      {showManageMenuModal && (
        <div className="modal">
          <div className="modal-content large-modal">
            <h2>Manage Menu</h2>

            {/* Categories Section */}
            <div className="manage-section">
              <h3>Categories</h3>
              <div className="add-form">
                <input
                  type="text"
                  placeholder="New Category Name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <button onClick={addCategory}>Add Category</button>
              </div>
              <ul>
                {categories.filter(c => c !== "All").map((cat) => (
                  <li key={cat}>
                    {cat} 
                    <button className="delete-btn" onClick={() => deleteCategory(cat)}>Delete</button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Items Section */}
            <div className="manage-section">
              <h3>Items</h3>
              <div className="add-form">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                />
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                >
                  {categories.filter(c => c !== "All").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Variants (optional, comma separated)"
                  value={newItemVariants}
                  onChange={(e) => setNewItemVariants(e.target.value)}
                />
                <button onClick={addItem}>Add Item</button>
              </div>
              <ul>
                {items.map((item) => (
                  <li key={item.id}>
                    {item.name} - ₱{item.price} ({item.category})
                    {item.variants && <> [{item.variants.join(", ")}]</>}
                    <button className="delete-btn" onClick={() => deleteItem(item.id)}>Delete</button>
                  </li>
                ))}
              </ul>
            </div>

            <button onClick={() => setShowManageMenuModal(false)}>Close</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default OrderPage;
