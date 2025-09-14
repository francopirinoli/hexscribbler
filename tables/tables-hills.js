// tables/tables-hills.js

export const tables = {
    sub_tables: {
        // This is the newly created table required by the "Barrows" template.
        barrow_person: [
            "an ancient chieftain, buried with their honor guard",
            "a powerful sorcerer-king, sealed with magical wards",
            "a legendary hero, said to rise again in a time of great need",
            "a forgotten high priestess, interred with sacred relics",
            "a wealthy merchant lord, whose tomb is filled with riches and traps",
            "a tragic princess, whose ghost is said to haunt the mounds"
        ],
        // The following tables are kept from the old file as they are used by the new templates.
        winding_walkway_builders: [
            "the True Mortar Clan of Mountain Dwarfs",
            "Dire Dirt Daubers, with eerily uniform mud bricks, controlled by an outside force",
            "a now extinct race of Glacier Giants, working on a megaproject for their Queen",
            "men capable of splitting the largest stones with a mere glance",
            "civilized Troglodytes, though their feral cousins still roam these parts",
            "a single Dwarf who just wanted to get to his favorite tavern faster"
        ],
        roadside_shrine_dedication: [
            "the religion followed by the party's most hated enemy/enemies",
            "ancient Cirrus Cloud Titans, once worshipped as divine in these parts",
            "a young woman, who threw herself into the falls after being spurned by her lover",
            "an un-named Saint of a sect now considered heretical by the major religion in the region",
            "an Empress of antiquity, so beloved by Her people that Her ascension to Godhood was a foregone conclusion",
            "a flusteringly obscure and exotic divinity from far off lands to the West"
        ],
        haglefs_hill_legend: [
            "is the name of a Mountain Giant, petrified and partially buried after kidnapping a sorceress's daughter",
            "was an ancient Dwarf Ruler, who ordered these monuments placed at the edges of his Underkingdom",
            "is the Old Ogrish word for 'Looking Place See Far'",
            "is the Sagacious, a cantankerous Granite Galeb Duhr who is rumored to know a long forgotten School of Campfire Magic"
        ]
    },

    // These encounter/discovery lists are kept for fallback purposes but are superseded by the new lists in DescriptionGenerator.js
    encounters: [
        "a flock of Giant Eagles", "a band of Orcs on patrol", "a hungry Hill Giant looking for a meal",
        "a mischievous band of Goblins", "a herd of wild goats", "a territorial Griffon protecting its nest",
        "a lone, grizzled prospector leading a mule", "a Bugbear scouting party"
    ],
    discoveries: [
        "a small, hidden cave behind a patch of thorny bushes", "an ancient, moss-covered standing stone with faint carvings",
        "a narrow goat-path leading to a breathtaking overlook", "the entrance to an old, abandoned mine",
        "a patch of rare, hardy mountain flowers", "a territorial dispute between two families of badgers"
    ]
};