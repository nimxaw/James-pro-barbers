# James Pro — Barbershop Website

A modern, single-page marketing website for **James Pro**, a premium men's barbershop in Dubai.

## Features
- **Bold display typography** using custom Google Fonts (Anton, Bricolage Grotesque, Space Grotesk) — no default system fonts.
- **Bright, youthful palette** — light cream base with an energetic coral-red and electric-lime accent.
- **Scroll-driven motion** — reveal-on-scroll, parallax hero & images, animated count-up stats, scroll progress bar, infinite marquee, and a snap-scrolling testimonial rail.
- **Interactive effects** — custom blend-mode cursor, animated preloader, hover transitions on services/gallery/team, and a working booking form (front-end only).
- **Fully responsive** with a mobile slide-in menu and reduced-motion support.

## Sections
Hero · Marquee · About + stats · Services · Pricing · Gallery · Barbers · Testimonials · Booking · Contact / Footer

## Run locally
Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Files
- `index.html` — markup & content
- `styles.css` — design system, layout, animations
- `script.js` — preloader, cursor, scroll motion, counters, form

## Images
Each `<img>` uses a resilient fallback chain so a photo can never appear broken:

1. **Unsplash** (`images.unsplash.com`) — primary, real barbershop photography.
2. **LoremFlickr** (`loremflickr.com`) — topical real photo if the primary fails.
3. **Local SVG** (`assets/*.svg`) — bundled on-brand graphic if both remote sources fail or the network is offline.

The chain is wired via `data-flickr` / `data-svg` attributes on each image and handled in `script.js` (with a 7s watchdog for slow networks).

**To use your own photos:** either replace the files in `assets/` (keeping the same names) or change each image's `src` in `index.html` to your real studio photo URLs.
