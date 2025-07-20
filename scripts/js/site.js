// ======================
// NAVBAR BURGER TOGGLE
// ======================
(function() {
    "use strict";
    const burger = document.querySelector(".navbar-burger");
    if (!burger) return;

    burger.addEventListener("click", function(event) {
        event.stopPropagation();
        document.documentElement.classList.toggle("is-clipped--navbar");
        this.classList.toggle("is-active");

        const target = document.getElementById(this.dataset.target);
        if (!target) return;

        if (target.classList.toggle("is-active")) {
            target.style.maxHeight = "";
            const targetHeight = window.innerHeight - Math.round(target.getBoundingClientRect().top);
            const computedHeight = parseInt(window.getComputedStyle(target).maxHeight, 10);

            if (computedHeight !== targetHeight) {
                target.style.maxHeight = `${targetHeight}px`;
            }
        }
    });
})();

// ======================
// THEME TOGGLE (DESKTOP & MOBILE) - Modified version
// ======================
function initThemeToggles() {
    "use strict";

    // Try to get toggles immediately
    let themeToggles = [
        document.getElementById("switch-theme-checkbox"),
        document.getElementById("switch-theme-mobile")
    ].filter(Boolean);

    // If not found, wait for header to load
    if (themeToggles.length === 0) {
        const observer = new MutationObserver(() => {
            themeToggles = [
                document.getElementById("switch-theme-checkbox"),
                document.getElementById("switch-theme-mobile")
            ].filter(Boolean);

            if (themeToggles.length > 0) {
                observer.disconnect();
                setupThemeToggles(themeToggles);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        return;
    }

    setupThemeToggles(themeToggles);
}

function setupThemeToggles(themeToggles) {
    const applyTheme = (isDark) => {
        document.documentElement.classList.toggle("dark-theme", isDark);
        document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
        localStorage.setItem("theme", isDark ? "dark" : "light");

        themeToggles.forEach(toggle => {
            toggle.checked = isDark;
            toggle.parentElement.classList.toggle("active", isDark);
        });
    };

    // Initialize theme
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");
    applyTheme(initialTheme === "dark");

    // Add event listeners
    themeToggles.forEach(toggle => {
        toggle.addEventListener("change", function() {
            applyTheme(this.checked);
        });
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggles();
});

// ======================
// SIDEBAR NAVIGATION
// ======================
(function initSidebar() {
    "use strict";
    const navContainer = document.querySelector(".nav-container");
    const navToggle = document.querySelector("#nav-toggle-1");
    const menuPanel = navContainer?.querySelector("[data-panel=menu]");
    const navElement = navContainer?.querySelector(".nav");

    if (!navContainer || !navToggle || !menuPanel || !navElement) return;

    // State variables
    let activeNavItem = null;
    const sectionRegex = /^sect(\d)$/;
    const isSidebarOpen = localStorage?.getItem("sidebar") === "open";

    // Helper functions
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

    const handleNavItemClick = function() {
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

    // Initialize active navigation item
    const initActiveItem = () => {
        let hash = window.location.hash;
        if (hash && hash.includes("%")) {
            hash = decodeURIComponent(hash);
        }

        let targetItem = menuPanel.querySelector(`.nav-link[href="${hash}"]`);
        if (!targetItem && hash) {
            const targetElement = document.getElementById(hash.slice(1));
            if (targetElement) {
                let parent = targetElement;
                const article = document.querySelector("article.doc");

                while ((parent = parent.parentNode) && parent !== article) {
                    const id = parent.id ||
                        (sectionRegex.test(parent.className) ? (parent.firstElementChild || {}).id : null);

                    if (id && (targetItem = menuPanel.querySelector(`.nav-link[href="#${id}"]`))) {
                        break;
                    }
                }
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

    // Sidebar toggle functions
    const openSidebar = (event) => {
        if (navToggle.classList.contains("is-active")) return closeSidebar(event);

        event.stopPropagation();
        document.documentElement.classList.add("is-clipped--nav");
        navToggle.classList.add("is-active");
        navContainer.classList.add("is-active");

        const navRect = navElement.getBoundingClientRect();
        const newHeight = window.innerHeight - Math.round(navRect.top);

        if (Math.round(navRect.height) !== newHeight) {
            navElement.style.height = `${newHeight}px`;
        }

        document.documentElement.addEventListener("click", closeSidebar);
    };

    const closeSidebar = (event) => {
        event?.stopPropagation();
        document.documentElement.classList.remove("is-clipped--nav");
        navToggle.classList.remove("is-active");
        navContainer.classList.remove("is-active");
        document.documentElement.removeEventListener("click", closeSidebar);
    };

    // Initialize sidebar state
    if (isSidebarOpen) {
        navToggle.classList.add("is-active");
        navContainer.classList.add("is-active");
    }

    // Set up event listeners
    navToggle.addEventListener("click", openSidebar);
    navContainer.addEventListener("click", (e) => e.stopPropagation());

    // Initialize navigation items
    menuPanel.querySelectorAll(".nav-item-toggle").forEach(toggle => {
        const parent = toggle.parentElement;
        const navText = toggle.nextElementSibling?.matches?.(".nav-text")
            ? toggle.nextElementSibling
            : null;

        toggle.addEventListener("click", handleNavItemClick.bind(parent));
        if (navText) {
            navText.style.cursor = "pointer";
            navText.addEventListener("click", handleNavItemClick.bind(parent));
        }
    });

    // Version modal
    document.querySelector("#browse-version")?.addEventListener("click", () => {
        MicroModal.show("modal-versions", { disableScroll: true });
    });

    // Collapse toggle
    document.querySelector("#nav-collapse-toggle")?.addEventListener("click", function() {
        document.body.classList.toggle("nav-sm", !isSidebarOpen);
        localStorage?.setItem("sidebar", isSidebarOpen ? "close" : "open");
    });

    // Hash-based navigation
    if (menuPanel.querySelector('.nav-link[href^="#"]')) {
        window.location.hash && initActiveItem();
        window.addEventListener("hashchange", initActiveItem);
    }

    // Resizable sidebar
    document.querySelector(".nav-resize")?.addEventListener("mousedown", () => {
        const handleResize = (e) => {
            const newWidth = Math.min(600, Math.max(250, e.x));
            document.documentElement.style.setProperty("--nav-width", `${newWidth}px`);
            localStorage?.setItem("nav-width", String(newWidth));
        };

        document.addEventListener("mousemove", handleResize);
        document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", handleResize);
        }, { once: true });
    });
})();
