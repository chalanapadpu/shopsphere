
import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar.jsx';
import ProductCard from './components/ProductCard.jsx';


import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';

const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 1999,
    image: '/headphones.jpg',
  },
  {
    id: 2,
    name: 'Running Sneakers',
    category: 'Fashion',
    price: 2499,
    image: '/sneakers.jpg',
  },
  {
    id: 3,
    name: 'Smart Watch',
    category: 'Electronics',
    price: 2999,
    image: '/smartwatch.jpg',
  },
  {
    id: 4,
    name: 'Travel Backpack',
    category: 'Accessories',
    price: 1499,
    image: '/backpack.jpg',
  },
  {
    id: 5,
    name: 'Classic T-Shirt',
    category: 'Fashion',
    price: 799,
    image: '/tshirt.jpg',
  },
  {
    id: 6,
    name: 'Bluetooth Speaker',
    category: 'Electronics',
    price: 1799,
    image: '/speaker.jpg',
  },
  {
    id: 7,
    name: 'Wrist Watch',
    category: 'Accessories',
    price: 1299,
    image: '/watch.jpg',
  },
  {
    id: 8,
    name: 'Running Bottle',
    category: 'Accessories',
    price: 499,
    image: '/bottle.jpg',
  },
];



function ShopApp() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('default');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('shopsphere-cart')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('shopsphere-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const changeQuantity = (productId, amount) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    );
  };

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === 'All' || product.category === category;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sort === 'low-high') return a.price - b.price;
      if (sort === 'high-low') return b.price - a.price;
      return 0;
    });

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const isCartPage = location.pathname === '/cart';
  const isProductsPage = location.pathname === '/products';

  return (
    <div className="app">
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
      />
      {location.pathname === '/' && (
        <header className="hero" id="home">


          <p className="eyebrow">YOUR EVERYDAY MARKETPLACE</p>
          <h1>Find something<br />you'll love.</h1>
          <p>Discover useful products at great prices.</p>
          <a className="shop-button" href="#products">
            Explore Products →
          </a>
        </header>
      )}
      {(location.pathname === '/' || isProductsPage) && (
        <main className="products-section" id="products">
          <h2>Explore Products</h2>
          <p>Find your next favourite item.</p>

          <div className="product-controls">
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search products"
            />

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Filter by category"
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Accessories">Accessories</option>
            </select>

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Sort products by price"
            >
              <option value="default">Sort by: Featured</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>

          <p className="results-count">
            Showing {filteredProducts.length} products
          </p>



          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewProduct={setSelectedProduct}
              />
            ))}
          </div>



          {filteredProducts.length === 0 && (
            <p className="empty-message">
              No products found. Try another search or category.
            </p>
          )}
        </main>
      )}

      {selectedProduct && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedProduct(null)}
        >
          <section
            className="product-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setSelectedProduct(null)}
              aria-label="Close product details"
            >
              ×
            </button>

            <img
              className="detail-image"
              src={selectedProduct.image}
              alt={selectedProduct.name}
            />

            <p className="category">{selectedProduct.category}</p>
            <h2 id="product-modal-title">{selectedProduct.name}</h2>
            <p className="price">
              ₹{selectedProduct.price.toLocaleString('en-IN')}
            </p>

            <button
              type="button"
              onClick={() => {
                addToCart(selectedProduct);
                setSelectedProduct(null);
                setCartOpen(true);
              }}
            >
              Add to Cart
            </button>
          </section>
        </div>
      )}

      {cartOpen && (
        <div className="modal-overlay" onClick={() => setCartOpen(false)}>
          <section
            className="product-modal cart-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setCartOpen(false)}
              aria-label="Close cart"
            >
              ×
            </button>

            <h2 id="cart-modal-title">Your Shopping Cart</h2>

            {cart.length === 0 ? (
              <p>Your cart is empty. Explore our products!</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <img src={item.image} alt={item.name} />

                    <div className="cart-item-info">
                      <h3>{item.name}</h3>
                      <p>₹{item.price.toLocaleString('en-IN')}</p>

                      <div className="quantity-controls">
                        <button
                          type="button"
                          onClick={() => changeQuantity(item.id, -1)}
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          type="button"
                          onClick={() => changeQuantity(item.id, 1)}
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          +
                        </button>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <h3 className="cart-total">
                  Total: ₹{cartTotal.toLocaleString('en-IN')}
                </h3>
              </>
            )}

            <button type="button" onClick={() => setCartOpen(false)}>
              Continue Shopping
            </button>
          </section>
        </div>
      )}
      {(location.pathname === '/' || isProductsPage) && (
        <main className="products-section">
          <h2>Your Shopping Cart</h2>

          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />
                <h3>{item.name}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </p>

                <button onClick={() => changeQuantity(item.id, -1)}>
                  Remove one
                </button>
                <button onClick={() => changeQuantity(item.id, 1)}>
                  Add one
                </button>
                <button onClick={() => removeFromCart(item.id)}>
                  Remove item
                </button>
              </div>
            ))
          )}

          <h3>Total: ₹{cartTotal.toLocaleString('en-IN')}</h3>
          <button onClick={() => navigate('/products')}>
            Continue Shopping
          </button>
        </main>
      )}

      <footer id="contact">
        <p>© 2026 ShopSphere. Built with React.</p>
      </footer>
    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      <ShopApp />
    </BrowserRouter>
  );
}

export default App;

