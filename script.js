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
    });

    themeToggle.addEventListener('change', toggleTheme);
    
    logoutBtn.addEventListener('click', handleLogout);
}

// Product functions
function loadProducts() {
    productsContainer.innerHTML = '';
    
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="price">$${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productsContainer.appendChild(productElement);
    });
}

function searchProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productName = card.querySelector('h3').textContent.toLowerCase();
        const productDesc = card.querySelector('p').textContent.toLowerCase();
        
        if (productName.includes(searchTerm) || productDesc.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Cart functions
function addToCart(productId) {
    if (!currentUser) {
        showAlert('Please login to add items to cart', 'error');
        return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

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

function checkout() {
    if (!currentUser) {
        showAlert('Please login to checkout', 'error');
        return;
    }

    if (cart.length === 0) {
        showAlert('Your cart is empty', 'error');
        return;
    }

    // Clear cart
    cart = [];
    saveUserCart();
    updateCart();
    
    showAlert('Order placed successfully!', 'success');
    cartSidebar.classList.remove('open');
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
    });

    // Form Submit Events
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('forgotPasswordForm').addEventListener('submit', handleForgotPassword);
    document.getElementById('resetPasswordForm').addEventListener('submit', handleResetPassword);
    document.getElementById('changePasswordForm').addEventListener('submit', handleChangePassword);
    document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);

    // Cart Events
    cartBtn.addEventListener('click', toggleCart);

    // Search functionality
    searchInput.addEventListener('input', searchProducts);
}