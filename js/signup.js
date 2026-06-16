// ========================================
// SIGNUP PAGE
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
// CONFIRM PASSWORD VISIBILITY TOGGLE
// ======================================

const confirmPasswordField = document.getElementById("confirmPassword");
const toggleConfirmPassword = document.querySelector(".toggle-confirm-password");

if (confirmPasswordField && toggleConfirmPassword) {
    toggleConfirmPassword.addEventListener("click", () => {
        if (confirmPasswordField.type === "password") {
            confirmPasswordField.type = "text";
            toggleConfirmPassword.classList.remove("fa-eye");
            toggleConfirmPassword.classList.add("fa-eye-slash");
        } else {
            confirmPasswordField.type = "password";
            toggleConfirmPassword.classList.remove("fa-eye-slash");
            toggleConfirmPassword.classList.add("fa-eye");
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

        // Get role from card data attribute or text
        selectedRole = card.dataset.role || card.querySelector('span').textContent.trim();

        // Update hidden input
        if (selectedRoleInput) {
            selectedRoleInput.value = selectedRole;
        }

        console.log(`Selected role: ${selectedRole}`);
    });
});

// ======================================
// REAL-TIME VALIDATION
// ======================================

// First Name validation
setupRealtimeValidation('firstName', (value) => validateName(value, 'First name'));

// Last Name validation
setupRealtimeValidation('lastName', (value) => validateName(value, 'Last name'));

// Email validation
setupRealtimeValidation('email', (value) => {
    const result = validateEmail(value);

    // Additional check for uniqueness
    if (result.valid && isEmailRegistered(value)) {
        return { valid: false, message: 'Email is already registered' };
    }

    return result;
});

// Mobile validation
setupRealtimeValidation('mobile', validatePhone);

// Password validation with strength indicator
if (passwordField) {
    passwordField.addEventListener('input', () => {
        const result = validatePassword(passwordField.value);

        // Show password strength
        let strengthElement = document.getElementById('passwordStrength');

        if (!strengthElement) {
            strengthElement = document.createElement('small');
            strengthElement.id = 'passwordStrength';
            strengthElement.className = 'form-text';
            passwordField.parentElement.parentElement.appendChild(strengthElement);
        }

        if (passwordField.value) {
            strengthElement.textContent = `Strength: ${capitalize(result.strength || 'weak')}`;

            // Color based on strength
            strengthElement.classList.remove('text-danger', 'text-warning', 'text-info', 'text-success');

            switch (result.strength) {
                case 'weak':
                    strengthElement.classList.add('text-danger');
                    break;
                case 'fair':
                    strengthElement.classList.add('text-warning');
                    break;
                case 'medium':
                    strengthElement.classList.add('text-info');
                    break;
                case 'strong':
                    strengthElement.classList.add('text-success');
                    break;
            }
        } else {
            strengthElement.textContent = '';
        }
    });

    passwordField.addEventListener('blur', () => {
        const result = validatePassword(passwordField.value);

        if (result.valid) {
            clearFieldError('password');
            showFieldSuccess('password');
        } else if (passwordField.value) {
            showFieldError('password', result.message);
        }
    });
}

// Confirm Password validation
if (confirmPasswordField && passwordField) {
    confirmPasswordField.addEventListener('blur', () => {
        const result = validatePasswordMatch(passwordField.value, confirmPasswordField.value);

        if (result.valid) {
            clearFieldError('confirmPassword');
            showFieldSuccess('confirmPassword');
        } else if (confirmPasswordField.value) {
            showFieldError('confirmPassword', result.message);
        }
    });

    confirmPasswordField.addEventListener('input', () => {
        if (confirmPasswordField.classList.contains('is-invalid')) {
            clearFieldError('confirmPassword');
        }
    });
}

// ======================================
// FORM SUBMISSION
// ======================================

const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", function(e) {
        e.preventDefault();

        // Get form values using proper IDs
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const email = document.getElementById('email');
        const mobile = document.getElementById('mobile');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        const terms = document.getElementById('terms');

        // Clear all previous errors
        clearFormErrors('signupForm');

        let isValid = true;

        // Validate First Name
        const firstNameResult = validateName(firstName.value, 'First name');
        if (!firstNameResult.valid) {
            showFieldError('firstName', firstNameResult.message);
            isValid = false;
        }

        // Validate Last Name
        const lastNameResult = validateName(lastName.value, 'Last name');
        if (!lastNameResult.valid) {
            showFieldError('lastName', lastNameResult.message);
            isValid = false;
        }

        // Validate Email
        const emailResult = validateEmail(email.value);
        if (!emailResult.valid) {
            showFieldError('email', emailResult.message);
            isValid = false;
        } else if (isEmailRegistered(email.value)) {
            showFieldError('email', 'Email is already registered');
            isValid = false;
        }

        // Validate Mobile
        const mobileResult = validatePhone(mobile.value);
        if (!mobileResult.valid) {
            showFieldError('mobile', mobileResult.message);
            isValid = false;
        }

        // Validate Password
        const passwordResult = validatePassword(password.value);
        if (!passwordResult.valid) {
            showFieldError('password', passwordResult.message);
            isValid = false;
        }

        // Validate Password Match
        const matchResult = validatePasswordMatch(password.value, confirmPassword.value);
        if (!matchResult.valid) {
            showFieldError('confirmPassword', matchResult.message);
            isValid = false;
        }

        // Validate Terms
        if (!terms.checked) {
            showError('Please accept the Terms & Conditions');
            terms.focus();
            return;
        }

        // If validation fails, stop here
        if (!isValid) {
            showError('Please fix the errors in the form');
            return;
        }

        // Show loading toast
        const loadingToastId = showLoading('Creating your account...');

        // Prepare user data
        const userData = {
            firstName: firstName.value.trim(),
            lastName: lastName.value.trim(),
            email: email.value.trim().toLowerCase(),
            mobile: mobile.value.trim(),
            password: password.value,
            role: selectedRoleInput ? selectedRoleInput.value : selectedRole // Use selected role
        };

        // Register user using auth.js
        setTimeout(() => {
            const result = registerUser(userData);

            // Hide loading toast
            hideLoading(loadingToastId);

            if (result.success) {
                // Show success message
                showSuccess('Account created successfully! Redirecting to sign in...');

                // Reset form
                signupForm.reset();
                clearFormErrors('signupForm');

                // Redirect to signin page after 2 seconds
                setTimeout(() => {
                    window.location.href = 'signin.html';
                }, 2000);
            } else {
                // Show error message
                showError(result.message);
            }
        }, 1000); // Simulate processing time
    });
}

// ======================================
// SOCIAL SIGNUP BUTTONS
// ======================================

const socialButtons = document.querySelectorAll(".social-btn");

socialButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        e.preventDefault();
        showInfo("Social signup coming soon!");
    });
});

// ======================================
// TAB SWITCHING
// ======================================

const signInTabBtn = document.querySelector('.signin-tabs a[href="signin.html"]');

if (signInTabBtn) {
    signInTabBtn.addEventListener('click', (e) => {
        // Let the default link behavior work (navigate to signin.html)
    });
}

// ======================================
// PAGE LOAD
// ======================================

window.addEventListener("load", () => {
    console.log("✅ Stackly Signup Page Loaded Successfully");

    // Focus on first name field
    const firstNameField = document.getElementById('firstName');
    if (firstNameField) {
        firstNameField.focus();
    }
});
