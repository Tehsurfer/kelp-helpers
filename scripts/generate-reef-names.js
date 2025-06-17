// Generate reef names from src/data/tile-names-for-generation.js
const NUMBER_OF_TILES = 100; // Number of tiles to generate names for

// Generate reef names based on the provided data structure
let dd = require('tile-names-for-generation.js');
let tileNames = []
for (let i = 0; i < dd.prefix.length; i++) {
  for (let j = 0; j < dd.base.length; j++) {
    for (let k = 0; k < dd.additive.length; k++) {
      let name = dd.prefix[i] + ' ' + dd.base[j] + ' ' + dd.additive[k];
      tileNames.push(name);
    }
  }
}

// Shuffle the names
tileNames.sort(() => Math.random() - 0.5);

// Select the first NUMBER_OF_TILES names
let selectedNames = tileNames.slice(0, NUMBER_OF_TILES);
console.log('Selected Reef Names:');
console.log(selectedNames);


