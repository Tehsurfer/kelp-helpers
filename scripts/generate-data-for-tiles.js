// This script is to generate data and names for coastline tiles
const fs = require('fs');
const path = require('path');


const tiles = require('../src/data/coastline-tiles.js').default;
const tileNames = require('./generated-tile-names.js').default;

let tilesWithData = [];

let tileIds = [];
tiles.features.forEach(tile => {
  if (tile.properties.id) {
    tileIds.push(tile.properties.id);
  }
})

tileIds.forEach((tileId, index) => {
  const tileName = tileNames[index];
  const urchinsEstimated = Math.floor(Math.random() * 1000); // Random number of urchins
  const kelpEstimated = Math.floor(Math.random() * 500); // Random number of kelp
  const snapperEstimated = Math.floor(Math.random() * 300); // Random number of snapper
  const tileData = {
    id: tileId,
    name: tileName,
    sponsorAmount: Math.floor(Math.random() * 100), // Random sponsor percentage
    urchinsEstimated: urchinsEstimated, // Random number of urchins
    kelpEstimated: kelpEstimated, // Random number of kelp
    snapperEstimated: snapperEstimated, // Random number of snapper
  };

  // Calculate reef health based on estimated populations
  let h = -(urchinsEstimated / 1000 * 0.3) + kelpEstimated / 500 * 0.3 + snapperEstimated / 300 * 0.4
  let normH = (h + 1) / 2; // Normalize to 0-1 range
  tileData.reefHealth = normH;
  tilesWithData.push(tileData);
})

// Write the generated data to a JSON file
const outputPath = path.join(__dirname, '../src/data/coastline-tiles-with-data.json');
fs.writeFileSync(outputPath, JSON.stringify(tilesWithData, null, 2), 'utf8');

