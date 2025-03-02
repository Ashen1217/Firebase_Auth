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
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

// DOM Elements
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
    loginForm.style.display = 'block';
    loginForm.style.opacity = 1;
    signupForm.style.display = 'none';
    signupForm.style.opacity = 0;
    successMessage.style.display = 'none';
    successMessage.style.opacity = 0;
    
    // Add transition CSS
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            #login-form, #signup-form, #success-message {
                transition: opacity 0.3s ease;
            }
        </style>
    `);
});

// Email login
loginButton.addEventListener('click', () => {
    const email = loginEmail.value;
    const password = loginPassword.value;
    
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        shakeElement(email ? loginPassword.parentElement : loginEmail.parentElement);
        return;
    }
    
    loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    loginButton.disabled = true;
    
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            showNotification('Login successful!', 'success');
            clearInputs();
            showSuccessMessage(userCredential.user);
        })
        .catch((error) => {
            showNotification(error.message, 'error');
            loginButton.innerHTML = '<span>Login</span><i class="fas fa-arrow-right"></i>';
            loginButton.disabled = false;
        });
});

// Google login
googleLoginButton.addEventListener('click', () => {
    auth.signInWithPopup(googleProvider)
        .then((result) => {
            showNotification('Google login successful!', 'success');
            clearInputs();
            showSuccessMessage(result.user);
        })
        .catch((error) => {
            showNotification(error.message, 'error');
        });
});

// Account creation
signupButton.addEventListener('click', () => {
    const name = signupName.value;
    const email = signupEmail.value;
    const password = signupPassword.value;
    
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
    
    signupButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    signupButton.disabled = true;
    
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            return userCredential.user.updateProfile({ displayName: name })
                .then(() => {
                    showNotification('Account created successfully!', 'success');
                    clearInputs();
                    showSuccessMessage(userCredential.user);
                });
        })
        .catch((error) => {
            showNotification(error.message, 'error');
            signupButton.innerHTML = '<span>Create Account</span><i class="fas fa-arrow-right"></i>';
            signupButton.disabled = false;
        });
});

// Google signup
googleSignupButton.addEventListener('click', () => {
    auth.signInWithPopup(googleProvider)
        .then((result) => {
            showNotification('Google signup successful!', 'success');
            clearInputs();
            showSuccessMessage(result.user);
        })
        .catch((error) => {
            showNotification(error.message, 'error');
        });
});

// Logout
logoutButton.addEventListener('click', () => {
    auth.signOut()
        .then(() => {
            showNotification('Logged out successfully', 'info');
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
            showNotification(error.message, 'error');
        });
});

// Switch between login and signup forms
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

// UI helper functions
function showSuccessMessage(user) {
    const displayName = user.displayName || user.email.split('@')[0];
    welcomeUser.textContent = `${displayName}, you've successfully logged in`;
    
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

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        input.classList.add('password-visible');
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        input.classList.remove('password-visible');
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

function showNotification(message, type) {
    let notifContainer = document.querySelector('.notification-container');
    
    if (!notifContainer) {
        notifContainer = document.createElement('div');
        notifContainer.className = 'notification-container';
        document.body.appendChild(notifContainer);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    
    notification.innerHTML = `<i class="fas fa-${icon}"></i><span>${message}</span>`;
    notifContainer.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

function shakeElement(element) {
    element.classList.add('shake');
    setTimeout(() => {
        element.classList.remove('shake');
    }, 500);
}

function clearInputs() {
    loginEmail.value = '';
    loginPassword.value = '';
    signupName.value = '';
    signupEmail.value = '';
    signupPassword.value = '';
}

// Auth state listener
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("User is signed in:", user.email);
    } else {
        console.log("User is signed out");
    }
});

// Add missing customStyles constant
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

.notification.success i { color: var(--success); }
.notification.error i { color: var(--danger); }
.notification.info i { color: var(--info); }

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

const styleElement = document.createElement('style');
styleElement.textContent = customStyles;
document.head.appendChild(styleElement);