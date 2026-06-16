// ========================================
// GUEST DASHBOARD
// Stackly Resort & Hotel Booking System
// ========================================

// ======================================
// SESSION PROTECTION
// ======================================

// Check if user is logged in (any authenticated user can access guest dashboard)
const currentUser = requireAuth(null, 'signin.html');

if (!currentUser) {
    // requireAuth will handle redirect, but stop execution
    throw new Error('Unauthorized access');
}

// ======================================
// GLOBAL VARIABLES
// ======================================

let userBookings = [];
let userWishlist = [];
let userStats = {};

// ======================================
// INITIALIZE DASHBOARD
// ======================================

window.addEventListener("load", () => {
    showSuccess(`Welcome Back, ${currentUser.firstName}! 👋`);

    // Load user data
    loadUserData();

    // Update UI with user info
    updateUserInfo();

    // Setup sidebar navigation
    setupSidebarNavigation();

    // Setup quick actions
    setupQuickActions();

    // Setup logout button
    setupLogoutButton('logoutBtn');

    // Setup mobile menu
    setupMobileMenu();
});

// ======================================
// LOAD USER DATA
// ======================================

function loadUserData() {
    // Get user statistics
    userStats = getUserStats(currentUser.id);

    // Get user bookings
    userBookings = getBookings(currentUser.id);

    // Get user wishlist
    userWishlist = getWishlist(currentUser.id);

    // Update dashboard with real data
    updateDashboardStats();
    updateRecentBookings();
    updateWishlistDisplay();
    updatePaymentHistory();
}

// ======================================
// UPDATE USER INFO
// ======================================

function updateUserInfo() {
    // Update user name displays
    const userNameElements = document.querySelectorAll('.user-name, .guest-name');
    userNameElements.forEach(el => {
        el.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    });

    // Update specific user name elements in header
    const userNameEl = document.getElementById('userName');
    if (userNameEl) {
        userNameEl.textContent = currentUser.firstName;
    }

    const userNameProfileEl = document.getElementById('userNameProfile');
    if (userNameProfileEl) {
        userNameProfileEl.textContent = currentUser.firstName;
    }

    // Update profile image if exists
    const profileImages = document.querySelectorAll('.profile-image, .user-image');
    profileImages.forEach(img => {
        if (currentUser.profileImage) {
            img.src = currentUser.profileImage;
            img.alt = `${currentUser.firstName} ${currentUser.lastName}`;
        }
    });

    // Update email displays
    const emailElements = document.querySelectorAll('.user-email');
    emailElements.forEach(el => {
        el.textContent = currentUser.email;
    });

    // Update email in profile section
    const userEmailEl = document.getElementById('userEmail');
    if (userEmailEl) {
        userEmailEl.textContent = currentUser.email;
    }
}

// ======================================
// UPDATE DASHBOARD STATISTICS
// ======================================

function updateDashboardStats() {
    // Total Bookings
    const totalBookingsEl = document.querySelector('.dashboard-card:nth-child(1) h3');
    if (totalBookingsEl) {
        animateCounter(totalBookingsEl, userStats.totalBookings, 1000);
    }

    // Active Reservations
    const activeReservationsEl = document.querySelector('.dashboard-card:nth-child(2) h3');
    if (activeReservationsEl) {
        animateCounter(activeReservationsEl, userStats.activeReservations, 1000);
    }

    // Wishlist Count
    const wishlistCountEl = document.querySelector('.dashboard-card:nth-child(3) h3');
    if (wishlistCountEl) {
        animateCounter(wishlistCountEl, userStats.wishlistCount, 1000);
    }

    // Membership Status (no animation needed)
    const membershipEl = document.querySelector('.dashboard-card:nth-child(4) h3');
    if (membershipEl) {
        membershipEl.textContent = currentUser.membershipStatus || 'Silver';
    }
}

// ======================================
// UPDATE RECENT BOOKINGS
// ======================================

function updateRecentBookings() {
    const bookingsTableBody = document.querySelector('.table tbody');

    if (!bookingsTableBody) return;

    // Clear existing rows
    bookingsTableBody.innerHTML = '';

    if (userBookings.length === 0) {
        bookingsTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted py-4">
                    <i class="fa-solid fa-calendar-xmark fa-2x mb-2 d-block"></i>
                    No bookings yet. <a href="rooms.html" class="text-decoration-none">Browse Rooms</a>
                </td>
            </tr>
        `;
        return;
    }

    // Sort bookings by date (most recent first)
    const sortedBookings = [...userBookings].sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Show only last 5 bookings
    const recentBookings = sortedBookings.slice(0, 5);

    recentBookings.forEach(booking => {
        const row = document.createElement('tr');
        row.style.cursor = 'pointer';
        row.dataset.bookingId = booking.id;

        // Status badge color
        let statusClass = 'bg-success';
        if (booking.status === 'Pending') statusClass = 'bg-warning';
        if (booking.status === 'Cancelled') statusClass = 'bg-danger';
        if (booking.status === 'Completed') statusClass = 'bg-secondary';

        row.innerHTML = `
            <td><strong>${booking.id}</strong></td>
            <td>${booking.roomName}</td>
            <td>${formatDate(booking.checkIn, 'short')}</td>
            <td><span class="badge ${statusClass}">${booking.status}</span></td>
        `;

        row.addEventListener('click', () => viewBookingDetails(booking.id));

        bookingsTableBody.appendChild(row);
    });
}

// ======================================
// UPDATE WISHLIST DISPLAY
// ======================================

function updateWishlistDisplay() {
    const wishlistList = document.querySelector('.wishlist-list');

    if (!wishlistList) return;

    // Clear existing items
    wishlistList.innerHTML = '';

    if (userWishlist.length === 0) {
        wishlistList.innerHTML = `
            <li class="text-muted text-center py-3">
                <i class="fa-regular fa-heart fa-2x mb-2 d-block"></i>
                No rooms in wishlist. <a href="rooms.html" class="text-decoration-none">Browse Rooms</a>
            </li>
        `;
        return;
    }

    // Get room details for wishlist items
    userWishlist.slice(0, 4).forEach(roomId => {
        const room = getRoomById(roomId);

        if (room) {
            const li = document.createElement('li');
            li.style.cursor = 'pointer';
            li.innerHTML = `
                <span>❤️ ${room.name}</span>
                <button class="btn btn-sm btn-outline-danger remove-wishlist-btn" data-room-id="${roomId}">
                    <i class="fa-solid fa-times"></i>
                </button>
            `;

            li.addEventListener('click', (e) => {
                if (!e.target.closest('.remove-wishlist-btn')) {
                    window.location.href = 'rooms.html';
                }
            });

            wishlistList.appendChild(li);
        }
    });

    // Setup remove buttons
    document.querySelectorAll('.remove-wishlist-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const roomId = btn.dataset.roomId;
            toggleWishlist(currentUser.id, roomId);
            showInfo('Removed from wishlist');
            loadUserData(); // Reload data
        });
    });
}

// ======================================
// UPDATE PAYMENT HISTORY
// ======================================

function updatePaymentHistory() {
    const paymentList = document.querySelector('.payment-list');

    if (!paymentList) return;

    // Clear existing items
    paymentList.innerHTML = '';

    // Get paid bookings
    const paidBookings = userBookings.filter(b => b.paymentStatus === 'Paid');

    if (paidBookings.length === 0) {
        paymentList.innerHTML = `
            <li class="text-muted text-center py-3">
                <i class="fa-regular fa-credit-card fa-2x mb-2 d-block"></i>
                No payment history
            </li>
        `;
        return;
    }

    // Show last 3 payments
    paidBookings.slice(0, 3).forEach(booking => {
        const li = document.createElement('li');
        li.style.cursor = 'pointer';
        li.innerHTML = `
            <div>
                <strong>${formatPrice(booking.totalPrice)}</strong> - ${booking.roomName}
            </div>
            <span class="badge bg-success">💳 ${booking.paymentStatus}</span>
        `;

        li.addEventListener('click', () => viewBookingDetails(booking.id));

        paymentList.appendChild(li);
    });
}

// ======================================
// VIEW BOOKING DETAILS
// ======================================

function viewBookingDetails(bookingId) {
    const booking = getBookingById(bookingId);

    if (!booking) {
        showError('Booking not found');
        return;
    }

    // Redirect to confirmation page
    window.location.href = `booking-confirmation.html?id=${bookingId}`;
}

// ======================================
// SIDEBAR NAVIGATION
// ======================================

function setupSidebarNavigation() {
    const menuItems = document.querySelectorAll(".sidebar ul li");

    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            // Remove active from all
            menuItems.forEach(i => i.classList.remove("active"));

            // Add active to clicked
            item.classList.add("active");

            // Get menu text
            const menuText = item.textContent.trim();

            // Handle navigation
            handleMenuClick(menuText);
        });
    });
}

function handleMenuClick(menuText) {
    switch(menuText) {
        case 'Dashboard':
            // Already on dashboard
            showInfo('Dashboard view');
            break;
        case 'My Bookings':
            showAllBookings();
            break;
        case 'Reserve Room':
            window.location.href = 'rooms.html';
            break;
        case 'Wishlist':
            showWishlistPage();
            break;
        case 'Payments':
            showPaymentsPage();
            break;
        case 'Support':
            window.location.href = 'contact.html';
            break;
        case 'Profile':
            showProfilePage();
            break;
        default:
            showInfo(`${menuText} clicked`);
    }
}

// ======================================
// SHOW ALL BOOKINGS
// ======================================

function showAllBookings() {
    if (userBookings.length === 0) {
        showWarning('You have no bookings yet');
        return;
    }

    const message = `
        <h5>Your Bookings (${userBookings.length})</h5>
        <div class="list-group mt-3">
            ${userBookings.map(booking => `
                <div class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-1">${booking.roomName}</h6>
                            <small>${formatDate(booking.checkIn)} - ${formatDate(booking.checkOut)}</small>
                        </div>
                        <span class="badge bg-${booking.status === 'Confirmed' ? 'success' : 'secondary'}">${booking.status}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    showInfo('View all bookings in the table below');
}

// ======================================
// SHOW WISHLIST PAGE
// ======================================

function showWishlistPage() {
    if (userWishlist.length === 0) {
        showWarning('Your wishlist is empty');
        setTimeout(() => {
            window.location.href = 'rooms.html';
        }, 2000);
        return;
    }

    showSuccess(`You have ${userWishlist.length} room${userWishlist.length > 1 ? 's' : ''} in your wishlist`);
}

// ======================================
// SHOW PAYMENTS PAGE
// ======================================

function showPaymentsPage() {
    const totalSpent = userBookings
        .filter(b => b.paymentStatus === 'Paid')
        .reduce((sum, b) => sum + b.totalPrice, 0);

    showInfo(`Total spent: ${formatPrice(totalSpent)}`);
}

// ======================================
// SHOW PROFILE PAGE
// ======================================

function showProfilePage() {
    const profileInfo = `
        <strong>Profile Information</strong><br>
        Name: ${currentUser.firstName} ${currentUser.lastName}<br>
        Email: ${currentUser.email}<br>
        Role: ${currentUser.role}<br>
        Member Since: ${formatDate(currentUser.createdAt || new Date())}
    `;
    showInfo('Profile section - Update features available soon');
}

// ======================================
// QUICK ACTIONS
// ======================================

function setupQuickActions() {
    const actionCards = document.querySelectorAll(".action-card");

    actionCards.forEach(card => {
        card.addEventListener("click", () => {
            const action = card.querySelector("h5").innerText;

            switch(action) {
                case 'Book Room':
                    window.location.href = 'rooms.html';
                    break;
                case 'View Wishlist':
                    showWishlistPage();
                    break;
                case 'Payments':
                    showPaymentsPage();
                    break;
                case 'Contact Support':
                    window.location.href = 'contact.html';
                    break;
                default:
                    showSuccess(`${action} selected`);
            }
        });
    });
}

// ======================================
// CURRENT DATE
// ======================================

// ======================================
// MOBILE MENU
// ======================================

function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');

    if (!menuToggle || !sidebar || !mobileOverlay) return;

    // Toggle menu
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        sidebar.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    });

    // Close on overlay click
    mobileOverlay.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        sidebar.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close on menu item click (mobile only)
    const menuItems = document.querySelectorAll('.sidebar ul li');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 992) {
                menuToggle.classList.remove('active');
                sidebar.classList.remove('active');
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992) {
            menuToggle.classList.remove('active');
            sidebar.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ======================================
// CONSOLE LOGS
// ======================================

console.log("Guest Dashboard Loaded:", new Date().toLocaleString());
console.log("Current User:", currentUser.firstName, currentUser.lastName);
console.log("User Stats:", userStats);
