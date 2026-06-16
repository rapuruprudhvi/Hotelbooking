// ========================================
// BOOKING CONFIRMATION PAGE
// Stackly Resort & Hotel Booking System
// ========================================

// ======================================
// LOAD BOOKING DETAILS
// ======================================

window.addEventListener('load', () => {
    console.log('✅ Booking Confirmation Page Loaded');

    // Get booking ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('id');

    if (!bookingId) {
        showError('No booking ID provided');
        setTimeout(() => {
            window.location.href = 'rooms.html';
        }, 2000);
        return;
    }

    // Load booking details
    loadBookingDetails(bookingId);
});

// ======================================
// LOAD & DISPLAY BOOKING
// ======================================

function loadBookingDetails(bookingId) {
    // Get booking from localStorage
    const booking = getBookingById(bookingId);

    if (!booking) {
        showError('Booking not found');
        setTimeout(() => {
            window.location.href = 'guest.html';
        }, 2000);
        return;
    }

    // Populate booking details
    populateBookingDetails(booking);
}

function populateBookingDetails(booking) {
    // Booking ID
    document.getElementById('bookingId').textContent = booking.id;

    // Room Info
    document.getElementById('roomName').textContent = booking.roomName;

    // Guest Info
    document.getElementById('guestName').textContent = booking.guestName;
    document.getElementById('guestEmail').textContent = booking.guestEmail;
    document.getElementById('guestPhone').textContent = formatPhone(booking.guestPhone);

    // Stay Details
    document.getElementById('checkIn').textContent = formatDate(booking.checkIn, 'long');
    document.getElementById('checkOut').textContent = formatDate(booking.checkOut, 'long');
    document.getElementById('nights').textContent = `${booking.nights} Night${booking.nights > 1 ? 's' : ''}`;
    document.getElementById('guests').textContent = `${booking.guests} Guest${booking.guests > 1 ? 's' : ''}`;

    // Payment Info
    document.getElementById('pricePerNight').textContent = formatPrice(booking.pricePerNight);
    document.getElementById('totalPrice').textContent = formatPrice(booking.totalPrice);
    document.getElementById('paymentStatus').textContent = booking.paymentStatus || 'Paid';

    // Status badge color
    const statusBadge = document.getElementById('paymentStatus');
    if (booking.paymentStatus === 'Paid') {
        statusBadge.className = 'badge bg-success';
    } else if (booking.paymentStatus === 'Pending') {
        statusBadge.className = 'badge bg-warning';
    } else {
        statusBadge.className = 'badge bg-secondary';
    }

    // Special Requests
    if (booking.specialRequests && booking.specialRequests.trim()) {
        document.getElementById('specialRequests').textContent = booking.specialRequests;
        document.getElementById('specialRequestsSection').style.display = 'block';
    }

    // Update page title
    document.title = `Booking Confirmation - ${booking.id} - Stackly Resort`;
}

// ======================================
// PRINT FUNCTIONALITY
// ======================================

// Print button is handled by onclick="window.print()" in HTML

// Add custom print title
window.addEventListener('beforeprint', () => {
    const bookingId = document.getElementById('bookingId').textContent;
    document.title = `Booking Receipt - ${bookingId}`;
});

window.addEventListener('afterprint', () => {
    document.title = 'Booking Confirmation - Stackly Resort';
});
