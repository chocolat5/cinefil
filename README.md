<div align= "center">
<a href="https://github.com/chocolat5/cinefil" target="blank">
<img src="https://cinefil.me/images/logo.svg" width="90" alt="logo" />
</a>

<h2>cinefil.me</h2>

<!-- TODO: add image -->

</div>

"cinefil.me" is a web application that allows users to create a cinema profile page.  
A full-stack web application built with React, Astro, and Hono, and deployed on Cloudflare Pages/Workers

This project was developed as part of my personal learning in React development.
This is currently in **β**. All core features have been implemented and tested to ensure stable functionality.

> This repository shares the **application's architecture and codebase** for learning and portfolio purposes.

I always welcome and appreciate your feedback and suggestions!

## Demo

[**cinefil.me**](https://cinefil.me/)

## Features

- Custom authentication flow (magic link + JWT)
- Backend API built with Hono + Cloudflare Workers + D1 (SQL database)
- Integrated TMDB API for movie search with custom TypeScript interfaces
- Responsive UI for desktop and basic mobile layout
- SEO-optimized dynamic pages (Astro SSR + meta tags + OpenGraph)

## Getting Started

> For demonstration purpose only.
> This repository does not include production credentials or API keys.

frontend: http://localhost:4321/  
backend: http://localhost:8787

```bash
# clone the repository
git clone git@github.com:chocolat5/cinefil.git
cd cinefil

# install dependencies
npm install

# run frontend locally
npm run dev

# run backend locally
npx wrangler dev
```

You can create your own `.env` and `wrangler.toml`

## Roadmap

### high

- [ ] Implement user account deletion flow
- [ ] JWT authentication: in-memory + refresh token support (enhanced security)

### medium

- [ ] Integrate AI-powered movie search
- [ ] Add mobile support for drag-and-drop functionality
- [ ] Add profile sharing functionality (via various social networks)
- [ ] Allow background and text color customization (select from preset templates)

### low

- [ ] Add links to posters, directors, and actors
- [ ] Enable user data export
- [ ] Auto-generate sitemap.xml (SSR with Astro integration not supported)
- [ ] Multi-language support
- [ ] Allow renaming "FAVORITE MOVIES" section titles (e.g., BEST ~, ALL TIME BEST ~)
- [ ] Delete confirmation (movies, directors, actors)

## Development Process

The project was fully coded and designed by me.  
I used **Claude Code** ([@claude-code](https://github.com/anthropics/claude-code)) as a support tool for:

- requirement definition and roadmap creation
- code review and refactoring advice
- and guidance on backend best practices (as this was my first backend project)

> No code was directly generated or copied from AI without review.

## Feedback

If you find a bug or suggestion to improve the app, you can:

- Open an [issue](https://github.com/chocolat5/cinefil/issues) with the "bug" or "enhancement" tag
- Or reach out via [GitHub Discussions](https://github.com/chocolat5/cinefil/discussions)

Your feedback is appreciated.

## Author

[@chocolat5](https://github.com/chocolat5)

## License

[The MIT License](https://opensource.org/licenses/MIT).
