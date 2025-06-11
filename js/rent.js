

let currentListing = null;
let currentUser = null;
let selectedDates = {
    checkin: null,
    checkout: null
};
let totalPrice = 0;
let isCheckingAvailability = false;

document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupEventListeners();
    setMinDates();
});

function initializePage() {
    currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert('Please log in to access this page');
        window.location.href = 'login.html';
        return;
    }
    
    const usernameElement = document.getElementById('current-username');
    if (usernameElement) {
        usernameElement.textContent = currentUser;
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const listingId = urlParams.get('id');
    
    if (!listingId) {
        showToast('Error: No property ID found', 'error');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
    }
    
    loadPropertyData(listingId);
}

function loadPropertyData(listingId) {
    let listings = [];
    
    if (typeof window.amsterdam !== 'undefined') {
        listings = window.amsterdam;
    } else {
        showToast('Error: Amsterdam data not loaded', 'error');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
    }
    
    let foundListing = listings.find(listing => listing.listing_id === listingId || listing.listing_id == listingId);
    
    if (!foundListing) {
        showToast('Error: Property not found', 'error');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
    }
    
    currentListing = convertApartmentData(foundListing);
    
    populatePropertyData();
}

function convertApartmentData(apartment) {
    const priceMatch = apartment.price ? apartment.price.match(/\d+/) : null;
    const price = priceMatch ? parseInt(priceMatch[0]) : 200;
    
    let rating = apartment.review_scores_rating;
    if (rating) {
        rating = parseFloat(rating);
        if (rating > 5) {
            rating = Math.round((rating / 100) * 5 * 10) / 10;
        }
    } else {
        rating = 4.5;
    }
    
    rating = parseFloat(rating) || 4.5;
    
    const bedrooms = apartment.bedrooms ? parseInt(apartment.bedrooms) : 1;
    
    let bathrooms = 1;
    if (apartment.bathrooms_text) {
        const bathMatch = apartment.bathrooms_text.match(/\d+/);
        bathrooms = bathMatch ? parseInt(bathMatch[0]) : 1;
    }
    
    const accommodates = apartment.accommodates ? parseInt(apartment.accommodates) : 2;
    
    const area = bedrooms * 40 + Math.floor(Math.random() * 20) + 30;
    
    const description = apartment.description || 'Beautiful and comfortable apartment in Amsterdam';
    
    return {
        id: apartment.listing_id,
        name: apartment.name || 'Amsterdam Apartment',
        description: description,
        price: price,
        rating: rating,
        image: apartment.picture_url || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
        beds: bedrooms,
        baths: bathrooms,
        area: area,
        maxGuests: accommodates,
        neighborhood: apartment.neighbourhood_cleansed || 'Amsterdam'
    };
}

function populatePropertyData() {
    const propertyImage = document.getElementById('property-image');
    const summaryImage = document.getElementById('summary-image');
    if (propertyImage) {
        propertyImage.src = currentListing.image;
        propertyImage.alt = currentListing.name;
    }
    if (summaryImage) {
        summaryImage.src = currentListing.image;
        summaryImage.alt = currentListing.name;
    }
    
    const propertyName = document.getElementById('property-name');
    const summaryName = document.getElementById('summary-name');
    if (propertyName) propertyName.textContent = currentListing.name;
    if (summaryName) summaryName.textContent = currentListing.name;
    
    const starsHtml = '★'.repeat(Math.floor(currentListing.rating)) + 
                     (currentListing.rating % 1 !== 0 ? '☆' : '');
    const overviewRating = document.getElementById('overview-rating');
    const summaryStars = document.getElementById('summary-stars');
    const summaryRating = document.getElementById('summary-rating');
    
    if (overviewRating) overviewRating.textContent = currentListing.rating.toFixed(1);
    if (summaryStars) summaryStars.innerHTML = starsHtml;
    if (summaryRating) summaryRating.textContent = currentListing.rating.toFixed(1);
    
    const propertyBeds = document.getElementById('property-beds');
    const propertyBaths = document.getElementById('property-baths');
    const propertyArea = document.getElementById('property-area');
    const propertyGuests = document.getElementById('property-guests');
    
    if (propertyBeds) propertyBeds.textContent = currentListing.beds || 2;
    if (propertyBaths) propertyBaths.textContent = currentListing.baths || 1;
    if (propertyArea) propertyArea.textContent = currentListing.area || 85;
    if (propertyGuests) propertyGuests.textContent = currentListing.maxGuests || 4;
    
    const propertyLocation = document.getElementById('property-location');
    if (propertyLocation) {
        propertyLocation.textContent = `${currentListing.neighborhood || 'Amsterdam'}, Netherlands`;
    }
    
    const propertyDesc = document.getElementById('property-desc');
    if (propertyDesc) {
        setupExpandableDescription(propertyDesc, currentListing.description);
    }
    
    const propertyPrice = document.getElementById('property-price');
    if (propertyPrice) propertyPrice.textContent = currentListing.price;
    
    const guestSelect = document.getElementById('guest-count');
    if (guestSelect) {
        guestSelect.innerHTML = '';
        for (let i = 1; i <= (currentListing.maxGuests || 4); i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i === 1 ? '1 Guest' : `${i} Guests`;
            guestSelect.appendChild(option);
        }
    }
}

function setupEventListeners() {
    document.getElementById('checkin-date').addEventListener('change', onDateChange);
    document.getElementById('checkout-date').addEventListener('change', onDateChange);
    
    document.getElementById('check-availability').addEventListener('click', checkAvailability);
    
    document.getElementById('guest-count').addEventListener('change', calculatePrice);
    
    document.getElementById('payment-form').addEventListener('submit', handleBooking);
    
    document.getElementById('card-number').addEventListener('input', formatCardNumber);
    document.getElementById('expiry-date').addEventListener('input', formatExpiryDate);
    document.getElementById('cvv').addEventListener('input', formatCVV);
}

function setMinDates() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkin-date').min = today;
    document.getElementById('checkout-date').min = today;
}

function onDateChange() {
    const checkinInput = document.getElementById('checkin-date');
    const checkoutInput = document.getElementById('checkout-date');
    
    selectedDates.checkin = checkinInput.value;
    selectedDates.checkout = checkoutInput.value;
    
    if (selectedDates.checkin) {
        const checkinDate = new Date(selectedDates.checkin);
        checkinDate.setDate(checkinDate.getDate() + 1);
        checkoutInput.min = checkinDate.toISOString().split('T')[0];
        
        if (selectedDates.checkout && selectedDates.checkout <= selectedDates.checkin) {
            checkoutInput.value = '';
            selectedDates.checkout = null;
        }
    }
    
    updateSummaryDates();
    
    document.getElementById('availability-result').style.display = 'none';
    document.getElementById('price-breakdown').style.display = 'none';
    document.getElementById('complete-booking').disabled = true;
}

function updateSummaryDates() {
    const summaryDates = document.getElementById('summary-dates');
    
    if (selectedDates.checkin && selectedDates.checkout) {
        const checkinDate = new Date(selectedDates.checkin);
        const checkoutDate = new Date(selectedDates.checkout);
        
        const checkinFormatted = checkinDate.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
        const checkoutFormatted = checkoutDate.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
        
        const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
        
        document.getElementById('summary-checkin').textContent = checkinFormatted;
        document.getElementById('summary-checkout').textContent = checkoutFormatted;
        document.getElementById('summary-nights').textContent = `${nights} ${nights === 1 ? 'night' : 'nights'}`;
        
        summaryDates.style.display = 'block';
    } else {
        summaryDates.style.display = 'none';
    }
}

function isDateRangeOverlap(start1, end1, start2, end2) {
    const startDate1 = new Date(start1);
    const endDate1 = new Date(end1);
    const startDate2 = new Date(start2);
    const endDate2 = new Date(end2);
    
    return startDate1 < endDate2 && endDate1 > startDate2;
}

function checkAvailability() {
    if (isCheckingAvailability) return;
    
    if (!selectedDates.checkin || !selectedDates.checkout) {
        showToast('Please select check-in and check-out dates', 'warning');
        return;
    }
    
    const checkinDate = new Date(selectedDates.checkin);
    const checkoutDate = new Date(selectedDates.checkout);
    
    if (checkoutDate <= checkinDate) {
        showToast('Check-out date must be after check-in date', 'warning');
        return;
    }
    
    isCheckingAvailability = true;
    const checkBtn = document.getElementById('check-availability');
    const btnContent = checkBtn.innerHTML;
    const btnLoading = checkBtn.querySelector('.btn-loading');
    
    checkBtn.innerHTML = '<span style="opacity: 0;">Checking...</span>';
    btnLoading.style.display = 'block';
    
    setTimeout(() => {
        const isAvailable = checkDateAvailability(selectedDates.checkin, selectedDates.checkout);
        const resultDiv = document.getElementById('availability-result');
        
        if (isAvailable) {
            resultDiv.className = 'availability-result availability-available';
            resultDiv.innerHTML = '<i class="fas fa-check-circle me-2"></i>Dates are available!';
            resultDiv.style.display = 'block';
            
            calculatePrice();
            document.getElementById('complete-booking').disabled = false;
            
            showToast('Dates are available for booking', 'success');
        } else {
            resultDiv.className = 'availability-result availability-unavailable';
            resultDiv.innerHTML = '<i class="fas fa-times-circle me-2"></i>Selected dates are not available';
            resultDiv.style.display = 'block';
            
            document.getElementById('price-breakdown').style.display = 'none';
            document.getElementById('complete-booking').disabled = true;
            
            showToast('Selected dates are not available', 'error');
        }
        
        checkBtn.innerHTML = btnContent;
        btnLoading.style.display = 'none';
        isCheckingAvailability = false;
    }, 1500);
}

function checkDateAvailability(checkinDate, checkoutDate) {
    const allKeys = Object.keys(localStorage);
    const bookingKeys = allKeys.filter(key => key.endsWith('_bookings'));
    
    for (const key of bookingKeys) {
        const bookings = JSON.parse(localStorage.getItem(key) || '[]');
        
        for (const booking of bookings) {
            if (booking.listingId === currentListing.id || booking.listingId == currentListing.id) {
                if (isDateRangeOverlap(checkinDate, checkoutDate, booking.startDate, booking.endDate)) {
                    return false;
                }
            }
        }
    }
    
    return true;
}

function calculatePrice() {
    if (!selectedDates.checkin || !selectedDates.checkout) {
        return;
    }
    
    const checkinDate = new Date(selectedDates.checkin);
    const checkoutDate = new Date(selectedDates.checkout);
    const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) {
        return;
    }
    
    const nightlyRate = currentListing.price;
    const subtotal = nights * nightlyRate;
    const cleaningFee = 50;
    const serviceFee = Math.round(subtotal * 0.12); 
    const taxFee = Math.round(subtotal * 0.06); 
    const total = subtotal + cleaningFee + serviceFee + taxFee;
    
    document.getElementById('nightly-rate').textContent = `€${nightlyRate}`;
    document.getElementById('nights-count').textContent = nights;
    document.getElementById('subtotal-price').textContent = `€${subtotal}`;
    document.getElementById('service-fee').textContent = `€${serviceFee}`;
    document.getElementById('tax-fee').textContent = `€${taxFee}`;
    document.getElementById('total-price').textContent = `€${total}`;
    document.getElementById('booking-total').textContent = `€${total}`;
    
    totalPrice = total;
    
    document.getElementById('price-breakdown').style.display = 'block';
}

function formatCardNumber(e) {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    if (formattedValue.length > 19) {
        formattedValue = formattedValue.substring(0, 19);
    }
    e.target.value = formattedValue;
}

function formatExpiryDate(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
}

function formatCVV(e) {
    e.target.value = e.target.value.replace(/\D/g, '');
}

function handleBooking(e) {
    e.preventDefault();
    
    if (!validateBookingForm()) {
        return;
    }
    
    if (!checkDateAvailability(selectedDates.checkin, selectedDates.checkout)) {
        showToast('Dates are no longer available', 'error');
        return;
    }
    
    const submitBtn = document.getElementById('complete-booking');
    const btnContent = submitBtn.querySelector('.btn-content');
    const btnPrice = submitBtn.querySelector('.btn-price');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    btnContent.style.opacity = '0';
    btnPrice.style.opacity = '0';
    btnLoading.style.display = 'block';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        const booking = {
            listingId: currentListing.id,
            startDate: selectedDates.checkin, 
            endDate: selectedDates.checkout   
        };
        
        saveBooking(booking);
        
        const bookingRef = Math.random().toString(36).substring(2, 8).toUpperCase();
        document.getElementById('booking-ref').textContent = bookingRef;
        
        showSuccessModal();
        
        showToast('Booking completed successfully!', 'success');
        
        btnContent.style.opacity = '1';
        btnPrice.style.opacity = '1';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
    }, 2000);
}

function validateBookingForm() {
    const requiredFields = [
        'cardholder-name',
        'card-number',
        'expiry-date',
        'cvv',
        'billing-address'
    ];
    
    for (const fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            field.focus();
            showToast('Please fill in all required fields', 'warning');
            return false;
        }
    }
    
    const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
    if (cardNumber.length < 13 || cardNumber.length > 19) {
        document.getElementById('card-number').focus();
        showToast('Invalid card number', 'warning');
        return false;
    }
    
    const expiryDate = document.getElementById('expiry-date').value;
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        document.getElementById('expiry-date').focus();
        showToast('Invalid expiry date', 'warning');
        return false;
    }
    
    const [month, year] = expiryDate.split('/');
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const now = new Date();
    if (expiry <= now) {
        document.getElementById('expiry-date').focus();
        showToast('Card has expired', 'warning');
        return false;
    }
    
    const cvv = document.getElementById('cvv').value;
    if (cvv.length < 3 || cvv.length > 4) {
        document.getElementById('cvv').focus();
        showToast('Invalid CVV', 'warning');
        return false;
    }
    
    return true;
}

function saveBooking(booking) {
    const bookingKey = `${currentUser}_bookings`;
    const existingBookings = JSON.parse(localStorage.getItem(bookingKey) || '[]');
    
    existingBookings.push(booking);
    localStorage.setItem(bookingKey, JSON.stringify(existingBookings));
}

function showSuccessModal() {
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();
}

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    
    let icon = 'fa-info-circle';
    switch (type) {
        case 'success':
            icon = 'fa-check-circle';
            break;
        case 'error':
            icon = 'fa-times-circle';
            break;
        case 'warning':
            icon = 'fa-exclamation-triangle';
            break;
    }
    
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toastContainer.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

function setupExpandableDescription(element, fullText) {
    const cleanText = fullText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    
    const shortLimit = 200;
    
    if (cleanText.length <= shortLimit) {
        element.textContent = cleanText;
        return;
    }
    
    const shortText = cleanText.substring(0, shortLimit);
    const remainingText = cleanText.substring(shortLimit);
    
    element.innerHTML = `
        <span class="description-short">${shortText}...</span>
        <span class="description-full" style="display: none;">${cleanText}</span>
        <button class="btn-read-more" onclick="toggleDescription(this)">
            <i class="fas fa-chevron-down me-2"></i>Keep Reading
        </button>
    `;
}

function toggleDescription(button) {
    const container = button.parentElement;
    const shortText = container.querySelector('.description-short');
    const fullText = container.querySelector('.description-full');
    const icon = button.querySelector('i');
    
    if (fullText.style.display === 'none') {
        shortText.style.display = 'none';
        fullText.style.display = 'inline';
        button.innerHTML = '<i class="fas fa-chevron-up me-2"></i>Show Less';
    } else {
        shortText.style.display = 'inline';
        fullText.style.display = 'none';
        button.innerHTML = '<i class="fas fa-chevron-down me-2"></i>Keep Reading';
    }
}

function signOut() {
    if (confirm('Are you sure you want to sign out?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}