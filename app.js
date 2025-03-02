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
const successMessage = document.getElementById('success-message');
const welcomeUser = document.getElementById('welcome-user');

const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const loginButton = document.getElementById('login-button');
const googleLoginButton = document.getElementById('google-login');

const signupName = document.getElementById('signup-name');
const signupEmail = document.getElementById('signup-email');
const signupPassword = document.getElementById('signup-password');
const signupButton = document.getElementById('signup-button');
const googleSignupButton = document.getElementById('google-signup');

const logoutButton = document.getElementById('logout-button');
const showSignupLink = document.getElementById('show-signup');
const showLoginLink = document.getElementById('show-login');

// Initialize UI
document.addEventListener('DOMContentLoaded', () => {
    // Set initial form visibility
    loginForm.style.display = 'block';
    loginForm.style.opacity = 1;
    
    signupForm.style.display = 'none';
    signupForm.style.opacity = 0;
    
    successMessage.style.display = 'none';
    successMessage.style.opacity = 0;
    
    // Removed initParticles() call
});

// Login with email and password
loginButton.addEventListener('click', () => {
    const email = loginEmail.value;
    const password = loginPassword.value;
    
    // Simple validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        shakeElement(email ? loginPassword.parentElement : loginEmail.parentElement);
        return;
    }
    
    // Show loading state
    loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    loginButton.disabled = true;
    
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Login successful
            const user = userCredential.user;
            console.log("Logged in as:", user.email);
            showNotification('Login successful!', 'success');
            clearInputs();
            showSuccessMessage(user);
        })
        .catch((error) => {
            console.error("Login error:", error.message);
            showNotification(error.message, 'error');
            
            // Reset button state
            loginButton.innerHTML = '<span>Login</span><i class="fas fa-arrow-right"></i>';
            loginButton.disabled = false;
        });
});

// Login with Google
googleLoginButton.addEventListener('click', () => {
    auth.signInWithPopup(googleProvider)
        .then((result) => {
            // Google login successful
            const user = result.user;
            console.log("Logged in as:", user.email);
            showNotification('Google login successful!', 'success');
            clearInputs();
            showSuccessMessage(user);
        })
        .catch((error) => {
            console.error("Google login error:", error.message);
            showNotification(error.message, 'error');
        });
});

// Create new account
signupButton.addEventListener('click', () => {
    const name = signupName.value;
    const email = signupEmail.value;
    const password = signupPassword.value;
    
    // Simple validation
    if (!name || !email || !password) {
        showNotification('Please fill in all fields', 'error');
        if (!name) shakeElement(signupName.parentElement);
        if (!email) shakeElement(signupEmail.parentElement);
        if (!password) shakeElement(signupPassword.parentElement);
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password should be at least 6 characters', 'error');
        shakeElement(signupPassword.parentElement);
        return;
    }
    
    // Show loading state
    signupButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    signupButton.disabled = true;
    
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signup successful
            const user = userCredential.user;
            console.log("Signed up as:", user.email);
            
            // Update profile with name
            return user.updateProfile({
                displayName: name
            }).then(() => {
                showNotification('Account created successfully!', 'success');
                clearInputs();
                showSuccessMessage(user);
            });
        })
        .catch((error) => {
            console.error("Signup error:", error.message);
            showNotification(error.message, 'error');
            
            // Reset button state
            signupButton.innerHTML = '<span>Create Account</span><i class="fas fa-arrow-right"></i>';
            signupButton.disabled = false;
        });
});

// Google signup - same as login but with different UI messaging
googleSignupButton.addEventListener('click', () => {
    auth.signInWithPopup(googleProvider)
        .then((result) => {
            const user = result.user;
            console.log("Signed up with Google as:", user.email);
            showNotification('Google signup successful!', 'success');
            clearInputs();
            showSuccessMessage(user);
        })
        .catch((error) => {
            console.error("Google signup error:", error.message);
            showNotification(error.message, 'error');
        });
});

// Logout
logoutButton.addEventListener('click', () => {
    auth.signOut()
        .then(() => {
            console.log("User logged out");
            showNotification('Logged out successfully', 'info');
            
            // Return to login screen with animation
            successMessage.style.opacity = 0;
            
            setTimeout(() => {
                successMessage.style.display = 'none';
                loginForm.style.display = 'block';
                
                setTimeout(() => {
                    loginForm.style.opacity = 1;
                }, 50);
            }, 300);
        })
        .catch((error) => {
            console.error("Logout error:", error.message);
            showNotification(error.message, 'error');
        });
});

// Switch between login and signup forms with animation
showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.opacity = 0;
    
    setTimeout(() => {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        
        setTimeout(() => {
            signupForm.style.opacity = 1;
        }, 50);
    }, 300);
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.style.opacity = 0;
    
    setTimeout(() => {
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
        
        setTimeout(() => {
            loginForm.style.opacity = 1;
        }, 50);
    }, 300);
});

// Show success message after login/signup
function showSuccessMessage(user) {
    // Prepare success message
    const displayName = user.displayName || user.email.split('@')[0];
    welcomeUser.textContent = `${displayName}, you've successfully logged in`;
    
    // Animate transition
    loginForm.style.opacity = 0;
    signupForm.style.opacity = 0;
    
    setTimeout(() => {
        loginForm.style.display = 'none';
        signupForm.style.display = 'none';
        successMessage.style.display = 'block';
        
        setTimeout(() => {
            successMessage.style.opacity = 1;
        }, 50);
    }, 300);
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        input.classList.add('password-visible');
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        input.classList.remove('password-visible');
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Helper function for showing notifications
function showNotification(message, type) {
    // Check if notification container exists, create if not
    let notifContainer = document.querySelector('.notification-container');
    
    if (!notifContainer) {
        notifContainer = document.createElement('div');
        notifContainer.className = 'notification-container';
        document.body.appendChild(notifContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Add appropriate icon
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    
    // Set content
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    // Add to container
    notifContainer.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Shake animation for invalid inputs
function shakeElement(element) {
    element.classList.add('shake');
    setTimeout(() => {
        element.classList.remove('shake');
    }, 500);
}

// Helper functions
function clearInputs() {
    loginEmail.value = '';
    loginPassword.value = '';
    signupName.value = '';
    signupEmail.value = '';
    signupPassword.value = '';
}

// Listen for auth state changes
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        console.log("Auth state changed: user is signed in");
    } else {
        // User is signed out
        console.log("Auth state changed: user is signed out");
    }
});

// Add custom CSS for notifications and animations
const customStyles = `
    .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }
    
    .notification {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        padding: 15px 20px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        transform: translateX(120%);
        transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
        max-width: 350px;
        opacity: 0;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .notification.show {
        transform: translateX(0);
        opacity: 1;
    }
    
    .notification i {
        margin-right: 12px;
        font-size: 20px;
    }
    
    .notification.success i {
        color: var(--success);
    }
    
    .notification.error i {
        color: var(--danger);
    }
    
    .notification.info i {
        color: var(--info);
    }
    
    .shake {
        animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }
    
    @keyframes shake {
        10%, 90% { transform: translate3d(-1px, 0, 0); }
        20%, 80% { transform: translate3d(2px, 0, 0); }
        30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
        40%, 60% { transform: translate3d(4px, 0, 0); }
    }
    
    .input-group input:focus + .input-icon {
        color: var(--primary);
    }
`;

// Add custom styles to document
const styleElement = document.createElement('style');
styleElement.textContent = customStyles;
document.head.appendChild(styleElement);