# ionlaboratories.com

Marketing site for ION Laboratories, a lab operations platform (LIMS, sample tracking, instrument data, QC and compliance).

Static site: plain HTML, CSS and JavaScript. No build step.

## Run locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Structure

- `index.html`: every section of the page, in scroll order
- `assets/css/styles.css`: design tokens and section styles
- `assets/js/motion.js`: reusable scroll primitives (reveal, stagger, parallax, clip reveal, pinned scene, word and character split)
- `assets/js/main.js`: the storyboard that wires each scene to those primitives
- `assets/vendor/`: GSAP 3.12.5 and ScrollTrigger

## Motion

Animations are driven by scroll progress (GSAP ScrollTrigger with scrub), so they reverse when you scroll back up. Pinned scenes run only on screens wider than 760px. With `prefers-reduced-motion: reduce`, no animation runs and every section shows in a plain linear order.
