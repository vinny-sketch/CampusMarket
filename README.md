# CampusMarket — University Student Marketplace

> **Academic Project Submission**  
> **Course:** CS 2314: Web Based Programming II  
> **Milestone:** Frontend Architecture & Interactive Demonstration  
> **Stack:** Semantic HTML5, CSS3 Custom Properties Design System, Modern ES6 JavaScript (Zero external libraries/frameworks)

---

## 1. Project Overview
**CampusMarket** is a modern student-to-student e-commerce web platform designed specifically for university life. It provides an intuitive, trustworthy channel for university students to buy and sell textbooks, electronics, study accessories, dorm essentials, and campus lifestyle gear with verified safe handovers at campus hub points.

The application is structured cleanly for academic demonstration: lightweight, responsive, accessible, modular, and ready for future database/backend integration (e.g., PHP/MySQL or REST API).

---

## 2. Implemented Features & Capabilities

### 🛒 A. Global Shopping Cart & Drawer
* **Persistent Cart State:** Saved in `localStorage` across page navigation and browser reloads.
* **Header Cart Trigger & Live Badge:** Cart button with animated item count badge present across all pages (`Home`, `Catalog`, `Product Details`, `Account`).
* **Slide-Over Off-Canvas Drawer:**
  * Clean item listing with high-resolution thumbnails, item titles, unit prices, and line subtotals.
  * Interactive quantity adjustment buttons (`+` / `-`) that cap at available campus stock.
  * Instant item deletion (`×`).
  * Live subtotal calculation in Kenyan Shillings (`KSh`).

### 📦 B. Campus Checkout Simulation & Official Receipt
* **Pickup Location Selector:** Official on-campus exchange points (Main University Library Foyer, Student Union Center, Tech Complex Atrium, Hostels 1–4 Porter Desk, Cafeteria Quad).
* **Student Verification Form:** Collects Full Name, University Registration Number, and Phone Number for simulated pickup SMS notifications.
* **Order Confirmation Receipt:** Generates a realistic order confirmation screen with a unique reference number (`CM-2026-XXXX`), itemized list, scheduled pickup window, and amount due upon collection. Clears the cart automatically upon reservation.

### 🔍 C. Dynamic Catalog Experience (`catalog.html`)
* **Centralized Data Model:** 24 university student products rendered dynamically from [`products.js`](products.js) across 6 student categories.
* **Instant Multi-Field Search:** Searches product name, category, subcategory, detailed description, and search keywords in real time without reloading.
* **Dual Category Filtering:** Category filter select dropdown synchronized bidirectionally with quick-access category pills (`🏷️ All`, `💻 Tech`, `📚 Study`, `🛏️ Dorm`, `🎒 Bags`, `🎧 Audio`, `🏃 Wellness`).
* **Multi-Criteria Sorting:** Sort by Featured Deals, Price: Low to High, Price: High to Low, Highest Rated, and Name A–Z.
* **Card Interactivity:** Cards link to full product details; inline quantity input calculates live card line subtotal (`KSh`) without triggering page navigation. Quick "🛒 Add" button adds directly to the global cart.

### 📄 D. Dedicated Product Details Experience (`product-details.html`)
* **Dynamic URL Routing:** Uses `URLSearchParams` (`?id=tech-01`) to load any of the 24 products dynamically.
* **Photo Gallery:** High-resolution main image with an interactive thumbnail strip that swaps active images on click.
* **Academic Context & Trust:** Includes product condition badges (*Brand New, Like New, Refurbished*), star ratings, verified student seller card (*Seller Name, Academic Program, Campus Hostel/Hall Location*), and key specifications.
* **Live Stepper & Subtotal:** Stepper controls (`-`, `[1]`, `+`) with real-time subtotal calculation.
* **Related Products:** Responsive "More from this Category" recommendations grid.

### 🏠 E. Storefront Homepage (`index.html`)
* **Search Hero:** Search input with direct search handoff to `catalog.html?search=...`.
* **Category Hub Cards:** 6 interactive visual cards linking to filtered catalog views.
* **Featured Deals Section:** Showcases top student picks with discount tags.
* **Student Value Propositions:** Highlights safe on-campus pickup, student pricing, and zero shipping delays.
* **Campus Testimonials:** Peer reviews from students across different faculties.

### 👤 F. Student Account & Authentication (`register.html`)
* **Account Mode Switcher:** Tabbed interface switching between "Create Account" and "Sign In".
* **Rigorous Client-Side Validation:**
  * Full name presence validation.
  * Regex university email verification (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
  * Minimum 8-character password requirement with real-time length feedback.
  * Password matching verification.
  * Terms & community guidelines agreement checkbox.
  * Interactive password show/hide toggle.
* **Session Persistence:** Saves active student session to `localStorage` and displays a logged-in profile card with a "Sign Out" button, while rendering a student avatar pill in the top navigation bar.

---

## 3. Project Structure

```text
CampusMarket/
├── index.html             # Storefront homepage (Hero search, category cards, featured deals)
├── catalog.html           # Dynamic product catalog (Search, category pills, sorting, cards)
├── product-details.html   # Dedicated product details view (Gallery, specs, seller card, stepper)
├── register.html          # Student registration & authentication (Tabs, live validation, session)
├── styles.css             # Comprehensive design system (Tokens, typography, drawer, modal, responsive)
├── products.js            # Centralized 24-product catalog dataset & query helper functions
├── app.js                 # Unified JavaScript engine (Cart, checkout, catalog, details, auth)
└── README.md              # Academic documentation & coursework guide
```

---

## 4. How to Run Locally

1. **Direct Browser Execution:**
   * Open [`index.html`](index.html) directly in any modern browser (Chrome, Firefox, Safari, Edge).
2. **Local Development Server (Recommended):**
   * Using Python:
     ```sh
     python -m http.server 8000
     ```
     Then navigate to `http://localhost:8000`.
   * Using Node/NPM:
     ```sh
     npx serve .
     ```
     or using the VS Code *Live Server* extension.

---

## 5. Design System Highlights (`styles.css`)
* **Typography:** `Plus Jakarta Sans` Google Font with clean font smoothing.
* **Palette:** Institutional royal blue (`#2563eb`), slate text (`#0f172a`), emerald success (`#10b981`), amber accent (`#f59e0b`), and soft surfaces (`#f8fafc`).
* **Elevation:** Layered shadow tokens (`--shadow-xs` to `--shadow-xl`, `--shadow-float`).
* **Responsiveness:** Fully fluid layouts with breakpoints at `960px`, `800px`, and `600px` ensuring seamless operation on mobile phones, tablets, and desktop workstations.
