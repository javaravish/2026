// Scroll to top on page load
window.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);
});

// Scroll to top button functionality
let mybutton;

window.addEventListener("load", () => {
    mybutton = document.getElementById("myBtn");

    window.onscroll = function () {
        scrollFunction();
    };

    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            mybutton.style.display = "block";
        } else {
            mybutton.style.display = "none";
        }
    }

    // Assign topFunction to button (if needed)
    if (mybutton) {
        mybutton.addEventListener("click", topFunction);
    }
});

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

// Load header and footer
window.addEventListener("DOMContentLoaded", () => {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
        });

    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        });
});

(function (theme, navWidth) {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark-theme');
    }
    if (navWidth) {
        document.documentElement.style.setProperty('--nav-width', `${navWidth}px`);
    }
})(
    (localStorage && localStorage.getItem('theme')) ||
    (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches && 'dark'),
    localStorage && localStorage.getItem('nav-width')
);
