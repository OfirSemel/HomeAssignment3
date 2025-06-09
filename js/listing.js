// שליפת דירות, סינון, חיפוש


class ApartmentListing {
    constructor() {
        this.allApartments = [];
        this.filteredApartments = [];
        this.userFavorites = [];
        this.currentUser = localStorage.getItem('currentUser') || 'Demo User';
        this.priceRange = { min: 0, max: 0 };
        
        this.init();
    }

    init() {
        this.loadApartmentData();
        this.loadUserFavorites();
        this.calculatePriceRange();
        this.setupFilterForm();
        this.loadBedroomOptions();
        this.setPriceRangeDefaults();
        this.displayApartments(this.filteredApartments);
        this.updateApartmentCount();
    }

    loadApartmentData() {
        this.allApartments = window.amsterdam || [];
        this.filteredApartments = [...this.allApartments];
    }

    loadUserFavorites() {
        const favoritesKey = `${this.currentUser}_favorites`;
        this.userFavorites = JSON.parse(localStorage.getItem(favoritesKey) || '[]');
    }

    calculatePriceRange() {
        if (this.allApartments.length === 0) return;
        
        const prices = this.allApartments.map(apt => {
            const priceStr = apt.price.replace(/[$,]/g, '');
            return parseFloat(priceStr) || 0;
        }).filter(price => price > 0);

        this.priceRange.min = Math.min(...prices);
        this.priceRange.max = Math.max(...prices);
    }

    setPriceRangeDefaults() {
        const minPriceInput = document.getElementById('min-price');
        const maxPriceInput = document.getElementById('max-price');
        
        if (minPriceInput && maxPriceInput) {
            minPriceInput.placeholder = `Min: $${this.priceRange.min}`;
            maxPriceInput.placeholder = `Max: $${this.priceRange.max}`;
            minPriceInput.min = this.priceRange.min;
            maxPriceInput.max = this.priceRange.max;
        }
    }

    setupFilterForm() {
        const filterForm = document.getElementById('filter-form');
        if (filterForm) {
            filterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.applyFilters();
            });
        }
    }

    loadBedroomOptions() {
        const bedroomsSelect = document.getElementById('bedrooms');
        if (!bedroomsSelect) return;

        while (bedroomsSelect.children.length > 1) {
            bedroomsSelect.removeChild(bedroomsSelect.lastChild);
        }

        const uniqueBedrooms = [...new Set(this.allApartments.map(apt => apt.bedrooms))]
            .filter(bedrooms => bedrooms && bedrooms !== '')
            .sort((a, b) => parseInt(a) - parseInt(b));
        
        uniqueBedrooms.forEach(bedrooms => {
            const option = document.createElement('option');
            option.value = bedrooms;
            option.textContent = bedrooms === '1' ? '1 Bedroom' : `${bedrooms} Bedrooms`;
            bedroomsSelect.appendChild(option);
        });
    }

    applyFilters() {
        const minRating = parseFloat(document.getElementById('min-rating')?.value) || 0;
        const minPrice = parseFloat(document.getElementById('min-price')?.value) || this.priceRange.min;
        const maxPrice = parseFloat(document.getElementById('max-price')?.value) || this.priceRange.max;
        const bedrooms = document.getElementById('bedrooms')?.value || '';

        this.filteredApartments = this.allApartments.filter(apartment => {
            const rating = parseFloat(apartment.review_scores_rating) || 0;
            if (rating < minRating) return false;
            
            const priceStr = apartment.price.replace(/[$,]/g, '');
            const price = parseFloat(priceStr) || 0;
            if (price < minPrice || price > maxPrice) return false;
            
            if (bedrooms && apartment.bedrooms !== bedrooms) return false;
            
            return true;
        });

        this.displayApartments(this.filteredApartments);
        this.showFilterResults();
    }

    clearFilters() {
        const filterForm = document.getElementById('filter-form');
        if (filterForm) {
            filterForm.reset();
        }
        
        this.filteredApartments = [...this.allApartments];
        this.displayApartments(this.filteredApartments);
        this.hideFilterResults();
    }

    displayApartments(apartments) {
        const grid = document.getElementById('apartments-grid');
        const noResults = document.getElementById('no-results');
        
        if (!grid) return;

        if (apartments.length === 0) {
            grid.style.display = 'none';
            if (noResults) noResults.style.display = 'block';
            return;
        }
        
        if (noResults) noResults.style.display = 'none';
        grid.style.display = 'grid';
        
        grid.innerHTML = apartments.map(apartment => this.createApartmentCard(apartment)).join('');
    }

    createApartmentCard(apartment) {
        const isFavorite = this.userFavorites.includes(apartment.listing_id);
        const stars = this.generateStars(parseFloat(apartment.review_scores_rating) || 0);
        
        return `
            <div class="apartment-card" data-listing-id="${apartment.listing_id}">
                <div class="card-image-container">
                    <img src="${apartment.picture_url}" alt="${apartment.name}" class="card-image" onerror="this.src='https://via.placeholder.com/400x250?text=No+Image'">
                    <div class="card-overlay">
                        <button class="btn-favorite ${isFavorite ? 'active' : ''}" onclick="apartmentListing.toggleFavorite('${apartment.listing_id}')" title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                    <div class="price-badge">
                        <span class="price">${apartment.price}</span>
                        <span class="period">/night</span>
                    </div>
                </div>
                
                <div class="card-content">
                    <div class="card-header">
                        <h4 class="apartment-name">${apartment.name}</h4>
                        <div class="apartment-rating">
                            <span class="rating-stars">${stars}</span>
                            <span class="rating-value">${apartment.review_scores_rating || 'N/A'}</span>
                        </div>
                    </div>
                    
                    <div class="apartment-details">
                        <div class="detail-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${apartment.neighbourhood_cleansed}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-bed"></i>
                            <span>${apartment.bedrooms} ${apartment.bedrooms == '1' ? 'Bedroom' : 'Bedrooms'}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-hashtag"></i>
                            <span>ID: ${apartment.listing_id}</span>
                        </div>
                    </div>
                    
                    <p class="apartment-description">${apartment.description}</p>
                    
                    <div class="card-actions">
                        <a href="${apartment.listing_url}" target="_blank" class="btn btn-outline">
                            <i class="fas fa-external-link-alt me-2"></i>View Details
                        </a>
                        <button class="btn btn-rent" onclick="apartmentListing.rentApartment('${apartment.listing_id}')">
                            <i class="fas fa-calendar-check me-2"></i>Rent Now
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const remainingStars = 5 - Math.ceil(rating);
        for (let i = 0; i < remainingStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }

    showFilterResults() {
        const resultsDiv = document.getElementById('filter-results');
        const resultsText = document.getElementById('results-text');
        const clearBtn = document.getElementById('clear-results-btn');
        
        if (resultsDiv && resultsText) {
            resultsText.textContent = `Showing ${this.filteredApartments.length} of ${this.allApartments.length} apartments`;
            if (clearBtn) {
                clearBtn.style.display = this.filteredApartments.length !== this.allApartments.length ? 'inline-block' : 'none';
            }
            resultsDiv.style.display = 'block';
        }
    }

    hideFilterResults() {
        const resultsDiv = document.getElementById('filter-results');
        if (resultsDiv) {
            resultsDiv.style.display = 'none';
        }
    }

    updateApartmentCount() {
        const countElement = document.getElementById('total-apartments');
        if (countElement) {
            countElement.textContent = this.allApartments.length;
        }
    }

    toggleFavorite(listingId) {
        const favoritesKey = `${this.currentUser}_favorites`;
        
        if (this.userFavorites.includes(listingId)) {
            this.userFavorites = this.userFavorites.filter(id => id !== listingId);
            this.showToast('Removed from favorites', 'info');
        } else {
            this.userFavorites.push(listingId);
            this.showToast('Added to favorites', 'success');
        }
        
        localStorage.setItem(favoritesKey, JSON.stringify(this.userFavorites));
        
        const btn = document.querySelector(`[data-listing-id="${listingId}"] .btn-favorite`);
        if (btn) {
            btn.classList.toggle('active');
            btn.title = this.userFavorites.includes(listingId) ? 'Remove from favorites' : 'Add to favorites';
        }
    }

    rentApartment(listingId) {
        const apartment = this.allApartments.find(apt => apt.listing_id === listingId);
        if (apartment) {
            localStorage.setItem('selectedApartment', JSON.stringify(apartment));
            this.showToast(`Selected apartment: ${apartment.name}`, 'success');
            
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
            ${message}
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 3000);
    }

    searchApartments(searchTerm) {
        if (!searchTerm || searchTerm.trim() === '') {
            this.filteredApartments = [...this.allApartments];
        } else {
            const term = searchTerm.toLowerCase().trim();
            this.filteredApartments = this.allApartments.filter(apartment => 
                apartment.name.toLowerCase().includes(term) ||
                apartment.description.toLowerCase().includes(term) ||
                apartment.neighbourhood_cleansed.toLowerCase().includes(term)
            );
        }
        
        this.displayApartments(this.filteredApartments);
        this.showFilterResults();
    }

    getStatistics() {
        return {
            totalApartments: this.allApartments.length,
            filteredApartments: this.filteredApartments.length,
            averageRating: this.calculateAverageRating(),
            priceRange: this.priceRange,
            neighborhoods: this.getUniqueNeighborhoods(),
            bedroomOptions: this.getUniqueBedroomCounts()
        };
    }

    calculateAverageRating() {
        const ratings = this.allApartments
            .map(apt => parseFloat(apt.review_scores_rating))
            .filter(rating => !isNaN(rating));
        
        if (ratings.length === 0) return 0;
        return (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1);
    }

    getUniqueNeighborhoods() {
        return [...new Set(this.allApartments.map(apt => apt.neighbourhood_cleansed))].sort();
    }

    getUniqueBedroomCounts() {
        return [...new Set(this.allApartments.map(apt => apt.bedrooms))]
            .filter(bedrooms => bedrooms && bedrooms !== '')
            .sort((a, b) => parseInt(a) - parseInt(b));
    }
}

let apartmentListing;

document.addEventListener('DOMContentLoaded', function() {
    if (typeof window.amsterdam === 'undefined') {
        console.error('Amsterdam data not found!');
        return;
    }
    
    apartmentListing = new ApartmentListing();
});

function clearFilters() {
    if (apartmentListing) {
        apartmentListing.clearFilters();
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApartmentListing;
}
