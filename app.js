// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCwGZgyuIuZuxhqdxXnQ3SmX3bGpzsg",
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

// DOM Elements
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

// Login with email and password
loginButton.addEventListener('click', () => {
    const email = loginEmail.value;
    const password = loginPassword.value;
    
    // Show loading state
    loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    loginButton.disabled = true;
    
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Login successful
            const user = userCredential.user;
            console.log("Logged in as:", user.email);
            clearInputs();
        })
        .catch((error) => {
            console.error("Login error:", error.message);
            alert("Login error: " + error.message);
            // Reset button state
            loginButton.innerHTML = 'Login';
            loginButton.disabled = false;
        });
});

// Login with Google
googleLoginButton.addEventListener('click', () => {
    // Show loading state
    googleLoginButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Connecting...';
    googleLoginButton.disabled = true;
    
    auth.signInWithPopup(googleProvider)
        .then((result) => {
            // Google login successful
            const user = result.user;
            console.log("Logged in as:", user.email);
            clearInputs();
        })
        .catch((error) => {
            console.error("Google login error:", error.message);
            alert("Google login error: " + error.message);
            // Reset button state
            googleLoginButton.innerHTML = '<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" class="w-5 h-5 mr-2"> Login with Google';
            googleLoginButton.disabled = false;
        });
});

// Create new account
signupButton.addEventListener('click', () => {
    const email = signupEmail.value;
    const password = signupPassword.value;
    
    // Show loading state
    signupButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
    signupButton.disabled = true;
    
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signup successful
            const user = userCredential.user;
            console.log("Signed up as:", user.email);
            clearInputs();
        })
        .catch((error) => {
            console.error("Signup error:", error.message);
            alert("Signup error: " + error.message);
            // Reset button state
            signupButton.innerHTML = 'Sign Up';
            signupButton.disabled = false;
        });
});

// Logout
logoutButton.addEventListener('click', () => {
    // Show loading state
    logoutButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging out...';
    logoutButton.disabled = true;
    
    auth.signOut()
        .then(() => {
            console.log("User logged out");
        })
        .catch((error) => {
            console.error("Logout error:", error.message);
            // Reset button state
            logoutButton.innerHTML = 'Logout';
            logoutButton.disabled = false;
        });
});

// Switch between login and signup forms
showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    signupForm.classList.add('fade-in');
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
    loginForm.classList.add('fade-in');
});

// Listen for auth state changes
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        loginForm.style.display = 'none';
        signupForm.style.display = 'none';
        userDetails.style.display = 'block';
        userDetails.classList.add('fade-in');
        userEmail.textContent = `Logged in as: ${user.email}`;
        
        // Reset all button states
        resetButtonStates();
    } else {
        // User is signed out
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        userDetails.style.display = 'none';
        loginForm.classList.add('fade-in');
        
        // Reset all button states
        resetButtonStates();
    }
});

// Helper functions
function clearInputs() {
    loginEmail.value = '';
    loginPassword.value = '';
    signupEmail.value = '';
    signupPassword.value = '';
}

function resetButtonStates() {
    loginButton.innerHTML = 'Login';
    loginButton.disabled = false;
    googleLoginButton.innerHTML = '<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" class="w-5 h-5 mr-2"> Login with Google';
    googleLoginButton.disabled = false;
    signupButton.innerHTML = 'Sign Up';
    signupButton.disabled = false;
    logoutButton.innerHTML = 'Logout';
    logoutButton.disabled = false;
}