// ========================================
// VALIDATION MODULE
// Stackly Resort & Hotel Booking System
// Form Validation Functions
// ========================================

// ========================================
// VALIDATION RULES
// ========================================

const VALIDATION_RULES = {
    email: {
        regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
    },
    password: {
        minLength: 8,
        regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        message: 'Password must be at least 8 characters with uppercase, lowercase, number and special character'
    },
    phone: {
        regex: /^[+]?91?[6-9]\d{9}$/,
        message: 'Please enter a valid 10-digit mobile number'
    },
    name: {
        regex: /^[a-zA-Z\s]{2,50}$/,
        message: 'Name must be 2-50 characters and contain only letters'
    }
};

// ========================================
// EMAIL VALIDATION
// ========================================

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {Object} { valid: boolean, message: string }
 */
function validateEmail(email) {
    if (!email || email.trim() === '') {
        return { valid: false, message: 'Email is required' };
    }

    if (!VALIDATION_RULES.email.regex.test(email)) {
        return { valid: false, message: VALIDATION_RULES.email.message };
    }

    return { valid: true, message: '' };
}

/**
 * Check if email is already registered
 * @param {string} email - Email to check
 * @returns {boolean} True if email exists
 */
function isEmailRegistered(email) {
    const user = getUserByEmail(email);
    return user !== null;
}

// ========================================
// PASSWORD VALIDATION
// ========================================

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} { valid: boolean, message: string, strength: string }
 */
function validatePassword(password) {
    if (!password || password.trim() === '') {
        return { valid: false, message: 'Password is required', strength: 'none' };
    }

    if (password.length < VALIDATION_RULES.password.minLength) {
        return {
            valid: false,
            message: `Password must be at least ${VALIDATION_RULES.password.minLength} characters`,
            strength: 'weak'
        };
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);

    const strengthCount = [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length;

    let strength = 'weak';
    let valid = false;
    let message = '';

    if (strengthCount === 4 && password.length >= 12) {
        strength = 'strong';
        valid = true;
    } else if (strengthCount >= 3 && password.length >= 8) {
        strength = 'medium';
        valid = true;
    } else if (strengthCount >= 2 && password.length >= 8) {
        strength = 'fair';
        valid = true;
    } else {
        strength = 'weak';
        valid = false;
        message = 'Password must contain uppercase, lowercase, number, and special character';
    }

    return { valid, message, strength };
}

/**
 * Validate password confirmation
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {Object} { valid: boolean, message: string }
 */
function validatePasswordMatch(password, confirmPassword) {
    if (!confirmPassword || confirmPassword.trim() === '') {
        return { valid: false, message: 'Please confirm your password' };
    }

    if (password !== confirmPassword) {
        return { valid: false, message: 'Passwords do not match' };
    }

    return { valid: true, message: '' };
}

// ========================================
// PHONE VALIDATION
// ========================================

/**
 * Validate phone number (Indian format)
 * @param {string} phone - Phone number to validate
 * @returns {Object} { valid: boolean, message: string }
 */
function validatePhone(phone) {
    if (!phone || phone.trim() === '') {
        return { valid: false, message: 'Phone number is required' };
    }

    // Remove spaces and dashes
    const cleanedPhone = phone.replace(/[\s-]/g, '');

    if (!VALIDATION_RULES.phone.regex.test(cleanedPhone)) {
        return { valid: false, message: VALIDATION_RULES.phone.message };
    }

    return { valid: true, message: '' };
}

/**
 * Format phone number for display
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number
 */
function formatPhone(phone) {
    const cleaned = phone.replace(/[\s-]/g, '');

    if (cleaned.startsWith('+91')) {
        return `+91 ${cleaned.slice(3, 8)} ${cleaned.slice(8)}`;
    } else if (cleaned.startsWith('91')) {
        return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
    } else {
        return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
}

// ========================================
// NAME VALIDATION
// ========================================

/**
 * Validate name (first or last name)
 * @param {string} name - Name to validate
 * @param {string} fieldName - Field name for error message
 * @returns {Object} { valid: boolean, message: string }
 */
function validateName(name, fieldName = 'Name') {
    if (!name || name.trim() === '') {
        return { valid: false, message: `${fieldName} is required` };
    }

    if (name.trim().length < 2) {
        return { valid: false, message: `${fieldName} must be at least 2 characters` };
    }

    if (name.trim().length > 50) {
        return { valid: false, message: `${fieldName} must not exceed 50 characters` };
    }

    if (!/^[a-zA-Z\s]+$/.test(name)) {
        return { valid: false, message: `${fieldName} must contain only letters` };
    }

    return { valid: true, message: '' };
}

// ========================================
// DATE VALIDATION
// ========================================

/**
 * Validate check-in and check-out dates
 * @param {string} checkIn - Check-in date (YYYY-MM-DD)
 * @param {string} checkOut - Check-out date (YYYY-MM-DD)
 * @returns {Object} { valid: boolean, message: string }
 */
function validateDateRange(checkIn, checkOut) {
    if (!checkIn || !checkOut) {
        return { valid: false, message: 'Please select both check-in and check-out dates' };
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if dates are valid
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
        return { valid: false, message: 'Invalid date format' };
    }

    // Check if check-in is in the past
    if (checkInDate < today) {
        return { valid: false, message: 'Check-in date cannot be in the past' };
    }

    // Check if check-out is after check-in
    if (checkOutDate <= checkInDate) {
        return { valid: false, message: 'Check-out date must be after check-in date' };
    }

    // Check if dates are within 1 year
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    if (checkInDate > oneYearFromNow) {
        return { valid: false, message: 'Booking cannot be more than 1 year in advance' };
    }

    return { valid: true, message: '' };
}

/**
 * Validate single date (must be in future)
 * @param {string} date - Date to validate (YYYY-MM-DD)
 * @param {string} fieldName - Field name for error message
 * @returns {Object} { valid: boolean, message: string }
 */
function validateFutureDate(date, fieldName = 'Date') {
    if (!date) {
        return { valid: false, message: `${fieldName} is required` };
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(selectedDate.getTime())) {
        return { valid: false, message: 'Invalid date format' };
    }

    if (selectedDate < today) {
        return { valid: false, message: `${fieldName} cannot be in the past` };
    }

    return { valid: true, message: '' };
}

// ========================================
// FIELD VALIDATION
// ========================================

/**
 * Validate required field
 * @param {string} value - Field value
 * @param {string} fieldName - Field name for error message
 * @returns {Object} { valid: boolean, message: string }
 */
function validateRequired(value, fieldName = 'This field') {
    if (!value || value.toString().trim() === '') {
        return { valid: false, message: `${fieldName} is required` };
    }

    return { valid: true, message: '' };
}

/**
 * Validate number field
 * @param {string|number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {string} fieldName - Field name for error message
 * @returns {Object} { valid: boolean, message: string }
 */
function validateNumber(value, min = 0, max = Infinity, fieldName = 'Value') {
    if (!value && value !== 0) {
        return { valid: false, message: `${fieldName} is required` };
    }

    const num = Number(value);

    if (isNaN(num)) {
        return { valid: false, message: `${fieldName} must be a number` };
    }

    if (num < min) {
        return { valid: false, message: `${fieldName} must be at least ${min}` };
    }

    if (num > max) {
        return { valid: false, message: `${fieldName} cannot exceed ${max}` };
    }

    return { valid: true, message: '' };
}

// ========================================
// FORM VALIDATION
// ========================================

/**
 * Validate entire form
 * @param {string} formId - Form ID
 * @param {Object} validationRules - Validation rules object
 * @returns {Object} { valid: boolean, errors: Object }
 */
function validateForm(formId, validationRules) {
    const form = document.getElementById(formId);
    if (!form) return { valid: false, errors: {} };

    const errors = {};
    let isValid = true;

    for (const [fieldId, rules] of Object.entries(validationRules)) {
        const field = document.getElementById(fieldId);
        if (!field) continue;

        const value = field.value;

        // Check each rule
        for (const rule of rules) {
            let result;

            switch (rule.type) {
                case 'required':
                    result = validateRequired(value, rule.fieldName || fieldId);
                    break;
                case 'email':
                    result = validateEmail(value);
                    break;
                case 'password':
                    result = validatePassword(value);
                    break;
                case 'phone':
                    result = validatePhone(value);
                    break;
                case 'name':
                    result = validateName(value, rule.fieldName || fieldId);
                    break;
                case 'number':
                    result = validateNumber(value, rule.min, rule.max, rule.fieldName || fieldId);
                    break;
                default:
                    result = { valid: true, message: '' };
            }

            if (!result.valid) {
                errors[fieldId] = result.message;
                isValid = false;
                break; // Stop at first error for this field
            }
        }
    }

    return { valid: isValid, errors };
}

// ========================================
// ERROR DISPLAY
// ========================================

/**
 * Show error message below a field
 * @param {string} fieldId - Field ID
 * @param {string} message - Error message
 */
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    // Add error class to field
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');

    // Find or create error message element
    let errorElement = field.parentElement.querySelector('.error-message');

    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message invalid-feedback';
        field.parentElement.appendChild(errorElement);
    }

    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

/**
 * Clear error message from a field
 * @param {string} fieldId - Field ID
 */
function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    // Remove error class
    field.classList.remove('is-invalid');

    // Hide error message
    const errorElement = field.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.style.display = 'none';
        errorElement.textContent = '';
    }
}

/**
 * Show success indicator on field
 * @param {string} fieldId - Field ID
 */
function showFieldSuccess(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.classList.add('is-valid');
    field.classList.remove('is-invalid');

    // Hide error message
    const errorElement = field.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

/**
 * Clear all form errors
 * @param {string} formId - Form ID
 */
function clearFormErrors(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    const fields = form.querySelectorAll('.is-invalid, .is-valid');
    fields.forEach(field => {
        field.classList.remove('is-invalid', 'is-valid');
    });

    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(msg => {
        msg.style.display = 'none';
        msg.textContent = '';
    });
}

// ========================================
// REAL-TIME VALIDATION
// ========================================

/**
 * Setup real-time validation on a field
 * @param {string} fieldId - Field ID
 * @param {Function} validationFunction - Validation function to use
 */
function setupRealtimeValidation(fieldId, validationFunction) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.addEventListener('blur', () => {
        const result = validationFunction(field.value);

        if (result.valid) {
            clearFieldError(fieldId);
            showFieldSuccess(fieldId);
        } else {
            showFieldError(fieldId, result.message);
        }
    });

    field.addEventListener('input', () => {
        // Clear error on input (don't validate yet)
        if (field.classList.contains('is-invalid')) {
            clearFieldError(fieldId);
        }
    });
}

// ========================================
// PASSWORD STRENGTH INDICATOR
// ========================================

/**
 * Show password strength indicator
 * @param {string} passwordFieldId - Password field ID
 * @param {string} indicatorId - Indicator element ID
 */
function showPasswordStrength(passwordFieldId, indicatorId) {
    const passwordField = document.getElementById(passwordFieldId);
    const indicator = document.getElementById(indicatorId);

    if (!passwordField || !indicator) return;

    passwordField.addEventListener('input', () => {
        const result = validatePassword(passwordField.value);

        // Update indicator
        indicator.textContent = result.strength ? capitalize(result.strength) : '';

        // Update color
        indicator.classList.remove('text-danger', 'text-warning', 'text-info', 'text-success');

        switch (result.strength) {
            case 'weak':
                indicator.classList.add('text-danger');
                break;
            case 'fair':
                indicator.classList.add('text-warning');
                break;
            case 'medium':
                indicator.classList.add('text-info');
                break;
            case 'strong':
                indicator.classList.add('text-success');
                break;
        }
    });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Disable submit button if form is invalid
 * @param {string} formId - Form ID
 * @param {string} buttonId - Submit button ID
 */
function toggleSubmitButton(formId, buttonId) {
    const form = document.getElementById(formId);
    const button = document.getElementById(buttonId);

    if (!form || !button) return;

    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

    const checkForm = () => {
        let allValid = true;

        inputs.forEach(input => {
            if (!input.value || input.value.trim() === '') {
                allValid = false;
            }

            if (input.classList.contains('is-invalid')) {
                allValid = false;
            }
        });

        button.disabled = !allValid;
    };

    inputs.forEach(input => {
        input.addEventListener('input', checkForm);
        input.addEventListener('change', checkForm);
    });

    checkForm(); // Initial check
}
