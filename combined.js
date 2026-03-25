/* ========================================= */
/* MAIN TEMPLATE SHOWCASE JAVASCRIPT (script.js) */
/* ========================================= */

/**
 * Load templates from the database via PHP API
 */
async function loadTemplates() {
    try {
        const response = await fetch('combined.php');
        const result = await response.json();
        
        if (result.success && result.data) {
            displayTemplates(result.data);
        } else {
            console.error('Error loading templates:', result.error);
            showError('Failed to load templates. Please check your database connection.');
        }
    } catch (error) {
        console.error('Error fetching templates:', error);
        showError('Failed to load templates. Please ensure the PHP server is running.');
    }
}

/**
 * Display templates in the grid
 */
function displayTemplates(templates) {
    const grid = document.querySelector('.template-grid');
    grid.innerHTML = ''; // Clear existing content
    
    templates.forEach(template => {
        const card = createTemplateCard(template);
        grid.appendChild(card);
    });
}

/**
 * Create a template card element
 */
function createTemplateCard(template) {
    const card = document.createElement('div');
    card.className = 'template-card';
    card.style.cursor = 'pointer';

    card.innerHTML = `
        <div class="template-image-container">
            <img src="${template.image_url}" 
                 alt="Screenshot of ${template.name} Template" 
                 class="template-image">
        </div>
        <div class="template-info">
            <div class="template-name">${template.name}</div>
            <button class="copy-button" 
                    data-link="${template.link}"
                    onclick="event.stopPropagation(); copyLink(this)">
                Copy Link
            </button>
        </div>
    `;

    // Open template link in new tab on card click
    card.addEventListener('click', function(e) {
        if (!e.target.classList.contains('copy-button')) {
            const link = template.link.startsWith('http') ? template.link : 'https://' + template.link;
            window.open(link, '_blank');
        }
    });

    return card;
}

/**
 * Show error message to user
 */
function showError(message) {
    const grid = document.querySelector('.template-grid');
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #dc3545;">
        <p>${message}</p>
    </div>`;
}

/**
 * Initialize on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    loadTemplates();
    initializeSearch();
});

/**
 * Refresh templates when page becomes visible (useful when returning from admin page)
 */
document.addEventLi