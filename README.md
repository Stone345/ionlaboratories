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


## Intro sculpture

The intro circle contains a scroll-controlled sculpture sequence from the user-supplied `vr_sculpture_disassembling_03309_Seedance_25.mp4`. It ends at full expansion, approximately five seconds into the source clip; the hold and closing portion are omitted. Continuing to scroll starts the existing ION transition. Scrolling backward reverses the sequence.

`assets/js/sculpture.js` renders 61 full-resolution 1440 × 1440 WebP frames. The sequence is connected to the opening GSAP timeline in `assets/js/main.js`. Reduced motion shows its initial still frame.
