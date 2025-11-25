import React, { useState, useEffect } from "react";
import axios from "axios";
import "./order.css";
import logo from "../assets/salespoint-logo.png";

const API_URL = "http://localhost:5000/api/menu";

export default function OrderPage() {
  const [categories, setCategories] = useState(["All"]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState("");

  const [showManageMenuModal, setShowManageMenuModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("");
  const [newItemVariants, setNewItemVariants] = useState("");

  // Fetch categories and items from backend on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await axios.get(`${API_URL}/categories`);
        setCategories(["All", ...catRes.data.map(c => c.name)]);

        const itemRes = await axios.get(`${API_URL}/items`);
        setItems(itemRes.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch menu data");
      }
    };
    fetchData();
  }, []);

  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter(item => item.category === selectedCategory);

  const openItemModal = (item) => {
    setSelectedItem(item);
    setSelectedVariant(item.variants ? item.variants[0] : "");
    setShowItemModal(true);
  };

  const addToCart = () => {
    if (!selectedItem) return;

    const itemKey = selectedItem._id + (selectedVariant || "");

    setCart(prev => {
      const existing = prev.find(i => i.key === itemKey);
      if (existing) {
        return prev.map(i =>
          i.key === itemKey ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [
        ...prev,
        {
          key: itemKey,
          id: selectedItem._id,
          name: selectedItem.name,
          price: selectedItem.price,
          variant: selectedVariant,
          qty: 1,
        },
      ];
    });

    setShowItemModal(false);
  };

  const updateQty = (key, delta) => {
    setCart(prev =>
      prev
        .map(i => (i.key === key ? { ...i, qty: i.qty + delta } : i))
        .filter(i => i.qty > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const finalTotal = Math.max(total - discount, 0);

  /* -------------------------
     CATEGORY FUNCTIONS
  ------------------------- */
  const addCategory = async () => {
    if (!newCategoryName.trim() || categories.includes(newCategoryName)) return;

    try {
      const res = await axios.post(`${API_URL}/categories`, { name: newCategoryName });
      setCategories([...categories, res.data.name]);
      setNewCategoryName("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add category");
    }
  };

  const deleteCategory = async (cat) => {
    if (cat === "All") return;
    if (!window.confirm(`Delete category "${cat}"? Items in this category will also be deleted.`)) return;

    try {
      await axios.delete(`${API_URL}/categories/${cat}`);
      setCategories(categories.filter(c => c !== cat));
      setItems(items.filter(i => i.category !== cat));
      if (selectedCategory === cat) setSelectedCategory("All");
    } catch (err) {
      console.error(err);
      alert("Failed to delete category");
    }
  };

  /* -------------------------
     ITEM FUNCTIONS
  ------------------------- */
  const addItem = async () => {
    if (!newItemName.trim() || !newItemPrice || !newItemCategory) return;

    const variantsArray = newItemVariants
      ? newItemVariants.split(",").map(v => v.trim())
      : [];

    const newItemData = {
      name: newItemName,
      price: parseFloat(newItemPrice),
      category: newItemCategory,
      variants: variantsArray.length ? variantsArray : undefined,
    };

    try {
      const res = await axios.post(`${API_URL}/items`, newItemData);
      setItems([...items, res.data]);
      setNewItemName("");
      setNewItemPrice("");
      setNewItemCategory(categories[1] || "");
      setNewItemVariants("");
    } catch (err) {
      console.error(err);
      alert("Failed to add item");
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await axios.delete(`${API_URL}/items/${id}`);
      setItems(items.filter(i => i._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete item");
    }
  };

  return (
    <div className="pos-container-modern">
      {/* LEFT PANEL */}
      <div className="left-panel-modern">
        <div className="top-bar-modern">
          <div className="logo-container-modern">
            <img src={logo} alt="Logo" className="logo-modern" />
          </div>
          <input type="text" placeholder="Search..." />
          <div className="user-profile-modern">John Doe • Owner</div>
        </div>

        <div className="category-tabs-modern">
          {categories.map(cat => (
            <button
              key={cat}
              className={cat === selectedCategory ? "active" : ""}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="item-grid-modern">
          {filteredItems.map(item => (
            <div
              key={item._id}
              className="item-card-modern"
              onClick={() => openItemModal(item)}
            >
              <div className="item-name-modern">{item.name}</div>
              <div className="item-price-modern">₱{item.price}</div>
            </div>
          ))}
        </div>

        <button
          className="add-item-btn-modern"
          onClick={() => setShowManageMenuModal(true)}
        >
          +
        </button>
      </div>

      {/* RIGHT PANEL — CART */}
      <div className="right-panel-modern">
        <div className="cart-header-modern">
          <div className="cart-title-modern">Order Summary</div>
          <div className="cart-count-modern">{cart.length} item{cart.length !== 1 ? "s" : ""}</div>
        </div>

        <div className="cart-content-modern">
          {cart.length === 0 ? (
            <div className="empty-cart-modern">No items added</div>
          ) : (
            <ul className="cart-list-modern">
              {cart.map(item => (
                <li key={item.key} className="cart-item-modern">
                  <div className="cart-item-top">
                    <div className="cart-item-name">
                      {item.name}{" "}
                      {item.variant && <span className="variant-tag-modern">{item.variant}</span>}
                    </div>
                    <div className="cart-subtotal-modern">₱{item.price * item.qty}</div>
                  </div>
                  <div className="qty-controls-modern">
                    <button onClick={() => updateQty(item.key, -1)}>-</button>
                    <span className="qty-count-modern">{item.qty}</span>
                    <button onClick={() => updateQty(item.key, 1)}>+</button>
                    <div className="cart-item-price-small">₱{item.price}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="cart-footer-modern">
          <div className="discount-section-modern">
            <label>Discount</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
            />
          </div>
          <div className="total-section-modern">Total: ₱{finalTotal}</div>

          <div className="payment-methods-modern">
            <label>Payment Method</label>
            <div className="payment-buttons-modern">
              {["GCash", "Cash", "Card"].map(m => (
                <button
                  key={m}
                  className={paymentMethod === m ? "selected" : ""}
                  onClick={() => setPaymentMethod(m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="action-buttons-modern">
            <button className="primary" onClick={() => alert("Receipt printed!")}>
              Print Receipt
            </button>
            <button onClick={clearCart} className="secondary">
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* ITEM MODAL */}
      {showItemModal && selectedItem && (
        <div className="modal-modern">
          <div className="modal-content-modern">
            <h3>{selectedItem.name}</h3>
            <p>₱{selectedItem.price}</p>

            {selectedItem.variants && (
              <select value={selectedVariant} onChange={(e) => setSelectedVariant(e.target.value)}>
                {selectedItem.variants.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            )}

            <button onClick={addToCart} className="add-to-cart-btn-modern">Add to Cart</button>
            <button onClick={() => setShowItemModal(false)} className="cancel-btn-modern">Cancel</button>
          </div>
        </div>
      )}

      {/* MANAGE MENU MODAL */}
      {showManageMenuModal && (
        <div className="modal-modern">
          <div className="modal-content-modern large-modal-modern">
            <h2>Manage Menu</h2>

            <div className="manage-section-modern">
              <h3>Categories</h3>
              <div className="add-form-modern">
                <input
                  type="text"
                  placeholder="New Category Name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <button onClick={addCategory}>Add</button>
              </div>
              <ul>
                {categories.filter(c => c !== "All").map(cat => (
                  <li key={cat}>
                    {cat}
                    <button className="delete-btn-modern" onClick={() => deleteCategory(cat)}>Delete</button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="manage-section-modern">
              <h3>Items</h3>
              <div className="add-form-modern">
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
                <select value={newItemCategory} onChange={(e) => setNewItemCategory(e.target.value)}>
                  {categories.filter(c => c !== "All").map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Variants (comma separated)"
                  value={newItemVariants}
                  onChange={(e) => setNewItemVariants(e.target.value)}
                />
                <button onClick={addItem}>Add Item</button>
              </div>

              <ul>
                {items.map(item => (
                  <li key={item._id}>
                    {item.name} - ₱{item.price} ({item.category})
                    {item.variants && ` [${item.variants.join(", ")}]`}
                    <button className="delete-btn-modern" onClick={() => deleteItem(item._id)}>Delete</button>
                  </li>
                ))}
              </ul>
            </div>

            <button onClick={() => setShowManageMenuModal(false)} className="close-modal-btn-modern">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
