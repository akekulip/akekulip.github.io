/* Philip Akekudaga — portfolio interactions
   Theme toggle, mobile nav, scroll-spy, reveal-on-scroll, copy email. */

(function () {
  "use strict";

  var doc = document.documentElement;

  /* ---------- theme ---------- */

  function syncThemeColor() {
    var dark = doc.getAttribute("data-theme") === "dark";
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) {
      m.setAttribute("content", dark ? "#0c1210" : "#f4f7f5");
    });
  }

  function applyTheme(theme) {
    doc.setAttribute("data-theme", theme);
    syncThemeColor();
    try { localStorage.setItem("theme", theme); } catch (e) { /* private mode */ }
  }

  var stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) { /* private mode */ }
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  doc.setAttribute("data-theme", stored || (prefersDark ? "dark" : "light"));
  syncThemeColor();

  var toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = doc.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }

  /* ---------- mobile nav ---------- */

  var menuToggle = document.getElementById("menuToggle");
  var nav = document.getElementById("nav");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- scroll-spy ---------- */

  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll("a[href^='#']")) : [];
  var sections = navLinks
    .map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); })
    .filter(Boolean);

  function setCurrent(id) {
    navLinks.forEach(function (a) {
      if (a.getAttribute("href") === "#" + id) {
        a.setAttribute("aria-current", "true");
      } else {
        a.removeAttribute("aria-current");
      }
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setCurrent(entry.target.id);
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- copy email ---------- */

  var copyBtn = document.getElementById("copyEmail");
  if (copyBtn && navigator.clipboard) {
    copyBtn.addEventListener("click", function () {
      navigator.clipboard.writeText("akekulip@gmail.com").then(function () {
        copyBtn.textContent = "copied";
        copyBtn.classList.add("copied");
        setTimeout(function () {
          copyBtn.textContent = "copy";
          copyBtn.classList.remove("copied");
        }, 1600);
      });
    });
  }

  /* ---------- footer year ---------- */

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
