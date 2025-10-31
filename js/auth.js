/**
 * Authentication System for BookVault
 * Simple localStorage-based authentication
 */

// Get users from localStorage or initialize empty array
function getUsers() {
    const usersStr = localStorage.getItem('bookVaultUsers');
    return usersStr ? JSON.parse(usersStr) : [];
}

// Save users to localStorage
function saveUsers(users) {
    localStorage.setItem('bookVaultUsers', JSON.stringify(users));
}

// Get current user
function getCurrentUser() {
    const userStr = sessionStorage.getItem('bookVaultCurrentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// Set current user
function setCurrentUser(user) {
    if (user) {
        sessionStorage.setItem('bookVaultCurrentUser', JSON.stringify(user));
    } else {
        sessionStorage.removeItem('bookVaultCurrentUser');
    }
}

// Register new user
function registerUser(username, email, password) {
    const users = getUsers();
    
    // Check if username or email already exists
    if (users.some(u => u.username === username || u.email === email)) {
        return { success: false, message: 'Username or email already exists' };
    }
    
    // Validate password
    if (password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters' };
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password, // In production, this should be hashed
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    // Auto login
    setCurrentUser({ username: newUser.username, email: newUser.email, id: newUser.id });
    
    return { success: true, message: 'Registration successful!', user: newUser };
}

// Login user
function loginUser(username, password) {
    const users = getUsers();
    const user = users.find(u => (u.username === username || u.email === username) && u.password === password);
    
    if (!user) {
        return { success: false, message: 'Invalid username or password' };
    }
    
    setCurrentUser({ username: user.username, email: user.email, id: user.id });
    return { success: true, message: 'Login successful!', user };
}

// Logout user
function logoutUser() {
    setCurrentUser(null);
    return { success: true, message: 'Logged out successfully' };
}

// Check if user is logged in
function isLoggedIn() {
    return getCurrentUser() !== null;
}

