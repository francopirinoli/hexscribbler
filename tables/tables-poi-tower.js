// tables/tables-poi-tower.js

export const tables = {
    thematic_modules: [
        {
            title: "The Lonesome Lookout",
            intro: "Roosting atop a wooded knoll is a short tower crowned with a pair of ill-matched turrets.",
            details: 'Local legend refers to the tower as ${poi.Tower.sub_tables.tower_names}. It is currently occupied by a figure who ${poi.Tower.sub_tables.tower_dwellers}. Within, their grimoire is rumored to contain rare spells such as "${generic.rare_spells}" and "${generic.rare_spells}".'
        },
        // --- NEW MODULES ADDED ---
        {
            title: "A Ruined Watchtower",
            intro: "The uniformity of masonry sticks out like a sore thumb as you glimpse a crumbling fortification.",
            details: 'The tower was constructed ${poi.Tower.sub_tables.ruined_watchtower_construction}. The current inhabitant ${poi.Tower.sub_tables.ruined_watchtower_inhabitant}. Possible treasures within could also entail ${poi.Tower.sub_tables.ruined_watchtower_treasure}.'
        },
        {
            title: "The Forsaken Windmill",
            intro: "Periodically peeking out from the leafy canopy you spy the tattered sail of what could only be a windmill...",
            details: 'As the wind picks up, ${poi.Tower.sub_tables.forsaken_windmill_wind}. This ramshackle structure is home to ${poi.Tower.sub_tables.forsaken_windmill_inhabitants}. Secreted within the cap, in a locked footlocker is ${poi.Tower.sub_tables.forsaken_windmill_treasure}.'
        },
        {
            title: "A Wizard's Spire",
            intro: "A single column of reddish volcanic rock marked with crystalline windows bulges outward from the landscape.",
            details: 'The spire is home to a reclusive wizard, ${poi.Tower.sub_tables.wizards_spire_occupant}, who is currently ${poi.Tower.sub_tables.wizards_spire_activity}. The tower is protected by ${poi.Tower.sub_tables.wizards_spire_protection}.'
        },
    ],
    sub_tables: {
        tower_names: [
            "The Tower of Tetbury, all that remains from a village abandoned after reeling from a Dancing Plague",
            "Stont's Folly, built as an observation point for a war that ended by treaty moments after it was built",
            "the Ettinfast, after a namesake monarch who ruled from it ages ago",
            "Leech's Leap, from the tragic death of a lovesick doctor"
        ],
        tower_dwellers: [
            "Orius the One-Eyed, who built the cyclopean stonework with his own humongous hands",
            "Raddicus the Reluctant, a specialist in Maritime Necromancy seeking distraction",
            "a heartsick Toad familiar, using illusions and ventriloquism to maintain the memory of its master, Gardolith the Mighty",
            "the once-dashing Mavid Mendcloak, who lost his lower half in an Astral Accident and is now mostly tower-bound",
            "a group of angry Asphalt Elementals, errantly summoned and proving difficult to banish",
            "a sorceress who protects herself with a pair of Charmed Reticulated Medusae and a Wand of Animate Statuary"
        ],
        ruined_watchtower_construction: ["by a Local Lord, only a few years ago. Amazing how quickly it was reclaimed by the wilds", "as a forgotten bastion for an even more forgotten kingdom, defending its furthest borders", "far away, flung here by powerful magics", "by ancient Eohippus Centaurs, a rare example of their impressively functional architecture and novel staircases"],
        ruined_watchtower_inhabitant: ["is a sounder of Wild Bristleback Boars, fleeing at the first sign of trouble", "s are 2d8 Moss Goblin outcasts, driven from their tribe for breaking taboo", "is a squad Skeletal Soldiers, serving in this post through undeath, miming the sounding of horns with no breath to blow them", "is a Titanic Cicada Nymph, climbing the side in preparations for molting", "recently having devoured a whole tribe of Frog Men, a Chimera (Wolf/Crocodile/White Stag) with a distended belly", "s are a trio of Ghostly Monks, tending spectral grapevines for their highly-sought Hauntwine, oblivious to their deaths"],
        ruined_watchtower_treasure: ["a nearly rotten quiver containing a single Magic Arrow", "a remarkable stained-glass window, depicting a Spring Elf coronation", "a strongbox laden with the monthly salary of seven soldiers and crumbling Love Letters to the front", "a surprisingly cozy and comfortable habitation with a little cleanup and some minor maintenance", "several cellared barrels and over a dozen bottles of valuable vintages", "a groggy but loyal Rock Elemental, the size/shape of a capuchin monkey", "dangling from the dilapidated upper floors, an enchanted set of climbing gear with an Immovable Belaying Pin", "creeping ivy that conceals the True Name of Spring Showers"],
        forsaken_windmill_wind: ["the structure sullenly creaks and groans", "the sails seem to slowly spin, showering leaves down from nearby boughs", "you hear what sounds like a muffled and gruff voice indistinctly shout from within", "suddenly, there's a deafening crack and a brilliant flash as a lightning bolt strikes the structure. It's already starting to smolder"],
        forsaken_windmill_inhabitants: ["nothing but termites and their democratically elected queen: A talking green-legged spider", "a cloud of Bottle Bats (glass vials with batwings), live specimens are in high demand by alchemists and adventurers", "a trio of Magpie Folk Millers, who grind bones to pay protection money to the Ogre who claims this territory", "Modalbius, a talented but absent-minded aeromancer of ill-repute who can't afford anything better to serve as a tower", "the disembodied voice of a Giant, transformed into a windmill by powerful magics for stealing a powerful wizard's husband", "just the typical parasites one would find on and in a Windmill Mimic of this size"],
        forsaken_windmill_treasure: ["a collection of crooked accounting ledgers, stretching back five years", "a smaller locked chest containing the key to the outer chest", "a brilliantly dyed sack containing a twelve person silver set", "a recipe for a Magical Bread, that when eaten can cure some poisons", "a jarred Homunculus, placed here for punishment ages ago", "a Magical Weather Vane that can predict the weather", "a Feathered Hat of Seeming that allows the wearer to appear as a Dwarf or Magpie Folk", "long since mislaid Bagpipes Of Summoning"],
        wizards_spire_occupant: ["an undine wizard who desires lichdom", "a hag who rules the surrounding lands", "an even-tempered transmuter who is obsessed with perfecting the human form", "a dwarven warlady with a famous brewery"],
        wizards_spire_activity: ["racing against time to complete his phylactery", "scrying on the party from a pool of enchanted water", "conducting experiments on a young wyvern", "hosting a drinking contest to test the mettle of any visitors"],
        wizards_spire_protection: ["the animated remains of a rival sorcerer", "a pair of charmed reticulated medusae", "six vat-grown synthoids who carry pole-arms", "an effete mage and an old druid"]
    },
    encounters: ["a vigilant gargoyle", "a mad wizard's escaped experiment", "a rival apprentice trying to steal secrets", "a flight of harpies nesting on the battlements"],
    discoveries: ["a half-finished scroll of a powerful spell", "a hidden laboratory in the dungeon", "a telescope pointed at a strange star", "a collection of rare and valuable spell components"]
};