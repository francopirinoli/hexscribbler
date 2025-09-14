// DescriptionGenerator.js - The new engine for creating dynamic hex descriptions.

import { tables } from './tables/index.js';

// --- Private Helper Functions ---

// Rolls on a standard, unweighted array.
function roll(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
}

// Resolves a string template containing placeholders like ${path.to.table}.
function resolveString(templateStr) {
    if (typeof templateStr !== 'string') return '';
    const placeholderRegex = /\$\{([^}]+)\}/g;

    const replacer = (match, tablePath) => {
        const pathParts = tablePath.split('.');
        let currentTable = tables;
        for (const part of pathParts) {
            currentTable = currentTable ? currentTable[part] : undefined;
        }
        if (Array.isArray(currentTable)) {
            return resolveString(roll(currentTable));
        }
        // Fallback for an invalid path
        return `[INVALID TABLE: ${tablePath}]`;
    };
    
    // Recursively resolve until no placeholders are left.
    let resolvedStr = templateStr;
    let lastStr = "";
    while (resolvedStr.includes('${') && resolvedStr !== lastStr) {
        lastStr = resolvedStr;
        resolvedStr = resolvedStr.replace(placeholderRegex, replacer);
    }
    return resolvedStr;
}


// --- Core Description Templates ---
// --- FIX: All lowercase biome paths (e.g., plains.landmarks) have been corrected to uppercase (e.g., Plains.landmarks).
// --- FIX: All incorrect paths starting with "tables." have been corrected (e.g., tables.fantasy -> names.fantasy).
// --- FIX: All incorrect civilian.cities paths corrected to civilian.details

const templates = {
    Plains: {
        templates: [
            {
                title: "${Plains.landmarks} of the ${generic.npc_adjectives} ${npcs.species}",
                intro: "The endless sea of grass is interrupted by the sight of ${Plains.features}. Local legend, as told by a wandering ${npcs.class} named ${npcs.generic_names}, calls this place '${world_building.landmark_names}'.",
                details: "The landmark is said to be ${Plains.landmark_legends}. The air here carries a strange feeling of ${generic.magical_auras}, and the ground is littered with ${Plains.ground_cover}."
            },
            {
                title: "The ${world_building.grassland_plain_names}",
                intro: "You find yourself in a vast expanse of ${Plains.terrain_adjectives} grassland, stretching as far as the eye can see under a sky filled with ${Plains.sky_features}. The wind whispers tales of the ${generic.legends}.",
                details: "This region is known for its ${Plains.natural_features}. A ${generic.npc_adjectives} ${npcs.class} might be seen here, currently ${generic.motivations}. The area is under the influence of a ${generic.weather_effects}."
            },
            {
                title: "The Aftermath of the ${world_building.years_of_historical_importance}",
                intro: "Evidence of a great historical event marks this land. You see ${Plains.battle_evidence} scattered across the fields. It is clear this was once the site of a ${plot_hooks.thirty_six_plots_1}.",
                details: "Locals whisper that this area is now haunted by ${generic.guardians}. The defining moment of the conflict was when a hero managed to ${Plains.heroic_deeds}. Now, the only things that grow here are tough ${Plains.vegetation}."
            },
            {
                title: "A ${generic.npc_adjectives} Herd",
                intro: "A massive herd of ${Plains.herd_animals} dominates the landscape, their calls echoing across the plains. They are watched over by a lone ${npcs.class} who seems ${Plains.shepherd_trait}.",
                details: "The herd is moving towards ${world_building.map_features_4}. The shepherd, ${npcs.generic_names}, is worried because of rumors that ${generic.rumors}. They offer a ${generic.mundane_treasures} in exchange for assistance."
            },
            {
                title: "The ${names.traditional.female} River Crossing",
                intro: "A ${Plains.river_adjectives} river, known locally as the '${world_building.river_names_1}', carves its way through the plains. A simple ${Plains.crossing_type} offers a way across.",
                details: "The water is home to ${Plains.river_life}. On the far bank, a ${generic.npc_adjectives} traveler is ${Plains.traveler_activity}. They warn that the river is cursed with ${generic.curses}."
            }
        ],
        encounters: [
            "a herd of wild horses", "a flock of vultures circling overhead", "a merchant caravan heading to ${world_building.town_names_1}",
            "a lone rider on the horizon", "a nomadic tribe on the move", "a territorial Manticore",
            "a pride of lions", "a grazing herd of Antelopes", "a territorial Hippogriff",
            "a band of Gnolls on patrol", "a lone, armored Knight on a quest from the ${character_paths.paladin_orders}",
            "a flock of Giant Eagles", "a nest of Giant Ants", "a higher-level Baboon", "a green Dragon",
            "a group of Halflings searching for a lost family recipe", "a group of Men, Nomads", "a Giant Scorpion",
            "a wandering Troll looking for a bridge to live under", "a company of Human Mercenaries from the '${names.fantasy.adventuring_groups}'",
            "a hunting party of Tribesmen seeking a ${Plains.herd_animals}"
        ],
        discoveries: [
            "a patch of rare ${Plains.vegetation}", "an arrowhead of ${generic.rare_materials} craftsmanship", "a bison wallow, recently used",
            "a clear view for miles, revealing a ${world_building.map_features_3} in a distant hex", "an ancient, weathered boundary stone from a forgotten kingdom",
            "a lone, massive ${Plains.tree_type} tree in the middle of the plains", "a small, half-buried chest containing old maps of the ${world_building.evil_realm_names}",
            "a circle of standing stones that hums with ${generic.magical_auras}", "the sun-bleached skeleton of a giant",
            "a natural spring providing clean water, rumored to have minor healing properties"
        ]
    },
    Forest: {
        templates: [
            {
                title: "The ${generic.npc_adjectives} Grove of ${names.fantasy.sylvan}",
                intro: "You enter a part of the forest that feels ancient and untouched. Towering ${Forest.tree_type} trees form a dense canopy, and the air is thick with the scent of ${Forest.smells}. A sense of ${generic.magical_auras} hangs in the air, suggesting this place is under a powerful, old magic.",
                details: "A small, clear pool of water, a feature known as a ${Forest.water_features}, sits at the center of the grove. Strange, glowing ${Forest.vegetation} grows along its banks. The only sounds are the whispering of the wind and the distant call of a ${Forest.animal_sounds}."
            },
            {
                title: "The Hunter's Path through ${world_building.forest_names}",
                intro: "An overgrown game trail, barely visible, winds its way through the dense undergrowth. The path is marked by ${Forest.path_features}. It feels as if this trail hasn't been used by civilized folk for many years, though you see the fresh tracks of a ${Forest.animal_tracks}.",
                details: "The trail seems to be leading towards a ${world_building.map_features_2}. This path is currently used by a reclusive ${npcs.class} named ${npcs.generic_names}, who is known to be ${generic.motivations}. The deeper woods are rumored to be home to ${generic.guardians}."
            },
            {
                title: "The Blighted Wood of the ${plot_hooks.thirty_six_plots_2}",
                intro: "The forest changes abruptly here. The trees become twisted and sick, with ${Forest.blighted_features}. A foul smell of ${dungeon.details.dungeon_wall_contents} hangs in the stagnant air, and an unnatural silence blankets the area.",
                details: "This corruption is said to be the result of ${Forest.blight_causes}. The ground is spongy and damp, littered with the bones of small animals and strange, sickly ${Forest.vegetation}. This place is a known lair for ${Forest.blighted_creatures}."
            },
            {
                title: "The Murmuring ${world_building.river_names_1}",
                intro: "The sound of running water grows louder, leading you to a ${Forest.stream_features}. The water is ${Forest.water_properties} and flows over moss-covered stones. A fallen log, serving as a ${Forest.stream_crossing}, spans the water.",
                details: "On the far bank, you see clear evidence of a ${Forest.campsite_evidence}. The stream is known to be a source of ${Forest.stream_life}. Local folklore claims the stream is haunted by the spirit of a ${generic.npc_adjectives} ${npcs.species} who suffered a great tragedy here."
            },
            {
                title: "An Echo of the ${world_building.defining_national_moment}",
                intro: "The forest floor is unnaturally clear here, littered with the remnants of a great battle from a bygone era. You see ${Forest.battle_remains} half-buried in the soil and tangled in roots.",
                details: "This was the site of a skirmish involving a ${character_paths.warrior_path}. A famous ${npcs.class} named ${names.traditional.male} is said to have performed ${Forest.heroic_deeds} on this very spot. The area is now considered taboo, and some say you can still hear the faint sounds of conflict when the wind is high."
            }
        ],
        encounters: [
            "a foraging brown bear and its cubs", "a patrol of elven scouts from the ${world_building.forest_names}",
            "a lost child searching for their way back to a village in the ${world_building.lowland_names_1}",
            "a band of Orcs, led by a fearsome ${character_paths.barbarian_tribes_1} chieftain",
            "a giant spider descending from its web, its eyes glowing with malevolent intelligence",
            "a wise old Centaur who offers cryptic advice based on a ${plot_hooks.adventure_awakening_discovery}",
            "a territorial Owlbear guarding its kill, a freshly caught ${Forest.forest_creatures}",
            "a mischievous Pixie who wants to play a game for a ${generic.mundane_treasures}",
            "a hungry Troll demanding a toll to cross a decrepit ${Forest.stream_crossing}",
            "a group of Bugbears setting an ambush near a patch of dense ${Forest.undergrowth}",
            "a pack of wolves led by a massive, scarred alpha",
            "a lone Dryad tending to her grove of ${Forest.tree_type} trees",
            "a group of Goblins who have lost their way and are arguing over a crude map",
            "a territorial Griffon protecting its nest, which contains a glimmer of something valuable"
        ],
        discoveries: [
            "a patch of rare ${Forest.vegetation}, useful for ${magic.magic_item_creation_flavor}",
            "a stream with clear, cool water that has minor ${Forest.water_properties}",
            "an oddly shaped stone that resembles a ${dungeon.features.chest_composition} chest",
            "an abandoned hunter's blind, containing a forgotten ${character_paths.secret_weapons}",
            "a ${Forest.tree_type} tree with a face carved into its bark, which weeps real tears",
            "a small, overgrown shrine to a forgotten deity, with a small offering of ${civilization.details.caravan_goods_1}",
            "a hastily abandoned campsite, with a coded message left pinned to a tree",
            "a single, perfect feather from a rare bird, possibly a ${character_paths.animal_companions_exotic}",
            "a small cave hidden behind a waterfall, containing the diary of a long-lost explorer",
            "the tracks of a very large, unknown creature leading towards the ${world_building.mountain_names_1}"
        ]
    },
    Mountain: {
        templates: [
            {
                title: "The ${generic.npc_adjectives} Climb up ${world_building.mountain_names_2}",
                intro: "A treacherous path, known locally as the ${character_paths.road_names}, clings to the mountainside. The air grows thin, and a ${Mountain.weather} wind howls through the crags, carrying tales of the ${generic.legends}.",
                details: "Loose scree makes the footing difficult, and the path is barely wide enough for two to walk abreast. This is an ideal spot for an ambush by ${Mountain.ambushers}. Far below, the valley floor is shrouded in mist, concealing ${Mountain.valley_sights}."
            },
            {
                title: "The Lost ${dungeon.creation.dungeon_type} of ${world_building.mountain_names_1}",
                intro: "Half-buried by an ancient avalanche, you discover the entrance to a forgotten place: a ${dungeon.creation.dungeon_entrances_1}. The stonework is clearly of ${Mountain.stonework_origin} design, though it is now cracked and weathered.",
                details: "Legends from a nearby clan of ${npcs.species} claim this place is haunted by ${generic.guardians} and holds the ${generic.mundane_treasures} of a long-dead ${npcs.class}. A chilling draft emanates from within, carrying the scent of ${Mountain.underground_smells} and the promise of ${dungeon.creation.dungeon_legends}."
            },
            {
                title: "The Eyrie of the ${character_paths.animal_companions_exotic}",
                intro: "Massive tracks and ${Mountain.lair_signs} mark the entrance to a high-altitude cave. The ground is littered with the bones of ${Mountain.prey_remains}, suggesting the inhabitant is a formidable predator.",
                details: "The cave serves as the lair for a territorial ${Mountain.peak_predators}. Inside, beyond the stench, a nest made of ${Mountain.nesting_materials} can be seen. Glimmering amongst the refuse is a ${dungeon.features.chest_contents} of a ${generic.npc_adjectives} explorer who fell prey to the beast."
            },
            {
                title: "The Hermitage of ${names.traditional.male} the ${generic.npc_adjectives}",
                intro: "Clinging to a seemingly inaccessible ledge is a small, isolated dwelling: a ${Mountain.dwelling_type}, built from stone and scavenged timber. A thin plume of smoke rises from a chimney, a lonely sign of life in this desolate landscape.",
                details: "The inhabitant is a ${generic.npc_adjectives} ${npcs.species} ${npcs.class} who is ${generic.motivations}. They are wary of strangers but might offer shelter in exchange for news from the lowlands or help with a problem, such as ${npcs.current_situation}."
            },
            {
                title: "The ${world_building.landmark_names}",
                intro: "The mountain's peak here is unlike any other. It takes the form of a ${Mountain.strange_formation}, a geological marvel that defies easy explanation. A powerful aura of ${generic.magical_auras} radiates from the site.",
                details: "Local tribes believe this formation is ${Mountain.formation_legends}. Climbing it is said to grant visions, but the ascent is perilous, guarded by ${Mountain.natural_guardians}. At its heart lies a vein of pure ${generic.rare_materials}."
            }
        ],
        encounters: [
            "a herd of territorial mountain goats", "a powerful Griffon guarding its nest", "a lost traveler suffering from exposure",
            "a flight of Wyverns on the hunt", "a clan of suspicious Dwarves from the ${world_building.mountain_names_1} stronghold",
            "a Roc circling its nest high above on ${world_building.mountain_names_2}", "a hungry Hill Giant looking for an easy meal",
            "a Manticore hunting for prey among the crags", "a patrol of Orcs from a mountain fortress", "a reclusive Cyclops in a secluded cave",
            "a tribe of Kobolds defending their mine, which produces ${civilization.details.caravan_goods_2}",
            "a flight of Giant Bats emerging from a cave at dusk", "a Red Dragon, drawn by the scent of ${civilization.details.caravan_goods_3}",
            "a Stone Giant, who believes the party are trespassers on sacred ground",
            "a Neanderthal hunting party tracking a ${Mountain.prey_remains}"
        ],
        discoveries: [
            "an abandoned mine entrance, with a sign in Dwarvish reading '${dungeon.creation.dungeon_names}'",
            "a patch of rare mountain herbs known for their use in ${magic.magic_item_creation_flavor}",
            "a breathtaking scenic overlook of the surrounding hexes", "a weathered trail marker pointing towards a place of ${generic.legends}",
            "a waterfall cascading into a crystal-clear, ice-cold pool", "the entrance to a hidden cave system, rumored to be a ${dungeon.creation.dungeon_entrances_2}",
            "a precarious rope bridge spanning a deep chasm, left by a forgotten ${names.fantasy.adventuring_groups}",
            "the nest of a giant eagle, containing a single, enormous egg that hums with ${generic.magical_auras}",
            "the fossilized skeleton of a massive, unknown creature embedded in the rock face",
            "an ancient, crumbling watchtower with a commanding view of the ${world_building.grassland_plain_names} below"
        ]
    },
    Hills: {
        templates: [
            {
                title: "The Barrows of the ${character_paths.barbarian_tribes_2}",
                intro: "The rolling green landscape is punctuated by a series of ancient, grassy mounds. A palpable feeling of ${generic.magical_auras} hangs in the air, a silent testament to the forgotten dead who rest here.",
                details: "These are the burial mounds of a ${Hills.sub_tables.barrow_person} from a bygone age. According to a local shepherd named ${npcs.generic_names}, the barrows are protected by ${generic.guardians} and a powerful ${generic.curses} against grave robbers. A single, weathered standing stone marks the entrance to the largest mound."
            },
            {
                title: "The Winding ${world_building.road_names} of ${names.traditional.female}",
                intro: "An old road, paved with cracked and mossy ${generic.building_materials}, meanders through the hills. Though long neglected, its skilled construction suggests it was built by a ${Hills.sub_tables.winding_walkway_builders}. A lone shrine to ${Hills.sub_tables.roadside_shrine_dedication} stands beside it.",
                details: "The road is now mostly used by nomadic tribes and the occasional ${generic.npc_occupations}. It's rumored to lead towards the ruins of ${world_building.evil_realm_names}. The journey is perilous; the surrounding scrub provides excellent cover for a ${Hills.encounters}."
            },
            {
                title: "The Lair in ${world_building.lowland_names_1}",
                intro: "Tucked into the side of a steep, gorse-covered hill is the entrance to a cave, marked by ${Mountain.lair_signs} and the stench of carrion. The ground is littered with the remains of ${Mountain.prey_remains}, its victims.",
                details: "This cave is the den of a notoriously cunning ${Mountain.peak_predators}. The creature has a hoard of treasures taken from its victims, including a ${dungeon.features.chest_contents} and a pouch containing a strange ${magic.artifacts}."
            },
            {
                title: "The Tor of the ${world_building.constellations}",
                intro: "A massive tor of weathered granite, known as ${Hills.sub_tables.haglefs_hill_legend}, dominates the local landscape. It is a natural landmark for leagues in every direction and is covered in carvings of ${poi.Cave.sub_tables.ancient_rituals_petroglyphs}.",
                details: "The tor is considered a sacred site by a local clan of ${npcs.species}, who believe it to be a bridge to the spirit world. Climbing it is said to grant visions, but the ascent is treacherous, and the peak is the nesting ground for a territorial ${character_paths.animal_companions_exotic}."
            },
            {
                title: "The Secluded Dale of ${names.fantasy.sylvan}",
                intro: "You discover a hidden valley nestled between the hills, a pocket of lush greenery sheltered from the wind. A small stream, the '${world_building.river_names_2}', chuckles merrily as it flows through the dell.",
                details: "This dale is home to a reclusive community of ${npcs.species} herbalists, led by a ${generic.npc_adjectives} elder who is ${generic.motivations}. They are known for cultivating rare ${Forest.vegetation} and are willing to trade for news or protection from the ${generic.rumors} that trouble them."
            }
        ],
        encounters: [
            "a flock of Giant Eagles hunting for sheep", "a band of Orcs on patrol from their stronghold in the ${world_building.mountain_names_1}",
            "a hungry Hill Giant looking for an easy meal", "a mischievous band of Goblins led by a chief with a ${magic.magic_items_1}",
            "a herd of wild goats with a massive, scarred billy goat leader", "a territorial Griffon protecting its nest on a high tor",
            "a lone, grizzled prospector leading a mule laden with mining gear from a nearby ${dungeon.creation.dungeon_type}",
            "a Bugbear scouting party setting up a crude camp for the night", "a patrol of wary human guards from a nearby ${poi.Settlement.sub_tables.village_protection}",
            "a nomadic Centaur hunting party, tracking a wounded ${Mountain.prey_remains}",
            "a verbose Galeb Duhr poet who demands an audience for its latest ode"
        ],
        discoveries: [
            "a small, hidden cave behind a patch of thorny gorse bushes, containing a ${dungeon.features.secret_compartment_contents}",
            "an ancient, moss-covered standing stone with faint carvings depicting the ${world_building.constellations}",
            "a narrow goat-path leading to a breathtaking overlook of the adjacent hexes",
            "the entrance to an old, abandoned mine, its timbers rotting and collapsed",
            "a patch of rare, hardy hill flowers used in making potent ${civilization.details.caravan_goods_3}",
            "a territorial dispute between two families of badgers over a particularly comfortable burrow",
            "a collapsed hunter's trap containing the skeletal remains of a ${generic.npc_occupations}",
            "a beautifully illustrated, but waterlogged, book of local folklore left by a traveler"
        ]
    },
    Swamp: {
        templates: [
            {
                title: "The Sunken ${world_building.landmark_names} of the ${plot_hooks.thirty_six_plots_1}",
                intro: "Half-submerged in the murky, stagnant water are the crumbling remains of a forgotten structure. Gnarled ${Swamp.tree_type} trees, draped in weeping moss, stand like silent sentinels over the ruins.",
                details: "This was once a ${generic.building_materials} shrine dedicated to a ${Swamp.forgotten_deity}. Now, it is the lair of a territorial ${Swamp.swamp_predators}. The air is thick with the buzzing of insects and the foul scent of ${Swamp.smells}. Diving into the muck could reveal lost treasures, but also risks the ${generic.curses} said to protect this place."
            },
            {
                title: "The Witch's Path through the ${world_building.marshland_names}",
                intro: "A rickety boardwalk, slick with algae, offers a treacherous path through the bog. Strange, carved fetishes made of bone and wood hang from the trees on either side, marking the way. A sense of powerful, but ${generic.npc_adjectives}, magic pervades.",
                details: "The path was created by a reclusive swamp witch named ${names.traditional.female}, who is said to be ${generic.motivations}. Following the path might lead to her hut, but straying from it means facing the swamp's natural dangers, such as ${Swamp.natural_hazards} and the hungry ${Swamp.swamp_creatures} that lurk just beneath the water's surface."
            },
            {
                title: "The Whispering Reeds of ${names.fantasy.sylvan}",
                intro: "You enter a vast stand of tall, thick reeds that rustle and sway in the slight breeze. The movement creates a constant, sibilant whispering that seems to follow you, telling tales of ${generic.legends}.",
                details: "This area is home to a tribe of secretive ${Swamp.swamp_dwellers}. They are wary of outsiders and use the reeds for cover. Within the deepest part of the reed bed is a hidden island where they conduct their rituals, protected by cunningly concealed ${dungeon.features.trap_detail_1}."
            },
            {
                title: "The Blighted Fen of the ${magic.artifacts}",
                intro: "The water here is a sickly, iridescent sheen, and the plants are twisted into unnatural shapes. A profound sense of ${generic.magical_auras} suggests a magical catastrophe occurred here long ago.",
                details: "This blight was caused by ${Swamp.blight_causes}. The area is now a haven for corrupted and mutated creatures, such as ${Swamp.mutated_creatures}. It is rumored that the source of the corruption, a powerful ${magic.artifacts}, lies at the heart of the fen, guarded by a powerful ${generic.guardians}."
            },
            {
                title: "The Isle of the ${character_paths.barbarian_tribes_1}",
                intro: "A large, stable island rises from the swamp, covered in a dense thicket of ${Forest.tree_type} trees. The smoke of cookfires drifts through the air, and the sound of crude drums echoes across the water.",
                details: "This island serves as the stronghold for a clan of swamp-dwelling barbarians. They are led by a ${generic.npc_adjectives} chieftain who proudly wields a ${magic.magic_items_2}. They are hostile to intruders but might be willing to trade rare herbs or offer safe passage in exchange for a service, such as dealing with the nearby ${Swamp.swamp_predators}."
            }
        ],
        encounters: [
            "a territorial Bullywug patrol, demanding tribute", "a swarm of giant, blood-sucking insects",
            "a lost ghost, endlessly searching for its sunken home", "a hungry Shambling Mound, camouflaged as a heap of vegetation",
            "a young Black Dragon, testing its new breath weapon on unfortunate wildlife",
            "a nest of Giant Crocodiles, guarding their clutch of eggs", "a colony of Giant Leeches in a particularly deep pool",
            "a Lizardfolk warband, their scales painted for an upcoming raid",
            "a Medusa luring travelers to her lair with promises of dry land",
            "a band of desperate outlaws, hiding from the law in the trackless bog",
            "a nest of Giant Spiders, their webs spanning between ancient cypress trees",
            "a hungry Will-O-Wisp, trying to lead the party into a patch of ${Swamp.natural_hazards}"
        ],
        discoveries: [
            "a patch of glowing, phosphorescent fungus that provides a dim, eerie light",
            "the half-submerged ruins of a small building, its purpose long forgotten",
            "a strange, alien-looking flower that closes when touched",
            "an old, rusted iron cage hanging from a tree, its door broken and bent outwards",
            "a series of carved wooden totems, depicting frog-like humanoids",
            "an abandoned boat, half-sunk and tangled in the reeds, containing a waterlogged diary",
            "a patch of deep quicksand, with a single skeletal arm reaching out from its surface",
            "a small, secluded island of solid ground, perfect for a safe resting place",
            "the skeletal remains of a massive beast half-sunk in the muck, with a ${magic.magic_items_3} lodged in its ribs"
        ]
    },
    Desert: {
        templates: [
            {
                title: "The Endless Sea of ${world_building.desert_names}",
                intro: "An ocean of shimmering sand dunes stretches to the horizon under a merciless, brassy sun. The wind, a constant whisper, carries tales of the ${generic.legends} and reshapes the landscape, erasing any tracks you leave behind.",
                details: "Survival here is a constant battle against the elements. A distant, shimmering ${desert.sub_tables.mirage_shows} offers a sliver of hope, or a deadly deception. The ground is littered with the sun-bleached bones of creatures that succumbed to the desert's embrace, and the only vegetation is the occasional hardy ${desert.sub_tables.horned_titan_grass}."
            },
            {
                title: "The Buried Necropolis of ${names.real_world.egyptian.male}",
                intro: "The shifting sands have revealed the top of a forgotten structure: a ${desert.sub_tables.necropolis_centered_on}. Intricate, weathered carvings in an ancient tongue hint at a civilization that thrived here before the sands claimed it.",
                details: "This place is known to be the tomb of a powerful ${npcs.class} from a bygone era. It is now guarded by sleepless ${desert.sub_tables.necropolis_undead}. Legends say that beneath the central crypt lies a powerful ${magic.artifacts}, but it is protected by a ${generic.curses} that affects all who enter."
            },
            {
                title: "The Oasis of the ${world_building.star_names}",
                intro: "After what feels like an eternity, the scent of water and the sight of green offers a reprieve. You've found an oasis, a patch of vibrant life centered around a spring-fed pool, shaded by swaying ${Forest.tree_type} trees.",
                details: "The oasis is a neutral ground for the desert's inhabitants, and you see signs of recent visitors: ${desert.sub_tables.oasis_visitors}. The water is ${desert.sub_tables.oasis_water}, but an old hermit warns that staying too long can have strange effects, as the place is touched by the magic of a ${generic.npc_occupations} djinni."
            },
            {
                title: "The ${world_building.badland_wasteland_names} Canyon",
                intro: "The landscape changes from soft sand to a maze of rocky canyons and wind-carved mesas. These are ${desert.sub_tables.stoic_stones_gigaliths}, standing like silent sentinels. The wind howls through the narrow passages, sounding like mournful whispers.",
                details: "The canyon walls are covered in ancient petroglyphs, depicting ${desert.sub_tables.painted_petroglyphs_revelations}. This treacherous terrain is the favored hunting ground of a territorial ${Mountain.peak_predators}. A local tribe of ${npcs.species} nomads believes this place is sacred, and that the stones themselves will awaken to defend it from defilers."
            },
            {
                title: "The Skeleton of the ${names.traditional.male} Caravan",
                intro: "You come across the tragic remains of a merchant caravan, half-buried in the sand. A single ${desert.sub_tables.abandoned_wagon_condition} wagon stands as a monument to their failed journey, its canvas cover flapping in the wind.",
                details: "The scattered bones of merchants and pack animals tell a story of a sudden, violent end, likely at the hands of ${desert.encounters}. A search of the wreckage might uncover some surviving cargo, such as ${civilization.details.caravan_goods_1}, or a discarded journal detailing their fear of something they called '${desert.sub_tables.she_who_rules_herself}'."
            }
        ],
        encounters: [
            "a lost merchant caravan, desperate for water", "a territorial Sand Worm, bursting from beneath the dunes",
            "a band of desert raiders on camel-back", "a curious Djinni, offering a riddle for a reward",
            "a pack of Hyenas scavenging a carcass", "a young Blue Dragon, honing its lightning breath on cacti",
            "a Giant Scorpion, its chitin shimmering in the heat haze", "a company of Men, Nomads following the tracks of their herds",
            "a wandering Mummy, wrapped in the linen of a forgotten king", "a Giant Ant Lion waiting in its conical pit",
            "a tribe of Goblins, their skin baked red by the sun", "a Gray Worm, leaving a massive furrow in the sand in its wake",
            "a flight of Giant Vultures from a nearby ${world_building.map_features_2}",
            "a Purple Worm, its massive form a terrifying ripple under the sand"
        ],
        discoveries: [
            "a hidden oasis, not marked on any map", "the sun-bleached skeleton of a massive desert creature, possibly a dragon",
            "a patch of hardy, but edible cacti that contain potable water",
            "ruins of an ancient city half-buried in sand, with a single spire reaching for the sky",
            "a small, abandoned camp with a still-smoldering fire",
            "a series of strange, geometric patterns drawn in the sand, visible only from a high dune",
            "a petrified forest, the wooden forms turned to colorful stone over millennia",
            "the entrance to a buried tomb, sealed with a massive stone plug bearing a stern warning",
            "a dried-up well, with a frayed rope leading down into the darkness",
            "a singular, massive dune that seems to hum with a low, magical energy"
        ]
    },
    Ocean: {
        templates: [
            {
                title: "A Voyage Across the ${world_building.ocean_and_sea_names}",
                intro: "The sea is a vast, rolling expanse of deep blue under a wide, open sky. A steady wind fills the sails, and the only sounds are the creaking of the ship's timbers and the cry of a lone albatross. An old sailor whispers a superstition about ${Ocean.sub_tables.sea_madness_caused_by}.",
                details: "On the horizon, a strange sight appears: a ${Ocean.sub_tables.ghost_ship_vessel}. The crew is on edge, believing it to be an omen of ${Ocean.sub_tables.lighthouse_lies_omen}. The captain must decide whether to investigate or give it a wide berth."
            },
            {
                title: "The Fury of the ${character_paths.cleric_quests}",
                intro: "The day begins under a red sky, a warning that the old sailors heed: '${Ocean.sub_tables.sea_of_storms_prediction}'. The sea grows choppy, and the wind begins to howl like a vengeful spirit from the ${world_building.evil_realm_names}.",
                details: "The storm breaks with incredible force, a tempest that threatens to tear the ship apart. A colossal ${Ocean.sub_tables.rogue_wave_cresting} blots out the sky, threatening to send the vessel to the depths. The crew must work together to survive the storm's primary peril: ${Ocean.sub_tables.sea_of_storms_perils}."
            },
            {
                title: "A Monster from the Deep",
                intro: "An unnatural calm falls over the sea, the water becoming strangely still and glassy. The first sign of trouble is ${Ocean.sub_tables.sea_serpents_sign}. Something enormous is moving beneath the waves.",
                details: "With a tremendous roar, a monstrous ${Ocean.sub_tables.sea_serpents_breed} bursts from the water, its eyes fixed on the ship. Its attack is brutal and direct, its beak able to ${Ocean.sub_tables.krakenspawn_beaks}. The beast is a legendary creature known to sailors as '${names.fantasy.tribal_exotic}'."
            },
            {
                title: "Sail on the Horizon of the ${world_building.ocean_and_sea_names}",
                intro: "The lookout's cry echoes from the crow's nest. A ship has been spotted, a ${Ocean.sub_tables.the_chase_distance}. Its intentions are unknown as it appears to be ${Ocean.sub_tables.the_chase_speed}.",
                details: "As it draws nearer, the ship is identified as a vessel crewed by ${Ocean.sub_tables.pirates_crew}. Their captain, a notoriously ${generic.npc_adjectives} figure, is known for ${Ocean.sub_tables.pirates_captain}. A confrontation seems inevitable."
            },
            {
                title: "The Becalmed Sea of ${names.traditional.female}",
                intro: "The wind dies completely. The sails hang limp, and the ship is trapped in the oppressive quiet of the doldrums. The sea is a perfect, featureless mirror, reflecting a sun that beats down with punishing heat.",
                details: "Days could turn into weeks in this stillness. The crew grows restless, and the risk of ${Ocean.sub_tables.sea_madness_symptoms} becomes a real threat. The most reliable means of escape is said to be ${Ocean.sub_tables.doldrums_escape}, but it is a desperate gamble. Nearby, another ship, a ${Ocean.sub_tables.ghost_ship_vessel}, is also trapped, a grim reminder of what fate may await."
            }
        ],
        encounters: [
            "a pod of playful dolphins", "a flock of seagulls following the ship", "a distant ship on the horizon, possibly a ${maritime.ports_at_a_glance} patrol",
            "a lonely mermaid on a rock, singing a song of the ${plot_hooks.thirty_six_plots_2}", "a Sahuagin raiding party, their fins cutting through the water",
            "a merchant galley, low in the water and heavy with cargo from ${maritime.port_names_1}",
            "a Pirate galley, flying the flag of the notorious '${names.fantasy.adventuring_groups}'",
            "a pod of Tusked Whales, their massive forms breaching the surface", "a Dragon Turtle, mistaken for a small island at first",
            "a group of Merfolk traders, offering goods made of ${generic.rare_materials}", "a ghost ship, crewed by the damned from the ${world_building.years_of_historical_importance}"
        ],
        discoveries: [
            "a patch of strangely calm water in an otherwise choppy sea", "a floating barrel of fine, aged ${civilization.details.caravan_goods_1}",
            "a message in a bottle containing a treasure map to the ${world_building.evil_realm_names}",
            "a small, uncharted island with a single, gnarled tree", "a shipwreck, old and barnacle-covered, with its name still visible: 'The ${names.traditional.female}'",
            "a floating treasure chest, trapped with a magical ${dungeon.features.trap_detail_2}",
            "a beautiful coral reef teeming with exotic, colorful life", "a strange, magical fog that rolls in suddenly, in which whispers of the ${generic.legends} can be heard",
            "the colossal skeleton of a sea monster on the ocean floor, its ribs like the hull of a great ship"
        ]
    },
    Lake: {
        templates: [
            {
                title: "The Sunken Ruins of ${world_building.lake_names}",
                intro: "The waters of the lake are unusually clear here, revealing the submerged silhouette of a ${generic.building_materials} tower just beneath the surface. An aura of ${generic.magical_auras} rises from the depths, a silent memory of its former inhabitants.",
                details: "Local legend says this was once a ${poi.Ruins.sub_tables.weathered_wall_used_to}, which sank beneath the waves after a ${generic.curses} was unleashed. The ruin is now said to be the home of a reclusive ${Lake.lake_creatures} and may hold ${poi.Ruins.sub_tables.elf_ruin_treasures}."
            },
            {
                title: "The Isle of the ${names.fantasy.sylvan}",
                intro: "In the center of the lake sits a small, mist-shrouded island covered in a dense thicket of ${Forest.tree_type} trees. The air is unnaturally still around it, and the only sound is the gentle lapping of water against its shores.",
                details: "The island is considered taboo by locals, who believe it is the home of a reclusive ${generic.npc_occupations} named ${npcs.generic_names}. At its center stands a single, ancient ${poi.Oddity.sub_tables.island_sky_composition} stone that hums with a low, magical energy. It is said that anyone who sleeps on the island receives prophetic dreams related to a ${plot_hooks.thirty_six_plots_1}."
            },
            {
                title: "The Fisherman's Dell on ${world_building.lake_names}",
                intro: "On the shore, a small, well-kept cottage with a wisp of smoke rising from its chimney stands beside a simple wooden pier. A small boat, named '${names.traditional.female}', is tied to a post, bobbing gently in the water.",
                details: "This is the home of a ${generic.npc_adjectives} ${npcs.species} fisherman who is ${generic.motivations}. They know the lake's secrets, including the best fishing spots and the dangers that lurk beneath, like the legendary beast known as '${Lake.lake_monster}'."
            },
            {
                title: "The Whispering Shore",
                intro: "A dense patch of tall reeds lines this part of the shore. A strange, sibilant whispering seems to follow you as you pass, as if the reeds themselves are gossiping about a ${generic.rumors}.",
                details: "The whispering is caused by trapped air spirits, a phenomenon unique to this lake. A territorial ${Lake.shore_predator} makes its nest among the reeds, using the strange sounds to confuse its prey. A successful search of the shoreline might reveal a ${dungeon.features.secret_compartment_contents} dropped by a previous victim."
            },
            {
                title: "The Glassy Expanse of ${world_building.lake_names}",
                intro: "You reach a vast, open stretch of the lake where the water is as smooth and reflective as a silver mirror. The silence is profound, broken only by the dip of your oars or the cry of a distant bird.",
                details: "This part of the lake is known for its strange magical properties; spells cast here that affect water are said to be twice as potent. In the center of this expanse, the water is unnaturally deep, rumored to be a direct channel to a subterranean sea and is guarded by a reclusive ${ocean.encounters}."
            }
        ],
        encounters: [
            "a giant pike, as long as a canoe, leaping from the water",
            "a group of Nixies playing tricks on travelers near the shore",
            "a solitary hermit fishing from a canoe, offering a cryptic ${plot_hooks.adventure_awakening_discovery}",
            "a flock of territorial Giant Swans, their hisses echoing across the water",
            "a friendly lake serpent asking for news from a nearby ${world_building.town_names_2}",
            "a Lizardfolk hunting party in dugout canoes, tracking a ${Lake.lake_creatures}",
            "a flight of Stirges emerging from a lakeside cave at dusk",
            "a fisherman who has hooked something far too large and powerful for his line"
        ],
        discoveries: [
            "a half-submerged, locked chest tangled in weeds, bearing the crest of a noble from ${world_building.city_names_generic_1}",
            "an ancient, moss-covered fishing totem on the shore, said to bring good luck",
            "a patch of glowing, phosphorescent algae that illuminates the shallows at night",
            "a small, hidden cove with a sandy beach, perfect for camping",
            "a message in a bottle from a stranded adventurer on the ${poi.Oddity.sub_tables.island_sky_base}",
            "the entrance to an underwater cave, its opening obscured by a curtain of kelp",
            "a beautifully preserved, but abandoned, rowboat adrift near the shore",
            "a 'ghost light' or Will-O-Wisp that appears over the water at night, leading to a submerged ruin"
        ]
    },

    poi: {
        Hamlet: {
            templates: [
                {
                    title: "The ${generic.npc_adjectives} Hamlet of ${world_building.village_names_1}",
                    intro: "A small cluster of perhaps a dozen ${poi.Settlement.sub_tables.village_architecture_style} made of ${poi.Settlement.sub_tables.village_architecture_material} huddle together. The air is filled with the sounds and smells of its primary industry: ${poi.Settlement.sub_tables.village_industry}.",
                    details: "The hamlet is home to about ${poi.Settlement.sub_tables.village_size} souls, who are known to be ${poi.Settlement.sub_tables.village_nature}. They are led by ${poi.Settlement.sub_tables.village_ruler}. Their biggest problem right now is a ${generic.rumors} that has everyone on edge."
                },
                {
                    title: "The Crossroads of ${names.traditional.male}'s Crossing",
                    intro: "This small hamlet has grown around a single, central structure: a ${poi.Settlement.sub_tables.village_specialist} that serves travelers on the old ${world_building.road_names}. A simple ${poi.Settlement.sub_tables.village_protection} offers some safety from the wilds.",
                    details: "The folk here are accustomed to strangers and are famous for ${poi.Settlement.sub_tables.village_famous_for}. However, they harbor a dark secret: ${poi.Settlement.sub_tables.village_secrets}. The innkeeper, a ${generic.npc_adjectives} ${npcs.species} named ${npcs.generic_names}, is a good source of local gossip."
                },
                {
                    title: "${world_building.village_names_2}: An Isolated Outpost",
                    intro: "You come upon a lonely hamlet, nestled in a defensive position against a hillock. A crude ${poi.Settlement.sub_tables.village_protection} surrounds the handful of ${poi.Settlement.sub_tables.village_architecture_style}, suggesting a fear of the surrounding wilderness.",
                    details: "The people here are ${poi.Settlement.sub_tables.village_nature} and deeply suspicious of outsiders. They are troubled by a nearby ${generic.guardians} and may offer a reward of ${generic.mundane_treasures} for anyone brave enough to deal with the threat."
                }
            ],
            encounters: [
                "the village watch, consisting of three nervous youths with rusty spears",
                "a drunken brawler from the local tavern, looking to pick a fight over a perceived slight",
                "a traveling merchant with a cart of ${civilization.details.caravan_goods_2}, complaining about the poor roads",
                "a charismatic cult leader trying to recruit locals with promises of a bountiful harvest",
                "the village elder, a ${generic.npc_adjectives} ${npcs.species}, asking pointed questions about your business here",
                "a heartbroken young ${npcs.species} pining for a lover in a distant city"
            ],
            discoveries: [
                "a notice board outside the tavern with a crude drawing and a bounty for a local ${Forest.encounters}",
                "a hidden stash of smuggled ${civilization.details.caravan_goods_1} in an old barn",
                "a local festival celebrating the harvest is in full swing",
                "a secret meeting of villagers in the woods, planning to overthrow their ${poi.Settlement.sub_tables.village_ruler}",
                "a beautifully tended garden containing rare herbs, protected by a simple but clever charm",
                "an ancient, moss-covered well in the center of the hamlet, said to never run dry"
            ]
        },
        Town: {
            templates: [
                {
                    title: "The Bustling Market Town of ${world_building.town_names_1}",
                    intro: "The sounds of commerce—the ringing of a blacksmith's hammer, the chatter of traders, and the bellowing of livestock—reach you before you even see the town proper. A sturdy ${poi.Settlement.sub_tables.village_protection} surrounds a thriving community of several thousand souls.",
                    details: "The town is ruled by ${civilization.cities.rulers}. The central plaza is a hub of activity, featuring a market selling everything from ${civilization.details.caravan_goods_2} to local crafts. The most powerful faction here is the ${civilization.details.guilds_1} Guild."
                },
                {
                    title: "${world_building.town_names_2}, a Fortified Bastion",
                    intro: "This town was clearly built for defense. High stone walls, reinforced with ${civilization.details.building_types_1} towers, enclose a community laid out with military precision. Banners bearing a ${civilization.details.flag_symbols_1} snap smartly in the wind.",
                    details: "The town is governed by a stern ${civilization.details.military_ranks}, who answers to a distant monarch. The population is known for being ${poi.Settlement.sub_tables.village_nature} and disciplined. A prominent feature is the central keep, which serves as both the lord's manor and the town jail. A rumor persists about a secret escape tunnel, a relic from the ${world_building.years_of_historical_importance}."
                },
                {
                    title: "The Guilder's Hub of ${names.fantasy.dwarf_male}",
                    intro: "This town is a testament to the power of organized labor and commerce. Instead of a castle, the largest building is the ornate guildhall of the ${civilization.details.guilds_3} Guild, built from fine ${generic.building_materials}.",
                    details: "A council of guildmasters, led by a ${generic.npc_adjectives} ${npcs.species} named ${npcs.generic_names}, governs the town's affairs. The town is famous for ${poi.Settlement.sub_tables.village_famous_for}, but this prosperity hides a fierce rivalry between the ${civilization.details.guilds_4} and ${civilization.details.guilds_5} guilds, which sometimes spills into open conflict."
                }
            ],
            encounters: [
                "a town crier, loudly proclaiming a new edict from the ${civilization.cities.rulers}",
                "a squad of well-armed town guards, distinguished by their ${civilization.cities.coat_of_arms}, on patrol",
                "a press gang from the ${civilization.details.guilds_6} guild, looking for 'volunteers'",
                "an argument between a merchant and a customer that is about to turn violent in the ${civilization.details.districts_and_quarters}",
                "a charismatic priest from the local temple, seeking donations to fund a quest against a ${world_building.evil_realm_names}",
                "a guild apprentice running a desperate errand for their master",
                "a noble entourage passing through, causing a traffic jam in the narrow streets"
            ],
            discoveries: [
                "a public notice board filled with job postings, bounties, and local news, including a warning about ${character_paths.criminal_path}",
                "a 'help wanted' sign for caravan guards on a journey to the distant city of ${world_building.city_names_generic_1}",
                "a hidden alleyway that serves as a black market for illicit goods and information",
                "two guild members whispering about a conspiracy to fix the price of ${civilization.details.caravan_goods_3}",
                "a beautifully crafted statue in the town square, a monument to a local hero from the ${world_building.defining_national_moment}",
                "a skilled cartographer's shop selling detailed maps of the surrounding region, including a supposed route through the ${world_building.forest_names}"
            ]
        },
        City: {
            templates: [
                {
                    title: "The Royal Capital of ${world_building.city_names_generic_1}",
                    intro: "Before you stands a magnificent city, its skyline dominated by the spires of a grand castle and the domes of a great cathedral. A massive wall of ${generic.building_materials}, flying banners with a ${civilization.details.flag_symbols_2} crest, encloses a bustling metropolis of tens of thousands.",
                    details: "This is the seat of the kingdom's power, ruled by ${civilization.cities.rulers}. The city is divided into distinct districts, from the opulent ${civilization.details.districts_and_quarters} of the nobles to the teeming streets of the market. Political intrigue is thick on the ground, with factions loyal to the ${civilization.cities.power_behind_the_throne} vying for influence. A grand ${civilization.details.monuments} stands in the central plaza, commemorating the ${world_building.years_of_historical_importance}."
                },
                {
                    title: "The Great Trade Hub of ${world_building.port_names_1}",
                    intro: "This city is a sprawling nexus of commerce, a riot of color, sound, and smell. Its massive harbor is choked with ships from distant lands, and the dialects of a dozen different cultures can be heard in its streets. The architecture itself is a chaotic blend of styles from all over the world.",
                    details: "Power here does not belong to a king, but to the wealthy merchant guilds, particularly the ${civilization.details.guilds_2} Guild. The city is a melting pot of races and cultures, famous for its grand bazaar where one can find anything from rare spices to a captured ${character_paths.animal_companions_exotic}. However, beneath the bustling surface lies a dangerous underworld, controlled by the notorious ${character_paths.rogue_guilds}."
                },
                {
                    title: "The Ancient City of ${names.real_world.latin.female}, City of Knowledge",
                    intro: "This city feels ancient, its stones steeped in history. It is a place of quiet contemplation and scholarly pursuit, centered around a legendary institution like the Great Library or a renowned Wizard's Academy. The architecture is elegant and timeless, a product of master ${civilization.details.guilds_1}s from a bygone era.",
                    details: "The city is governed by a council of sages and high mages, led by a wise ${generic.npc_adjectives} ${npcs.species} whose primary motivation is ${character_traits.motivation_3}. It is said the city's libraries hold forbidden knowledge, including scrolls detailing powerful ${generic.rare_spells}. A palpable aura of ${generic.magical_auras} permeates the entire city, a remnant of its magical founding."
                }
            ],
            encounters: [
                "a diplomatic envoy from a foreign land, complete with guards and retainers, making their way to the palace",
                "an open conflict between members of the ${civilization.details.guilds_3} and ${civilization.details.guilds_4} guilds spilling into the streets",
                "a city guard captain, a veteran of the ${world_building.defining_national_moment}, trying to solve a high-profile murder",
                "a high-ranking noble, a ${civilization.cities.gentry}, slumming it in a downtown tavern in disguise",
                "a protest in the city square, with citizens demanding action from the ${civilization.cities.rulers} about a recent monster attack",
                "a master artisan from the ${civilization.details.guilds_5} Guild, seeking adventurers for a dangerous material-gathering quest",
                "a sewer patrol emerging from a manhole, warning of a dangerous ${Swamp.swamp_predators} that has made its way into the tunnels"
            ],
            discoveries: [
                "a public library or scriptorium containing tomes of lore about the ${generic.legends} of the region",
                "a summons to an audience with a powerful political figure, the ${civilization.cities.power_behind_the_throne}",
                "an exclusive auction house dealing in rare antiquities and minor magical items, including a supposed ${magic.artifacts}",
                "a secret meeting in a secluded garden, where a political conspiracy against the current ${civilization.details.government_2} is being planned",
                "a legendary tavern, 'The ${names.general.tavern_names_2}', known as a neutral ground for adventurers, spies, and criminals",
                "a retired, high-level adventurer who now runs a shop and is willing to offer sage advice for a price",
                "a detailed city map for sale, marking all major districts, including the location of the infamous ${character_paths.rogue_guilds} headquarters"
            ]
        },
        Ruins: {
            templates: [
                {
                    title: "The Crumbling Keep of ${world_building.evil_realm_names}",
                    intro: "You discover the skeletal remains of a forgotten fortress. Crumbling ${generic.building_materials} walls and a collapsed gatehouse are slowly being consumed by nature. A tattered banner, bearing the faded crest of a ${civilization.cities.coat_of_arms}, flutters from a lone surviving turret.",
                    details: "This keep was destroyed during the ${world_building.years_of_historical_importance}. It is now haunted by ${generic.guardians} and patrolled by ${poi.Ruins.sub_tables.elf_ruin_patrols}. Legends say the treasure of the last commander, a ${magic.magic_items_2}, is still buried somewhere in the rubble, protected by an ancient ${poi.Ruins.sub_tables.elf_ruin_traps}."
                },
                {
                    title: "The Desecrated Abbey of Saint ${names.traditional.female}",
                    intro: "A profound silence hangs over this place, the ruins of a once-holy abbey. Toppled statues of saints lie amidst the weeds, and the central bell tower has long since collapsed. The air is thick with an aura of ${generic.magical_auras} and quiet sorrow.",
                    details: "The monastic order that lived here were the ${character_paths.holy_orders_1}, but they vanished after ${poi.Ruins.sub_tables.abbey_former_order}. The grounds are now claimed by ${poi.Ruins.sub_tables.abbey_claiming_grounds}. Within the collapsed dovecote, a hidden treasure of ${poi.Ruins.sub_tables.abbey_treasure} is said to remain."
                },
                {
                    title: "The Moon-Glimmer Palace of the Elves",
                    intro: "You find ruins of breathtaking, otherworldly beauty. Slender, vine-choked spires and gracefully arching bridges of moon-white stone speak to its elven craftsmanship. The entire ruin seems to hum with a faint, magical energy.",
                    details: "This ancient place is protected by subtle but deadly wards, such as ${poi.Ruins.sub_tables.elf_ruin_traps}. The ghosts of its former inhabitants are sometimes seen on moonlit nights, and the ruins are patrolled by vigilant ${poi.Ruins.sub_tables.elf_ruin_patrols}. Beneath a mosaic of a dry fountain rests a legendary treasure: a ${poi.Ruins.sub_tables.elf_ruin_treasures}."
                },
                {
                    title: "The Silent Manor of the ${civilization.cities.noble_households_2} Family",
                    intro: "Here stands the husk of a once-stately manor house, its roof caved in and its windows like hollow eyes. An overgrown garden and the remains of a stable suggest a life of wealth cut tragically short by a ${plot_hooks.thirty_six_plots_2}.",
                    details: "Careless exploration could lead one to fall victim to ${poi.Ruins.sub_tables.acorn_manor_victim}. The old manor is now claimed by ${poi.Ruins.sub_tables.acorn_manor_claimed_by}. A thorough search of the master's study might uncover a secret compartment containing ${poi.Ruins.sub_tables.acorn_manor_uncover}."
                }
            ],
            encounters: [
                "a restless ghost, whispering warnings or threats", "a hungry Ghoul pack, feasting on the bones of the dead",
                "a rival team of archaeologists, determined to claim the ruin's treasures for themselves",
                "a flock of scavenging Stirges, nesting in the crumbling rafters",
                "a guardian Golem, still mindlessly following its last orders",
                "a pack of wild dogs that have made a den in the ruins",
                "a lone, mad hermit who believes they are the king of the ruins and demands tribute"
            ],
            discoveries: [
                "a half-buried mosaic depicting a forgotten myth or a key historical event",
                "a crumbling wall with a hidden compartment containing a ${dungeon.features.secret_compartment_contents}",
                "a water-damaged diary of the last inhabitant, detailing the ruin's final days",
                "a surprisingly well-preserved library, its shelves laden with lore on ${generic.legends}",
                "a treasure map, crudely drawn on a piece of tanned leather, hidden beneath a loose floorstone",
                "a series of strange glyphs that, when deciphered, reveal a prophetic warning",
                "a hidden cellar or crypt, its entrance sealed by a heavy stone slab with an inscription: '${poi.Sepulcher.sub_tables.seals}'"
            ]
        },
        Dungeon: {
            templates: [
                {
                    title: "The Monster Warren of ${dungeon.creation.dungeon_names}",
                    intro: "A crude ${dungeon.creation.dungeon_entrances_1} leads into a notorious dungeon known locally as a ${dungeon.creation.dungeon_type}. The air is thick with the foul stench of its current inhabitants, a tribe of belligerent ${npcs.species}.",
                    details: "The walls are covered in crude graffiti and the unsettling stains of past battles. The dungeon is a maze of barracks, fighting pits, and foul feasting halls. The tribe's chieftain, a notoriously ${generic.npc_adjectives} warrior, is said to wield a powerful ${magic.magic_items_1} and guards a stolen ${generic.mundane_treasures}."
                },
                {
                    title: "The Forsaken Prison of ${names.traditional.male}",
                    intro: "This sprawling complex was once an inescapable prison built by a forgotten empire. The entrance is a looming, fortified gatehouse, from which a palpable aura of despair emanates, a grim reminder of the ${plot_hooks.thirty_six_plots_2} that unfolded here.",
                    details: "The cells are lined with rusted shackles and the desperate ${dungeon.details.dungeon_wall_contents} of long-dead inmates. The prison is now said to be haunted by vengeful ${generic.guardians}, the spirits of prisoners who died in agony. Rumors speak of the warden's hidden office, which contains not only records of injustice but also a secret stash of confiscated goods, including a ${magic.artifacts}."
                },
                {
                    title: "The Lost Stronghold of the ${character_paths.paladin_orders}",
                    intro: "You've found the entrance to a lost military stronghold, its gateway sealed by a massive, partially collapsed stone door. Banners, though rotted, still show the faded insignia of a ${civilization.details.flag_symbols_1}, marking it as a bastion from the time of the ${world_building.defining_national_moment}.",
                    details: "This was once a ${dungeon.creation.dungeon_type} containing an armory, barracks, and strategic planning rooms. Though abandoned, its automated defenses, like cunningly placed ${dungeon.features.trap_detail_1}, may still be active. The stronghold's final commander was rumored to have sealed a great evil, a ${dungeon.creation.cavern_legends_2}, in the lowest level before they were overrun."
                },
                {
                    title: "The Unstable Vault of ${names.fantasy.elf_male} the Mad",
                    intro: "The air crackles with residual magic around this strange structure, built from ${dungeon.details.unusual_brick_stone}. This was the laboratory and vault of a powerful but reckless archmage.",
                    details: "The dungeon is a chaotic maze of workshops and summoning chambers, many protected by malfunctioning magical wards and guardians. It's said the wizard's final experiment went horribly wrong, tearing a temporary rift to the plane of ${dungeon.creation.cavern_legends_1}. A sealed library might still contain scrolls of ${generic.rare_spells} and the wizard's personal notes on creating a ${magic.artifacts}."
                }
            ],
            encounters: [
                "a goblin scouting party, their eyes gleaming greedily in the dark",
                "a gelatinous cube, silently patrolling and cleaning the corridor",
                "a rival adventuring party, the '${names.fantasy.adventuring_groups}', who are unwilling to share any treasure",
                "the restless spirits of former inhabitants, acting out their final moments",
                "a lone, massive Ogre, who has claimed a chamber as its personal den",
                "a tribe of Kobolds who have filled the area with devious, small-scale traps",
                "a pack of ravenous Ghouls, drawn to the scent of living flesh"
            ],
            discoveries: [
                "a well-hidden secret door, revealed by a loose stone in the wall",
                "the remains of a less fortunate adventurer, their journal detailing the dungeon's dangers and a clue to a hidden treasure",
                "a cryptic message scrawled on the wall in a strange language, hinting at a powerful ${generic.guardians}",
                "a devious pressure plate that triggers a ${dungeon.features.trap_detail_2} in the next room",
                "an ancient, underground spring providing a rare source of clean water",
                "a forgotten shrine to a dark deity, with a tarnished but valuable unholy symbol on the altar",
                "a locked chest made of ${dungeon.features.chest_composition}, promising either great reward or great danger"
            ]
        },
        Lair: {
            templates: [
                {
                    title: "The Foul Den of the ${names.fantasy.tribal}",
                    intro: "A gaping cave mouth, reeking of filth and old blood, marks the entrance to this foul lair. The ground is littered with the gnawed bones of its victims, a clear sign that this is the home of a pack of ravenous ${Lair.pack_predators}.",
                    details: "The lair is a chaotic network of natural tunnels and crude chambers. The air is thick with the sounds of guttural growls and the snapping of bones. The pack is led by a massive, scarred alpha who is fiercely protective of its hoard of stolen goods, which includes a surprisingly intact ${generic.mundane_treasures} and a tarnished ${magic.magic_items_3}."
                },
                {
                    title: "The Nest of the ${Lair.flying_predator}",
                    intro: "High on a cliff face or atop a massive, ancient tree, you spot an enormous nest woven from entire tree trunks and the wreckage of unfortunate caravans. The sheer size of it suggests a formidable flying predator makes its home here.",
                    details: "Reaching the nest is a perilous climb, made worse by the creature's territorial nature. The nest is filled with the creature's young, who are constantly hungry. Mixed in with the nesting material are the glittering remnants of the beast's meals, including ${dungeon.features.chest_contents} and the signet ring of a noble from the House of ${civilization.cities.noble_households_1}."
                },
                {
                    title: "The Subterranean Warren of the ${Lair.burrowing_creatures}",
                    intro: "A series of interconnected tunnels, their entrances looking like oversized animal burrows, dot the landscape. A low chittering sound echoes from the darkness within, hinting at a large colony of subterranean creatures.",
                    details: "This is a sprawling warren, home to a colony of highly organized ${Lair.burrowing_creatures}. They have excavated a vast complex in service to their queen. Deep within, their nursery chamber is rumored to contain unique treasures, such as geo-luminescent fungi and a seam of rare, crystalline ${generic.rare_materials}."
                },
                {
                    title: "The Lair of the Lone Hunter: '${names.fantasy.tribal_exotic}'",
                    intro: "You find the den of a solitary and highly intelligent predator. There are no massive piles of bones here, but rather a chillingly clean and organized space. Strange totems made from the spines and skulls of its prey hang from the walls, a testament to a cunning and patient hunter.",
                    details: "This is the home of a legendary ${Lair.lone_predator}, a creature known in local folklore for its cunning and cruelty. The creature is a collector of trophies, and its hoard is not of gold, but of unique items from its most challenging kills, including the shield of a famous knight from the ${character_paths.paladin_orders} and a wizard's staff still humming with ${generic.magical_auras}."
                }
            ],
            encounters: [
                "the lair's primary inhabitant, returning from a hunt",
                "a group of scavengers, like hyenas or giant rats, trying to steal scraps from the lair",
                "a lone survivor of the creature's last attack, hiding and terrified",
                "the young of the primary inhabitant, smaller but still very dangerous",
                "a rival predator attempting to take over the lair",
                "a group of hunters or tribesmen who have tracked the creature here and are preparing an assault"
            ],
            discoveries: [
                "the tracks of the primary inhabitant, giving a clue to its size and nature",
                "a fresh kill, recently brought back and partially eaten",
                "a hidden escape tunnel at the back of the lair",
                "a collection of personal items from the creature's past victims, like a locket or a diary",
                "strange markings on the wall that seem to be a crude map of the surrounding territory",
                "the creature's hoard, a messy pile of coins, gems, and the occasional, surprisingly intact ${magic.magic_items_4}",
                "a section of the lair that has been blocked off by a rockfall, with scraping sounds coming from the other side"
            ]
        },
        Cave: {
            templates: [
                {
                    title: "The Smuggler's Hideout of ${names.traditional.male}",
                    intro: "The mouth of this cave seems unusually wide and clear of debris. Faint tracks leading inside suggest it sees regular use. Inside, the flickering light of a campfire can be seen.",
                    details: "The cave is a base for ${poi.Cave.sub_tables.smugglers_hideout_occupants}. They have a small camp set up and are currently ${poi.Cave.sub_tables.smugglers_hideout_activity}. Their hidden cache of smuggled goods contains ${poi.Cave.sub_tables.smugglers_hideout_cache}."
                },
                {
                    title: "A Place of Ancient Rituals",
                    intro: "The walls of this cave are covered in faded, prehistoric paintings depicting strange beasts and forgotten hunts. A strange, humming energy of ${generic.magical_auras} seems to emanate from deeper within.",
                    details: "The ancient petroglyphs on the wall depict ${poi.Cave.sub_tables.ancient_rituals_petroglyphs}. The cave is currently occupied by ${poi.Cave.sub_tables.ancient_rituals_occupants}. At the heart of the cave system is ${poi.Cave.sub_tables.ancient_rituals_heart}."
                },
                {
                    title: "The Murky Den of the ${Lair.pack_predators}",
                    intro: "A foul stench wafts out of a jagged, six-foot-high opening in a nearby stone cliff. The ground around the entrance is littered with gnawed bones and the tracks of a large, predatory beast.",
                    details: "This cave system is the cramped and filthy lair of ${poi.Cave.sub_tables.murky_lair_inhabitants}. A thorough search of their foul nest reveals that ${poi.Cave.sub_tables.murky_lair_treasure} is hidden beneath a pile of refuse."
                },
                {
                    title: "The Crystal Veins of the ${world_building.mountain_names_1}",
                    intro: "You find the entrance to a natural, undeveloped cave system. The air is cool and damp, and the sound of dripping water echoes from within. The walls are not bare stone, but are lined with glittering, fist-sized crystals.",
                    details: "The cave is a stunning natural formation, its passages illuminated by the faint, magical light of phosphorescent fungi. A small stream of fresh, clean water flows through the main chamber. This place seems untouched, though a reclusive, territorial ${Mountain.peak_predators} has recently made its den in a deeper chamber."
                }
            ],
            encounters: [
                "a swarm of bats, startled by your light",
                "a foraging cave bear, angry at being disturbed",
                "a lost explorer, their torch having just gone out",
                "a nest of giant centipedes, scuttling in the darkness",
                "a territorial Ogre who has claimed the cave as its home",
                "a group of Goblins, using the cave as a temporary outpost",
                "a gelatinous cube, perfectly camouflaged against the damp stone floor"
            ],
            discoveries: [
                "a vein of glittering, valuable minerals in the cave wall",
                "a hidden spring of fresh, perfectly potable water",
                "strange, phosphorescent fungi that cast an eerie, beautiful light",
                "an old, discarded backpack containing a cryptic map and a waterskin of fine brandy",
                "a narrow passage, almost completely hidden, leading to a deeper, unexplored part of the cave",
                "a crude drawing on the wall that seems to depict a nearby, undiscovered landmark",
                "the skeletal remains of a prospector, clutching a single, flawless ${generic.rare_materials} gem"
            ]
        },
        Castle: {
            templates: [
                {
                    title: "The Noble Seat of House ${civilization.cities.noble_households_1}",
                    intro: "A formidable castle rises from the landscape, its towers and battlements a clear symbol of power. The banner of its ruling family, a ${civilization.details.flag_symbols_1}, flies proudly from the highest turret. This is a place of authority and martial strength.",
                    details: "The castle is currently ruled by a ${generic.npc_adjectives} ${civilization.cities.nobles}, who is known for their interest in ${civilization.cities.noble_power_source_interests}. The keep is bustling with soldiers, servants, and emissaries. While seemingly secure, there are whispers of a threat from a rival noble house, and the lord is seeking loyal swords to act as agents."
                },
                {
                    title: "The Ghost-Haunted Ruins of ${world_building.evil_realm_names}",
                    intro: "You come upon the skeletal ruins of a castle, its walls breached and its towers crumbling. An unnatural silence hangs over the stones, broken only by the mournful wind. This place is clearly steeped in a history of violence and tragedy from the ${world_building.defining_national_moment}.",
                    details: "The castle was destroyed long ago and is now the domain of the restless dead. The spirits of its former defenders, led by a spectral ${civilization.details.military_ranks}, still patrol the battlements. Legends claim that the castle's treasury was never found and lies hidden in a secret vault, guarded by a powerful ${generic.guardians} and a deadly ${generic.curses}."
                },
                {
                    title: "The Dark Fortress of the ${names.fantasy.tribal}",
                    intro: "A grim, oppressive fortress of black stone looms ahead, a bastion of evil in the wilderness. The architecture is brutal and menacing, adorned with crude gargoyles and spikes displaying the remains of its enemies. An aura of profound ${generic.magical_auras} radiates from it.",
                    details: "This castle is the stronghold of a notorious warlord, a ${generic.npc_adjectives} ${npcs.class} who commands a legion of savage ${npcs.species} warriors. The dungeons are said to be full of prisoners, and the warlord possesses a powerful artifact, a ${magic.artifacts}, which is the source of their power."
                },
                {
                    title: "The Besieged Stronghold of ${world_building.town_names_2}",
                    intro: "The sounds of battle—the clash of steel, the shouts of warriors, and the roar of siege engines—echo from this castle. An army has laid siege to it, their colorful tents and banners surrounding the stone walls like a grim festival.",
                    details: "The castle's defenders are outnumbered but hold a strong position. The siege is at a stalemate. Both the attackers, led by a ruthless mercenary captain from the '${names.fantasy.adventuring_groups}', and the defenders, loyal to the noble House ${civilization.cities.noble_households_2}, are desperate and may be willing to hire outsiders to break the deadlock."
                }
            ],
            encounters: [
                "a patrol of stern, well-armed guards demanding to know your business",
                "a foppish noble and their entourage, out for a bit of sport",
                "a desperate messenger, trying to sneak past enemy lines",
                "a grizzled siege engineer, assessing the castle's defenses",
                "the ghost of a former resident, endlessly repeating their final, tragic moments",
                "a group of opportunistic bandits, using the conflict as cover to raid nearby lands"
            ],
            discoveries: [
                "a secret postern gate, hidden behind a thick tapestry of ivy",
                "a discarded siege plan, detailing the attacker's next move",
                "a weak point in the castle wall, noted by the masons of the ${civilization.details.guilds_1} Guild",
                "a hidden cache of supplies, meant for the defenders but forgotten",
                "a love letter tied to an arrow, shot over the wall by a lovelorn soldier",
                "an ancient crypt beneath the castle chapel, which might offer a way in—or awaken something best left undisturbed",
                "a detailed heraldry book in the library, explaining the significance of the ${civilization.details.flag_symbols_2} of all the local noble houses"
            ]
        },
        Stronghold: {
            templates: [
                {
                    title: "The Border Fortress of the ${character_paths.ranger_orders_1}",
                    intro: "You see a grim, functional fortress built of heavy stone and thick timber. It's not a place of comfort, but of pure military might, designed to withstand a siege. The banner of the realm, a ${civilization.details.flag_symbols_2}, flies alongside the personal insignia of its commander.",
                    details: "This stronghold guards a critical border or pass. It is commanded by a veteran ${civilization.details.military_ranks}, a ${generic.npc_adjectives} ${npcs.species} who is deeply concerned about a threat from the nearby ${world_building.badland_wasteland_names}. The garrison is disciplined and highly suspicious of any unrecognized travelers."
                },
                {
                    title: "The Conquered Bastion of the ${names.fantasy.tribal}",
                    intro: "The architecture of this fortress is clearly of human or dwarven make, but the crude, spiked barricades and totems of bone and sinew that now adorn it are not. This stronghold has fallen and is now occupied by a formidable horde.",
                    details: "A tribe of savage ${npcs.species} warriors has made this their base of operations. They are led by a powerful chieftain who possesses a stolen ${magic.magic_items_5}. They use the fortress to launch raids into the surrounding countryside, and their dungeons are filled with captured locals and unfortunate travelers."
                },
                {
                    title: "The Ruined Watchtower of ${world_building.mountain_names_2}",
                    intro: "A single, crumbling tower stands defiantly against the elements, the last remnant of a larger fortification. Though its walls are breached and its upper levels have collapsed, it still offers a commanding view of the surrounding terrain.",
                    details: "This watchtower was abandoned after the ${world_building.defining_national_moment} and has since fallen into ruin. It is now the nesting place of a territorial ${Lair.flying_predator}. Among the rubble, one might find remnants of its former defenders, such as a rusted suit of armor or a shield bearing the crest of the long-forgotten ${character_paths.warrior_path}."
                },
                {
                    title: "The Hidden Redoubt of the ${character_paths.rogue_guilds}",
                    intro: "What appears to be a simple, fortified trading post or a secluded monastery is, in fact, a cleverly disguised stronghold. The inhabitants seem peaceful, but keen-eyed observers will notice that every person is armed and alert.",
                    details: "This is a secret base for a rebel or criminal organization, led by a charismatic figure who is ${generic.motivations}. The stronghold is protected by secret passwords, hidden traps, and loyal sentries. They are currently planning a major operation, a ${plot_hooks.thirty_six_plots_1}, against the local authorities."
                }
            ],
            encounters: [
                "a disciplined patrol of soldiers, challenging you for a password",
                "a foraging party of goblin warriors, gathering supplies for their chieftain",
                "a desperate fugitive, attempting to flee the stronghold's dungeons",
                "a territorial monster that has made its lair in the stronghold's ruins",
                "a quartermaster, willing to trade supplies but asking many questions",
                "a grizzled scout in a hidden watchpost, observing all who approach"
            ],
            discoveries: [
                "a set of battle plans, detailing the stronghold's defensive strategies or offensive targets",
                "a secret passage, designed for escape or for launching surprise attacks",
                "a captive, held in the dungeons, who possesses vital information",
                "a hidden cache of weapons and armor, enough to equip a small squad",
                "a coded message, which, if deciphered, reveals the faction's secret allegiances",
                "a powerful siege weapon on the battlements, such as a ballista or trebuchet, which could be commandeered",
                "the stronghold's master smith, who is one of the few who knows the secret of forging ${generic.rare_materials}"
            ]
        },
        Mine: {
            templates: [
                {
                    title: "The Busy Tunnels of the ${civilization.details.guilds_1} Miners Guild",
                    intro: "The rhythmic clang of pickaxes against stone and the rumble of ore carts echo from the mouth of this mine. A bustling encampment of workers surrounds the entrance, complete with a foreman's office, a smithy for tool repairs, and a company store.",
                    details: "This mine is a productive source of ${civilization.details.caravan_goods_2}, operated by a local guild. The foreman, a ${generic.npc_adjectives} ${npcs.species} named ${names.fantasy.dwarf_male}, is concerned about a recent increase in tunnel collapses and rumors of strange creatures, like ${Lair.burrowing_creatures}, emerging from the deeper veins."
                },
                {
                    title: "The Abandoned '${names.traditional.female}'s Folly' Mine",
                    intro: "You find the entrance to a mine, its timber supports rotting and its entrance choked with rubble and thorny weeds. A faded sign, half-rotted, warns of danger. It's clear this mine was abandoned in a hurry.",
                    details: "The mine was deserted years ago after the miners broke into a natural cavern system and awakened something terrible. Now the tunnels are a dangerous warren, infested with a ${dungeon.encounters}. Tales told by a grizzled old prospector in a nearby tavern say the mine still holds a rich, un-tapped vein of ${generic.rare_materials} for anyone brave enough to claim it."
                },
                {
                    title: "The Haunted Shaft of the ${world_building.mountain_names_1}",
                    intro: "An unnatural cold seeps from the entrance of this old mine, and a low moaning sound can be heard on the wind. The place is steeped in an aura of ${generic.magical_auras} and profound sorrow.",
                    details: "This mine is haunted by the spirits of miners who were killed in a catastrophic collapse, an event blamed on a ${generic.curses}. The ghostly crew, still led by their spectral foreman, endlessly reenact their final day of work. They are hostile to anyone who disturbs their rest, especially those carrying tools of the ${civilization.details.guilds_1} Guild."
                }
            ],
            encounters: [
                "a weary-looking miner, taking a break at the entrance",
                "a heavily-armed caravan guard, overseeing a shipment of ore",
                "a rival prospector, trying to jump the claim",
                "a pack of giant rats, feasting on discarded rations",
                "a Kobold scouting party, looking for a new place to make their den",
                "a Carrion Crawler, drawn by the scent of death from a collapsed tunnel",
                "the ghost of a miner, begging for help to find their missing remains"
            ],
            discoveries: [
                "a rich, untapped vein of gold, silver, or other precious minerals",
                "a set of abandoned but high-quality mining tools",
                "a miner's diary, detailing the discovery of something ancient and terrifying in the depths",
                "a hidden chamber, used by smugglers to store their illicit goods",
                "a fossilized skeleton of a massive, unknown subterranean creature embedded in the rock",
                "a section of the mine that breaks through into a natural, crystal-lined cavern",
                "a surprisingly intact mine cart, resting on a section of track leading deeper into the darkness"
            ]
        },
        Port: {
            templates: [
                {
                    title: "The Bustling Trade Port of ${world_building.port_names_1}",
                    intro: "The scent of salt and tar hangs in the air, mixed with the exotic spices of distant lands. This is a thriving trade port, its harbor crowded with merchant galleys, fishing vessels, and passenger ships. The docks are a chaotic symphony of shouting sailors, creaking ropes, and rattling cargo.",
                    details: "The port is managed by a powerful harbormaster, a ${generic.npc_adjectives} ${npcs.species} appointed by the ${civilization.details.guilds_2} Guild. Warehouses line the waterfront, filled with goods like ${civilization.details.caravan_goods_3}. In the dockside taverns, like the infamous '${names.general.tavern_names_1}', one can hear sailors swapping tales of an ${ocean.encounters} and spreading ${generic.rumors}."
                },
                {
                    title: "The Naval Fortress of ${world_building.port_names_2}",
                    intro: "This port is a display of pure military might. A massive sea wall and fortified towers protect a harbor filled with sleek, grey warships. The disciplined shouts of officers and the rhythmic beat of marching feet are the dominant sounds here. Banners bearing the realm's ${civilization.details.flag_symbols_2} are everywhere.",
                    details: "This is a key naval base, commanded by a stern ${civilization.details.military_ranks} who is preparing for a potential conflict with a rival power. The port is highly restricted, and strangers are watched with suspicion. It is said that the fortress's dungeons hold captured pirates and spies who possess vital intelligence about the ${world_building.ocean_and_sea_names}."
                },
                {
                    title: "The Notorious Smuggler's Cove of ${names.traditional.male}",
                    intro: "Nestled in a hidden cove, this settlement is less a town and more a lawless collection of rickety piers, leaning shanties, and disreputable taverns. This is a place for those who wish to avoid the law, a haven for pirates, smugglers, and outlaws.",
                    details: "There is no formal law here; power is held by the most feared pirate captain, a ruthless ${npcs.class} who leads the notorious '${names.fantasy.adventuring_groups}'. This is the best place to find a discreet charter for illegal voyages or to purchase black market goods. However, a knife in the back is a common way to end a business deal here, often as part of a ${plot_hooks.thirty_six_plots_2}."
                }
            ],
            encounters: [
                "a press gang, looking for 'volunteers' for a long voyage",
                "a customs official, demanding to inspect your cargo and papers",
                "a sea-worn sailor, offering to sell a treasure map of dubious authenticity",
                "a fight breaking out between the crews of two rival ships",
                "a shipwright from the ${civilization.details.guilds_6} Guild, looking for skilled hands to help with urgent repairs",
                "a beautiful mermaid, captured by a fisherman and being sold to the highest bidder",
                "a naval officer, recruiting skilled warriors for a dangerous mission against pirates"
            ],
            discoveries: [
                "a notice on a public board, offering a handsome reward for the capture of a wanted pirate",
                "a ship preparing to set sail for a distant, exotic land, with a few berths still available for paying passengers",
                "a hidden sea cave, used by smugglers to hide their contraband",
                "a knowledgeable cartographer's shop, selling detailed nautical charts that mark dangerous reefs and secret coves",
                "a drunken sailor in a tavern, who lets slip the location of a legendary shipwreck, the '${names.traditional.female}'",
                "the figurehead of a famous ship, mounted above a tavern door as a trophy",
                "a list of incoming and outgoing ships, which could provide vital intelligence for an ambush or heist"
            ]
        },
        Shipwreck: {
            templates: [
                {
                    title: "The Wreck of the '${names.traditional.female}'",
                    intro: "The jagged teeth of a reef or the treacherous shore have claimed a victim. A shattered ship lies here, its broken masts pointing to the sky like skeletal fingers. The nameplate on its hull is still visible.",
                    details: "The ship was a merchant galley from the port of ${world_building.port_names_1}, and its hold was laden with valuable ${civilization.details.caravan_goods_3}. The wreck is now home to a host of sea life, but also a group of territorial ${ocean.encounters}. Exploring the captain's cabin might reveal a logbook detailing the ship's final, tragic hours."
                },
                {
                    title: "The Ghost Ship of the ${world_building.ocean_and_sea_names}",
                    intro: "On moonless nights or when the fog is thick, sailors report seeing a spectral galleon, the '${names.fantasy.adventuring_groups}', sailing these waters. It is an ethereal, silent vessel, glowing with a faint, eerie light.",
                    details: "This is the ghost of a ship that went down with all hands during the ${world_building.years_of_historical_importance}. Its crew are now vengeful ${generic.guardians} who try to lure other ships to their doom. It is said the ghost captain still guards a cursed treasure, a ${magic.artifacts}, which binds him and his crew to the sea."
                },
                {
                    title: "The Sunken Lair of the ${Lair.lone_predator}",
                    intro: "Completely submerged beneath the waves lies the intact hull of a large warship. It rests on the seabed, an artificial cave in the deep. Bubbles occasionally rise to the surface, hinting at something large breathing within.",
                    details: "This sunken vessel has become the lair of a powerful sea monster. The creature has gathered a hoard of treasure from other sunken ships, piling it in the old cargo hold. The hoard is a glittering pile of coins, gems, and magical items, including a ${magic.magic_items_2}, all jealously guarded by the beast."
                }
            ],
            encounters: [
                "a shiver of sharks, drawn by the scent of old tragedy",
                "a group of curious merfolk, exploring the wreck",
                "a giant octopus, which has made the cargo hold its den",
                "a Sahuagin salvage party, attempting to loot the wreck",
                "the restless spirits of the drowned crew, who perceive you as intruders",
                "a rival group of adventurers or salvagers, also seeking the wreck's treasure"
            ],
            discoveries: [
                "a locked sea chest, its contents miraculously preserved",
                "the ship's logbook, its waterlogged pages detailing a tale of mutiny and betrayal",
                "a surprisingly intact nautical chart, marking a nearby uncharted island",
                "the skeletal remains of the captain, still clutching a beautiful, masterwork cutlass",
                "a cargo hold still partially filled with its original, valuable goods",
                "a breach in the hull that leads into a network of underwater caves",
                "a magical figurehead, a beautifully carved mermaid whose eyes seem to follow you and weep saltwater tears"
            ]
        },
        PirateHideout: {
            templates: [
                {
                    title: "The Secret Cove of the '${names.fantasy.adventuring_groups}'",
                    intro: "A narrow, treacherous channel, hidden by sharp rocks and perpetual mist, opens into a hidden cove. This is a classic pirate hideout, a sheltered anchorage for ships that fly the black flag. The air smells of cheap rum, tar, and cooking fish.",
                    details: "A small, ramshackle village of driftwood shacks clings to the shore, dominated by a single, rowdy tavern called 'The ${names.general.tavern_names_3}'. The cove is controlled by a ${generic.npc_adjectives} pirate captain named ${names.traditional.male}, who is currently planning a daring raid on ${world_building.port_names_1}."
                },
                {
                    title: "The Fortress of the Pirate Lords",
                    intro: "This is no mere hideout; it's a fortified island stronghold. A captured naval fortress, its original banners have been replaced by a variety of grim pirate flags. Cannons peer from its battlements, and sharp-eyed lookouts watch the sea lanes.",
                    details: "The island is ruled by a council of pirate captains, but the true power is the Pirate Lord, a legendary ${npcs.class} known for their cunning. The fortress is a surprisingly organized community of pirates, shipwrights, and merchants who deal in stolen goods. A black market thrives here, selling everything from illegal magic to maps of secret shipping routes."
                },
                {
                    title: "Wreckage Town: A Floating Den of Thieves",
                    intro: "You find a bizarre, chaotic settlement built from the lashed-together hulls of dozens of captured and wrecked ships. Masts serve as watchtowers, and rope bridges connect the decks of vessels from a dozen different nations. It's a testament to the pirates' resourcefulness and their many victories.",
                    details: "This makeshift town is a maze of cramped cabins and rain-slicked decks. It's a truly lawless place where disputes are settled with a cutlass. The community's leader is a survivor, a ${generic.npc_adjectives} ${npcs.species} who has a talent for salvage and a short temper. They are currently in possession of a high-value captive, a noble from the House of ${civilization.cities.noble_households_2}, and are negotiating the ransom."
                }
            ],
            encounters: [
                "a drunken pirate, eager to tell tall tales or pick a fight for a perceived insult",
                "a suspicious quartermaster, assessing you and your gear with a cold, calculating eye",
                "a desperate captive, trying to bribe you for a chance at escape",
                "two pirates dueling on a pier over a disputed piece of treasure",
                "a ship's carpenter from the ${civilization.details.guilds_6} Guild, offering to make 'no-questions-asked' repairs to your vessel for a steep price",
                "a pirate captain, looking to hire a skilled crew for a dangerous but profitable voyage"
            ],
            discoveries: [
                "a tavern where a pirate is trying to sell a treasure map that looks suspiciously new",
                "a black market stall selling a recently stolen, but valuable, cargo of ${civilization.details.caravan_goods_2}",
                "a group of captains huddled over a nautical chart, planning a coordinated attack on a naval fleet",
                "a heavily guarded ship, rumored to be the personal vessel of the Pirate Lord, said to hold a legendary ${magic.artifacts}",
                "a prisoner in a gibbet who, in exchange for water, whispers a vital secret about the hideout's leader",
                "a unique opportunity to join a pirate crew, offering a life of freedom and plunder on the ${world_building.ocean_and_sea_names}"
            ]
        }
    }
};


// --- Public API ---

function generateDescription(hexData, pathInfos = []) { // Now accepts an array
    const { terrain, pois } = hexData;
    let source;
    let results = {};

    const poiMapping = {
        "Hamlet": "Hamlet", "Town": "Town", "City": "City",
    };
    
    let primaryPoiType = null;
    if (pois && pois.length > 0) {
        primaryPoiType = pois[0];
    }

    if (primaryPoiType && templates.poi[poiMapping[primaryPoiType]]) {
        source = templates.poi[poiMapping[primaryPoiType]];
    } else if (primaryPoiType && templates.poi[primaryPoiType]) {
        source = templates.poi[primaryPoiType];
    }
    else {
        source = templates[terrain] || templates.Plains;
    }

    const template = roll(source.templates);
    if (template) {
        results.title = resolveString(template.title);
        results.intro = resolveString(template.intro);
        results.details = resolveString(template.details);
    } else {
        results.title = `A stretch of ${terrain.toLowerCase()}` + (primaryPoiType ? ` with a ${primaryPoiType}` : '');
        results.intro = "The area is typical for this region.";
        results.details = "Nothing immediately stands out as unusual.";
    }

    // --- NEW: Multi-Path Narrative Logic ---
    if (pathInfos && pathInfos.length > 0) {
        const pathDescriptions = pathInfos.map(pathInfo => {
            const pathVerb = pathInfo.type === 'river' ? 'flows' : 'passes';
            let pathText = `The '${pathInfo.name}' (${pathInfo.type}) ${pathVerb} through here.`;
            if (pathInfo.description) {
                pathText += ` ${pathInfo.description}`;
            }
            return pathText;
        });
        results.path = pathDescriptions.join('\n'); // Join multiple path descriptions with a newline
    }
    // --- END of New Logic ---

    results.encounter = resolveString(roll(source.encounters));
    results.discovery = resolveString(roll(source.discoveries));

    return results;
}

const DescriptionGenerator = {
    generateDescription
};

export default DescriptionGenerator;