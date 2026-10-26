/* ION Laboratories storyboard: wires each scene to the Motion primitives. */
(function () {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Always-on UI (no motion required) ---------- */

  // 96-well plate: rows A–H, columns 1–12. Column 1 holds standards, column 12 controls and blanks.
  var plate = $(".plate");
  if (plate) {
    var rows = "ABCDEFGH";
    for (var r = 0; r < 8; r++) {
      for (var c = 1; c <= 12; c++) {
        var w = document.createElement("i");
        if (c === 1) w.className = "std";
        else if (c === 12) w.className = r % 2 ? "" : "c";
        else if (c <= 10 || r < 5) w.className = "s";
        w.title = rows[r] + c;
        plate.appendChild(w);
      }
    }
  }

  // 9×9 freezer box: 58 filled positions, 3 of them flagged as expiring.
  var box = $(".box");
  if (box) {
    for (var b = 0; b < 81; b++) {
      var cell = document.createElement("i");
      if (b < 58) cell.className = (b === 9 || b === 31 || b === 47) ? "x" : "f";
      box.appendChild(cell);
    }
  }

  var header = $(".site-header");
  var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 24); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var toggle = $(".nav-toggle");
  var list = $("#nav-list");
  if (toggle && list) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      list.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", function () { setOpen(toggle.getAttribute("aria-expanded") !== "true"); });
    $$("a", list).forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { setOpen(false); } });
  }

  var form = $("#demo-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = $("#demo-email");
      var msg = $("#demo-msg");
      if (!email.value || !email.checkValidity()) {
        msg.textContent = "Enter a work email like name@yourlab.com so we can send a time.";
        email.focus();
        return;
      }
      msg.textContent = "Request received. We'll email " + email.value + " with demo times within one business day.";
      form.reset();
    });
  }

  /* ---------- Motion ---------- */

  if (!window.Motion || !Motion.enabled) return;

  var mm = gsap.matchMedia();

  mm.add({
    desktop: "(min-width: 761px) and (prefers-reduced-motion: no-preference)",
    mobile: "(max-width: 760px) and (prefers-reduced-motion: no-preference)"
  }, function (ctx) {
    var desktop = ctx.conditions.desktop;
    document.documentElement.classList.add("motion");

    /* A | Opening → typographic takeover → wordmark field */
    var open = $(".scene-open");
    Motion.pinned(open, desktop ? "+=200%" : "+=120%", function (tl) {
      tl.to(".hero-copy", { y: -140, opacity: 0, scale: .94, filter: "blur(6px)", duration: .35 }, 0)
        .to(".scroll-cue", { opacity: 0, duration: .1 }, 0)
        .to(".geo-letter", { scale: 2.1, xPercent: -30, yPercent: -8, duration: .55 }, 0)
        .to(".geo-circle", { scale: 2.6, xPercent: 30, yPercent: -20, duration: .55 }, 0)
        .to(".geo-semi", { scale: 2, yPercent: 30, duration: .55 }, 0)
        .to(".geo-rect", { rotate: 64, scale: 1.8, yPercent: 40, duration: .55 }, 0)
        .to(".geo-orbit", { scale: 1.8, opacity: 0, duration: .5 }, 0)
        .to(".geo-accent", { x: desktop ? -120 : -40, y: 80, scale: 2.4, duration: .5 }, 0)
        // the lighter field passes over the growing letterforms
        .fromTo(".open-field", { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: .4 }, .22)
        .fromTo(".field-wordmark", { scale: 1.9, yPercent: 40, opacity: .4 }, { scale: 1, yPercent: 0, opacity: 1, duration: .48, ease: "power2.out" }, .22)
        .fromTo(".fw-charge i", { scale: .3, opacity: 0 }, { scale: 1, opacity: 1, duration: .3 }, .5)
        .fromTo(".field-caption", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .15 }, .62)
        // sustained wordmark moment
        .to(".field-wordmark", { scale: 1.06, duration: .3 }, .7)
        .to(".fw-charge i", { scale: 1.35, duration: .3 }, .7);
    });

    /* B | Wordmark field → red editorial tile + dark media tile */
    $$(".scene-tiles [data-clip]").forEach(function (tile) { Motion.clipReveal(tile, { start: "top 100%", end: "top 35%" }); });
    Motion.parallax($(".tile-red"), desktop ? .5 : .2, { trigger: ".scene-tiles" });
    Motion.parallax($(".tile-media"), desktop ? 1.1 : .3, { trigger: ".scene-tiles" });
    gsap.fromTo(".media-inner", { scale: 1.25 }, {
      scale: 1, ease: "none",
      scrollTrigger: { trigger: ".tile-media", start: "top bottom", end: "center center", scrub: true }
    });
    Motion.stagger($$(".tile-serif span"), { y: 90, each: .1, trigger: ".tile-red", start: "top 85%", end: "top 25%" });
    var line = $(".spec-line");
    if (line) {
      var len = 2600;
      gsap.fromTo(line, { strokeDasharray: len, strokeDashoffset: len }, {
        strokeDashoffset: 0, ease: "none",
        scrollTrigger: { trigger: ".tile-media", start: "top 80%", end: "center 40%", scrub: true }
      });
      gsap.fromTo([".spec-area", ".peak"], { opacity: 0 }, {
        opacity: 1, ease: "none", stagger: .1,
        scrollTrigger: { trigger: ".tile-media", start: "top 40%", end: "center 30%", scrub: true }
      });
    }

    /* C | Black interstitial: a deliberate pause, marked by one growing line */
    gsap.fromTo(".gap-line span", { scaleY: 0 }, {
      scaleY: 1, ease: "none",
      scrollTrigger: { trigger: ".scene-gap", start: "top 70%", end: "bottom 40%", scrub: true }
    });

    /* D | Services constellation */
    var words = $$(".const-words li");
    if (desktop) {
      Motion.pinned($(".scene-constellation"), "+=170%", function (tl) {
        tl.fromTo(".orb", { xPercent: -40, scale: .5, opacity: 0 }, { xPercent: 0, scale: 1, opacity: 1, duration: .45 }, 0);
        words.forEach(function (w, i) {
          var d = parseFloat(w.style.getPropertyValue("--d")) || 1;
          var dir = i % 2 ? 1 : -1;
          tl.fromTo(w,
            { opacity: 0, y: 220 * d, x: dir * 90 * d, scale: .75 + .1 * d, filter: "blur(8px)" },
            { opacity: w.classList.contains("w-sm") ? .82 : 1, y: 0, x: 0, scale: 1, filter: "blur(0px)", duration: .32 },
            .06 + ((i * 37) % 8) * .055);
          // keep drifting at depth-dependent speeds after landing
          tl.to(w, { y: -60 * d, x: -dir * 16 * d, duration: .4 }, .62);
        });
        tl.fromTo(".const-statement", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: .22 }, .5)
          .to(".orb", { yPercent: -18, scale: 1.12, duration: .4 }, .62);
      });
    } else {
      gsap.fromTo(".orb", { xPercent: -30, opacity: 0 }, {
        xPercent: 0, opacity: 1, ease: "none",
        scrollTrigger: { trigger: ".scene-constellation", start: "top 80%", end: "top 20%", scrub: true }
      });
      Motion.stagger(words, { y: 50, each: .1, trigger: ".const-words", start: "top 90%", end: "bottom 60%" });
      Motion.reveal($(".const-statement"), { y: 30, start: "top 95%", end: "top 70%" });
    }

    /* About statement: words light up with scroll progress */
    var statement = $(".statement");
    var sw = Motion.splitWords(statement);
    gsap.fromTo(sw, { color: "#2a2a31" }, {
      color: function (i, el) { return el.closest("mark") ? "#ff2e63" : "#f5f5f7"; },
      ease: "none", stagger: .04,
      scrollTrigger: { trigger: statement, start: "top 80%", end: "bottom 45%", scrub: true }
    });
    $$(".keyword-stack span").forEach(function (k, i) {
      gsap.fromTo(k, { y: 40 + i * 14, opacity: 0 }, {
        y: 0, opacity: 1, ease: "none",
        scrollTrigger: { trigger: ".keyword-stack", start: "top 95%", end: "top 55%", scrub: true }
      });
    });

    /* Hub: palette flips to light, title builds letter by letter, mosaic drifts */
    var chars = Motion.splitChars($(".hub-title"));
    gsap.fromTo(chars, { yPercent: 110, opacity: 0 }, {
      yPercent: 0, opacity: 1, ease: "none", stagger: .06,
      scrollTrigger: { trigger: ".hub-head", start: "top 90%", end: "top 40%", scrub: .6 }
    });
    $$(".shot").forEach(function (s, i) {
      Motion.reveal(s, { y: 100, start: "top 100%", end: "top 65%" });
      if (desktop) Motion.parallax(s.querySelector(".ui"), [.15, .35, .25, .45, .2][i % 5]);
    });

    /* Capabilities */
    Motion.stagger($$(".ct"), { y: 60, rotate: -6, scale: .85, each: .08, trigger: ".caps", start: "top 85%", end: "top 35%" });
    Motion.stagger($$(".cp"), { y: 90, each: .1, trigger: ".caps", start: "top 80%", end: "top 25%" });

    /* Credibility: cards rise through perspective at different depths */
    $$(".card").forEach(function (card) {
      var d = parseFloat(card.style.getPropertyValue("--depth")) || 1;
      gsap.fromTo(card,
        { y: (desktop ? 220 : 60) * d, rotateX: desktop ? 28 : 0, opacity: 0 },
        {
          y: desktop ? -50 * d : 0, rotateX: 0, opacity: 1, ease: "none",
          scrollTrigger: { trigger: ".cards", start: "top 100%", end: "bottom 50%", scrub: true }
        });
    });
    Motion.reveal($(".cred-head"), { y: 40, start: "top 90%", end: "top 55%" });

    /* CTA + footer */
    Motion.reveal($(".cta-title"), { y: 80, start: "top 95%", end: "top 55%" });
    Motion.parallax($(".foot-mark"), .3, { trigger: ".site-footer" });

    return function () { document.documentElement.classList.remove("motion"); };
  });

  // Fonts change line lengths; recompute trigger positions once they are in.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
})();
