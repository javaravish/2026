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
// DYNAMIC HEADER & FOOTER LOADING
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
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');

    if (theme === 'dark') {
        document.documentElement.classList.add('dark-theme');
    }

    const navWidth = localStorage?.getItem('nav-width');
    if (navWidth) {
        document.documentElement.style.setProperty('--nav-width', `${navWidth}px`);
    }
}

// ======================
// NAVBAR BURGER TOGGLE
// ======================
function initNavbarBurgers() {
    "use strict";

    const setupBurger = (burger) => {
        burger.addEventListener("click", function (event) {
            event.stopPropagation();
            document.documentElement.classList.toggle("is-clipped--navbar");
            this.classList.toggle("is-active");

            const targetId = this.dataset.target || "topbar-nav";
            const target = document.getElementById(targetId);
            if (!target) return;

            if (target.classList.toggle("is-active")) {
                const targetHeight = window.innerHeight - Math.round(target.getBoundingClientRect().top);
                target.style.maxHeight = `${targetHeight}px`;
            } else {
                target.style.maxHeight = "";
            }
        });
    };

    const findBurgers = () => [
        document.querySelector(".navbar-burger"),
        document.querySelector("#nav-toggle-1")
    ].filter(Boolean);

    const burgers = findBurgers();
    burgers.forEach(setupBurger);

    if (burgers.length === 0) {
        const observer = new MutationObserver(() => {
            const newBurgers = findBurgers().filter(b => !burgers.includes(b));
            newBurgers.forEach(setupBurger);
            burgers.push(...newBurgers);
            if (burgers.length >= 2) observer.disconnect();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }
}

// ======================
// THEME TOGGLE
// ======================
function initThemeToggles() {
    "use strict";

    const getToggles = () => [
        document.getElementById("switch-theme-checkbox"),
        document.getElementById("switch-theme-mobile")
    ].filter(Boolean);

    const applyTheme = (isDark, toggles) => {
        document.documentElement.classList.toggle("dark-theme", isDark);
        document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
        localStorage.setItem("theme", isDark ? "dark" : "light");

        toggles.forEach(toggle => {
            toggle.checked = isDark;
            toggle.parentElement.classList.toggle("active", isDark);
        });
    };

    const setupToggles = (toggles) => {
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const theme = savedTheme || (prefersDark ? "dark" : "light");
        applyTheme(theme === "dark", toggles);

        toggles.forEach(toggle => {
            toggle.addEventListener("change", () => {
                applyTheme(toggle.checked, toggles);
            });
        });
    };

    let toggles = getToggles();
    if (toggles.length > 0) {
        setupToggles(toggles);
    } else {
        const observer = new MutationObserver(() => {
            toggles = getToggles();
            if (toggles.length > 0) {
                observer.disconnect();
                setupToggles(toggles);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }
}

// ======================
// SIDEBAR NAVIGATION
// ======================
function initSidebar() {
    "use strict";

    const navContainer = document.querySelector(".nav-container");
    const navToggle = document.querySelector("#nav-toggle-1");
    const menuPanel = navContainer?.querySelector("[data-panel=menu]");
    const navElement = navContainer?.querySelector(".nav");

    if (!navContainer || !navToggle || !menuPanel || !navElement) return;

    const sectionRegex = /^sect(\d)$/;
    let activeNavItem = null;
    const isSidebarOpen = localStorage?.getItem("sidebar") === "open";

    const deactivateAllItems = () => {
        document.querySelectorAll(".nav-item.is-active").forEach(item => {
            item.classList.remove("is-active", "is-current-path", "is-current-page");
        });
    };

    const activateNavPath = (item) => {
        let parent = item.parentNode;
        while (parent && !parent.classList.contains("nav-menu")) {
            if (parent.tagName === "LI" && parent.classList.contains("nav-item")) {
                parent.classList.add("is-active", "is-current-path");
            }
            parent = parent.parentNode;
        }
        item.classList.add("is-active");
    };

    const scrollToItem = (container, item) => {
        const containerRect = container.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(navElement);
        let containerHeight = containerRect.height;

        if (computedStyle.position === "sticky") {
            containerHeight -= containerRect.top - parseFloat(computedStyle.top);
        }

        container.scrollTop = Math.max(
            0,
            0.5 * (itemRect.height - containerHeight) + item.offsetTop
        );
    };

    const handleNavItemClick = function () {
        if (this.classList.toggle("is-active")) {
            const marginTop = parseFloat(window.getComputedStyle(this).marginTop);
            const itemRect = this.getBoundingClientRect();
            const menuRect = menuPanel.getBoundingClientRect();
            const scrollAmount = (itemRect.bottom - menuRect.top - menuRect.height + marginTop).toFixed();

            if (scrollAmount > 0) {
                menuPanel.scrollTop += Math.min(
                    (itemRect.top - menuRect.top - marginTop).toFixed(),
                    scrollAmount
                );
            }
        }
    };

    const initActiveItem = () => {
        let hash = decodeURIComponent(window.location.hash || '');
        let targetItem = menuPanel.querySelector(`.nav-link[href="${hash}"]`);

        if (!targetItem && hash) {
            const targetElement = document.getElementById(hash.slice(1));
            const article = document.querySelector("article.doc");
            let parent = targetElement;

            while (parent && parent !== article) {
                const id = parent.id || (sectionRegex.test(parent.className) ? parent.firstElementChild?.id : null);
                if (id && (targetItem = menuPanel.querySelector(`.nav-link[href="#${id}"]`))) {
                    break;
                }
                parent = parent.parentNode;
            }
        }

        const parentItem = targetItem?.parentNode;
        if (parentItem) {
            deactivateAllItems();
            parentItem.classList.add("is-current-page");
            activateNavPath(parentItem);
            scrollToItem(menuPanel, targetItem);
            activeNavItem = parentItem;
        } else if (activeNavItem) {
            deactivateAllItems();
            activateNavPath(activeNavItem);
            scrollToItem(menuPanel, activeNavItem.querySelector(".nav-link"));
        }
    };

    const openSidebar = (e) => {
        if (navToggle.classList.contains("is-active")) return closeSidebar(e);
        e.stopPropagation();
        document.documentElement.classList.add("is-clipped--nav");
        navToggle.classList.add("is-active");
        navContainer.classList.add("is-active");

        const navRect = navElement.getBoundingClientRect();
        navElement.style.height = `${window.innerHeight - Math.round(navRect.top)}px`;

        document.documentElement.addEventListener("click", closeSidebar);
    };

    const closeSidebar = (e) => {
        e?.stopPropagation();
        document.documentElement.classList.remove("is-clipped--nav");
        navToggle.classList.remove("is-active");
        navContainer.classList.remove("is-active");
        document.documentElement.removeEventListener("click", closeSidebar);
    };

    if (isSidebarOpen) {
        navToggle.classList.add("is-active");
        navContainer.classList.add("is-active");
    }

    navToggle.addEventListener("click", openSidebar);
    navContainer.addEventListener("click", e => e.stopPropagation());

    menuPanel.querySelectorAll(".nav-item-toggle").forEach(toggle => {
        const parent = toggle.parentElement;
        const navText = toggle.nextElementSibling?.matches?.(".nav-text") ? toggle.nextElementSibling : null;

        toggle.addEventListener("click", handleNavItemClick.bind(parent));
        if (navText) {
            navText.style.cursor = "pointer";
            navText.addEventListener("click", handleNavItemClick.bind(parent));
        }
    });

    document.querySelector("#browse-version")?.addEventListener("click", () => {
        MicroModal.show("modal-versions", { disableScroll: true });
    });

    document.querySelector("#nav-collapse-toggle")?.addEventListener("click", () => {
        const isOpen = document.body.classList.toggle("nav-sm");
        localStorage?.setItem("sidebar", isOpen ? "open" : "close");
    });

    if (menuPanel.querySelector('.nav-link[href^="#"]')) {
        if (window.location.hash) initActiveItem();
        window.addEventListener("hashchange", initActiveItem);
    }

    document.querySelector(".nav-resize")?.addEventListener("mousedown", () => {
        const resize = (e) => {
            const newWidth = Math.min(600, Math.max(250, e.x));
            document.documentElement.style.setProperty("--nav-width", `${newWidth}px`);
            localStorage?.setItem("nav-width", `${newWidth}`);
        };

        document.addEventListener("mousemove", resize);
        document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", resize);
        }, { once: true });
    });
}

// ======================
// INITIALIZATION
// ======================
document.addEventListener("DOMContentLoaded", () => {
    window.scrollTo(0, 0);
    loadHTML("header.html", "header");
    loadHTML("footer.html", "footer");
    applyUserPreferences();
    setupScrollToTop();
    initNavbarBurgers();
    initThemeToggles();

    if (document.querySelector("#nav-toggle-1")) {
        initSidebar();
    }

    if (typeof loadComponents === "function") {
        loadComponents();
    }
});
