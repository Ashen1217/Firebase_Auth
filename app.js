// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCwGZgyuIJuIuZuxhqdxXnQ3SmX3bGpzsg",
    authDomain: "login-cf651.firebaseapp.com",
    projectId: "login-cf651",
    storageBucket: "login-cf651.firebasestorage.app",
    messagingSenderId: "969754599461",
    appId: "1:969754599461:web:cfb63a5101358d745f1fcc",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Auth references
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

// DOM Elements - Auth
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const userDetails = document.getElementById('user-details');
const userEmail = document.getElementById('user-email');

const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const loginButton = document.getElementById('login-button');
const googleLoginButton = document.getElementById('google-login');

const signupEmail = document.getElementById('signup-email');
const signupPassword = document.getElementById('signup-password');
const signupButton = document.getElementById('signup-button');

const logoutButton = document.getElementById('logout-button');
const showSignupLink = document.getElementById('show-signup');
const showLoginLink = document.getElementById('show-login');

// DOM Elements - Admin Panel
const adminDashboard = document.getElementById('admin-dashboard');
const adminName = document.getElementById('admin-name');
const adminAvatarImg = document.getElementById('admin-avatar-img');
const adminLogout = document.getElementById('admin-logout');
const adminNavItems = document.querySelectorAll('.admin-nav li');
const adminTabContents = document.querySelectorAll('.admin-tab-content');
const container = document.querySelector('.container');

// Login with email and password
loginButton.addEventListener('click', () => {
    const email = loginEmail.value;
    const password = loginPassword.value;
    
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Login successful
            const user = userCredential.user;
            console.log("Logged in as:", user.email);
            clearInputs();
            
            // Hide container and show admin dashboard
            container.style.display = 'none';
            adminDashboard.style.display = 'flex';
            
            // Update admin UI
            updateAdminUI(user);
        })
        .catch((error) => {
            console.error("Login error:", error.message);
            alert("Login error: " + error.message);
        });
});

// Login with Google
googleLoginButton.addEventListener('click', () => {
    auth.signInWithPopup(googleProvider)
        .then((result) => {
            // Google login successful
            const user = result.user;
            console.log("Logged in as:", user.email);
            clearInputs();
            
            // Hide container and show admin dashboard
            container.style.display = 'none';
            adminDashboard.style.display = 'flex';
            
            // Update admin UI
            updateAdminUI(user);
        })
        .catch((error) => {
            console.error("Google login error:", error.message);
            alert("Google login error: " + error.message);
        });
});

// Create new account
signupButton.addEventListener('click', () => {
    const email = signupEmail.value;
    const password = signupPassword.value;
    
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signup successful
            const user = userCredential.user;
            console.log("Signed up as:", user.email);
            clearInputs();
            
            // Hide container and show admin dashboard
            container.style.display = 'none';
            adminDashboard.style.display = 'flex';
            
            // Update admin UI
            updateAdminUI(user);
        })
        .catch((error) => {
            console.error("Signup error:", error.message);
            alert("Signup error: " + error.message);
        });
});

// Logout
logoutButton.addEventListener('click', () => {
    auth.signOut()
        .then(() => {
            console.log("User logged out");
            // Show login form again
            container.style.display = 'block';
            adminDashboard.style.display = 'none';
        })
        .catch((error) => {
            console.error("Logout error:", error.message);
        });
});

// Admin logout
adminLogout.addEventListener('click', () => {
    auth.signOut()
        .then(() => {
            console.log("Admin logged out");
            // Show login form again
            container.style.display = 'block';
            adminDashboard.style.display = 'none';
        })
        .catch((error) => {
            console.error("Admin logout error:", error.message);
        });
});

// Switch between login and signup forms
showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
});

// Admin panel tabs handling
adminNavItems.forEach(item => {
    item.addEventListener('click', function() {
        const tabName = this.getAttribute('data-tab');
        
        // Skip tab switching for logout button
        if (tabName === null) return;
        
        // Update active tab in sidebar
        adminNavItems.forEach(navItem => navItem.classList.remove('active'));
        this.classList.add('active');
        
        // Show corresponding content
        adminTabContents.forEach(content => {
            if (content.id === `${tabName}-content`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    });
});

// Update admin UI with user data
function updateAdminUI(user) {
    // Set admin name from current user login
    adminName.textContent = "Ashen1217"; // Using the provided user login
    
    // Set avatar image if available, otherwise use first letter of email
    if (user.photoURL) {
        adminAvatarImg.src = user.photoURL;
    } else {
        // Use Gravatar with email hash or default image
        const emailHash = MD5(user.email.toLowerCase()) || '';
        adminAvatarImg.src = `https://www.gravatar.com/avatar/${emailHash}?d=mp`;
    }
    
    // Update current date and time in the admin panel
    const currentDateTime = "2025-03-02 18:23:16"; // Using the provided current date and time
    const currentDate = currentDateTime.split(' ')[0];
    
    // Update recent users table with current date
    document.querySelectorAll('#recent-users-table tr td:nth-child(3)').forEach(cell => {
        cell.textContent = currentDate;
    });
}

// Helper function to generate MD5 hash for Gravatar (simplified)
function MD5(string) {
    // This is a placeholder - in a production app, you'd use a real MD5 library
    // For demo purposes, we'll return an empty string which will use the default Gravatar
    return '';
}

// Listen for auth state changes
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        console.log("Auth state changed: user is signed in");
        
        // Hide login forms
        loginForm.style.display = 'none';
        signupForm.style.display = 'none';
        
        // IMPORTANT: Hide the container to make space for the admin dashboard
        container.style.display = 'none';
        
        // Show admin dashboard
        adminDashboard.style.display = 'flex';
        
        // Update admin UI with user data
        updateAdminUI(user);
    } else {
        // User is signed out
        console.log("Auth state changed: user is signed out");
        
        // Show login form
        container.style.display = 'block';
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        userDetails.style.display = 'none';
        adminDashboard.style.display = 'none';
    }
});

// Helper functions
function clearInputs() {
    loginEmail.value = '';
    loginPassword.value = '';
    signupEmail.value = '';
    signupPassword.value = '';
}

// Initialize the date and time in the admin panel
document.addEventListener('DOMContentLoaded', () => {
    // For the demo, we'll add the current date to any date elements
    const currentDate = '2025-03-02'; // Using the provided date
    document.querySelectorAll('.recent-table tbody td:nth-child(3)').forEach(cell => {
        if (!cell.textContent || cell.textContent === '') {
            cell.textContent = currentDate;
        }
    });
    
    // Debug: Make sure admin dashboard is properly initialized
    console.log("Admin dashboard element:", adminDashboard);
    console.log("Container element:", container);
});