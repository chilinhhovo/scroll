# NYC Elevator Complaints Duration Chart

An interactive visualization of elevator complaint resolution durations across New York City using Svelte (Svelte build only), Plotly.js, and D3.js.

## Features
- **Interactive scatter plot:** Each dot represents one complaint; **Y** = duration (hours), **X** = jitter for spacing.
- **Hover details:** Duration, created date, address, borough, status/type.
- **Borough color coding** with legend.
- **Click for details** (popup).
- **Zoom/Pan** via Plotly controls.
- **Responsive layout:** Standalone page adapts to mobile; scrollytelling pages are fixed-size.
- **Statistics dashboard (standalone only):** Total complaints, average duration, longest wait, top borough.
- **Canvas skyline animation:** In scrollytelling pages, buildings are drawn dynamically on an HTML5 `<canvas>` and respond to scroll position.
  
## Canvas Building Scroll Animation
Some pages (`index.html`, `index1.html`) begin with a **city skyline** rendered on a `<canvas>` element.  
- **Drawing buildings:** Buildings are drawn as rectangles of varying widths and heights, with “windows” represented by smaller filled rectangles.  
- **Randomized details:** Window patterns are generated randomly per building to create a varied skyline each time.  
- **Scroll interaction:** As the user scrolls, the animation advances through frames — buildings fade in, highlight, or change based on complaint data.  
- **Performance:** Uses the 2D canvas API (`this.ctx.fillRect`, `this.ctx.fillStyle`) for efficient rendering.  
- **Purpose:** Provides visual context and an engaging lead-in to the complaint data story.

## Data Sources
- **NYC 311 Service Requests (2010–Present)**  
  Pulled via the [`NYC Open Data`](https://data.cityofnewyork.us/Social-Services/NYC-311-Data/jrb2-thup/about_data)

- **Manhattan Rent-Stabilized Buildings (2022, PDF)**  
NYC Rent Guidelines Board: 2022 HCR Building Registration [`(Manhattan)`](https://rentguidelinesboard.cityofnewyork.us/resources/rent-stabilized-building-lists/)  
We convert the PDF to structured CSV using [`pdfplumber`](https://github.com/jsvine/pdfplumber):
1. `pdfplumber.open()` → iterate pages  
2. `.extract_table()` / `.extract_tables()` to capture rows  
3. Clean and normalize addresses and ZIP codes for merging with 311 data  

## Data Files
All input and derived files are stored in this repository:  
**[311_project/data](https://github.com/chilinhhovo/311_project/tree/main)**

## Data Processing
- Filter out invalid/zero durations
- Parse duration strings into hours
- Sort by duration (longest first)
- Use fuzzymatch to match the addresses (a few attempts)
- Filter for rent-stabilized buildings
- Pivot tables

## Design + code
- Figma mockup
- Meeting with advisor
- Design decided: use mostly black/ white, I wanted to keep it minimal and create an elevating feeling of the elevators
- Maybe a bit of being 'stuck' via scrolling to create this annoying feeling of being stuck in an elevator
  
## How to Run

### Svelte/Vite Version (Svelte build only)
```bash
npm install
npm run dev
# Open http://localhost:3000

index-chart.html      # Svelte app entry (Svelte version only)
index.html            # Scrollytelling + Plotly scatter (fixed size)
index1.html           # Scrollytelling + D3/SVG scatter
standalone-chart.html # Standalone Plotly chart + stats cards
src/                  # Svelte components (if using Svelte)
package.json          # Svelte/Vite dependencies (Svelte build only)
vite.config.js        # Vite config (Svelte build only)


