// ========================================
// GLOBAL NAVBAR HANDLER
// Stackly Resort & Hotel Booking System
// Handle navbar buttons and navigation
// ========================================

/**
 * Initialize navbar functionality
 */
function initNavbar() {
    console.log('🚀 Initializing navbar...');

    try {
        // Handle Sign In button
        const signinButtons = document.querySelectorAll('.signin-btn');
        console.log(`Found ${signinButtons.length} sign-in buttons`);
        signinButtons.forEach(btn => {
            // Skip if it's already an anchor tag
            if (btn.tagName === 'A') return;

            btn.addEventListener('click', () => {
                window.location.href = 'signin.html';
            });
        });

        // Handle Sign Up button
        const signupButtons = document.querySelectorAll('.signup-btn');
        console.log(`Found ${signupButtons.length} sign-up buttons`);
        signupButtons.forEach(btn => {
            // Skip if it's already an anchor tag
            if (btn.tagName === 'A') return;

            btn.addEventListener('click', () => {
                window.location.href = 'signup.html';
            });
        });

        // Handle Book Now button - specifically target navbar buttons
        const navbarBookButtons = document.querySelectorAll('.navbar-buttons .book-btn');
        console.log(`Found ${navbarBookButtons.length} navbar book-now buttons`);
        navbarBookButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                console.log('📍 Navbar Book button clicked! Redirecting to rooms.html');
                e.preventDefault();
                e.stopPropagation();
                window.location.href = 'rooms.html';
            });
            console.log('✅ Added click listener to navbar book button');
        });

        // Handle all other Book Now buttons on the page
        const allBookButtons = document.querySelectorAll('.book-btn:not(.navbar-buttons .book-btn)');
        console.log(`Found ${allBookButtons.length} other book-now buttons`);
        allBookButtons.forEach(btn => {
            // Skip if it's already an anchor tag
            if (btn.tagName === 'A') return;

            // Skip if it's a submit button
            if (btn.type === 'submit') return;

            // Skip if it has specific booking functionality
            if (btn.hasAttribute('onclick')) return;

            // Add event listener
            btn.addEventListener('click', (e) => {
                console.log('📍 Page Book button clicked! Redirecting to rooms.html');
                e.preventDefault();
                window.location.href = 'rooms.html';
            });
        });

        // Handle navbar active state
        setActiveNavLink();

        // Handle mobile navbar toggle (if exists)
        initMobileNav();

        // Show/hide auth buttons based on login status
        try {
            if (typeof getCurrentUser === 'function') {
                updateAuthButtons();
            }
        } catch (err) {
            console.log('Auth buttons update skipped:', err.message);
        }

        console.log('✅ Navbar initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing navbar:', error);
    }
}

/**
 * Set active nav link based on current page
 */
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');

        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === 'index.html' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize mobile navigation toggle
 */
function initMobileNav() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (!navbarToggler || !navbarCollapse) return;

    // Close mobile menu when clicking nav links
    const navLinks = navbarCollapse.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbarToggler.contains(e.target) &&
            !navbarCollapse.contains(e.target) &&
            navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    });
}

/**
 * Update navbar auth buttons based on login status
 */
function updateAuthButtons() {
    const currentUser = getCurrentUser();

    if (currentUser) {
        // User is logged in - show user menu instead of auth buttons
        const navbarButtons = document.querySelector('.navbar-buttons');

        if (navbarButtons) {
            navbarButtons.innerHTML = `
                <div class="dropdown">
                    <button class="btn btn-link dropdown-toggle text-white text-decoration-none"
                            type="button"
                            id="userDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false">
                        <i class="fa-solid fa-user-circle me-1"></i>
                        ${currentUser.firstName}
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                        <li>
                            <a class="dropdown-item" href="${getDashboardUrl(currentUser.role)}">
                                <i class="fa-solid fa-gauge me-2"></i>Dashboard
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="guest.html">
                                <i class="fa-solid fa-calendar-check me-2"></i>My Bookings
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="rooms.html">
                                <i class="fa-solid fa-bed me-2"></i>Browse Rooms
                            </a>
                        </li>
                        <li><hr class="dropdown-divider"></li>
                        <li>
                            <a class="dropdown-item" href="#" id="logoutBtn">
                                <i class="fa-solid fa-sign-out-alt me-2"></i>Logout
                            </a>
                        </li>
                    </ul>
                </div>
            `;

            // Add logout handler
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    logoutUser();
                });
            }
        }
    }
}

/**
 * Get dashboard URL based on user role
 * @param {string} role - User role
 * @returns {string} Dashboard URL
 */
function getDashboardUrl(role) {
    const dashboards = {
        'Admin': 'admin.html',
        'Staff': 'staff.html',
        'Guest': 'guest.html'
    };

    return dashboards[role] || 'guest.html';
}

/**
 * Scroll navbar background on scroll
 */
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');

    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
}

// Initialize navbar when DOM is ready
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initNavbar();
            handleNavbarScroll();
        });
    } else {
        initNavbar();
        handleNavbarScroll();
    }
}
