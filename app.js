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

const signupName = document.getElementById('signup-name');
const signupEmail = document.getElementById('signup-email');
const signupPassword = document.getElementById('signup-password');
const signupButton = document.getElementById('signup-button');
const googleSignupButton = document.getElementById('google-signup');

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
const welcomeName = document.getElementById('welcome-name');
const container = document.querySelector('.container');

// Current datetime display
const currentDate = "2025-03-02";
const currentTime = "18:40:47";
const dateDisplays = document.querySelectorAll('.date-display');

// Login with email and password
loginButton.addEventListener('click', () => {
    const email = loginEmail.value;
    const password = loginPassword.value;
    
    // Simple validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
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
            
            // Enable admin mode
            setAdminMode(true);
            
            // Update admin UI with user data
            updateAdminUI(user);
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
                       
                       // Enable admin mode
                       setAdminMode(true);
                       
                       // Update admin UI with user data
                       updateAdminUI(user);
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
                           
                           // Enable admin mode
                           setAdminMode(true);
                           
                           // Update admin UI with user data
                           updateAdminUI(user);
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
                       
                       // Enable admin mode
                       setAdminMode(true);
                       
                       // Update admin UI with user data
                       updateAdminUI(user);
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
                       
                       // Disable admin mode
                       setAdminMode(false);
                   })
                   .catch((error) => {
                       console.error("Logout error:", error.message);
                       showNotification(error.message, 'error');
                   });
           });
           
           // Admin logout
           adminLogout.addEventListener('click', () => {
               auth.signOut()
                   .then(() => {
                       console.log("Admin logged out");
                       showNotification('Logged out successfully', 'info');
                       
                       // Disable admin mode
                       setAdminMode(false);
                   })
                   .catch((error) => {
                       console.error("Admin logout error:", error.message);
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
           
           // Admin panel tabs handling
           adminNavItems.forEach(item => {
               item.addEventListener('click', function() {
                   const tabName = this.getAttribute('data-tab');
                   
                   // Skip tab switching for logout button
                   if (tabName === null) return;
                   
                   // Update active tab in sidebar
                   adminNavItems.forEach(navItem => navItem.classList.remove('active'));
                   this.classList.add('active');
                   
                   // Show corresponding content with fade effect
                   adminTabContents.forEach(content => {
                       if (content.id === `${tabName}-content`) {
                           content.style.display = 'block';
                           
                           setTimeout(() => {
                               content.classList.add('active');
                           }, 50);
                       } else {
                           content.classList.remove('active');
                           
                           setTimeout(() => {
                               if (!content.classList.contains('active')) {
                                   content.style.display = 'none';
                               }
                           }, 300);
                       }
                   });
               });
           });
           
           // Function to update display mode
           function setAdminMode(isAdmin) {
               if (isAdmin) {
                   document.body.classList.add('admin-mode');
                   container.style.opacity = 0;
                   
                   setTimeout(() => {
                       container.style.display = 'none';
                       adminDashboard.style.display = 'flex';
                       
                       setTimeout(() => {
                           adminDashboard.style.opacity = 1;
                       }, 50);
                       
                       // Make sure the first tab is active
                       const defaultTab = document.querySelector('.admin-nav li[data-tab="dashboard"]');
                       if (defaultTab) {
                           defaultTab.classList.add('active');
                       }
                       
                       // Make sure the dashboard content is visible
                       const dashboardContent = document.getElementById('dashboard-content');
                       if (dashboardContent) {
                           dashboardContent.classList.add('active');
                           dashboardContent.style.display = 'block';
                       }
                   }, 300);
                   
                   console.log('Admin mode enabled');
               } else {
                   document.body.classList.remove('admin-mode');
                   adminDashboard.style.opacity = 0;
                   
                   setTimeout(() => {
                       adminDashboard.style.display = 'none';
                       container.style.display = 'block';
                       
                       setTimeout(() => {
                           container.style.opacity = 1;
                       }, 50);
                       
                       loginForm.style.display = 'block';
                       loginForm.style.opacity = 1;
                       signupForm.style.display = 'none';
                   }, 300);
                   
                   console.log('Admin mode disabled');
               }
           }
           
           // Update admin UI with user data
           function updateAdminUI(user) {
               // Set name in admin panel
               const displayName = user.displayName || 'Ashen1217'; // Use provided username if no displayName
               adminName.textContent = displayName;
               welcomeName.textContent = displayName;
               
               // Set avatar image if available
               if (user.photoURL) {
                   adminAvatarImg.src = user.photoURL;
                   document.querySelector('.admin-user-menu img').src = user.photoURL;
               } else {
                   // Generate initials for avatar if no photo available
                   const initials = getInitials(displayName);
                   generateAvatarColor(user.uid || displayName);
                   
                   // Update all avatar displays
                   document.querySelectorAll('.user-avatar.small').forEach((avatar, index) => {
                       if (index === 0) {
                           avatar.textContent = initials;
                       }
                   });
               }
               
               // Update date and time displays
               const formattedDate = "March 2, 2025";
               const formattedTime = currentTime;
               
               document.querySelector('.date-display time').textContent = formattedTime;
               document.querySelectorAll('#recent-users-table tr td:nth-child(3)').forEach((cell, index) => {
                   // Create staggered dates for the table
                   const daysAgo = index;
                   const date = new Date(currentDate);
                   date.setDate(date.getDate() - daysAgo);
                   cell.textContent = formatDate(date);
               });
           }
           
           // Helper function to format date as YYYY-MM-DD
           function formatDate(date) {
               const year = date.getFullYear();
               const month = String(date.getMonth() + 1).padStart(2, '0');
               const day = String(date.getDate()).padStart(2, '0');
               return `${year}-${month}-${day}`;
           }
           
           // Helper function to get initials from name
           function getInitials(name) {
               return name
                   .split(' ')
                   .map(part => part.charAt(0))
                   .join('')
                   .toUpperCase()
                   .substring(0, 2);
           }
           
           // Helper function to generate consistent color from string
           function generateAvatarColor(string) {
               let hash = 0;
               for (let i = 0; i < string.length; i++) {
                   hash = string.charCodeAt(i) + ((hash << 5) - hash);
               }
               
               const hue = hash % 360;
               const color = `hsl(${hue}, 70%, 60%)`;
               
               document.documentElement.style.setProperty('--avatar-color', color);
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
           
           // Listen for auth state changes
           auth.onAuthStateChanged((user) => {
               if (user) {
                   // User is signed in
                   console.log("Auth state changed: user is signed in");
                   
                   // For demo purposes, enable admin mode for all logged-in users
                   setAdminMode(true);
                   
                   // Update admin UI with user data
                   updateAdminUI(user);
               } else {
                   // User is signed out
                   console.log("Auth state changed: user is signed out");
                   
                   // Disable admin mode
                   setAdminMode(false);
               }
           });
           
           // Helper functions
           function clearInputs() {
               loginEmail.value = '';
               loginPassword.value = '';
               signupName.value = '';
               signupEmail.value = '';
               signupPassword.value = '';
           }
           
           // Add CSS for notifications
           const notificationStyles = `
               .notification-container {
                   position: fixed;
                   top: 20px;
                   right: 20px;
                   z-index: 9999;
               }
               
               .notification {
                   background-color: white;
                   border-radius: 8px;
                   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                   padding: 15px 20px;
                   margin-bottom: 10px;
                   display: flex;
                   align-items: center;
                   transform: translateX(120%);
                   transition: all 0.3s ease;
                   max-width: 350px;
                   opacity: 0;
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
                   color: var(--secondary-color);
               }
               
               .notification.error i {
                   color: var(--danger-color);
               }
               
               .notification.info i {
                   color: var(--primary-color);
               }
           `;
           
           // Add notification styles to document
           const styleElement = document.createElement('style');
           styleElement.textContent = notificationStyles;
           document.head.appendChild(styleElement);
           
           // Initialize the date and time in the admin panel
           document.addEventListener('DOMContentLoaded', () => {
               // Apply current date and time
               const timestampElements = document.querySelectorAll('time');
               timestampElements.forEach(element => {
                   element.textContent = currentTime;
               });
               
               // Set initial opacity for smooth transitions
               loginForm.style.opacity = 1;
               signupForm.style.opacity = 0;
               container.style.opacity = 1;
               adminDashboard.style.opacity = 0;
               
               // Add transition CSS
               document.head.insertAdjacentHTML('beforeend', `
                   <style>
                       #login-form, #signup-form, .container, #admin-dashboard {
                           transition: opacity 0.3s ease;
                       }
                   </style>
               `);
           });