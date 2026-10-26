/* Reusable scroll-motion primitives built on GSAP ScrollTrigger.
   Every tween is tied to scroll progress (scrub), so scenes reverse cleanly
   when the reader scrolls back up. */
(function () {
  "use strict";

  var hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  var SCRUB = 0.6;

  // Wrap each word of an element in a span, keeping inline children (mark, em) intact.
  function splitWords(el) {
    if (el.dataset.split === "done") return el.querySelectorAll(".w");
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var span = document.createElement("span");
            span.className = "w";
            span.textContent = part;
            frag.appendChild(span);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    };
    walk(el);
    el.dataset.split = "done";
    return el.querySelectorAll(".w");
  }

  // Wrap each character in a span, grouped by word so lines only break between words.
  // The full text stays available to screen readers.
  function splitChars(el) {
    if (el.dataset.split === "done") return el.querySelectorAll(".ch");
    var text = el.textContent.trim();
    el.setAttribute("aria-label", text);
    el.textContent = "";
    text.split(/\s+/).forEach(function (word, i) {
      if (i) el.appendChild(document.createTextNode(" "));
      var wd = document.createElement("span");
      wd.className = "wd";
      wd.setAttribute("aria-hidden", "true");
      Array.prototype.forEach.call(word, function (c) {
        var span = document.createElement("span");
        span.className = "ch";
        span.textContent = c;
        wd.appendChild(span);
      });
      el.appendChild(wd);
    });
    el.dataset.split = "done";
    return el.querySelectorAll(".ch");
  }

  // Element enters from an offset as its top crosses the lower part of the viewport.
  function reveal(el, opts) {
    opts = opts || {};
    return gsap.fromTo(el,
      { y: opts.y == null ? 60 : opts.y, x: opts.x || 0, opacity: opts.opacity == null ? 0 : opts.opacity, scale: opts.scale || 1 },
      {
        y: 0, x: 0, opacity: 1, scale: 1, ease: "none",
        scrollTrigger: { trigger: opts.trigger || el, start: opts.start || "top 92%", end: opts.end || "top 60%", scrub: SCRUB }
      });
  }

  // A group of elements revealed one after another across the same scroll range.
  function stagger(els, opts) {
    opts = opts || {};
    return gsap.fromTo(els,
      { y: opts.y == null ? 80 : opts.y, opacity: 0, rotate: opts.rotate || 0, scale: opts.scale || 1 },
      {
        y: 0, opacity: 1, rotate: 0, scale: 1, ease: "none", stagger: opts.each || 0.12,
        scrollTrigger: { trigger: opts.trigger || els[0], start: opts.start || "top 88%", end: opts.end || "top 35%", scrub: SCRUB }
      });
  }

  // Move an element against the scroll direction at a given speed (1 = 100px over its pass).
  function parallax(el, speed, opts) {
    opts = opts || {};
    var dist = 100 * speed;
    return gsap.fromTo(el, { y: dist }, {
      y: -dist, ease: "none",
      scrollTrigger: { trigger: opts.trigger || el, start: "top bottom", end: "bottom top", scrub: true }
    });
  }

  // Clip-path mask that opens from the bottom edge.
  function clipReveal(el, opts) {
    opts = opts || {};
    return gsap.fromTo(el,
      { clipPath: "inset(100% 0% 0% 0%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)", ease: "none",
        scrollTrigger: { trigger: opts.trigger || el, start: opts.start || "top 95%", end: opts.end || "top 45%", scrub: SCRUB }
      });
  }

  // Pin a section and drive a timeline with scroll progress across `length` (e.g. "+=150%").
  function pinned(section, length, build) {
    var tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: section, start: "top top", end: length, scrub: SCRUB,
        pin: true, anticipatePin: 1, invalidateOnRefresh: true
      }
    });
    build(tl);
    return tl;
  }

  window.Motion = {
    enabled: hasGsap,
    splitWords: splitWords,
    splitChars: splitChars,
    reveal: reveal,
    stagger: stagger,
    parallax: parallax,
    clipReveal: clipReveal,
    pinned: pinned
  };
})();
