# ContentHub — Design Preview

## What Is ContentHub?

ContentHub is a **multi-creator, multi-buyer digital content marketplace**. Creators publish premium articles, videos, and digital files. Buyers discover, purchase, and access content — pay once, own forever. No subscriptions.

Think **Gumroad meets a social content platform**.

---

## User Roles

```
+------------------+     +------------------+     +------------------+
|    CUSTOMER      |     |     CREATOR      |     |      ADMIN       |
|                  |     |                  |     |                  |
|  Browse content  |     |  Publish content |     |  Moderate content|
|  Purchase items  |     |  Set prices      |     |  Manage users    |
|  Build library   |     |  Create bundles  |     |  Configure fees  |
|  Follow creators |     |  Issue coupons   |     |  View analytics  |
|  Leave reviews   |     |  Track earnings  |     |                  |
+------------------+     +------------------+     +------------------+
```

---

## Application Flow

### 1. Discovery & Purchase Flow (Customer)

```
  HOME PAGE                    BROWSE                     CONTENT DETAIL
+------------------+    +------------------+    +-------------------------+
| Hero Banner      |    | Search Bar       |    | Title & Description     |
| "Discover &      |--->| Category Filter  |--->| Creator Info + Follow   |
|  Purchase"       |    | Type Filter      |    | Preview Content         |
| [Browse Content] |    | Sort Options     |    | Reviews & Ratings       |
| [Start Selling]  |    | Content Cards    |    | [Add to Cart] [Wishlist]|
| Stats Bar        |    |   from ALL       |    +-------------------------+
| How It Works     |    |   creators       |              |
| Content Types    |    +------------------+              v
+------------------+                              CHECKOUT
                                            +-------------------------+
                                            | Cart Items              |
                                            | Apply Coupon Code       |
                                            | Order Summary           |
                                            | [Complete Purchase] --->+
                                            +-------------------------+
                                                                      |
                                                                      v
                                                              SUCCESS PAGE
                                                          +------------------+
                                                          | Order Confirmed  |
                                                          | [View Library]   |
                                                          +------------------+
```

### 2. Content Lifecycle (Creator -> Admin -> Public)

```
  CREATOR                    ADMIN                     PUBLIC
+------------------+    +------------------+    +------------------+
|                  |    |                  |    |                  |
| Creates content  |    | Reviews pending  |    | Published on     |
| (Draft)          |--->| content          |--->| marketplace      |
|                  |    |                  |    |                  |
| Submits for      |    | Approves or      |    | Visible to all   |
| review (Pending) |    | Rejects with     |    | buyers           |
|                  |    | reason           |    |                  |
+------------------+    +------------------+    +------------------+

Status Flow:  DRAFT --> PENDING --> PUBLISHED
                                --> REJECTED (creator notified, can fix & resubmit)
```

### 3. Revenue Flow

```
  BUYER                     PLATFORM                   CREATOR
+------------------+    +------------------+    +------------------+
|                  |    |                  |    |                  |
| Pays $19.99      |--->| Takes 15%        |--->| Receives $16.99  |
| for content      |    | commission       |    | in balance       |
|                  |    | ($3.00)          |    |                  |
+------------------+    +------------------+    +------------------+

  * Commission rate configurable by admin
  * Coupons reduce buyer price, creator earns from actual paid amount
```

---

## Dashboard Layouts

### Customer Dashboard (`/dashboard`)

```
+--------+------------------------------------------+
|        |                                          |
| Side   |  OVERVIEW                                |
| bar    |  +----------+ +----------+ +----------+  |
|        |  | Items in | | Total    | | Quick    |  |
| Over-  |  | Library  | | Spent    | | Actions  |  |
| view   |  +----------+ +----------+ +----------+  |
| Feed   |                                          |
| Library|  RECENT PURCHASES                        |
| Wish-  |  +--------------------------------------+|
| list   |  | Content cards with access links      ||
| Purch- |  +--------------------------------------+|
| ases   |                                          |
| Notif. |                                          |
| Settin.|                                          |
+--------+------------------------------------------+
```

**Pages:**
- **Overview** — Stats cards (items owned, total spent), recent purchases
- **Feed** — Content from followed creators + personalized recommendations
- **My Library** — All purchased content with instant access
- **Wishlist** — Saved content for later purchase
- **Purchases** — Full purchase history with transaction details
- **Notifications** — Sales, follows, reviews, content status updates
- **Settings** — Account preferences

### Creator Studio (`/creator`)

```
+--------+------------------------------------------+
|        |                                          |
| Side   |  CREATOR DASHBOARD                       |
| bar    |  +--------+ +--------+ +--------+ +----+ |
|        |  |Content | |Publish-| |Total   | |Tot-| |
| Over-  |  |Count   | |ed      | |Sales   | |Rev | |
| view   |  +--------+ +--------+ +--------+ +----+ |
| My     |                                          |
| Content|  TOP CONTENT          RECENT SALES       |
| Create |  +--------------+  +--------------+      |
| New    |  | Best sellers |  | Latest       |      |
| Bundles|  | by revenue   |  | transactions |      |
| Coupons|  +--------------+  +--------------+      |
| Earning|                                          |
| Profile|                                          |
+--------+------------------------------------------+
```

**Pages:**
- **Overview** — Stats (content count, published, total sales, revenue, views), top content, recent sales
- **My Content** — All content with status badges (draft/pending/published/rejected)
- **Create New** — Rich form: title, body, type (article/video/file), price, category, tags, file upload
- **Bundles** — Group 2+ content items at a discounted price, edit, toggle active/inactive
- **Coupons** — Create discount codes (% or fixed), set usage limits & expiry, track usage
- **Earnings** — Revenue breakdown and analytics
- **Profile** — Public creator profile settings

### Admin Panel (`/admin`)

```
+--------+------------------------------------------+
|        |                                          |
| Side   |  ADMIN DASHBOARD                         |
| bar    |  +--------+ +--------+ +--------+        |
|        |  |Total   | |Total   | |Total   |        |
| Over-  |  |Users   | |Content | |Revenue |        |
| view   |  +--------+ +--------+ +--------+        |
| Users  |                                          |
| Content|  PENDING CONTENT FOR REVIEW              |
| Categ- |  +--------------------------------------+|
| ories  |  | [Approve] [Reject] for each item     ||
| Settin.|  +--------------------------------------+|
|        |                                          |
+--------+------------------------------------------+
```

**Pages:**
- **Overview** — Platform-wide analytics (users, content, revenue)
- **Users** — User list with ban/unban actions
- **Content** — Pending content moderation (approve/reject with reason)
- **Categories** — CRUD content categories (name, slug, icon)
- **Settings** — Commission rate, min/max content price

---

## Multi-Creator / Multi-Buyer Architecture

```
                    +------------------+
                    |   MARKETPLACE    |
                    |   (Public)       |
                    +------------------+
                    | All published    |
                    | content from     |
                    | ALL creators     |
                    +--------+---------+
                             |
              +--------------+--------------+
              |                             |
    +---------v---------+        +----------v--------+
    |   CREATOR A       |        |   CREATOR B       |
    |   (Isolated)      |        |   (Isolated)      |
    +-------------------+        +-------------------+
    | Own content only  |        | Own content only  |
    | Own bundles only  |        | Own bundles only  |
    | Own coupons only  |        | Own coupons only  |
    | Own earnings only |        | Own earnings only |
    +-------------------+        +-------------------+
              |                             |
              +-------------+---------------+
                            |
              +-------------v---------------+
              |                             |
    +---------v---------+        +----------v--------+
    |   BUYER X         |        |   BUYER Y         |
    |   (Isolated)      |        |   (Isolated)      |
    +-------------------+        +-------------------+
    | Own purchases     |        | Own purchases     |
    | Own wishlist      |        | Own wishlist      |
    | Own cart          |        | Own cart          |
    | Own notifications |        | Own notifications |
    | Can follow A & B  |        | Can follow A & B  |
    | Can review both   |        | Can review both   |
    +-------------------+        +-------------------+
```

**Key isolation rules:**
- Creators can ONLY manage their own content, bundles, coupons, and earnings
- Buyers can ONLY see their own purchases, wishlist, cart, and notifications
- Public marketplace shows ALL creators' published content
- Buyers can follow and review content from ANY creator
- Any creator's coupon code works for any buyer at checkout

---

## Content Types

```
+------------------+------------------+------------------+
|   ARTICLES       |   VIDEOS         |   DIGITAL FILES  |
|                  |                  |                  |
| Written guides,  | Video courses,   | Templates, code, |
| tutorials, and   | tutorials, and   | assets, designs, |
| in-depth content | visual content   | and downloads    |
|                  |                  |                  |
| Rich text body   | Streaming or     | Direct download  |
| with markdown    | download         | after purchase   |
+------------------+------------------+------------------+
```

---

## Social & Engagement Features

```
+-----------+     +-----------+     +-----------+
|  FOLLOW   |     |  WISHLIST |     |  REVIEWS  |
|  SYSTEM   |     |           |     |           |
| Buyer     |     | Save for  |     | Rate 1-5  |
| follows   |     | later     |     | stars +   |
| creator   |     | purchase  |     | comment   |
+-----------+     +-----------+     +-----------+
      |                                   |
      v                                   v
+-----------+                     +-----------+
|   FEED    |                     | NOTIFICA- |
|           |                     | TIONS     |
| Content   |                     | new_sale  |
| from      |                     | follower  |
| followed  |                     | review    |
| creators  |                     | approved  |
+-----------+                     | rejected  |
                                  +-----------+
```

---

## Monetization Tools (Creator)

### Bundles
Group multiple content items at a discounted package price.

```
  Individual:                    Bundle:
  Article A = $9.99              "Complete Pack"
  Article B = $14.99             All 3 for $29.99
  Video C   = $19.99             (Save 36%)
  ─────────────────
  Total     = $44.97
```

### Coupons
Create discount codes with controls.

```
  Code: SUMMER25
  Type: Percentage (25% off)
  Limit: 100 uses
  Expiry: 2026-06-30
  Status: Active
  Used: 34/100
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 14 (App Router) | Pages, API routes, SSR, middleware |
| Database | MongoDB + Mongoose | 14 models, full-text search |
| Auth | NextAuth.js (JWT) | Credentials login, role-based access |
| Styling | Tailwind CSS | Custom design system (brand/surface/accent) |
| UI | React 18 | Server + client components |

---

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.local.example .env.local
# Edit MONGODB_URI with your MongoDB connection string

# Seed demo data
npm run seed

# Start dev server
npm run dev
```

**Demo accounts** (password: `password123`):
- Admin: `admin@test.com`
- Creator: `sarah@test.com` / `mike@test.com`
- Customer: `john@test.com` / `jane@test.com`
