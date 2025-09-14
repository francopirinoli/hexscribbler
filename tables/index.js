// tables/index.js - The Data Aggregator

import { tables as generic } from './tables-generic.js';
import { tables as npcs } from './tables-npcs.js';
import { tables as forest } from './tables-forest.js';
import { tables as plains } from './tables-plains.js';
import { tables as mountain } from './tables-mountain.js';
import { tables as desert } from './tables-desert.js';
import { tables as swamp } from './tables-swamp.js';
import { tables as ocean } from './tables-ocean.js';
import { tables as hills } from './tables-hills.js';
import { tables as lake } from './tables-lake.js';
import { tables as ruins } from './tables-poi-ruins.js';
import { tables as sepulcher } from './tables-poi-sepulcher.js';
import { tables as oddity } from './tables-poi-oddity.js';
import { tables as tower } from './tables-poi-tower.js';
import { tables as cave } from './tables-poi-cave.js';
import { tables as settlement } from './tables-poi-settlement.js';
import { tables as character_creation } from './tables-character-creation.js';
import { tables as character_traits } from './tables-character-traits.js';
import { tables as character_details } from './tables-character-details.js';
import { tables as character_paths } from './tables-character-paths.js';
import { tables as world_building } from './tables-world-building.js';
import { tables as civilization_cities } from './tables-civilization-cities.js';
import { tables as civilization_details } from './tables-civilization-details.js';
import { tables as maritime } from './tables-maritime.js';
import { tables as dungeon_creation } from './tables-dungeon-creation.js';
import { tables as dungeon_details } from './tables-dungeon-details.js';
import { tables as dungeon_features } from './tables-dungeon-features.js';
import { tables as magic } from './tables-magic.js';
import { tables as plot_hooks } from './tables-plot-hooks.js';
import { tables as names } from './tables-names.js'; // NEW

export const tables = {
    generic,
    npcs,
    names, // NEW
    character_creation,
    character_traits,
    character_details,
    character_paths,
    world_building,
    civilization: {
        cities: civilization_cities,
        details: civilization_details
    },
    maritime,
    dungeon: {
        creation: dungeon_creation,
        details: dungeon_details,
        features: dungeon_features
    },
    magic,
    plot_hooks,
    poi: {
        Ruins: ruins,
        Sepulcher: sepulcher,
        Oddity: oddity,
        Tower: tower,
        Cave: cave,
        Settlement: settlement,
    },
    Forest: forest,
    Plains: plains,
    Mountain: mountain,
    Desert: desert,
    Swamp: swamp,
    Ocean: ocean,
    Hills: hills,
    Lake: lake,
};