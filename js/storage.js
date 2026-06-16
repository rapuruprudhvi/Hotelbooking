// ========================================
// STORAGE MANAGER
// Stackly Resort & Hotel Booking System
// LocalStorage Data Management
// ========================================

// ========================================
// STORAGE KEYS
// ========================================

const STORAGE_KEYS = {
    USERS: 'stackly_users',
    CURRENT_USER: 'stackly_current_user',
    ROOMS: 'stackly_rooms',
    BOOKINGS: 'stackly_bookings',
    WISHLIST: 'stackly_wishlist',
    SESSION: 'stackly_session'
};

// ========================================
// INITIALIZATION
// ========================================

/**
 * Initialize storage with default data if empty
 */
function initializeStorage() {
    // Initialize rooms if not exists
    if (!localStorage.getItem(STORAGE_KEYS.ROOMS)) {
        initializeRooms();
    }

    // Initialize users array if not exists
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
    }

    // Initialize bookings array if not exists
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([]));
    }

    // Initialize wishlist object if not exists
    if (!localStorage.getItem(STORAGE_KEYS.WISHLIST)) {
        localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify({}));
    }
}

/**
 * Initialize room data with 6 default rooms
 */
function initializeRooms() {
    const rooms = [
        {
            id: 'room_001',
            name: 'Deluxe Ocean View Room',
            type: 'Deluxe Room',
            price: 7999,
            priceDisplay: '₹7,999/Night',
            image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
            rating: 5,
            guests: 2,
            bedType: 'King Bed',
            description: 'Elegant room featuring stunning ocean views, king-size bed and luxury furnishings.',
            amenities: ['Free WiFi', 'Smart TV', 'Complimentary Breakfast', 'Air Conditioning', 'Mini Bar', 'Ocean View'],
            available: true
        },
        {
            id: 'room_002',
            name: 'Executive Suite',
            type: 'Executive Suite',
            price: 11999,
            priceDisplay: '₹11,999/Night',
            image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
            rating: 5,
            guests: 4,
            bedType: 'Queen Bed',
            description: 'Spacious executive suite with separate living area, perfect for business travelers.',
            amenities: ['Free WiFi', 'Smart TV', 'Complimentary Breakfast', 'Air Conditioning', 'Work Desk', 'Living Room'],
            available: true
        },
        {
            id: 'room_003',
            name: 'Royal Luxury Villa',
            type: 'Villa',
            price: 19999,
            priceDisplay: '₹19,999/Night',
            image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
            rating: 5,
            guests: 6,
            bedType: 'Luxury Suite',
            description: 'Premium villa with private pool, garden and luxurious amenities for ultimate relaxation.',
            amenities: ['Free WiFi', 'Smart TV', 'Complimentary Breakfast', 'Private Pool', 'Garden', 'Jacuzzi'],
            available: true
        },
        {
            id: 'room_004',
            name: 'Family Suite',
            type: 'Family Suite',
            price: 13499,
            priceDisplay: '₹13,499/Night',
            image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=80',
            rating: 5,
            guests: 5,
            bedType: 'Twin Beds',
            description: 'Spacious family suite with multiple beds, perfect for families traveling together.',
            amenities: ['Free WiFi', 'Smart TV', 'Complimentary Breakfast', 'Air Conditioning', 'Kids Play Area', 'Refrigerator'],
            available: true
        },
        {
            id: 'room_005',
            name: 'Premium King Room',
            type: 'Premium Room',
            price: 9999,
            priceDisplay: '₹9,999/Night',
            image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80',
            rating: 5,
            guests: 3,
            bedType: 'King Bed',
            description: 'Premium room with king bed, modern amenities and elegant decor.',
            amenities: ['Free WiFi', 'Smart TV', 'Complimentary Breakfast', 'Air Conditioning', 'Mini Bar', 'Balcony'],
            available: true
        },
        {
            id: 'room_006',
            name: 'Presidential Suite',
            type: 'Presidential Suite',
            price: 29999,
            priceDisplay: '₹29,999/Night',
            image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
            rating: 5,
            guests: 8,
            bedType: 'Master Suite',
            description: 'The ultimate luxury suite with panoramic views, butler service and world-class amenities.',
            amenities: ['Free WiFi', 'Smart TV', 'Butler Service', 'Private Dining', 'Spa Access', 'Panoramic View'],
            available: true
        }
    ];

    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
    return rooms;
}

// ========================================
// USER MANAGEMENT
// ========================================

/**
 * Get all users
 * @returns {Array} Array of user objects
 */
function getUsers() {
    try {
        const users = localStorage.getItem(STORAGE_KEYS.USERS);
        return users ? JSON.parse(users) : [];
    } catch (error) {
        console.error('Error getting users:', error);
        return [];
    }
}

/**
 * Save a new user
 * @param {Object} userData - User data object
 * @returns {Object|null} Saved user or null if failed
 */
function saveUser(userData) {
    try {
        const users = getUsers();

        // Check if email already exists
        const existingUser = users.find(u => u.email === userData.email);
        if (existingUser) {
            return null; // Email already registered
        }

        // Create user object
        const newUser = {
            id: generateUserId(),
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            mobile: userData.mobile,
            password: encodePassword(userData.password),
            role: userData.role || 'Guest',
            membershipStatus: 'Silver',
            createdAt: new Date().toISOString(),
            profileImage: `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70)}`
        };

        users.push(newUser);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

        return newUser;
    } catch (error) {
        console.error('Error saving user:', error);
        return null;
    }
}

/**
 * Get user by email
 * @param {string} email - User email
 * @returns {Object|null} User object or null
 */
function getUserByEmail(email) {
    const users = getUsers();
    return users.find(u => u.email === email) || null;
}

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Object|null} User object or null
 */
function getUserById(userId) {
    const users = getUsers();
    return users.find(u => u.id === userId) || null;
}

/**
 * Update user data
 * @param {string} userId - User ID
 * @param {Object} updates - Fields to update
 * @returns {boolean} True if successful
 */
function updateUser(userId, updates) {
    try {
        const users = getUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) return false;

        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

        // Update current user if it's the same user
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.id === userId) {
            setCurrentUser(users[userIndex]);
        }

        return true;
    } catch (error) {
        console.error('Error updating user:', error);
        return false;
    }
}

// ========================================
// SESSION MANAGEMENT
// ========================================

/**
 * Get current logged-in user
 * @returns {Object|null} Current user object or null
 */
function getCurrentUser() {
    try {
        const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

/**
 * Set current user (login)
 * @param {Object} user - User object
 */
function setCurrentUser(user) {
    try {
        const sessionData = {
            ...user,
            sessionStart: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionData));
    } catch (error) {
        console.error('Error setting current user:', error);
    }
}

/**
 * Logout current user
 */
function logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
}

/**
 * Check if user is logged in
 * @returns {boolean} True if logged in
 */
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// ========================================
// ROOM MANAGEMENT
// ========================================

/**
 * Get all rooms
 * @returns {Array} Array of room objects
 */
function getRooms() {
    try {
        const rooms = localStorage.getItem(STORAGE_KEYS.ROOMS);
        return rooms ? JSON.parse(rooms) : [];
    } catch (error) {
        console.error('Error getting rooms:', error);
        return [];
    }
}

/**
 * Get room by ID
 * @param {string} roomId - Room ID
 * @returns {Object|null} Room object or null
 */
function getRoomById(roomId) {
    const rooms = getRooms();
    return rooms.find(r => r.id === roomId) || null;
}

/**
 * Save a new room (Admin only)
 * @param {Object} roomData - Room data
 * @returns {Object|null} Saved room or null
 */
function saveRoom(roomData) {
    try {
        const rooms = getRooms();

        const newRoom = {
            id: `room_${Date.now()}`,
            ...roomData,
            available: true
        };

        rooms.push(newRoom);
        localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));

        return newRoom;
    } catch (error) {
        console.error('Error saving room:', error);
        return null;
    }
}

/**
 * Update room data
 * @param {string} roomId - Room ID
 * @param {Object} updates - Fields to update
 * @returns {boolean} True if successful
 */
function updateRoom(roomId, updates) {
    try {
        const rooms = getRooms();
        const roomIndex = rooms.findIndex(r => r.id === roomId);

        if (roomIndex === -1) return false;

        rooms[roomIndex] = { ...rooms[roomIndex], ...updates };
        localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));

        return true;
    } catch (error) {
        console.error('Error updating room:', error);
        return false;
    }
}

/**
 * Delete room
 * @param {string} roomId - Room ID
 * @returns {boolean} True if successful
 */
function deleteRoom(roomId) {
    try {
        const rooms = getRooms();
        const filteredRooms = rooms.filter(r => r.id !== roomId);

        localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(filteredRooms));
        return true;
    } catch (error) {
        console.error('Error deleting room:', error);
        return false;
    }
}

// ========================================
// BOOKING MANAGEMENT
// ========================================

/**
 * Get all bookings
 * @returns {Array} Array of booking objects
 */
function getAllBookings() {
    try {
        const bookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
        return bookings ? JSON.parse(bookings) : [];
    } catch (error) {
        console.error('Error getting bookings:', error);
        return [];
    }
}

/**
 * Get bookings for a specific user
 * @param {string} userId - User ID
 * @returns {Array} Array of user's bookings
 */
function getBookings(userId) {
    const allBookings = getAllBookings();
    return allBookings.filter(b => b.userId === userId);
}

/**
 * Get booking by ID
 * @param {string} bookingId - Booking ID
 * @returns {Object|null} Booking object or null
 */
function getBookingById(bookingId) {
    const bookings = getAllBookings();
    return bookings.find(b => b.id === bookingId) || null;
}

/**
 * Save a new booking
 * @param {Object} bookingData - Booking data
 * @returns {Object|null} Saved booking or null
 */
function saveBooking(bookingData) {
    try {
        const bookings = getAllBookings();

        const newBooking = {
            id: generateBookingId(),
            userId: bookingData.userId,
            roomId: bookingData.roomId,
            roomName: bookingData.roomName,
            checkIn: bookingData.checkIn,
            checkOut: bookingData.checkOut,
            nights: bookingData.nights,
            guests: bookingData.guests,
            pricePerNight: bookingData.pricePerNight,
            totalPrice: bookingData.totalPrice,
            status: 'Confirmed',
            paymentStatus: 'Paid',
            createdAt: new Date().toISOString(),
            guestName: bookingData.guestName,
            guestEmail: bookingData.guestEmail,
            guestPhone: bookingData.guestPhone,
            specialRequests: bookingData.specialRequests || ''
        };

        bookings.push(newBooking);
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

        return newBooking;
    } catch (error) {
        console.error('Error saving booking:', error);
        return null;
    }
}

/**
 * Update booking
 * @param {string} bookingId - Booking ID
 * @param {Object} updates - Fields to update
 * @returns {boolean} True if successful
 */
function updateBooking(bookingId, updates) {
    try {
        const bookings = getAllBookings();
        const bookingIndex = bookings.findIndex(b => b.id === bookingId);

        if (bookingIndex === -1) return false;

        bookings[bookingIndex] = { ...bookings[bookingIndex], ...updates };
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));

        return true;
    } catch (error) {
        console.error('Error updating booking:', error);
        return false;
    }
}

/**
 * Cancel booking
 * @param {string} bookingId - Booking ID
 * @returns {boolean} True if successful
 */
function cancelBooking(bookingId) {
    return updateBooking(bookingId, {
        status: 'Cancelled',
        cancelledAt: new Date().toISOString()
    });
}

/**
 * Delete booking
 * @param {string} bookingId - Booking ID
 * @returns {boolean} True if successful
 */
function deleteBooking(bookingId) {
    try {
        const bookings = getAllBookings();
        const filteredBookings = bookings.filter(b => b.id !== bookingId);

        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(filteredBookings));
        return true;
    } catch (error) {
        console.error('Error deleting booking:', error);
        return false;
    }
}

// ========================================
// WISHLIST MANAGEMENT
// ========================================

/**
 * Get wishlist for a user
 * @param {string} userId - User ID
 * @returns {Array} Array of room IDs
 */
function getWishlist(userId) {
    try {
        const wishlistData = localStorage.getItem(STORAGE_KEYS.WISHLIST);
        const wishlist = wishlistData ? JSON.parse(wishlistData) : {};
        return wishlist[userId] || [];
    } catch (error) {
        console.error('Error getting wishlist:', error);
        return [];
    }
}

/**
 * Toggle room in wishlist (add if not exists, remove if exists)
 * @param {string} userId - User ID
 * @param {string} roomId - Room ID
 * @returns {boolean} True if added, false if removed
 */
function toggleWishlist(userId, roomId) {
    try {
        const wishlistData = localStorage.getItem(STORAGE_KEYS.WISHLIST);
        const wishlist = wishlistData ? JSON.parse(wishlistData) : {};

        if (!wishlist[userId]) {
            wishlist[userId] = [];
        }

        const index = wishlist[userId].indexOf(roomId);

        if (index === -1) {
            // Add to wishlist
            wishlist[userId].push(roomId);
            localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
            return true;
        } else {
            // Remove from wishlist
            wishlist[userId].splice(index, 1);
            localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
            return false;
        }
    } catch (error) {
        console.error('Error toggling wishlist:', error);
        return false;
    }
}

/**
 * Check if room is in wishlist
 * @param {string} userId - User ID
 * @param {string} roomId - Room ID
 * @returns {boolean} True if in wishlist
 */
function isInWishlist(userId, roomId) {
    const wishlist = getWishlist(userId);
    return wishlist.includes(roomId);
}

/**
 * Clear wishlist for a user
 * @param {string} userId - User ID
 * @returns {boolean} True if successful
 */
function clearWishlist(userId) {
    try {
        const wishlistData = localStorage.getItem(STORAGE_KEYS.WISHLIST);
        const wishlist = wishlistData ? JSON.parse(wishlistData) : {};

        wishlist[userId] = [];
        localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));

        return true;
    } catch (error) {
        console.error('Error clearing wishlist:', error);
        return false;
    }
}

// ========================================
// STATISTICS & ANALYTICS
// ========================================

/**
 * Get booking statistics for a user
 * @param {string} userId - User ID
 * @returns {Object} Statistics object
 */
function getUserStats(userId) {
    const bookings = getBookings(userId);
    const wishlist = getWishlist(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeReservations = bookings.filter(b =>
        b.status === 'Confirmed' && new Date(b.checkIn) >= today
    ).length;

    const completedBookings = bookings.filter(b =>
        b.status === 'Completed' || new Date(b.checkOut) < today
    ).length;

    return {
        totalBookings: bookings.length,
        activeReservations: activeReservations,
        completedBookings: completedBookings,
        wishlistCount: wishlist.length,
        totalSpent: bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0)
    };
}

/**
 * Get global statistics (Admin)
 * @returns {Object} Global statistics
 */
function getGlobalStats() {
    const allBookings = getAllBookings();
    const users = getUsers();
    const rooms = getRooms();
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const monthlyRevenue = allBookings
        .filter(b => {
            const bookingDate = new Date(b.createdAt);
            return bookingDate.getMonth() === currentMonth &&
                   bookingDate.getFullYear() === currentYear;
        })
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    const availableRooms = rooms.filter(r => r.available).length;

    const todayCheckIns = allBookings.filter(b =>
        b.checkIn === getTodayDate()
    ).length;

    const todayCheckOuts = allBookings.filter(b =>
        b.checkOut === getTodayDate()
    ).length;

    return {
        totalBookings: allBookings.length,
        totalGuests: users.filter(u => u.role === 'Guest').length,
        totalUsers: users.length,
        availableRooms: availableRooms,
        totalRooms: rooms.length,
        monthlyRevenue: monthlyRevenue,
        todayCheckIns: todayCheckIns,
        todayCheckOuts: todayCheckOuts
    };
}

// ========================================
// INITIALIZE ON LOAD
// ========================================

// Auto-initialize storage when script loads
if (typeof window !== 'undefined') {
    initializeStorage();
}
