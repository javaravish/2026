! function() {
    "use strict";
    var t = document.querySelector(".navbar-burger");
    t && t.addEventListener("click", function(t) {
        t.stopPropagation(), document.documentElement.classList.toggle("is-clipped--navbar"), this.classList.toggle("is-active");
        t = document.getElementById(this.dataset.target);
        {
            var e;
            t.classList.toggle("is-active") && (t.style.maxHeight = "", e = window.innerHeight - Math.round(t.getBoundingClientRect().top), parseInt(window.getComputedStyle(t).maxHeight, 10) !== e) && (t.style.maxHeight = e + "px")
        }
    }.bind(t))
}();

! function () {
  "use strict";
  var e = document.getElementById("switch-theme-checkbox");
  if (!e) return;

  // ✅ Load saved theme from localStorage on page load
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark-theme");
    document.documentElement.setAttribute("data-theme", "dark");
    e.checked = true;
    e.parentElement.classList.add("active");
  } else {
    document.documentElement.classList.remove("dark-theme");
    document.documentElement.setAttribute("data-theme", "light");
    e.checked = false;
    e.parentElement.classList.remove("active");
  }

  // ✅ Add listener for toggle change
  e.addEventListener("change", function () {
    document.documentElement.classList.toggle("dark-theme", this.checked);
    document.documentElement.setAttribute("data-theme", this.checked ? "dark" : "light");

    // Save to localStorage
    localStorage.setItem("theme", this.checked ? "dark" : "light");

    // Update class
    this.checked
      ? this.parentElement.classList.add("active")
      : this.parentElement.classList.remove("active");
  });
}();


! function () {
  "use strict";
  var e = document.getElementById("switch-theme-mobile");
  if (!e) return;

  // ✅ Load saved theme from localStorage on page load
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark-theme");
    document.documentElement.setAttribute("data-theme", "dark");
    e.checked = true;
    e.parentElement.classList.add("active");
  } else {
    document.documentElement.classList.remove("dark-theme");
    document.documentElement.setAttribute("data-theme", "light");
    e.checked = false;
    e.parentElement.classList.remove("active");
  }

  // ✅ Add listener for toggle change
  e.addEventListener("change", function () {
    document.documentElement.classList.toggle("dark-theme", this.checked);
    document.documentElement.setAttribute("data-theme", this.checked ? "dark" : "light");

    // Save to localStorage
    localStorage.setItem("theme", this.checked ? "dark" : "light");

    // Update class
    this.checked
      ? this.parentElement.classList.add("active")
      : this.parentElement.classList.remove("active");
  });
}();


! function() {
    "use strict";
    var a, c, s, r = /^sect(\d)$/,
        i = document.querySelector(".nav-container"),
        o = document.querySelector("#nav-toggle-1"),
        e = window.localStorage && "open" === window.localStorage.getItem("sidebar"),
        d = (o.addEventListener("click", v), i.addEventListener("click", g), i.querySelector("[data-panel=menu]"));

    function t() {
        var e, t, n = window.location.hash;
        if (n && (n.indexOf("%") && (n = decodeURIComponent(n)), !(e = d.querySelector('.nav-link[href="' + n + '"]')))) {
            n = document.getElementById(n.slice(1));
            if (n)
                for (var i = n, o = document.querySelector("article.doc");
                    (i = i.parentNode) && i !== o;) {
                    var a = i.id;
                    if ((a = a || (a = r.test(i.className)) && (i.firstElementChild || {}).id) && (e = d.querySelector('.nav-link[href="#' + a + '"]'))) break
                }
        }
        if (e) t = e.parentNode;
        else {
            if (!s) return;
            e = (t = s).querySelector(".nav-link")
        }
        t !== c && (h(d, ".nav-item.is-active").forEach(function(e) {
            e.classList.remove("is-active", "is-current-path", "is-current-page")
        }), t.classList.add("is-current-page"), u(c = t), p(d, e))
    }

    function u(e) {
        for (var t, n = e.parentNode; !(t = n.classList).contains("nav-menu");) "LI" === n.tagName && t.contains("nav-item") && t.add("is-active", "is-current-path"), n = n.parentNode;
        e.classList.add("is-active")
    }

    function n() {
        var e, t, n, i;
        this.classList.toggle("is-active") && (e = parseFloat(window.getComputedStyle(this).marginTop), t = this.getBoundingClientRect(), n = d.getBoundingClientRect(), 0 < (i = (t.bottom - n.top - n.height + e).toFixed())) && (d.scrollTop += Math.min((t.top - n.top - e).toFixed(), i))
    }

    function v(e) {
        if (o.classList.contains("is-active")) return m(e);
        g(e);
        var e = document.documentElement,
            t = (e.classList.add("is-clipped--nav"), o.classList.add("is-active"), i.classList.add("is-active"), a.getBoundingClientRect()),
            n = window.innerHeight - Math.round(t.top);
        Math.round(t.height) !== n && (a.style.height = n + "px"), e.addEventListener("click", m)
    }

    function m(e) {
        g(e);
        e = document.documentElement;
        e.classList.remove("is-clipped--nav"), o.classList.remove("is-active"), i.classList.remove("is-active"), e.removeEventListener("click", m)
    }

    function g(e) {
        e.stopPropagation()
    }

    function p(e, t) {
        var n = e.getBoundingClientRect(),
            i = n.height,
            o = window.getComputedStyle(a);
        "sticky" === o.position && (i -= n.top - parseFloat(o.top)), e.scrollTop = Math.max(0, .5 * (t.getBoundingClientRect().height - i) + t.offsetTop)
    }

    function h(e, t) {
        return [].slice.call(e.querySelectorAll(t))
    }

    function f(e) {
        var e = Math.max(250, e.x),
            e = Math.min(600, e);
        e = e, document.documentElement.style.setProperty("--nav-width", e + "px"), window.localStorage && window.localStorage.setItem("nav-width", "" + e)
    }
    d && (a = i.querySelector(".nav"), c = d.querySelector(".is-current-page"), (s = c) ? (u(c), p(d, c.querySelector(".nav-link"))) : d.scrollTop = 0, h(d, ".nav-item-toggle").forEach(function(e) {
        var t = e.parentElement,
            e = (e.addEventListener("click", n.bind(t)), function(e, t) {
                e = e.nextElementSibling;
                return (!e || !t || e[e.matches ? "matches" : "msMatchesSelector"](t)) && e
            }(e, ".nav-text"));
        e && (e.style.cursor = "pointer", e.addEventListener("click", n.bind(t)))
    }), document.querySelector("#browse-version").addEventListener("click", function() {
        MicroModal.show("modal-versions", {
            disableScroll: !0
        })
    }), document.querySelector("#nav-collapse-toggle").addEventListener("click", function() {
        e ? document.body.classList.add("nav-sm") : document.body.classList.remove("nav-sm"), window.localStorage && window.localStorage.setItem("sidebar", e ? "close" : "open"), e = !e
    }), d.querySelector('.nav-link[href^="#"]') && (window.location.hash && t(), window.addEventListener("hashchange", t)), document.querySelector(".nav-resize").addEventListener("mousedown", e => {
        document.addEventListener("mousemove", f, !1), document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", f, !1)
        }, !1)
    }))
}();
