// MapGenerator.js - Module for procedural world generation

import Perlin from './PerlinNoise.js';
import HexUtils from './HexUtils.js'; // NEW: Import HexUtils for neighbor logic

// --- Private Helper Functions ---
function fbm(noise, x, y, octaves, persistence, lacunarity) {
    let total = 0;
    let frequency = 1;
    let amplitude = 1;
    let maxValue = 0;
    for (let i = 0; i < octaves; i++) {
        total += noise.noise(x * frequency, y * frequency) * amplitude;
        maxValue += amplitude;
        amplitude *= persistence;
        frequency *= lacunarity;
    }
    return total / maxValue;
}

// More aggressive biome thresholds for diversity
function getTerrain(e, m) { // e = elevation, m = moisture
    if (e < 0.20) return "Ocean";
    if (e < 0.25) return "Plains"; 

    if (e > 0.75) return "Mountain"; 
    
    if (e > 0.55) { 
        if (m < 0.33) return "Hills"; 
        return "Mountain";
    }

    if (e > 0.40) {
        if (m < 0.5) return "Hills";
        return "Forest";
    }

    if (e > 0.25) {
        if (m < 0.22) return "Desert"; 
        if (m < 0.50) return "Plains";
        if (m < 0.80) return "Forest"; 
        return "Swamp";
    }

    return "Plains";
}

function identifyLakes(width, height, hexes) {
    const visited = new Set();
    const queue = [];

    // Re-using the getNeighbors function from HexUtils would be ideal,
    // but to keep this module self-contained for generation, a local copy is fine.
    function getNeighbors(coord) {
        return HexUtils.getNeighbors(coord, width, height);
    }

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
                const coord = `${String(x + 1).padStart(2, '0')}${String(y + 1).padStart(2, '0')}`;
                if (hexes[coord].terrain === 'Ocean' && !visited.has(coord)) {
                    queue.push(coord);
                    visited.add(coord);
                }
            }
        }
    }

    while (queue.length > 0) {
        const current = queue.shift();
        for (const neighbor of getNeighbors(current, width, height)) {
            if (!visited.has(neighbor) && hexes[neighbor].terrain === 'Ocean') {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const coord = `${String(x + 1).padStart(2, '0')}${String(y + 1).padStart(2, '0')}`;
            if (hexes[coord].terrain === 'Ocean' && !visited.has(coord)) {
                hexes[coord].terrain = 'Lake';
            }
        }
    }
}

// --- NEW/REWRITTEN: Context-Aware POI Filtering ---
// This function checks the context of a hex and filters a list of possible POIs.
function filterPOIsByContext(possiblePOIs, coord, mapData) {
    if (!possiblePOIs || possiblePOIs.length === 0) {
        return [];
    }

    let filteredPOIs = [...possiblePOIs];
    const hex = mapData.hexes[coord];

    // --- Port Logic ---
    // A Port requires an adjacent Ocean or Lake hex.
    const hasPort = possiblePOIs.some(p => p.type === 'Port');
    if (hasPort) {
        const neighbors = HexUtils.getNeighbors(coord, mapData.width, mapData.height);
        const isCoastal = neighbors.some(nCoord => {
            const neighborHex = mapData.hexes[nCoord];
            return neighborHex && (neighborHex.terrain === 'Ocean' || neighborHex.terrain === 'Lake');
        });

        // If it's a land hex but not coastal, remove Port as a possibility.
        if (!isCoastal && hex.terrain !== 'Ocean' && hex.terrain !== 'Lake') {
            filteredPOIs = filteredPOIs.filter(p => p.type !== 'Port');
        }
    }
    
    // --- Pirate Hideout Logic ---
    const hasPirateHideout = possiblePOIs.some(p => p.type === 'Pirate Hideout');
    if (hasPirateHideout) {
        const neighbors = HexUtils.getNeighbors(coord, mapData.width, mapData.height);
        const isCoastal = neighbors.some(nCoord => {
            const neighborHex = mapData.hexes[nCoord];
            return neighborHex && (neighborHex.terrain === 'Ocean' || neighborHex.terrain === 'Lake');
        });
        if (!isCoastal) {
            filteredPOIs = filteredPOIs.filter(p => p.type !== 'Pirate Hideout');
        }
    }


    // Future logic for other context-dependent POIs can be added here.
    // e.g., A "Bridge" POI would require a river. A "Mine" might be more likely next to mountains.

    return filteredPOIs;
}


// --- Public API ---
function generateMapData({ width, height, seed, mapType, elevation: elevationControl, climate: climateControl }) {
    const baseNoise = new Perlin(seed);
    const mountainNoise = new Perlin(seed + "_mountains");
    const moistNoise = new Perlin(seed + "_moisture");
    const landmassNoise = new Perlin(seed + "_landmass");
    
    const hexes = {};
    const octaves = 6, persistence = 0.5, lacunarity = 2;

    const elevationExponent = 2.2 - (elevationControl / 100) * 1.5;
    const climateExponent = 2.0 - (climateControl / 100) * 1.3;
    
    const side = ['n', 's', 'e', 'w'][Math.floor(Math.random() * 4)];

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const coord = `${String(x + 1).padStart(2, '0')}${String(y + 1).padStart(2, '0')}`;
            
            const nx = x / width, ny = y / height;

            // 1. Create large-scale landmass shapes using specific logic for each preset.
            let landValue = 0;
            const d = Math.sqrt((nx - 0.5)**2 + (ny - 0.5)**2) * 2; 
            const noise = fbm(landmassNoise, nx * 2.5, ny * 2.5, 4, 0.5, 2.0);

            switch (mapType) {
                case 'Archipelago': {
                    let chainNoise = fbm(landmassNoise, nx * 4.0, ny * 4.0, 4, 0.5, 2.0);
                    chainNoise = Math.pow(chainNoise, 1.5);
                    const islandThreshold = 0.5;
                    landValue = (chainNoise > islandThreshold) ? chainNoise : 0;
                    break;
                }
                case 'Inland Sea': {
                    const ringGradient = Math.pow(1.0 - d, 0.5) * 1.2;
                    const seaShapeNoise = fbm(landmassNoise, nx * 2.0, ny * 2.0, 3, 0.5, 2.0);
                    const islandNoise = fbm(baseNoise, nx * 8.0, ny * 8.0, 3, 0.5, 2.0);

                    let baseLand = 0.8 - ringGradient + seaShapeNoise * 0.2;
                    
                    if (d < 0.8 && islandNoise > 0.6) {
                        baseLand += 0.2;
                    }
                    if (Math.random() > 0.4) { 
                        let channel;
                        if (side === 'n' || side === 's') channel = Math.abs(nx - 0.5);
                        else channel = Math.abs(ny - 0.5);
                        if (channel < 0.1) baseLand -= 0.5;
                    }
                    landValue = baseLand;
                    break;
                }
                case 'Peninsula': {
                    const mainlandNoise = fbm(landmassNoise, nx * 2.0, ny * 2.0, 4, 0.5, 2.0);
                    let mainland = 0;
                    if (side === 'n') mainland = 1.0 - ny;
                    if (side === 's') mainland = ny;
                    if (side === 'w') mainland = 1.0 - nx;
                    if (side === 'e') mainland = nx;

                    const peninsulaBody = (fbm(baseNoise, nx * 1.5, ny * 1.5, 4, 0.5, 2.0) - d * 0.5);
                    landValue = Math.max(mainland * 0.7, peninsulaBody) + mainlandNoise * 0.1;
                    break;
                }
                 case 'Isthmus':
                    const v = fbm(landmassNoise, nx * 4.0, ny * 1.0, 4, 0.5, 2.0);
                    const h = fbm(landmassNoise, nx * 1.0, ny * 4.0, 4, 0.5, 2.0);
                    landValue = Math.max(v, h) - d * 0.2;
                    break;
                case 'Coastline':
                    landValue = noise * 0.3;
                    if (side === 'n') landValue += (1.0 - ny);
                    if (side === 's') landValue += ny;
                    if (side === 'w') landValue += (1.0 - nx);
                    if (side === 'e') landValue += nx;
                    break;
                case 'Landlocked':
                    landValue = 1.0;
                    break;
                case 'Volcanic Island':
                     landValue = 0.8 - (d * (1.2 - (noise * 0.8)));
                     break;
                case 'Pangea':
                    landValue = noise - (d * 0.3);
                    break;
                case 'Continent':
                default:
                    landValue = noise - (d * 0.2);
                    break;
            }

            // 2. Set a global "sea level".
            const seaLevel = 0.35;
            if (landValue < seaLevel && mapType !== 'Landlocked') {
                 hexes[coord] = { terrain: "Ocean", pois: [], content: "", gmNotes: "" };
                 continue;
            }

            // 3. For land hexes, calculate detailed elevation.
            const baseElev = fbm(baseNoise, nx * 8.0, ny * 8.0, 4, 0.6, 2.0);
            const mountains = fbm(mountainNoise, nx * 22.0, ny * 22.0, 8, 0.45, 2.2);
            let elevation = (baseElev * 0.5) + (mountains * 0.5); 
            elevation = Math.pow(elevation, elevationExponent);

            // 4. Generate moisture
            let moisture = fbm(moistNoise, nx * 12.0, ny * 12.0, octaves, persistence, lacunarity);
            moisture = Math.pow(moisture, climateExponent);

            const terrain = getTerrain(elevation, moisture);
            hexes[coord] = { terrain, pois: [], content: "", gmNotes: "" };
        }
    }

    identifyLakes(width, height, hexes);

    return hexes;
}

const MapGenerator = {
    generateMapData,
    filterPOIsByContext // NEW: Export the filtering function
};

export default MapGenerator;