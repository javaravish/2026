// ======================
// SCROLL-TO-TOP FUNCTIONALITY
// ======================

function setupScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTopBtn') || document.getElementById('myBtn');

    if (!scrollBtn) return;

    // Show/hide the scroll button on scroll
    window.addEventListener('scroll', () => {
        const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        scrollBtn.style.display = scrollTop > 20 ? 'block' : 'none';
    });

    // Scroll to top on click
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ======================
// DYNAMIC HEADER & FOOTER LOADING
// ======================

/**
 * Loads an external HTML file into a target container.
 * @param {string} filePath - The path to the HTML file.
 * @param {string} targetId - The ID of the container element.
 */
function loadHTML(filePath, targetId) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to load ${filePath}`);
            return response.text();
        })
        .then(html => {
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.innerHTML = html;
                if (targetId === 'footer') updateYear();
            }
        })
        .catch(error => console.error(`Error loading ${filePath}:`, error));
}

// Update footer year
function updateYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ======================
// THEME & LAYOUT SETTINGS
// ======================

function applyUserPreferences() {
    const savedTheme = localStorage?.getItem('theme');
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : null);

    if (theme === 'dark') {
        document.documentElement.classList.add('dark-theme');
    }

    const navWidth = localStorage?.getItem('nav-width');
    if (navWidth) {
        document.documentElement.style.setProperty('--nav-width', `${navWidth}px`);
    }
}

// ======================
// INITIALIZATION
// ======================

document.addEventListener('DOMContentLoaded', () => {
    // Scroll to top on initial load
    window.scrollTo(0, 0);

    // Load reusable components
    loadHTML('header.html', 'header');
    loadHTML('footer.html', 'footer');

    // Initialize scroll-to-top button
    setupScrollToTop();

    // Apply user preferences
    applyUserPreferences();

    // Load additional dynamic components if function is defined
    if (typeof loadComponents === 'function') {
        loadComponents();
    }
});
