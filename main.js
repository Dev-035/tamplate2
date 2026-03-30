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
    
    // Make the whole card clickable
    card.style.cursor = 'pointer';
    card.addEventListener('click', function(e) {
        // Don't trigger if clicking copy button
        if (!e.target.classList.contains('copy-button')) {
            const link = template.link.startsWith('http') ? template.link : 'https://' + template.link;
            window.open(link, '_blank');
        }
    });
    
    card.innerHTML = `
        <div class="template-image-container">
            <img src="${template.image_url}" 
                 alt="Screenshot of ${template.name} Template" 
                 class="template-image"
                 loading="lazy"
                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22400%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22600%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2224%22 fill=%22%23999%22%3EImage loading failed%3C/text%3E%3C/svg%3E'">
        </div>
        <div class="template-info">
            <div class="template-name">${template.name}</div>
            <div class="card-actions">
                <button class="copy-button" 
                        data-link="${template.link}"
                        onclick="event.stopPropagation(); copyLink(this)">
                    Copy Link
                </button>
            </div>
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
    initializeAdminForm();
    loadNotes();
    loadChecklist();
    loadUploadedFiles();
    initColorTooltips();
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
 * Initialize search functionality with suggestions
 */
function initializeSearch() {
    const searchInput = document.getElementById('template-search');
    const suggestionsBox = document.getElementById('search-suggestions');
    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        const term = this.value.toLowerCase().trim();
        filterTemplates(term);
        showSuggestions(term);
    });

    searchInput.addEventListener('focus', function() {
        const term = this.value.toLowerCase().trim();
        showSuggestions(term); // show all if empty, filtered if has text
    });

    // Close suggestions on outside click
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
            hideSuggestions();
        }
    });

    // Keyboard navigation
    searchInput.addEventListener('keydown', function(e) {
        const items = suggestionsBox.querySelectorAll('.suggestion-item');
        const active = suggestionsBox.querySelector('.suggestion-item.active');
        let idx = Array.from(items).indexOf(active);

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            idx = (idx + 1) % items.length;
            items.forEach(i => i.classList.remove('active'));
            if (items[idx]) items[idx].classList.add('active');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            idx = (idx - 1 + items.length) % items.length;
            items.forEach(i => i.classList.remove('active'));
            if (items[idx]) items[idx].classList.add('active');
        } else if (e.key === 'Enter') {
            if (active) {
                searchInput.value = active.dataset.name;
                filterTemplates(active.dataset.name.toLowerCase());
                hideSuggestions();
            }
        } else if (e.key === 'Escape') {
            hideSuggestions();
        }
    });
}

function showSuggestions(term) {
    const suggestionsBox = document.getElementById('search-suggestions');
    if (!suggestionsBox) return;

    const cards = document.querySelectorAll('.template-card');
    const matches = [];

    cards.forEach(card => {
        const nameEl = card.querySelector('.template-name');
        if (!nameEl) return;
        const name = nameEl.textContent.trim();
        if (!term || name.toLowerCase().includes(term)) {
            matches.push(name);
        }
    });

    if (matches.length === 0) { hideSuggestions(); return; }

    suggestionsBox.innerHTML = matches.slice(0, 8).map(name => {
        const regex = new RegExp(`(${term})`, 'gi');
        const highlighted = term ? name.replace(regex, '<mark>$1</mark>') : name;
        return `<div class="suggestion-item" data-name="${name}" onclick="selectSuggestion('${name.replace(/'/g, "\\'")}')">
            <span>${highlighted}</span>
        </div>`;
    }).join('');

    // Show "all templates" label when no term
    if (!term) {
        suggestionsBox.innerHTML = `<div class="suggestion-label">All Templates</div>` + suggestionsBox.innerHTML;
    }

    suggestionsBox.classList.add('visible');
}

function selectSuggestion(name) {
    const searchInput = document.getElementById('template-search');
    searchInput.value = name;
    filterTemplates(name.toLowerCase());
    hideSuggestions();
}

function hideSuggestions() {
    const box = document.getElementById('search-suggestions');
    if (box) box.classList.remove('visible');
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
 * Copy the template link to the clipboard.
 * Uses the modern Clipboard API with a fallback for older browsers.
 * @param {HTMLButtonElement} button - The button element that was clicked.
 */
function copyLink(button) {
    const link = button.getAttribute('data-link');
    
    // Use the modern Clipboard API (requires secure context - HTTPS/localhost)
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(link).then(() => {
            showCopyFeedback(button);
        }).catch(err => {
            console.error('Failed to copy link using clipboard API: ', err);
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
    let tempInput = document.createElement('textarea');
    tempInput.value = link;
    tempInput.style.position = 'absolute';
    tempInput.style.left = '-9999px';
    tempInput.style.top = '-9999px';
    document.body.appendChild(tempInput);
    
    tempInput.select();
    tempInput.setSelectionRange(0, 99999);
    
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
 * Toggle mobile nav menu
 */
function toggleNavMenu() {
    const nav = document.getElementById('nav-links');
    const btn = document.getElementById('navHamburger');
    nav.classList.toggle('open');
    btn.classList.toggle('active');
}

/**
 * Toggle mobile left panel
 */
function toggleMobilePanel() {
    const panel = document.querySelector('.left-panel');
    const overlay = document.getElementById('mobileOverlay');
    const btn = document.getElementById('mobilePanelToggle');
    panel.classList.toggle('open');
    overlay.classList.toggle('active');
    btn.classList.toggle('active');
}

function closeMobilePanel() {
    const panel = document.querySelector('.left-panel');
    const overlay = document.getElementById('mobileOverlay');
    const btn = document.getElementById('mobilePanelToggle');
    panel.classList.remove('open');
    overlay.classList.remove('active');
    btn.classList.remove('active');
}

/**
 * ── COLOR DOT TOOLTIP ──
 */
function initColorTooltips() {
    const dots = document.querySelectorAll('.color-dot');
    const tooltip = document.getElementById('color-tooltip');
    const swatch = document.getElementById('tooltip-swatch');
    const nameEl = document.getElementById('tooltip-name');
    const codeEl = document.getElementById('tooltip-code');

    dots.forEach(dot => {
        dot.addEventListener('mouseenter', () => {
            const name = dot.dataset.name;
            const code = dot.dataset.code;
            swatch.style.backgroundColor = code;
            nameEl.textContent = name;
            codeEl.textContent = code;
            tooltip.classList.add('visible');
        });

        dot.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });

        // Click to copy color code
        dot.addEventListener('click', () => {
            const code = dot.dataset.code;
            navigator.clipboard.writeText(code).then(() => {
                const codeEl = document.getElementById('tooltip-code');
                const original = codeEl.textContent;
                codeEl.textContent = 'Copied!';
                setTimeout(() => codeEl.textContent = original, 1500);
            });
        });
    });
}

/**
 * ── NOTES ──
 */
let notesTimer = null;

function autoSaveNotes() {
    clearTimeout(notesTimer);
    notesTimer = setTimeout(() => {
        const editor = document.getElementById('client-notes-editor');
        if (editor) localStorage.setItem('clientNotes', editor.innerHTML);
    }, 800);
}

function saveNotes() {
    const editor = document.getElementById('client-notes-editor');
    const btn = document.querySelector('.save-notes-btn');
    if (editor) {
        localStorage.setItem('clientNotes', editor.innerHTML);
        if (btn) {
            btn.classList.add('saved');
            btn.innerHTML = '<i class="fas fa-check"></i> Saved!';
            setTimeout(() => {
                btn.classList.remove('saved');
                btn.innerHTML = '<i class="fas fa-save"></i> Save';
            }, 2000);
        }
    }
}

function loadNotes() {
    const editor = document.getElementById('client-notes-editor');
    if (editor) {
        const saved = localStorage.getItem('clientNotes');
        if (saved) editor.innerHTML = saved;
    }
}

function clearNotes() {
    const editor = document.getElementById('client-notes-editor');
    if (editor && confirm('Clear all notes?')) {
        editor.innerHTML = '';
        localStorage.removeItem('clientNotes');
    }
}

/**
 * ── CHECKLIST ──
 */
let deletedStack = []; // undo stack

function loadChecklist() {
    const saved = JSON.parse(localStorage.getItem('checklist') || '[]');
    if (saved.length === 0) {
        const defaults = [
            { text: 'Install WordPress', done: false, highlighted: false },
            { text: 'Choose Theme', done: false, highlighted: false },
            { text: 'Customize Header', done: false, highlighted: false },
            { text: 'Develop Custom Post Types', done: false, highlighted: false },
            { text: 'Implement SEO Plugins', done: false, highlighted: false },
            { text: 'Content Migration', done: false, highlighted: false },
            { text: 'QA & Launch', done: false, highlighted: false }
        ];
        localStorage.setItem('checklist', JSON.stringify(defaults));
        renderChecklist(defaults);
    } else {
        renderChecklist(saved);
    }
}

function renderChecklist(items) {
    const container = document.getElementById('checklist-container');
    if (!container) return;
    container.innerHTML = '';

    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'checklist-item' + (item.highlighted ? ' highlighted' : '') + (item.done ? ' done-item' : '');

        div.innerHTML = `
            <div class="checklist-row">
                <input type="checkbox" class="checklist-checkbox" id="ci-${index}" 
                    ${item.done ? 'checked' : ''} 
                    onchange="toggleDone(${index})">
                <label for="ci-${index}" class="item-text ${item.done ? 'done-text' : ''}">${item.text}</label>
                <div class="item-actions">
                    <button class="item-delete-btn" 
                        onclick="event.stopPropagation(); deleteChecklistItem(${index})" 
                        title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(div);
    });

    // Show/hide undo button
    const undoBtn = document.getElementById('undo-btn');
    if (undoBtn) undoBtn.style.display = deletedStack.length > 0 ? 'flex' : 'none';

    updateProgress(items);
}

function toggleHighlight(index) {
    const items = JSON.parse(localStorage.getItem('checklist') || '[]');
    items[index].highlighted = !items[index].highlighted;
    localStorage.setItem('checklist', JSON.stringify(items));
    renderChecklist(items);
}

function toggleDone(index) {
    const items = JSON.parse(localStorage.getItem('checklist') || '[]');
    items[index].done = !items[index].done;
    localStorage.setItem('checklist', JSON.stringify(items));
    renderChecklist(items);
}

function deleteChecklistItem(index) {
    const items = JSON.parse(localStorage.getItem('checklist') || '[]');
    const deleted = items.splice(index, 1)[0];
    deletedStack.push({ item: deleted, index });
    localStorage.setItem('checklist', JSON.stringify(items));
    renderChecklist(items);
}

function undoDelete() {
    if (deletedStack.length === 0) return;
    const { item, index } = deletedStack.pop();
    const items = JSON.parse(localStorage.getItem('checklist') || '[]');
    items.splice(index, 0, item);
    localStorage.setItem('checklist', JSON.stringify(items));
    renderChecklist(items);
}

function addChecklistItem() {
    const input = document.getElementById('new-checklist-input');
    const text = input.value.trim();
    if (!text) return;
    const items = JSON.parse(localStorage.getItem('checklist') || '[]');
    items.push({ text, done: false, highlighted: false });
    localStorage.setItem('checklist', JSON.stringify(items));
    renderChecklist(items);
    input.value = '';
    input.focus();
}

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('new-checklist-input');
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') addChecklistItem();
        });
    }
});

function updateProgress(items) {
    const total = items.length;
    const done = items.filter(i => i.done).length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);

    const fill = document.getElementById('checklist-progress-fill');
    const text = document.getElementById('checklist-progress-text');
    const count = document.getElementById('checklist-count');

    if (fill) fill.style.width = pct + '%';
    if (text) text.textContent = pct + '% COMPLETE (' + done + '/' + total + ')';
    if (count) count.textContent = `(${total} STEPS)`;
}

/**
 * ── FILE UPLOAD ──
 */

// In-memory store for videos (object URLs can't be saved to localStorage)
window._sessionFiles = [];

function loadUploadedFiles() {
    const saved = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
    window._sessionFiles = saved;
    renderFileList(saved);
}

function handleFileUpload(input) {
    const fileArray = Array.from(input.files);
    const current = window._sessionFiles || [];
    let processed = 0;

    if (fileArray.length === 0) return;

    fileArray.forEach(file => {
        if (file.type.startsWith('video/')) {
            // Videos use object URL (available this session only)
            const objectUrl = URL.createObjectURL(file);
            current.push({
                name: file.name,
                size: formatFileSize(file.size),
                type: file.type,
                data: objectUrl,
                isObjectUrl: true
            });
            processed++;
            if (processed === fileArray.length) {
                window._sessionFiles = current;
                // Save only non-video files to localStorage
                localStorage.setItem('uploadedFiles', JSON.stringify(current.filter(f => !f.isObjectUrl)));
                renderFileList(current);
            }
        } else {
            // All other files use base64
            const reader = new FileReader();
            reader.onload = function(e) {
                current.push({
                    name: file.name,
                    size: formatFileSize(file.size),
                    type: file.type,
                    data: e.target.result
                });
                processed++;
                if (processed === fileArray.length) {
                    window._sessionFiles = current;
                    localStorage.setItem('uploadedFiles', JSON.stringify(current.filter(f => !f.isObjectUrl)));
                    renderFileList(current);
                }
            };
            reader.readAsDataURL(file);
        }
    });

    input.value = '';
}

function renderFileList(files) {
    const list = document.getElementById('uploaded-files-list');
    if (!list) return;
    list.innerHTML = '';

    files.forEach((file, index) => {
        const icon = getFileIcon(file.type);
        const isVideo = file.type.startsWith('video/');
        const div = document.createElement('div');
        div.className = 'file-item-row';
        div.innerHTML = `
            <i class="${icon}"></i>
            <span class="file-item-name" title="${file.name}">${file.name}</span>
            <span class="file-item-size">${file.size}${isVideo ? ' 🎬' : ''}</span>
            <div class="file-item-actions">
                <button class="file-view-btn" onclick="viewFile(${index})" title="View">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="file-delete-btn" onclick="deleteUploadedFile(${index})" title="Remove">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        list.appendChild(div);
    });
}

function viewFile(index) {
    const files = window._sessionFiles || [];
    const file = files[index];
    if (!file || !file.data) return;

    if (file.type.startsWith('video/')) {
        showFileModal(file.name, `
            <video controls autoplay style="width:100%;max-height:75vh;border-radius:8px;background:#000;display:block;">
                <source src="${file.data}" type="${file.type}">
                Your browser does not support video playback.
            </video>
        `);
    } else if (file.type.startsWith('image/')) {
        showFileModal(file.name, `<img src="${file.data}" style="max-width:100%;max-height:75vh;border-radius:8px;display:block;margin:auto;">`);
    } else if (file.type === 'application/pdf') {
        const win = window.open();
        win.document.write(`<iframe src="${file.data}" style="width:100%;height:100vh;border:none;"></iframe>`);
    } else {
        const a = document.createElement('a');
        a.href = file.data;
        a.download = file.name;
        a.click();
    }
}

function deleteUploadedFile(index) {
    const files = window._sessionFiles || [];
    files.splice(index, 1);
    window._sessionFiles = files;
    localStorage.setItem('uploadedFiles', JSON.stringify(files.filter(f => !f.isObjectUrl)));
    renderFileList(files);
}

function showFileModal(title, content) {
    // Remove existing modal
    const existing = document.getElementById('file-preview-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'file-preview-modal';
    modal.className = 'file-modal-overlay';
    modal.innerHTML = `
        <div class="file-modal-box">
            <div class="file-modal-header">
                <span class="file-modal-title">${title}</span>
                <button class="file-modal-close" onclick="document.getElementById('file-preview-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="file-modal-body">${content}</div>
        </div>
    `;
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    document.body.appendChild(modal);
}

function deleteUploadedFile(index) {
    const files = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
    files.splice(index, 1);
    localStorage.setItem('uploadedFiles', JSON.stringify(files));
    renderFileList(files);
}

function getFileIcon(type) {
    if (!type) return 'fas fa-file';
    if (type.includes('pdf')) return 'fas fa-file-pdf';
    if (type.includes('image')) return 'fas fa-file-image';
    if (type.startsWith('video/')) return 'fas fa-file-video';
    if (type.includes('word') || type.includes('document')) return 'fas fa-file-word';
    if (type.includes('sheet') || type.includes('excel')) return 'fas fa-file-excel';
    if (type.includes('zip') || type.includes('rar')) return 'fas fa-file-archive';
    return 'fas fa-file-alt';
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
}

/**
 * View switching functionality
 */
function showView(viewName) {
    const views = document.querySelectorAll('.view-container');
    views.forEach(view => view.style.display = 'none');

    const targetView = document.getElementById(viewName + '-view');
    if (targetView) targetView.style.display = 'block';

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');

    // Close mobile nav menu if open
    const nav = document.getElementById('nav-links');
    const btn = document.getElementById('navHamburger');
    if (nav) nav.classList.remove('open');
    if (btn) btn.classList.remove('active');

    if (viewName === 'home') loadTemplates();
}

/**
 * Admin form initialization and handling
 */
function initializeAdminForm() {
    const templateForm = document.getElementById('template-form');
    if (templateForm) {
        templateForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submit-btn');
            const messageContainer = document.getElementById('message-container');
            
            const formData = new FormData(this);
            const templateData = {
                name: formData.get('name').trim(),
                link: formData.get('link').trim()
            };
            
            if (!templateData.name || !templateData.link) {
                showMessage('Please fill in all fields', 'error');
                return;
            }
            
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
                    showMessage('Template added successfully! Refreshing templates...', 'success');
                    this.reset();
                    setTimeout(() => {
                        loadTemplates();
                    }, 1500);
                } else {
                    showMessage(result.error || 'Failed to add template', 'error');
                }
                
            } catch (error) {
                console.error('Error:', error);
                showMessage('Network error. Please check your connection and try again.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Template';
            }
        });
    }
}

/**
 * Display message to user
 */
function showMessage(text, type) {
    const messageContainer = document.getElementById('message-container');
    if (messageContainer) {
        messageContainer.innerHTML = `<div class="message ${type}">${text}</div>`;
        
        if (type === 'success') {
            setTimeout(() => {
                messageContainer.innerHTML = '';
            }, 5000);
        }
    }
}
