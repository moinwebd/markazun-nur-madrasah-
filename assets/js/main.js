/* Markazun-Nur Madrasah — main.js
   Mobile navigation toggle, header shadow on scroll,
   FAQ accordion (one open at a time). No dependencies. */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var navMenu = document.querySelector(".nav-menu");

  /* Mobile menu */
  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      var icon = toggle.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-bars", !open);
        icon.classList.toggle("fa-xmark", open);
      }
    });
  }
  if (navMenu && header) {
    navMenu.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        header.classList.remove("nav-open");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* Header shadow on scroll (only when sticky header is in effect) */
  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* FAQ accordion: keep at most one answer open */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item && other.open) other.open = false;
      });
    });
  });
})();
