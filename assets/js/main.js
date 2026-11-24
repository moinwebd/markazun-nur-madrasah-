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

  /* Scroll reveal: fade elements up as they enter the viewport.
     The hidden state applies only when JS runs (html.js, added below),
     so if JS is disabled or fails, everything stays visible. */
  document.documentElement.classList.add("js");

  var REVEAL_SELECTORS = [
    ".section-head",
    ".card",
    ".notice-item",
    ".gallery-item",
    ".info-item",
    ".branch",
    ".step",
    ".objective-list li",
    ".faq-item",
    ".level-head",
    ".table-wrap",
    ".note-box",
    ".contact-card",
    ".cta-band .container",
    ".pathway-badge"
  ];

  var revealEls = [];
  REVEAL_SELECTORS.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) {
      if (el.closest(".hero")) return; // hero has its own entrance animation
      revealEls.push(el);
    });
  });

  // Stagger siblings: small delay per position within the same parent.
  var seenParents = new Map();
  revealEls.forEach(function (el) {
    var parent = el.parentElement;
    var n = seenParents.get(parent) || 0;
    el.style.transitionDelay = Math.min(n * 80, 320) + "ms";
    seenParents.set(parent, n + 1);
    el.classList.add("reveal");
  });

  function revealAll() {
    revealEls.forEach(function (el) { el.classList.add("revealed"); });
  }

  if (!("IntersectionObserver" in window)) {
    revealAll();
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -48px 0px" });
    revealEls.forEach(function (el) { observer.observe(el); });
    // Scroll fallback (throttled): reveal in-view items directly, so the
    // effect never depends on observer timing alone.
    var ticking = false;
    function checkReveals() {
      ticking = false;
      revealEls.forEach(function (el) {
        if (el.classList.contains("revealed")) return;
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight - 48 && r.bottom > 0) el.classList.add("revealed");
      });
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(checkReveals); }
    }, { passive: true });
    // Safety net: reveal anything already in view after 2.5s.
    setTimeout(function () {
      revealEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("revealed");
      });
    }, 2500);
  }
})();
