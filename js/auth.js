// ========================================
// AUTHENTICATION MODULE
// Stackly Resort & Hotel Booking System
// Session Management & Authentication
// ========================================

// ========================================
// AUTHENTICATION FUNCTIONS
// ========================================

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Object} { success: boolean, message: string, user: Object }
 */
function registerUser(userData) {
    // Validate required fields
    if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
        return {
            success: false,
            message: 'Please fill in all required fields',
            user: null
        };
    }

    // Validate email format
    const emailValidation = validateEmail(userData.email);
    if (!emailValidation.valid) {
        return {
            success: false,
            message: emailValidation.message,
            user: null
        };
    }

    // Check if email already exists
    if (isEmailRegistered(userData.email)) {
        return {
            success: false,
            message: 'Email is already registered. Please sign in instead.',
            user: null
        };
    }

    // Validate password
    const passwordValidation = validatePassword(userData.password);
    if (!passwordValidation.valid) {
        return {
            success: false,
            message: passwordValidation.message,
            user: null
        };
    }

    // Save user
    const user = saveUser(userData);

    if (user) {
        return {
            success: true,
            message: 'Registration successful! Please sign in.',
            user: user
        };
    } else {
        return {
            success: false,
            message: 'Registration failed. Please try again.',
            user: null
        };
    }
}

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} role - Selected role (Guest, Staff, Admin)
 * @returns {Object} { success: boolean, message: string, user: Object }
 */
function loginUser(email, password, role = null) {
    // Validate inputs
    if (!email || !password) {
        return {
            success: false,
            message: 'Please enter email and password',
            user: null
        };
    }

    // Get user by email
    const user = getUserByEmail(email);

    if (!user) {
        return {
            success: false,
            message: 'Invalid email or password',
            user: null
        };
    }

    // Verify password
    const decodedPassword = decodePassword(user.password);

    if (decodedPassword !== password) {
        return {
            success: false,
            message: 'Invalid email or password',
            user: null
        };
    }

    // Check role if specified
    if (role && user.role !== role) {
        return {
            success: false,
            message: `This account is not registered as ${role}. Please select the correct role.`,
            user: null
        };
    }

    // Set current user (create session)
    setCurrentUser(user);

    return {
        success: true,
        message: `Welcome back, ${user.firstName}!`,
        user: user
    };
}

/**
 * Logout current user
 */
function logoutUser() {
    logout();
    showSuccess('Logged out successfully');

    // Redirect to signin page after a short delay
    setTimeout(() => {
        window.location.href = 'signin.html';
    }, 1000);
}

/**
 * Check if user is authenticated
 * @param {Array} allowedRoles - Array of allowed roles (optional)
 * @returns {Object|boolean} User object if authenticated, false otherwise
 */
function checkAuth(allowedRoles = null) {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        return false;
    }

    // Check if role is allowed
    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        return false;
    }

    return currentUser;
}

/**
 * Require authentication (redirect if not logged in)
 * @param {Array} allowedRoles - Array of allowed roles
 * @param {string} redirectTo - URL to redirect to if not authenticated
 */
function requireAuth(allowedRoles = null, redirectTo = 'signin.html') {
    const user = checkAuth(allowedRoles);

    if (!user) {
        showWarning('Please sign in to access this page');

        setTimeout(() => {
            window.location.href = redirectTo;
        }, 1500);

        return false;
    }

    return user;
}

/**
 * Redirect user to their dashboard based on role
 * @param {Object} user - User object
 */
function redirectToDashboard(user) {
    const dashboards = {
        'Admin': 'admin.html',
        'Staff': 'staff.html',
        'Guest': 'guest.html'
    };

    const dashboardUrl = dashboards[user.role] || 'guest.html';

    window.location.href = dashboardUrl;
}

// ========================================
// PASSWORD MANAGEMENT
// ========================================

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Object} { success: boolean, message: string }
 */
function changePassword(userId, currentPassword, newPassword) {
    const user = getUserById(userId);

    if (!user) {
        return {
            success: false,
            message: 'User not found'
        };
    }

    // Verify current password
    const decodedPassword = decodePassword(user.password);

    if (decodedPassword !== currentPassword) {
        return {
            success: false,
            message: 'Current password is incorrect'
        };
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
        return {
            success: false,
            message: passwordValidation.message
        };
    }

    // Update password
    const updated = updateUser(userId, {
        password: encodePassword(newPassword)
    });

    if (updated) {
        return {
            success: true,
            message: 'Password changed successfully'
        };
    } else {
        return {
            success: false,
            message: 'Failed to update password'
        };
    }
}

/**
 * Reset password (forgot password flow)
 * @param {string} email - User email
 * @param {string} newPassword - New password
 * @returns {Object} { success: boolean, message: string }
 */
function resetPassword(email, newPassword) {
    const user = getUserByEmail(email);

    if (!user) {
        return {
            success: false,
            message: 'Email not found'
        };
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
        return {
            success: false,
            message: passwordValidation.message
        };
    }

    // Update password
    const updated = updateUser(user.id, {
        password: encodePassword(newPassword)
    });

    if (updated) {
        return {
            success: true,
            message: 'Password reset successfully. Please sign in with your new password.'
        };
    } else {
        return {
            success: false,
            message: 'Failed to reset password'
        };
    }
}

// ========================================
// USER PROFILE MANAGEMENT
// ========================================

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} profileData - Profile data to update
 * @returns {Object} { success: boolean, message: string }
 */
function updateProfile(userId, profileData) {
    // Validate data if present
    if (profileData.email) {
        const emailValidation = validateEmail(profileData.email);
        if (!emailValidation.valid) {
            return {
                success: false,
                message: emailValidation.message
            };
        }

        // Check if email is taken by another user
        const existingUser = getUserByEmail(profileData.email);
        if (existingUser && existingUser.id !== userId) {
            return {
                success: false,
                message: 'Email is already taken by another user'
            };
        }
    }

    if (profileData.firstName) {
        const nameValidation = validateName(profileData.firstName, 'First name');
        if (!nameValidation.valid) {
            return {
                success: false,
                message: nameValidation.message
            };
        }
    }

    if (profileData.lastName) {
        const nameValidation = validateName(profileData.lastName, 'Last name');
        if (!nameValidation.valid) {
            return {
                success: false,
                message: nameValidation.message
            };
        }
    }

    if (profileData.mobile) {
        const phoneValidation = validatePhone(profileData.mobile);
        if (!phoneValidation.valid) {
            return {
                success: false,
                message: phoneValidation.message
            };
        }
    }

    // Update user
    const updated = updateUser(userId, profileData);

    if (updated) {
        return {
            success: true,
            message: 'Profile updated successfully'
        };
    } else {
        return {
            success: false,
            message: 'Failed to update profile'
        };
    }
}

/**
 * Upload profile image (convert to base64)
 * @param {string} userId - User ID
 * @param {File} imageFile - Image file
 * @returns {Promise} Promise that resolves with result object
 */
function uploadProfileImage(userId, imageFile) {
    return new Promise((resolve, reject) => {
        // Validate file type
        if (!imageFile.type.startsWith('image/')) {
            resolve({
                success: false,
                message: 'Please select a valid image file'
            });
            return;
        }

        // Validate file size (max 2MB)
        if (imageFile.size > 2 * 1024 * 1024) {
            resolve({
                success: false,
                message: 'Image size must be less than 2MB'
            });
            return;
        }

        // Convert to base64
        const reader = new FileReader();

        reader.onload = function(e) {
            const base64Image = e.target.result;

            // Update user profile
            const updated = updateUser(userId, {
                profileImage: base64Image
            });

            if (updated) {
                resolve({
                    success: true,
                    message: 'Profile image updated successfully',
                    imageUrl: base64Image
                });
            } else {
                resolve({
                    success: false,
                    message: 'Failed to update profile image'
                });
            }
        };

        reader.onerror = function() {
            resolve({
                success: false,
                message: 'Failed to read image file'
            });
        };

        reader.readAsDataURL(imageFile);
    });
}

// ========================================
// SESSION UTILITIES
// ========================================

/**
 * Get session duration in minutes
 * @returns {number} Session duration in minutes
 */
function getSessionDuration() {
    const user = getCurrentUser();

    if (!user || !user.sessionStart) {
        return 0;
    }

    const sessionStart = new Date(user.sessionStart);
    const now = new Date();

    const durationMs = now - sessionStart;
    const durationMinutes = Math.floor(durationMs / (1000 * 60));

    return durationMinutes;
}

/**
 * Check if session is expired
 * @param {number} maxDuration - Max session duration in minutes (default 1440 = 24 hours)
 * @returns {boolean} True if expired
 */
function isSessionExpired(maxDuration = 1440) {
    const duration = getSessionDuration();
    return duration >= maxDuration;
}

/**
 * Refresh session (update session start time)
 */
function refreshSession() {
    const user = getCurrentUser();

    if (user) {
        user.sessionStart = new Date().toISOString();
        setCurrentUser(user);
    }
}

/**
 * Auto-logout on session expiry
 * @param {number} maxDuration - Max session duration in minutes
 */
function setupAutoLogout(maxDuration = 1440) {
    // Check every 5 minutes
    setInterval(() => {
        if (isSessionExpired(maxDuration)) {
            showWarning('Your session has expired. Please sign in again.');

            setTimeout(() => {
                logoutUser();
            }, 2000);
        }
    }, 5 * 60 * 1000); // 5 minutes
}

// ========================================
// INITIALIZATION
// ========================================

/**
 * Initialize authentication system
 * Setup event listeners and session checks
 */
function initAuth() {
    // Refresh session on activity
    ['click', 'keypress', 'scroll', 'mousemove'].forEach(event => {
        document.addEventListener(event, throttle(() => {
            if (isLoggedIn()) {
                refreshSession();
            }
        }, 60000)); // Throttle to once per minute
    });

    // Setup auto-logout (24 hours)
    // setupAutoLogout(1440);
}

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAuth);
    } else {
        initAuth();
    }
}

// ========================================
// HELPER FUNCTIONS FOR PAGES
// ========================================

/**
 * Display user info in navbar/header
 * @param {string} nameElementId - Element ID to display name
 * @param {string} imageElementId - Element ID to display profile image (optional)
 */
function displayUserInfo(nameElementId, imageElementId = null) {
    const user = getCurrentUser();

    if (!user) return;

    // Display name
    const nameElement = document.getElementById(nameElementId);
    if (nameElement) {
        nameElement.textContent = `${user.firstName} ${user.lastName}`;
    }

    // Display profile image
    if (imageElementId) {
        const imageElement = document.getElementById(imageElementId);
        if (imageElement && user.profileImage) {
            imageElement.src = user.profileImage;
            imageElement.alt = `${user.firstName} ${user.lastName}`;
        }
    }
}

/**
 * Setup logout button
 * @param {string} buttonId - Logout button ID
 */
function setupLogoutButton(buttonId) {
    const logoutBtn = document.getElementById(buttonId);

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logoutUser();
        });
    }
}
