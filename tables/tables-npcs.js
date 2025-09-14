// tables/tables-npcs.js

export const tables = {
    // --- IDENTITY ---
    species: ["Human", "Elf", "Dwarf", "Halfling", "Gnome", "Half-Orc"],
    gender: ["Male", "Female", "Non-binary"],
    class: ["Fighter", "Cleric", "Magic-User", "Thief", "Ranger", "Druid", "Paladin", "Barbarian", "Bard", "Monk", "Assassin", "Scout", "Witch-Hunter", "Mercenary", "Pirate", "Bandit"],

    // --- NAMES (Populated from Book of Names and other sources) ---
    generic_names: ["Bram", "Ronan", "Kael", "Turlan", "Leswin", "Arion", "Balthus", "Corwin", "Dain", "Elara", "Seraphina", "Isolde", "Wigonna", "Gorlafa", "Eksina", "Alana", "Brielle", "Cassia", "Delia"],

    human_male_names: [
        "Aarkosh", "Bram", "Ronan", "Kael", "Turlan Dampmantle", "Leswin Lightfinger", "Arion", "Balthus", "Corwin", "Dain", "Einar", 
        "Fendrel", "Gareth", "Hadrian", "Ivor", "Joric", "Kaelen", "Loric", "Merek", "Nevin", "Orin", "Perrin", "Quinn", "Roric", "Storn", 
        "Talon", "Ulric", "Vance", "Warrick", "Xavier", "Yoric", "Zane"
    ],
    human_female_names: [
        "Elara", "Seraphina", "Isolde", "Wigonna", "Gorlafa", "Eksina", "Alana", "Brielle", "Cassia", "Delia", "Eira", "Fiora", 
        "Gwyneth", "Helena", "Iona", "Jessa", "Kaelen", "Lyra", "Moira", "Nia", "Oria", "Petra", "Quorra", "Rhea", "Seraphine",
        "Tamsin", "Ulla", "Vera", "Wren", "Xylia", "Yara", "Zara"
    ],
    elven_names: ["Lael", "Arion", "Variel", "Soriel", "Aelar", "Elora", "Galina", "Lia", "Naivara", "Sariel"],
    dwarven_names: ["Borg", "Durin", "Gimli", "Rohir", "Bofur", "Dwalin", "Fror", "Gorm", "Helga", "Ingrid"],
    gnomish_names: ["Fimbelas", "Glim", "Nackle", "Pipin", "Wrenn", "Zook"],
    orcish_names: ["Kurach", "Grol", "Murg", "Shagrat", "Ugluk", "Grishnakh"],
    generic_surnames: ["Slycaller", "Greyshanks", "Coalbeard", "Proudpick", "Blackwood", "Stonehand", "Swiftwater", "Ironhide"],

    // --- APPEARANCE (Populated from source materials) ---
    physique: ["scrawny", "lanky", "gaunt", "stout", "barrel-chested", "imposingly large", "delicate", "brawny", "sinewy", "corpulent", "weather-beaten"],
    distinguishing_features: [
        "a set of intricate tattoos covering their arms", "a series of ritual scars on their face", "a missing eye, covered by a patch", 
        "a noticeable limp", "an unusually deep and gravelly voice", "impeccably dressed and groomed", "filthy and disheveled", 
        "a strangely melodic laugh", "a network of fine white scars", "a single white streak in their dark hair", "unnervingly sharp and intelligent eyes"
    ],
    clothing_style: ["ragged furs and hides", "simple, homespun peasant garb", "dark, well-worn leather armor", "ornate and colorful silks from a distant land", "the faded livery of a forgotten noble house", "heavy, intimidating plate mail, dented and scarred", "a traveler's cloak stained with the dust of many roads"],

    // --- PERSONALITY (Populated from Netbook & NOD) ---
    primary_trait: ["brave", "cowardly", "inquisitive", "suspicious", "honorable", "deceitful", "gregarious", "reclusive", "optimistic", "pessimistic", "stoic", "hot-tempered"],
    demeanor: ["cheerful and friendly", "dour and cynical", "manic and unpredictable", "calm and serene", "arrogant and boastful", "humble and quiet", "intensely curious", "utterly pragmatic", "deeply spiritual", "entirely materialistic"],
    secret_motivation: ["seeking revenge for a murdered family member", "protecting a dangerous secret that could topple a kingdom", "searching for a lost artifact of immense power", "desperately trying to pay off a debt to a powerful criminal organization", "trying to achieve a personal enlightenment or transcendence", "spying for a secret organization or a foreign power", "attempting to prove their worth to a disapproving family member", "fleeing a prophecy that foretells their doom"],

    // --- BACKGROUND & HOOKS (Populated from source materials) ---
    current_situation: ["lost in the wilderness and low on supplies", "hunting a specific, rare beast for a wealthy client", "on a religious pilgrimage to a holy site", "fleeing from the law after a heist gone wrong", "escorting a merchant caravan through dangerous territory", "guarding a sacred site from desecration", "recovering from a recent, brutal battle", "searching for a lost companion", "exploring the area to create a map", "delivering a message of great importance"],
    rumor_known: [
        "that a nearby ruin contains a treasure guarded by a terrible curse",
        "that a powerful monster has recently moved into the area, driving out the local game",
        "that the local lord is not who they claim to be, but a doppelganger",
        "of a rare celestial event that is expected to occur soon, which has magical properties",
        "of a hidden community of outcasts or exiles living nearby",
        "that a secret passage to the Underworld can be found in a nearby cave"
    ],

    // --- TEMPLATES ---
    templates: {
        simple_npc: [
            'You meet ${npcs.human_male_names} ${npcs.generic_surnames}, a ${npcs.physique} ${npcs.identity.class} known for being ${npcs.primary_trait}.'
        ],
        detailed_npc: [
            'You encounter a ${npcs.physique} ${npcs.species} ${npcs.identity.class} named ${npcs.human_female_names}. They are dressed in ${npcs.appearance.clothing_style} and have ${npcs.appearance.distinguishing_features}. Though they seem ${npcs.demeanor}, they are secretly ${npcs.secret_motivation}. Right now, they are ${npcs.background.current_situation} and might share a rumor about ${npcs.background.rumor_known}.'
        ]
    }
};