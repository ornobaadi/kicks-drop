# KICKS DROP — Shop Everything

A modern multi-category e-commerce storefront built with Next.js 15, Redux Toolkit, and Tailwind CSS v4. Powered by the [Platzi Fake Store API](https://api.escuelajs.co/api/v1). Featuring clothing, electronics, furniture, accessories, and more.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| State | Redux Toolkit + react-redux |
| Data Fetching | Axios + async thunks |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Fonts | Rubik (headings) · Open Sans (body) |
| Language | TypeScript |
| Package Manager | pnpm |

---

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.escuelajs.co/api/v1
```

### 3. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production

```bash
pnpm build
pnpm start
```

---

## Project Structure

```
app/                   # Next.js App Router pages
  layout.tsx           # Root layout (fonts, Redux Provider, Header, Footer)
  page.tsx             # Landing page
  not-found.tsx        # Custom 404 page
  cart/page.tsx        # Shopping cart page
  products/[id]/       # Dynamic product detail page

components/
  common/              # Shared: Header, Footer, ProductCard, Newsletter, Skeletons
  home/                # Landing sections: HeroSection, NewDrops, Categories, Reviews
  product/             # Product detail: Gallery, Info, ColorSelector, SizeSelector, Actions, Description, Related
  cart/                # Cart: CartClient

lib/api/               # Axios client + API functions (products, categories)
store/                 # Redux store, slices (products, categories, cart), hooks, Provider
types/                 # TypeScript interfaces (Product, Category, CartItem)
```

---

## Features

- **Landing Page** — Hero with FitText scaling, New Drops grid, Categories carousel, Reviews, Newsletter
- **Product Detail** — Image gallery, color/size selectors, Add to Cart with feedback, related products
- **Shopping Cart** — Quantity stepper, order summary, free shipping progress, localStorage persistence
- **Responsive** — Mobile (320px+), tablet (768px+), desktop (1280px+)
- **SEO** — Site-wide metadata + dynamic `generateMetadata` per product page
- **Error States** — Retry buttons on all API-connected sections; custom 404 page
- **Performance** — Server Components by default, `priority` on hero image, lazy load everywhere else

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Platzi Fake Store API base URL | Yes |

---

## Deployment

Deploy to [Vercel](https://vercel.com):

1. Push to GitHub
2. Import the repository in Vercel
3. Add `NEXT_PUBLIC_API_BASE_URL=https://api.escuelajs.co/api/v1` to Vercel Environment Variables
4. Deploy
