// ========================================
// ADMIN DASHBOARD
// Stackly Resort & Hotel Booking System
// ========================================

// ======================================
// SESSION PROTECTION
// ======================================

// Check if user is logged in and has Admin role
const currentUser = requireAuth(['Admin'], 'signin.html');

if (!currentUser) {
    // requireAuth will handle redirect, but stop execution
    throw new Error('Unauthorized access');
}

// ======================================
// GLOBAL VARIABLES
// ======================================

let globalStats = {};
let allBookings = [];
let allUsers = [];
let allRooms = [];

// ======================================
// INITIALIZE DASHBOARD
// ======================================

window.addEventListener("load", () => {
    showSuccess(`Welcome Back, Admin ${currentUser.firstName}! 👋`);

    // Update admin info in UI
    updateAdminInfo();

    // Load all data
    loadDashboardData();

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
// UPDATE ADMIN INFO
// ======================================

function updateAdminInfo() {
    // Update admin name displays
    const adminNameElements = document.querySelectorAll('.admin-name, .user-name');
    adminNameElements.forEach(el => {
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
}

// ======================================
// LOAD DASHBOARD DATA
// ======================================

function loadDashboardData() {
    // Get global statistics
    globalStats = getGlobalStats();

    // Get all bookings
    allBookings = getAllBookings();

    // Get all users
    allUsers = getUsers();

    // Get all rooms
    allRooms = getRooms();

    // Update dashboard with real data
    updateDashboardStats();
    updateRecentBookings();
}

// ======================================
// UPDATE DASHBOARD STATISTICS
// ======================================

function updateDashboardStats() {
    // Total Bookings
    const totalBookingsEl = document.querySelector('.dashboard-card:nth-child(1) h3');
    if (totalBookingsEl) {
        animateCounter(totalBookingsEl, globalStats.totalBookings, 1500);
    }

    // Total Guests
    const totalGuestsEl = document.querySelector('.dashboard-card:nth-child(2) h3');
    if (totalGuestsEl) {
        animateCounter(totalGuestsEl, globalStats.totalGuests, 1500);
    }

    // Available Rooms
    const availableRoomsEl = document.querySelector('.dashboard-card:nth-child(3) h3');
    if (availableRoomsEl) {
        animateCounter(availableRoomsEl, globalStats.availableRooms, 1500);
    }

    // Monthly Revenue
    const monthlyRevenueEl = document.querySelector('.dashboard-card:nth-child(4) h3');
    if (monthlyRevenueEl) {
        const formattedRevenue = formatPrice(globalStats.monthlyRevenue, false);
        monthlyRevenueEl.textContent = '₹' + formattedRevenue;

        // Animate from 0
        let currentValue = 0;
        const targetValue = globalStats.monthlyRevenue;
        const duration = 2000;
        const increment = targetValue / (duration / 16);

        const animate = () => {
            currentValue += increment;
            if (currentValue < targetValue) {
                monthlyRevenueEl.textContent = '₹' + formatPrice(Math.floor(currentValue), false);
                requestAnimationFrame(animate);
            } else {
                monthlyRevenueEl.textContent = '₹' + formattedRevenue;
            }
        };

        animate();
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

    if (allBookings.length === 0) {
        bookingsTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted py-4">
                    <i class="fa-solid fa-calendar-xmark fa-2x mb-2 d-block"></i>
                    No bookings in the system yet
                </td>
            </tr>
        `;
        return;
    }

    // Sort bookings by date (most recent first)
    const sortedBookings = [...allBookings].sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Show only last 5 bookings
    const recentBookings = sortedBookings.slice(0, 5);

    recentBookings.forEach(booking => {
        const row = document.createElement('tr');
        row.style.cursor = 'pointer';
        row.dataset.bookingId = booking.id;

        // Get guest name
        const user = getUserById(booking.userId);
        const guestName = user ? `${user.firstName} ${user.lastName}` : booking.guestName;

        // Status badge color
        let statusClass = 'bg-success';
        if (booking.status === 'Pending') statusClass = 'bg-warning text-dark';
        if (booking.status === 'Cancelled') statusClass = 'bg-danger';
        if (booking.status === 'Completed') statusClass = 'bg-secondary';

        row.innerHTML = `
            <td><strong>${booking.id}</strong></td>
            <td>${guestName}</td>
            <td>${booking.roomName}</td>
            <td>${formatDate(booking.checkIn, 'short')}</td>
            <td><span class="badge ${statusClass}">${booking.status}</span></td>
        `;

        row.addEventListener('click', () => viewBookingDetails(booking.id));

        bookingsTableBody.appendChild(row);
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

    // Show booking details in a more detailed view
    showSuccess(`Viewing booking ${bookingId}`);

    // Could open a modal or redirect to a detailed view
    // For now, just show a toast
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
            showInfo('Dashboard view');
            break;
        case 'Rooms':
            showRoomsManagement();
            break;
        case 'Bookings':
            showAllBookingsManagement();
            break;
        case 'Guests':
            showGuestsManagement();
            break;
        case 'Staff':
            showGuestsManagement(); // Reuse guests management for now
            break;
        case 'Reviews':
            showReports(); // Show reports for now
            break;
        case 'Reports':
            showReports();
            break;
        case 'Settings':
            showInfo('System settings');
            break;
        default:
            showInfo(`${menuText} clicked`);
    }
}

// ======================================
// ROOMS MANAGEMENT
// ======================================

function showRoomsManagement() {
    showInfo(`Total Rooms: ${allRooms.length} | Available: ${globalStats.availableRooms}`);
}

// ======================================
// BOOKINGS MANAGEMENT
// ======================================

function showAllBookingsManagement() {
    showInfo(`Total Bookings: ${allBookings.length}`);
}

// ======================================
// GUESTS MANAGEMENT
// ======================================

function showGuestsManagement() {
    const guestUsers = allUsers.filter(u => u.role === 'Guest');
    showInfo(`Total Guests: ${guestUsers.length}`);
}

// ======================================
// REPORTS
// ======================================

function showReports() {
    const totalRevenue = allBookings
        .filter(b => b.paymentStatus === 'Paid')
        .reduce((sum, b) => sum + b.totalPrice, 0);

    const message = `
        <strong>System Reports</strong><br>
        Total Bookings: ${allBookings.length}<br>
        Total Revenue: ${formatPrice(totalRevenue)}<br>
        This Month: ${formatPrice(globalStats.monthlyRevenue)}<br>
        Total Users: ${allUsers.length}
    `;

    showSuccess('Reports generated');
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
                case 'Add Room':
                    showRoomsManagement();
                    showInfo('Navigate to Rooms section to add new rooms');
                    break;
                case 'Add Staff':
                    showGuestsManagement();
                    showInfo('Navigate to Staff section to manage team');
                    break;
                case 'Generate Report':
                    showReports();
                    break;
                case 'Send Notification':
                    showSuccess('Notification system ready');
                    break;
                default:
                    showSuccess(`${action} selected`);
            }
        });
    });
}

// ======================================
// ACTIVITY HOVER EFFECTS
// ======================================

const activityItems = document.querySelectorAll('.activity-item');

activityItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateX(8px)';
        item.style.transition = 'all 0.3s ease';
    });

    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateX(0)';
    });
});

// ======================================
// DASHBOARD CARD HOVER
// ======================================

const dashboardCards = document.querySelectorAll('.dashboard-card');

dashboardCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.boxShadow = '0 20px 40px rgba(139,92,246,.25)';
        card.style.transition = 'all 0.3s ease';
    });

    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '0 15px 30px rgba(0,0,0,.05)';
    });
});

// ======================================
// CONSOLE LOGS
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

console.log("Admin Dashboard Loaded:", new Date().toLocaleString());
console.log("Current Admin:", currentUser.firstName, currentUser.lastName);
console.log("Global Stats:", globalStats);
console.log("Total Bookings:", allBookings.length);
console.log("Total Users:", allUsers.length);
console.log("Total Rooms:", allRooms.length);
