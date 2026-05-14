# Carnival Calendar Planner

A quick visual calendar tool to plan my year — which dates I want to be where, which carnivals overlap, and when I'm free. The entire state lives in the URL, so I can bookmark a plan or share the link with friends.

Copilot was used extensively. This was never meant to become a "real" project — just a fast personal tool to get an overview. But it kept growing, so here it is.

## Features

- Mark dates with country flag emojis (single dates or ranges)
- Full calendar state encoded in the URL — no backend, no login
- Share a link so others can see your plans
- Static read-only view for shared links
- Toggle weekday names on/off
- Multi-year support (2026–2030)
- Mobile-first, works well on desktop too

## Stack

- **React 18** + **TypeScript**
- **Vite**
- **Tailwind CSS**

## Getting Started

```bash
npm install
npm run dev
```

## Customization

You can easily customize:

- Available flags: Modify the `availableFlags` array in `App.jsx`
- Year: Change the `year` constant in `Calendar.jsx`

## License

MIT
