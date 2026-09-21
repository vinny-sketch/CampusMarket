/**
 * CampusMarket - Central Product Data Model
 * Academic Project: CS 2314 Web Based Programming II
 *
 * Centralized catalog dataset featuring 24 university-focused student products
 * across 6 campus categories. All images use legitimate public CDN photography.
 * All seller profiles are simulated student demo profiles for educational evaluation.
 */

const CAMPUS_CATEGORIES = [
    { id: "all", name: "All Categories", icon: "🏷️" },
    { id: "tech", name: "Tech & Computing", icon: "💻" },
    { id: "study", name: "Study & Stationery", icon: "📚" },
    { id: "dorm", name: "Dorm & Living", icon: "🛏️" },
    { id: "bags", name: "Bags & Carry", icon: "🎒" },
    { id: "audio", name: "Audio & Entertainment", icon: "🎧" },
    { id: "wellness", name: "Campus Wellness", icon: "🏃" }
];

const CAMPUS_PRODUCTS = [
    // --- TECH & COMPUTING ---
    {
        id: "tech-01",
        name: "Wireless Ergonomic Mouse",
        category: "tech",
        categoryName: "Tech & Computing",
        subcategory: "Peripherals",
        price: 1200,
        originalPrice: 1500,
        condition: "Brand New",
        badge: "Campus Essential",
        rating: 4.8,
        reviewCount: 38,
        image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
        additionalImages: [
            "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80"
        ],
        description: "A compact wireless mouse with silent clicks, contoured grip, and high-precision optical tracking. Ideal for busy university library sessions without disturbing peers.",
        features: [
            "Silent micro-switch clicks (90% noise reduction)",
            "Dual connection: 2.4GHz USB nano receiver & Bluetooth",
            "Up to 18 months battery life on a single AA battery",
            "Smooth ergonomic shape fitting laptop bags easily"
        ],
        seller: {
            name: "Brian K. (Student Seller)",
            program: "BSc Computer Science, Year 3",
            campusLocation: "Technology Complex / Hall 4",
            verified: true
        },
        inStock: true,
        stockCount: 14,
        keywords: "mouse wireless ergonomic silent click tech laptop computing"
    },
    {
        id: "tech-02",
        name: "USB 3.2 High-Speed Flash Drive (64GB)",
        category: "tech",
        categoryName: "Tech & Computing",
        subcategory: "Storage",
        price: 900,
        originalPrice: 900,
        condition: "Brand New",
        badge: null,
        rating: 4.7,
        reviewCount: 52,
        image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&auto=format&fit=crop&q=80",
        additionalImages: [
            "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80"
        ],
        description: "Durable metal-cased USB 3.2 flash drive for swift transfer of lecture slides, programming repositories, assignments, and high-resolution media.",
        features: [
            "64GB capacity with up to 130MB/s read speeds",
            "Backward compatible with USB 2.0 and USB 3.0 ports",
            "Compact keyring loop for secure daily carry",
            "Sturdy metal casing resistant to drops and scratches"
        ],
        seller: {
            name: "Sarah M. (Student Seller)",
            program: "BSc Information Technology, Year 2",
            campusLocation: "Student Center / Hostels",
            verified: true
        },
        inStock: true,
        stockCount: 22,
        keywords: "usb flash drive thumb drive 64gb storage memory tech"
    },
    {
        id: "tech-03",
        name: "7-in-1 USB-C Multiport Hub",
        category: "tech",
        categoryName: "Tech & Computing",
        subcategory: "Adapters",
        price: 3800,
        originalPrice: 4500,
        condition: "Brand New",
        badge: "Best Seller",
        rating: 4.9,
        reviewCount: 29,
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
        additionalImages: [
            "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80"
        ],
        description: "Essential aluminum USB-C hub providing 4K HDMI, 100W Power Delivery, SD/MicroSD card readers, and three USB 3.0 ports for modern student laptops.",
        features: [
            "4K @ 30Hz HDMI output for lecture room projectors",
            "100W USB-C Power Delivery pass-through charging",
            "Dual SD & TF card slots for camera media and lab data",
            "Ultra-slim anodized aluminum enclosure"
        ],
        seller: {
            name: "David O. (Student Seller)",
            program: "BEng Electrical Engineering, Year 4",
            campusLocation: "Engineering Labs / Hall 2",
            verified: true
        },
        inStock: true,
        stockCount: 8,
        keywords: "usb-c hub adapter hdmi power delivery dock dongle laptop macbook"
    },
    {
        id: "tech-04",
        name: "20,000mAh Fast-Charging Power Bank",
        category: "tech",
        categoryName: "Tech & Computing",
        subcategory: "Power & Chargers",
        price: 2900,
        originalPrice: 3500,
        condition: "Brand New",
        badge: "Student Deal",
        rating: 4.8,
        reviewCount: 64,
        image: "https://images.unsplash.com/photo-1609592426868-b7c126d4002c?w=600&auto=format&fit=crop&q=80",
        additionalImages: [
            "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80"
        ],
        description: "High-capacity external battery capable of recharging a typical smartphone 4-5 times. Features 22.5W fast charging to keep devices alive through long lecture days.",
        features: [
            "20,000mAh Li-polymer capacity",
            "Dual USB-A and USB-C input/output ports",
            "LED percentage battery display indicator",
            "Multiple circuit protection against overcharging"
        ],
        seller: {
            name: "David O. (Student Seller)",
            program: "BEng Electrical Engineering, Year 4",
            campusLocation: "Engineering Labs / Hall 2",
            verified: true
        },
        inStock: true,
        stockCount: 11,
        keywords: "power bank battery portable charger fast charging 20000mah phone"
    },
    {
        id: "tech-05",
        name: "Adjustable Aluminum Laptop Stand",
        category: "tech",
        categoryName: "Tech & Computing",
        subcategory: "Ergonomics",
        price: 1850,
        originalPrice: 2200,
        condition: "Like New",
        badge: null,
        rating: 4.6,
        reviewCount: 19,
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
        additionalImages: [
            "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80"
        ],
        description: "Foldable desktop laptop riser that promotes healthy posture during research, thesis writing, and remote lectures. Improves device airflow.",
        features: [
            "6 adjustable height angles from 15° to 45°",
            "Silicone anti-slip pads protect laptop finish",
            "Hollow ventilation design prevents CPU throttling",
            "Folds completely flat with included travel pouch"
        ],
        seller: {
            name: "Alex W. (Student Seller)",
            program: "BSc Software Engineering, Year 3",
            campusLocation: "Main Library Study Area",
            verified: true
        },
        inStock: true,
        stockCount: 6,
        keywords: "laptop stand riser aluminum ergonomic folding desk study"
    },

    // --- STUDY & STATIONERY ---
    {
        id: "study-01",
        name: "Campus Hardcover Spiral Notebook (3-Pack)",
        category: "study",
        categoryName: "Study & Stationery",
        subcategory: "Notebooks",
        price: 850,
        originalPrice: 1050,
        condition: "Brand New",
        badge: "Campus Essential",
        rating: 4.9,
        reviewCount: 76,
        image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop&q=80",
        additionalImages: [
            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80"
        ],
        description: "Set of three durable A4 spiral notebooks with college-ruled 80gsm paper. Ink-bleed resistant pages perfect for lecture notes and revision summaries.",
        features: [
            "160 micro-perforated lined pages per notebook",
            "80 GSM high-opacity paper minimizing ghosting",
            "Double-wire metal spiral binding that opens 360 degrees",
            "Interior dual pocket divider for loose handouts"
        ],
        seller: {
            name: "Grace T. (Student Seller)",
            program: "BEd Arts & Education, Year 2",
            campusLocation: "Education Block / Student Union",
            verified: true
        },
        inStock: true,
        stockCount: 30,
        keywords: "notebook spiral paper lecture notes stationery study book"
    },
    {
        id: "study-02",
        name: "Scientific Calculator FX-991EX ClassWiz",
        category: "study",
        categoryName: "Study & Stationery",
        subcategory: "Calculators",
        price: 1800,
        originalPrice: 2100,
        condition: "Brand New",
        badge: "Best Seller",
        rating: 4.9,
        reviewCount: 88,
        image: "https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48f?w=600&auto=format&fit=crop&q=80",
        additionalImages: [
            "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80"
        ],
        description: "Standard high-resolution scientific calculator approved for university exams in mathematics, statistics, computer science, and engineering.",
        features: [
            "552 mathematical functions with natural textbook display",
            "Spreadsheet, matrix, vector, and equation calculations",
            "Dual solar power and battery backup",
            "Hard slide-on protective casing"
        ],
        seller: {
            name: "Kevin N. (Student Seller)",
            program: "BSc Actuarial Science, Year 3",
            campusLocation: "Mathematics Building / Hall 1",
            verified: true
        },
        inStock: true,
        stockCount: 15,
        keywords: "calculator scientific casio math statistics engineering study"
    },
    {
        id: "study-03",
        name: "Pastel Dual-Tip Highlighters (Set of 6)",
        category: "study",
        categoryName: "Study & Stationery",
        subcategory: "Pens & Markers",
        price: 450,
        originalPrice: 450,
        condition: "Brand New",
        badge: null,
        rating: 4.7,
        reviewCount: 41,
        image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80",
        additionalImages: [
            "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&auto=format&fit=crop&q=80"
        ],
        description: "Soft aesthetic pastel highlighters featuring a broad chisel tip and fine bullet tip. Gentle on the eyes during late-night exam revision.",
        features: [
            "6 soothing muted pastel colors that don't bleed through paper",
            "Quick-drying non-toxic water-based pigment",
            "Dual-tip versatility for both broad highlighting and underlining",
            "Comfortable flat barrel design preventing desk roll-off"
        ],
        seller: {
            name: "Grace T. (Student Seller)",
            program: "BEd Arts & Education, Year 2",
            campusLocation: "Education Block / Student Union",
            verified: true
        },
        inStock: true,
        stockCount: 25,
        keywords: "highlighters pastel markers pens stationery study notes"
    },
    {
        id: "study-04",
        name: "Dimmable LED Desk Study Lamp",
        category: "study",
        categoryName: "Study & Stationery",
        subcategory: "Lighting",
        price: 1650,
        originalPrice: 2200,
        condition: "Brand New",
        badge: "Student Deal",
        rating: 4.8,
        reviewCount: 27,
        image: "https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=600&auto=format&fit=crop&q=80",
        additionalImages: [
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80"
        ],
        description: "Eye-caring LED desk lamp with touch controls, 3 lighting temperature modes (Warm, Natural, Daylight), and stepless brightness adjustment.",
        features: [
            "Flicker-free eye-care illumination reducing eye fatigue",
            "3 color modes with memory function",
            "Flexible multi-angle gooseneck arm",
            "USB-powered: runs from laptop, power bank, or wall adapter"
        ],
        seller: {
            name: "Sarah M. (Student Seller)",
            program: "BSc Information Technology, Year 2",
            campusLocation: "Student Center / Hostels",
            verified: true
        },
        inStock: true,
        stockCount: 9,
        keywords: "lamp led desk light study lighting dorm reading"
    },
    {
        id: "study-05",
        name: "Sticky Notes & Colored Index Tabs Revision Bundle",
        category: "study",
        categoryName: "Study & Stationery",
        subcategory: "Notes & Tabs",
        price: 350,
        originalPrice: 350,
        condition: "Brand New",
        badge: null,
        rating: 4.8,
        reviewCount: 36,
        image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80",
        additionalImages: [
            "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop&q=80"
        ],
        description: "Essential set of self-adhesive pastel sticky notes, ruled memos, and transparent page marker index tabs for textbook referencing and assignment drafting.",
        features: [
            "400 self-adhesive sheets with clean, residue-free removal",
            "Translucent waterproof index tabs that allow text underneath to be readable",
            "Pastel color coding for prioritizing revision topics",
            "Compact desk pad format fitting easily in pencil cases"
        ],
        seller: {
            name: "Grace T. (Student Seller)",
            program: "BEd Arts & Education, Year 2",
            campusLocation: "Education Block / Student Union",
            verified: true
        },
        inStock: true,
        stockCount: 40,
        keywords: "sticky notes tabs revision flags stationery study textbook"
    },

    // --- DORM & LIVING ---
    {
        id: "dorm-01",
        name: "Insulated Stainless Steel Water Bottle (750ml)",
        category: "dorm",
        categoryName: "Dorm & Living",
        subcategory: "Drinkware",
        price: 700,
        originalPrice: 900,
        condition: "Brand New",
        badge: "Campus Essential",
        rating: 4.9,
        reviewCount: 94,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
        additionalImages: [
            "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
        ],
        description: "Double-wall vacuum-insulated stainless steel hydration bottle. Keeps water ice-cold for 24 hours or coffee hot for 12 hours between lectures.",
        features: [
            "Food-grade 18/8 stainless steel, 100% BPA-free",
            "Leakproof screw cap with ergonomic carrying loop",
            "Sweat-free powder-coated exterior finish",
            "Standard size fits backpack side pockets and bicycle holders"
        ],
        seller: {
            name: "Emma L. (Student Seller)",
            program: "BSc Nursing & Health Sciences, Year 1",
            campusLocation: "Medical School / Hall 5",
            verified: true
        },
        inStock: true,
        stockCount: 20,
        keywords: "water bottle flask thermos insulated stainless steel hydration dorm"
    },
    {
        id: "dorm-02",
        name: "Rapid-Boil Cordless Electric Kettle (1.5L)",
        category: "dorm",
        categoryName: "Dorm & Living",
        subcategory: "Appliances",
        price: 1950,
        originalPrice: 2400,
        condition: "Brand New",
        badge: "Best Seller",
        rating: 4.7,
        reviewCount: 46,
        image: "https://images.unsplash.com/photo-1594213114663-d94db9b17125?w=600&auto=format&fit=crop&q=80",
        additionalImages: [
            "https://images.unsplash.com/photo-1570554886111-e80fcca6a029?w=600&auto=format&fit=crop&q=80"
        ],
        description: "Fast-boiling cordless electric kettle ideal for dormitory tea, coffee, instant noodles, and hot water preparation.",
        features: [
            "1.5-liter capacity with 1500W rapid boiling element",
            "Automatic shut-off and boil-dry safety protection",
            "360-degree rotational power base with cord wrap",
            "Easy-pour spout with integrated removable mesh filter"
        ],
        seller: {
            name: "Brian K. (Student Seller)",
            program: "BSc Computer Science, Year 3",
            campusLocation: "Technology Complex / Hall 4",
            verified: true
        },
        inStock: true,
        stockCount: 7,
        keywords: "kettle electric kettle water dorm kitchen tea coffee noodles"
    },
    {
        id: "dorm-03",
        name: "Silent USB Rechargeable Clip Desk Fan",
        category: "dorm",
        categoryName: "Dorm & Living",
        subcategory: "Room Comfort",
        price: 1400,
        originalPrice: 1700,
        condition: "Brand New",
        badge: null,
        rating: 4.6,
        reviewCount: 31,
        image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80",
        additionalImages: [
            "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80"
        ],
        description: "Versatile personal fan that clips firmly onto dormitory bunk beds or sits upright on study desks. Features whisper-quiet airflow.",
        features: [
            "4000mAh built-in battery giving up to 10 hours runtime",
            "3 adjustable speed settings with 360° manual tilt rotation",
            "Strong non-scratch rubberized grip clamp",
            "USB-C rechargeable"
        ],
        seller: {
            name: "Emma L. (Student Seller)",
            program: "BSc Nursing & Health Sciences, Year 1",
            campusLocation: "Medical School / Hall 5",
            verified: true
        },
        inStock: true,
        stockCount: 12,
        keywords: "fan desk fan clip fan usb fan rechargeable cooling dorm"
    },
    {
        id: "dorm-04",
        name: "Hanging Closet Organizer & Storage Shelves",
        category: "dorm",
        categoryName: "Dorm & Living",
        subcategory: "Organization",
        price: 1100,
        originalPrice: 1350,
        condition: "Brand New",
        badge: null,
        rating: 4.5,
        reviewCount: 22,
        image: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80",
        additionalImages: [
            "https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?w=600&auto=format&fit=crop&q=80"
        ],
        description: "Space-maximizing 4-tier vertical hanging organizer made from breathable Oxford fabric to keep hostel closets neat and clutter-free.",
        features: [
            "4 deep compartments with reinforced bottom boards",
            "Heavy-duty top hook-and-loop strap fits any standard closet rod",
            "Collapsible design for easy storage during semester breaks",
            "Side mesh pockets for small accessories, belts, and socks"
        ],
        seller: {
            name: "Sarah M. (Student Seller)",
            program: "BSc Information Technology, Year 2",
            campusLocation: "Student Center / Hostels",
            verified: true
        },
        inStock: true,
        stockCount: 14,
        keywords: "closet organizer wardrobe storage hanging dorm hostel shelf"
    },

    // --- BAGS & CARRY ---
    {
        id: "bags-01",
        name: "Water-Resistant Campus Laptop Backpack (25L)",
        category: "bags",
        categoryName: "Bags & Carry",
        subcategory: "Backpacks",
        price: 2500,
        originalPrice: 3200,
        condition: "Brand New",
        badge: "Best Seller",
        rating: 4.9,
        reviewCount: 112,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
        additionalImages: [
            "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=600&auto=format&fit=crop&q=80"
        ],
        description: "An ergonomic, water-repellent university backpack with a dedicated padded 15.6-inch laptop compartment, hidden anti-theft pocket, and USB charging port.",
        features: [
            "Dedicated fleece-lined sleeve fits up to 15.6-inch laptops",
            "High-density water-resistant polyester fabric",
            "Breathable mesh padded back panel and shoulder straps",
            "Hidden rear anti-theft zipper pocket for phone and student ID"
        ],
        seller: {
            name: "David O. (Student Seller)",
            program: "BEng Electrical Engineering, Year 4",
            campusLocation: "Engineering Labs / Hall 2",
            verified: true
        },
        inStock: true,
        stockCount: 18,
        keywords: "backpack laptop bag water resistant campus student rucksack"
    },
    {
        id: "bags-02",
        name: "Heavy-Duty Aesthetic Canvas Student Tote",
        category: "bags",
        categoryName: "Bags & Carry",
        subcategory: "Tote Bags",
        price: 950,
        originalPrice: 950,
        condition: "Brand New",
        badge: "Student Deal",
        rating: 4.7,
        reviewCount: 58,
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
        additionalImages: [
            "https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=600&auto=format&fit=crop&q=80"
        ],
        description: "Minimalist natural cotton canvas tote bag with reinforced cross-stitched handles and interior zipper pouch for everyday campus life.",
        features: [
            "12oz 100% thick organic cotton canvas",
            "Spacious main compartment holds notebooks, tablet, and water bottle",
            "Interior zippered pocket for keys and student cards",
            "Long shoulder drop handles for comfortable all-day carrying"
        ],
        seller: {
            name: "Grace T. (Student Seller)",
            program: "BEd Arts & Education, Year 2",
            campusLocation: "Education Block / Student Union",
            verified: true
        },
        inStock: true,
        stockCount: 24,
        keywords: "tote canvas bag shoulder bag aesthetic cotton book bag campus"
    },
    {
        id: "bags-03",
        name: "Anti-Theft Crossbody Commuter Sling Bag",
        category: "bags",
        categoryName: "Bags & Carry",
        subcategory: "Sling Bags",
        price: 1600,
        originalPrice: 1950,
        condition: "Brand New",
        badge: null,
        rating: 4.6,
        reviewCount: 25,
        image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&auto=format&fit=crop&q=80",
        additionalImages: [
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80"
        ],
        description: "Compact single-strap sling pack designed for students on the move between lectures, dining halls, and town transit.",
        features: [
            "Can be worn on chest or back with reversible strap",
            "Fits up to an 11-inch tablet comfortably",
            "Water-repellent Oxford exterior with lockable dual zippers",
            "External USB charging port built into the side"
        ],
        seller: {
            name: "Brian K. (Student Seller)",
            program: "BSc Computer Science, Year 3",
            campusLocation: "Technology Complex / Hall 4",
            verified: true
        },
        inStock: true,
        stockCount: 10,
        keywords: "sling bag crossbody anti-theft shoulder pack commute travel"
    },
    {
        id: "bags-04",
        name: "Padded Shockproof 15.6-inch Laptop Sleeve",
        category: "bags",
        categoryName: "Bags & Carry",
        subcategory: "Laptop Sleeves",
        price: 1200,
        originalPrice: 1500,
        condition: "Brand New",
        badge: "Campus Essential",
        rating: 4.8,
        reviewCount: 43,
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80",
        additionalImages: [
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80"
        ],
        description: "Slim, protective neoprene laptop sleeve featuring 360-degree corner drop protection and front accessory pocket for charger and cables.",
        features: [
            "Thick plush fleece interior lining preventing scratches",
            "Water-repellent spill-resistant polyester outer layer",
            "Front zippered compartment for phone, charger, and stylus",
            "Ultra-slim profile slides effortlessly into backpacks or totes"
        ],
        seller: {
            name: "David O. (Student Seller)",
            program: "BEng Electrical Engineering, Year 4",
            campusLocation: "Engineering Labs / Hall 2",
            verified: true
        },
        inStock: true,
        stockCount: 17,
        keywords: "laptop sleeve case pouch protective cover 15.6 inch bags"
    },

    // --- AUDIO & ENTERTAINMENT ---
    {
        id: "audio-01",
        name: "Pro ANC Wireless Over-Ear Headphones",
        category: "audio",
        categoryName: "Audio & Entertainment",
        subcategory: "Headphones",
        price: 4200,
        originalPrice: 5500,
        condition: "Brand New",
        badge: "Best Seller",
        rating: 4.8,
        reviewCount: 67,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
        additionalImages: [
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80"
        ],
        description: "Active noise-cancelling wireless headphones with plush memory foam earcups and 30-hour battery life. The ultimate tool for focused study in noisy libraries.",
        features: [
            "Hybrid Active Noise Cancellation filters ambient noise up to 28dB",
            "40mm dynamic drivers with rich bass and clear mids",
            "Up to 30 hours of continuous wireless playback",
            "Foldable travel design with 3.5mm backup cable included"
        ],
        seller: {
            name: "Alex W. (Student Seller)",
            program: "BSc Software Engineering, Year 3",
            campusLocation: "Main Library Study Area",
            verified: true
        },
        inStock: true,
        stockCount: 9,
        keywords: "headphones anc noise cancelling wireless bluetooth audio over-ear"
    },
    {
        id: "audio-02",
        name: "True Wireless Earbuds with Battery Display",
        category: "audio",
        categoryName: "Audio & Entertainment",
        subcategory: "Earbuds",
        price: 2100,
        originalPrice: 2800,
        condition: "Brand New",
        badge: "Student Deal",
        rating: 4.7,
        reviewCount: 49,
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
        additionalImages: [
            "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&auto=format&fit=crop&q=80"
        ],
        description: "Pocket-sized Bluetooth 5.3 earbuds delivering crystal clear audio for podcasts, lectures, and gym workouts. Case features an LED battery readout.",
        features: [
            "Bluetooth 5.3 instant pairing with low latency gaming mode",
            "Case with numerical LED battery percentage display",
            "IPX5 sweat and splash resistance",
            "Smart touch controls for volume, track skip, and voice assistant"
        ],
        seller: {
            name: "Kevin N. (Student Seller)",
            program: "BSc Actuarial Science, Year 3",
            campusLocation: "Mathematics Building / Hall 1",
            verified: true
        },
        inStock: true,
        stockCount: 16,
        keywords: "earbuds tws wireless earphones bluetooth audio airpods"
    },
    {
        id: "audio-03",
        name: "Waterproof Clip-On Portable Bluetooth Speaker",
        category: "audio",
        categoryName: "Audio & Entertainment",
        subcategory: "Speakers",
        price: 1750,
        originalPrice: 2200,
        condition: "Brand New",
        badge: null,
        rating: 4.6,
        reviewCount: 33,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80",
        additionalImages: [
            "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80"
        ],
        description: "Rugged, portable Bluetooth speaker with an integrated carabiner clip. Perfect for hostel room gatherings, sports fields, and campus picnics.",
        features: [
            "IPX7 fully waterproof construction",
            "Built-in metal carabiner hooks easily to backpacks",
            "10 hours of rich acoustic playback per charge",
            "Integrated microphone for hands-free speakerphone calls"
        ],
        seller: {
            name: "Alex W. (Student Seller)",
            program: "BSc Software Engineering, Year 3",
            campusLocation: "Main Library Study Area",
            verified: true
        },
        inStock: true,
        stockCount: 12,
        keywords: "speaker bluetooth portable waterproof audio sound music"
    },

    // --- CAMPUS WELLNESS & FITNESS ---
    {
        id: "wellness-01",
        name: "Gym Shaker Bottle with Wire Whisk (800ml)",
        category: "wellness",
        categoryName: "Campus Wellness",
        subcategory: "Fitness Gear",
        price: 650,
        originalPrice: 650,
        condition: "Brand New",
        badge: null,
        rating: 4.8,
        reviewCount: 44,
        image: "https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?w=600&auto=format&fit=crop&q=80",
        additionalImages: [
            "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80"
        ],
        description: "Leak-proof sports shaker with surgical-grade stainless steel wire mixing ball for smooth protein shakes, hydration drinks, and smoothies.",
        features: [
            "800ml capacity with embossed ounce and milliliter markings",
            "Surgical-grade stainless steel wire blending whisk included",
            "100% leakproof flip-cap with protective spout cover",
            "BPA and phthalate-free food-safe polymer"
        ],
        seller: {
            name: "Emma L. (Student Seller)",
            program: "BSc Nursing & Health Sciences, Year 1",
            campusLocation: "Medical School / Hall 5",
            verified: true
        },
        inStock: true,
        stockCount: 25,
        keywords: "shaker gym protein fitness bottle wellness sports"
    },
    {
        id: "wellness-02",
        name: "Anti-Eyestrain Blue Light Blocking Glasses",
        category: "wellness",
        categoryName: "Campus Wellness",
        subcategory: "Vision & Care",
        price: 1250,
        originalPrice: 1800,
        condition: "Brand New",
        badge: "Student Deal",
        rating: 4.7,
        reviewCount: 39,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80",
        additionalImages: [
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80"
        ],
        description: "Classic lightweight spectacles with anti-reflective blue light filtering lenses. Protects eyes against headaches and digital fatigue during prolonged screen time.",
        features: [
            "Blocks 90% of high-energy harmful blue light from monitors & phones",
            "Clear low-tint lenses without color distortion",
            "Flexible spring hinges fitting all face shapes comfortably",
            "Includes hard protective case and microfiber cleaning cloth"
        ],
        seller: {
            name: "Sarah M. (Student Seller)",
            program: "BSc Information Technology, Year 2",
            campusLocation: "Student Center / Hostels",
            verified: true
        },
        inStock: true,
        stockCount: 15,
        keywords: "glasses blue light spectacles eyewear screen fatigue study wellness"
    },
    {
        id: "wellness-03",
        name: "Latex Workout Resistance Loop Bands (Set of 5)",
        category: "wellness",
        categoryName: "Campus Wellness",
        subcategory: "Fitness Gear",
        price: 800,
        originalPrice: 1000,
        condition: "Brand New",
        badge: "Campus Essential",
        rating: 4.6,
        reviewCount: 28,
        image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&auto=format&fit=crop&q=80",
        additionalImages: [
            "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80"
        ],
        description: "Portable 5-level resistance band set for dorm room fitness, stretching, and physical therapy without needing bulky gym equipment.",
        features: [
            "5 color-coded resistance levels from X-Light (5 lbs) to X-Heavy (30 lbs)",
            "100% natural eco-friendly skin-safe Malaysian latex",
            "Compact mesh travel bag included for easy carry",
            "Includes illustrated student exercise workout guide"
        ],
        seller: {
            name: "Kevin N. (Student Seller)",
            program: "BSc Actuarial Science, Year 3",
            campusLocation: "Mathematics Building / Hall 1",
            verified: true
        },
        inStock: true,
        stockCount: 20,
        keywords: "resistance bands fitness workout gym exercise dorm wellness"
    }
];

// Helper functions for catalog queries
function getProductById(id) {
    return CAMPUS_PRODUCTS.find(product => product.id === id) || null;
}

function getProductsByCategory(category) {
    if (!category || category === "all") {
        return CAMPUS_PRODUCTS;
    }
    return CAMPUS_PRODUCTS.filter(product => product.category === category);
}

function getFeaturedProducts(limit = 6) {
    return CAMPUS_PRODUCTS.filter(p => p.badge !== null).slice(0, limit);
}

// Global window exposure for client-side scripts
if (typeof window !== "undefined") {
    window.CAMPUS_CATEGORIES = CAMPUS_CATEGORIES;
    window.CAMPUS_PRODUCTS = CAMPUS_PRODUCTS;
    window.getProductById = getProductById;
    window.getProductsByCategory = getProductsByCategory;
    window.getFeaturedProducts = getFeaturedProducts;
}

// CommonJS export for testing/node environments if needed
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        CAMPUS_CATEGORIES,
        CAMPUS_PRODUCTS,
        getProductById,
        getProductsByCategory,
        getFeaturedProducts
    };
}
