# Bookworm

**Bookworm** is a responsive digital library and in-browser reader for public-domain classics. It helps readers search a large catalog, save a personal shelf, read a book in a focused interface, and return to the last saved reading position.

> Graduation project for a React training program. The interface uses an editorial-paper visual identity rather than a conventional storefront layout.

## Live demo

Deployment link: [https://bookworm-iota-livid.vercel.app](https://bookworm-iota-livid.vercel.app)

## Features

- Browse popular public-domain classics from the Gutendex API.
- Search by title, author, or keyword; filter by language and subject; sort results.
- Browse dedicated routes for Home, Library, Book Details, Reader, My Shelf, and About.
- Read supported plain-text books inside the browser.
- Change reader theme, font size, and text width.
- Save favorite books, reading position, bookmarks, and completion state in `localStorage`.
- Responsive navigation and layouts for mobile, tablet, and desktop.
- Accessible loading, empty, and error states; keyboard-visible focus states; reduced-motion support.

## Tech stack

- React 19 + Vite
- React Router DOM 7
- Bootstrap 5 (base responsive UI utilities) + custom CSS design system
- Axios
- Lucide React icons
- Lenis (subtle non-reader-page smooth scrolling)
- Gutendex API / Project Gutenberg public-domain catalog
- Vercel Serverless Function for safe same-origin text fetching in the Reader

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Editorial home page and live popular-books section |
| `/library` | Searchable, filterable catalog |
| `/book/:id` | Book information and reading entry point |
| `/read/:id` | Focused reading experience and bookmarks |
| `/my-shelf` | Browser-local saved books and reading progress |
| `/about` | Project, source, and attribution information |
| `*` | Custom 404 page |

## Project structure

Every major feature lives in its own folder under `src/components`, with its JSX and CSS together.

```text
src/
├── components/
│   ├── HomePage/Hero/
│   ├── HomePage/PopularBooks/
│   ├── LibraryPage/SearchBar/
│   ├── LibraryPage/FilterBar/
│   ├── BookDetailsPage/
│   ├── ReaderPage/
│   ├── MyShelfPage/
│   ├── AboutPage/
│   ├── NotFoundPage/
│   ├── Navbar/
│   └── ui/
├── context/             # Shelf and reader local state
├── hooks/               # Debounce, localStorage, reduced motion
├── services/GutendexApi/
├── styles/              # Tokens, typography, utility classes
└── utils/
api/read-book.js         # Vercel function used by the reader
docs/screenshots/        # Final submission screenshots
```

## Run locally

### Prerequisites

- Node.js 20+ recommended
- npm

```bash
git clone <your-new-github-repository-url>
cd bookworm-reader
npm install
npm run dev
```

Open the local URL Vite prints (normally `http://localhost:5173`).

## Build and lint

```bash
npm run lint
npm run build
```

`npm run build` verifies the Vite production bundle. The `/api/read-book` route runs when deployed to Vercel; it is not executed by Vite's local dev server alone.

## Data sources and attribution

The catalog comes from [Gutendex](https://gutendex.com/), an API for [Project Gutenberg](https://www.gutenberg.org/) books. Bookworm is not affiliated with either project and does not host or claim ownership of book texts. Text availability and rights can vary by country; follow the source terms before redistributing anything.

## Screenshots

Final live screenshots are included in [`docs/screenshots`](./docs/screenshots/):

- Desktop: Home, Library, Book details, Reader, My Shelf, About, and 404 page
- Mobile: Home, Library, and Reader at 390 × 844

## Deployment checklist

1. Push this project to a **new public GitHub repository**.
2. Import the repo into Vercel and deploy it as a Vite project.
3. Test direct links such as `/library`, `/book/1342`, and `/read/1342` after deployment.
4. Open the deploy URL in a private browser window; it must load without sign-in.
5. Replace the Live demo placeholder above and add the final screenshots.
6. Submit your full name, WhatsApp number, email, project name, GitHub repository URL, and public deployment URL using the course form.

## Credits

Designed and developed as a React graduation project. Brand direction: **Editorial Paper** — warm ivory, burgundy, terracotta, brass, and charcoal.
