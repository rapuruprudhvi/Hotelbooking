// ========================================
// ROOMS PAGE
// Stackly Resort & Hotel Booking System
// Dynamic Room Display & Booking
// ========================================

// ======================================
// GLOBAL VARIABLES
// ======================================

let allRooms = [];
let filteredRooms = [];
let currentUser = null;

// ======================================
// INITIALIZE PAGE
// ======================================

window.addEventListener('load', () => {
    console.log('✅ Rooms Page Loaded');

    // Get current user (if logged in)
    currentUser = getCurrentUser();

    // Load rooms from storage
    loadRooms();

    // Setup filter handlers
    setupFilters();

    // Setup search button
    setupSearchButton();

    // Set minimum date for date inputs (today)
    setMinimumDates();
});

// ======================================
// LOAD ROOMS
// ======================================

function loadRooms() {
    // Get rooms from localStorage
    allRooms = getRooms();

    if (allRooms.length === 0) {
        showError('No rooms available at the moment');
        return;
    }

    // Initially show all rooms
    filteredRooms = [...allRooms];

    // Render rooms
    renderRooms(filteredRooms);
}

// ======================================
// RENDER ROOMS
// ======================================

function renderRooms(rooms) {
    const roomsContainer = document.querySelector('.rooms-grid');

    if (!roomsContainer) {
        console.error('Rooms container not found');
        return;
    }

    // Clear existing rooms
    roomsContainer.innerHTML = '';

    if (rooms.length === 0) {
        roomsContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fa-solid fa-bed fa-3x text-muted mb-3"></i>
                <h4>No rooms found</h4>
                <p class="text-muted">Try adjusting your filters</p>
                <button class="btn btn-primary" onclick="clearAllFilters()">Clear Filters</button>
            </div>
        `;
        return;
    }

    // Render each room
    rooms.forEach(room => {
        const roomCard = createRoomCard(room);
        roomsContainer.innerHTML += roomCard;
    });

    // Setup wishlist buttons after rendering
    setupWishlistButtons();

    // Setup book now buttons
    setupBookNowButtons();
}

// ======================================
// CREATE ROOM CARD
// ======================================

function createRoomCard(room) {
    const isInWishlistStatus = currentUser ? isInWishlist(currentUser.id, room.id) : false;
    const heartClass = isInWishlistStatus ? 'fa-solid' : 'fa-regular';

    return `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="room-card" data-room-id="${room.id}">
                <div class="room-image-wrapper position-relative">
                    <img src="${room.image}" alt="${room.name}" class="room-image w-100" style="height: 250px; object-fit: cover;">
                    <div class="room-price-badge position-absolute" style="top: 15px; right: 15px; background: linear-gradient(135deg, #d4af37, #f4d03f); color: #000; padding: 8px 16px; border-radius: 20px; font-weight: 600;">
                        ${room.priceDisplay}
                    </div>
                    ${currentUser ? `
                        <button class="wishlist-btn position-absolute" style="top: 15px; left: 15px; background: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.15);" data-room-id="${room.id}">
                            <i class="fa-heart ${heartClass}" style="color: #ef4444; font-size: 18px;"></i>
                        </button>
                    ` : ''}
                </div>
                <div class="room-details p-4">
                    <div class="room-rating mb-2">
                        ${'<i class="fa-solid fa-star" style="color: #d4af37;"></i>'.repeat(room.rating)}
                        <span class="text-muted ms-2">(${room.rating}.0)</span>
                    </div>
                    <h4 class="room-title mb-2">${room.name}</h4>
                    <p class="room-description text-muted mb-3">${room.description}</p>

                    <div class="room-features mb-3" style="display: flex; gap: 10px;">
                        <span class="feature-badge" style="background: #f3f4f6; padding: 5px 12px; border-radius: 15px; font-size: 14px;">
                            <i class="fa-solid fa-user-group"></i> ${room.guests} Guests
                        </span>
                        <span class="feature-badge" style="background: #f3f4f6; padding: 5px 12px; border-radius: 15px; font-size: 14px;">
                            <i class="fa-solid fa-bed"></i> ${room.bedType}
                        </span>
                    </div>

                    <div class="room-amenities mb-3" style="display: flex; flex-wrap: wrap; gap: 5px;">
                        ${room.amenities.slice(0, 3).map(amenity => `
                            <small class="amenity-tag" style="background: #e5e7eb; padding: 3px 10px; border-radius: 10px; font-size: 12px;">${amenity}</small>
                        `).join('')}
                        ${room.amenities.length > 3 ? `<small class="amenity-tag" style="background: #e5e7eb; padding: 3px 10px; border-radius: 10px; font-size: 12px;">+${room.amenities.length - 3} more</small>` : ''}
                    </div>

                    <button class="btn btn-primary w-100 book-now-btn" data-room-id="${room.id}" style="background: linear-gradient(135deg, #d4af37, #f4d03f); border: none; color: #000; font-weight: 600;">
                        <i class="fa-solid fa-calendar-check me-2"></i>Book Now
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ======================================
// WISHLIST FUNCTIONALITY
// ======================================

function setupWishlistButtons() {
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');

    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();

            if (!currentUser) {
                showWarning('Please sign in to use wishlist');
                setTimeout(() => {
                    window.location.href = 'signin.html';
                }, 2000);
                return;
            }

            const roomId = btn.dataset.roomId;
            const icon = btn.querySelector('i');

            // Toggle wishlist
            const isAdded = toggleWishlist(currentUser.id, roomId);

            // Update icon
            if (isAdded) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
                showSuccess('Added to wishlist ❤️');
            } else {
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
                showInfo('Removed from wishlist');
            }
        });
    });
}

// ======================================
// BOOK NOW BUTTONS
// ======================================

function setupBookNowButtons() {
    const bookBtns = document.querySelectorAll('.book-now-btn');

    bookBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const roomId = btn.dataset.roomId;
            openBookingModal(roomId);
        });
    });
}

function openBookingModal(roomId) {
    const room = allRooms.find(r => r.id === roomId);

    if (!room) {
        showError('Room not found');
        return;
    }

    // Check if user is logged in
    if (!currentUser) {
        showWarning('Please sign in to book a room');
        setTimeout(() => {
            sessionStorage.setItem('returnToRoom', roomId);
            window.location.href = 'signin.html';
        }, 2000);
        return;
    }

    // Store selected room
    sessionStorage.setItem('selectedRoom', JSON.stringify(room));

    // Get filter values
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;
    const guests = document.getElementById('guests').value;

    // Store in session for booking page
    if (checkIn) sessionStorage.setItem('bookingCheckIn', checkIn);
    if (checkOut) sessionStorage.setItem('bookingCheckOut', checkOut);
    if (guests) sessionStorage.setItem('bookingGuests', guests);

    // Show modal
    const modal = document.getElementById('bookingModal');
    if (modal) {
        const bsModal = new bootstrap.Modal(modal);
        populateBookingModal(room, checkIn, checkOut, guests);
        bsModal.show();
    } else {
        // If modal doesn't exist, redirect to error page
        showInfo('Redirecting to booking page...');
        setTimeout(() => {
            window.location.href = 'error.html';
        }, 1000);
    }
}

// ======================================
// FILTERS
// ======================================

function setupFilters() {
    const roomTypeFilter = document.getElementById('roomType');
    const checkInFilter = document.getElementById('checkIn');
    const checkOutFilter = document.getElementById('checkOut');
    const guestsFilter = document.getElementById('guests');

    // Real-time filtering
    if (roomTypeFilter) {
        roomTypeFilter.addEventListener('change', applyFilters);
    }

    if (checkInFilter) {
        checkInFilter.addEventListener('change', applyFilters);
    }

    if (checkOutFilter) {
        checkOutFilter.addEventListener('change', applyFilters);
    }

    if (guestsFilter) {
        guestsFilter.addEventListener('change', applyFilters);
    }
}

function setupSearchButton() {
    const searchBtn = document.getElementById('searchRoomsBtn');

    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            applyFilters();

            // Scroll to rooms
            const roomsSection = document.querySelector('.rooms-grid');
            if (roomsSection) {
                roomsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
}

function applyFilters() {
    const roomType = document.getElementById('roomType').value;
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;
    const guests = document.getElementById('guests').value;

    // Validate dates if both are provided
    if (checkIn && checkOut) {
        const validation = validateDateRange(checkIn, checkOut);
        if (!validation.valid) {
            showError(validation.message);
            return;
        }
    }

    // Start with all rooms
    filteredRooms = [...allRooms];

    // Filter by room type
    if (roomType) {
        filteredRooms = filteredRooms.filter(room => room.type === roomType);
    }

    // Filter by guest capacity
    if (guests) {
        const guestCount = parseInt(guests);
        filteredRooms = filteredRooms.filter(room => room.guests >= guestCount);
    }

    // Note: Date-based availability filtering would require booking data
    // For now, we show all available rooms

    // Render filtered rooms
    renderRooms(filteredRooms);

    // Show result count
    showInfo(`Found ${filteredRooms.length} room${filteredRooms.length !== 1 ? 's' : ''}`);
}

function clearAllFilters() {
    document.getElementById('roomType').value = '';
    document.getElementById('checkIn').value = '';
    document.getElementById('checkOut').value = '';
    document.getElementById('guests').value = '1';

    applyFilters();
}

// ======================================
// DATE HELPERS
// ======================================

function setMinimumDates() {
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    const today = getTodayDate();

    if (checkInInput) {
        checkInInput.min = today;
    }

    if (checkOutInput) {
        checkOutInput.min = today;
    }

    // Update checkout min date when checkin changes
    if (checkInInput && checkOutInput) {
        checkInInput.addEventListener('change', () => {
            if (checkInInput.value) {
                checkOutInput.min = checkInInput.value;

                // Clear checkout if it's before checkin
                if (checkOutInput.value && checkOutInput.value <= checkInInput.value) {
                    checkOutInput.value = '';
                }
            }
        });
    }
}

// ======================================
// BOOKING MODAL
// ======================================

function populateBookingModal(room, checkIn, checkOut, guests) {
    // Update modal with room details
    const modalTitle = document.getElementById('bookingModalLabel');
    const modalBody = document.querySelector('#bookingModal .modal-body');

    if (modalTitle) {
        modalTitle.textContent = `Book ${room.name}`;
    }

    if (modalBody) {
        const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 1;
        const totalPrice = calculateTotalPrice(room.price, nights);

        modalBody.innerHTML = `
            <div class="booking-summary">
                <img src="${room.image}" alt="${room.name}" class="img-fluid rounded mb-3">
                <h5>${room.name}</h5>
                <p class="text-muted">${room.description}</p>

                <form id="bookingForm">
                    <div class="mb-3">
                        <label for="modalCheckIn" class="form-label">Check In</label>
                        <input type="date" class="form-control" id="modalCheckIn" value="${checkIn || ''}" required>
                    </div>

                    <div class="mb-3">
                        <label for="modalCheckOut" class="form-label">Check Out</label>
                        <input type="date" class="form-control" id="modalCheckOut" value="${checkOut || ''}" required>
                    </div>

                    <div class="mb-3">
                        <label for="modalGuests" class="form-label">Number of Guests</label>
                        <select class="form-select" id="modalGuests" required>
                            ${Array.from({length: room.guests}, (_, i) => i + 1).map(n =>
                                `<option value="${n}" ${n == guests ? 'selected' : ''}>${n} Guest${n > 1 ? 's' : ''}</option>`
                            ).join('')}
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="specialRequests" class="form-label">Special Requests (Optional)</label>
                        <textarea class="form-control" id="specialRequests" rows="3" placeholder="Any special requests..."></textarea>
                    </div>

                    <div class="price-summary p-3 bg-light rounded">
                        <div class="d-flex justify-content-between mb-2">
                            <span>Price per night:</span>
                            <strong>${formatPrice(room.price)}</strong>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span>Number of nights:</span>
                            <strong id="nightsCount">${nights}</strong>
                        </div>
                        <hr>
                        <div class="d-flex justify-content-between">
                            <span><strong>Total:</strong></span>
                            <strong class="text-primary" id="totalPrice">${formatPrice(totalPrice)}</strong>
                        </div>
                    </div>

                    <div class="mt-4">
                        <button type="submit" class="btn btn-primary w-100">
                            Confirm Booking
                        </button>
                    </div>
                </form>
            </div>
        `;

        // Setup form submission
        setupBookingForm(room);

        // Setup price calculation on date change
        setupPriceCalculation(room);
    }
}

function setupBookingForm(room) {
    const bookingForm = document.getElementById('bookingForm');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const checkIn = document.getElementById('modalCheckIn').value;
            const checkOut = document.getElementById('modalCheckOut').value;
            const guests = document.getElementById('modalGuests').value;
            const specialRequests = document.getElementById('specialRequests').value;

            // Validate dates
            const validation = validateDateRange(checkIn, checkOut);
            if (!validation.valid) {
                showError(validation.message);
                return;
            }

            // Calculate booking details
            const nights = calculateNights(checkIn, checkOut);
            const totalPrice = calculateTotalPrice(room.price, nights);

            // Create booking
            const bookingData = {
                userId: currentUser.id,
                roomId: room.id,
                roomName: room.name,
                checkIn: checkIn,
                checkOut: checkOut,
                nights: nights,
                guests: parseInt(guests),
                pricePerNight: room.price,
                totalPrice: totalPrice,
                guestName: `${currentUser.firstName} ${currentUser.lastName}`,
                guestEmail: currentUser.email,
                guestPhone: currentUser.mobile,
                specialRequests: specialRequests
            };

            // Save booking
            const loadingToastId = showLoading('Creating your booking...');

            setTimeout(() => {
                const booking = saveBooking(bookingData);

                hideLoading(loadingToastId);

                if (booking) {
                    showSuccess('Booking confirmed successfully! 🎉');

                    // Close modal
                    const modal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
                    if (modal) modal.hide();

                    // Redirect to error page
                    setTimeout(() => {
                        window.location.href = 'error.html';
                    }, 1500);
                } else {
                    showError('Failed to create booking. Please try again.');
                }
            }, 1000);
        });
    }
}

function setupPriceCalculation(room) {
    const checkInInput = document.getElementById('modalCheckIn');
    const checkOutInput = document.getElementById('modalCheckOut');

    const updatePrice = () => {
        const checkIn = checkInInput.value;
        const checkOut = checkOutInput.value;

        if (checkIn && checkOut) {
            const nights = calculateNights(checkIn, checkOut);
            const totalPrice = calculateTotalPrice(room.price, nights);

            document.getElementById('nightsCount').textContent = nights;
            document.getElementById('totalPrice').textContent = formatPrice(totalPrice);
        }
    };

    if (checkInInput) checkInInput.addEventListener('change', updatePrice);
    if (checkOutInput) checkOutInput.addEventListener('change', updatePrice);
}

// ======================================
// SCROLL ANIMATIONS
// ======================================

const revealOnScroll = () => {
    const reveals = document.querySelectorAll('.room-card');

    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Set initial state
document.addEventListener('DOMContentLoaded', () => {
    const roomCards = document.querySelectorAll('.room-card');
    roomCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
    });
});

window.addEventListener('scroll', throttle(revealOnScroll, 100));
window.addEventListener('load', revealOnScroll);
