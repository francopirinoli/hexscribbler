// IconManager.js - Module for loading and managing SVG icons for the canvas

const ICONS_TO_LOAD = {
    // --- Existing Icons ---
    Cave: './icons/cave-entrance.svg',
    Ruins: './icons/ruins.svg',
    Tower: './icons/wizard-tower.svg',
    Oddity: './icons/spark-symbol.svg',
    Sepulcher: './icons/tombstone.svg',

    // --- Expanded Icons for New POI Types ---
    // Settlement Types
    Hamlet: './icons/village.svg',
    Town: './icons/town.svg',
    City: './icons/citadel.svg',

    // Dungeon & Lair Types
    Dungeon: './icons/dungeon-gate.svg',
    Lair: './icons/monster-lair.svg',

    // Structure Types
    Castle: './icons/castle.svg',
    Stronghold: './icons/fortress.svg',
    Mine: './icons/mine-entrance.svg',

    // Water & Coastal Types
    Port: './icons/anchor.svg',
    Shipwreck: './icons/shipwreck.svg',
    // --- THIS IS THE CORRECTED LINE ---
    'Pirate Hideout': './icons/pirate.svg', // Key is now a string to include the space

    // Default fallback icon
    default: './icons/round-pin.svg'
};

const icons = {};
let loaded = false;

// Pre-loads all the specified SVG icons into Image objects
async function loadIcons() {
    if (loaded) return;

    const promises = Object.entries(ICONS_TO_LOAD).map(([key, path]) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                icons[key] = img;
                resolve();
            };
            img.onerror = () => {
                console.error(`Failed to load icon: ${path}`);
                // Resolve anyway so one missing icon doesn't break the app
                resolve(); 
            };
            img.src = path;
        });
    });

    await Promise.all(promises);
    loaded = true;
    console.log("All POI icons loaded successfully.");
}

// Returns the pre-loaded Image object for a given icon key
function getIcon(key) {
    if (key === 'all') return icons; // Allows us to get the whole object
    return icons[key] || icons.default;
}

const IconManager = {
    loadIcons,
    getIcon
};

export default IconManager;