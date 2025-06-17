// API URL
const API_URL = 'http://localhost:3000/api';

// Sample products data (in a real application, this would come from a backend)
const products = [
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
    },
    // Add more products as needed
];

// User authentication state
let currentUser = null;
let cart = [];

// DOM Elements
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const forgotPasswordModal = document.getElementById('forgotPasswordModal');
const resetPasswordModal = document.getElementById('resetPasswordModal');
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

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCartCount();
    setupEventListeners();
    setupSettingsModal();
    initTheme();
    checkUserSession();
});

// Check if user is already logged in
function checkUserSession() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            updateUIAfterLogin();
            loadUserCart();
        } catch (error) {
            console.error('Error parsing saved user:', error);
            localStorage.removeItem('currentUser');
        }
    }
}

// Update UI after successful login
function updateUIAfterLogin() {
    if (currentUser) {
        loginBtn.style.display = 'none';
        settingsBtn.style.display = 'inline';
        profileBtn.style.display = 'inline';
        loginBtn.textContent = `Welcome, ${currentUser.username}`;
    }
}

// Load user's cart from storage
function loadUserCart() {
    if (currentUser) {
        const savedCart = localStorage.getItem(`cart_${currentUser.username}`);
        if (savedCart) {
            try {
                cart = JSON.parse(savedCart);
                updateCart();
            } catch (error) {
                console.error('Error loading cart:', error);
                cart = [];
            }
        }
    }
}

// Save user's cart to storage
function saveUserCart() {
    if (currentUser) {
        localStorage.setItem(`cart_${currentUser.username}`, JSON.stringify(cart));
    }
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    // Validation
    if (!username || !password) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Login successful
        currentUser = {
            ...user,
            cart: user.cart || []
        };
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Load user's cart
        loadUserCart();
        
        // Update UI
        updateUIAfterLogin();
        
        // Close modal and clear form
        loginModal.style.display = 'none';
        document.getElementById('loginForm').reset();
        
        showAlert('Login successful!', 'success');
    } else {
        showAlert('Invalid username or password', 'error');
    }
}

// Handle registration
function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validation
    if (!username || !email || !password || !confirmPassword) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        return;
    }

    if (password.length < 6) {
        showAlert('Password must be at least 6 characters long', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showAlert('Please enter a valid email address', 'error');
        return;
    }

    // Check if username or email already exists
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(u => u.username === username)) {
        showAlert('Username already exists', 'error');
        return;
    }

    if (users.some(u => u.email === email)) {
        showAlert('Email already registered', 'error');
        return;
    }

    // Create new user
    const newUser = {
        username,
        email,
        password,
        phone: '',
        gender: '',
        birthDate: '',
        cart: [],
        createdAt: new Date().toISOString()
    };

    // Add to users array
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Close modal and clear form
    registerModal.style.display = 'none';
    document.getElementById('registerForm').reset();
    
    showAlert('Registration successful! Please login.', 'success');
    
    // Switch to login modal
    setTimeout(() => {
        loginModal.style.display = 'block';
    }, 1000);
}

// Handle logout
function handleLogout() {
    // Save current cart before logout
    if (currentUser) {
        saveUserCart();
    }
    
    // Clear current user
    currentUser = null;
    cart = [];
    
    // Clear localStorage
    localStorage.removeItem('currentUser');
    
    // Update UI
    loginBtn.style.display = 'inline';
    settingsBtn.style.display = 'none';
    profileBtn.style.display = 'none';
    loginBtn.textContent = 'Login';
    
    // Close any open modals
    loginModal.style.display = 'none';
    registerModal.style.display = 'none';
    settingsModal.style.display = 'none';
    profileModal.style.display = 'none';
    
    // Update cart display
    updateCart();
    
    showAlert('Logged out successfully', 'success');
}

// Handle forgot password
function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = document.getElementById('forgotEmail').value.trim();
    const messageElement = document.getElementById('forgotPasswordMessage');

    if (!email) {
        showMessage(messageElement, 'Please enter your email address', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showMessage(messageElement, 'Please enter a valid email address', 'error');
        return;
    }

    // Check if email exists
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email);

    if (!user) {
        showMessage(messageElement, 'No account found with this email address', 'error');
        return;
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    
    // Store verification data
    const verificationData = {
        code: verificationCode,
        email: email,
        timestamp: new Date().getTime()
    };
    localStorage.setItem('passwordResetVerification', JSON.stringify(verificationData));

    // Simulate sending email
    alert(`Verification code: ${verificationCode}\n\nThis would be sent to your email in a real application.`);

    // Show reset password modal
    forgotPasswordModal.style.display = 'none';
    resetPasswordModal.style.display = 'block';
    
    showMessage(messageElement, 'Verification code has been sent to your email', 'success');
}

// Handle reset password
function handleResetPassword(e) {
    e.preventDefault();
    
    const resetCode = document.getElementById('resetCode').value;
    const newPassword = document.getElementById('newResetPassword').value;
    const confirmPassword = document.getElementById('confirmResetPassword').value;
    const messageElement = document.getElementById('resetPasswordMessage');

    // Validation
    if (!resetCode || !newPassword || !confirmPassword) {
        showMessage(messageElement, 'Please fill in all fields', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showMessage(messageElement, 'Passwords do not match', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showMessage(messageElement, 'Password must be at least 6 characters long', 'error');
        return;
    }

    // Get verification data
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

    // Update password
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === verificationData.email);
    
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Clear verification data
        localStorage.removeItem('passwordResetVerification');
        
        // Clear forms
        document.getElementById('forgotPasswordForm').reset();
        document.getElementById('resetPasswordForm').reset();
        
        showMessage(messageElement, 'Password has been reset successfully!', 'success');
        
        // Close modal and show login
        setTimeout(() => {
            resetPasswordModal.style.display = 'none';
            loginModal.style.display = 'block';
        }, 2000);
    } else {
        showMessage(messageElement, 'User not found', 'error');
    }
}

// Handle change password
function handleChangePassword(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    const messageElement = document.getElementById('passwordChangeMessage');

    // Validation
    if (!currentUser) {
        showMessage(messageElement, 'You must be logged in to change password', 'error');
        return;
    }

    if (!currentPassword || !newPassword || !confirmNewPassword) {
        showMessage(messageElement, 'Please fill in all fields', 'error');
        return;
    }

    if (currentPassword !== currentUser.password) {
        showMessage(messageElement, 'Current password is incorrect', 'error');
        return;
    }

    if (newPassword !== confirmNewPassword) {
        showMessage(messageElement, 'New passwords do not match', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showMessage(messageElement, 'Password must be at least 6 characters long', 'error');
        return;
    }

    // Update password
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.username === currentUser.username);
    
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        currentUser.password = newPassword;
        
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Clear form
        document.getElementById('changePasswordForm').reset();
        
        showMessage(messageElement, 'Password changed successfully!', 'success');
    } else {
        showMessage(messageElement, 'User not found', 'error');
    }
}

// Load profile data
function loadProfileData() {
    if (!currentUser) return;

    document.getElementById('profileUsername').textContent = currentUser.username;
    document.getElementById('profilePhone').value = currentUser.phone || '';
    document.getElementById('profileEmail').value = currentUser.email || '';
    document.getElementById('profileGender').value = currentUser.gender || '';
    document.getElementById('profileBirthDate').value = currentUser.birthDate || '';
}

// Handle profile update
function handleProfileUpdate(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showAlert('You must be logged in to update profile', 'error');
        return;
    }

    const phone = document.getElementById('profilePhone').value.trim();
    const email = document.getElementById('profileEmail').value.trim();
    const gender = document.getElementById('profileGender').value;
    const birthDate = document.getElementById('profileBirthDate').value;
    const messageElement = document.getElementById('profileMessage');

    // Validation
    if (email && !isValidEmail(email)) {
        showMessage(messageElement, 'Please enter a valid email address', 'error');
        return;
    }

    if (phone && !isValidPhone(phone)) {
        showMessage(messageElement, 'Please enter a valid phone number', 'error');
        return;
    }

    // Check if email is already taken by another user
    if (email && email !== currentUser.email) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.some(u => u.email === email && u.username !== currentUser.username)) {
            showMessage(messageElement, 'Email already registered by another user', 'error');
            return;
        }
    }

    // Update user data
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.username === currentUser.username);
    
    if (userIndex !== -1) {
        users[userIndex] = {
            ...users[userIndex],
            phone,
            email,
            gender,
            birthDate
        };
        
        currentUser = users[userIndex];
        
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        showMessage(messageElement, 'Profile updated successfully!', 'success');
    }
}

// Theme functions
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.checked = savedTheme === 'dark';
    updateThemeLabel(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeLabel(newTheme);
}

function updateThemeLabel(theme) {
    themeLabel.textContent = theme === 'light' ? 'Light Mode' : 'Dark Mode';
}

// Settings modal setup
function setupSettingsModal() {
    settingsBtn.addEventListener('click', () => {
        settingsModal.style.display = 'block';
        
        // Update button text based on seller status
        if (currentUser && currentUser.isSeller) {
            document.getElementById('becomeSellerBtn').innerHTML = '<i class="fas fa-store"></i> Seller Dashboard';
        } else {
            document.getElementById('becomeSellerBtn').innerHTML = '<i class="fas fa-store"></i> Register as Seller';
        }
    });

    themeToggle.addEventListener('change', toggleTheme);
    
    logoutBtn.addEventListener('click', handleLogout);
}

// Product functions
function loadProducts() {
    productsContainer.innerHTML = '';
    
    // Get all products including seller products
    const allProducts = getAllProducts();
    
    allProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="price">$${product.price.toFixed(2)}</p>
            ${product.sellerUsername ? `<p class="seller-info">Sold by: ${product.sellerUsername}</p>` : ''}
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productsContainer.appendChild(productElement);
    });
}

// Function to get all products (default + seller products)
function getAllProducts() {
    // Get default products
    const defaultProducts = products;
    
    // Get seller products
    const sellerProducts = JSON.parse(localStorage.getItem('sellerProducts')) || [];
    
    // Combine all products
    const allProducts = [...defaultProducts, ...sellerProducts];
    
    return allProducts;
}

function searchProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const allProducts = getAllProducts();
    
    // Filter products based on search term
    const filteredProducts = allProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm) ||
        (product.sellerUsername && product.sellerUsername.toLowerCase().includes(searchTerm))
    );
    
    // Clear current display
    productsContainer.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary); grid-column: 1 / -1; padding: 2rem;">No products found matching your search.</p>';
        return;
    }
    
    // Display filtered products
    filteredProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="price">$${product.price.toFixed(2)}</p>
            ${product.sellerUsername ? `<p class="seller-info">Sold by: ${product.sellerUsername}</p>` : ''}
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productsContainer.appendChild(productElement);
    });
}

// Cart functions
function addToCart(productId) {
    if (!currentUser) {
        showAlert('Please login to add items to cart', 'error');
        return;
    }

    // Get all products to find the specific product
    const allProducts = getAllProducts();
    const product = allProducts.find(p => p.id === productId);
    
    if (!product) {
        showAlert('Product not found', 'error');
        return;
    }

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveUserCart();
    updateCart();
    showAlert('Product added to cart!', 'success');
}

function updateCart() {
    updateCartCount();
    updateCartDisplay();
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <button onclick="removeFromCart(${item.id})" class="remove-btn">×</button>
        `;
        cartItems.appendChild(itemElement);
        
        total += item.price * item.quantity;
    });
    
    cartTotal.textContent = total.toFixed(2);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveUserCart();
    updateCart();
}

function toggleCart() {
    cartSidebar.classList.toggle('open');
}

// Enhanced checkout function to create orders
function checkout() {
    if (!currentUser) {
        showAlert('Please login to checkout', 'error');
        return;
    }

    if (cart.length === 0) {
        showAlert('Your cart is empty', 'error');
        return;
    }

    // Show payment modal
    showPaymentModal();
}

// Payment Modal Functions
let selectedPaymentMethod = null;
let currentOrderData = null;

function showPaymentModal() {
    // Prepare order data
    currentOrderData = {
        id: 'ORD' + Date.now(),
        customerName: currentUser.username,
        customerPhone: currentUser.phone || 'N/A',
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'pending',
        date: new Date().toISOString()
    };

    // Display order summary
    displayPaymentOrderSummary();
    
    // Load available payment methods
    loadAvailablePaymentMethods();
    
    // Show payment instructions
    displayPaymentInstructions();
    
    // Show modal
    document.getElementById('paymentModal').style.display = 'block';
}

function displayPaymentOrderSummary() {
    const orderItemsContainer = document.getElementById('paymentOrderItems');
    const totalElement = document.getElementById('paymentTotal');
    
    // Group items by seller
    const itemsBySeller = {};
    cart.forEach(item => {
        const sellerUsername = item.sellerUsername || 'Store';
        if (!itemsBySeller[sellerUsername]) {
            itemsBySeller[sellerUsername] = [];
        }
        itemsBySeller[sellerUsername].push(item);
    });
    
    let orderItemsHTML = '';
    
    Object.entries(itemsBySeller).forEach(([sellerUsername, items]) => {
        const sellerTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        orderItemsHTML += `
            <div class="seller-section">
                <h4 style="color: var(--primary-blue); margin-bottom: 0.5rem;">${sellerUsername}</h4>
        `;
        
        items.forEach(item => {
            orderItemsHTML += `
                <div class="payment-order-item">
                    <div class="payment-item-details">
                        <img src="${item.image}" alt="${item.name}" class="payment-item-image">
                        <div class="payment-item-info">
                            <h4>${item.name}</h4>
                            <p>$${item.price.toFixed(2)} each</p>
                        </div>
                        <div class="payment-item-quantity">Qty: ${item.quantity}</div>
                    </div>
                    <div class="payment-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `;
        });
        
        orderItemsHTML += `
                <div style="text-align: right; margin-top: 0.5rem; font-weight: 600; color: var(--primary-blue);">
                    Subtotal: $${sellerTotal.toFixed(2)}
                </div>
            </div>
        `;
    });
    
    orderItemsContainer.innerHTML = orderItemsHTML;
    totalElement.textContent = currentOrderData.total.toFixed(2);
}

function loadAvailablePaymentMethods() {
    const paymentMethodsContainer = document.getElementById('availablePaymentMethods');
    
    // Get all unique sellers from cart
    const sellers = new Set();
    cart.forEach(item => {
        if (item.sellerUsername) {
            sellers.add(item.sellerUsername);
        }
    });
    
    // Get seller payment methods
    const allSellers = JSON.parse(localStorage.getItem('sellers')) || [];
    const availableMethods = new Set();
    
    sellers.forEach(sellerUsername => {
        const seller = allSellers.find(s => s.username === sellerUsername);
        if (seller && seller.paymentMethods) {
            Object.entries(seller.paymentMethods).forEach(([bank, method]) => {
                if (method.enabled) {
                    availableMethods.add(`${bank}:${method.accountNumber}`);
                }
            });
        }
    });
    
    if (availableMethods.size === 0) {
        paymentMethodsContainer.innerHTML = `
            <div class="payment-method-option disabled">
                <div class="payment-method-header">
                    <i class="fas fa-exclamation-triangle payment-method-icon"></i>
                    <span class="payment-method-name">No Payment Methods Available</span>
                </div>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">
                    Sellers haven't configured payment methods yet. Please contact them directly.
                </p>
            </div>
        `;
        return;
    }
    
    let paymentMethodsHTML = '';
    const bankIcons = {
        'BCA': 'fas fa-university',
        'Mandiri': 'fas fa-university',
        'BNI': 'fas fa-university',
        'BRI': 'fas fa-university'
    };
    
    availableMethods.forEach(methodInfo => {
        const [bank, accountNumber] = methodInfo.split(':');
        const iconClass = bankIcons[bank] || 'fas fa-university';
        
        paymentMethodsHTML += `
            <div class="payment-method-option" onclick="selectPaymentMethod('${bank}', '${accountNumber}')">
                <div class="payment-method-header">
                    <i class="${iconClass} payment-method-icon"></i>
                    <span class="payment-method-name">${bank} Transfer</span>
                </div>
                <div class="payment-method-account">${accountNumber}</div>
            </div>
        `;
    });
    
    paymentMethodsContainer.innerHTML = paymentMethodsHTML;
}

function selectPaymentMethod(bank, accountNumber) {
    // Remove previous selection
    document.querySelectorAll('.payment-method-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selection to clicked option
    event.target.closest('.payment-method-option').classList.add('selected');
    
    selectedPaymentMethod = { bank, accountNumber };
    
    // Enable confirm button
    document.getElementById('confirmPaymentBtn').disabled = false;
    
    // Update payment instructions
    displayPaymentInstructions(bank, accountNumber);
}

function displayPaymentInstructions(bank = null, accountNumber = null) {
    const instructionsContainer = document.getElementById('paymentInstructions');
    
    if (!bank || !accountNumber) {
        instructionsContainer.innerHTML = `
            <p>Please select a payment method to see transfer instructions.</p>
        `;
        return;
    }
    
    const instructions = `
        <p><strong>Transfer to ${bank} Account:</strong></p>
        <div class="payment-method-account" style="margin: 1rem 0; font-size: 1.1rem;">${accountNumber}</div>
        
        <ol>
            <li>Open your ${bank} mobile banking app or internet banking</li>
            <li>Select "Transfer" or "Kirim"</li>
            <li>Choose "Transfer to ${bank} Account"</li>
            <li>Enter the account number: <strong>${accountNumber}</strong></li>
            <li>Enter the amount: <strong>$${currentOrderData.total.toFixed(2)}</strong></li>
            <li>Add a note: <strong>Order ${currentOrderData.id}</strong></li>
            <li>Review and confirm the transfer</li>
            <li>Click "Confirm Payment" below after completing the transfer</li>
        </ol>
        
        <p style="margin-top: 1rem; color: var(--warning-yellow); font-weight: 600;">
            ⚠️ Important: Please include "Order ${currentOrderData.id}" in the transfer note for order identification.
        </p>
    `;
    
    instructionsContainer.innerHTML = instructions;
}

function confirmPayment() {
    if (!selectedPaymentMethod) {
        showAlert('Please select a payment method first', 'error');
        return;
    }
    
    // Create order with payment information
    const order = {
        ...currentOrderData,
        paymentMethod: selectedPaymentMethod.bank,
        paymentAccount: selectedPaymentMethod.accountNumber,
        paymentStatus: 'pending_confirmation'
    };

    // Save order
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear cart
    cart = [];
    saveUserCart();
    updateCart();
    
    // Close payment modal
    document.getElementById('paymentModal').style.display = 'none';
    
    // Reset payment modal
    selectedPaymentMethod = null;
    currentOrderData = null;
    
    showAlert('Order placed successfully! Please complete the transfer and wait for seller confirmation.', 'success');
    cartSidebar.classList.remove('open');
}

function cancelPayment() {
    // Close payment modal
    document.getElementById('paymentModal').style.display = 'none';
    
    // Reset payment modal
    selectedPaymentMethod = null;
    currentOrderData = null;
    
    showAlert('Payment cancelled. Your cart items are still available.', 'info');
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
}

function showAlert(message, type) {
    alert(message);
}

function showMessage(element, message, type) {
    if (!element) return;
    
    element.textContent = message;
    element.className = `message ${type}`;
    element.style.display = 'block';
    
    setTimeout(() => {
        element.style.display = 'none';
    }, 3000);
}

function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Event listeners setup
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

    // Close modal when clicking the X
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
            forgotPasswordModal.style.display = 'none';
            resetPasswordModal.style.display = 'none';
            settingsModal.style.display = 'none';
            profileModal.style.display = 'none';
            document.getElementById('sellerRegistrationModal').style.display = 'none';
            document.getElementById('sellerDashboardModal').style.display = 'none';
            document.getElementById('paymentModal').style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) loginModal.style.display = 'none';
        if (e.target === registerModal) registerModal.style.display = 'none';
        if (e.target === forgotPasswordModal) forgotPasswordModal.style.display = 'none';
        if (e.target === resetPasswordModal) resetPasswordModal.style.display = 'none';
        if (e.target === settingsModal) settingsModal.style.display = 'none';
        if (e.target === profileModal) profileModal.style.display = 'none';
        if (e.target === document.getElementById('sellerRegistrationModal')) {
            document.getElementById('sellerRegistrationModal').style.display = 'none';
        }
        if (e.target === document.getElementById('sellerDashboardModal')) {
            document.getElementById('sellerDashboardModal').style.display = 'none';
        }
        if (e.target === document.getElementById('paymentModal')) {
            document.getElementById('paymentModal').style.display = 'none';
        }
    });

    // Form Submit Events
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('forgotPasswordForm').addEventListener('submit', handleForgotPassword);
    document.getElementById('resetPasswordForm').addEventListener('submit', handleResetPassword);
    document.getElementById('changePasswordForm').addEventListener('submit', handleChangePassword);
    document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);

    // Seller Events
    document.getElementById('becomeSellerBtn').addEventListener('click', () => {
        // Check if user is already a seller
        if (currentUser && currentUser.isSeller) {
            // User is already a seller, show dashboard
            showSellerDashboard();
        } else {
            // User is not a seller, show registration
            settingsModal.style.display = 'none';
            document.getElementById('sellerRegistrationModal').style.display = 'block';
        }
    });

    document.getElementById('sellerRegistrationForm').addEventListener('submit', handleSellerRegistration);
    document.getElementById('addProductForm').addEventListener('submit', handleAddProduct);
    document.getElementById('updateStoreProfileForm').addEventListener('submit', handleUpdateStoreProfile);
    document.getElementById('updatePaymentMethodsForm').addEventListener('submit', handleUpdatePaymentMethods);

    // File upload events
    document.getElementById('ktpPhoto').addEventListener('change', handleKTPUpload);
    document.getElementById('productImage').addEventListener('change', handleProductImageUpload);

    // Dashboard tab events
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.target.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    // Order filter event
    document.getElementById('orderStatusFilter').addEventListener('change', filterOrders);

    // Cart Events
    cartBtn.addEventListener('click', toggleCart);

    // Search functionality
    searchInput.addEventListener('input', searchProducts);
}

// Seller Registration Functions
function handleSellerRegistration(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showAlert('You must be logged in to register as a seller', 'error');
        return;
    }

    const storeName = document.getElementById('storeName').value.trim();
    const sellerPhone = document.getElementById('sellerPhone').value.trim();
    const sellerAddress = document.getElementById('sellerAddress').value.trim();
    const sellerDescription = document.getElementById('sellerDescription').value.trim();
    const ktpPhoto = document.getElementById('ktpPhoto').files[0];
    const agreeTerms = document.getElementById('agreeTerms').checked;
    const messageElement = document.getElementById('sellerRegistrationMessage');

    // Payment methods validation
    const paymentMethods = {
        BCA: {
            enabled: document.getElementById('paymentBCA').checked,
            accountNumber: document.getElementById('bcAccountNumber').value.trim()
        },
        Mandiri: {
            enabled: document.getElementById('paymentMandiri').checked,
            accountNumber: document.getElementById('mandiriAccountNumber').value.trim()
        },
        BNI: {
            enabled: document.getElementById('paymentBNI').checked,
            accountNumber: document.getElementById('bniAccountNumber').value.trim()
        },
        BRI: {
            enabled: document.getElementById('paymentBRI').checked,
            accountNumber: document.getElementById('briAccountNumber').value.trim()
        }
    };

    // Check if at least one payment method is enabled
    const enabledMethods = Object.values(paymentMethods).filter(method => method.enabled);
    if (enabledMethods.length === 0) {
        showMessage(messageElement, 'Please enable at least one payment method', 'error');
        return;
    }

    // Validate account numbers for enabled methods
    for (const [bank, method] of Object.entries(paymentMethods)) {
        if (method.enabled && !method.accountNumber) {
            showMessage(messageElement, `Please enter account number for ${bank}`, 'error');
            return;
        }
    }

    // Validation
    if (!storeName || !sellerPhone || !sellerAddress) {
        showMessage(messageElement, 'Please fill in all required fields', 'error');
        return;
    }

    if (!ktpPhoto) {
        showMessage(messageElement, 'Please upload your KTP photo', 'error');
        return;
    }

    if (!agreeTerms) {
        showMessage(messageElement, 'Please agree to the terms and conditions', 'error');
        return;
    }

    if (!isValidPhone(sellerPhone)) {
        showMessage(messageElement, 'Please enter a valid phone number', 'error');
        return;
    }

    // Convert KTP photo to base64
    const reader = new FileReader();
    reader.onload = function(e) {
        const ktpBase64 = e.target.result;
        
        // Create seller data
        const sellerData = {
            username: currentUser.username,
            storeName,
            sellerPhone,
            sellerAddress,
            sellerDescription,
            ktpPhoto: ktpBase64,
            paymentMethods,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        // Save seller data
        const sellers = JSON.parse(localStorage.getItem('sellers')) || [];
        sellers.push(sellerData);
        localStorage.setItem('sellers', JSON.stringify(sellers));

        // Update current user
        currentUser.isSeller = true;
        currentUser.sellerData = sellerData;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Show success message
        showMessage(messageElement, 'Seller registration submitted successfully! Your application is under review.', 'success');

        // Close modal and reset form
        setTimeout(() => {
            document.getElementById('sellerRegistrationModal').style.display = 'none';
            document.getElementById('sellerRegistrationForm').reset();
            document.getElementById('ktpPreview').innerHTML = '';
            showSellerDashboard();
        }, 2000);
    };
    reader.readAsDataURL(ktpPhoto);
}

function handleKTPUpload(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('ktpPreview');
    
    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            showAlert('File size should be less than 5MB', 'error');
            e.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="KTP Preview">`;
        };
        reader.readAsDataURL(file);
    }
}

function handleProductImageUpload(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('productImagePreview');
    
    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            showAlert('File size should be less than 5MB', 'error');
            e.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Product Preview">`;
        };
        reader.readAsDataURL(file);
    }
}

// Seller Dashboard Functions
function showSellerDashboard() {
    if (!currentUser || !currentUser.isSeller) {
        showAlert('You must be a registered seller to access the dashboard', 'error');
        return;
    }

    // Load seller data
    const sellers = JSON.parse(localStorage.getItem('sellers')) || [];
    const sellerData = sellers.find(s => s.username === currentUser.username);
    
    if (sellerData) {
        document.getElementById('dashboardStoreName').textContent = sellerData.storeName;
        document.getElementById('dashboardStoreStatus').innerHTML = `Status: <span class="status-active">${sellerData.status}</span>`;
        
        // Load seller products
        loadSellerProducts();
        
        // Show dashboard
        document.getElementById('sellerDashboardModal').style.display = 'block';
    }
}

function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Add active class to clicked button
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Load specific data based on tab
    switch(tabName) {
        case 'products':
            loadSellerProducts();
            break;
        case 'orders':
            loadSellerOrders();
            break;
        case 'payments':
            loadPaymentMethods();
            break;
        case 'profile':
            // Profile data is already loaded when dashboard opens
            break;
    }
}

function showAddProductTab() {
    switchTab('add-product');
}

function loadSellerProducts() {
    const sellerProducts = JSON.parse(localStorage.getItem('sellerProducts')) || [];
    const userProducts = sellerProducts.filter(p => p.sellerUsername === currentUser.username);
    const productsList = document.getElementById('sellerProductsList');
    
    if (userProducts.length === 0) {
        productsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No products yet. Add your first product!</p>';
        return;
    }
    
    productsList.innerHTML = userProducts.map(product => `
        <div class="seller-product-card">
            <img src="${product.image}" alt="${product.name}" class="seller-product-image">
            <div class="seller-product-info">
                <h4>${product.name}</h4>
                <p>${product.description}</p>
                <div class="seller-product-price">$${product.price.toFixed(2)}</div>
                <div class="seller-product-actions">
                    <button class="edit-product-btn" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-product-btn" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function handleAddProduct(e) {
    e.preventDefault();
    
    if (!currentUser || !currentUser.isSeller) {
        showAlert('You must be a registered seller to add products', 'error');
        return;
    }

    const productName = document.getElementById('productName').value.trim();
    const productPrice = parseFloat(document.getElementById('productPrice').value);
    const productDescription = document.getElementById('productDescription').value.trim();
    const productCategory = document.getElementById('productCategory').value;
    const productStock = parseInt(document.getElementById('productStock').value);
    const productImage = document.getElementById('productImage').files[0];
    const messageElement = document.getElementById('addProductMessage');

    // Validation
    if (!productName || !productPrice || !productDescription || !productStock || !productImage) {
        showMessage(messageElement, 'Please fill in all required fields', 'error');
        return;
    }

    if (productPrice <= 0) {
        showMessage(messageElement, 'Price must be greater than 0', 'error');
        return;
    }

    if (productStock < 0) {
        showMessage(messageElement, 'Stock quantity cannot be negative', 'error');
        return;
    }

    // Convert image to base64
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageBase64 = e.target.result;
        
        // Create product data
        const productData = {
            id: Date.now(),
            name: productName,
            price: productPrice,
            description: productDescription,
            category: productCategory,
            stock: productStock,
            image: imageBase64,
            sellerUsername: currentUser.username,
            createdAt: new Date().toISOString()
        };

        // Save product to seller products
        const sellerProducts = JSON.parse(localStorage.getItem('sellerProducts')) || [];
        sellerProducts.push(productData);
        localStorage.setItem('sellerProducts', JSON.stringify(sellerProducts));

        // Show success message
        showMessage(messageElement, 'Product added successfully! It will now appear on the main page.', 'success');

        // Reset form
        document.getElementById('addProductForm').reset();
        document.getElementById('productImagePreview').innerHTML = '';

        // Switch to products tab and reload
        setTimeout(() => {
            switchTab('products');
            loadSellerProducts();
            // Refresh main products page
            loadProducts();
        }, 1000);
    };
    reader.readAsDataURL(productImage);
}

function editProduct(productId) {
    // Implementation for editing product
    showAlert('Edit functionality will be implemented soon!', 'info');
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        // Remove from seller products
        const sellerProducts = JSON.parse(localStorage.getItem('sellerProducts')) || [];
        const updatedSellerProducts = sellerProducts.filter(p => p.id !== productId);
        localStorage.setItem('sellerProducts', JSON.stringify(updatedSellerProducts));

        // Remove from main products
        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            products.splice(productIndex, 1);
        }

        // Reload products
        loadSellerProducts();
        loadProducts(); // Reload main products display
        showAlert('Product deleted successfully!', 'success');
    }
}

function handleUpdateStoreProfile(e) {
    e.preventDefault();
    
    if (!currentUser || !currentUser.isSeller) {
        showAlert('You must be a registered seller to update store profile', 'error');
        return;
    }

    const updateStoreName = document.getElementById('updateStoreName').value.trim();
    const updateStorePhone = document.getElementById('updateStorePhone').value.trim();
    const updateStoreAddress = document.getElementById('updateStoreAddress').value.trim();
    const updateStoreDescription = document.getElementById('updateStoreDescription').value.trim();
    const messageElement = document.getElementById('updateProfileMessage');

    // Update seller data
    const sellers = JSON.parse(localStorage.getItem('sellers')) || [];
    const sellerIndex = sellers.findIndex(s => s.username === currentUser.username);
    
    if (sellerIndex !== -1) {
        if (updateStoreName) sellers[sellerIndex].storeName = updateStoreName;
        if (updateStorePhone) sellers[sellerIndex].sellerPhone = updateStorePhone;
        if (updateStoreAddress) sellers[sellerIndex].sellerAddress = updateStoreAddress;
        if (updateStoreDescription) sellers[sellerIndex].sellerDescription = updateStoreDescription;

        localStorage.setItem('sellers', JSON.stringify(sellers));

        // Update current user
        currentUser.sellerData = sellers[sellerIndex];
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Update dashboard display
        document.getElementById('dashboardStoreName').textContent = sellers[sellerIndex].storeName;

        showMessage(messageElement, 'Store profile updated successfully!', 'success');
        
        // Reset form
        document.getElementById('updateStoreProfileForm').reset();
    }
}

// Payment Methods Functions
function handleUpdatePaymentMethods(e) {
    e.preventDefault();
    
    if (!currentUser || !currentUser.isSeller) {
        showAlert('You must be a registered seller to update payment methods', 'error');
        return;
    }

    const paymentMethods = {
        BCA: {
            enabled: document.getElementById('updatePaymentBCA').checked,
            accountNumber: document.getElementById('updateBcaAccountNumber').value.trim()
        },
        Mandiri: {
            enabled: document.getElementById('updatePaymentMandiri').checked,
            accountNumber: document.getElementById('updateMandiriAccountNumber').value.trim()
        },
        BNI: {
            enabled: document.getElementById('updatePaymentBNI').checked,
            accountNumber: document.getElementById('updateBniAccountNumber').value.trim()
        },
        BRI: {
            enabled: document.getElementById('updatePaymentBRI').checked,
            accountNumber: document.getElementById('updateBriAccountNumber').value.trim()
        }
    };

    // Check if at least one payment method is enabled
    const enabledMethods = Object.values(paymentMethods).filter(method => method.enabled);
    if (enabledMethods.length === 0) {
        showAlert('Please enable at least one payment method', 'error');
        return;
    }

    // Validate account numbers for enabled methods
    for (const [bank, method] of Object.entries(paymentMethods)) {
        if (method.enabled && !method.accountNumber) {
            showAlert(`Please enter account number for ${bank}`, 'error');
            return;
        }
    }

    // Update seller data
    const sellers = JSON.parse(localStorage.getItem('sellers')) || [];
    const sellerIndex = sellers.findIndex(s => s.username === currentUser.username);
    
    if (sellerIndex !== -1) {
        sellers[sellerIndex].paymentMethods = paymentMethods;
        localStorage.setItem('sellers', JSON.stringify(sellers));

        // Update current user
        currentUser.sellerData = sellers[sellerIndex];
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        showAlert('Payment methods updated successfully!', 'success');
    }
}

function loadPaymentMethods() {
    if (!currentUser || !currentUser.isSeller) return;

    const sellers = JSON.parse(localStorage.getItem('sellers')) || [];
    const sellerData = sellers.find(s => s.username === currentUser.username);
    
    if (sellerData && sellerData.paymentMethods) {
        const methods = sellerData.paymentMethods;
        
        // Update checkboxes
        document.getElementById('updatePaymentBCA').checked = methods.BCA?.enabled || false;
        document.getElementById('updatePaymentMandiri').checked = methods.Mandiri?.enabled || false;
        document.getElementById('updatePaymentBNI').checked = methods.BNI?.enabled || false;
        document.getElementById('updatePaymentBRI').checked = methods.BRI?.enabled || false;
        
        // Update account numbers
        document.getElementById('updateBcaAccountNumber').value = methods.BCA?.accountNumber || '';
        document.getElementById('updateMandiriAccountNumber').value = methods.Mandiri?.accountNumber || '';
        document.getElementById('updateBniAccountNumber').value = methods.BNI?.accountNumber || '';
        document.getElementById('updateBriAccountNumber').value = methods.BRI?.accountNumber || '';
    }
}

// Order Management Functions
function loadSellerOrders() {
    if (!currentUser || !currentUser.isSeller) return;

    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const sellerOrders = orders.filter(order => 
        order.items.some(item => item.sellerUsername === currentUser.username)
    );

    const ordersList = document.getElementById('sellerOrdersList');
    
    if (sellerOrders.length === 0) {
        ordersList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No orders yet. Orders will appear here when customers purchase your products.</p>';
        return;
    }

    ordersList.innerHTML = sellerOrders.map(order => {
        const sellerItems = order.items.filter(item => item.sellerUsername === currentUser.username);
        const total = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Payment status display
        let paymentStatus = '';
        if (order.paymentStatus === 'pending_confirmation') {
            paymentStatus = '<span class="payment-status pending">Awaiting Transfer</span>';
        } else if (order.paymentStatus === 'confirmed') {
            paymentStatus = '<span class="payment-status confirmed">Payment Confirmed</span>';
        } else {
            paymentStatus = '<span class="payment-status unknown">Payment Unknown</span>';
        }
        
        return `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <div class="order-id">Order #${order.id}</div>
                        <div class="order-date">${new Date(order.date).toLocaleDateString()}</div>
                        ${order.paymentMethod ? `<div class="payment-info">Payment: ${order.paymentMethod} - ${order.paymentAccount}</div>` : ''}
                    </div>
                    <div style="text-align: right;">
                        <span class="order-status ${order.status}">${order.status}</span>
                        ${paymentStatus}
                    </div>
                </div>
                
                <div class="order-customer">
                    <div class="customer-name">${order.customerName}</div>
                    <div class="customer-phone">${order.customerPhone}</div>
                </div>
                
                <div class="order-items">
                    ${sellerItems.map(item => `
                        <div class="order-item">
                            <img src="${item.image}" alt="${item.name}">
                            <div class="order-item-details">
                                <div class="order-item-name">${item.name}</div>
                                <div class="order-item-price">$${item.price.toFixed(2)}</div>
                            </div>
                            <div class="order-item-quantity">Qty: ${item.quantity}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="order-total">
                    <span class="total-label">Total:</span>
                    <span class="total-amount">$${total.toFixed(2)}</span>
                </div>
                
                <div class="order-actions">
                    <button class="order-action-btn print-receipt-btn" onclick="printReceipt('${order.id}')">
                        <i class="fas fa-print"></i> Print Receipt
                    </button>
                    <button class="order-action-btn update-status-btn" onclick="updateOrderStatus('${order.id}')">
                        <i class="fas fa-edit"></i> Update Status
                    </button>
                    ${order.paymentStatus === 'pending_confirmation' ? `
                        <button class="order-action-btn confirm-payment-btn" onclick="confirmPaymentReceived('${order.id}')">
                            <i class="fas fa-check"></i> Confirm Payment
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function printReceipt(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        showAlert('Order not found', 'error');
        return;
    }

    const sellerItems = order.items.filter(item => item.sellerUsername === currentUser.username);
    const total = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const sellers = JSON.parse(localStorage.getItem('sellers')) || [];
    const sellerData = sellers.find(s => s.username === currentUser.username);
    
    const receiptContent = `
        <div class="receipt-content">
            <div class="receipt-header">
                <div class="receipt-title">${sellerData?.storeName || 'Store'}</div>
                <div>Receipt</div>
            </div>
            
            <div class="receipt-info">
                <div>
                    <strong>Order ID:</strong> ${order.id}<br>
                    <strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}<br>
                    <strong>Time:</strong> ${new Date(order.date).toLocaleTimeString()}
                </div>
                <div>
                    <strong>Customer:</strong> ${order.customerName}<br>
                    <strong>Phone:</strong> ${order.customerPhone}<br>
                    <strong>Status:</strong> ${order.status}
                </div>
            </div>
            
            <div class="receipt-items">
                <h4>Items:</h4>
                ${sellerItems.map(item => `
                    <div class="receipt-item">
                        <span>${item.name} x${item.quantity}</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="receipt-total">
                Total: $${total.toFixed(2)}
            </div>
            
            <div class="receipt-footer">
                Thank you for your purchase!<br>
                ${sellerData?.storeName || 'Store'}
            </div>
        </div>
    `;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Receipt - Order ${orderId}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                    .receipt-content { max-width: 400px; margin: 0 auto; }
                    .receipt-header { text-align: center; margin-bottom: 2rem; border-bottom: 2px solid #000; padding-bottom: 1rem; }
                    .receipt-title { font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem; }
                    .receipt-info { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
                    .receipt-items { margin-bottom: 2rem; }
                    .receipt-item { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #ccc; }
                    .receipt-total { font-weight: bold; font-size: 1.2rem; text-align: right; border-top: 2px solid #000; padding-top: 1rem; }
                    .receipt-footer { text-align: center; margin-top: 2rem; font-size: 0.9rem; color: #666; }
                </style>
            </head>
            <body>
                ${receiptContent}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

function updateOrderStatus(orderId) {
    const statusOptions = ['pending', 'paid', 'shipped', 'delivered'];
    const currentStatus = prompt('Enter new status (pending/paid/shipped/delivered):');
    
    if (!currentStatus || !statusOptions.includes(currentStatus.toLowerCase())) {
        showAlert('Invalid status. Please use: pending, paid, shipped, or delivered', 'error');
        return;
    }

    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = currentStatus.toLowerCase();
        localStorage.setItem('orders', JSON.stringify(orders));
        
        showAlert('Order status updated successfully!', 'success');
        loadSellerOrders(); // Reload orders
    }
}

function confirmPaymentReceived(orderId) {
    if (confirm('Confirm that you have received the payment for this order?')) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const orderIndex = orders.findIndex(o => o.id === orderId);
        
        if (orderIndex !== -1) {
            orders[orderIndex].paymentStatus = 'confirmed';
            orders[orderIndex].status = 'paid';
            localStorage.setItem('orders', JSON.stringify(orders));
            
            showAlert('Payment confirmed! Order status updated to paid.', 'success');
            loadSellerOrders(); // Reload orders
        }
    }
}

function filterOrders() {
    const statusFilter = document.getElementById('orderStatusFilter').value.toLowerCase();
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const filteredOrders = orders.filter(order => 
        order.status.toLowerCase().includes(statusFilter)
    );
    
    loadSellerOrders();
    showAlert(`${filteredOrders.length} orders found matching the filter.`, 'success');
}