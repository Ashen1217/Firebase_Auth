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
        })
        .catch((error) => {
            console.error("Logout error:", error.message);
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

// Listen for auth state changes
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        loginForm.style.display = 'none';
        signupForm.style.display = 'none';
        userDetails.style.display = 'block';
        userEmail.textContent = `Logged in as: ${user.email}`;
    } else {
        // User is signed out
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        userDetails.style.display = 'none';
    }
});

// Helper functions
function clearInputs() {
    loginEmail.value = '';
    loginPassword.value = '';
    signupEmail.value = '';
    signupPassword.value = '';
}