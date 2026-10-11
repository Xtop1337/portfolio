# Portfolio

Modern portfolio website built with a Fluent glassmorphism aesthetic, responsive layout, GitHub API integration, and a contact form connected to Google Forms.

## Features

- dynamic GitHub profile loading
- repository cards with descriptions and source links
- dark/light theme switch
- premium glass-effect design with smooth motion
- responsive layout for desktop and mobile
- contact section with Google Form integration

## Files

- `index.html` — page structure
- `styles.css` — premium responsive design and glassmorphism styling
- `script.js` — GitHub data fetch, theme toggle, and form behavior

## Local run

```bash
python -m http.server 8000
```

Then open:

```bash
http://localhost:8000
```

## GitHub data

The site loads public data using:

- `https://api.github.com/users/Xtop1337`
- `https://api.github.com/users/Xtop1337/repos?sort=updated&per_page=6`

## Contact form

The form opens a Google Form submission page so messages can be collected without a backend.

## Customization

Update the following values in the project to fit your profile:

- GitHub username in `script.js`
- email in `index.html`
- Google Form link in `index.html` and `script.js`
- project and stack descriptions in `index.html`

To deploy, you can use GitHub Pages, Netlify, or Vercel.
