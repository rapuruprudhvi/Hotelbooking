// ========================================
// UTILITY FUNCTIONS
// Stackly Resort & Hotel Booking System
// ========================================

// ========================================
// DATE UTILITIES
// ========================================

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type ('short', 'long', 'iso')
 * @returns {string} Formatted date
 */
function formatDate(date, format = 'short') {
    const d = new Date(date);

    if (isNaN(d.getTime())) {
        return 'Invalid Date';
    }

    const options = {
        short: { day: '2-digit', month: 'short', year: 'numeric' }, // 15 Jun 2026
        long: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }, // Monday, 15 June 2026
        iso: null // 2026-06-15
    };

    if (format === 'iso') {
        return d.toISOString().split('T')[0];
    }

    return d.toLocaleDateString('en-GB', options[format] || options.short);
}

/**
 * Calculate number of nights between two dates
 * @param {string|Date} checkIn - Check-in date
 * @param {string|Date} checkOut - Check-out date
 * @returns {number} Number of nights
 */
function calculateNights(checkIn, checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return 0;
    }

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}

/**
 * Check if date is in the past
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is in the past
 */
function isDateInPast(date) {
    const d = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return d < today;
}

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} Today's date
 */
function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

/**
 * Get date N days from today
 * @param {number} days - Number of days to add
 * @returns {string} Date in YYYY-MM-DD format
 */
function getDateAfterDays(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

// ========================================
// PRICE UTILITIES
// ========================================

/**
 * Format price with Indian Rupee symbol
 * @param {number} amount - Price amount
 * @param {boolean} withSymbol - Include ₹ symbol
 * @returns {string} Formatted price
 */
function formatPrice(amount, withSymbol = true) {
    if (isNaN(amount)) {
        return withSymbol ? '₹0' : '0';
    }

    const formatted = amount.toLocaleString('en-IN');
    return withSymbol ? `₹${formatted}` : formatted;
}

/**
 * Calculate total booking price
 * @param {number} pricePerNight - Price per night
 * @param {number} nights - Number of nights
 * @returns {number} Total price
 */
function calculateTotalPrice(pricePerNight, nights) {
    return pricePerNight * nights;
}

// ========================================
// ID GENERATION
// ========================================

/**
 * Generate unique ID with prefix
 * @param {string} prefix - Prefix for ID (e.g., 'BK', 'user', 'room')
 * @returns {string} Unique ID
 */
function generateId(prefix = '') {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return prefix ? `${prefix}${timestamp}${random}` : `${timestamp}${random}`;
}

/**
 * Generate booking ID (BK prefix)
 * @returns {string} Booking ID
 */
function generateBookingId() {
    return 'BK' + Date.now();
}

/**
 * Generate user ID (user_ prefix)
 * @returns {string} User ID
 */
function generateUserId() {
    return 'user_' + Date.now() + Math.floor(Math.random() * 1000);
}

// ========================================
// STRING UTILITIES
// ========================================

/**
 * Sanitize user input to prevent XSS
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
function sanitizeInput(text) {
    if (typeof text !== 'string') return '';

    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} length - Max length
 * @returns {string} Truncated text
 */
function truncate(text, length = 100) {
    if (!text || text.length <= length) return text;
    return text.substring(0, length) + '...';
}

// ========================================
// PERFORMANCE UTILITIES
// ========================================

/**
 * Debounce function to limit execution rate
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, delay = 300) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Throttle function to limit execution frequency
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit = 300) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========================================
// DOM UTILITIES
// ========================================

/**
 * Get query parameter from URL
 * @param {string} param - Parameter name
 * @returns {string|null} Parameter value
 */
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/**
 * Scroll to top of page smoothly
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ========================================
// STORAGE UTILITIES
// ========================================

/**
 * Check if localStorage is available
 * @returns {boolean} True if localStorage is available
 */
function isLocalStorageAvailable() {
    try {
        const test = '__localStorage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Get localStorage item with error handling
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} Stored value or default
 */
function getStorageItem(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
    }
}

/**
 * Set localStorage item with error handling
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} True if successful
 */
function setStorageItem(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            console.error('localStorage quota exceeded');
            showToast('Storage limit reached. Please clear some data.', 'error');
        } else {
            console.error('Error writing to localStorage:', error);
        }
        return false;
    }
}

/**
 * Remove localStorage item
 * @param {string} key - Storage key
 */
function removeStorageItem(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing from localStorage:', error);
    }
}

// ========================================
// ARRAY UTILITIES
// ========================================

/**
 * Remove duplicates from array
 * @param {Array} arr - Array with duplicates
 * @returns {Array} Array without duplicates
 */
function removeDuplicates(arr) {
    return [...new Set(arr)];
}

/**
 * Shuffle array randomly
 * @param {Array} arr - Array to shuffle
 * @returns {Array} Shuffled array
 */
function shuffleArray(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ========================================
// PASSWORD UTILITIES
// ========================================

/**
 * Simple password encoding (NOT encryption, just obfuscation)
 * @param {string} password - Password to encode
 * @returns {string} Encoded password
 */
function encodePassword(password) {
    return btoa(password);
}

/**
 * Decode password
 * @param {string} encoded - Encoded password
 * @returns {string} Decoded password
 */
function decodePassword(encoded) {
    try {
        return atob(encoded);
    } catch (error) {
        return '';
    }
}

// ========================================
// ANIMATION UTILITIES
// ========================================

/**
 * Animate counter from 0 to target value
 * @param {HTMLElement} element - Element to animate
 * @param {number} target - Target number
 * @param {number} duration - Animation duration in ms
 */
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const current = Math.floor(progress * target);
        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

// ========================================
// EXPORTS (if using modules)
// ========================================
// Export functions if using ES6 modules
// export { formatDate, calculateNights, formatPrice, generateId, sanitizeInput, debounce, ... };
