// ========================================
// SIGNIN PAGE
// Stackly Resort & Hotel Booking System
// ========================================

// ======================================
// PASSWORD VISIBILITY TOGGLE
// ======================================

const passwordField = document.getElementById("password");
const togglePassword = document.querySelector(".toggle-password");

if (passwordField && togglePassword) {
    togglePassword.addEventListener("click", () => {
        if (passwordField.type === "password") {
            passwordField.type = "text";
            togglePassword.classList.remove("fa-eye");
            togglePassword.classList.add("fa-eye-slash");
        } else {
            passwordField.type = "password";
            togglePassword.classList.remove("fa-eye-slash");
            togglePassword.classList.add("fa-eye");
        }
    });
}

// ======================================
// ROLE CARD SELECTION
// ======================================

const roleCards = document.querySelectorAll(".role-card");
const selectedRoleInput = document.getElementById("selectedRole");

// Set default role (Guest)
let selectedRole = "Guest";

if (selectedRoleInput) {
    selectedRoleInput.value = selectedRole;
}

roleCards.forEach(card => {
    card.addEventListener("click", () => {
        // Remove active class from all cards
        roleCards.forEach(item => {
            item.classList.remove("active");
        });

        // Add active class to clicked card
        card.classList.add("active");

        // Get role from card text
        const roleText = card.querySelector('span').textContent.trim();
        selectedRole = roleText;

        // Update hidden input
        if (selectedRoleInput) {
            selectedRoleInput.value = selectedRole;
        }

        console.log(`Selected role: ${selectedRole}`);
    });
});

// Set Guest as default active
const guestCard = Array.from(roleCards).find(card =>
    card.querySelector('span').textContent.trim() === 'Guest'
);

if (guestCard && !document.querySelector('.role-card.active')) {
    guestCard.classList.add('active');
}

// ======================================
// SIGN IN / CREATE ACCOUNT TABS
// ======================================

const tabButtons = document.querySelectorAll(".tab-btn");

tabButtons.forEach(button => {
    button.addEventListener("click", () => {
        tabButtons.forEach(tab => {
            tab.classList.remove("active");
        });

        button.classList.add("active");
    });
});

// ======================================
// REAL-TIME VALIDATION
// ======================================

// Email validation
const emailField = document.getElementById('email');
if (emailField) {
    emailField.addEventListener('blur', () => {
        const result = validateEmail(emailField.value);

        if (result.valid) {
            clearFieldError('email');
            showFieldSuccess('email');
        } else if (emailField.value) {
            showFieldError('email', result.message);
        }
    });

    emailField.addEventListener('input', () => {
        if (emailField.classList.contains('is-invalid')) {
            clearFieldError('email');
        }
    });
}

// ======================================
// FORM SUBMISSION
// ======================================

const signinForm = document.getElementById("signinForm");

if (signinForm) {
    signinForm.addEventListener("submit", function(e) {
        e.preventDefault();

        // Get form values
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const rememberMe = document.getElementById('rememberMe');
        const role = selectedRoleInput ? selectedRoleInput.value : selectedRole;

        // Clear previous errors
        clearFormErrors('signinForm');

        let isValid = true;

        // Validate Email
        const emailResult = validateEmail(email.value);
        if (!emailResult.valid) {
            showFieldError('email', emailResult.message);
            isValid = false;
        }

        // Validate Password (just check if not empty)
        if (!password.value || password.value.trim() === '') {
            showFieldError('password', 'Password is required');
            isValid = false;
        }

        // If validation fails, stop here
        if (!isValid) {
            showError('Please fix the errors in the form');
            return;
        }

        // Show loading toast
        const loadingToastId = showLoading('Signing in...');

        // Attempt login using auth.js
        setTimeout(() => {
            const result = loginUser(
                email.value.trim().toLowerCase(),
                password.value,
                role
            );

            // Hide loading toast
            hideLoading(loadingToastId);

            if (result.success) {
                // Handle Remember Me
                if (rememberMe && rememberMe.checked) {
                    localStorage.setItem('stackly_remember_email', email.value.trim().toLowerCase());
                } else {
                    localStorage.removeItem('stackly_remember_email');
                }

                // Show success message
                showSuccess(result.message);

                // Clear form
                signinForm.reset();
                clearFormErrors('signinForm');

                // Redirect to appropriate dashboard after 1.5 seconds
                setTimeout(() => {
                    redirectToDashboard(result.user);
                }, 1500);
            } else {
                // Show error message
                showError(result.message);

                // Focus on password field for retry
                password.focus();
            }
        }, 1000); // Simulate processing time
    });
}

// ======================================
// SOCIAL LOGIN BUTTONS
// ======================================

const socialButtons = document.querySelectorAll(".social-btn");

socialButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        e.preventDefault();
        showInfo("Social login coming soon!");
    });
});

// ======================================
// GUEST BOOKING LINK
// ======================================

const guestLink = document.querySelector(".guest-link a");

if (guestLink) {
    guestLink.addEventListener("click", (e) => {
        console.log("Guest Booking Selected - Redirecting to rooms page");
        // Link already has href="rooms.html" so it will navigate
    });
}

// ======================================
// FORGOT PASSWORD LINK
// ======================================

const forgotPasswordLink = document.querySelector('a[href="#"]');

if (forgotPasswordLink && forgotPasswordLink.textContent.includes('Forgot Password')) {
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        // Will be replaced when we create forgot-password.html
        showInfo('Forgot password feature coming soon!');
        // Later: window.location.href = 'forgot-password.html';
    });
}

// ======================================
// CHECK IF ALREADY LOGGED IN
// ======================================

window.addEventListener("load", () => {
    console.log("✅ Stackly Sign In Page Loaded");

    // Check if user is already logged in
    const currentUser = getCurrentUser();

    if (currentUser) {
        showInfo(`Already logged in as ${currentUser.firstName}. Redirecting...`);

        setTimeout(() => {
            redirectToDashboard(currentUser);
        }, 1500);
    } else {
        // Check if there's a remembered email
        const rememberedEmail = localStorage.getItem('stackly_remember_email');
        const emailField = document.getElementById('email');
        const rememberMeCheckbox = document.getElementById('rememberMe');

        if (rememberedEmail && emailField) {
            emailField.value = rememberedEmail;
            if (rememberMeCheckbox) {
                rememberMeCheckbox.checked = true;
            }
            // Focus on password field since email is pre-filled
            const passwordField = document.getElementById('password');
            if (passwordField) {
                passwordField.focus();
            }
        } else if (emailField) {
            // Focus on email field
            emailField.focus();
        }
    }
});
