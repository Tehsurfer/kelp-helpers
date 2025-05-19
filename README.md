# 🗺️ Tile Grid Map with Mapbox GL JS

This React application generates a 100m x 100m interactive tile grid on a Mapbox map. Clicking a tile highlights it and displays an info panel with custom content.

Each tile has a unique ID in the format `T000001`, `T000002`, etc. Tile selection updates the panel dynamically, and the layout adapts for mobile users.

## 🌐 Demo
> _Add link here if hosted (e.g., Netlify, Vercel, GitHub Pages)_

---

## 🚀 Features

- Interactive Mapbox map
- Auto-generated tile grid based on map bounds
- Unique tile ID per square (e.g., `T000001`)
- Info panel with image carousel and placeholder text
- Fly-to animation on tile click
- API test request on load

---

## 📦 Tech Stack

- React
- Mapbox GL JS
- CSS

---

## 🛠️ Installation

Make sure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.

```bash
# Clone the repo
git clone https://github.com/your-username/tile-grid-map.git
cd tile-grid-map

# Install dependencies
npm install

