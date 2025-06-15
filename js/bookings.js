// //  הוספה/ביטול השכרות, לפי currentUser


// // booking.js - Booking management functionality

// let currentBookingToCancel = null;

// // Load user bookings and display them
// function loadUserBookings() {
//     const currentUser = localStorage.getItem('currentUser');
//     if (!currentUser) {
//         window.location.href = 'login.html';
//         return;
//     }

//     showLoading(true);
    
//     // Get user's bookings from localStorage
//     const bookingsKey = `${currentUser}_bookings`;
//     const userBookings = JSON.parse(localStorage.getItem(bookingsKey)) || [];
    
//     // Calculate statistics
//     updateBookingStats(userBookings);
    
//     // Display bookings
//     setTimeout(() => {
//         displayBookings(currentFilter, userBookings);
//         showLoading(false);
//     }, 500);
// }

// // Update booking statistics
// function updateBookingStats(bookings) {
//     const now = new Date();
//     const currentDate = now.toISOString().split('T')[0];
    
//     const totalBookings = bookings.length;
//     const upcomingBookings = bookings.filter(booking => booking.startDate > currentDate).length;
//     const pastBookings = bookings.filter(booking => booking.endDate < currentDate).length;
    
//     document.getElementById('total-bookings').textContent = totalBookings;
//     document.getElementById('upcoming-bookings').textContent = upcomingBookings;
//     document.getElementById('past-bookings').textContent = pastBookings;
// }

// // Display bookings based on filter
// function displayBookings(filter = 'all', userBookings = null) {
//     const currentUser = localStorage.getItem('currentUser');
//     if (!currentUser) return;

//     if (!userBookings) {
//         const bookingsKey = `${currentUser}_bookings`;
//         userBookings = JSON.parse(localStorage.getItem(bookingsKey)) || [];
//     }

//     const now = new Date();
//     const currentDate = now.toISOString().split('T')[0];
    
//     // Filter bookings based on selected filter
//     let filteredBookings = userBookings;
    
//     switch (filter) {
//         case 'upcoming':
//             filteredBookings = userBookings.filter(booking => booking.startDate > currentDate);
//             break;
//         case 'past':
//             filteredBookings = userBookings.filter(booking => booking.endDate < currentDate);
//             break;
//         case 'all':
//         default:
//             // Show all bookings
//             break;
//     }

//     const bookingsGrid = document.getElementById('bookings-grid');
//     const noBookings = document.getElementById('no-bookings');

//     if (filteredBookings.length === 0) {
//         bookingsGrid.style.display = 'none';
//         noBookings.style.display = 'block';
        
//         // Update no bookings message based on filter
//         const noBookingsTitle = noBookings.querySelector('h3');
//         const noBookingsText = noBookings.querySelector('p');
        
//         switch (filter) {
//             case 'upcoming':
//                 noBookingsTitle.textContent = 'No Upcoming Bookings';
//                 noBookingsText.textContent = 'You don\'t have any upcoming reservations. Book your next stay now!';
//                 break;
//             case 'past':
//                 noBookingsTitle.textContent = 'No Past Bookings';
//                 noBookingsText.textContent = 'You haven\'t completed any stays yet. Your booking history will appear here.';
//                 break;
//             default:
//                 noBookingsTitle.textContent = 'No Bookings Found';
//                 noBookingsText.textContent = 'You haven\'t made any bookings yet. Start exploring our amazing apartments!';
//         }
//         return;
//     }

//     bookingsGrid.style.display = 'grid';
//     noBookings.style.display = 'none';

//     // Sort bookings by start date (newest first for upcoming, oldest first for past)
//     filteredBookings.sort((a, b) => {
//         if (filter === 'past') {
//             return new Date(b.endDate) - new Date(a.endDate);
//         }
//         return new Date(a.startDate) - new Date(b.startDate);
//     });

//     // Generate booking cards HTML
//     bookingsGrid.innerHTML = filteredBookings.map(booking => 
//         generateBookingCard(booking, currentDate)
//     ).join('');
// }

// // Generate HTML for a booking card
// function generateBookingCard(booking, currentDate) {
//     // Get apartment data from amsterdam.js
//     const apartment = amsterdamListings.find(apt => apt.listing_id == booking.listingId);
    
//     if (!apartment) {
//         console.error(`Apartment not found for listing ID: ${booking.listingId}`);
//         return '';
//     }

//     const startDate = new Date(booking.startDate);
//     const endDate = new Date(booking.endDate);
//     const isUpcoming = booking.startDate > currentDate;
//     const statusClass = isUpcoming ? 'upcoming' : 'past';
//     const statusText = isUpcoming ? 'Upcoming' : 'Completed';

//     // Calculate duration
//     const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

//     return `
//         <div class="booking-card ${statusClass}">
//             <div class="booking-content">
//                 <div class="booking-header">
//                     <div>
//                         <h3 class="apartment-name">${apartment.name}</h3>
//                         <div class="booking-id">Booking ID: #${booking.listingId}-${booking.startDate.replace(/-/g, '')}</div>
//                     </div>
//                     <span class="booking-status status-${statusClass}">${statusText}</span>
//                 </div>

//                 <div class="booking-dates">
//                     <div class="date-range">
//                         <div class="date-item">
//                             <div class="date-label">Check-in</div>
//                             <div class="date-value">${formatDate(booking.startDate)}</div>
//                         </div>
//                         <div class="date-arrow">
//                             <i class="fas fa-arrow-right"></i>
//                         </div>
//                         <div class="date-item">
//                             <div class="date-label">Check-out</div>
//                             <div class="date-value">${formatDate(booking.endDate)}</div>
//                         </div>
//                     </div>
//                 </div>

//                 <div class="booking-details">
//                     <div class="detail-row">
//                         <i class="fas fa-calendar-days"></i>
//                         <span>Duration: <span class="detail-value">${duration} night${duration > 1 ? 's' : ''}</span></span>
//                     </div>
//                     <div class="detail-row">
//                         <i class="fas fa-map-marker-alt"></i>
//                         <span>Location: <span class="detail-value">Amsterdam, Netherlands</span></span>
//                     </div>
//                     <div class="detail-row">
//                         <i class="fas fa-star"></i>
//                         <span>Rating: <span class="detail-value">${apartment.review_scores_rating ? (apartment.review_scores_rating / 20).toFixed(1) : 'N/A'} ⭐</span></span>
//                     </div>
//                     <div class="detail-row">
//                         <i class="fas fa-users"></i>
//                         <span>Accommodates: <span class="detail-value">${apartment.accommodates || 'N/A'} guests</span></span>
//                     </div>
//                 </div>

//                 <div class="booking-actions">
//                     <a href="index.html" class="btn-view">
//                         <i class="fas fa-eye"></i>
//                         View Details
//                     </a>
//                     ${isUpcoming ? `
//                         <button class="btn-cancel" onclick="cancelBooking('${booking.listingId}', '${booking.startDate}', '${apartment.name}')">
//                             <i class="fas fa-times"></i>
//                             Cancel Booking
//                         </button>
//                     ` : ''}
//                 </div>
//             </div>
//         </div>
//     `;
// }

// // Format date for display
// function formatDate(dateString) {
//     const date = new Date(dateString);
//     const options = { 
//         weekday: 'short', 
//         year: 'numeric', 
//         month: 'short', 
//         day: 'numeric' 
//     };
//     return date.toLocaleDateString('en-US', options);
// }

// // Cancel booking function
// function cancelBooking(listingId, startDate, apartmentName) {
//     currentBookingToCancel = { listingId, startDate };
    
//     // Update modal content
//     document.getElementById('cancel-apartment-name').textContent = apartmentName;
//     document.getElementById('cancel-booking-dates').textContent = `Check-in: ${formatDate(startDate)}`;
    
//     // Show modal
//     const modal = new bootstrap.Modal(document.getElementById('cancelBookingModal'));
//     modal.show();
// }

// // Confirm cancellation
// function confirmCancelBooking() {
//     if (!currentBookingToCancel) return;

//     const currentUser = localStorage.getItem('currentUser');
//     const bookingsKey = `${currentUser}_bookings`;
//     let userBookings = JSON.parse(localStorage.getItem(bookingsKey)) || [];

//     // Remove the booking
//     userBookings = userBookings.filter(booking => 
//         !(booking.listingId === currentBookingToCancel.listingId && 
//           booking.startDate === currentBookingToCancel.startDate)
//     );

//     // Save updated bookings
//     localStorage.setItem(bookingsKey, JSON.stringify(userBookings));

//     // Close modal
//     const modal = bootstrap.Modal.getInstance(document.getElementById('cancelBookingModal'));
//     modal.hide();

//     // Show success message
//     showToast('Booking cancelled successfully!', 'success');

//     // Reload bookings
//     setTimeout(() => {
//         loadUserBookings();
//     }, 500);

//     currentBookingToCancel = null;
// }

// // Add a new booking (called from other pages)
// function addBooking(listingId, startDate, endDate) {
//     const currentUser = localStorage.getItem('currentUser');
//     if (!currentUser) {
//         return false;
//     }

//     const bookingsKey = `${currentUser}_bookings`;
//     let userBookings = JSON.parse(localStorage.getItem(bookingsKey)) || [];

//     // Check if booking already exists
//     const existingBooking = userBookings.find(booking => 
//         booking.listingId === listingId && 
//         booking.startDate === startDate && 
//         booking.endDate === endDate
//     );

//     if (existingBooking) {
//         return false; // Booking already exists
//     }

//     // Add new booking
//     const newBooking = {
//         listingId: listingId,
//         startDate: startDate,
//         endDate: endDate,
//         bookingDate: new Date().toISOString().split('T')[0]
//     };

//     userBookings.push(newBooking);
//     localStorage.setItem(bookingsKey, JSON.stringify(userBookings));

//     return true;
// }

// // Check if dates are available for booking
// function isDateRangeOverlap(start1, end1, start2, end2) {
//     const startDate1 = new Date(start1);
//     const endDate1 = new Date(end1);
//     const startDate2 = new Date(start2);
//     const endDate2 = new Date(end2);

//     return startDate1 < endDate2 && startDate2 < endDate1;
// }

// // Check availability for a specific listing
// function checkAvailability(listingId, startDate, endDate) {
//     // Get all users' bookings to check for conflicts
//     const allKeys = Object.keys(localStorage);
//     const bookingKeys = allKeys.filter(key => key.endsWith('_bookings'));

//     for (const key of bookingKeys) {
//         const userBookings = JSON.parse(localStorage.getItem(key)) || [];
//         const conflictingBookings = userBookings.filter(booking => 
//             booking.listingId === listingId &&
//             isDateRangeOverlap(startDate, endDate, booking.startDate, booking.endDate)
//         );

//         if (conflictingBookings.length > 0) {
//             return false; // Dates are not available
//         }
//     }

//     return true; // Dates are available
// }

// // Get user's bookings
// function getUserBookings(username = null) {
//     const user = username || localStorage.getItem('currentUser');
//     if (!user) return [];

//     const bookingsKey = `${user}_bookings`;
//     return JSON.parse(localStorage.getItem(bookingsKey)) || [];
// }

// // Show/hide loading spinner
// function showLoading(show) {
//     const loading = document.getElementById('loading');
//     const bookingsGrid = document.getElementById('bookings-grid');
//     const noBookings = document.getElementById('no-bookings');

//     if (show) {
//         loading.style.display = 'flex';
//         bookingsGrid.style.display = 'none';
//         noBookings.style.display = 'none';
//     } else {
//         loading.style.display = 'none';
//     }
// }

// // Show toast notification
// function showToast(message, type = 'success') {
//     const toast = document.getElementById('toast-notification');
//     const messageEl = document.getElementById('toast-message');
//     const icon = toast.querySelector('i');
    
//     messageEl.textContent = message;
//     toast.className = `toast-notification toast-${type}`;
    
//     // Update icon based on type
//     if (type === 'success') {
//         icon.className = 'fas fa-check-circle';
//     } else if (type === 'error') {
//         icon.className = 'fas fa-exclamation-circle';
//     } else {
//         icon.className = 'fas fa-info-circle';
//     }
    
//     toast.classList.add('show');
    
//     setTimeout(() => {
//         toast.classList.remove('show');
//     }, 3000);
// }

// // Export functions for use in other files
// window.bookingModule = {
//     addBooking,
//     isDateRangeOverlap,
//     checkAvailability,
//     getUserBookings,
//     showToast
// };

// js/mybookings.js - Booking management functionality

let currentBookingToCancel = null;
let currentFilter = 'all';

function loadUserBookings() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    showLoading(true);
    
    const bookingsKey = `${currentUser}_bookings`;
    const userBookings = JSON.parse(localStorage.getItem(bookingsKey)) || [];
    
    updateBookingStats(userBookings);
    
    setTimeout(() => {
        displayBookings(currentFilter, userBookings);
        showLoading(false);
    }, 500);
}

function updateBookingStats(bookings) {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    
    const totalBookings = bookings.length;
    const upcomingBookings = bookings.filter(booking => booking.startDate >= currentDate).length;
    const pastBookings = bookings.filter(booking => booking.endDate < currentDate).length;
    
    document.getElementById('total-bookings').textContent = totalBookings;
    document.getElementById('upcoming-bookings').textContent = upcomingBookings;
    document.getElementById('past-bookings').textContent = pastBookings;
}

function displayBookings(filter = 'all', userBookings = null) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;

    if (!userBookings) {
        const bookingsKey = `${currentUser}_bookings`;
        userBookings = JSON.parse(localStorage.getItem(bookingsKey)) || [];
    }

    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    
    let filteredBookings = userBookings;
    
    switch (filter) {
        case 'upcoming':
            filteredBookings = userBookings.filter(booking => booking.startDate >= currentDate);
            break;
        case 'past':
            filteredBookings = userBookings.filter(booking => booking.endDate < currentDate);
            break;
        case 'all':
        default:
            break;
    }

    const bookingsGrid = document.getElementById('bookings-grid');
    const noBookings = document.getElementById('no-bookings');

    if (filteredBookings.length === 0) {
        bookingsGrid.style.display = 'none';
        noBookings.style.display = 'block';
        
        const noBookingsTitle = noBookings.querySelector('h3');
        const noBookingsText = noBookings.querySelector('p');
        
        switch (filter) {
            case 'upcoming':
                noBookingsTitle.textContent = 'No Upcoming Bookings';
                noBookingsText.textContent = 'You don\'t have any upcoming reservations. Book your next stay now!';
                break;
            case 'past':
                noBookingsTitle.textContent = 'No Past Bookings';
                noBookingsText.textContent = 'You haven\'t completed any stays yet. Your booking history will appear here.';
                break;
            default:
                noBookingsTitle.textContent = 'No Bookings Found';
                noBookingsText.textContent = 'You haven\'t made any bookings yet. Start exploring our amazing apartments!';
        }
        return;
    }

    bookingsGrid.style.display = 'grid';
    noBookings.style.display = 'none';

    filteredBookings.sort((a, b) => {
        if (filter === 'past') {
            return new Date(b.endDate) - new Date(a.endDate);
        }
        return new Date(a.startDate) - new Date(b.startDate);
    });

    bookingsGrid.innerHTML = filteredBookings.map(booking => 
        generateBookingCard(booking, currentDate)
    ).join('');
}

function generateBookingCard(booking, currentDate) {
    let apartment = null;
    
    if (typeof amsterdamListings !== 'undefined' && amsterdamListings.length > 0) {
        apartment = amsterdamListings.find(apt => apt.listing_id == booking.listingId);
    }
    
    if (!apartment) {
        apartment = {
            listing_id: booking.listingId,
            name: `Apartment ${booking.listingId}`,
            review_scores_rating: 85,
            accommodates: 4
        };
    }

    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
   
    const isUpcoming = booking.startDate >= currentDate;
    const statusClass = isUpcoming ? 'upcoming' : 'past';
    const statusText = isUpcoming ? 'Upcoming' : 'Completed';

    const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    return `
        <div class="booking-card ${statusClass}">
            <div class="booking-content">
                <div class="booking-header">
                    <div>
                        <h3 class="apartment-name">${apartment.name}</h3>
                        <div class="booking-id">Booking ID: #${booking.listingId}-${booking.startDate.replace(/-/g, '')}</div>
                    </div>
                    <span class="booking-status status-${statusClass}">${statusText}</span>
                </div>

                <div class="booking-dates">
                    <div class="date-range">
                        <div class="date-item">
                            <div class="date-label">Check-in</div>
                            <div class="date-value">${formatDate(booking.startDate)}</div>
                        </div>
                        <div class="date-arrow">
                            <i class="fas fa-arrow-right"></i>
                        </div>
                        <div class="date-item">
                            <div class="date-label">Check-out</div>
                            <div class="date-value">${formatDate(booking.endDate)}</div>
                        </div>
                    </div>
                </div>

                <div class="booking-details">
                    <div class="detail-row">
                        <i class="fas fa-calendar-days"></i>
                        <span>Duration: <span class="detail-value">${duration} night${duration > 1 ? 's' : ''}</span></span>
                    </div>
                    <div class="detail-row">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>Location: <span class="detail-value">Amsterdam, Netherlands</span></span>
                    </div>
                    <div class="detail-row">
                        <i class="fas fa-star"></i>
                        <span>Rating: <span class="detail-value">${apartment.review_scores_rating ? (apartment.review_scores_rating / 20).toFixed(1) : 'N/A'} ⭐</span></span>
                    </div>
                    <div class="detail-row">
                        <i class="fas fa-users"></i>
                        <span>Accommodates: <span class="detail-value">${apartment.accommodates || 'N/A'} guests</span></span>
                    </div>
                    ${booking.bookingDate ? `
                        <div class="detail-row">
                            <i class="fas fa-calendar-plus"></i>
                            <span>Booking Date: <span class="detail-value">${formatDate(booking.bookingDate)}</span></span>
                        </div>
                    ` : ''}
                </div>

                <div class="booking-actions">
                    <a href="index.html" class="btn-view">
                        <i class="fas fa-eye"></i>
                        View Details
                    </a>
                    ${isUpcoming ? `
                        <button class="btn-cancel" onclick="cancelBooking('${booking.listingId}', '${booking.startDate}', '${apartment.name}')">
                            <i class="fas fa-times"></i>
                            Cancel Booking
                        </button>
                    ` : `
                        <span class="btn-completed">
                            <i class="fas fa-check-circle"></i>
                            Completed Stay
                        </span>
                    `}
                </div>
            </div>
        </div>
    `;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
}

function cancelBooking(listingId, startDate, apartmentName) {
    currentBookingToCancel = { listingId, startDate };
    
    document.getElementById('cancel-apartment-name').textContent = apartmentName;
    document.getElementById('cancel-booking-dates').textContent = `Check-in: ${formatDate(startDate)}`;
    
    const modal = new bootstrap.Modal(document.getElementById('cancelBookingModal'));
    modal.show();
}

function confirmCancelBooking() {
    if (!currentBookingToCancel) return;

    const currentUser = localStorage.getItem('currentUser');
    const bookingsKey = `${currentUser}_bookings`;
    let userBookings = JSON.parse(localStorage.getItem(bookingsKey)) || [];

    userBookings = userBookings.filter(booking => 
        !(booking.listingId === currentBookingToCancel.listingId && 
          booking.startDate === currentBookingToCancel.startDate)
    );

    localStorage.setItem(bookingsKey, JSON.stringify(userBookings));

    const modal = bootstrap.Modal.getInstance(document.getElementById('cancelBookingModal'));
    modal.hide();

    showToast('Booking cancelled successfully!', 'success');

    setTimeout(() => {
        loadUserBookings();
    }, 500);

    currentBookingToCancel = null;
}

function showLoading(show) {
    const loading = document.getElementById('loading');
    const bookingsGrid = document.getElementById('bookings-grid');
    const noBookings = document.getElementById('no-bookings');

    if (show) {
        loading.style.display = 'flex';
        bookingsGrid.style.display = 'none';
        noBookings.style.display = 'none';
    } else {
        loading.style.display = 'none';
    }
}

function filterBookings(type) {
    currentFilter = type;
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${type}"]`).classList.add('active');
    
    displayBookings(type);
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast-notification');
    const messageEl = document.getElementById('toast-message');
    const icon = toast.querySelector('i');
    
    messageEl.textContent = message;
    toast.className = `toast-notification toast-${type}`;
    
    if (type === 'success') {
        icon.className = 'fas fa-check-circle';
    } else if (type === 'error') {
        icon.className = 'fas fa-exclamation-circle';
    } else {
        icon.className = 'fas fa-info-circle';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function addBooking(listingId, startDate, endDate) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        return false;
    }

    const bookingsKey = `${currentUser}_bookings`;
    let userBookings = JSON.parse(localStorage.getItem(bookingsKey)) || [];

    const existingBooking = userBookings.find(booking => 
        booking.listingId === listingId && 
        booking.startDate === startDate && 
        booking.endDate === endDate
    );

    if (existingBooking) {
        return false; 
    }

    const newBooking = {
        listingId: listingId,
        startDate: startDate,
        endDate: endDate,
        bookingDate: new Date().toISOString().split('T')[0]
    };

    userBookings.push(newBooking);
    localStorage.setItem(bookingsKey, JSON.stringify(userBookings));

    if (window.location.pathname.includes('mybookings')) {
        setTimeout(() => {
            loadUserBookings();
        }, 100);
    }

    return true;
}

function isDateRangeOverlap(start1, end1, start2, end2) {
    const startDate1 = new Date(start1);
    const endDate1 = new Date(end1);
    const startDate2 = new Date(start2);
    const endDate2 = new Date(end2);

    return startDate1 < endDate2 && startDate2 < endDate1;
}

function checkAvailability(listingId, startDate, endDate) {
    const allKeys = Object.keys(localStorage);
    const bookingKeys = allKeys.filter(key => key.endsWith('_bookings'));

    for (const key of bookingKeys) {
        const userBookings = JSON.parse(localStorage.getItem(key)) || [];
        const conflictingBookings = userBookings.filter(booking => 
            booking.listingId === listingId &&
            isDateRangeOverlap(startDate, endDate, booking.startDate, booking.endDate)
        );

        if (conflictingBookings.length > 0) {
            return false; 
        }
    }

    return true; 
}

function getUserBookings(username = null) {
    const user = username || localStorage.getItem('currentUser');
    if (!user) return [];

    const bookingsKey = `${user}_bookings`;
    return JSON.parse(localStorage.getItem(bookingsKey)) || [];
}

window.addBooking = addBooking;
window.loadUserBookings = loadUserBookings;
window.filterBookings = filterBookings;
window.cancelBooking = cancelBooking;
window.confirmCancelBooking = confirmCancelBooking;
window.showToast = showToast;
window.isDateRangeOverlap = isDateRangeOverlap;
window.checkAvailability = checkAvailability;
window.getUserBookings = getUserBookings;

window.bookingModule = {
    addBooking,
    isDateRangeOverlap,
    checkAvailability,
    getUserBookings,
    showToast
};