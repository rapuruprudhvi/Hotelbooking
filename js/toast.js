// ========================================
// TOAST NOTIFICATION SYSTEM
// Stackly Resort & Hotel Booking System
// Unified Toast Notifications
// ========================================

// Toast queue to manage multiple toasts
let toastQueue = [];
let toastCounter = 0;

// ========================================
// MAIN TOAST FUNCTION
// ========================================

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duration in milliseconds (0 = no auto-dismiss)
 * @param {Object} options - Additional options
 */
function showToast(message, type = 'success', duration = 3000, options = {}) {
    const toast = createToast(message, type, duration, options);
    displayToast(toast);
}

/**
 * Create toast element
 * @param {string} message - Message text
 * @param {string} type - Toast type
 * @param {number} duration - Duration
 * @param {Object} options - Options
 * @returns {HTMLElement} Toast element
 */
function createToast(message, type, duration, options) {
    toastCounter++;
    const toastId = `toast-${toastCounter}`;

    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `toast-notification toast-${type}`;

    // Get icon based on type
    const icon = getToastIcon(type);

    // Get colors based on type
    const colors = getToastColors(type);

    // Build toast HTML
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon">
                <i class="${icon}"></i>
            </div>
            <div class="toast-message">${sanitizeInput(message)}</div>
            <button class="toast-close" onclick="closeToast('${toastId}')">
                <i class="fa-solid fa-times"></i>
            </button>
        </div>
        ${options.action ? `
            <div class="toast-action">
                <button class="toast-action-btn" onclick="${options.action.onClick}">
                    ${options.action.text}
                </button>
            </div>
        ` : ''}
    `;

    // Apply custom styles
    toast.style.cssText = `
        position: fixed;
        top: 25px;
        right: 25px;
        min-width: 300px;
        max-width: 400px;
        background: ${colors.background};
        color: ${colors.text};
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        display: flex;
        flex-direction: column;
        gap: 12px;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        transition: transform 0.3s ease, opacity 0.3s ease;
    `;

    // Store data
    toast.dataset.duration = duration;
    toast.dataset.type = type;

    return toast;
}

/**
 * Display toast and manage queue
 * @param {HTMLElement} toast - Toast element
 */
function displayToast(toast) {
    // Add to page
    document.body.appendChild(toast);

    // Add to queue
    toastQueue.push(toast);

    // Update positions of all toasts
    updateToastPositions();

    // Trigger animation
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
    }, 10);

    // Auto-dismiss if duration is set
    const duration = parseInt(toast.dataset.duration);
    if (duration > 0) {
        setTimeout(() => {
            closeToast(toast.id);
        }, duration);
    }
}

/**
 * Close toast by ID
 * @param {string} toastId - Toast ID
 */
function closeToast(toastId) {
    const toast = document.getElementById(toastId);
    if (!toast) return;

    // Slide out animation
    toast.style.transform = 'translateX(450px)';
    toast.style.opacity = '0';

    // Remove after animation
    setTimeout(() => {
        if (toast && toast.parentElement) {
            toast.parentElement.removeChild(toast);

            // Remove from queue
            toastQueue = toastQueue.filter(t => t.id !== toastId);

            // Update positions
            updateToastPositions();
        }
    }, 300);
}

/**
 * Update positions of all toasts
 */
function updateToastPositions() {
    let topPosition = 25;

    toastQueue.forEach((toast, index) => {
        if (toast && toast.parentElement) {
            toast.style.top = `${topPosition}px`;
            topPosition += toast.offsetHeight + 15; // 15px gap between toasts
        }
    });
}

/**
 * Close all toasts
 */
function closeAllToasts() {
    [...toastQueue].forEach(toast => {
        closeToast(toast.id);
    });
}

// ========================================
// TOAST TYPES & ICONS
// ========================================

/**
 * Get icon for toast type
 * @param {string} type - Toast type
 * @returns {string} Icon class
 */
function getToastIcon(type) {
    const icons = {
        success: 'fa-solid fa-circle-check',
        error: 'fa-solid fa-circle-exclamation',
        warning: 'fa-solid fa-triangle-exclamation',
        info: 'fa-solid fa-circle-info'
    };

    return icons[type] || icons.info;
}

/**
 * Get colors for toast type
 * @param {string} type - Toast type
 * @returns {Object} Color scheme
 */
function getToastColors(type) {
    const colors = {
        success: {
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            text: '#ffffff'
        },
        error: {
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            text: '#ffffff'
        },
        warning: {
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            text: '#ffffff'
        },
        info: {
            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
            text: '#ffffff'
        }
    };

    return colors[type] || colors.info;
}

// ========================================
// CONVENIENCE FUNCTIONS
// ========================================

/**
 * Show success toast
 * @param {string} message - Message
 * @param {number} duration - Duration
 */
function showSuccess(message, duration = 3000) {
    showToast(message, 'success', duration);
}

/**
 * Show error toast
 * @param {string} message - Message
 * @param {number} duration - Duration
 */
function showError(message, duration = 4000) {
    showToast(message, 'error', duration);
}

/**
 * Show warning toast
 * @param {string} message - Message
 * @param {number} duration - Duration
 */
function showWarning(message, duration = 3500) {
    showToast(message, 'warning', duration);
}

/**
 * Show info toast
 * @param {string} message - Message
 * @param {number} duration - Duration
 */
function showInfo(message, duration = 3000) {
    showToast(message, 'info', duration);
}

/**
 * Show loading toast (doesn't auto-dismiss)
 * @param {string} message - Message
 * @returns {string} Toast ID (use to close later)
 */
function showLoading(message = 'Loading...') {
    const toast = createToast(message, 'info', 0, {});

    // Modify toast for loading
    const icon = toast.querySelector('.toast-icon i');
    if (icon) {
        icon.className = 'fa-solid fa-spinner fa-spin';
    }

    // Don't show close button for loading
    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
        closeBtn.style.display = 'none';
    }

    displayToast(toast);

    return toast.id;
}

/**
 * Hide loading toast
 * @param {string} toastId - Toast ID from showLoading
 */
function hideLoading(toastId) {
    closeToast(toastId);
}

// ========================================
// ADD STYLES TO PAGE
// ========================================

/**
 * Inject toast styles into page
 */
function injectToastStyles() {
    if (document.getElementById('toast-styles')) return;

    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(450px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .toast-notification {
            font-family: 'Poppins', sans-serif;
        }

        .toast-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .toast-icon {
            font-size: 22px;
            flex-shrink: 0;
        }

        .toast-message {
            flex: 1;
            font-size: 14px;
            line-height: 1.5;
            font-weight: 500;
        }

        .toast-close {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 26px;
            height: 26px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: background 0.2s ease;
        }

        .toast-close:hover {
            background: rgba(255,255,255,0.3);
        }

        .toast-action {
            padding-top: 8px;
            border-top: 1px solid rgba(255,255,255,0.2);
        }

        .toast-action-btn {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            padding: 6px 16px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s ease;
        }

        .toast-action-btn:hover {
            background: rgba(255,255,255,0.3);
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
            .toast-notification {
                right: 15px !important;
                left: 15px !important;
                min-width: auto !important;
                max-width: none !important;
            }

            @keyframes slideInRight {
                from {
                    transform: translateY(-100px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
        }
    `;

    document.head.appendChild(style);
}

// Initialize styles when script loads
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectToastStyles);
    } else {
        injectToastStyles();
    }
}

// ========================================
// LEGACY COMPATIBILITY
// ========================================

// Replace alert() calls with toast (optional)
// window.alert = function(message) {
//     showWarning(message);
// };

// Replace confirm() with toast (optional)
// window.confirm = function(message) {
//     showWarning(message, 0);
//     return true; // Or implement custom confirm dialog
// };
