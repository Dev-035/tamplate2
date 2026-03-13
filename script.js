/**
 * Load templates from the database via PHP API
 */
async function loadTemplates() {
    try {
        const response = await fetch('get_templates.php');
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
                    onclick="copyLink(this)">
                Copy Link
            </button>
        </div>
    `;
    
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
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        loadTemplates();
    }
});

/**
 * Initialize search functionality
 */
function initializeSearch() {
    const searchInput = document.getElementById('template-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            filterTemplates(searchTerm);
        });
    }
}

/**
 * Filter templates based on search term
 */
function filterTemplates(searchTerm) {
    const templateCards = document.querySelectorAll('.template-card');
    
    templateCards.forEach(card => {
        const templateName = card.querySelector('.template-name');
        if (templateName) {
            const name = templateName.textContent.toLowerCase();
            
            if (name.includes(searchTerm) || searchTerm === '') {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        }
    });
    
    // Show "no results" message if no templates are visible
    const visibleCards = document.querySelectorAll('.template-card[style*="flex"]');
    const grid = document.querySelector('.template-grid');
    
    // Remove existing no-results message
    const existingMessage = document.querySelector('.no-results-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    if (visibleCards.length === 0 && searchTerm !== '') {
        const noResultsMessage = document.createElement('div');
        noResultsMessage.className = 'no-results-message';
        noResultsMessage.style.cssText = 'grid-column: 1/-1; text-align: center; padding: 40px; color: #6c757d;';
        noResultsMessage.innerHTML = `
            <i class="fas fa-search" style="font-size: 2em; margin-bottom: 15px; color: #dee2e6;"></i>
            <p>No templates found for "${searchTerm}"</p>
            <small>Try searching with different keywords</small>
        `;
        grid.appendChild(noResultsMessage);
    }
}
/**
 * Main function to copy the template link to the clipboard.
 * Uses the modern Clipboard API with a fallback for older browsers.
 * @param {HTMLButtonElement} button - The button element that was clicked.
 */
function copyLink(button) {
    const link = button.getAttribute('data-link');
    
    // Use the modern Clipboard API (requires secure context - HTTPS/localhost)
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(link).then(() => {
            // Success feedback
            showCopyFeedback(button);
        }).catch(err => {
            console.error('Failed to copy link using clipboard API: ', err);
            // Fallback to old method if Clipboard API fails
            fallbackCopy(link, button);
        });
    } else {
        // Fallback for older browsers or insecure contexts
        fallbackCopy(link, button);
    }
}

/**
 * Fallback function for copying text using a hidden textarea field (old method).
 * @param {string} link - The URL string to copy.
 * @param {HTMLButtonElement} button - The button element for feedback.
 */
function fallbackCopy(link, button) {
    // Create a temporary textarea element
    let tempInput = document.createElement('textarea');
    tempInput.value = link;
    
    // Make the textarea invisible and off-screen
    tempInput.style.position = 'absolute';
    tempInput.style.left = '-9999px';
    tempInput.style.top = '-9999px';
    document.body.appendChild(tempInput);
    
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopyFeedback(button);
        } else {
            console.error('Fallback: document.execCommand("copy") failed.');
            alert("Could not automatically copy the link. Please copy manually: " + link);
        }

    } catch (err) {
        console.error('Failed to copy link via fallback method: ', err);
        button.textContent = 'Error Copying';
        setTimeout(() => {
            button.textContent = 'Copy Link';
        }, 1500);
    }
    
    // Clean up by removing the temporary element
    document.body.removeChild(tempInput);
}

/**
 * Provides visual feedback on the button after successful copy.
 * @param {HTMLButtonElement} button - The button element to update.
 */
function showCopyFeedback(button) {
    const originalText = button.textContent;
    button.textContent = 'Link Copied!';
    button.classList.add('copied');

    setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('copied');
    }, 1500);
}
/**
 * View switching functionality
 */
function showView(viewName) {
    // Hide all views
    const views = document.querySelectorAll('.view-container');
    views.forEach(view => view.style.display = 'none');
    
    // Show selected view
    const targetView = document.getElementById(viewName + '-view');
    if (targetView) {
        targetView.style.display = 'block';
    }
    
    // Update navigation active state
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');
    
    // Load templates based on view
    if (viewName === 'home') {
        loadTemplates();
    }
}

/**
 * Admin form functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    loadTemplates();
    initializeSearch();
    initializeAdminForm();
});

function initializeAdminForm() {
    const templateForm = document.getElementById('template-form');
    if (templateForm) {
        templateForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submit-btn');
            const messageContainer = document.getElementById('message-container');
            
            // Get form data
            const formData = new FormData(this);
            const templateData = {
                name: formData.get('name').trim(),
                link: formData.get('link').trim()
            };
            
            // Basic validation
            if (!templateData.name || !templateData.link) {
                showMessage('Please fill in all fields', 'error');
                return;
            }
            
            // Disable submit button and show loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding Template...';
            
            try {
                const response = await fetch('add_template.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(templateData)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showMessage('Template added successfully! It will now appear in the dashboard.', 'success');
                    this.reset(); // Clear the form
                } else {
                    showMessage(result.error || 'Failed to add template', 'error');
                }
                
            } catch (error) {
                console.error('Error:', error);
                showMessage('Network error. Please check your connection and try again.', 'error');
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Template';
            }
        });
    }
}

function showMessage(text, type) {
    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
        messageContainer.innerHTML = `<div class="message ${type}">${text}</div>`;
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageContainer.innerHTML = '';
            }, 5000);
        }
    }
}