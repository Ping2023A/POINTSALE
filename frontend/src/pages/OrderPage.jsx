import React, { useState } from "react";
import "./order.css";
import logo from "../assets/salespoint-logo.png";

function OrderPage() {
  const categories = ["All", "Hot Drinks", "Cold Drinks", "Food", "Snacks"];
  const items = [
    { id: 1, name: "Americano", price: 50, category: "Hot Drinks" },
    { id: 2, name: "Frappuccino", price: 165, category: "Cold Drinks" },
    { id: 3, name: "Burger", price: 95, category: "Food", variants: ["Small", "Medium", "Large"] },
    { id: 4, name: "Donut", price: 35, category: "Snacks" },
    { id: 5, name: "Hot Chocolate", price: 70, category: "Hot Drinks" },
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const openItemModal = (item) => {
    setSelectedItem(item);
    setSelectedVariant(item.variants ? item.variants[1] : "");
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

  return (
    <div className="pos-container">
      {/* Left Sidebar */}
      <div className="sidebar">
        <div className="nav-icon">🏠</div>
        <div className="nav-icon">🧾</div>
        <div className="nav-icon">⚙️</div>
      </div>

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
          <button onClick={() => setShowAddCategoryModal(true)}>+ Add Categories</button>
        </div>

        <div className="item-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="item-card" onClick={() => openItemModal(item)}>
              <div className="item-name">{item.name}</div>
              <div className="item-price">₱{item.price}</div>
            </div>
          ))}
        </div>

        <button className="add-item-btn" onClick={() => setShowAddItemModal(true)}>+</button>
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

      {/* Add Item Modal (Placeholder) */}
      {showAddItemModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Item</h3>
            <p>[Form goes here]</p>
            <button onClick={() => setShowAddItemModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Add Category Modal (Placeholder) */}
      {showAddCategoryModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add New Category</h3>
            <p>[Form goes here]</p>
            <button onClick={() => setShowAddCategoryModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderPage;