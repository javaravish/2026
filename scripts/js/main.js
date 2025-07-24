// ======================
// SCROLL-TO-TOP FUNCTIONALITY
// ======================

function setupScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTopBtn') || document.getElementById('myBtn');
    if (!scrollBtn) return;

    window.addEventListener('scroll', () => {
        const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        scrollBtn.style.display = scrollTop > 20 ? 'block' : 'none';
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ======================
// DYNAMIC LOADING FUNCTION
// ======================

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
    window.scrollTo(0, 0);

    // Load from root
    loadHTML('header.html', 'header');
    loadHTML('footer.html', 'footer');

    // Load from /load/
    loadHTML('load/head.html', 'head');
    loadHTML('load/foot.html', 'foot');

    setupScrollToTop();
    applyUserPreferences();

    if (typeof loadComponents === 'function') {
        loadComponents();
    }
});
