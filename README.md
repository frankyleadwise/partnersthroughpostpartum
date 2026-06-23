# Partners Through Postpartum™

Static marketing site (Home · Guide · Inquiries) for Partners Through Postpartum™ —
an evidence-based relationship education program for the transition to parenthood.

## Stack
- Hand-built static HTML/CSS/JS (no framework). Hosted on GitHub Pages.
- Fonts: Bodoni Moda (display) + Plus Jakarta Sans (UI), via Google Fonts.
- Inquiry form: FormSubmit AJAX → taylerbungocolon@gmail.com (honeypot + timing guard + validation).

## Files
- `index.html` · `guide.html` · `inquiries.html` — pages
- `styles.css` — design system · `main.js` — interactions
- `assets/` — favicon, OG cover, image placeholders

## Swapping in real photos
- Hero (home): replace `assets/hero-placeholder.svg` reference in `index.html` (search `SWAP:`).
- Headshot (inquiries): replace `assets/headshot-placeholder.svg` reference in `inquiries.html` (search `SWAP:`).

## Adding Guide sections
In `guide.html`, duplicate one `<article class="gcard">` block (see `ADD SECTIONS 09+ HERE`),
then swap the icon, number, title, and description.

## Custom domain
DNS not cut over yet — site lives at the github.io URL until ready. To go live on
partnersthroughpostpartum.com, point DNS to GitHub Pages and add a `CNAME` file, then enable HTTPS.
