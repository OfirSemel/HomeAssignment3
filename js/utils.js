
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
        
        setTimeout(() => {
            errorDiv.classList.remove('show');
        }, 5000);
    }
}

function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.classList.add('show');
        
        setTimeout(() => {
            successDiv.classList.remove('show');
        }, 3000);
    }
}


function setupExpandableDescription(element, fullText) {
    const cleanText = fullText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    
    const shortLimit = 150; 
    
    if (cleanText.length <= shortLimit) {
        element.textContent = cleanText;
        return;
    }
    
    const shortText = cleanText.substring(0, shortLimit);
    
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
    
    if (fullText.style.display === 'none') {
        // Expand
        shortText.style.display = 'none';
        fullText.style.display = 'inline';
        button.innerHTML = '<i class="fas fa-chevron-up me-2"></i>Show Less';
    } else {
        // Collapse
        shortText.style.display = 'inline';
        fullText.style.display = 'none';
        button.innerHTML = '<i class="fas fa-chevron-down me-2"></i>Keep Reading';
    }
}