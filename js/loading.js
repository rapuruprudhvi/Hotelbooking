// ========================================
// LOADING MODULE
// Stackly Resort & Hotel Booking System
// Loading States and Spinners
// ========================================

// ========================================
// FULL-PAGE LOADING OVERLAY
// ========================================

let loadingOverlay = null;

/**
 * Show full-page loading overlay
 * @param {string} message - Loading message to display
 */
function showLoading(message = 'Loading...') {
    // Remove existing overlay if any
    hideLoading();

    // Create overlay
    loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        backdrop-filter: blur(5px);
    `;

    // Create spinner
    const spinner = document.createElement('div');
    spinner.style.cssText = `
        width: 60px;
        height: 60px;
        border: 5px solid rgba(255, 255, 255, 0.3);
        border-top: 5px solid #d4af37;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    `;

    // Create message
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.style.cssText = `
        color: white;
        font-size: 1.1rem;
        font-weight: 600;
        margin-top: 20px;
        font-family: 'Poppins', sans-serif;
    `;

    // Add spin animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // Assemble overlay
    loadingOverlay.appendChild(spinner);
    loadingOverlay.appendChild(messageElement);
    document.body.appendChild(loadingOverlay);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

/**
 * Hide full-page loading overlay
 */
function hideLoading() {
    if (loadingOverlay && loadingOverlay.parentElement) {
        loadingOverlay.remove();
        loadingOverlay = null;
        document.body.style.overflow = '';
    }
}

/**
 * Show loading with auto-hide after duration
 * @param {string} message - Loading message
 * @param {number} duration - Duration in milliseconds
 */
function showLoadingWithTimeout(message = 'Loading...', duration = 2000) {
    showLoading(message);
    setTimeout(() => {
        hideLoading();
    }, duration);
}

// ========================================
// BUTTON LOADING STATES
// ========================================

const buttonStates = new Map();

/**
 * Show loading state on a button
 * @param {string} buttonId - Button element ID
 * @param {string} loadingText - Text to show during loading (default: spinner only)
 */
function showButtonLoading(buttonId, loadingText = '') {
    const button = document.getElementById(buttonId);
    if (!button) return;

    // Store original state
    if (!buttonStates.has(buttonId)) {
        buttonStates.set(buttonId, {
            innerHTML: button.innerHTML,
            disabled: button.disabled
        });
    }

    // Disable button
    button.disabled = true;

    // Create spinner
    const spinner = `
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
    `;

    // Update button content
    if (loadingText) {
        button.innerHTML = spinner + loadingText;
    } else {
        button.innerHTML = spinner + 'Processing...';
    }

    // Add loading class
    button.classList.add('btn-loading');
}

/**
 * Hide loading state on a button and restore original state
 * @param {string} buttonId - Button element ID
 */
function hideButtonLoading(buttonId) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    // Restore original state
    const originalState = buttonStates.get(buttonId);
    if (originalState) {
        button.innerHTML = originalState.innerHTML;
        button.disabled = originalState.disabled;
        buttonStates.delete(buttonId);
    }

    // Remove loading class
    button.classList.remove('btn-loading');
}

/**
 * Show loading state on a button with custom spinner
 * @param {string} buttonId - Button element ID
 * @param {string} spinnerColor - Spinner color (primary, light, etc.)
 */
function showButtonSpinner(buttonId, spinnerColor = 'light') {
    const button = document.getElementById(buttonId);
    if (!button) return;

    // Store original state
    if (!buttonStates.has(buttonId)) {
        buttonStates.set(buttonId, {
            innerHTML: button.innerHTML,
            disabled: button.disabled
        });
    }

    // Disable button
    button.disabled = true;

    // Create spinner
    button.innerHTML = `
        <span class="spinner-border spinner-border-sm text-${spinnerColor}" role="status">
            <span class="visually-hidden">Loading...</span>
        </span>
    `;

    // Add loading class
    button.classList.add('btn-loading');
}

// ========================================
// INLINE LOADING INDICATORS
// ========================================

/**
 * Show inline loading indicator in a container
 * @param {string} containerId - Container element ID
 * @param {string} message - Loading message
 */
function showInlineLoading(containerId, message = 'Loading...') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const loadingHTML = `
        <div class="text-center py-5 inline-loading">
            <div class="spinner-border text-primary mb-3" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="text-muted">${message}</div>
        </div>
    `;

    container.innerHTML = loadingHTML;
}

/**
 * Hide inline loading indicator
 * @param {string} containerId - Container element ID
 */
function hideInlineLoading(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const loadingElement = container.querySelector('.inline-loading');
    if (loadingElement) {
        loadingElement.remove();
    }
}

// ========================================
// SKELETON LOADERS
// ========================================

/**
 * Show skeleton loader for cards
 * @param {string} containerId - Container element ID
 * @param {number} count - Number of skeleton cards to show
 */
function showSkeletonCards(containerId, count = 3) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let skeletonHTML = '';
    for (let i = 0; i < count; i++) {
        skeletonHTML += `
            <div class="col-md-4 mb-4">
                <div class="card skeleton-card">
                    <div class="skeleton skeleton-image" style="height: 200px;"></div>
                    <div class="card-body">
                        <div class="skeleton skeleton-text mb-2" style="height: 20px; width: 70%;"></div>
                        <div class="skeleton skeleton-text mb-2" style="height: 15px; width: 100%;"></div>
                        <div class="skeleton skeleton-text" style="height: 15px; width: 80%;"></div>
                    </div>
                </div>
            </div>
        `;
    }

    container.innerHTML = skeletonHTML;

    // Add skeleton CSS if not already present
    if (!document.getElementById('skeleton-styles')) {
        const style = document.createElement('style');
        style.id = 'skeleton-styles';
        style.textContent = `
            .skeleton {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: skeleton-loading 1.5s infinite;
                border-radius: 4px;
            }

            @keyframes skeleton-loading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }

            .skeleton-image {
                border-radius: 8px 8px 0 0;
            }

            .skeleton-text {
                border-radius: 4px;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Show skeleton loader for table rows
 * @param {string} tableBodyId - Table body element ID
 * @param {number} rows - Number of skeleton rows to show
 * @param {number} columns - Number of columns
 */
function showSkeletonTable(tableBodyId, rows = 5, columns = 4) {
    const tableBody = document.getElementById(tableBodyId);
    if (!tableBody) return;

    let skeletonHTML = '';
    for (let i = 0; i < rows; i++) {
        skeletonHTML += '<tr>';
        for (let j = 0; j < columns; j++) {
            skeletonHTML += `
                <td>
                    <div class="skeleton skeleton-text" style="height: 15px; width: ${60 + Math.random() * 40}%;"></div>
                </td>
            `;
        }
        skeletonHTML += '</tr>';
    }

    tableBody.innerHTML = skeletonHTML;
}

// ========================================
// PROGRESS BAR
// ========================================

let progressBar = null;

/**
 * Show progress bar at top of page
 * @param {number} progress - Progress percentage (0-100)
 */
function showProgressBar(progress = 0) {
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.id = 'progress-bar';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: linear-gradient(90deg, #d4af37, #f4d03f);
            z-index: 99999;
            transition: width 0.3s ease;
            box-shadow: 0 2px 10px rgba(212, 175, 55, 0.5);
        `;
        document.body.appendChild(progressBar);
    }

    progressBar.style.width = Math.min(progress, 100) + '%';
}

/**
 * Hide progress bar
 */
function hideProgressBar() {
    if (progressBar && progressBar.parentElement) {
        progressBar.style.width = '100%';
        setTimeout(() => {
            if (progressBar) {
                progressBar.remove();
                progressBar = null;
            }
        }, 300);
    }
}

/**
 * Animate progress bar from 0 to 100
 * @param {number} duration - Duration in milliseconds
 */
function animateProgressBar(duration = 2000) {
    showProgressBar(0);

    const steps = 20;
    const stepDuration = duration / steps;
    const increment = 100 / steps;

    let currentProgress = 0;
    const interval = setInterval(() => {
        currentProgress += increment;
        showProgressBar(currentProgress);

        if (currentProgress >= 100) {
            clearInterval(interval);
            setTimeout(hideProgressBar, 300);
        }
    }, stepDuration);
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Execute function with loading state
 * @param {Function} fn - Async function to execute
 * @param {string} loadingMessage - Loading message to show
 * @returns {Promise} Promise that resolves with function result
 */
async function withLoading(fn, loadingMessage = 'Processing...') {
    showLoading(loadingMessage);
    try {
        const result = await fn();
        hideLoading();
        return result;
    } catch (error) {
        hideLoading();
        throw error;
    }
}

/**
 * Execute function with button loading state
 * @param {string} buttonId - Button element ID
 * @param {Function} fn - Async function to execute
 * @param {string} loadingText - Loading text for button
 * @returns {Promise} Promise that resolves with function result
 */
async function withButtonLoading(buttonId, fn, loadingText = 'Processing...') {
    showButtonLoading(buttonId, loadingText);
    try {
        const result = await fn();
        hideButtonLoading(buttonId);
        return result;
    } catch (error) {
        hideButtonLoading(buttonId);
        throw error;
    }
}

/**
 * Simulate loading delay (for testing)
 * @param {number} duration - Duration in milliseconds
 * @returns {Promise} Promise that resolves after duration
 */
function simulateLoading(duration = 1000) {
    return new Promise(resolve => setTimeout(resolve, duration));
}

// ========================================
// AUTO-INITIALIZATION
// ========================================

// Add global CSS for loading states
const loadingStyles = document.createElement('style');
loadingStyles.textContent = `
    .btn-loading {
        position: relative;
        pointer-events: none;
        opacity: 0.8;
    }

    .spinner-border-sm {
        width: 1rem;
        height: 1rem;
        border-width: 0.15rem;
    }
`;
document.head.appendChild(loadingStyles);
