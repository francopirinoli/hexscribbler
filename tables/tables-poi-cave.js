// tables/tables-poi-cave.js

export const tables = {
    // High-level thematic modules for a Cave POI.
    thematic_modules: [
        {
            title: "A Smuggler's Hideout",
            intro: "The mouth of this cave seems unusually wide and clear of debris. Faint tracks lead inside, suggesting it sees regular use.",
            details: 'The cave is a base for ${poi.Cave.sub_tables.smugglers_hideout_occupants}. They have a small camp set up, and are currently ${poi.Cave.sub_tables.smugglers_hideout_activity}. Their cache of goods contains ${poi.Cave.sub_tables.smugglers_hideout_cache}.'
        },
        {
            title: "A Place of Ancient Rituals",
            intro: "The walls of this cave are covered in faded, prehistoric paintings. A strange, humming energy seems to emanate from deeper within.",
            details: 'The petroglyphs depict ${poi.Cave.sub_tables.ancient_rituals_petroglyphs}. The cave is currently occupied by ${poi.Cave.sub_tables.ancient_rituals_occupants}. At the heart of the cave is ${poi.Cave.sub_tables.ancient_rituals_heart}.'
        },
        { 
            title: "A Murky Lair",
            intro: "A foul stench wafts out of a 6-foot-high opening in a nearby stone cliff...",
            details: 'The cave is home to ${poi.Cave.sub_tables.murky_lair_inhabitants}. A search of the lair reveals that ${poi.Cave.sub_tables.murky_lair_treasure}.'
        },
        {
            title: "The Outlaw's Rest",
            intro: "Tucked behind a waterfall is a well-hidden cave entrance. Inside, the sounds of conversation and clinking mugs can be heard.",
            // CORRECTED LOGIC: The leader description is now part of the occupants roll.
            details: 'This cave is the hideout of ${poi.Cave.sub_tables.outlaw_rest_occupants}. They offer ${poi.Cave.sub_tables.outlaw_rest_offer} in exchange for news of the outside world.'
        }
    ],

    // Sub-tables for the cave modules
    sub_tables: {
        murky_lair_inhabitants: [
            "a troop of carnivorous baboons, led by a massive alpha male",
            "a clan of territorial Neanderthals, their walls covered in hunting scenes",
            "a nest of giant spiders, their webs choking the passages",
            "a small tribe of particularly odorous troglodytes"
        ],
        murky_lair_treasure: [
            "a pile of gnawed bones hides a gold bracelet and a silver-and-amethyst necklace",
            "a chest of fitted rock slabs contains assorted coins and a large white pearl",
            "three sealed opaque bottles are tangled in the webs, containing potions of healing and heroism",
            "a rusted metal treasure chest is chained to the bottom of a foul pool, filled with electrum and amethyst geodes"
        ],
        smugglers_hideout_occupants: [
            "a band of highwaymen, hiding out between raids",
            "a group of pirates, stashing their loot from coastal raids",
            "a cell of cultists, smuggling forbidden artifacts",
            "a lone hermit who claims to be a philosopher"
        ],
        smugglers_hideout_activity: [
            "arguing over the division of their latest score",
            "sleeping soundly after a long night's work",
            "setting up an ambush for an expected rival gang",
            "complaining about the quality of their rations"
        ],
        smugglers_hideout_cache: [
            "several casks of fine wine and brandy",
            "bolts of silk and other expensive fabrics",
            "a collection of religious icons stolen from nearby temples",
            "a captured nobleman being held for ransom"
        ],
        ancient_rituals_petroglyphs: [
            "humanoid figures hunting massive, unknown beasts",
            "a bizarre celestial event with multiple moons in the sky",
            "a forgotten deity with far too many limbs",
            "a complex star chart that seems to point to a specific, distant location"
        ],
        ancient_rituals_occupants: [
            "a coven of witches attempting to reawaken an ancient power",
            "a lone, mad painter trying to replicate the petroglyphs with their own blood",
            "the ghosts of the original artists, who reenact their rituals every night",
            "nothing, the cave is eerily silent and empty"
        ],
        ancient_rituals_heart: [
            "a smooth, egg-shaped stone that hums with power",
            "a crude altar stained with the blood of countless sacrifices",
            "a shimmering portal to another time or place",
            "a spring of water that provides prophetic visions"
        ],
        outlaw_rest_occupants: [
            "a band of bandits led by a disgraced knight. ${npcs.templates.simple_npc}",
            "a company of deserters from a recent war, led by a grizzled sergeant",
            "a family of displaced farmers turned brigands, led by their matriarch",
            "a surprisingly cheerful group of goblin robbers, led by the one with the biggest hat"
        ],
        outlaw_rest_offer: ["safe passage through their territory", "a share of their next score", "a well-worn treasure map", "a raucous night of stories and song"],

    },
    
    // Generic encounters and discoveries for any cave.
    encounters: ["a swarm of bats", "a foraging cave bear", "a lost explorer", "a nest of giant centipedes", "a territorial Ogre"],
    discoveries: ["a vein of glittering minerals", "a hidden spring of fresh water", "strange, phosphorescent fungi", "an old, discarded backpack with a cryptic map"]

};