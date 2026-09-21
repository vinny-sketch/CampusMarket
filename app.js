/**
 * CampusMarket - Complete Unified Application Logic
 * Academic Project: CS 2314 Web Based Programming II
 *
 * Implements:
 * 1. Global Shopping Cart System & LocalStorage Persistence
 * 2. Off-canvas Slide-over Cart Drawer UI & Toast Notifications
 * 3. Campus-Tailored Checkout Simulation & Order Confirmation Receipt
 * 4. Dynamic Catalog Engine (Multi-field search, Category pills sync, Sorting)
 * 5. Product Details View (Interactive thumbnail gallery, Stepper, Specs, Seller Card)
 * 6. Storefront Homepage Engine (Hero search handoff, Category cards, Featured deals)
 * 7. Student Account & Auth Simulation (Tabs, client-side validation, Session state)
 */

if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
        initGlobalNavigationAndUser();
        initCartSystem();
        setupHomePage();
        setupCatalog();
        setupProductDetails();
        setupRegistrationForm();
    });
}

/* --------------------------------------------------------------------------
   Helper: Badge Styling Token Resolver
   -------------------------------------------------------------------------- */
function getBadgeClass(badge) {
    if (!badge) return "";
    const lower = badge.toLowerCase();
    if (lower.includes("best")) return "badge-accent";
    if (lower.includes("deal")) return "badge-success";
    if (lower.includes("essential")) return "badge-primary";
    if (lower.includes("verified")) return "badge-purple";
    return "badge-primary";
}

/* --------------------------------------------------------------------------
   0. Global Navigation & Student Session State
   -------------------------------------------------------------------------- */
function initGlobalNavigationAndUser() {
    const nav = document.querySelector("nav");
    const navWrapper = document.querySelector(".nav-wrapper");

    if (!navWrapper || !nav) return;

    // Check mock logged-in user in localStorage
    const savedUser = getSavedUser();
    if (savedUser && !document.getElementById("navUserChip")) {
        const userChip = document.createElement("a");
        userChip.href = "register.html";
        userChip.id = "navUserChip";
        userChip.className = "user-nav-chip";
        userChip.innerHTML = `<span>🎓</span> ${savedUser.name.split(" ")[0]}`;
        userChip.title = `Signed in as ${savedUser.name}`;
        nav.appendChild(userChip);
    }
}

function getSavedUser() {
    try {
        const raw = localStorage.getItem("campus_user");
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}

/* --------------------------------------------------------------------------
   1. Global Shopping Cart System & Checkout Engine
   -------------------------------------------------------------------------- */
const CART_STORAGE_KEY = "campus_market_cart";

function getCart() {
    try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
        console.warn("LocalStorage save error", e);
    }
    updateCartUI();
}

function addToCart(productId, quantity = 1, openDrawer = false) {
    const allProducts = (typeof window !== "undefined" && Array.isArray(window.CAMPUS_PRODUCTS))
        ? window.CAMPUS_PRODUCTS
        : [];
    const product = allProducts.find(p => p.id === productId);

    if (!product) return;

    const cart = getCart();
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity = Math.min(product.stockCount, existing.quantity + quantity);
    } else {
        cart.push({ id: productId, quantity: Math.min(product.stockCount, quantity) });
    }

    saveCart(cart);
    showToast(`🛒 Added ${quantity}x ${product.name} to cart!`);

    // Animate cart badge bump
    const badges = document.querySelectorAll(".cart-badge");
    badges.forEach(b => {
        b.classList.add("bump");
        setTimeout(() => b.classList.remove("bump"), 350);
    });

    if (openDrawer) {
        openCartDrawer();
    }
}

function updateCartItemQty(productId, newQty) {
    let cart = getCart();
    if (newQty <= 0) {
        cart = cart.filter(item => item.id !== productId);
    } else {
        const item = cart.find(i => i.id === productId);
        if (item) {
            item.quantity = newQty;
        }
    }
    saveCart(cart);
}

function removeCartItem(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    showToast("Item removed from cart.");
}

function clearCart() {
    saveCart([]);
}

function openCartDrawer() {
    const drawer = document.getElementById("cartDrawer");
    const backdrop = document.getElementById("cartDrawerBackdrop");
    if (drawer && backdrop) {
        drawer.classList.add("open");
        backdrop.classList.add("active");
        document.body.style.overflow = "hidden";
    }
}

function closeCartDrawer() {
    const drawer = document.getElementById("cartDrawer");
    const backdrop = document.getElementById("cartDrawerBackdrop");
    if (drawer && backdrop) {
        drawer.classList.remove("open");
        backdrop.classList.remove("active");
        document.body.style.overflow = "";
    }
}

function initCartSystem() {
    // 1. Inject Cart Nav Button into Header if not already present
    const nav = document.querySelector("nav");
    if (nav && !document.getElementById("navCartBtn")) {
        const cartBtn = document.createElement("button");
        cartBtn.type = "button";
        cartBtn.id = "navCartBtn";
        cartBtn.className = "cart-nav-btn";
        cartBtn.setAttribute("aria-label", "View shopping cart");
        cartBtn.innerHTML = `
            <span>🛒 Cart</span>
            <span class="cart-badge" id="navCartBadge">0</span>
        `;
        cartBtn.addEventListener("click", openCartDrawer);
        nav.appendChild(cartBtn);
    }

    // 2. Inject Cart Drawer Markup into DOM if missing
    if (!document.getElementById("cartDrawer")) {
        const drawerHtml = `
            <div class="drawer-backdrop" id="cartDrawerBackdrop"></div>
            <aside class="drawer" id="cartDrawer" aria-label="Shopping Cart">
                <div class="drawer-header">
                    <h2><span>🛒</span> Campus Cart</h2>
                    <button type="button" class="drawer-close" id="closeCartBtn" aria-label="Close cart">&times;</button>
                </div>
                <div class="drawer-body" id="cartDrawerItems">
                    <!-- Dynamic cart items -->
                </div>
                <div class="drawer-footer" id="cartDrawerFooter">
                    <div class="cart-summary-row">
                        <span>Items Subtotal</span>
                        <strong id="cartSubtotal">KSh 0</strong>
                    </div>
                    <div class="cart-summary-row">
                        <span>On-Campus Delivery / Pickup</span>
                        <span style="color: var(--success); font-weight: 700;">FREE (On-Campus)</span>
                    </div>
                    <div class="cart-total-row">
                        <span>Total:</span>
                        <strong id="cartGrandTotal">KSh 0</strong>
                    </div>
                    <button type="button" class="button full-width" id="btnProceedCheckout">
                        Proceed to Campus Checkout &rarr;
                    </button>
                </div>
            </aside>
        `;
        document.body.insertAdjacentHTML("beforeend", drawerHtml);

        document.getElementById("cartDrawerBackdrop").addEventListener("click", closeCartDrawer);
        document.getElementById("closeCartBtn").addEventListener("click", closeCartDrawer);
        document.getElementById("btnProceedCheckout").addEventListener("click", openCheckoutModal);
    }

    // 3. Inject Checkout Modal Markup into DOM if missing
    if (!document.getElementById("checkoutModal")) {
        const modalHtml = `
            <div class="modal-backdrop" id="checkoutModalBackdrop">
                <div class="modal-dialog checkout-modal-content" id="checkoutModal" role="dialog" aria-modal="true" aria-labelledby="checkoutTitle">
                    <button type="button" class="modal-close" id="closeCheckoutBtn" aria-label="Close checkout">&times;</button>
                    
                    <div id="checkoutFormView">
                        <div class="page-heading" style="margin-bottom: 20px;">
                            <p class="eyebrow">CAMPUS ORDER DEMO</p>
                            <h2 id="checkoutTitle" style="font-size: 1.8rem; margin: 0;">Complete Your Campus Order</h2>
                            <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 4px;">
                                Reserve items for fast, verified handover at your preferred university pickup point.
                            </p>
                        </div>

                        <div class="checkout-grid">
                            <!-- Left: Student Delivery Details Form -->
                            <form id="checkoutForm" novalidate>
                                <div class="form-group">
                                    <label for="checkoutStudentName">Student Full Name *</label>
                                    <input type="text" id="checkoutStudentName" required placeholder="e.g. Alex Mwangi">
                                    <small class="error-message" id="chkNameErr"></small>
                                </div>

                                <div class="form-group">
                                    <label for="checkoutRegNo">University Registration No. *</label>
                                    <input type="text" id="checkoutRegNo" required placeholder="e.g. SC211/0458/2023">
                                    <small class="error-message" id="chkRegErr"></small>
                                </div>

                                <div class="form-group">
                                    <label for="checkoutPhone">Phone / WhatsApp for Pickup SMS *</label>
                                    <input type="tel" id="checkoutPhone" required placeholder="e.g. 0712 345 678">
                                    <small class="error-message" id="chkPhoneErr"></small>
                                </div>

                                <div class="form-group">
                                    <label for="checkoutLocation">Designated Campus Pickup Desk *</label>
                                    <select id="checkoutLocation" required>
                                        <option value="Main University Library (Foyer Desk)">📚 Main University Library (Foyer Desk)</option>
                                        <option value="Student Union Center (Ground Floor Hub)">🏛️ Student Union Center (Ground Floor Hub)</option>
                                        <option value="Tech & Engineering Complex (Atrium)">💻 Tech & Engineering Complex (Atrium)</option>
                                        <option value="Hostels / Dormitory Porter Desk (Halls 1–4)">🛏️ Hostels Porter Desk (Halls 1–4)</option>
                                        <option value="Campus Central Cafeteria Quad">☕ Campus Central Cafeteria Quad</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="checkoutPickupTime">Preferred Pickup Window</label>
                                    <select id="checkoutPickupTime">
                                        <option value="Today - Afternoon (2:00 PM - 5:00 PM)">Today - Afternoon (2:00 PM - 5:00 PM)</option>
                                        <option value="Tomorrow - Morning (9:00 AM - 12:00 PM)">Tomorrow - Morning (9:00 AM - 12:00 PM)</option>
                                        <option value="Tomorrow - Afternoon (2:00 PM - 5:00 PM)">Tomorrow - Afternoon (2:00 PM - 5:00 PM)</option>
                                    </select>
                                </div>

                                <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px; border-radius: var(--radius-md); font-size: 0.85rem; color: #166534; margin-bottom: 18px;">
                                    💡 <strong>Academic Project Note:</strong> In-person verification upon campus collection. Pay via Cash or M-Pesa directly at the pickup station.
                                </div>

                                <button type="submit" class="button full-width" id="btnConfirmOrder">
                                    Confirm Campus Reservation &rarr;
                                </button>
                            </form>

                            <!-- Right: Order Items Summary -->
                            <div class="order-summary-box">
                                <h3>Order Summary</h3>
                                <div class="order-summary-items" id="checkoutSummaryItems">
                                    <!-- Items listed here -->
                                </div>
                                <div style="border-top: 1px solid var(--border); padding-top: 12px; margin-top: 12px;">
                                    <div class="order-summary-row">
                                        <span>Campus Pickup Fee:</span>
                                        <strong style="color: var(--success);">FREE</strong>
                                    </div>
                                    <div class="order-summary-row" style="font-size: 1.15rem; font-weight: 800; color: var(--text); margin-top: 8px;">
                                        <span>Amount Due:</span>
                                        <span id="checkoutDueAmount" style="color: var(--primary);">KSh 0</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Order Confirmation Receipt View (Shown after submitting) -->
                    <div id="checkoutReceiptView" style="display: none;" class="receipt-card">
                        <div class="receipt-icon">🎉</div>
                        <h2 style="font-size: 1.9rem; margin-bottom: 4px;">Reservation Confirmed!</h2>
                        <p style="color: var(--text-muted); font-size: 0.95rem;">
                            Your campus order reservation has been placed successfully.
                        </p>
                        <div class="receipt-id" id="receiptOrderId">Order #CM-2026-0000</div>
                        
                        <div class="receipt-box">
                            <div class="order-summary-row"><strong>Pickup Location:</strong> <span id="receiptLocation"></span></div>
                            <div class="order-summary-row"><strong>Pickup Window:</strong> <span id="receiptTime"></span></div>
                            <div class="order-summary-row"><strong>Student Name:</strong> <span id="receiptStudent"></span></div>
                            <div class="order-summary-row"><strong>Reg Number:</strong> <span id="receiptReg"></span></div>
                            <div class="order-summary-row" style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed var(--border); font-size: 1.1rem;">
                                <strong>Total Amount Due:</strong> <strong id="receiptAmount" style="color: var(--primary);"></strong>
                            </div>
                        </div>

                        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 20px;">
                            An automated SMS has been simulated to your number. Present your Student ID at collection.
                        </p>

                        <button type="button" class="button" id="btnReceiptDone">
                            Done / Continue Browsing
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML("beforeend", modalHtml);

        document.getElementById("checkoutModalBackdrop").addEventListener("click", (e) => {
            if (e.target.id === "checkoutModalBackdrop") closeCheckoutModal();
        });
        document.getElementById("closeCheckoutBtn").addEventListener("click", closeCheckoutModal);
        document.getElementById("checkoutForm").addEventListener("submit", handleCheckoutSubmit);
        document.getElementById("btnReceiptDone").addEventListener("click", () => {
            closeCheckoutModal();
            window.location.href = "catalog.html";
        });
    }

    // 4. Inject Toast Container if missing
    if (!document.getElementById("toastContainer")) {
        const toastBox = document.createElement("div");
        toastBox.id = "toastContainer";
        toastBox.className = "toast-container";
        document.body.appendChild(toastBox);
    }

    // Initial cart render
    updateCartUI();
}

function updateCartUI() {
    const cart = getCart();
    const allProducts = (typeof window !== "undefined" && Array.isArray(window.CAMPUS_PRODUCTS))
        ? window.CAMPUS_PRODUCTS
        : [];

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Update all badge elements
    const badges = document.querySelectorAll(".cart-badge");
    badges.forEach(b => {
        b.textContent = totalCount;
    });

    const itemsContainer = document.getElementById("cartDrawerItems");
    const subtotalEl = document.getElementById("cartSubtotal");
    const grandTotalEl = document.getElementById("cartGrandTotal");
    const footerEl = document.getElementById("cartDrawerFooter");

    if (!itemsContainer) return;

    if (cart.length === 0) {
        itemsContainer.innerHTML = `
            <div class="cart-empty-state">
                <span>🛒</span>
                <h3 style="margin-bottom: 6px;">Your cart is empty</h3>
                <p style="font-size: 0.92rem; margin-bottom: 20px;">Explore our 24 student-priced items in the catalog.</p>
                <a href="catalog.html" class="button btn-sm" onclick="closeCartDrawer()">Browse Catalog</a>
            </div>
        `;
        if (footerEl) footerEl.style.display = "none";
        return;
    }

    if (footerEl) footerEl.style.display = "block";

    let subtotal = 0;
    itemsContainer.innerHTML = "";

    cart.forEach(item => {
        const product = allProducts.find(p => p.id === item.id);
        if (!product) return;

        const lineTotal = item.quantity * product.price;
        subtotal += lineTotal;

        const itemEl = document.createElement("div");
        itemEl.className = "cart-item";
        itemEl.innerHTML = `
            <img class="cart-item-img" src="${product.image}" alt="${product.name}">
            <div class="cart-item-info">
                <h4>${product.name}</h4>
                <div class="cart-item-price">KSh ${product.price.toLocaleString("en-KE")} &times; ${item.quantity} = <strong>KSh ${lineTotal.toLocaleString("en-KE")}</strong></div>
                <div class="cart-item-qty-row">
                    <button type="button" class="cart-qty-btn btn-dec" aria-label="Decrease">&minus;</button>
                    <span class="cart-qty-val">${item.quantity}</span>
                    <button type="button" class="cart-qty-btn btn-inc" aria-label="Increase">&#43;</button>
                </div>
            </div>
            <button type="button" class="cart-item-remove" aria-label="Remove ${product.name}">&times;</button>
        `;

        itemEl.querySelector(".btn-dec").addEventListener("click", () => {
            updateCartItemQty(product.id, item.quantity - 1);
        });

        itemEl.querySelector(".btn-inc").addEventListener("click", () => {
            if (item.quantity < product.stockCount) {
                updateCartItemQty(product.id, item.quantity + 1);
            } else {
                showToast(`Maximum campus stock reached (${product.stockCount} available).`);
            }
        });

        itemEl.querySelector(".cart-item-remove").addEventListener("click", () => {
            removeCartItem(product.id);
        });

        itemsContainer.appendChild(itemEl);
    });

    if (subtotalEl) subtotalEl.textContent = `KSh ${subtotal.toLocaleString("en-KE")}`;
    if (grandTotalEl) grandTotalEl.textContent = `KSh ${subtotal.toLocaleString("en-KE")}`;
}

function openCheckoutModal() {
    closeCartDrawer();
    const modalBackdrop = document.getElementById("checkoutModalBackdrop");
    const formView = document.getElementById("checkoutFormView");
    const receiptView = document.getElementById("checkoutReceiptView");
    const summaryItems = document.getElementById("checkoutSummaryItems");
    const dueAmountEl = document.getElementById("checkoutDueAmount");

    const cart = getCart();
    if (cart.length === 0) {
        showToast("Your cart is empty! Add products first.");
        return;
    }

    const allProducts = (typeof window !== "undefined" && Array.isArray(window.CAMPUS_PRODUCTS))
        ? window.CAMPUS_PRODUCTS
        : [];

    let totalDue = 0;
    if (summaryItems) {
        summaryItems.innerHTML = cart.map(item => {
            const prod = allProducts.find(p => p.id === item.id);
            if (!prod) return "";
            const lineCost = prod.price * item.quantity;
            totalDue += lineCost;
            return `
                <div class="order-summary-row">
                    <span>${item.quantity}x ${prod.name}</span>
                    <strong>KSh ${lineCost.toLocaleString("en-KE")}</strong>
                </div>
            `;
        }).join("");
    }

    if (dueAmountEl) {
        dueAmountEl.textContent = `KSh ${totalDue.toLocaleString("en-KE")}`;
    }

    // Pre-fill student info if user is logged in
    const savedUser = getSavedUser();
    if (savedUser) {
        const nameInput = document.getElementById("checkoutStudentName");
        if (nameInput && !nameInput.value) nameInput.value = savedUser.name;
    }

    if (formView) formView.style.display = "block";
    if (receiptView) receiptView.style.display = "none";

    if (modalBackdrop) {
        modalBackdrop.classList.add("active");
        document.body.style.overflow = "hidden";
    }
}

function closeCheckoutModal() {
    const modalBackdrop = document.getElementById("checkoutModalBackdrop");
    if (modalBackdrop) {
        modalBackdrop.classList.remove("active");
        document.body.style.overflow = "";
    }
}

function handleCheckoutSubmit(e) {
    e.preventDefault();

    const nameInput = document.getElementById("checkoutStudentName");
    const regInput = document.getElementById("checkoutRegNo");
    const phoneInput = document.getElementById("checkoutPhone");
    const locationInput = document.getElementById("checkoutLocation");
    const timeInput = document.getElementById("checkoutPickupTime");

    const nameErr = document.getElementById("chkNameErr");
    const regErr = document.getElementById("chkRegErr");
    const phoneErr = document.getElementById("chkPhoneErr");

    nameErr.textContent = "";
    regErr.textContent = "";
    phoneErr.textContent = "";

    let isValid = true;

    if (!nameInput.value.trim()) {
        nameErr.textContent = "Please enter your full name.";
        isValid = false;
    }

    if (!regInput.value.trim()) {
        regErr.textContent = "University registration number is required.";
        isValid = false;
    }

    if (!phoneInput.value.trim() || phoneInput.value.trim().length < 9) {
        phoneErr.textContent = "Please enter a valid phone number for SMS notifications.";
        isValid = false;
    }

    if (!isValid) return;

    // Calculate final total
    const cart = getCart();
    const allProducts = (typeof window !== "undefined" && Array.isArray(window.CAMPUS_PRODUCTS))
        ? window.CAMPUS_PRODUCTS
        : [];
    const totalAmount = cart.reduce((sum, item) => {
        const p = allProducts.find(prod => prod.id === item.id);
        return sum + (p ? p.price * item.quantity : 0);
    }, 0);

    // Generate Order Receipt Data
    const orderId = `CM-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    document.getElementById("receiptOrderId").textContent = `Order Reference: #${orderId}`;
    document.getElementById("receiptLocation").textContent = locationInput.value;
    document.getElementById("receiptTime").textContent = timeInput.value;
    document.getElementById("receiptStudent").textContent = nameInput.value.trim();
    document.getElementById("receiptReg").textContent = regInput.value.trim();
    document.getElementById("receiptAmount").textContent = `KSh ${totalAmount.toLocaleString("en-KE")}`;

    // Switch views in modal
    document.getElementById("checkoutFormView").style.display = "none";
    document.getElementById("checkoutReceiptView").style.display = "block";

    // Clear cart
    clearCart();
    showToast("🎉 Order placed! Your on-campus reservation is ready.");
}

function showToast(message) {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 10);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// Global exposure of cart methods
if (typeof window !== "undefined") {
    window.CampusCart = {
        getCart,
        addToCart,
        updateCartItemQty,
        removeCartItem,
        clearCart,
        openCartDrawer,
        closeCartDrawer,
        openCheckoutModal
    };
}

/* --------------------------------------------------------------------------
   2. Storefront Homepage Engine (index.html)
   -------------------------------------------------------------------------- */
function setupHomePage() {
    const featuredGrid = document.getElementById("homeFeaturedGrid");

    if (!featuredGrid) return;

    const allProducts = (typeof window !== "undefined" && Array.isArray(window.CAMPUS_PRODUCTS))
        ? window.CAMPUS_PRODUCTS
        : [];

    if (allProducts.length === 0) return;

    // Pick top 6 featured products with badges
    const featuredItems = allProducts
        .filter(p => p.badge !== null)
        .slice(0, 6);

    featuredGrid.innerHTML = featuredItems.map(p => `
        <article class="product-card" data-id="${p.id}" style="cursor: pointer;">
            <div class="product-image-wrapper">
                <div class="product-badge-overlay">
                    <span class="badge ${getBadgeClass(p.badge)}">${p.badge}</span>
                </div>
                <img class="product-img" src="${p.image}" alt="${p.name}" loading="lazy">
            </div>
            <div class="product-body">
                <div class="category-meta">
                    <span class="category-label">${p.categoryName}</span>
                    <span class="badge badge-muted">${p.condition}</span>
                </div>
                <h2>${p.name}</h2>
                <div class="product-meta">
                    <span class="product-rating">
                        <span class="star">★</span> ${p.rating.toFixed(1)}
                        <span class="rating-count">(${p.reviewCount})</span>
                    </span>
                </div>
                <p>${p.description}</p>
                <div class="price-row">
                    <span class="price">KSh ${p.price.toLocaleString("en-KE")}</span>
                    ${p.originalPrice > p.price ? `<span class="price-original">KSh ${p.originalPrice.toLocaleString("en-KE")}</span>` : ''}
                </div>
                <div style="display: flex; gap: 8px; margin-top: auto;">
                    <a href="product-details.html?id=${p.id}" class="card-view-btn" style="flex-grow: 1; margin: 0;">View Details &rarr;</a>
                    <button type="button" class="button btn-sm btn-quick-add" data-id="${p.id}" style="padding: 8px 12px;" aria-label="Add to cart">🛒 Add</button>
                </div>
            </div>
        </article>
    `).join("");

    // Make whole card navigate, except when clicking quick add
    featuredGrid.querySelectorAll(".product-card").forEach(card => {
        card.addEventListener("click", (e) => {
            if (e.target.closest(".btn-quick-add")) return;
            const id = card.dataset.id;
            window.location.href = `product-details.html?id=${id}`;
        });
    });

    featuredGrid.querySelectorAll(".btn-quick-add").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            addToCart(id, 1, false);
        });
    });
}

/* --------------------------------------------------------------------------
   3. Dynamic Product Catalog Engine (catalog.html)
   -------------------------------------------------------------------------- */
function setupCatalog() {
    const productList = document.getElementById("productList");

    if (!productList) return;

    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const sortFilter = document.getElementById("sortFilter");
    const filterMessage = document.getElementById("filterMessage");
    const noResults = document.getElementById("noResults");
    const categoryPills = document.querySelectorAll(".category-pill");

    const allProducts = (typeof window !== "undefined" && Array.isArray(window.CAMPUS_PRODUCTS))
        ? window.CAMPUS_PRODUCTS
        : [];

    // Parse URL query parameters if arriving from Home hero search or category cards
    const urlParams = new URLSearchParams(window.location.search);
    const initialCategory = urlParams.get("category");
    const initialSearch = urlParams.get("search");

    if (initialCategory && categoryFilter) {
        categoryFilter.value = initialCategory;
        if (categoryPills) {
            categoryPills.forEach(pill => {
                pill.classList.toggle("active", pill.dataset.category === initialCategory);
            });
        }
    }

    if (initialSearch && searchInput) {
        searchInput.value = initialSearch;
    }

    function renderProducts(items) {
        productList.innerHTML = "";

        if (items.length === 0) {
            if (noResults) noResults.hidden = false;
            if (filterMessage) filterMessage.textContent = "0 products found.";
            return;
        }

        if (noResults) noResults.hidden = true;
        if (filterMessage) {
            filterMessage.textContent = `${items.length} product${items.length === 1 ? "" : "s"} shown.`;
        }

        items.forEach((p) => {
            const card = document.createElement("article");
            card.className = "product-card";
            card.dataset.id = p.id;
            card.dataset.name = p.name.toLowerCase();
            card.dataset.category = p.category;
            card.style.cursor = "pointer";

            const badgeHtml = p.badge
                ? `<div class="product-badge-overlay"><span class="badge ${getBadgeClass(p.badge)}">${p.badge}</span></div>`
                : "";

            const originalPriceHtml = (p.originalPrice && p.originalPrice > p.price)
                ? `<span class="price-original">KSh ${p.originalPrice.toLocaleString("en-KE")}</span>`
                : "";

            card.innerHTML = `
                <div class="product-image-wrapper">
                    ${badgeHtml}
                    <img class="product-img" src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.parentElement.innerHTML='<div class=\\'product-icon\\'>📦</div>';">
                </div>
                <div class="product-body">
                    <div class="category-meta">
                        <span class="category-label">${p.categoryName}</span>
                        <span class="badge badge-muted">${p.condition}</span>
                    </div>
                    <h2>${p.name}</h2>
                    <div class="product-meta">
                        <span class="product-rating">
                            <span class="star">★</span> ${p.rating.toFixed(1)}
                            <span class="rating-count">(${p.reviewCount})</span>
                        </span>
                    </div>
                    <p>${p.description}</p>
                    <div class="price-row">
                        <span class="price">KSh ${p.price.toLocaleString("en-KE")}</span>
                        ${originalPriceHtml}
                    </div>
                    <div class="quantity-row">
                        <label for="quantity-${p.id}">Quantity</label>
                        <input class="quantity-input" id="quantity-${p.id}" type="number" min="0" value="1">
                        <p class="running-total">Total: <strong class="product-total" data-price="${p.price}">KSh ${p.price.toLocaleString("en-KE")}</strong></p>
                    </div>
                    <div class="stock-status">
                        <span class="stock-dot"></span> In Stock (${p.stockCount} available)
                    </div>
                    <div style="display: flex; gap: 8px; margin-top: 12px;">
                        <a href="product-details.html?id=${p.id}" class="card-view-btn" style="flex-grow: 1; margin: 0;">View Details &rarr;</a>
                        <button type="button" class="button btn-sm btn-card-add" data-id="${p.id}" style="padding: 8px 14px;" aria-label="Add to cart">🛒 Add</button>
                    </div>
                </div>
            `;

            // Make card clickable
            card.addEventListener("click", (e) => {
                if (e.target.closest(".quantity-row") || e.target.closest(".quantity-input") || e.target.closest("label") || e.target.closest(".running-total") || e.target.closest(".btn-card-add")) {
                    return;
                }
                window.location.href = `product-details.html?id=${p.id}`;
            });

            // Quick add to cart button
            const addBtn = card.querySelector(".btn-card-add");
            addBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                const qtyInput = card.querySelector(".quantity-input");
                let qty = Number(qtyInput.value);
                if (!Number.isFinite(qty) || qty < 1) qty = 1;
                addToCart(p.id, qty, false);
            });

            // Live quantity calculations per card (preserves assignment requirement)
            const qtyInput = card.querySelector(".quantity-input");
            const totalElement = card.querySelector(".product-total");

            qtyInput.addEventListener("input", (e) => {
                e.stopPropagation();
                let quantity = Number(qtyInput.value);

                if (!Number.isFinite(quantity) || quantity < 0) {
                    quantity = 0;
                    qtyInput.value = 0;
                }

                const price = Number(totalElement.dataset.price);
                const total = quantity * price;

                totalElement.textContent = `KSh ${total.toLocaleString("en-KE")}`;
            });

            productList.appendChild(card);
        });
    }

    function filterAndSortProducts() {
        const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";
        const selectedCategory = categoryFilter ? categoryFilter.value : "all";
        const selectedSort = sortFilter ? sortFilter.value : "featured";

        let filtered = allProducts.filter((product) => {
            const matchesCategory =
                selectedCategory === "all" || product.category === selectedCategory;

            const searchableContent = `${product.name} ${product.description} ${product.categoryName} ${product.subcategory} ${product.keywords || ""}`.toLowerCase();
            const matchesSearch = !searchTerm || searchableContent.includes(searchTerm);

            return matchesCategory && matchesSearch;
        });

        // Multi-criteria sorting
        if (selectedSort === "price-asc") {
            filtered.sort((a, b) => a.price - b.price);
        } else if (selectedSort === "price-desc") {
            filtered.sort((a, b) => b.price - a.price);
        } else if (selectedSort === "rating") {
            filtered.sort((a, b) => b.rating - a.rating);
        } else if (selectedSort === "name") {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else {
            // "featured": badges prioritized, then ratings
            filtered.sort((a, b) => {
                const aBadge = a.badge ? 1 : 0;
                const bBadge = b.badge ? 1 : 0;
                if (bBadge !== aBadge) return bBadge - aBadge;
                return b.rating - a.rating;
            });
        }

        renderProducts(filtered);
    }

    // Sync Category Filter Pills with Dropdown
    if (categoryPills && categoryPills.length > 0) {
        categoryPills.forEach((pill) => {
            pill.addEventListener("click", () => {
                categoryPills.forEach((p) => p.classList.remove("active"));
                pill.classList.add("active");

                const cat = pill.dataset.category;
                if (categoryFilter) {
                    categoryFilter.value = cat;
                }
                filterAndSortProducts();
            });
        });
    }

    // Event listeners
    if (searchInput) {
        searchInput.addEventListener("input", filterAndSortProducts);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener("change", () => {
            const selectedVal = categoryFilter.value;
            if (categoryPills) {
                categoryPills.forEach((pill) => {
                    if (pill.dataset.category === selectedVal) {
                        pill.classList.add("active");
                    } else {
                        pill.classList.remove("active");
                    }
                });
            }
            filterAndSortProducts();
        });
    }
    if (sortFilter) {
        sortFilter.addEventListener("change", filterAndSortProducts);
    }

    // Initial filter execution
    filterAndSortProducts();
}

/* --------------------------------------------------------------------------
   4. Product Details Page Engine (product-details.html)
   -------------------------------------------------------------------------- */
function setupProductDetails() {
    const detailsContainer = document.getElementById("productDetailsContainer");

    if (!detailsContainer) return;

    const allProducts = (typeof window !== "undefined" && Array.isArray(window.CAMPUS_PRODUCTS))
        ? window.CAMPUS_PRODUCTS
        : [];

    if (allProducts.length === 0) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    let product = allProducts.find(p => p.id === productId);
    if (!product) {
        product = allProducts[0];
    }

    document.title = `CampusMarket | ${product.name}`;
    const breadcrumbCurrent = document.getElementById("breadcrumbCurrent");
    if (breadcrumbCurrent) {
        breadcrumbCurrent.textContent = product.name;
    }

    const detailCategory = document.getElementById("detailCategory");
    const detailCondition = document.getElementById("detailCondition");
    const detailName = document.getElementById("detailName");
    const detailRating = document.getElementById("detailRating");
    const detailReviews = document.getElementById("detailReviews");
    const detailPrice = document.getElementById("detailPrice");
    const detailOriginalPrice = document.getElementById("detailOriginalPrice");
    const detailDiscountBadge = document.getElementById("detailDiscountBadge");
    const detailStockCount = document.getElementById("detailStockCount");
    const detailDescription = document.getElementById("detailDescription");
    const detailFeatures = document.getElementById("detailFeatures");

    if (detailCategory) detailCategory.textContent = product.categoryName;
    if (detailCondition) detailCondition.textContent = product.condition;
    if (detailName) detailName.textContent = product.name;
    if (detailRating) detailRating.textContent = product.rating.toFixed(1);
    if (detailReviews) detailReviews.textContent = `(${product.reviewCount} student reviews)`;
    if (detailPrice) detailPrice.textContent = `KSh ${product.price.toLocaleString("en-KE")}`;
    if (detailStockCount) detailStockCount.textContent = product.stockCount;
    if (detailDescription) detailDescription.textContent = product.description;

    if (product.originalPrice && product.originalPrice > product.price) {
        if (detailOriginalPrice) {
            detailOriginalPrice.textContent = `KSh ${product.originalPrice.toLocaleString("en-KE")}`;
        }
        if (detailDiscountBadge) {
            const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
            detailDiscountBadge.textContent = `Save ${discount}%`;
            detailDiscountBadge.hidden = false;
        }
    } else {
        if (detailOriginalPrice) detailOriginalPrice.textContent = "";
        if (detailDiscountBadge) detailDiscountBadge.hidden = true;
    }

    if (detailFeatures && Array.isArray(product.features)) {
        detailFeatures.innerHTML = product.features.map(f => `<li>${f}</li>`).join("");
    }

    // Student Seller Profile
    const detailSellerName = document.getElementById("detailSellerName");
    const detailSellerProgram = document.getElementById("detailSellerProgram");
    const detailSellerLocation = document.getElementById("detailSellerLocation");

    if (product.seller) {
        if (detailSellerName) detailSellerName.textContent = product.seller.name;
        if (detailSellerProgram) detailSellerProgram.textContent = product.seller.program;
        if (detailSellerLocation) detailSellerLocation.textContent = `📍 ${product.seller.campusLocation}`;
    }

    // Image Gallery & Thumbnails
    const mainImg = document.getElementById("mainProductImage");
    const badgeOverlay = document.getElementById("detailBadgeOverlay");
    const thumbStrip = document.getElementById("thumbnailStrip");

    if (mainImg) {
        mainImg.src = product.image;
        mainImg.alt = product.name;
    }

    if (badgeOverlay) {
        badgeOverlay.innerHTML = product.badge
            ? `<span class="badge ${getBadgeClass(product.badge)}">${product.badge}</span>`
            : "";
    }

    if (thumbStrip) {
        const galleryImages = [product.image, ...(product.additionalImages || [])];

        thumbStrip.innerHTML = galleryImages.map((imgUrl, index) => `
            <button type="button" class="thumb-btn ${index === 0 ? 'active' : ''}" data-src="${imgUrl}" aria-label="View photo ${index + 1}">
                <img src="${imgUrl}" alt="${product.name} photo ${index + 1}">
            </button>
        `).join("");

        const thumbButtons = thumbStrip.querySelectorAll(".thumb-btn");
        thumbButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                thumbButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                if (mainImg) {
                    mainImg.src = btn.dataset.src;
                }
            });
        });
    }

    // Stepper & Subtotal Calculation
    const qtyInput = document.getElementById("detailQuantityInput");
    const subtotalEl = document.getElementById("detailSubtotal");
    const btnDec = document.getElementById("qtyDecrement");
    const btnInc = document.getElementById("qtyIncrement");

    function calculateSubtotal() {
        let qty = Number(qtyInput.value);
        if (!Number.isFinite(qty) || qty < 1) {
            qty = 1;
            qtyInput.value = 1;
        } else if (qty > product.stockCount) {
            qty = product.stockCount;
            qtyInput.value = product.stockCount;
        }

        const total = qty * product.price;
        if (subtotalEl) {
            subtotalEl.textContent = `KSh ${total.toLocaleString("en-KE")}`;
        }
    }

    if (qtyInput) qtyInput.addEventListener("input", calculateSubtotal);

    if (btnDec) {
        btnDec.addEventListener("click", () => {
            let current = Number(qtyInput.value) || 1;
            if (current > 1) {
                qtyInput.value = current - 1;
                calculateSubtotal();
            }
        });
    }

    if (btnInc) {
        btnInc.addEventListener("click", () => {
            let current = Number(qtyInput.value) || 1;
            if (current < product.stockCount) {
                qtyInput.value = current + 1;
                calculateSubtotal();
            }
        });
    }

    calculateSubtotal();

    // Add to Cart Button (Actual Global Cart Integration)
    const addToCartBtn = document.getElementById("detailAddToCartBtn");
    const feedbackBanner = document.getElementById("detailCartFeedback");

    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", () => {
            const qty = Number(qtyInput.value) || 1;
            addToCart(product.id, qty, true); // Adds and opens drawer!

            if (feedbackBanner) {
                const lineTotal = (qty * product.price).toLocaleString("en-KE");
                feedbackBanner.textContent = `✓ Added ${qty}x ${product.name} (KSh ${lineTotal}) to cart!`;
                feedbackBanner.classList.add("show");
                setTimeout(() => feedbackBanner.classList.remove("show"), 4000);
            }
        });
    }

    // Render Related Products
    const relatedGrid = document.getElementById("relatedGrid");
    if (relatedGrid) {
        const relatedItems = allProducts
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0, 3);

        if (relatedItems.length === 0) {
            const relatedSection = document.getElementById("relatedSection");
            if (relatedSection) relatedSection.hidden = true;
        } else {
            relatedGrid.innerHTML = relatedItems.map(p => `
                <article class="product-card" style="cursor: pointer;" onclick="window.location.href='product-details.html?id=${p.id}'">
                    <div class="product-image-wrapper">
                        ${p.badge ? `<div class="product-badge-overlay"><span class="badge ${getBadgeClass(p.badge)}">${p.badge}</span></div>` : ''}
                        <img class="product-img" src="${p.image}" alt="${p.name}" loading="lazy">
                    </div>
                    <div class="product-body">
                        <span class="category-label">${p.categoryName}</span>
                        <h2>${p.name}</h2>
                        <div class="product-meta">
                            <span class="product-rating"><span class="star">★</span> ${p.rating.toFixed(1)}</span>
                        </div>
                        <p class="price">KSh ${p.price.toLocaleString("en-KE")}</p>
                        <a href="product-details.html?id=${p.id}" class="card-view-btn">View Details &rarr;</a>
                    </div>
                </article>
            `).join("");
        }
    }
}

/* --------------------------------------------------------------------------
   5. Registration & Student Auth Simulation (register.html)
   -------------------------------------------------------------------------- */
function setupRegistrationForm() {
    const form = document.getElementById("registrationForm");

    if (!form) return;

    let isRegisterMode = true;

    const tabRegister = document.getElementById("tabRegister");
    const tabLogin = document.getElementById("tabLogin");
    const formHeading = document.getElementById("formHeading");
    const formEyebrow = document.getElementById("formEyebrow");
    const formSubheading = document.getElementById("formSubheading");
    const groupFullName = document.getElementById("groupFullName");
    const groupConfirmPassword = document.getElementById("groupConfirmPassword");
    const groupTerms = document.getElementById("groupTerms");
    const btnSubmitForm = document.getElementById("btnSubmitForm");

    const profileCard = document.getElementById("loggedInProfileCard");
    const sessionUserName = document.getElementById("sessionUserName");
    const sessionUserEmail = document.getElementById("sessionUserEmail");
    const btnSignOut = document.getElementById("btnSignOut");

    // Check existing login session
    function checkSession() {
        const user = getSavedUser();
        if (user && profileCard) {
            profileCard.style.display = "block";
            form.style.display = "none";
            if (sessionUserName) sessionUserName.textContent = user.name;
            if (sessionUserEmail) sessionUserEmail.textContent = user.email;
        } else if (profileCard) {
            profileCard.style.display = "none";
            form.style.display = "block";
        }
    }

    if (btnSignOut) {
        btnSignOut.addEventListener("click", () => {
            localStorage.removeItem("campus_user");
            const navChip = document.getElementById("navUserChip");
            if (navChip) navChip.remove();
            checkSession();
            showToast("Signed out of student session.");
        });
    }

    checkSession();

    // Tab Switcher Handler
    if (tabRegister && tabLogin) {
        tabRegister.addEventListener("click", () => {
            isRegisterMode = true;
            tabRegister.classList.add("active");
            tabLogin.classList.remove("active");
            tabRegister.setAttribute("aria-selected", "true");
            tabLogin.setAttribute("aria-selected", "false");

            if (formEyebrow) formEyebrow.textContent = "JOIN CAMPUSMARKET";
            if (formHeading) formHeading.textContent = "Create your account.";
            if (formSubheading) formSubheading.textContent = "Register with your university details to unlock full student marketplace features.";
            if (groupFullName) groupFullName.style.display = "flex";
            if (groupConfirmPassword) groupConfirmPassword.style.display = "flex";
            if (groupTerms) groupTerms.style.display = "flex";
            if (btnSubmitForm) btnSubmitForm.textContent = "Create Account";
            clearErrors();
        });

        tabLogin.addEventListener("click", () => {
            isRegisterMode = false;
            tabLogin.classList.add("active");
            tabRegister.classList.remove("active");
            tabLogin.setAttribute("aria-selected", "true");
            tabRegister.setAttribute("aria-selected", "false");

            if (formEyebrow) formEyebrow.textContent = "WELCOME BACK";
            if (formHeading) formHeading.textContent = "Sign in to CampusMarket.";
            if (formSubheading) formSubheading.textContent = "Sign in using your student email and password.";
            if (groupFullName) groupFullName.style.display = "none";
            if (groupConfirmPassword) groupConfirmPassword.style.display = "none";
            if (groupTerms) groupTerms.style.display = "none";
            if (btnSubmitForm) btnSubmitForm.textContent = "Sign In";
            clearErrors();
        });
    }

    const nameInput = document.getElementById("fullName");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const termsInput = document.getElementById("terms");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const confirmPasswordError = document.getElementById("confirmPasswordError");
    const termsError = document.getElementById("termsError");
    const formMessage = document.getElementById("formMessage");
    const togglePassword = document.getElementById("togglePassword");

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", () => {
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                togglePassword.textContent = "Hide";
            } else {
                passwordInput.type = "password";
                togglePassword.textContent = "Show";
            }
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener("input", () => {
            if (passwordInput.value.length === 0) {
                if (passwordError) passwordError.textContent = "";
            } else if (passwordInput.value.length < 8) {
                if (passwordError) passwordError.textContent = "Password must contain at least 8 characters.";
            } else {
                if (passwordError) passwordError.textContent = "";
            }
        });
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        clearErrors();

        let isValid = true;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Email validation (both modes)
        if (emailInput.value.trim() === "") {
            emailError.textContent = "Email address is required.";
            isValid = false;
        } else if (!emailPattern.test(emailInput.value.trim())) {
            emailError.textContent = "Enter a valid-looking email address.";
            isValid = false;
        }

        // Password validation (both modes)
        if (passwordInput.value === "") {
            passwordError.textContent = "Password is required.";
            isValid = false;
        } else if (passwordInput.value.length < 8) {
            passwordError.textContent = "Password must contain at least 8 characters.";
            isValid = false;
        }

        // Register mode only validations
        if (isRegisterMode) {
            if (nameInput.value.trim() === "") {
                nameError.textContent = "Full name is required.";
                isValid = false;
            }

            if (confirmPasswordInput.value === "") {
                confirmPasswordError.textContent = "Please confirm your password.";
                isValid = false;
            } else if (passwordInput.value !== confirmPasswordInput.value) {
                confirmPasswordError.textContent = "Passwords do not match.";
                isValid = false;
            }

            if (!termsInput.checked) {
                termsError.textContent = "You must agree to the terms.";
                isValid = false;
            }
        }

        if (!isValid) {
            formMessage.textContent = "Please correct the highlighted fields before continuing.";
            formMessage.className = "form-message error";
            return;
        }

        // Save session in localStorage
        const userName = isRegisterMode ? nameInput.value.trim() : emailInput.value.split("@")[0];
        const userObj = { name: userName, email: emailInput.value.trim() };
        localStorage.setItem("campus_user", JSON.stringify(userObj));

        formMessage.textContent = isRegisterMode
            ? "Registration successful! Welcome to CampusMarket."
            : "Sign in verified! Welcome back.";
        formMessage.className = "form-message success";

        showToast(`Welcome ${userName}! Student session active.`);

        setTimeout(() => {
            initGlobalNavigationAndUser();
            checkSession();
        }, 1200);

        form.reset();
        if (passwordError) passwordError.textContent = "";
    });

    function clearErrors() {
        if (nameError) nameError.textContent = "";
        if (emailError) emailError.textContent = "";
        if (passwordError) passwordError.textContent = "";
        if (confirmPasswordError) confirmPasswordError.textContent = "";
        if (termsError) termsError.textContent = "";
        if (formMessage) {
            formMessage.textContent = "";
            formMessage.className = "form-message";
        }
    }
}
