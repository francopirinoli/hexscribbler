// TableRoller.js - The logic engine for processing the random table data.

// REMOVED: import { tables } from './tables/index.js'; (No longer directly needed for description)
import DescriptionGenerator from './DescriptionGenerator.js'; // NEW: Import the new generator

// --- This entire section of POI selection logic remains unchanged ---
// It is still required by main.js for the initial map generation process.
const POI_CHANCES = {
    Plains: {
        chance: 0.20,
        types: [
            { type: "Settlement", weight: 12 }, { type: "Ruins", weight: 5 }, { type: "Oddity", weight: 3 },
            { type: "Sepulcher", weight: 2 }, { type: "Stronghold", weight: 2 }, { type: "Castle", weight: 1 },
            { type: "Tower", weight: 1 }, { type: "Port", weight: 1 }
        ]
    },
    Forest: {
        chance: 0.25,
        types: [
            { type: "Lair", weight: 8 }, { type: "Ruins", weight: 6 }, { type: "Dungeon", weight: 5 },
            { type: "Cave", weight: 5 }, { type: "Oddity", weight: 4 }, { type: "Sepulcher", weight: 2 },
            { type: "Tower", weight: 2 }
        ]
    },
    Mountain: {
        chance: 0.30,
        types: [
            { type: "Mine", weight: 10 }, { type: "Dungeon", weight: 8 }, { type: "Lair", weight: 6 },
            { type: "Cave", weight: 6 }, { type: "Stronghold", weight: 4 }, { type: "Tower", weight: 3 },
            { type: "Ruins", weight: 2 }, { type: "Oddity", weight: 1 }
        ]
    },
    Swamp: {
        chance: 0.22,
        types: [
            { type: "Lair", weight: 10 }, { type: "Ruins", weight: 8 }, { type: "Dungeon", weight: 5 },
            { type: "Sepulcher", weight: 4 }, { type: "Oddity", weight: 3 }, { type: "Cave", weight: 2 },
            { type: "Pirate Hideout", weight: 1 }
        ]
    },
    Desert: {
        chance: 0.15,
        types: [
            { type: "Ruins", weight: 10 }, { type: "Oddity", weight: 6 }, { type: "Sepulcher", weight: 3 },
            { type: "Lair", weight: 2 }, { type: "Mine", weight: 1 }, { type: "Port", weight: 1 }
        ]
    },
    Hills: {
        chance: 0.28,
        types: [
            { type: "Cave", weight: 8 }, { type: "Ruins", weight: 6 }, { type: "Lair", weight: 6 },
            { type: "Mine", weight: 5 }, { type: "Dungeon", weight: 5 }, { type: "Stronghold", weight: 4 },
            { type: "Settlement", weight: 4 }, { type: "Sepulcher", weight: 3 }, { type: "Tower", weight: 3 },
            { type: "Castle", weight: 2 }, { type: "Port", weight: 1 }
        ]
    },
    Ocean: {
        chance: 0.05,
        types: [
            { type: "Shipwreck", weight: 10 }, { type: "Oddity", weight: 5 }, { type: "Pirate Hideout", weight: 3 },
            { type: "Lair", weight: 2 }
        ]
    },
    Lake: {
        chance: 0.10,
        types: [
            { type: "Shipwreck", weight: 8 }, { type: "Oddity", weight: 6 }, { type: "Lair", weight: 3 },
        ]
    },
    default: { chance: 0.0, types: [] }
};

const SETTLEMENT_TYPES = [
    { type: "Hamlet", weight: 60 }, { type: "Town", weight: 30 }, { type: "City", weight: 10 }
];

function weightedRoll(weightedArray) {
    if (!Array.isArray(weightedArray) || weightedArray.length === 0) return null;
    const totalWeight = weightedArray.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    for (const item of weightedArray) {
        if (random < item.weight) {
            return item.type;
        }
        random -= item.weight;
    }
    return null;
}

function rollForPOI(terrainType) {
    // This function's logic is unchanged.
    const settings = POI_CHANCES[terrainType] || POI_CHANCES.default;
    if (Math.random() < settings.chance) {
        let poiType = weightedRoll(settings.types);
        if (poiType === "Settlement") {
            const settlementType = weightedRoll(SETTLEMENT_TYPES);
            if (settlementType) {
                return [settlementType];
            }
        }
        if (poiType) {
            return [poiType];
        }
    }
    return [];
}
// --- End of unchanged POI selection logic ---


// --- REWRITTEN Public API ---

// This function is now a simple passthrough to the new DescriptionGenerator.
function generateHexDescription(hexData, pathInfos) { // Now accepts pathInfos (plural)
    return DescriptionGenerator.generateDescription(hexData, pathInfos);
}

const TableRoller = {
    generateHexDescription,
    rollForPOI,
    // These helpers are still needed by main.js
    getPOISettings: (terrain) => POI_CHANCES[terrain] || POI_CHANCES.default,
    getSettlementTypes: () => SETTLEMENT_TYPES,
    weightedRoll: weightedRoll
};

export default TableRoller;