// ========================================
// STAFF DASHBOARD
// Stackly Resort & Hotel Booking System
// ========================================

// ======================================
// SESSION PROTECTION
// ======================================

// Check if user is logged in and has Staff role
const currentUser = requireAuth(['Staff'], 'signin.html');

if (!currentUser) {
    // requireAuth will handle redirect, but stop execution
    throw new Error('Unauthorized access');
}

// ======================================
// GLOBAL VARIABLES
// ======================================

let staffStats = {};
let allBookings = [];
let allRooms = [];
let todayCheckIns = [];
let todayCheckOuts = [];
let assignedRooms = [];

// ======================================
// INITIALIZE DASHBOARD
// ======================================

window.addEventListener("load", () => {
    showSuccess(`Welcome Back, ${currentUser.firstName}! 👋`);

    // Update staff info in UI
    updateStaffInfo();

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
// UPDATE STAFF INFO
// ======================================

function updateStaffInfo() {
    // Update staff name displays
    const staffNameElements = document.querySelectorAll('.staff-name, .user-name');
    staffNameElements.forEach(el => {
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
    // Get all bookings and rooms
    allBookings = getAllBookings();
    allRooms = getRooms();

    // Get today's date
    const today = getTodayDate();

    // Filter today's check-ins (bookings where checkIn === today and status is Confirmed)
    todayCheckIns = allBookings.filter(booking =>
        booking.checkIn === today &&
        (booking.status === 'Confirmed' || booking.status === 'Pending')
    );

    // Filter today's check-outs (bookings where checkOut === today and status is Confirmed)
    todayCheckOuts = allBookings.filter(booking =>
        booking.checkOut === today &&
        booking.status === 'Confirmed'
    );

    // Get assigned rooms (rooms currently occupied or need cleaning)
    assignedRooms = allRooms.filter(room =>
        room.status === 'Occupied' || room.status === 'Cleaning'
    );

    // Calculate staff statistics
    staffStats = {
        assignedRooms: assignedRooms.length,
        todayCheckIns: todayCheckIns.length,
        todayCheckOuts: todayCheckOuts.length,
        cleaningTasks: allRooms.filter(room => room.status === 'Cleaning').length
    };

    // Update dashboard with real data
    updateDashboardStats();
    updateTodaySchedule();
    updateAssignedRooms();
    updateGuestRequests();
}

// ======================================
// UPDATE DASHBOARD STATISTICS
// ======================================

function updateDashboardStats() {
    // Assigned Rooms
    const assignedRoomsEl = document.querySelector('.dashboard-card:nth-child(1) h3');
    if (assignedRoomsEl) {
        animateCounter(assignedRoomsEl, staffStats.assignedRooms, 1000);
    }

    // Today's Check-Ins
    const checkInsEl = document.querySelector('.dashboard-card:nth-child(2) h3');
    if (checkInsEl) {
        animateCounter(checkInsEl, staffStats.todayCheckIns, 1000);
    }

    // Today's Check-Outs
    const checkOutsEl = document.querySelector('.dashboard-card:nth-child(3) h3');
    if (checkOutsEl) {
        animateCounter(checkOutsEl, staffStats.todayCheckOuts, 1000);
    }

    // Cleaning Tasks
    const cleaningTasksEl = document.querySelector('.dashboard-card:nth-child(4) h3');
    if (cleaningTasksEl) {
        animateCounter(cleaningTasksEl, staffStats.cleaningTasks, 1000);
    }
}

// ======================================
// UPDATE TODAY'S SCHEDULE
// ======================================

function updateTodaySchedule() {
    const scheduleContainer = document.querySelector('.today-schedule .schedule-list');

    if (!scheduleContainer) return;

    // Clear existing schedule
    scheduleContainer.innerHTML = '';

    // Add check-ins to schedule
    todayCheckIns.forEach(booking => {
        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'schedule-item';
        scheduleItem.style.padding = '12px 0';
        scheduleItem.style.borderBottom = '1px dashed #e5e7eb';
        scheduleItem.style.transition = 'all 0.3s ease';

        const user = getUserById(booking.userId);
        const guestName = user ? `${user.firstName} ${user.lastName}` : booking.guestName;

        scheduleItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <strong class="text-success">CHECK-IN</strong> - ${guestName}
                    <br>
                    <small class="text-muted">${booking.roomName} • ${formatDate(booking.checkIn, 'short')}</small>
                </div>
                <button class="btn btn-sm btn-outline-success checkin-btn" data-booking-id="${booking.id}">
                    <i class="fa-solid fa-check"></i> Check In
                </button>
            </div>
        `;

        // Add hover effect
        scheduleItem.addEventListener('mouseenter', () => {
            scheduleItem.style.background = '#f8fafc';
            scheduleItem.style.paddingLeft = '15px';
        });

        scheduleItem.addEventListener('mouseleave', () => {
            scheduleItem.style.background = 'transparent';
            scheduleItem.style.paddingLeft = '0px';
        });

        scheduleContainer.appendChild(scheduleItem);
    });

    // Add check-outs to schedule
    todayCheckOuts.forEach(booking => {
        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'schedule-item';
        scheduleItem.style.padding = '12px 0';
        scheduleItem.style.borderBottom = '1px dashed #e5e7eb';
        scheduleItem.style.transition = 'all 0.3s ease';

        const user = getUserById(booking.userId);
        const guestName = user ? `${user.firstName} ${user.lastName}` : booking.guestName;

        scheduleItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <strong class="text-danger">CHECK-OUT</strong> - ${guestName}
                    <br>
                    <small class="text-muted">${booking.roomName} • ${formatDate(booking.checkOut, 'short')}</small>
                </div>
                <button class="btn btn-sm btn-outline-danger checkout-btn" data-booking-id="${booking.id}">
                    <i class="fa-solid fa-right-from-bracket"></i> Check Out
                </button>
            </div>
        `;

        // Add hover effect
        scheduleItem.addEventListener('mouseenter', () => {
            scheduleItem.style.background = '#f8fafc';
            scheduleItem.style.paddingLeft = '15px';
        });

        scheduleItem.addEventListener('mouseleave', () => {
            scheduleItem.style.background = 'transparent';
            scheduleItem.style.paddingLeft = '0px';
        });

        scheduleContainer.appendChild(scheduleItem);
    });

    // Empty state
    if (todayCheckIns.length === 0 && todayCheckOuts.length === 0) {
        scheduleContainer.innerHTML = `
            <div class="text-center text-muted py-4">
                <i class="fa-regular fa-calendar-check fa-2x mb-2 d-block"></i>
                No check-ins or check-outs scheduled for today
            </div>
        `;
    }

    // Setup check-in buttons
    document.querySelectorAll('.checkin-btn').forEach(btn => {
        btn.addEventListener('click', () => handleCheckIn(btn.dataset.bookingId));
    });

    // Setup check-out buttons
    document.querySelectorAll('.checkout-btn').forEach(btn => {
        btn.addEventListener('click', () => handleCheckOut(btn.dataset.bookingId));
    });
}

// ======================================
// UPDATE ASSIGNED ROOMS
// ======================================

function updateAssignedRooms() {
    const roomsContainer = document.querySelector('.assigned-rooms .rooms-list');

    if (!roomsContainer) return;

    // Clear existing rooms
    roomsContainer.innerHTML = '';

    if (assignedRooms.length === 0) {
        roomsContainer.innerHTML = `
            <div class="text-center text-muted py-4">
                <i class="fa-solid fa-bed fa-2x mb-2 d-block"></i>
                No rooms currently assigned
            </div>
        `;
        return;
    }

    assignedRooms.forEach(room => {
        const roomItem = document.createElement('div');
        roomItem.className = 'room-item mb-3';
        roomItem.style.padding = '15px';
        roomItem.style.background = '#f9fafb';
        roomItem.style.borderRadius = '12px';
        roomItem.style.border = '1px solid #e5e7eb';

        const statusBadge = room.status === 'Occupied' ?
            '<span class="badge bg-warning">Occupied</span>' :
            '<span class="badge bg-info">Needs Cleaning</span>';

        roomItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-1">${room.name}</h6>
                    <small class="text-muted">${room.type} • ${room.guests} Guests</small>
                    <div class="mt-2">${statusBadge}</div>
                </div>
                <div>
                    ${room.status === 'Cleaning' ?
                        `<button class="btn btn-sm btn-outline-primary clean-btn" data-room-id="${room.id}">
                            <i class="fa-solid fa-broom"></i> Mark Clean
                        </button>` :
                        `<button class="btn btn-sm btn-outline-secondary view-btn" data-room-id="${room.id}">
                            <i class="fa-solid fa-eye"></i> View
                        </button>`
                    }
                </div>
            </div>
        `;

        roomsContainer.appendChild(roomItem);
    });

    // Setup clean buttons
    document.querySelectorAll('.clean-btn').forEach(btn => {
        btn.addEventListener('click', () => handleMarkClean(btn.dataset.roomId));
    });

    // Setup view buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => handleViewRoom(btn.dataset.roomId));
    });
}

// ======================================
// UPDATE GUEST REQUESTS
// ======================================

function updateGuestRequests() {
    const requestsContainer = document.querySelector('.request-list');

    if (!requestsContainer) return;

    // For now, show placeholder requests
    // In a real system, this would come from a guest requests database
    const placeholderRequests = [
        { guest: 'Sample Guest', room: '101', request: 'Extra towels needed' },
        { guest: 'Sample Guest 2', room: '205', request: 'Room service request' }
    ];

    requestsContainer.innerHTML = '';

    if (placeholderRequests.length === 0) {
        requestsContainer.innerHTML = `
            <li class="text-center text-muted py-3">
                <i class="fa-regular fa-bell fa-2x mb-2 d-block"></i>
                No pending requests
            </li>
        `;
        return;
    }

    placeholderRequests.forEach(req => {
        const li = document.createElement('li');
        li.style.padding = '12px';
        li.style.borderBottom = '1px solid #e5e7eb';
        li.style.transition = 'all 0.3s ease';
        li.style.cursor = 'pointer';

        li.innerHTML = `
            <strong>${req.guest}</strong> - Room ${req.room}
            <br>
            <small class="text-muted">${req.request}</small>
        `;

        li.addEventListener('mouseenter', () => {
            li.style.transform = 'translateX(8px)';
        });

        li.addEventListener('mouseleave', () => {
            li.style.transform = 'translateX(0px)';
        });

        li.addEventListener('click', () => {
            showInfo(`Request from ${req.guest}: ${req.request}`);
        });

        requestsContainer.appendChild(li);
    });
}

// ======================================
// HANDLE CHECK-IN
// ======================================

function handleCheckIn(bookingId) {
    const booking = getBookingById(bookingId);

    if (!booking) {
        showError('Booking not found');
        return;
    }

    // Update booking status to Confirmed
    updateBooking(bookingId, { status: 'Confirmed' });

    // Update room status to Occupied
    const room = getRoomById(booking.roomId);
    if (room) {
        updateRoom(booking.roomId, { status: 'Occupied', available: false });
    }

    showSuccess(`Guest checked in successfully to ${booking.roomName}!`);

    // Reload data
    loadDashboardData();
}

// ======================================
// HANDLE CHECK-OUT
// ======================================

function handleCheckOut(bookingId) {
    const booking = getBookingById(bookingId);

    if (!booking) {
        showError('Booking not found');
        return;
    }

    // Update booking status to Completed
    updateBooking(bookingId, { status: 'Completed' });

    // Update room status to Cleaning
    const room = getRoomById(booking.roomId);
    if (room) {
        updateRoom(booking.roomId, { status: 'Cleaning', available: false });
    }

    showSuccess(`Guest checked out successfully! ${booking.roomName} marked for cleaning.`);

    // Reload data
    loadDashboardData();
}

// ======================================
// HANDLE MARK CLEAN
// ======================================

function handleMarkClean(roomId) {
    const room = getRoomById(roomId);

    if (!room) {
        showError('Room not found');
        return;
    }

    // Update room status to Available
    updateRoom(roomId, { status: 'Available', available: true });

    showSuccess(`${room.name} has been cleaned and is now available!`);

    // Reload data
    loadDashboardData();
}

// ======================================
// HANDLE VIEW ROOM
// ======================================

function handleViewRoom(roomId) {
    const room = getRoomById(roomId);

    if (!room) {
        showError('Room not found');
        return;
    }

    showInfo(`${room.name} - ${room.type} - Currently ${room.status}`);
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
        case 'Check-Ins':
            showCheckInsView();
            break;
        case 'Check-Outs':
            showCheckOutsView();
            break;
        case 'Rooms':
            showRoomsView();
            break;
        case 'Cleaning':
            showCleaningView();
            break;
        case 'Requests':
            showRequestsView();
            break;
        case 'Profile':
            const profileInfo = `
                <strong>Staff Profile</strong><br>
                Name: ${currentUser.firstName} ${currentUser.lastName}<br>
                Email: ${currentUser.email}<br>
                Role: ${currentUser.role}
            `;
            showInfo('Profile section loaded');
            break;
        default:
            showInfo(`${menuText} clicked`);
    }
}

// ======================================
// SIDEBAR VIEWS
// ======================================

function showCheckInsView() {
    if (todayCheckIns.length === 0) {
        showWarning('No check-ins scheduled for today');
        return;
    }
    showSuccess(`${todayCheckIns.length} check-in${todayCheckIns.length > 1 ? 's' : ''} scheduled for today`);
}

function showCheckOutsView() {
    if (todayCheckOuts.length === 0) {
        showWarning('No check-outs scheduled for today');
        return;
    }
    showSuccess(`${todayCheckOuts.length} check-out${todayCheckOuts.length > 1 ? 's' : ''} scheduled for today`);
}

function showRoomsView() {
    showInfo(`Total Assigned Rooms: ${assignedRooms.length}`);
}

function showCleaningView() {
    const cleaningRooms = allRooms.filter(room => room.status === 'Cleaning');
    if (cleaningRooms.length === 0) {
        showSuccess('No rooms need cleaning at the moment');
        return;
    }
    showWarning(`${cleaningRooms.length} room${cleaningRooms.length > 1 ? 's' : ''} need${cleaningRooms.length === 1 ? 's' : ''} cleaning`);
}

function showRequestsView() {
    showInfo('Guest requests view');
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
                case 'Check In Guest':
                    if (todayCheckIns.length > 0) {
                        showInfo(`${todayCheckIns.length} guest${todayCheckIns.length > 1 ? 's' : ''} ready for check-in`);
                    } else {
                        showWarning('No guests scheduled for check-in today');
                    }
                    break;
                case 'Check Out Guest':
                    if (todayCheckOuts.length > 0) {
                        showInfo(`${todayCheckOuts.length} guest${todayCheckOuts.length > 1 ? 's' : ''} ready for check-out`);
                    } else {
                        showWarning('No guests scheduled for check-out today');
                    }
                    break;
                case 'Update Cleaning':
                    showCleaningView();
                    break;
                case 'View Requests':
                    showRequestsView();
                    break;
                default:
                    showSuccess(`${action} selected`);
            }
        });
    });
}

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

console.log("Staff Dashboard Loaded:", new Date().toLocaleString());
console.log("Current Staff:", currentUser.firstName, currentUser.lastName);
console.log("Staff Stats:", staffStats);
console.log("Today's Check-Ins:", todayCheckIns.length);
console.log("Today's Check-Outs:", todayCheckOuts.length);
console.log("Assigned Rooms:", assignedRooms.length);
