// This script is to generate data and names for coastline tiles
const fs = require('fs');
const path = require('path');


const tiles = require('../src/data/coastline-tiles.js').default;
const tileNames = require('./generated-tile-names.js').default;

const MAX_URCHINS = 1000;
const MAX_KELP = 500;
const MAX_SNAPPER = 300;

let tilesWithData = [];

// Use images from the public/reef-images directory
const imagePaths = [
  '5f9c74b81239c06afabe9a05_3b219577-475e-4008-a0ea-0474570c5ec0.jpeg',
  '5fa4af4ca2788c76019b0298_AdobeStock_234300556 HERO.jpeg',
  'Darryl Torckler_ Large old Snapper named Monkey-Face with school of Kingfish, Goat Island Marine Reserve, New Zealand..jpg',
  'images (1).jpg',
  'images (2).jpg',
  'images.jpg',
  'snapper-fish-underwater-goat-island-nz-wild-mature-to-years-re-cm-long-can-live-more-than-grow-up-marine-352365952.jpg'
];

let tileIds = [];
tiles.features.forEach(tile => {
  if (tile.properties.id) {
    tileIds.push(tile.properties.id);
  }
})

tileIds.forEach((tileId, index) => {
  const tileName = tileNames[index];
  const urchinsEstimated = Math.floor(Math.random() * MAX_URCHINS); // Random number of urchins
  const kelpEstimated = Math.floor(Math.random() * MAX_KELP); // Random number of kelp
  const snapperEstimated = Math.floor(Math.random() * MAX_SNAPPER); // Random number of snapper

  // Randomly select 3 images from the public/reef-images directory
  const shuffledImagePaths = imagePaths.sort(() => Math.random() - 0.5);
  const selectedImagePaths = shuffledImagePaths.slice(0, 3);
  const imageUrls = selectedImagePaths.map(imagePath => `/reef-images/${imagePath}`); // Assuming images are served from /reef-images
  const tileData = {
    id: tileId,
    name: tileName,
    sponsorAmount: Math.floor(Math.random() * 100), // Random sponsor percentage
    urchinsEstimated: urchinsEstimated, // Random number of urchins
    kelpEstimated: kelpEstimated, // Random number of kelp
    snapperEstimated: snapperEstimated, // Random number of snapper
    imageUrls: imageUrls
  };

  // Calculate reef health based on estimated populations
  let h = -(urchinsEstimated / MAX_URCHINS * 0.3) + kelpEstimated / MAX_KELP * 0.3 + snapperEstimated / MAX_SNAPPER * 0.4
  let normH = (h + 1) / 2; // Normalize to 0-1 range
  tileData.reefHealth = normH;
  tilesWithData.push(tileData);
})

// Write the generated data to a JSON file
const outputPath = path.join(__dirname, '../src/data/coastline-tiles-with-data.json');
fs.writeFileSync(outputPath, JSON.stringify(tilesWithData, null, 2), 'utf8');

