// Sample products data (in a real application, this would come from a backend)
const products = [
    {
        id: 1,
        name: "Smartphone X",
        price: 699.99,
        image: "https://via.placeholder.com/300x200",
        description: "Latest smartphone with amazing features"
    },
    {
        id: 2,
        name: "Laptop Pro",
        price: 1299.99,
        image: "https://via.placeholder.com/300x200",
        description: "Powerful laptop for professionals"
    },
    // Add more products as needed
];

// User authentication state
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];

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

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCartCount();
    setupEventListeners();
    setupSettingsModal();
    initTheme();
    checkUserSession(); // Check for existing session on page load
});

function checkUserSession() {
    if (currentUser) {
        // User is logged in, update UI
        loginBtn.style.display = 'none';
        settingsBtn.style.display = 'inline';
        profileBtn.style.display = 'inline';
        loginBtn.textContent = `Welcome, ${currentUser.username}`;
    }
}

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Restore user's cart if it exists
        if (user.cart) {
            cart = user.cart;
            updateCart();
        }

        // Load saved profile image if exists
        const savedImage = localStorage.getItem(`profileImage_${username}`);
        if (savedImage) {
            user.profileImage = savedImage;
        }

        // Set current user with all saved data
        currentUser = {
            ...user,
            profileImage: user.profileImage || savedImage || 'https://via.placeholder.com/150',
            gender: user.gender || '',
            phone: user.phone || '',
            email: user.email || '',
            birthDate: user.birthDate || '',
            cart: user.cart || [],
            password: user.password // Ensure password is included
        };

        // Save current user
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update UI
        loginModal.style.display = 'none';
        loginBtn.style.display = 'none';
        settingsBtn.style.display = 'inline';
        profileBtn.style.display = 'inline';
        loginBtn.textContent = `Welcome, ${user.username}`;
        
        alert('Login successful!');
    } else {
        alert('Invalid credentials!');
    }
}

function handleLogout() {
    // Save cart to user data before logout
    if (currentUser) {
        const updatedUser = {
            ...currentUser,
            cart: cart
        };
        saveUserData(updatedUser);
    }

    currentUser = null;
    localStorage.removeItem('currentUser');
    loginBtn.style.display = 'inline';
    settingsBtn.style.display = 'none';
    profileBtn.style.display = 'none';
    loginBtn.textContent = 'Login';
    cart = [];
    updateCart();
    settingsModal.style.display = 'none';
    profileModal.style.display = 'none';
    
    // Clear any open modals
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    
    alert('Logged out successfully!');
}

function saveUserData(userData) {
    try {
        // Save to currentUser
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Update in users array
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.username === userData.username);
        if (userIndex !== -1) {
            // Preserve existing data and merge with updates
            const existingUser = users[userIndex];
            users[userIndex] = {
                ...existingUser,
                ...userData,
                profileImage: userData.profileImage || existingUser.profileImage,
                gender: userData.gender || existingUser.gender,
                phone: userData.phone || existingUser.phone,
                email: userData.email || existingUser.email,
                birthDate: userData.birthDate || existingUser.birthDate,
                cart: userData.cart || existingUser.cart,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        // Update currentUser variable
        currentUser = userData;
        
        return true;
    } catch (error) {
        console.error('Error saving user data:', error);
        return false;
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
    productsContainer.innerHTML = products.map(product => `
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

function searchProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredProducts = products.filter(product =>
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

    const product = products.find(p => p.id === productId);
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

    // Save cart to user's data
    if (currentUser) {
        const updatedUser = {
            ...currentUser,
            cart: cart
        };
        saveUserData(updatedUser);
    }

    updateCart();
    alert('Product added to cart!');
}

function updateCart() {
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart in user data
    if (currentUser) {
        const updatedUser = {
            ...currentUser,
            cart: cart
        };
        saveUserData(updatedUser);
    }
    
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
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                <button onclick="removeFromCart(${item.productId})">Remove</button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
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

function checkout() {
    if (!currentUser) {
        alert('Please login to checkout');
        return;
    }

    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // In a real application, this would process the payment and create an order
    alert('Order placed successfully!');
    cart = [];
    updateCart();
    cartSidebar.classList.remove('active');
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
            // Update all profile fields
            document.getElementById('profileUsername').textContent = user.username;
            document.getElementById('profilePhone').value = user.phone || '';
            document.getElementById('profileEmail').value = user.email || '';
            document.getElementById('profileGender').value = user.gender || '';
            document.getElementById('profileBirthDate').value = user.birthDate || '';
            
            // Load profile image with fallback options
            const profileImage = document.getElementById('profileImage');
            const savedImage = localStorage.getItem(`profileImage_${user.username}`);
            
            if (savedImage) {
                profileImage.src = savedImage;
            } else if (user.profileImage) {
                profileImage.src = user.profileImage;
                // Save to separate storage for redundancy
                localStorage.setItem(`profileImage_${user.username}`, user.profileImage);
            } else {
                profileImage.src = 'https://via.placeholder.com/150';
            }
        }
    } catch (error) {
        console.error('Error loading profile data:', error);
        showMessage(document.getElementById('profileMessage'), 'Error loading profile data', 'error');
    }
}

function handleImageUpload(e) {
    try {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.match('image/(jpeg|png)')) {
                showMessage(document.getElementById('profileMessage'), 'Please select a JPG or PNG image file', 'error');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showMessage(document.getElementById('profileMessage'), 'Image size should be less than 5MB', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = e.target.result;
                
                // Update user data with new image
                const user = JSON.parse(localStorage.getItem('currentUser')) || currentUser;
                if (user) {
                    const updatedUser = {
                        ...user,
                        profileImage: imageData,
                        lastUpdated: new Date().toISOString()
                    };
                    
                    // Save to both currentUser and users array
                    if (saveUserData(updatedUser)) {
                        // Update the image display
                        document.getElementById('profileImage').src = imageData;
                        showMessage(document.getElementById('profileMessage'), 'Profile image updated successfully!', 'success');
                        
                        // Save image data to localStorage separately for redundancy
                        localStorage.setItem(`profileImage_${user.username}`, imageData);
                    }
                }
            };
            reader.onerror = function() {
                showMessage(document.getElementById('profileMessage'), 'Error reading image file', 'error');
            };
            reader.readAsDataURL(file);
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        showMessage(document.getElementById('profileMessage'), 'Error uploading image', 'error');
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
            profileImage: user.profileImage || 'https://via.placeholder.com/150',
            cart: user.cart || [],
            lastUpdated: new Date().toISOString()
        };

        // Save updated data
        if (saveUserData(updatedUser)) {
            messageElement.style.display = 'block';
            messageElement.className = 'message-animation success';
            messageElement.innerHTML = `
                <i class="fas fa-check-circle"></i>
                Profile updated successfully!
            `;
            
            // Hide message after 3 seconds with fade out animation
            setTimeout(() => {
                messageElement.style.opacity = '0';
                setTimeout(() => {
                    messageElement.style.display = 'none';
                    messageElement.style.opacity = '1';
                }, 300);
            }, 3000);
        } else {
            throw new Error('Failed to save profile data');
        }

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
    }
    if (cart.length > 0) {
        localStorage.setItem('cart', JSON.stringify(cart));
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
        closeBtn.addEventListener('click', () => {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
            settingsModal.style.display = 'none';
            profileModal.style.display = 'none';
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