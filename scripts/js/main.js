// ======================
// SCROLL-TO-TOP FUNCTIONALITY
// ======================

// Scroll to top on initial page load
window.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);
});

// Initialize scroll-to-top button
let scrollToTopBtn;

window.addEventListener('load', () => {
    scrollToTopBtn = document.getElementById('scrollToTopBtn');

    // Show/hide button based on scroll position
    window.onscroll = function() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    };

    // Attach click handler if button exists
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', scrollToTop);
    }
});

// Smooth scroll to top
function scrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, etc.
}

// ======================
// DYNAMIC HEADER & FOOTER LOADING
// ======================

/**
 * Loads an HTML file into a target element.
 * @param {string} filePath - Path to the HTML file (e.g., 'header.html').
 * @param {string} targetId - ID of the element where content will be inserted.
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
                if (targetId === 'footer') updateYear(); // Update year after footer loads
            }
        })
        .catch(error => console.error(`Error loading ${filePath}:`, error));
}

// Update the copyright year in the footer
function updateYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ======================
// THEME & LAYOUT SETTINGS
// ======================

// Apply saved theme (dark/light) and navigation width
(function applyUserPreferences() {
    // Get saved theme or fall back to system preference
    const savedTheme = localStorage?.getItem('theme');
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : null);

    // Apply theme if dark mode is enabled
    if (theme === 'dark') {
        document.documentElement.classList.add('dark-theme');
    }

    // Apply saved navigation width
    const navWidth = localStorage?.getItem('nav-width');
    if (navWidth) {
        document.documentElement.style.setProperty('--nav-width', `${navWidth}px`);
    }
})();

// ======================
// INITIALIZATION
// ======================

// Load all dynamic content when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loadHTML('header.html', 'header');
    loadHTML('footer.html', 'footer');
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  loadComponents();
  window.scrollTo(0, 0);
});

// Back to top button functionality
function setupScrollTop() {
  const mybutton = document.getElementById("myBtn");

  window.onscroll = function() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      mybutton.style.display = "block";
    } else {
      mybutton.style.display = "none";
    }
  };

  window.topFunction = function() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };
}

document.addEventListener('DOMContentLoaded', setupScrollTop);