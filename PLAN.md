# KICKS — Execution Plan & To-Do Checklist

**Due Date:** February 23, 2026 — 11:59 PM  
**Stack:** Next.js · Redux · Axios · TypeScript · Tailwind CSS · shadcn/ui

---

## Progress Overview

| Stage | Title | Status |
|-------|-------|--------|
| 1 | Infrastructure & Foundation | ✅ Complete |
| 2 | Shared Components | ✅ Complete |
| 3 | Landing Page | ✅ Complete |
| 4 | Product Detail Page | ✅ Complete |
| 5 | Shopping Cart (Bonus) | ✅ Complete |
| 6 | Polish & Deploy | ⬜ Not Started |

---

## Stage 1 — Infrastructure & Foundation

> Wire up the project so API calls can be made and routes work correctly.

### Environment
- [ ] Create `.env.local` with `NEXT_PUBLIC_API_BASE_URL=https://fakeapi.platzi.com/en/rest`

### Dependencies
- [ ] Install `@reduxjs/toolkit` and `react-redux`
- [ ] Install `axios`

### TypeScript Types (`types/`)
- [ ] `types/product.ts` — Product, ProductImage interfaces
- [ ] `types/category.ts` — Category interface
- [ ] `types/cart.ts` — CartItem, CartState interfaces

### API Layer (`lib/api/`)
- [ ] `lib/api/client.ts` — Axios instance with base URL + interceptors
- [ ] `lib/api/products.ts` — `getProducts()`, `getProductById()`, `getProductsByCategory()`
- [ ] `lib/api/categories.ts` — `getCategories()`

### Redux Store (`store/`)
- [ ] `store/store.ts` — Configure Redux store
- [ ] `store/slices/productsSlice.ts` — Products state (list, selected, loading, error)
- [ ] `store/slices/categoriesSlice.ts` — Categories state
- [ ] `store/slices/cartSlice.ts` — Cart state (items, add, remove, update, clear)
- [ ] `store/hooks.ts` — Typed `useAppDispatch` and `useAppSelector` hooks
- [ ] `store/Provider.tsx` — Client-side Redux Provider wrapper

### App Layout (`app/`)
- [ ] Update `app/layout.tsx` — Wrap with Redux `<Provider>`, clean up fonts (Inter only)
- [ ] Update `app/page.tsx` — Replace component example with landing page

### Route Structure
- [ ] Create `app/products/[id]/page.tsx` — Product detail page shell
- [ ] Create `app/cart/page.tsx` — Cart page shell

---

## Stage 2 — Shared Components

> Build the shell visible on every page.

### Header (`components/common/Header.tsx`)
- [ ] KICKS logo centered
- [ ] Left nav: "New Drops 🔥", "Men ▾", "Women ▾"
- [ ] Right icons: Search, User, Cart with item-count badge
- [ ] Sticky positioning on scroll
- [ ] Mobile hamburger menu (responsive)
- [ ] Cart badge wired to Redux cart state

### Footer (`components/common/Footer.tsx`)
- [ ] Dark background layout
- [ ] About Us column with description
- [ ] Categories column: Runners, Sneakers, Basketball, Outdoor, Golf, Hiking
- [ ] Company column: About, Contact, Blogs
- [ ] Follow Us column: Facebook, Instagram, Twitter, TikTok icons
- [ ] Giant "KICKS" watermark text
- [ ] © copyright notice

### Product Card (`components/common/ProductCard.tsx`)
- [ ] "New" blue badge top-left
- [ ] Product image with `next/image`
- [ ] Product name (uppercase bold)
- [ ] "VIEW PRODUCT · $125" dark CTA button
- [ ] Hover effect on card
- [ ] Link to `/products/[id]`

### Skeleton Loaders (`components/common/`)
- [ ] `ProductCardSkeleton.tsx` — Pulse skeleton for product cards
- [ ] `SectionSkeleton.tsx` — Generic section loading state

### Newsletter Section (`components/common/Newsletter.tsx`)
- [ ] Blue background
- [ ] "JOIN OUR KICKSPLUS CLUB & GET 15% OFF" headline
- [ ] Email input + SUBMIT button
- [ ] Form validation (email format)
- [ ] Success/error feedback state
- [ ] KICKS logo overlay right side

---

## Stage 3 — Landing Page (`/`)

> Full home page matching Figma, API-connected.

### Hero Section (`components/home/HeroSection.tsx`)
- [ ] "DO IT RIGHT" oversized text (black + blue)
- [ ] Large featured shoe image with rounded corners
- [ ] "Nike product of the year" vertical badge on image
- [ ] Product name + description overlay
- [ ] "SHOP NOW" CTA button
- [ ] 2 thumbnail images stacked on the right
- [ ] Responsive layout (stack on mobile)

### New Drops Section (`components/home/NewDrops.tsx`)
- [ ] "DON'T MISS OUT NEW DROPS" heading (bold, uppercase)
- [ ] "SHOP NEW DROPS" button (top right)
- [ ] Fetch 4 products via Axios → Redux dispatch
- [ ] 4-col grid → 2-col tablet → 1-col mobile
- [ ] Show `ProductCardSkeleton` while loading
- [ ] Error state with retry

### Categories Section (`components/home/Categories.tsx`)
- [ ] "CATEGORIES" heading
- [ ] Fetch all categories via Axios → Redux dispatch
- [ ] Dark black background section
- [ ] 2-up large cards (category image + name + arrow icon)
- [ ] Previous / Next navigation arrows
- [ ] Loading skeleton while fetching

### Reviews Section (`components/home/Reviews.tsx`)
- [ ] "REVIEWS" heading + "SEE ALL" button
- [ ] 3 static review cards (name, 5-star rating, text)
- [ ] 3 photo tiles below the review cards
- [ ] Star rating component

### Wire up Landing Page (`app/page.tsx`)
- [ ] Compose all sections in correct order
- [ ] Header + Hero + New Drops + Categories + Reviews + Newsletter + Footer

---

## Stage 4 — Product Detail Page (`/products/[id]`)

> Full product page matching Figma, API-connected.

### Image Gallery (`components/product/ProductGallery.tsx`)
- [ ] 2×2 grid of thumbnails
- [ ] Click thumbnail → updates active main image
- [ ] `next/image` with proper aspect ratio
- [ ] Active thumbnail indicator (border/ring)

### Product Info (`components/product/ProductInfo.tsx`)
- [ ] Fetch product by ID via Axios: `GET /products/{id}`
- [ ] "New Release" blue badge (conditional)
- [ ] Product name uppercase bold
- [ ] Price in blue (`$125.00`)
- [ ] Loading skeleton while fetching
- [ ] Error boundary / fallback state

### Color Selector (`components/product/ColorSelector.tsx`)
- [ ] Circular color swatches
- [ ] Selected state = ring border
- [ ] Local state management

### Size Selector (`components/product/SizeSelector.tsx`)
- [ ] Size grid buttons: 36 → 47
- [ ] Selected state highlighted (black bg, white text)
- [ ] Unavailable sizes muted/disabled
- [ ] "SIZE CHART" link

### CTA Buttons (`components/product/ProductActions.tsx`)
- [ ] "ADD TO CART" button (black, full width)
- [ ] "BUY IT NOW" button (blue, full width)
- [ ] Heart/wishlist icon button
- [ ] Buttons disabled until color + size selected
- [ ] Loading state during add-to-cart action
- [ ] Success feedback after adding

### About the Product (`components/product/ProductDescription.tsx`)
- [ ] "ABOUT THE PRODUCT" section header
- [ ] Color/style description text from API
- [ ] Exclusion from discounts note
- [ ] Payment options bullet (Affirm, Klarna, Afterpay)
- [ ] Free shipping & returns note
- [ ] Expandable/collapsible accordion

### Related Products (`components/product/RelatedProducts.tsx`)
- [ ] "You may also like" header
- [ ] Fetch products by same `categoryId`
- [ ] 4-card horizontal row with prev/next arrows
- [ ] Carousel behavior on mobile
- [ ] "New" badges on cards
- [ ] Links to each product's detail page

### Wire up Product Detail Page (`app/products/[id]/page.tsx`)
- [ ] Compose Gallery + Info + Color + Size + Actions + Description + Related + Newsletter + Footer

---

## Stage 5 — Shopping Cart (`/cart`) · Bonus +20pts

> Fully functional cart with localStorage persistence.

### Cart Redux Slice (`store/slices/cartSlice.ts`)
- [ ] `addItem(product, color, size, qty)` action
- [ ] `removeItem(id)` action
- [ ] `updateQuantity(id, qty)` action
- [ ] `clearCart()` action
- [ ] Computed selectors: `cartTotal`, `cartItemCount`, `cartSubtotal`

### Cart Persistence
- [ ] `localStorage` middleware or custom hook
- [ ] Hydrate cart state from localStorage on app mount
- [ ] Persist on every cart change

### Cart Page (`app/cart/page.tsx`)
- [ ] Cart items list
- [ ] Item card: image, name, size, color, qty stepper, subtotal
- [ ] Remove item button per row
- [ ] Order summary panel: subtotal, shipping, total
- [ ] "PROCEED TO CHECKOUT" button (disabled, visual only)
- [ ] Empty cart state with CTA to continue shopping

### Header Badge
- [ ] Cart icon badge shows live item count from Redux

### Wire Product Page → Cart
- [ ] "ADD TO CART" dispatches `addItem` with selected color + size

---

## Stage 6 — Polish & Deploy

> Responsive, performant, submitted on time.

### Responsive QA
- [ ] 320px mobile — all sections stack correctly
- [ ] 768px tablet — grid adjustments, hamburger menu
- [ ] 1280px+ desktop — full layout matches Figma

### Performance
- [ ] `next/image` with `priority` prop on Hero image
- [ ] `lazy` loading on all remaining images
- [ ] Dynamic import heavy components if needed
- [ ] Verify initial load < 3s

### Error Handling
- [ ] Error boundary components for API failures
- [ ] Retry buttons on failed sections
- [ ] 404 page for unknown product IDs (`not-found.tsx`)

### SEO & Metadata
- [ ] `app/layout.tsx` — site-wide title/description
- [ ] `app/products/[id]/page.tsx` — dynamic `generateMetadata()` with product name

### Deployment
- [ ] Push final code to GitHub
- [ ] Deploy to Vercel
- [ ] Set `NEXT_PUBLIC_API_BASE_URL` in Vercel environment
- [ ] Verify live URL works end-to-end

### Final Checks
- [ ] README updated with setup instructions, env vars, live URL
- [ ] All console errors cleared
- [ ] All `any` types replaced with proper TypeScript types
- [ ] Meaningful git commit history (conventional commits)

---

## Stage Completion Checklist

- [x] ✅ Stage 1 — Infrastructure & Foundation
- [x] ✅ Stage 2 — Shared Components
- [x] ✅ Stage 3 — Landing Page
- [x] ✅ Stage 4 — Product Detail Page
- [x] ✅ Stage 5 — Shopping Cart
- [ ] ✅ Stage 6 — Polish & Deploy
