# Spiralyze Full-Stack Mini-Project

This project implements the **two tasks** defined in the assignment:

- **Task A – Mini Full-Stack Search**
- **Task B – Micro Scraper (webpage scraping endpoint)**

It is built using **Next.js** 

---

### Task A – FAQ Search
- Search FAQs stored in local `faqs.json`
- Multi-occurrence keyword scoring algorithm
- Weighted relevance scoring (Title = x2, Body = x1)
- Returns **maximum 3 highest-relevance results**
- Handles:
  - **Empty query → 400 Bad Request**
  - **No results → empty result + message**
- Uses local JSON 
- Clean UI to display results, source IDs, and summary

### Task B – Webpage Scraper
- Accepts a `url` query parameter
- Attempts to fetch page content and extract:
  - `<title>`
  - `<meta name="description">`
  - `<h1>`
- Handles invalid URLs and unreachable URLs gracefully

---

## 🧠 Tech Stack
| Component | Technology |
|-----------|------------|
| Framework | Next.js (App Router) |
| Runtime | Node.js 20+ |
| UI | React + simple inline styling |
| Data | Local JSON (`src/data/faqs.json`) |
| API | Next.js Route Handlers (`src/app/api/*`) |

---

## 📁 Project Structure
src/
 |-app/
 |	|-layout.tsx
 |	|-page.tsx
 |	|-api/
 |		|-search/route.ts
 |		|-scrape/route.ts
 |-data/
	|-faqs.json

### **Requirements**
- Node.js **v20.9+**
- npm 

### Run development server
npm run dev
Visit: http://localhost:3000

### API Endpoint
GET /api/scrape?url=<https://example.com>
