// API URL
const API_URL = 'http://localhost:3000/api';

// Cloudinary Configuration
const CLOUDINARY_CONFIG = {
    cloudName: 'dy6nbfwet', // Replace with your Cloudinary cloud name
    uploadPreset: 'Unsigned', // Replace with your upload preset
    apiUrl: 'https://api.cloudinary.com/v1_1'
};

// --- INISIALISASI PRODUK DARI LOCALSTORAGE ---
let products = [];
if (localStorage.getItem('base_products')) {
    try {
        products = JSON.parse(localStorage.getItem('base_products'));
    } catch (e) {
        products = [];
    }
} else {
    products = [
        {
            id: 1,
            name: "Smartphone X",
            price: 235.99,
            image: "https://via.placeholder.com/300x200",
            description: "Latest smartphone with amazing features"
        },
        {
            id: 2,
            name: "Laptop Pro",
            price: 1459.99,
            image: "https://via.placeholder.com/300x200",
            description: "Powerful laptop for professionals"
        },
        {
            id: 3,
            name: "Macbook",
            price: 3249.99,
            image: "https://via.placeholder.com/300x200",
            description: "Powerful laptop for professionals"
        },
        {
            id: 4,
            name: "Redmi Note 11",
            price: 1799.99,
            image: "https://via.placeholder.com/300x200",
            description: "Powerful laptop for professionals"
        },
        {
            id: 5,
            name: "Iphone 11",
            price: 14699.99,
            image: "https://via.placeholder.com/300x200",
            description: "Latest smartphone with amazing features"
        },
        {
            id: 6,
            name: "Lenovo LOQ ",
            price: 1399.00,
            image: "https://via.placeholder.com/300x200",
            description: "Powerful laptop for professionals"
        },
        {
            id: 7,
            name: "Laptop Pro",
            price: 1221.99,
            image: "https://via.placeholder.com/300x200",
            description: "Powerful laptop for professionals"
        },
        {
            id: 8,
            name: "Laptop Pro",
            price: 1314.99,
            image: "https://via.placeholder.com/300x200",
            description: "Powerful laptop for professionals"
        }
        // Add more products as needed
    ];
    localStorage.setItem('base_products', JSON.stringify(products));
}

// User authentication state
let currentUser = null;
let cart = [];

// DOM Elements
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const forgotPasswordModal = document.getElementById('forgotPasswordModal');
const changePasswordModal = document.getElementById('changePasswordModal');
const loginBtn = document.getElementById('loginBtn');
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const productsContainer = document.getElementById('productsContainer');
const searchInput = document.getElementById('searchInput');
const settingsModal = document.getElementById('settingsModal');
const settingsBtn = document.getElementById('settingsBtn');
const profileBtn = document.getElementById('profileBtn');
const themeToggle = document.getElementById('themeToggle');
const themeLabel = document.getElementById('themeLabel');
const logoutBtn = document.getElementById('logoutBtn');
const profileModal = document.getElementById('profileModal');
const openAdminPanelBtn = document.getElementById('openAdminPanelBtn');
const adminModal = document.getElementById('adminModal');
const adminProofList = document.getElementById('adminProofList');

// Kategori produk contoh (bisa disesuaikan dengan data produk asli)
const categories = ['electronics', 'fashion', 'home', 'beauty', 'sports'];

// Contact Us Modal Logic
const contactUsBtn = document.getElementById('contactUsBtn');
const contactUsModal = document.getElementById('contactUsModal');
const contactUsForm = document.getElementById('contactUsForm');
const contactUsMessage = document.getElementById('contactUsMessage');
const contactUsCloses = contactUsModal ? contactUsModal.querySelectorAll('.close') : [];

// Tambah: Modal Tambah Barang
const addProductBtn = document.getElementById('addProductBtn');
const addProductModal = document.getElementById('addProductModal');
const addProductForm = document.getElementById('addProductForm');
const addProductMessage = document.getElementById('addProductMessage');

// Tambah: Field alamat rumah di profil
const profileAddress = document.getElementById('profileAddress');

// Upload Bukti Transfer Modal
const uploadProofModal = document.getElementById('uploadProofModal');
const uploadProofForm = document.getElementById('uploadProofForm');
const uploadProofMessage = document.getElementById('uploadProofMessage');
const paymentInstructions = document.getElementById('paymentInstructions');
const proofImage = document.getElementById('proofImage');
const agreeTerms = document.getElementById('agreeTerms');

const translations = {
  en: {
    'ShopNow': 'ShopNow',
    'Search products...': 'Search products...',
    'Login': 'Login',
    'Profile': 'Profile',
    'Settings': 'Settings',
    'Contact Us': 'Contact Us',
    'Tambah Barang': 'Add Product',
    'Kategori': 'Category',
    'All': 'All',
    'Electronics': 'Electronics',
    'Fashion': 'Fashion',
    'Home': 'Home',
    'Beauty': 'Beauty',
    'Sports': 'Sports',
    // ...tambahkan string lain sesuai kebutuhan...
  },
  id: {
    'ShopNow': 'ShopNow',
    'Search products...': 'Cari produk...',
    'Login': 'Login',
    'Profile': 'Profil',
    'Settings': 'Pengaturan',
    'Contact Us': 'Hubungi Kami',
    'Tambah Barang': 'Tambah Barang',
    'Kategori': 'Kategori',
    'All': 'Semua',
    'Electronics': 'Elektronik',
    'Fashion': 'Fashion',
    'Home': 'Rumah',
    'Beauty': 'Kecantikan',
    'Sports': 'Olahraga',
    // ...tambahkan string lain sesuai kebutuhan...
  }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    if (!isLocalStorageAvailable()) {
        alert('Browser Anda tidak mendukung localStorage. Fitur login tidak akan berfungsi optimal.');
        return;
    }
    // --- AUTO-FIX: Pastikan semua produk admin punya field active: true jika belum ada ---
    let adminProducts = [];
    try { adminProducts = JSON.parse(localStorage.getItem('shopnow_products') || '[]'); } catch(e) {}
    let changed = false;
    adminProducts = adminProducts.map(p => {
        if (typeof p.active === 'undefined') { p.active = true; changed = true; }
        return p;
    });
    if (changed) {
        localStorage.setItem('shopnow_products', JSON.stringify(adminProducts));
    }
    loadProducts();
    if (logoutBtn) logoutBtn.style.display = 'none'; // Force hide logoutBtn on load
    updateCartCount();
    setupEventListeners();
    setupSettingsModal();
    initTheme();
    checkUserSession();
    // Inisialisasi EmailJS dengan Public Key (API Key) yang benar
    if (typeof emailjs !== 'undefined' && emailjs.init) {
        emailjs.init('C51Cno0ULggxH5zUN'); // Public Key (API Key) dari EmailJS
    }
    // Attach Contact Us form event listener
    if (contactUsForm) {
        contactUsForm.onsubmit = function(e) {
            e.preventDefault();
            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const message = document.getElementById('contactMessage').value.trim();
            const method = document.getElementById('contactMethod').value;
            const devWhatsApp = '6288296742178';
            // Validasi
            if (!name || !email || !message) {
                contactUsMessage.textContent = 'Semua field wajib diisi!';
                return;
            }
            if (method === 'email') {
                contactUsMessage.textContent = 'Mengirim pesan...';
                contactUsForm.querySelector('button[type="submit"]').disabled = true;
                emailjs.send('service_tf91q8i', 'template_dsjhi4p', {
                    from_name: name,
                    from_email: email,
                    message: message,
                    to_email: 'reyhanmegan6@gmail.com' // pastikan field ini sesuai dengan template EmailJS
                })
                .then(function(response) {
                    contactUsMessage.textContent = 'Pesan berhasil dikirim ke developer!';
                    contactUsForm.reset();
                    contactUsForm.querySelector('button[type="submit"]').disabled = false;
                }, function(error) {
                    contactUsMessage.textContent = 'Gagal mengirim pesan. Pastikan koneksi internet stabil dan EmailJS sudah benar.';
                    contactUsForm.querySelector('button[type="submit"]').disabled = false;
                });
            } else if (method === 'whatsapp') {
                window.open('https://wa.me/' + devWhatsApp + '?text=' + encodeURIComponent(message), '_blank');
            }
        };
    }

    // Hamburger menu logic
    var menuToggle = document.getElementById('menuToggle');
    var mainMenu = document.getElementById('mainMenu');
    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            mainMenu.classList.toggle('active');
        });
        document.addEventListener('click', function(e) {
            if (mainMenu.classList.contains('active') && !mainMenu.contains(e.target) && e.target !== menuToggle) {
                mainMenu.classList.remove('active');
            }
        });
    }

    // Dropdown kategori logic
    var categoryToggle = document.getElementById('categoryToggle');
    var categoryDropdown = document.getElementById('categoryDropdown');
    if (categoryToggle && categoryDropdown) {
        categoryToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            categoryDropdown.classList.toggle('open');
        });
        document.addEventListener('click', function(e) {
            if (categoryDropdown.classList.contains('open') && !categoryDropdown.contains(e.target)) {
                categoryDropdown.classList.remove('open');
            }
        });
    }

    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            setCurrentLanguage(this.value);
            applyTranslation();
        });
        languageSelect.value = getCurrentLanguage();
    }
    applyTranslation();
});

// Helper untuk key unik per user
function getCartKey() {
    return currentUser ? `cart_${currentUser.username}` : 'cart_guest';
}
function getWishlistKey() {
    return currentUser ? `wishlist_${currentUser.username}` : 'wishlist_guest';
}
function getOrdersKey() {
    return currentUser ? `orders_${currentUser.username}` : 'orders_guest';
}
function getCart() {
    const key = getCartKey();
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}
function setCart(cartArr) {
    localStorage.setItem(getCartKey(), JSON.stringify(cartArr));
}
function getWishlist() {
    const user = JSON.parse(localStorage.getItem('currentUser')) || currentUser;
    if (!user) return [];
    return JSON.parse(localStorage.getItem(`wishlist_${user.username}`) || '[]');
}
function setWishlist(wishlist) {
    localStorage.setItem(getWishlistKey(), JSON.stringify(wishlist));
}
function getOrders() {
    const key = getOrdersKey();
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}
function setOrders(orders) {
    localStorage.setItem(getOrdersKey(), JSON.stringify(orders));
}

async function checkUserSession() {
    if (!isLocalStorageAvailable()) return;
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        cart = getCart();
        updateCart();
        if (loginBtn) loginBtn.style.display = 'none';
        if (settingsBtn) settingsBtn.style.display = 'inline';
        if (profileBtn) profileBtn.style.display = 'inline';
        if (loginBtn) loginBtn.textContent = `Welcome, ${currentUser.username}`;
        if (logoutBtn) logoutBtn.style.display = 'block';
        loadProfileData();
    } else {
        currentUser = null;
        cart = getCart();
        updateCart();
        if (loginBtn) loginBtn.style.display = 'inline';
        if (settingsBtn) settingsBtn.style.display = 'none';
        if (profileBtn) profileBtn.style.display = 'none';
        if (loginBtn) loginBtn.textContent = 'Login';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
    updateAdminBtn && updateAdminBtn();
    checkInvoice && checkInvoice();
}

async function handleLogin(e) {
    e.preventDefault();
    if (!isLocalStorageAvailable()) {
        alert('localStorage tidak tersedia. Tidak bisa login.');
        return;
    }
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        // First try server login
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            currentUser = data.user;
            // Ambil cart dari server jika ada, jika tidak fallback ke localStorage
            let serverCart = Array.isArray(data.user.cart) ? data.user.cart : [];
            let localCart = JSON.parse(localStorage.getItem(`cart_${username}`) || '[]');
            // Pilih cart yang paling banyak isinya (asumsi paling update)
            cart = serverCart.length >= localCart.length ? serverCart : localCart;
            // Simpan ke localStorage agar persist
            localStorage.setItem(`cart_${username}`, JSON.stringify(cart));
            // Save user session
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            // Update UI
            loginModal.style.display = 'none';
            loginBtn.style.display = 'none';
            settingsBtn.style.display = 'inline';
            profileBtn.style.display = 'inline';
            loginBtn.textContent = `Welcome, ${currentUser.username}`;
            updateCart();
            // Load profile data including image
            loadProfileData();
            alert('Login successful!');
            return;
        }
        // If server login fails, try local storage login
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            // Restore user's cart if it exists
            let localCart = user.cart || JSON.parse(localStorage.getItem(`cart_${username}`) || '[]');
            cart = localCart;
            // Save current user
            currentUser = {
                ...user,
                cart: localCart
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            localStorage.setItem(`cart_${username}`, JSON.stringify(cart));
            // Update UI
            loginModal.style.display = 'none';
            loginBtn.style.display = 'none';
            settingsBtn.style.display = 'inline';
            profileBtn.style.display = 'inline';
            loginBtn.textContent = `Welcome, ${user.username}`;
            updateCart();
            // Load profile data including image
            loadProfileData();
            alert('Login successful!');
        } else {
            alert('Invalid credentials!');
        }
    } catch (error) {
        console.error('Login error:', error);
        // If server is not available, try local storage login
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            let localCart = user.cart || JSON.parse(localStorage.getItem(`cart_${username}`) || '[]');
            cart = localCart;
            currentUser = {
                ...user,
                cart: localCart
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            localStorage.setItem(`cart_${username}`, JSON.stringify(cart));
            loginModal.style.display = 'none';
            loginBtn.style.display = 'none';
            settingsBtn.style.display = 'inline';
            profileBtn.style.display = 'inline';
            loginBtn.textContent = `Welcome, ${user.username}`;
            updateCart();
            alert('Login successful!');
        } else {
            alert('Invalid credentials!');
        }
    }
}

async function handleLogout() {
    if (!isLocalStorageAvailable()) return;
    if (currentUser) {
        try {
            // Save cart to server before logout
            await fetch(`${API_URL}/update-cart`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: currentUser.username,
                    cart: cart
                })
            });
        } catch (error) {
            console.error('Error saving cart:', error);
        }
        
        // Force save cart to localStorage before logout
        localStorage.setItem(`cart_${currentUser.username}`, JSON.stringify(cart));
    }

    currentUser = null;
    localStorage.removeItem('currentUser');
    cart = getCart(); // guest cart
    updateCart();
    if (loginBtn) loginBtn.style.display = 'inline';
    if (settingsBtn) settingsBtn.style.display = 'none';
    if (profileBtn) profileBtn.style.display = 'none';
    if (loginBtn) loginBtn.textContent = 'Login';
    if (settingsModal) settingsModal.style.display = 'none';
    if (profileModal) profileModal.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none';
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    alert('Logged out successfully!');
}

async function saveUserData(userData) {
    if (!userData || !userData.username) return;
    // Update currentUser di localStorage
    localStorage.setItem('currentUser', JSON.stringify(userData));
    // Update array users di localStorage
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const idx = users.findIndex(u => u.username === userData.username);
    if (idx !== -1) {
        users[idx] = { ...users[idx], ...userData, cart: userData.cart || [] };
    } else {
        users.push({ ...userData, cart: userData.cart || [] });
    }
    localStorage.setItem('users', JSON.stringify(users));
    // Simpan cart juga ke cart_{username}
    if (userData.cart) {
        localStorage.setItem(`cart_${userData.username}`, JSON.stringify(userData.cart));
    }
}

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.checked = savedTheme === 'dark';
    updateThemeLabel(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeLabel(newTheme);
}

function updateThemeLabel(theme) {
    themeLabel.textContent = theme === 'light' ? 'Light Mode' : 'Dark Mode';
}

// Settings Modal Management
function setupSettingsModal() {
    settingsBtn.addEventListener('click', () => {
        settingsModal.style.display = 'block';
        // Tampilkan/hidden tombol logout sesuai status login
        if (currentUser) {
            logoutBtn.style.display = 'block';
            // Tampilkan admin panel button jika admin
            if (openAdminPanelBtn && currentUser.username === 'admin') {
                openAdminPanelBtn.style.display = 'block';
            }
            // Tampilkan email verification section jika login
            const emailVerificationSection = document.getElementById('emailVerificationSection');
            if (emailVerificationSection) emailVerificationSection.style.display = '';
        } else {
            logoutBtn.style.display = 'none';
            // Sembunyikan admin panel button
            if (openAdminPanelBtn) openAdminPanelBtn.style.display = 'none';
            // Sembunyikan email verification section
            const emailVerificationSection = document.getElementById('emailVerificationSection');
            if (emailVerificationSection) emailVerificationSection.style.display = 'none';
        }
    });

    themeToggle.addEventListener('change', toggleTheme);
    logoutBtn.addEventListener('click', handleLogout);

    // Close modal when clicking the X
    settingsModal.querySelector('.close').addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });
}

// Remove all change password related functions
function handleChangePassword(e) {
    e.preventDefault();
}

function setupPasswordChange() {
    // Function removed
}

// Product Functions
function loadProducts() {
    const allProducts = getAllProducts();
    console.log('loadProducts() dipanggil, hasil getAllProducts:', allProducts);
    if (!productsContainer) {
        console.error('productsContainer tidak ditemukan!');
        return;
    }
    productsContainer.innerHTML = allProducts.map(product => {
        // Fallback untuk field penting
        const id = product.id || Math.random();
        const name = product.name || 'Tanpa Nama';
        const price = product.price !== undefined ? product.price : 0;
        const stock = product.stock !== undefined ? product.stock : 'N/A';
        const weight = product.weight !== undefined ? product.weight : 'N/A';
        const sellerAddress = product.sellerAddress || 'N/A';
        const description = product.description || '';
        const image = product.image || 'https://via.placeholder.com/300x200';
        const category = product.category || '-';
        const payments = product.payments ? Object.entries(product.payments).filter(([key, val]) => val).map(([key]) => `<span class='payment-badge'>${key}</span>`).join(' ') : 'N/A';
        return `
            <div class="product-card">
                <img src="${image}" alt="${name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${name}</h3>
                    <p class="product-price">Rp${Number(price).toLocaleString()}</p>
                    <p class="product-category">Kategori: ${category}</p>
                    <p class="product-stock">Stok: ${stock}</p>
                    <p class="product-weight">Berat: ${weight} gram</p>
                    <p class="product-seller">Alamat Penjual: ${sellerAddress}</p>
                    <p class="product-description">${description}</p>
                    <div class="product-payments">
                        <span>Metode Pembayaran: </span>
                        ${payments}
                    </div>
                    <button class="add-to-cart" onclick="addToCart(${id})">Add to Cart</button>
                </div>
            </div>
        `;
    }).join('');
}

function searchProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredProducts = getAllProducts().filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    productsContainer.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Cart Functions
function addToCart(productId) {
    if (!currentUser) {
        alert('Please login to add items to cart');
        return;
    }
    const product = getAllProducts().find(p => p.id === productId);
    if (!product) {
        alert('Produk tidak ditemukan!');
        return;
    }
    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            productId,
            quantity: 1,
            name: product.name,
            price: product.price,
            image: product.image
        });
    }
    if (currentUser) {
        currentUser.cart = cart;
        saveUserData(currentUser);
    }
    updateCart();
    alert('Product added to cart!');
}

// Backup otomatis cart ke server jika user login
async function backupCartToServer() {
    if (!currentUser) return;
    try {
        await fetch(`${API_URL}/update-cart`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: currentUser.username,
                cart: cart
            })
        });
    } catch (err) {
        console.error('Gagal backup cart ke server:', err);
    }
}

// Modifikasi updateCart agar selalu backup otomatis
function updateCart() {
    setCart(cart);
    updateCartCount();
    updateCartDisplay();
    if (currentUser) {
        currentUser.cart = cart;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem(`cart_${currentUser.username}`, JSON.stringify(cart));
        saveUserData(currentUser);
        backupCartToServer();
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty">Keranjang kosong. <br> Tambahkan produk ke keranjang.</div>';
        cartTotal.textContent = 'Rp0';
        return;
    }
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-qty-row">
                    <button class="cart-qty-btn" onclick="changeCartQty(${item.productId}, -1)">-</button>
                    <span class="cart-qty">${item.quantity}</span>
                    <button class="cart-qty-btn" onclick="changeCartQty(${item.productId}, 1)">+</button>
                </div>
                <p class="cart-item-price">Rp${Number(item.price).toLocaleString()} x ${item.quantity} = <b>Rp${Number(item.price * item.quantity).toLocaleString()}</b></p>
                <button class="cart-remove-btn" onclick="removeFromCart(${item.productId})">Hapus</button>
            </div>
        </div>
    `).join('');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = 'Rp' + total.toLocaleString();
}

function changeCartQty(productId, delta) {
    const item = cart.find(i => i.productId === productId);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    updateCart();
}

function toggleCart() {
    cartSidebar.classList.toggle('active');
    if (cartSidebar.classList.contains('active')) {
        updateCartDisplay();
    }
}

// --- Promo Code Functions ---
function validatePromo(code, total) {
    // Sample promo codes (in real app, this would come from backend)
    const promoCodes = [
        { code: 'WELCOME10', discount: 10, minPurchase: 100000, type: 'percentage' },
        { code: 'DISKON50K', discount: 50000, minPurchase: 200000, type: 'fixed' },
        { code: 'HEMAT25', discount: 25, minPurchase: 150000, type: 'percentage' }
    ];
    
    const promo = promoCodes.find(p => p.code.toUpperCase() === code.toUpperCase());
    if (!promo) {
        return { valid: false, message: 'Kode promo tidak valid!' };
    }
    
    if (total < promo.minPurchase) {
        return { valid: false, message: `Minimal pembelian Rp${promo.minPurchase.toLocaleString()} untuk kode ini!` };
    }
    
    return { valid: true, promo };
}

function applyPromo(promo, total) {
    if (promo.type === 'percentage') {
        return (total * promo.discount) / 100;
    } else {
        return Math.min(promo.discount, total);
    }
}

// --- Checkout Modal Logic ---
window.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    const checkoutModal = document.getElementById('checkoutModal');
    const checkoutForm = document.getElementById('checkoutForm');
    const checkoutAddress = document.getElementById('checkoutAddress');
    const checkoutPayment = document.getElementById('checkoutPayment');
    const checkoutTotal = document.getElementById('checkoutTotal');
    const checkoutDiscount = document.getElementById('checkoutDiscount');
    const checkoutPromo = document.getElementById('checkoutPromo');
    const checkoutMessage = document.getElementById('checkoutMessage');
    const closeBtns = checkoutModal ? checkoutModal.querySelectorAll('.close') : [];
    let appliedPromo = null;
    if (checkoutBtn && checkoutModal && checkoutForm) {
        checkoutBtn.onclick = function() {
            if (!currentUser) {
                alert('Silakan login untuk checkout!');
                return;
            }
            if (!cart || cart.length === 0) {
                alert('Keranjang belanja kosong!');
                return;
            }
            checkoutAddress.value = currentUser.address || '';
            const settings = JSON.parse(localStorage.getItem('shopnow_settings') || '{}');
            const payments = (settings.paymentMethods || []).filter(m => m.active);
            checkoutPayment.innerHTML = payments.length ? payments.map(m => `<option value="${m.bank}">${m.bank} (${m.number})</option>`).join('') : '<option value="">Tidak ada metode pembayaran</option>';
            const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
            checkoutTotal.textContent = 'Rp' + total.toLocaleString();
            checkoutDiscount.textContent = '';
            checkoutPromo.value = '';
            appliedPromo = null;
            checkoutModal.style.display = 'block';
            checkoutMessage.textContent = '';
        };
        closeBtns.forEach(btn => btn.onclick = () => { checkoutModal.style.display = 'none'; });
        // Promo code validation on blur
        if (checkoutPromo) {
            checkoutPromo.onblur = function() {
                const code = checkoutPromo.value.trim();
                const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
                if (!code) {
                    checkoutDiscount.textContent = '';
                    appliedPromo = null;
                    return;
                }
                const result = validatePromo(code, total);
                if (result.valid) {
                    const discount = applyPromo(result.promo, total);
                    checkoutDiscount.textContent = `Diskon: -Rp${discount.toLocaleString()} (${result.promo.code})`;
                    appliedPromo = { ...result.promo, discount };
                } else {
                    checkoutDiscount.textContent = result.message;
                    appliedPromo = null;
                }
            };
        }
        // Submit checkout
        checkoutForm.onsubmit = function(e) {
            e.preventDefault();
            if (!checkoutAddress.value.trim()) {
                checkoutMessage.textContent = 'Alamat pengiriman wajib diisi!';
                return;
            }
            if (!checkoutPayment.value) {
                checkoutMessage.textContent = 'Pilih metode pembayaran!';
                return;
            }
            const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
            let discount = 0;
            let promoCode = '';
            if (appliedPromo) {
                discount = appliedPromo.discount;
                promoCode = appliedPromo.code;
            }
            const finalTotal = Math.max(0, total - discount);
            let invoices = JSON.parse(localStorage.getItem('shopnow_invoices') || '[]');
            const invoiceId = 'INV' + Date.now();
            const invoice = {
                id: invoiceId,
                username: currentUser.username,
                address: checkoutAddress.value.trim(),
                paymentMethod: checkoutPayment.value,
                total: finalTotal,
                discount,
                promoCode,
                status: 'Belum Bayar',
                time: new Date().toLocaleString(),
                items: cart.map(item => ({...item}))
            };
            invoices.push(invoice);
            localStorage.setItem('shopnow_invoices', JSON.stringify(invoices));
            cart = [];
            updateCart();
            checkoutModal.style.display = 'none';
            
            // Tambahkan notifikasi checkout berhasil
            addNotification('checkout', `Checkout berhasil! Invoice #${invoiceId} telah dibuat. Silakan lakukan pembayaran.`, { invoiceId: invoiceId, status: 'Belum Bayar' });
            
            showPaymentInstructions([{bank: invoice.paymentMethod}], finalTotal, invoiceId);
            if (uploadProofModal) uploadProofModal.style.display = 'block';
        };
    }
});
// --- Ubah showPaymentInstructions agar bisa menerima invoiceId dan nomor rekening dari pengaturan toko ---
function showPaymentInstructions(paymentList, total, invoiceId) {
    // Ambil nomor rekening dari pengaturan toko
    const settings = JSON.parse(localStorage.getItem('shopnow_settings') || '{}');
    let rekeningInfo = '';
    paymentList.forEach(obj => {
        const bank = typeof obj === 'string' ? obj : obj.bank;
        const m = (settings.paymentMethods || []).find(x => x.bank === bank);
        if (m && m.active && m.number) {
            rekeningInfo += `<li>${bank}: <strong>${m.number}</strong></li>`;
        }
    });
    if (!rekeningInfo) rekeningInfo = '<li>Tidak ada rekening penjual yang tersedia.</li>';
    paymentInstructions.innerHTML = `
        <p><strong>Instruksi Pembayaran:</strong></p>
        <ul>${rekeningInfo}</ul>
        <p><strong>Total yang harus ditransfer: Rp${Number(total).toLocaleString()}</strong></p>
        <p><strong>ID Invoice:</strong> ${invoiceId || '-'}</p>
        <p>Setelah transfer, upload bukti transfer di bawah ini.</p>
    `;
}

// Remove Gmail Authentication Functions
function initGmailAuth() {
    const settingsGmailAuthBtn = document.getElementById('settingsGmailAuthBtn');

    if (settingsGmailAuthBtn) {
        settingsGmailAuthBtn.addEventListener('click', () => handleGmailAuth('settings'));
    }
}

async function handleGmailAuth(type) {
    try {
        const email = currentUser.email;

        if (!email) {
            showMessage(
                document.getElementById('settingsPasswordMessage'),
                'Please enter your email address first',
                'error'
            );
            return;
        }

        // Validate Gmail domain
        if (!email.endsWith('@gmail.com')) {
            showMessage(
                document.getElementById('settingsPasswordMessage'),
                'Please use a Gmail account',
                'error'
            );
            return;
        }

        // Simulate Gmail authentication
        const authResult = await simulateGmailAuth(email);
        
        if (authResult.success) {
            document.getElementById('settingsVerificationCodeGroup').style.display = 'block';

            // Store verification data
            const verificationData = {
                code: authResult.code,
                email: email,
                timestamp: new Date().getTime()
            };
            localStorage.setItem('gmailVerification', JSON.stringify(verificationData));

            showMessage(
                document.getElementById('settingsPasswordMessage'),
                'Verification code has been sent to your Gmail',
                'success'
            );
        } else {
            throw new Error(authResult.message);
        }
    } catch (error) {
        showMessage(
            document.getElementById('settingsPasswordMessage'),
            error.message || 'Gmail authentication failed',
            'error'
        );
    }
}

async function simulateGmailAuth(email) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In a real application, this would send the code to the user's Gmail
    console.log(`Verification code ${code} would be sent to ${email}`);
    alert(`Verification code: ${code}\n\nThis would be sent to your Gmail in a real application.`);
    
    return { success: true, code };
}

// Profile Functions
function loadProfileData() {
    try {
        const user = JSON.parse(localStorage.getItem('currentUser')) || currentUser;
        if (user) {
            document.getElementById('profileUsername').textContent = user.username;
            document.getElementById('profilePhone').value = user.phone || '';
            document.getElementById('profileEmail').value = user.email || '';
            document.getElementById('profileGender').value = user.gender || '';
            document.getElementById('profileBirthDate').value = user.birthDate || '';
            document.getElementById('profileAddress').value = user.address || '';
            
            // Load profile image with multiple fallbacks
            const profileImage = document.getElementById('profileImage');
            let imageUrl = null;
            
            // Try to get image from multiple sources
            if (user.profileImage && user.profileImage !== 'https://via.placeholder.com/150') {
                imageUrl = user.profileImage;
            } else {
                // Try backup from localStorage
                const backupImage = localStorage.getItem(`profileImage_${user.username}`);
                if (backupImage) {
                    imageUrl = backupImage;
                    // Update user object with backup image
                    user.profileImage = backupImage;
                    currentUser = user;
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
            }
            
            // Set the image
            if (imageUrl) {
                profileImage.src = imageUrl;
            } else {
                profileImage.src = 'https://via.placeholder.com/150';
            }
        }
    } catch (error) {
        console.error('Error loading profile data:', error);
        showMessage(document.getElementById('profileMessage'), 'Error loading profile data', 'error');
    }
}

async function handleImageUpload(e) {
    console.log('[DEBUG] handleImageUpload called');
    try {
        const file = e.target.files[0];
        console.log('[DEBUG] File selected:', file);
        
        if (file) {
            // Validate file type
            if (!file.type.match('image/(jpeg|png|jpg|webp)')) {
                console.log('[DEBUG] Invalid file type:', file.type);
                showMessage(document.getElementById('profileMessage'), 'Please select a JPG, PNG, or WebP image file', 'error');
                return;
            }
            // Validate file size (max 10MB for profile)
            if (file.size > 10 * 1024 * 1024) {
                console.log('[DEBUG] File too large:', file.size);
                showMessage(document.getElementById('profileMessage'), 'Image size should be less than 10MB', 'error');
                return;
            }

            console.log('[DEBUG] File validation passed, starting upload...');

            // Show upload progress
            const messageElement = document.getElementById('profileMessage');
            messageElement.textContent = 'Uploading profile image...';
            messageElement.className = 'message info';
            messageElement.style.display = 'block';

            // Upload to Cloudinary
            console.log('[DEBUG] Calling uploadToCloudinary...');
            const cloudinaryUrl = await uploadToCloudinary(file);
            console.log('[DEBUG] Cloudinary URL received:', cloudinaryUrl);
            
            // Update user data with new image URL
            const user = JSON.parse(localStorage.getItem('currentUser')) || currentUser;
            console.log('[DEBUG] Current user:', user);
            
            if (user) {
                const updatedUser = {
                    ...user,
                    profileImage: cloudinaryUrl,
                    lastUpdated: new Date().toISOString()
                };
                
                // Update global currentUser variable
                currentUser = updatedUser;
                
                // Save to both currentUser and users array
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                
                // Update users array
                let users = JSON.parse(localStorage.getItem('users')) || [];
                const idx = users.findIndex(u => u.username === updatedUser.username);
                if (idx !== -1) {
                    users[idx] = { ...users[idx], ...updatedUser };
                } else {
                    users.push(updatedUser);
                }
                localStorage.setItem('users', JSON.stringify(users));
                
                // Backup profile image URL separately for redundancy
                localStorage.setItem(`profileImage_${user.username}`, cloudinaryUrl);
                
                // Update the image display
                document.getElementById('profileImage').src = cloudinaryUrl;
                showMessage(messageElement, 'Profile image updated successfully!', 'success');
                console.log('[DEBUG] Profile image updated successfully');
                
                // Force save user data
                saveUserData(updatedUser);
            } else {
                console.log('[DEBUG] No user found');
                showMessage(messageElement, 'User not found. Please login again.', 'error');
            }
        }
    } catch (error) {
        console.error('[DEBUG] Error uploading profile image:', error);
        showMessage(document.getElementById('profileMessage'), 'Error uploading image. Please try again.', 'error');
    }
}

function handleProfileUpdate(e) {
    e.preventDefault();
    const messageElement = document.getElementById('profileMessage');
    try {
        const user = JSON.parse(localStorage.getItem('currentUser')) || currentUser;
        if (!user) {
            throw new Error('User not found');
        }
        // Get form values
        const phone = document.getElementById('profilePhone').value;
        const email = document.getElementById('profileEmail').value;
        const gender = document.getElementById('profileGender').value;
        const birthDate = document.getElementById('profileBirthDate').value;
        const address = document.getElementById('profileAddress').value;
        // Validate email
        if (email && !isValidEmail(email)) {
            showMessage(messageElement, 'Please enter a valid email address', 'error');
            return;
        }
        // Validate phone
        if (phone && !isValidPhone(phone)) {
            showMessage(messageElement, 'Please enter a valid phone number', 'error');
            return;
        }
        // Update user data
        const updatedUser = {
            ...user,
            phone,
            email,
            gender,
            birthDate,
            address,
            profileImage: user.profileImage || 'https://via.placeholder.com/150',
            cart: user.cart || [],
            lastUpdated: new Date().toISOString()
        };
        // Save updated data to localStorage (selalu update users array juga)
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        let users = JSON.parse(localStorage.getItem('users')) || [];
        const idx = users.findIndex(u => u.username === updatedUser.username);
        if (idx !== -1) {
            users[idx] = { ...users[idx], ...updatedUser };
        } else {
            users.push(updatedUser);
        }
        localStorage.setItem('users', JSON.stringify(users));
        messageElement.style.display = 'block';
        messageElement.className = 'message-animation success';
        messageElement.innerHTML = `
            <i class="fas fa-check-circle"></i>
            Profile updated successfully!
        `;
        setTimeout(() => {
            messageElement.style.opacity = '0';
            setTimeout(() => {
                messageElement.style.display = 'none';
                messageElement.style.opacity = '1';
            }, 300);
        }, 3000);
    } catch (error) {
        console.error('Profile update error:', error);
        messageElement.style.display = 'block';
        messageElement.className = 'message-animation error';
        messageElement.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            Error updating profile. Please try again.
        `;
    }
}

function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(u => u.username === username)) {
        alert('Username already exists!');
        return;
    }

    const newUser = {
        username,
        email,
        password,
        phone: '',
        gender: '',
        birthDate: '',
        profileImage: 'https://via.placeholder.com/150',
        lastUpdated: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    registerModal.style.display = 'none';
    alert('Registration successful! Please login.');
}

// Validation Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
}

// Helper function for showing messages
function showMessage(element, message, type) {
    if (!element) return;
    
    element.textContent = message;
    element.className = `message ${type}`;
    element.style.display = 'block';
    
    // Add animation class
    element.classList.add('message-animation');
    
    // Remove animation class after animation ends
    element.addEventListener('animationend', () => {
        element.classList.remove('message-animation');
    }, { once: true });
}

// Add event listener for page unload
window.addEventListener('beforeunload', () => {
    // Save any pending changes
    if (currentUser) {
        saveUserData(currentUser);
        // Force save cart to localStorage before page unload
        localStorage.setItem(`cart_${currentUser.username}`, JSON.stringify(cart));
    }
    if (cart.length > 0) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
});

// Add event listener for page visibility change (mobile browsers)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        // Save cart when page becomes hidden (user switches tabs or closes app)
        if (currentUser) {
            localStorage.setItem(`cart_${currentUser.username}`, JSON.stringify(cart));
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
        if (cart.length > 0) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }
});

function setupEventListeners() {
    // Login/Register Modal Events
    loginBtn.addEventListener('click', () => loginModal.style.display = 'block');
    document.getElementById('registerLink').addEventListener('click', () => {
        loginModal.style.display = 'none';
        registerModal.style.display = 'block';
    });
    document.getElementById('forgotPasswordLink').addEventListener('click', () => {
        loginModal.style.display = 'none';
        forgotPasswordModal.style.display = 'block';
    });

    // Profile Button Event
    profileBtn.addEventListener('click', () => {
        loadProfileData();
        profileModal.style.display = 'block';
    });

    // Profile form submit
    document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);
    
    // Profile image upload
    document.getElementById('imageUpload').addEventListener('change', handleImageUpload);

    // Close modal when clicking the X
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            // Cari parent modal terdekat dan tutup
            let modal = closeBtn.closest('.modal');
            if (modal) modal.style.display = 'none';
        });
    });

    // Form Submit Events
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('forgotPasswordForm').addEventListener('submit', handleForgotPassword);
    document.getElementById('changePasswordForm').addEventListener('submit', handleChangePassword);

    // Cart Events
    cartBtn.addEventListener('click', toggleCart);

    // Setup forgot password functionality
    setupForgotPassword();

    // Contact Us Modal Logic
    if (contactUsBtn && contactUsModal) {
        contactUsBtn.onclick = function(e) {
            e.preventDefault();
            contactUsModal.style.display = 'block';
            contactUsMessage.textContent = '';
        };
        contactUsCloses.forEach(closeBtn => {
            closeBtn.onclick = function() {
                contactUsModal.style.display = 'none';
            };
        });
        window.addEventListener('click', function(event) {
            if (event.target === contactUsModal) {
                contactUsModal.style.display = 'none';
            }
        });
    }

    // Tambah: Event Listener untuk tombol Tambah Barang
    if (addProductBtn && addProductModal) {
        addProductBtn.addEventListener('click', function(e) {
            e.preventDefault();
            addProductModal.style.display = 'block';
        });
    }
    // Tambah: Event Listener untuk close modal Tambah Barang
    if (addProductModal) {
        const closeBtn = addProductModal.querySelector('.close');
        if (closeBtn) {
            closeBtn.onclick = function() {
                addProductModal.style.display = 'none';
                addProductForm.reset();
                addProductMessage.textContent = '';
            };
        }
    }
    // Tambah: Event Listener submit form Tambah Barang
    if (addProductForm) {
        addProductForm.onsubmit = function(e) {
            e.preventDefault();
            // Ambil data dari form
            const name = document.getElementById('productName').value.trim();
            const stock = parseInt(document.getElementById('productStock').value);
            const price = parseFloat(document.getElementById('productPrice').value);
            const description = document.getElementById('productDescription').value.trim();
            const weight = parseInt(document.getElementById('productWeight').value);
            const sellerAddress = document.getElementById('sellerAddress').value.trim();
            // Metode pembayaran dan rekening
            const payments = {
                BCA: document.getElementById('payBCA').checked,
                Mandiri: document.getElementById('payMandiri').checked,
                BNI: document.getElementById('payBNI').checked,
                BRI: document.getElementById('payBRI').checked,
                BSI: document.getElementById('payBSI').checked,
                DKI: document.getElementById('payDKI').checked
            };
            const rekenings = {
                BCA: document.getElementById('rekBCA').value.trim(),
                Mandiri: document.getElementById('rekMandiri').value.trim(),
                BNI: document.getElementById('rekBNI').value.trim(),
                BRI: document.getElementById('rekBRI').value.trim(),
                BSI: document.getElementById('rekBSI').value.trim(),
                DKI: document.getElementById('rekDKI').value.trim()
            };
            // Validasi sederhana
            if (!name || isNaN(stock) || isNaN(price) || !description || isNaN(weight) || !sellerAddress) {
                addProductMessage.textContent = 'Semua field wajib diisi!';
                return;
            }
            // Jika bank diaktifkan, nomor rekening wajib diisi
            for (const bank in payments) {
                if (payments[bank] && !rekenings[bank]) {
                    addProductMessage.textContent = 'Nomor rekening ' + bank + ' wajib diisi jika diaktifkan!';
                    return;
                }
            }
            // Ambil produk admin dari localStorage
            let adminProducts = JSON.parse(localStorage.getItem('shopnow_products') || '[]');
            // Buat id unik (max id + 1)
            const maxId = Math.max(
                ...products.map(p => p.id),
                ...adminProducts.map(p => p.id),
                0
            );
            const newProduct = {
                id: maxId + 1,
                name,
                stock,
                price,
                description,
                weight,
                sellerAddress,
                payments,
                rekenings,
                image: 'https://via.placeholder.com/300x200'
            };
            adminProducts.push(newProduct);
            localStorage.setItem('shopnow_products', JSON.stringify(adminProducts));
            loadProducts();
            addProductMessage.textContent = 'Barang berhasil ditambahkan!';
            setTimeout(() => {
                addProductModal.style.display = 'none';
                addProductForm.reset();
                addProductMessage.textContent = '';
                // Reset input rekening visibility
                ['BCA','Mandiri','BNI','BRI','BSI','DKI'].forEach(function(bank){
                    document.getElementById('rek'+bank).style.display = document.getElementById('pay'+bank).checked ? 'block' : 'none';
                });
            }, 1000);
        };
    }
    // Simpan alamat rumah pembeli saat update profil
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            // ... existing code ...
            // Simpan alamat rumah ke localStorage (atau ke currentUser jika ada sistem user)
            if (profileAddress) {
                const address = profileAddress.value.trim();
                if (currentUser) {
                    currentUser.address = address;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                } else {
                    localStorage.setItem('guestAddress', address);
                }
            }
        }, true);
    }

    // Tambah: Event Listener untuk tombol close-cart-btn
    const closeCartBtn = document.getElementById('closeCartBtn');
    if (closeCartBtn && cartSidebar) {
        closeCartBtn.addEventListener('click', function() {
            cartSidebar.classList.remove('active');
        });
    }
}

// Forgot Password Functions
function setupForgotPassword() {
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const resetPasswordForm = document.getElementById('resetPasswordForm');

    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'none';
        forgotPasswordModal.style.display = 'block';
    });

    forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    resetPasswordForm.addEventListener('submit', handleResetPassword);
}

function handleForgotPassword(e) {
    e.preventDefault();
    const messageElement = document.getElementById('forgotPasswordMessage');
    const email = document.getElementById('forgotEmail').value;

    try {
        // Find user by email
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email);

        if (!user) {
            showMessage(messageElement, 'No account found with this email address', 'error');
            return;
        }

        // Generate verification code
        const verificationCode = generateVerificationCode();
        
        // Store verification data temporarily
        const verificationData = {
            code: verificationCode,
            email: email,
            timestamp: new Date().getTime()
        };
        localStorage.setItem('passwordResetVerification', JSON.stringify(verificationData));

        // Send verification email
        sendVerificationEmail(email, verificationCode);

        // Show reset password modal
        document.getElementById('forgotPasswordModal').style.display = 'none';
        document.getElementById('resetPasswordModal').style.display = 'block';
        
        showMessage(messageElement, 'Verification code has been sent to your email', 'info');

    } catch (error) {
        console.error('Forgot password error:', error);
        showMessage(messageElement, 'Error processing request. Please try again.', 'error');
    }
}

function handleResetPassword(e) {
    e.preventDefault();
    const messageElement = document.getElementById('resetPasswordMessage');
    
    try {
        const resetCode = document.getElementById('resetCode').value;
        const newPassword = document.getElementById('newResetPassword').value;
        const confirmPassword = document.getElementById('confirmResetPassword').value;
        
        const verificationData = JSON.parse(localStorage.getItem('passwordResetVerification'));

        if (!verificationData) {
            showMessage(messageElement, 'Reset session expired. Please try again.', 'error');
            return;
        }

        // Check if verification code is expired (15 minutes)
        if (new Date().getTime() - verificationData.timestamp > 15 * 60 * 1000) {
            localStorage.removeItem('passwordResetVerification');
            showMessage(messageElement, 'Verification code has expired. Please request a new one.', 'error');
            return;
        }

        if (resetCode !== verificationData.code) {
            showMessage(messageElement, 'Invalid verification code', 'error');
            return;
        }

        // Validate new password
        if (newPassword.length < 8) {
            showMessage(messageElement, 'Password must be at least 8 characters long', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            showMessage(messageElement, 'Passwords do not match', 'error');
            return;
        }

        // Update password
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.email === verificationData.email);
        
        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            localStorage.setItem('users', JSON.stringify(users));
            
            // Clear verification data
            localStorage.removeItem('passwordResetVerification');
            
            // Show success message and close modal
            showMessage(messageElement, 'Password has been reset successfully!', 'success');
            
            // Clear forms
            document.getElementById('forgotPasswordForm').reset();
            document.getElementById('resetPasswordForm').reset();
            
            // Close modal after 2 seconds
            setTimeout(() => {
                document.getElementById('resetPasswordModal').style.display = 'none';
                loginModal.style.display = 'block';
            }, 2000);
        }

    } catch (error) {
        console.error('Reset password error:', error);
        showMessage(messageElement, 'Error resetting password. Please try again.', 'error');
    }
}

function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function sendVerificationEmail(email, code) {
    // Simulasi kirim email
    alert(`Verification code: ${code}\n\nThis would be sent to your email in a real application.`);
}

function filterCategory(category) {
    const products = document.querySelectorAll('.product-card');
    if (category === 'all') {
        products.forEach(p => p.style.display = '');
    } else {
        products.forEach(p => {
            if (p.dataset.category === category) {
                p.style.display = '';
            } else {
                p.style.display = 'none';
            }
        });
    }
    // Highlight active category
    document.querySelectorAll('.category-menu a').forEach(a => a.classList.remove('active'));
    const activeLink = Array.from(document.querySelectorAll('.category-menu a')).find(a => a.textContent.toLowerCase() === (category === 'all' ? 'all' : category));
    if (activeLink) activeLink.classList.add('active');
}

// Update tombol admin di dalam settings modal
function updateAdminBtn() {
    if (currentUser && currentUser.username === 'admin') {
        if (openAdminPanelBtn) openAdminPanelBtn.style.display = 'block';
    } else {
        if (openAdminPanelBtn) openAdminPanelBtn.style.display = 'none';
    }
}

// Event listener tombol admin panel di settings
if (openAdminPanelBtn && adminModal) {
    openAdminPanelBtn.onclick = function(e) {
        e.preventDefault();
        showAdminProofList();
        adminModal.style.display = 'block';
    };
}

// Tampilkan daftar bukti transfer di admin panel
function showAdminProofList() {
    let proofs = JSON.parse(localStorage.getItem('proofs') || '[]');
    if (proofs.length === 0) {
        adminProofList.innerHTML = '<p>Tidak ada bukti transfer.</p>';
        return;
    }
    adminProofList.innerHTML = proofs.map(proof => `
        <div class="admin-proof-item" style="border:1px solid #ccc;padding:10px;margin-bottom:10px;">
            <p><strong>User:</strong> ${proof.username}</p>
            <p><strong>Waktu:</strong> ${proof.time}</p>
            <p><strong>Status:</strong> <span id="status-${proof.id}">${proof.status}</span></p>
            <p><strong>Catatan:</strong> ${proof.note || '-'}</p>
            <img src="${proof.image}" alt="Bukti Transfer" style="max-width:200px;display:block;margin-bottom:10px;">
            <button onclick="acceptProof(${proof.id})" ${proof.status === 'Diterima' ? 'disabled' : ''}>Terima</button>
        </div>
    `).join('');
}

// Fungsi untuk menerima bukti transfer (verifikasi)
window.acceptProof = function(id) {
    let proofs = JSON.parse(localStorage.getItem('proofs') || '[]');
    const idx = proofs.findIndex(p => p.id === id);
    if (idx !== -1 && proofs[idx].status !== 'Diterima') {
        proofs[idx].status = 'Diterima';
        localStorage.setItem('proofs', JSON.stringify(proofs));
        document.getElementById('status-' + id).textContent = 'Diterima';
        // Update invoice user
        let invoices = JSON.parse(localStorage.getItem('shopnow_invoices') || '[]');
        const invIdx = invoices.findIndex(inv => inv.id === proofs[idx].invoiceId);
        if (invIdx !== -1) {
            invoices[invIdx].status = 'Diterima';
            localStorage.setItem('shopnow_invoices', JSON.stringify(invoices));
            // Kirim notifikasi ke user
            localStorage.setItem('invoice-' + proofs[idx].username, JSON.stringify({
                time: proofs[idx].time,
                note: proofs[idx].note,
                image: proofs[idx].image
            }));
            // Notifikasi user
            let notifArr = JSON.parse(localStorage.getItem(`notifications_${proofs[idx].username}`) || '[]');
            notifArr.unshift({
                id: Date.now(),
                type: 'invoice',
                message: `Pembayaran untuk pesanan #${proofs[idx].invoiceId} telah diverifikasi dan diterima.`,
                data: { invoiceId: proofs[idx].invoiceId, status: 'Diterima' },
                read: false,
                time: new Date().toLocaleString()
            });
            localStorage.setItem(`notifications_${proofs[idx].username}`, JSON.stringify(notifArr));
        }
        alert('Invoice telah dikirim ke pembeli!');
    }
    showAdminProofList();
};

// Tampilkan invoice ke pembeli jika ada
function checkInvoice() {
    if (currentUser) {
        const invoice = localStorage.getItem('invoice-' + currentUser.username);
        if (invoice) {
            const data = JSON.parse(invoice);
            setTimeout(() => {
                alert('INVOICE DITERIMA!\n\nWaktu: ' + data.time + '\nCatatan: ' + (data.note || '-') + '\n\nTerima kasih, pembayaran Anda telah diverifikasi.');
                localStorage.removeItem('invoice-' + currentUser.username);
            }, 1000);
        }
    }
}

// Perbaiki tombol close (X) pada adminModal agar settingsModal muncul kembali
if (adminModal) {
    const closeBtn = adminModal.querySelector('.close');
    if (closeBtn) {
        closeBtn.onclick = function() {
            adminModal.style.display = 'none';
            // Tampilkan kembali settingsModal
            const settingsModal = document.getElementById('settingsModal');
            if (settingsModal) settingsModal.style.display = 'block';
        };
    }
}

function getCurrentLanguage() {
    return localStorage.getItem('language') || 'id';
}
function setCurrentLanguage(lang) {
    localStorage.setItem('language', lang);
}

function applyTranslation() {
    const lang = getCurrentLanguage();
    const translationMap = [
        { selector: '.logo h1', text: 'ShopNow' },
        { selector: '#searchInput', attr: 'placeholder', text: 'Search products...' },
        { selector: '#loginBtn', text: 'Login' },
        { selector: '#profileBtn', text: 'Profile' },
        { selector: '#settingsBtn', text: 'Settings' },
        { selector: '#contactUsBtn', text: 'Contact Us' },
        { selector: '#addProductBtn', text: 'Tambah Barang' },
        { selector: '#categoryToggle', text: 'Kategori' },
        { selector: '#categoryMenu a:nth-child(1)', text: 'All' },
        { selector: '#categoryMenu a:nth-child(2)', text: 'Electronics' },
        { selector: '#categoryMenu a:nth-child(3)', text: 'Fashion' },
        { selector: '#categoryMenu a:nth-child(4)', text: 'Home' },
        { selector: '#categoryMenu a:nth-child(5)', text: 'Beauty' },
        { selector: '#categoryMenu a:nth-child(6)', text: 'Sports' },
        // ...tambahkan selector dan text lain sesuai kebutuhan...
    ];
    translationMap.forEach(item => {
        const el = document.querySelector(item.selector);
        if (el) {
            if (item.attr) {
                el.setAttribute(item.attr, translations[lang][item.text] || item.text);
            } else {
                el.textContent = translations[lang][item.text] || item.text;
            }
        }
    });
    // Set value dropdown
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) languageSelect.value = lang;
}

// Order History Functions
function renderOrderHistory() {
    const user = JSON.parse(localStorage.getItem('currentUser')) || currentUser;
    const orderHistoryList = document.getElementById('orderHistoryList');
    if (!user) {
        orderHistoryList.innerHTML = '<p>Silakan login untuk melihat riwayat pesanan.</p>';
        return;
    }
    const invoices = JSON.parse(localStorage.getItem('shopnow_invoices') || '[]');
    const myOrders = invoices.filter(inv => inv.username === user.username);
    if (myOrders.length === 0) {
        orderHistoryList.innerHTML = '<p>Belum ada riwayat pesanan.</p>';
        return;
    }
    let html = `<table style='width:100%;border-collapse:collapse;background:#fff;'>
        <thead><tr style='background:#f0f4fa;'>
            <th>ID</th><th>Tanggal</th><th>Total</th><th>Status</th><th>Bukti</th><th>Detail</th>
        </tr></thead><tbody>`;
    myOrders.forEach((inv, i) => {
        html += `<tr>
            <td>${inv.id || '-'}</td>
            <td>${inv.time || '-'}</td>
            <td>Rp${Number(inv.total || 0).toLocaleString()}</td>
            <td><span style='font-weight:bold;color:${orderStatusColor(inv.status)}'>${inv.status || '-'}</span></td>
            <td>${inv.proofImage ? `<img src='${inv.proofImage}' style='max-width:50px;max-height:50px;border-radius:4px;'>` : '-'}</td>
            <td><button onclick='showOrderDetail(${JSON.stringify(inv).replace(/'/g,"&#39;")})' style='padding:2px 8px;border-radius:4px;background:#636e72;color:#fff;border:none;cursor:pointer;'>Detail</button></td>
        </tr>`;
    });
    html += '</tbody></table>';
    orderHistoryList.innerHTML = html;
}
function orderStatusColor(status) {
    if (!status) return '#888';
    if (status === 'Belum Bayar') return '#e67e22';
    if (status === 'Menunggu Verifikasi') return '#2980b9';
    if (status === 'Diterima') return '#27ae60';
    if (status === 'Ditolak') return '#c0392b';
    return '#888';
}
function showOrderDetail(inv) {
    let itemsHtml = '';
    if (inv.items && inv.items.length) {
        itemsHtml = `<table style='width:100%;margin-bottom:10px;border-collapse:collapse;'>
            <thead><tr style='background:#f0f4fa;'><th>Produk</th><th>Qty</th><th>Harga</th><th>Subtotal</th></tr></thead><tbody>`;
        inv.items.forEach(item => {
            itemsHtml += `<tr>
                <td>${item.name || '-'}</td>
                <td>${item.quantity || 1}</td>
                <td>Rp${Number(item.price).toLocaleString()}</td>
                <td>Rp${Number((item.price * (item.quantity || 1))).toLocaleString()}</td>
            </tr>`;
        });
        itemsHtml += '</tbody></table>';
    }
    let html = `<h3>Detail Pesanan</h3>
        <p><b>ID:</b> ${inv.id || '-'}</p>
        <p><b>Tanggal:</b> ${inv.time || '-'}</p>
        <p><b>Status:</b> <span style='font-weight:bold;color:${orderStatusColor(inv.status)}'>${inv.status || '-'}</span></p>
        <p><b>Alamat Pengiriman:</b> ${inv.address || '-'}</p>
        <p><b>Metode Pembayaran:</b> ${inv.paymentMethod || '-'}</p>
        <hr>
        ${itemsHtml}
        <p><b>Total:</b> Rp${Number(inv.total || 0).toLocaleString()}</p>
        <p><b>Catatan:</b> ${inv.note || '-'}</p>
        <p><b>Bukti Transfer:</b><br>${inv.proofImage ? `<img src='${inv.proofImage}' style='max-width:200px;max-height:200px;border-radius:8px;'>` : '-'}</p>
        <button onclick='printInvoice(${JSON.stringify(inv).replace(/'/g,"&#39;")})' style='margin-top:10px;padding:6px 18px;border-radius:6px;background:#2d8cff;color:#fff;border:none;cursor:pointer;'><i class='fas fa-print'></i> Print/Download Invoice</button>
        <button onclick='closeOrderDetail()' style='margin-top:10px;margin-left:10px;padding:6px 18px;border-radius:6px;background:#636e72;color:#fff;border:none;cursor:pointer;'>Tutup</button>`;
    showOrderModal(html);
}
window.printInvoice = function(inv) {
    let itemsHtml = '';
    if (inv.items && inv.items.length) {
        itemsHtml = `<table style='width:100%;margin-bottom:10px;border-collapse:collapse;'>
            <thead><tr><th>Produk</th><th>Qty</th><th>Harga</th><th>Subtotal</th></tr></thead><tbody>`;
        inv.items.forEach(item => {
            itemsHtml += `<tr>
                <td>${item.name || '-'}</td>
                <td>${item.quantity || 1}</td>
                <td>Rp${Number(item.price).toLocaleString()}</td>
                <td>Rp${Number((item.price * (item.quantity || 1))).toLocaleString()}</td>
            </tr>`;
        });
        itemsHtml += '</tbody></table>';
    }
    const win = window.open('', '', 'width=700,height=800');
    win.document.write(`
        <html><head><title>Invoice ${inv.id}</title></head><body style='font-family:sans-serif;'>
        <h2>INVOICE</h2>
        <p><b>ID:</b> ${inv.id || '-'}</p>
        <p><b>Tanggal:</b> ${inv.time || '-'}</p>
        <p><b>Status:</b> ${inv.status || '-'}</p>
        <p><b>Alamat Pengiriman:</b> ${inv.address || '-'}</p>
        <p><b>Metode Pembayaran:</b> ${inv.paymentMethod || '-'}</p>
        <hr>
        ${itemsHtml}
        <p><b>Total:</b> Rp${Number(inv.total || 0).toLocaleString()}</p>
        <p><b>Catatan:</b> ${inv.note || '-'}</p>
        <p><b>Bukti Transfer:</b><br>${inv.proofImage ? `<img src='${inv.proofImage}' style='max-width:200px;max-height:200px;border-radius:8px;'>` : '-'}</p>
        <hr><p>Terima kasih telah berbelanja di ShopNow!</p>
        </body></html>
    `);
    win.document.close();
    win.print();
};
function showOrderModal(html) {
    let modal = document.getElementById('orderDetailPopup');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'orderDetailPopup';
        modal.style.position = 'fixed';
        modal.style.left = '0';
        modal.style.top = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.background = 'rgba(0,0,0,0.25)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '9999';
        document.body.appendChild(modal);
    }
    modal.innerHTML = `<div style="background:#fff;padding:2rem 2.5rem;border-radius:12px;max-width:400px;min-width:280px;position:relative;box-shadow:0 2px 16px rgba(0,0,0,0.08);">
        <button onclick="closeOrderDetail()" style="position:absolute;top:10px;right:10px;background:none;border:none;font-size:1.3rem;cursor:pointer;">&times;</button>
        ${html}
    </div>`;
    modal.style.display = 'flex';
}
function closeOrderDetail() {
    let modal = document.getElementById('orderDetailPopup');
    if (modal) modal.style.display = 'none';
}
// Event listeners untuk order history
window.addEventListener('DOMContentLoaded', function() {
    const orderHistoryBtn = document.getElementById('orderHistoryBtn');
    const orderHistoryModal = document.getElementById('orderHistoryModal');
    if (orderHistoryBtn && orderHistoryModal) {
        orderHistoryBtn.onclick = function() {
            renderOrderHistory();
            orderHistoryModal.style.display = 'block';
        };
        // Close modal
        orderHistoryModal.querySelector('.close').onclick = function() {
            orderHistoryModal.style.display = 'none';
        };
    }
});

// Wishlist Functions
function saveWishlist(wishlist) {
    const user = JSON.parse(localStorage.getItem('currentUser')) || currentUser;
    if (!user) return;
    localStorage.setItem(`wishlist_${user.username}`, JSON.stringify(wishlist));
}
function isInWishlist(productId) {
    return getWishlist().some(p => p.id === productId);
}
// Tambahkan fungsi showToast untuk notifikasi
function showToast(message, type = 'info') {
    let toast = document.getElementById('toastNotif');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toastNotif';
        toast.style.position = 'fixed';
        toast.style.top = '24px';
        toast.style.right = '24px';
        toast.style.zIndex = '99999';
        toast.style.padding = '14px 28px';
        toast.style.borderRadius = '8px';
        toast.style.fontSize = '1rem';
        toast.style.fontWeight = '600';
        toast.style.boxShadow = '0 2px 12px rgba(44,62,80,0.13)';
        toast.style.transition = 'opacity 0.3s';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.background = type === 'success' ? '#2ecc71' : (type === 'error' ? '#e74c3c' : '#3498db');
    toast.style.color = '#fff';
    toast.style.opacity = '1';
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => { toast.style.display = 'none'; }, 400);
    }, 2000);
}
// Modifikasi toggleWishlist agar tampilkan notifikasi
function toggleWishlist(product) {
    let wishlist = getWishlist();
    const idx = wishlist.findIndex(p => p.id === product.id);
    if (idx !== -1) {
        wishlist.splice(idx, 1);
        showToast('Dihapus dari wishlist!', 'info');
        addNotification('wishlist', `Produk <b>${product.name}</b> dihapus dari wishlist.`);
    } else {
        wishlist.push(product);
        showToast('Ditambahkan ke wishlist!', 'success');
        addNotification('wishlist', `Produk <b>${product.name}</b> ditambahkan ke wishlist.`);
    }
    saveWishlist(wishlist);
    renderProducts();
}
function renderWishlist() {
    const wishlistList = document.getElementById('wishlistList');
    const wishlist = getWishlist();
    if (!wishlist.length) {
        wishlistList.innerHTML = '<p>Wishlist kosong.</p>';
        return;
    }
    wishlistList.innerHTML = wishlist.map(product => `
        <div class='wishlist-product-card'>
            <img src='${product.image || 'https://via.placeholder.com/70'}' class='wishlist-product-img'>
            <div class='wishlist-product-info'>
                <div class='wishlist-product-title'>${product.name}</div>
                <div class='wishlist-product-price'>Rp${Number(product.price).toLocaleString()}</div>
                <div>${product.category || ''}</div>
            </div>
            <div class='wishlist-product-actions'>
                <button class='wishlist-btn' onclick='addToCartFromWishlist(${product.id})'><i class="fas fa-cart-plus"></i> Tambah ke Keranjang</button>
                <button class='wishlist-btn remove' onclick='removeFromWishlist(${product.id})'><i class="fas fa-trash"></i> Hapus</button>
            </div>
        </div>
    `).join('');
}
function addToCartFromWishlist(productId) {
    const wishlist = getWishlist();
    const product = wishlist.find(p => p.id === productId);
    if (product) {
        addToCart(product.id); // Perbaiki: gunakan id, bukan objek
        removeFromWishlist(productId);
    }
}
function removeFromWishlist(productId) {
    let wishlist = getWishlist();
    wishlist = wishlist.filter(p => p.id !== productId);
    saveWishlist(wishlist);
    renderWishlist();
    renderProducts();
}
// Render wishlist icon on products
function renderProducts() {
    const productsContainer = document.getElementById('productsContainer');
    if (!productsContainer) return;
    let html = '';
    getAllProducts().forEach(product => {
        // Rata-rata rating
        const reviews = getProductReviews(product.id);
        const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '-';
        html += `<div class='product-card' style='position:relative;cursor:pointer;' onclick='showProductDetail(${JSON.stringify(product).replace(/'/g,"&#39;")})'>
            <span class='wishlist-icon${isInWishlist(product.id) ? ' active' : ''}' onclick='event.stopPropagation();toggleWishlist(${JSON.stringify(product).replace(/'/g,"&#39;")})'>
                <i class='fas fa-heart'></i>
            </span>
            <img src='${product.image || 'https://via.placeholder.com/300x200'}' alt='${product.name}' class='product-img'>
            <div class='product-info'>
                <h3 class='product-title'>${product.name}</h3>
                <p class='product-price'>Rp${Number(product.price).toLocaleString()}</p>
                <p class='product-desc'>${product.description || ''}</p>
                <div style='color:#e67e22;font-size:0.98rem;margin-bottom:2px;'>
                    <i class='fas fa-star'></i> ${avgRating} (${reviews.length})
                </div>
                <button class='add-to-cart' onclick='event.stopPropagation();addToCart(${product.id})'>Add to Cart</button>
            </div>
        </div>`;
    });
    productsContainer.innerHTML = html;
}
// Event listeners untuk wishlist
window.addEventListener('DOMContentLoaded', function() {
    const wishlistBtn = document.getElementById('wishlistBtn');
    const wishlistModal = document.getElementById('wishlistModal');
    if (wishlistBtn && wishlistModal) {
        wishlistBtn.onclick = function() {
            renderWishlist();
            wishlistModal.style.display = 'block';
        };
        // Close modal
        wishlistModal.querySelector('.close').onclick = function() {
            wishlistModal.style.display = 'none';
        };
    }
    // Render products with wishlist icon on load
    renderProducts();
});

// Notifikasi User Functions
function getNotifications() {
    const user = JSON.parse(localStorage.getItem('currentUser')) || currentUser;
    if (!user) return [];
    return JSON.parse(localStorage.getItem(`notifications_${user.username}`) || '[]');
}
function saveNotifications(notifs) {
    const user = JSON.parse(localStorage.getItem('currentUser')) || currentUser;
    if (!user) return;
    localStorage.setItem(`notifications_${user.username}`, JSON.stringify(notifs));
}
function addNotification(type, message, data) {
    const user = JSON.parse(localStorage.getItem('currentUser')) || currentUser;
    if (!user) return;
    let notifs = getNotifications();
    notifs.unshift({
        id: Date.now(),
        type,
        message,
        data: data || null,
        read: false,
        time: new Date().toLocaleString()
    });
    saveNotifications(notifs);
    updateNotifBadge();
}
function markNotifAsRead(id) {
    let notifs = getNotifications();
    notifs = notifs.map(n => n.id === id ? { ...n, read: true } : n);
    saveNotifications(notifs);
    renderNotifList();
    updateNotifBadge();
}
function markAllNotifAsRead() {
    let notifs = getNotifications();
    notifs = notifs.map(n => ({ ...n, read: true }));
    saveNotifications(notifs);
    renderNotifList();
    updateNotifBadge();
}
function updateNotifBadge() {
    const notifBtn = document.getElementById('notifBtn');
    const notifBadge = document.getElementById('notifBadge');
    const user = JSON.parse(localStorage.getItem('currentUser')) || currentUser;
    if (!user) {
        notifBtn.style.display = 'none';
        return;
    }
    notifBtn.style.display = 'inline';
    const notifs = getNotifications();
    const unread = notifs.filter(n => !n.read).length;
    if (unread > 0) {
        notifBadge.textContent = unread;
        notifBadge.style.display = 'inline';
    } else {
        notifBadge.style.display = 'none';
    }
}
function renderNotifList() {
    const notifList = document.getElementById('notifList');
    const notifs = getNotifications();
    if (!notifs.length) {
        notifList.innerHTML = '<p>Tidak ada notifikasi.</p>';
        return;
    }
    notifList.innerHTML = notifs.map(n => `
        <div class="notif-item${n.read ? '' : ' unread'}" style="position:relative;padding-right:40px;">
            <div>${n.message}</div>
            <button onclick="removeNotification('${n.id}')" style="position:absolute;top:8px;right:8px;background:#e74c3c;color:#fff;border:none;border-radius:4px;padding:2px 8px;cursor:pointer;font-size:0.9rem;">Hapus</button>
        </div>
    `).join('');
}

// Cek perubahan status invoice user untuk notifikasi
function checkInvoiceNotifications() {
    const user = JSON.parse(localStorage.getItem('currentUser')) || currentUser;
    if (!user) return;
    const invoices = JSON.parse(localStorage.getItem('shopnow_invoices') || '[]');
    const notifs = getNotifications();
    
    // Cek notifikasi terakhir per invoiceId+status
    const notifMap = {};
    notifs.forEach(n => {
        if (n.data && n.data.invoiceId && n.data.status) {
            notifMap[n.data.invoiceId + '_' + n.data.status] = true;
        }
    });
    
    // Cek juga notifikasi yang sudah dihapus (disimpan di localStorage terpisah)
    const deletedNotifs = JSON.parse(localStorage.getItem(`deleted_notifications_${user.username}`) || '[]');
    deletedNotifs.forEach(n => {
        if (n.data && n.data.invoiceId && n.data.status) {
            notifMap[n.data.invoiceId + '_' + n.data.status] = true;
        }
    });
    
    invoices.filter(inv => inv.username === user.username).forEach(inv => {
        if (inv.status && inv.status !== 'Belum Bayar') {
            const key = inv.id + '_' + inv.status;
            if (!notifMap[key]) {
                addNotification('invoice', `Status pesanan #${inv.id} kini: ${inv.status}`, { invoiceId: inv.id, status: inv.status });
                notifMap[key] = true;
            }
        }
    });
}

// Event listeners untuk notifikasi
window.addEventListener('DOMContentLoaded', function() {
    const notifBtn = document.getElementById('notifBtn');
    const notifModal = document.getElementById('notifModal');
    if (notifBtn && notifModal) {
        notifBtn.onclick = function() {
            renderNotifList();
            notifModal.style.display = 'block';
            updateNotifBadge();
        };
        notifModal.querySelector('.close').onclick = function() {
            notifModal.style.display = 'none';
        };
    }
    updateNotifBadge();
    checkInvoiceNotifications();
});

// Logika submit form upload bukti transfer
if (uploadProofForm) {
    uploadProofForm.onsubmit = async function(e) {
        e.preventDefault();
        uploadProofMessage.textContent = '';
        console.log('[UPLOAD PROOF] Submit form dipanggil');
        
        try {
            const fileInput = document.getElementById('proofImage');
            if (!fileInput || !fileInput.files[0]) {
                uploadProofMessage.textContent = 'Silakan pilih file bukti transfer (jpg/png/webp).';
                console.error('[UPLOAD PROOF] File input tidak ditemukan atau tidak ada file.');
                return;
            }
            
            const file = fileInput.files[0];
            
            // Validate file
            try {
                validateImageFile(file);
            } catch (validationError) {
                uploadProofMessage.textContent = validationError.message;
                return;
            }
            
            // Disable submit button
            const submitBtn = uploadProofForm.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;
            
            // Upload to Cloudinary
            uploadProofMessage.textContent = 'Mengupload bukti transfer...';
            const cloudinaryUrl = await uploadToCloudinary(file);
            
            // Process the uploaded image
            await handleProofUpload(cloudinaryUrl);
            
        } catch (err) {
            uploadProofMessage.textContent = 'Terjadi error saat upload. Silakan coba ulangi.';
            console.error('[UPLOAD PROOF] Upload proof error:', err);
            
            // Re-enable submit button
            const submitBtn = uploadProofForm.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = false;
        }
    };
    
    // Add file input change event for preview
    const fileInput = document.getElementById('proofImage');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                try {
                    validateImageFile(file);
                    showImagePreview(file);
                } catch (error) {
                    uploadProofMessage.textContent = error.message;
                    // Clear the file input
                    fileInput.value = '';
                    // Hide preview
                    const previewContainer = document.getElementById('imagePreviewContainer');
                    const fileInfo = document.getElementById('fileInfo');
                    if (previewContainer) previewContainer.style.display = 'none';
                    if (fileInfo) fileInfo.style.display = 'none';
                }
            }
        });
    }
    
    // Add remove preview button functionality
    const removePreviewBtn = document.getElementById('removePreview');
    if (removePreviewBtn) {
        removePreviewBtn.addEventListener('click', function() {
            const fileInput = document.getElementById('proofImage');
            const previewContainer = document.getElementById('imagePreviewContainer');
            const fileInfo = document.getElementById('fileInfo');
            
            if (fileInput) fileInput.value = '';
            if (previewContainer) previewContainer.style.display = 'none';
            if (fileInfo) fileInfo.style.display = 'none';
        });
    }
}

// Fungsi lanjutan upload proof setelah kompresi
async function handleProofUpload(cloudinaryUrl) {
    try {
        let invoices = JSON.parse(localStorage.getItem('shopnow_invoices') || '[]');
        const user = currentUser;
        const idx = invoices.findIndex(inv => inv.username === user.username && (inv.status === 'Belum Bayar' || inv.status === 'Menunggu Verifikasi'));
        if (idx === -1) {
            uploadProofMessage.textContent = 'Tidak ditemukan invoice yang bisa diupload. Silakan lakukan checkout ulang.';
            console.error('[UPLOAD PROOF] Tidak ada invoice Belum Bayar/Menunggu Verifikasi untuk user', user.username);
            const submitBtn = uploadProofForm.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = false;
            return;
        }
        
        // Update invoice with Cloudinary URL
        invoices[idx].proofImage = cloudinaryUrl;
        invoices[idx].note = document.getElementById('proofNote').value;
        invoices[idx].status = 'Menunggu Verifikasi';
        localStorage.setItem('shopnow_invoices', JSON.stringify(invoices));
        
        // Update proofs array
        let proofs = JSON.parse(localStorage.getItem('proofs') || '[]');
        const proofIdx = proofs.findIndex(p => p.invoiceId === invoices[idx].id && p.username === user.username);
        if (proofIdx !== -1) {
            proofs[proofIdx].image = cloudinaryUrl;
            proofs[proofIdx].note = invoices[idx].note;
            proofs[proofIdx].status = 'Menunggu Verifikasi';
            proofs[proofIdx].time = new Date().toLocaleString();
        } else {
            proofs.push({
                id: Date.now(),
                username: user.username,
                invoiceId: invoices[idx].id,
                time: new Date().toLocaleString(),
                note: invoices[idx].note,
                image: cloudinaryUrl,
                status: 'Menunggu Verifikasi'
            });
        }
        localStorage.setItem('proofs', JSON.stringify(proofs));
        
        // Notifikasi user: selalu tambahkan notifikasi menunggu verifikasi admin
        addNotification('invoice', `Bukti transfer untuk pesanan #${invoices[idx].id} berhasil diupload. Menunggu verifikasi admin.`, { invoiceId: invoices[idx].id, status: 'Menunggu Verifikasi' });
        
        // Notifikasi admin
        let adminNotifs = JSON.parse(localStorage.getItem('notifications_admin') || '[]');
        adminNotifs.unshift({
            id: Date.now(),
            type: 'proof',
            message: `User <b>${user.username}</b> mengirim bukti transfer untuk invoice #${invoices[idx].id}.`,
            data: { invoiceId: invoices[idx].id, username: user.username },
            read: false,
            time: new Date().toLocaleString()
        });
        localStorage.setItem('notifications_admin', JSON.stringify(adminNotifs));
        
        // Success message
        uploadProofMessage.textContent = 'Bukti transfer berhasil dikirim! Menunggu verifikasi admin.';
        console.log('[UPLOAD PROOF] Bukti transfer berhasil dikirim untuk invoice:', invoices[idx].id);
        
        // Reset form and hide progress
        uploadProofForm.reset();
        const submitBtn = uploadProofForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = false;
        
        // Hide preview and progress
        const previewContainer = document.getElementById('imagePreviewContainer');
        const fileInfo = document.getElementById('fileInfo');
        const progressContainer = document.getElementById('uploadProgressContainer');
        if (previewContainer) previewContainer.style.display = 'none';
        if (fileInfo) fileInfo.style.display = 'none';
        if (progressContainer) progressContainer.style.display = 'none';
        
        // Close modal after delay
        setTimeout(() => {
            if (typeof uploadProofModal !== 'undefined') uploadProofModal.style.display = 'none';
            uploadProofMessage.textContent = '';
        }, 2000);
        
    } catch (err) {
        uploadProofMessage.textContent = 'Terjadi error saat upload. Silakan coba ulangi.';
        console.error('[UPLOAD PROOF] Upload proof error:', err);
        
        // Re-enable submit button
        const submitBtn = uploadProofForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = false;
    }
}

// --- Review Produk ---
function getProductReviews(productId) {
    return JSON.parse(localStorage.getItem(`reviews_${productId}`) || '[]');
}
function saveProductReviews(productId, reviews) {
    localStorage.setItem(`reviews_${productId}`, JSON.stringify(reviews));
}
function userCanReview(productId) {
    if (!currentUser) return false;
    const invoices = JSON.parse(localStorage.getItem('shopnow_invoices') || '[]');
    return invoices.some(inv => inv.username === currentUser.username && inv.items && inv.items.some(item => item.id === productId) && inv.status === 'Diterima');
}
function getUserReview(productId) {
    if (!currentUser) return null;
    const reviews = getProductReviews(productId);
    return reviews.find(r => r.username === currentUser.username) || null;
}
function renderProductDetail(product) {
    const modal = document.getElementById('productDetailModal');
    const content = document.getElementById('productDetailContent');
    if (!modal || !content) return;
    
    // Info produk
    let html = `<div style='display:flex;gap:1.5rem;align-items:flex-start;'>
        <img src='${product.image || 'https://via.placeholder.com/200x150'}' style='width:180px;height:130px;object-fit:cover;border-radius:8px;border:1px solid #eee;'>
        <div style='flex:1;'>
            <h2 style='margin:0 0 0.5rem 0;'>${product.name}</h2>
            <div style='color:#e74c3c;font-weight:600;font-size:1.2rem;'>Rp${Number(product.price).toLocaleString()}</div>
            <div style='margin:0.5rem 0;'>${product.description || ''}</div>
            <div style='margin-bottom:0.5rem;'>Kategori: ${product.category || '-'}</div>
            <div style='margin-bottom:0.5rem;'>Stok: ${product.stock || '-'}</div>
            <div style='margin-bottom:0.5rem;'>Berat: ${product.weight || '-'} gram</div>
            <div style='margin-bottom:0.5rem;'>Alamat Penjual: ${product.sellerAddress || '-'}</div>
            <div style='margin-bottom:0.5rem;'>Metode Pembayaran: ${product.payments ? Object.entries(product.payments).filter(([key, val]) => val).map(([key]) => `<span class='payment-badge'>${key}</span>`).join(' ') : 'N/A'}</div>
            <button class='add-to-cart' onclick='addToCart(${product.id})'>Add to Cart</button>
        </div>
    </div><hr style='margin:1.2rem 0;'>`;
    
    // Review section
    const reviews = getProductReviews(product.id);
    const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '-';
    html += `<div><h3>Ulasan Produk <span style='font-size:1rem;color:#e67e22;'>&#9733; ${avgRating}</span> (${reviews.length})</h3>`;
    
    if (reviews.length) {
        html += reviews.map(r => `
            <div style='border-bottom:1px solid #eee;padding:8px 0;'>
                <b>${r.username}</b> <span style='color:#e67e22;'>&#9733; ${r.rating}</span><br>
                <span style='font-size:0.97rem;'>${r.comment}</span>
                ${currentUser && r.username === currentUser.username ? `<br><button onclick='editReview(${product.id})' style='font-size:0.9rem;margin-right:8px;'>Edit</button><button onclick='deleteReview(${product.id})' style='font-size:0.9rem;'>Hapus</button>` : ''}
            </div>
        `).join('');
    } else {
        html += '<p>Belum ada ulasan.</p>';
    }
    html += '</div>';
    
    // Form review
    if (currentUser) {
        const userReview = getUserReview(product.id);
        if (userCanReview(product.id)) {
            html += `<hr><div><h4>${userReview ? 'Edit Ulasan Anda' : 'Tulis Ulasan'}</h4>
                <form id='reviewForm'>
                    <label>Rating: <select id='reviewRating'>
                        <option value='5'>5</option>
                        <option value='4'>4</option>
                        <option value='3'>3</option>
                        <option value='2'>2</option>
                        <option value='1'>1</option>
                    </select></label><br>
                    <textarea id='reviewComment' placeholder='Tulis komentar Anda' required style='width:100%;margin-top:6px;'>${userReview ? userReview.comment : ''}</textarea><br>
                    <button type='submit' class='save-profile-btn' style='background:#e67e22;margin-top:8px;'>${userReview ? 'Update' : 'Kirim'} Ulasan</button>
                </form>
                <div id='reviewMsg' style='margin-top:8px;'></div>
            </div>`;
        } else {
            html += `<hr><div><i>Anda hanya bisa memberi ulasan jika sudah membeli produk ini dan pesanan sudah diterima.</i></div>`;
        }
    }
    
    content.innerHTML = html;
    modal.style.display = 'block';
    
    // Set rating jika edit
    if (currentUser && userCanReview(product.id)) {
        const userReview = getUserReview(product.id);
        if (userReview) {
            setTimeout(() => {
                const ratingSelect = document.getElementById('reviewRating');
                if (ratingSelect) ratingSelect.value = userReview.rating;
            }, 100);
        }
        
        // Form submit
        const reviewForm = document.getElementById('reviewForm');
        if (reviewForm) {
            reviewForm.onsubmit = function(e) {
                e.preventDefault();
                const rating = parseInt(document.getElementById('reviewRating').value);
                const comment = document.getElementById('reviewComment').value.trim();
                if (!rating || !comment) {
                    document.getElementById('reviewMsg').textContent = 'Rating dan komentar wajib diisi!';
                    return;
                }
                let reviews = getProductReviews(product.id);
                const idx = reviews.findIndex(r => r.username === currentUser.username);
                if (idx !== -1) {
                    reviews[idx] = { ...reviews[idx], rating, comment };
                } else {
                    reviews.push({ username: currentUser.username, rating, comment });
                }
                saveProductReviews(product.id, reviews);
                document.getElementById('reviewMsg').textContent = 'Ulasan berhasil disimpan!';
                setTimeout(() => { renderProductDetail(product); }, 1000);
            };
        }
    }
}

window.editReview = function(productId) {
    const product = (products || []).find(p => p.id === productId);
    if (product) renderProductDetail(product);
};

window.deleteReview = function(productId) {
    if (!currentUser) return;
    let reviews = getProductReviews(productId);
    reviews = reviews.filter(r => r.username !== currentUser.username);
    saveProductReviews(productId, reviews);
    const product = (products || []).find(p => p.id === productId);
    if (product) renderProductDetail(product);
};

// --- Buka modal detail produk saat klik produk ---
function renderProducts() {
    const productsContainer = document.getElementById('productsContainer');
    if (!productsContainer) return;
    
    let html = '';
    getAllProducts().forEach(product => {
        // Rata-rata rating
        const reviews = getProductReviews(product.id);
        const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '-';
        
        html += `<div class='product-card' style='position:relative;cursor:pointer;' onclick='showProductDetail(${JSON.stringify(product).replace(/'/g,"&#39;")})'>
            <span class='wishlist-icon${isInWishlist(product.id) ? ' active' : ''}' onclick='event.stopPropagation();toggleWishlist(${JSON.stringify(product).replace(/'/g,"&#39;")})'>
                <i class='fas fa-heart'></i>
            </span>
            <img src='${product.image || 'https://via.placeholder.com/300x200'}' alt='${product.name}' class='product-img'>
            <div class='product-info'>
                <h3 class='product-title'>${product.name}</h3>
                <p class='product-price'>Rp${Number(product.price).toLocaleString()}</p>
                <p class='product-desc'>${product.description || ''}</p>
                <div style='color:#e67e22;font-size:0.98rem;margin-bottom:2px;'>
                    <i class='fas fa-star'></i> ${avgRating} (${reviews.length})
                </div>
                <button class='add-to-cart' onclick='event.stopPropagation();addToCart(${product.id})'>Add to Cart</button>
            </div>
        </div>`;
    });
    productsContainer.innerHTML = html;
}

window.showProductDetail = function(product) {
    renderProductDetail(product);
};

// --- Tutup modal detail produk ---
window.addEventListener('DOMContentLoaded', function() {
    const productDetailModal = document.getElementById('productDetailModal');
    if (productDetailModal) {
        const closeBtn = productDetailModal.querySelector('.close');
        if (closeBtn) closeBtn.onclick = function() { productDetailModal.style.display = 'none'; };
    }
});

// Ambil produk dari localStorage (admin panel)
function getAdminProducts() {
    return JSON.parse(localStorage.getItem('shopnow_products') || '[]');
}
// Gabungkan produk bawaan dan produk admin
function getAllProducts() {
    const adminProducts = getAdminProducts().filter(p => p.active !== false);
    let baseProducts = [];
    try { baseProducts = JSON.parse(localStorage.getItem('base_products') || '[]'); } catch(e) {}
    // Pastikan tidak ada ID yang sama, adminProducts prioritas
    const baseProductsFiltered = baseProducts.filter(p => !adminProducts.some(ap => ap.id === p.id));
    return [...adminProducts, ...baseProductsFiltered];
}

// Auto-refresh produk di beranda jika ada perubahan dari admin panel (tab lain)
window.addEventListener('storage', function(e) {
    if (e.key === 'shopnow_products' || e.key === 'shopnow_products_update') {
        console.log('Perubahan produk admin terdeteksi, reload produk...');
        loadProducts();
    }
});

// Tambahkan fungsi removeNotification
function removeNotification(id) {
    const user = JSON.parse(localStorage.getItem('currentUser')) || currentUser;
    if (!user) return;
    
    let notifs = getNotifications();
    const notifToDelete = notifs.find(n => String(n.id) === String(id));
    
    if (notifToDelete) {
        // Tambahkan animasi fade-out untuk notifikasi yang dihapus
        const notifElement = document.querySelector(`[onclick="removeNotification('${id}')"]`)?.parentElement;
        if (notifElement) {
            // Tambahkan class fade-out untuk animasi
            notifElement.classList.add('fade-out');
            
            setTimeout(() => {
                // Simpan notifikasi yang dihapus ke localStorage terpisah
                let deletedNotifs = JSON.parse(localStorage.getItem(`deleted_notifications_${user.username}`) || '[]');
                deletedNotifs.push(notifToDelete);
                localStorage.setItem(`deleted_notifications_${user.username}`, JSON.stringify(deletedNotifs));
                
                // Hapus dari notifikasi aktif
                notifs = notifs.filter(n => String(n.id) !== String(id));
                saveNotifications(notifs);
                
                // Update UI secara langsung tanpa refresh
                const notifList = document.getElementById('notifList');
                if (notifList) {
                    if (notifs.length === 0) {
                        notifList.innerHTML = '<p>Tidak ada notifikasi.</p>';
                    } else {
                        notifList.innerHTML = notifs.map(n => `
                            <div class="notif-item${n.read ? '' : ' unread'}" style="position:relative;padding-right:40px;">
                                <div>${n.message}</div>
                                <button onclick="removeNotification('${n.id}')" style="position:absolute;top:8px;right:8px;background:#e74c3c;color:#fff;border:none;border-radius:4px;padding:2px 8px;cursor:pointer;font-size:0.9rem;">Hapus</button>
                            </div>
                        `).join('');
                    }
                }
                
                // Update badge notifikasi dengan animasi
                updateNotifBadge();
                const notifBadge = document.getElementById('notifBadge');
                if (notifBadge) {
                    notifBadge.classList.add('pulse');
                    setTimeout(() => {
                        notifBadge.classList.remove('pulse');
                    }, 600);
                }
            }, 300); // Tunggu animasi fade-out selesai
        } else {
            // Fallback jika elemen tidak ditemukan
            // Simpan notifikasi yang dihapus ke localStorage terpisah
            let deletedNotifs = JSON.parse(localStorage.getItem(`deleted_notifications_${user.username}`) || '[]');
            deletedNotifs.push(notifToDelete);
            localStorage.setItem(`deleted_notifications_${user.username}`, JSON.stringify(deletedNotifs));
            
            // Hapus dari notifikasi aktif
            notifs = notifs.filter(n => String(n.id) !== String(id));
            saveNotifications(notifs);
            
            // Update UI secara langsung tanpa refresh
            const notifList = document.getElementById('notifList');
            if (notifList) {
                if (notifs.length === 0) {
                    notifList.innerHTML = '<p>Tidak ada notifikasi.</p>';
                } else {
                    notifList.innerHTML = notifs.map(n => `
                        <div class="notif-item${n.read ? '' : ' unread'}" style="position:relative;padding-right:40px;">
                            <div>${n.message}</div>
                            <button onclick="removeNotification('${n.id}')" style="position:absolute;top:8px;right:8px;background:#e74c3c;color:#fff;border:none;border-radius:4px;padding:2px 8px;cursor:pointer;font-size:0.9rem;">Hapus</button>
                        </div>
                    `).join('');
                }
            }
            
            // Update badge notifikasi
            updateNotifBadge();
        }
    }
}

// Fungsi untuk membersihkan localStorage secara berkala
function clearLocalStorageBerkala() {
    if (confirm('Hapus semua data localStorage? (cart, invoice, produk, dsb)')) {
        localStorage.clear();
        alert('localStorage sudah dibersihkan!');
        location.reload();
    }
}

// Fungsi untuk membersihkan notifikasi lama (lebih dari 30 hari)
function cleanOldNotifications() {
    const user = JSON.parse(localStorage.getItem('currentUser')) || currentUser;
    if (!user) return;
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Bersihkan notifikasi aktif
    let notifs = getNotifications();
    notifs = notifs.filter(n => {
        const notifDate = new Date(n.time);
        return notifDate > thirtyDaysAgo;
    });
    saveNotifications(notifs);
    
    // Bersihkan notifikasi yang sudah dihapus
    let deletedNotifs = JSON.parse(localStorage.getItem(`deleted_notifications_${user.username}`) || '[]');
    deletedNotifs = deletedNotifs.filter(n => {
        const notifDate = new Date(n.time);
        return notifDate > thirtyDaysAgo;
    });
    localStorage.setItem(`deleted_notifications_${user.username}`, JSON.stringify(deletedNotifs));
    
    updateNotifBadge();
}

// Jalankan pembersihan notifikasi lama setiap kali halaman dimuat
window.addEventListener('DOMContentLoaded', function() {
    // Jalankan pembersihan notifikasi lama
    cleanOldNotifications();
});

// Cloudinary Upload Functions
async function uploadToCloudinary(file) {
    return new Promise((resolve, reject) => {
        const url = `${CLOUDINARY_CONFIG.apiUrl}/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
        formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);

        const progressContainer = document.getElementById('uploadProgressContainer');
        const progressBar = document.getElementById('uploadProgress');
        const uploadStatus = document.getElementById('uploadStatus');

        xhr.upload.addEventListener('progress', function(e) {
            if (e.lengthComputable) {
                const percent = Math.round((e.loaded / e.total) * 100);
                if (progressBar) progressBar.style.width = percent + '%';
                if (uploadStatus) uploadStatus.textContent = `Uploading... ${percent}%`;
            }
        });

        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    if (progressBar) progressBar.style.width = '100%';
                    if (uploadStatus) uploadStatus.textContent = 'Upload berhasil!';
                    const response = JSON.parse(xhr.responseText);
                    resolve(response.secure_url);
                } else {
                    if (uploadStatus) uploadStatus.textContent = 'Upload gagal!';
                    reject(new Error('Upload failed: ' + xhr.status + ' ' + xhr.statusText));
                }
            }
        };

        xhr.open('POST', url, true);
        xhr.send(formData);

        // Set progress bar to 0% at start
        if (progressBar) progressBar.style.width = '0%';
        if (uploadStatus) uploadStatus.textContent = 'Mempersiapkan upload...';
        if (progressContainer) progressContainer.style.display = 'block';
    });
}

function validateImageFile(file) {
    // Check file type
    if (!file.type.match('image/(jpeg|png|jpg|webp)')) {
        throw new Error('File harus berupa gambar JPG, PNG, atau WebP.');
    }
    
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        throw new Error('Ukuran file maksimal 5MB.');
    }
    
    return true;
}

function showImagePreview(file) {
    const reader = new FileReader();
    const previewContainer = document.getElementById('imagePreviewContainer');
    const preview = document.getElementById('imagePreview');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    
    reader.onload = function(e) {
        preview.src = e.target.result;
        previewContainer.style.display = 'block';
        
        // Show file info
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        fileInfo.style.display = 'block';
    };
    
    reader.readAsDataURL(file);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Tambahkan helper untuk cek localStorage support
function isLocalStorageAvailable() {
    try {
        const testKey = '__test__';
        localStorage.setItem(testKey, '1');
        localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        return false;
    }
}
