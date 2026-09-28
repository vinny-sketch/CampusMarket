import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  X,
  XCircle,
} from 'lucide-react';

import backpackImage from './assets/images/backpack_1790065483337.jpg';
import calculatorImage from './assets/images/calculator_1790065421122.jpg';
import laptopStandImage from './assets/images/laptop_stand_1790065504638.jpg';
import notebookImage from './assets/images/notebook_pack_1790065447536.jpg';
import stickyNotesImage from './assets/images/sticky_notes_1790065515740.jpg';
import usbDriveImage from './assets/images/usb_drive_1790065472451.jpg';
import waterBottleImage from './assets/images/water_bottle_1790065494178.jpg';
import wirelessMouseImage from './assets/images/wireless_mouse_1790065457682.jpg';

type Category =
  | 'All'
  | 'Stationery'
  | 'Electronics'
  | 'Bags'
  | 'Accessories';

type Product = {
  id: number;
  name: string;
  category: Exclude<Category, 'All'>;
  price: number;
  image: string;
  alt: string;
  stock: number;
};

type CartItem = {
  productId: number;
  quantity: number;
};

type FormErrors = {
  name?: string;
  email?: string;
  quantity?: string;
};

const products: Product[] = [
  {
    id: 1,
    name: 'Campus Notebook Pack',
    category: 'Stationery',
    price: 350,
    image: notebookImage,
    alt: 'Pack of campus notebooks for student coursework',
    stock: 20,
  },
  {
    id: 2,
    name: 'Scientific Calculator',
    category: 'Electronics',
    price: 1800,
    image: calculatorImage,
    alt: 'Scientific calculator suitable for university mathematics',
    stock: 10,
  },
  {
    id: 3,
    name: 'Wireless Mouse',
    category: 'Electronics',
    price: 1200,
    image: wirelessMouseImage,
    alt: 'Wireless computer mouse for laptop and desktop use',
    stock: 15,
  },
  {
    id: 4,
    name: 'Student Backpack',
    category: 'Bags',
    price: 2500,
    image: backpackImage,
    alt: 'Student backpack suitable for carrying campus supplies',
    stock: 8,
  },
  {
    id: 5,
    name: 'USB Flash Drive',
    category: 'Electronics',
    price: 900,
    image: usbDriveImage,
    alt: 'USB flash drive for storing university documents and files',
    stock: 25,
  },
  {
    id: 6,
    name: 'Reusable Water Bottle',
    category: 'Accessories',
    price: 700,
    image: waterBottleImage,
    alt: 'Reusable water bottle for students on campus',
    stock: 18,
  },
  {
    id: 7,
    name: 'Laptop Stand',
    category: 'Accessories',
    price: 2200,
    image: laptopStandImage,
    alt: 'Adjustable laptop stand for a comfortable study setup',
    stock: 12,
  },
  {
    id: 8,
    name: 'Sticky Notes',
    category: 'Stationery',
    price: 250,
    image: stickyNotesImage,
    alt: 'Colourful sticky notes for organising study tasks',
    stock: 30,
  },
];

const categories: Category[] = [
  'All',
  'Stationery',
  'Electronics',
  'Bags',
  'Accessories',
];

const CART_STORAGE_KEY = 'campusmarket-cart';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const [quantities, setQuantities] = useState<Record<number, string>>({});
  const [quantityErrors, setQuantityErrors] = useState<Record<number, string>>(
    {},
  );

  const [galleryIndex, setGalleryIndex] = useState(0);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [formQuantity, setFormQuantity] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const registrationFormRef = useRef<HTMLFormElement | null>(null);
  const successMessageRef = useRef<HTMLDivElement | null>(null);

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);

      if (!savedCart) {
        return [];
      }

      const parsedCart: unknown = JSON.parse(savedCart);

      if (!Array.isArray(parsedCart)) {
        return [];
      }

      return parsedCart.filter(
        (item): item is CartItem =>
          typeof item === 'object' &&
          item !== null &&
          typeof (item as CartItem).productId === 'number' &&
          typeof (item as CartItem).quantity === 'number' &&
          Number.isInteger((item as CartItem).quantity) &&
          (item as CartItem).quantity > 0,
      );
    } catch {
      return [];
    }
  });

  const [cartOpen, setCartOpen] = useState(false);
  const [cartMessage, setCartMessage] = useState('');

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (!cartMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCartMessage('');
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [cartMessage]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const categoryMatches =
        selectedCategory === 'All' || product.category === selectedCategory;

      const searchMatches =
        normalizedSearch.length === 0 ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch);

      return categoryMatches && searchMatches;
    });
  }, [selectedCategory, searchTerm]);

  const safeGalleryIndex =
    filteredProducts.length === 0
      ? 0
      : Math.min(galleryIndex, filteredProducts.length - 1);

  const currentGalleryProduct = filteredProducts[safeGalleryIndex];

  const runningTotal = filteredProducts.reduce((total, product) => {
    const rawQuantity = quantities[product.id];

    if (!rawQuantity || quantityErrors[product.id]) {
      return total;
    }

    const quantity = Number(rawQuantity);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return total;
    }

    return total + product.price * quantity;
  }, 0);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const cartSubtotal = cartItems.reduce((total, item) => {
    const product = products.find((current) => current.id === item.productId);

    if (!product) {
      return total;
    }

    return total + product.price * item.quantity;
  }, 0);

  function handleCategoryChange(category: Category) {
    setSelectedCategory(category);
    setGalleryIndex(0);
  }

  function handleQuantityChange(productId: number, value: string) {
    setQuantities((current) => ({
      ...current,
      [productId]: value,
    }));

    if (value.trim() === '') {
      setQuantityErrors((current) => ({
        ...current,
        [productId]: 'Quantity is required.',
      }));
      return;
    }

    const quantity = Number(value);

    if (!Number.isInteger(quantity)) {
      setQuantityErrors((current) => ({
        ...current,
        [productId]: 'Quantity must be a whole number.',
      }));
      return;
    }

    if (quantity <= 0) {
      setQuantityErrors((current) => ({
        ...current,
        [productId]: 'Quantity must be greater than zero.',
      }));
      return;
    }

    setQuantityErrors((current) => {
      const updated = { ...current };
      delete updated[productId];
      return updated;
    });
  }

  function addToCart(product: Product) {
    setCartItems((current) => {
      const existingItem = current.find(
        (item) => item.productId === product.id,
      );

      if (!existingItem) {
        return [...current, { productId: product.id, quantity: 1 }];
      }

      if (existingItem.quantity >= product.stock) {
        setCartMessage(`Only ${product.stock} ${product.name} available.`);
        return current;
      }

      return current.map((item) =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
    });

    setCartOpen(true);
    setCartMessage(`${product.name} added to cart.`);
  }

  function increaseCartQuantity(productId: number) {
    const product = products.find((item) => item.id === productId);

    if (!product) {
      return;
    }

    setCartItems((current) =>
      current.map((item) => {
        if (item.productId !== productId) {
          return item;
        }

        if (item.quantity >= product.stock) {
          setCartMessage(`Only ${product.stock} available.`);
          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }),
    );
  }

  function decreaseCartQuantity(productId: number) {
    setCartItems((current) =>
      current
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function removeFromCart(productId: number) {
    setCartItems((current) =>
      current.filter((item) => item.productId !== productId),
    );

    setCartMessage('Item removed from cart.');
  }

  function clearCart() {
    setCartItems([]);
    setCartMessage('Cart cleared.');
  }

  function moveGallery(direction: 'next' | 'previous') {
    if (filteredProducts.length === 0) {
      return;
    }

    if (direction === 'next') {
      setGalleryIndex(
        (current) => (current + 1) % filteredProducts.length,
      );
      return;
    }

    setGalleryIndex(
      (current) =>
        (current - 1 + filteredProducts.length) % filteredProducts.length,
    );
  }

  function validateForm(): FormErrors {
    const errors: FormErrors = {};

    if (name.trim() === '') {
      errors.name = 'Full name is required.';
    }

    if (email.trim() === '') {
      errors.email = 'Email address is required.';
    } else if (!email.includes('@')) {
      errors.email = 'Email must contain an @ symbol.';
    } else if (!email.includes('.')) {
      errors.email = 'Email must contain a domain such as .com or .ke.';
    }

    if (formQuantity.trim() === '') {
      errors.quantity = 'Quantity is required.';
    } else if (!/^\d+$/.test(formQuantity.trim())) {
      errors.quantity = 'Quantity must contain whole numbers only.';
    } else if (Number(formQuantity) <= 0) {
      errors.quantity = 'Quantity must be greater than zero.';
    } else if (Number(formQuantity) > 20) {
      errors.quantity = 'Quantity cannot be greater than 20.';
    }

    return errors;
  }

  useEffect(() => {
    const form = registrationFormRef.current;

    if (!form) {
      return;
    }

    const handleRegistrationSubmit = (event: Event) => {
      event.preventDefault();

      const errors = validateForm();
      setFormErrors(errors);
      setSubmitted(false);

      if (Object.keys(errors).length > 0) {
        return;
      }

      setSubmitted(true);

      window.requestAnimationFrame(() => {
        successMessageRef.current?.classList.remove('success-animation');
        void successMessageRef.current?.offsetWidth;
        successMessageRef.current?.classList.add('success-animation');
      });

      window.setTimeout(() => {
        setSubmitted(false);
      }, 1800);
    };

    form.addEventListener('submit', handleRegistrationSubmit);

    return () => {
      form.removeEventListener('submit', handleRegistrationSubmit);
    };
  }, [name, email, formQuantity]);

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#top">
            <span className="brand-mark">CM</span>

            <span>
              <strong>CampusMarket</strong>
              <small>Student marketplace</small>
            </span>
          </a>

          <nav className="site-nav" aria-label="Main navigation">
            <a href="#catalog">Catalog</a>
            <a href="#gallery">Gallery</a>
            <a href="#register">Join</a>

            <button
              className="cart-button"
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open shopping cart with ${cartCount} items`}
            >
              <ShoppingCart size={21} aria-hidden="true" />
              <span>Cart</span>

              {cartCount > 0 && (
                <span className="cart-count" aria-label={`${cartCount} items`}>
                  {cartCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {cartMessage && (
        <div className="cart-toast" role="status">
          <CheckCircle2 size={19} aria-hidden="true" />
          <span>{cartMessage}</span>
        </div>
      )}

      {cartOpen && (
        <div className="cart-overlay">
          <button
            className="cart-backdrop"
            type="button"
            aria-label="Close shopping cart"
            onClick={() => setCartOpen(false)}
          />

          <aside
            className="cart-drawer"
            aria-label="Shopping cart"
            aria-modal="true"
            role="dialog"
          >
            <div className="cart-header">
              <div>
                <p className="eyebrow">YOUR CART</p>
                <h2>Shopping Cart</h2>
              </div>

              <button
                className="cart-close"
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Close shopping cart"
              >
                <X size={22} aria-hidden="true" />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <ShoppingCart size={48} aria-hidden="true" />
                <h3>Your cart is empty</h3>
                <p>
                  Add products from the catalog and they will appear here.
                </p>

                <button
                  className="primary-button"
                  type="button"
                  onClick={() => {
                    setCartOpen(false);
                    document
                      .getElementById('catalog')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Browse products
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map((item) => {
                    const product = products.find(
                      (current) => current.id === item.productId,
                    );

                    if (!product) {
                      return null;
                    }

                    return (
                      <article className="cart-item" key={product.id}>
                        <img
                          src={product.image}
                          alt={product.alt}
                          className="cart-item-image"
                        />

                        <div className="cart-item-details">
                          <div className="cart-item-top">
                            <div>
                              <span className="product-category">
                                {product.category}
                              </span>

                              <h3>{product.name}</h3>

                              <p className="cart-item-price">
                                KSh {product.price.toLocaleString()}
                              </p>
                            </div>

                            <button
                              className="remove-button"
                              type="button"
                              onClick={() => removeFromCart(product.id)}
                              aria-label={`Remove ${product.name} from cart`}
                            >
                              <Trash2 size={18} aria-hidden="true" />
                            </button>
                          </div>

                          <div className="cart-item-bottom">
                            <div className="quantity-stepper">
                              <button
                                type="button"
                                onClick={() =>
                                  decreaseCartQuantity(product.id)
                                }
                                aria-label={`Decrease ${product.name} quantity`}
                              >
                                <Minus size={16} aria-hidden="true" />
                              </button>

                              <span aria-label={`${item.quantity} quantity`}>
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  increaseCartQuantity(product.id)
                                }
                                disabled={item.quantity >= product.stock}
                                aria-label={`Increase ${product.name} quantity`}
                              >
                                <Plus size={16} aria-hidden="true" />
                              </button>
                            </div>

                            <strong>
                              KSh{' '}
                              {(product.price * item.quantity).toLocaleString()}
                            </strong>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className="cart-footer">
                  <button
                    className="clear-cart-button"
                    type="button"
                    onClick={clearCart}
                  >
                    Clear cart
                  </button>

                  <div className="cart-subtotal">
                    <span>Subtotal</span>
                    <strong>KSh {cartSubtotal.toLocaleString()}</strong>
                  </div>

                  <button
                    className="checkout-button"
                    type="button"
                    onClick={() => {
                      setCartMessage(
                        'Checkout is ready for the next project stage.',
                      );
                    }}
                  >
                    Proceed to checkout
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      <main id="top">
        <section className="hero-section">
          <div className="hero-content">
            <p className="eyebrow">MMU STUDENT MARKETPLACE</p>

            <h1>Everything you need for campus, in one place.</h1>

            <p className="hero-text">
              Browse practical student essentials, filter the catalog, add
              products to your cart, and see your running total instantly.
            </p>

            <a className="primary-button" href="#catalog">
              Explore catalog
            </a>
          </div>

          <div className="hero-card" aria-label="CampusMarket summary">
            <ShoppingCart size={28} aria-hidden="true" />

            <strong>{products.length} products</strong>

            <span>Student essentials available</span>

            {cartCount > 0 && (
              <small>
                {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
              </small>
            )}
          </div>
        </section>

        <section className="section" id="catalog">
          <div className="section-heading">
            <div>
              <p className="eyebrow">CAMPUS ESSENTIALS</p>
              <h2>Browse CampusMarket</h2>
            </div>

            <div className="catalog-summary">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </div>

          <div className="catalog-controls">
            <label className="search-field">
              <span className="sr-only">Search products</span>

              <Search size={18} aria-hidden="true" />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setGalleryIndex(0);
                }}
                placeholder="Search products..."
              />
            </label>

            <div
              className="category-controls"
              aria-label="Product categories"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={
                    selectedCategory === category
                      ? 'category-button active'
                      : 'category-button'
                  }
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="catalog-layout">
            <div className="product-grid">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <article className="product-card" key={product.id}>
                    <div className="product-image-wrapper">
                      <img src={product.image} alt={product.alt} />
                    </div>

                    <div className="product-card-content">
                      <span className="product-category">
                        {product.category}
                      </span>

                      <h3>{product.name}</h3>

                      <p className="product-price">
                        KSh {product.price.toLocaleString()}
                      </p>

                      <label className="quantity-field">
                        <span>Quantity</span>

                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={quantities[product.id] ?? ''}
                          onChange={(event) =>
                            handleQuantityChange(
                              product.id,
                              event.target.value,
                            )
                          }
                          aria-describedby={
                            quantityErrors[product.id]
                              ? `quantity-error-${product.id}`
                              : undefined
                          }
                        />
                      </label>

                      {quantityErrors[product.id] && (
                        <p
                          className="field-error"
                          id={`quantity-error-${product.id}`}
                          role="alert"
                        >
                          {quantityErrors[product.id]}
                        </p>
                      )}

                      <button
                        className="add-to-cart-button"
                        type="button"
                        onClick={() => addToCart(product)}
                      >
                        <ShoppingCart size={18} aria-hidden="true" />
                        Add to Cart
                      </button>

                      <small className="stock-text">
                        {product.stock} available
                      </small>
                    </div>
                  </article>
                ))
              ) : (
                <div className="empty-state">
                  <h3>No products found</h3>
                  <p>Try another search term or category.</p>
                </div>
              )}
            </div>

            <aside className="total-card">
              <span className="total-label">Validated running total</span>

              <strong>KSh {runningTotal.toLocaleString()}</strong>

              <p>
                Only quantities that pass validation are included in this
                calculation.
              </p>
            </aside>
          </div>
        </section>

        <section className="section gallery-section" id="gallery">
          <div className="section-heading">
            <div>
              <p className="eyebrow">DISCOVER MORE</p>
              <h2>Product gallery</h2>
            </div>

            <p className="section-description">
              Explore the products currently shown by your catalog filters.
            </p>
          </div>

          {currentGalleryProduct ? (
            <div className="gallery">
              <button
                className="gallery-control"
                type="button"
                onClick={() => moveGallery('previous')}
                aria-label="Show previous product"
              >
                <ArrowLeft size={22} aria-hidden="true" />
              </button>

              <div
                className="gallery-slide"
                key={currentGalleryProduct.id}
              >
                <img
                  src={currentGalleryProduct.image}
                  alt={currentGalleryProduct.alt}
                />

                <div className="gallery-caption">
                  <span>{currentGalleryProduct.category}</span>

                  <h3>{currentGalleryProduct.name}</h3>

                  <p>
                    KSh {currentGalleryProduct.price.toLocaleString()}
                  </p>

                  <button
                    className="add-to-cart-button"
                    type="button"
                    onClick={() => addToCart(currentGalleryProduct)}
                  >
                    <ShoppingCart size={18} aria-hidden="true" />
                    Add to Cart
                  </button>
                </div>
              </div>

              <button
                className="gallery-control"
                type="button"
                onClick={() => moveGallery('next')}
                aria-label="Show next product"
              >
                <ArrowRight size={22} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <div className="empty-state">
              <h3>Gallery unavailable</h3>
              <p>There are no products matching the current filter.</p>
            </div>
          )}

          <p className="gallery-status" aria-live="polite">
            {filteredProducts.length > 0
              ? `Image ${safeGalleryIndex + 1} of ${filteredProducts.length}`
              : 'No images to display'}
          </p>
        </section>

        <section className="section registration-section" id="register">
          <div className="registration-copy">
            <p className="eyebrow">JOIN CAMPUSMARKET</p>

            <h2>Make campus shopping simpler.</h2>

            <p>
              Register your interest in CampusMarket and stay connected to a
              marketplace built around everyday student needs. Complete the
              form with valid information to receive confirmation.
            </p>

            <div className="registration-highlights">
              <span>✓ Student-focused marketplace</span>
              <span>✓ Simple product discovery</span>
              <span>✓ Validated registration</span>
            </div>
          </div>

          <form
            className="registration-form"
            noValidate
          >
            <div className="form-field">
              <label htmlFor="name">Full name</label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={formErrors.name ? 'input-error' : ''}
                aria-invalid={Boolean(formErrors.name)}
                aria-describedby={
                  formErrors.name ? 'name-error' : undefined
                }
              />

              {formErrors.name && (
                <p className="field-error" id="name-error" role="alert">
                  {formErrors.name}
                </p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="email">Email address</label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={formErrors.email ? 'input-error' : ''}
                aria-invalid={Boolean(formErrors.email)}
                aria-describedby={
                  formErrors.email ? 'email-error' : undefined
                }
              />

              {formErrors.email && (
                <p className="field-error" id="email-error" role="alert">
                  {formErrors.email}
                </p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="order-quantity">Requested quantity</label>

              <input
                id="order-quantity"
                type="number"
                min="1"
                max="20"
                value={formQuantity}
                onChange={(event) => setFormQuantity(event.target.value)}
                className={formErrors.quantity ? 'input-error' : ''}
                aria-invalid={Boolean(formErrors.quantity)}
                aria-describedby={
                  formErrors.quantity
                    ? 'quantity-form-error'
                    : undefined
                }
              />

              {formErrors.quantity && (
                <p
                  className="field-error"
                  id="quantity-form-error"
                  role="alert"
                >
                  {formErrors.quantity}
                </p>
              )}
            </div>

            <button className="submit-button" type="submit">
              Submit registration
            </button>

            {submitted && (
              <div
                className="success-message success-animation"
                role="status"
              >
                <CheckCircle2 size={22} aria-hidden="true" />

                <div>
                  <strong>
                    Registration submitted successfully.
                  </strong>

                  <span>
                    Your details passed all validation checks.
                  </span>
                </div>
              </div>
            )}

            {!submitted && Object.keys(formErrors).length > 0 && (
              <div className="error-summary" role="alert">
                <XCircle size={22} aria-hidden="true" />

                <span>
                  Please correct the highlighted fields before submitting.
                </span>
              </div>
            )}
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <p>CampusMarket — MMU Web Based Programming II</p>
        <p>Built as an incremental semester project.</p>
      </footer>
    </div>
  );
}

export default App;
