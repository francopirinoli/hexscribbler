// tables/tables-poi-settlement.js

export const tables = {
    thematic_modules: [
        {
            title: "A Rustic Village",
            intro: "You see the smoke from chimneys before you see the settlement itself, a small community nestled in the wilderness.",
            details: 'This village of about ${poi.Settlement.sub_tables.village_size} souls primarily supports itself through ${poi.Settlement.sub_tables.village_industry}. The people here are known to be ${poi.Settlement.sub_tables.village_nature}. They live in ${poi.Settlement.sub_tables.village_architecture_material} ${poi.Settlement.sub_tables.village_architecture_style}, protected by a ${poi.Settlement.sub_tables.village_protection}. The settlement is currently ruled by ${poi.Settlement.sub_tables.village_ruler}, and its people are famous for ${poi.Settlement.sub_tables.village_famous_for}. However, they harbor a dark secret: ${poi.Settlement.sub_tables.village_secrets}.'
        },
        {
            title: "An Isolated Dwelling",
            intro: "Unexpectedly, you come across a single dwelling, standing alone against the vast wilderness.",
            details: 'The structure is ${poi.Settlement.sub_tables.isolated_dwelling_structure}. It is currently home to ${poi.Settlement.sub_tables.isolated_dwelling_occupants}, who offer that their hospitality ${poi.Settlement.sub_tables.ramshackle_chalet_hospitality}.'
        },
        {
            title: "A Temporary Camp",
            intro: "The smell of a campfire and the low murmur of conversation alerts you to a temporary camp ahead.",
            details: 'The camp is occupied by ${poi.Settlement.sub_tables.temporary_camp_occupants}. They are currently ${poi.Settlement.sub_tables.temporary_camp_activity}. They have a structure of note: ${poi.Settlement.sub_tables.temporary_camp_structure}.'
        },
    ],

    // Sub-tables for the settlement modules. Core tables are from "The Hex Hack".
    sub_tables: {
        // --- Core Village Generator ---
        village_size: ["100 people", "200 people", "300 people", "400 people", "500 people", "600 people"],
        village_industry: ["fishing for eels and other river fish", "herding goats and sheep", "hunting and trapping local game", "mining for common stone and metals", "farming grains and root vegetables", "logging local hardwoods"],
        village_nature: ["ragged", "foppish", "swarthy", "fair-skinned", "chaotic", "lawful", "jovial", "somber", "militant", "peaceful", "licentious", "pious", "lanky", "stout", "dour", "hard-working", "thrifty", "lazy", "honest", "deceitful", "ill-tempered", "loutish", "friendly", "rude", "diplomatic", "literate", "cowardly", "bombastic", "wrathful", "meek"],
        village_architecture_style: ["huts", "houses", "longhouses", "cottages", "domes", "towers"],
        village_architecture_material: ["adobe", "bricks", "stones", "straw or wicker", "timber or logs", "wattle & daub"],
        village_protection: ["a natural thicket", "an earthen rampart", "a wooden palisade", "a stone wall", "a metal wall", "a geodesic dome"],
        village_water_source: ["a stream or river", "a well", "cisterns", "an aqueduct or reservoir"],
        village_ruler: ["a council of elders", "a mayor and ealdormen", "a noble", "a reeve of the nearest royalty", "a powerful NPC with class levels", "a monster"],
        village_specialist: ["an alchemist", "an armorer or bowyer", "a den of assassins or highwaymen", "a guide", "a healer", "a sage", "a temple with an adept", "a tavern", "an inn", "no specialist"],
        village_famous_for: ["their fine beer or ale", "their fine wine", "their legendary livestock", "their beauty", "their cunning", "their brawn", "their vigor", "their magical abilities", "their fine orchards", "their skill at weaving", "their skill at stoneworking", "their skill at woodworking", "their skill at smithcraft", "their domesticated monsters", "their strange customs", "their outlandish costumes", "their thick accents", "their impenetrable keep", "their vampire problem", "their melodious voices", "their lycanthrope problem", "their athleticism", "their love of gambling", "their haunted manor"],
        village_secrets: ["their suspicious lack of crime", "the guardian spirit that protects the village", "the friendly neighborhood druid", "their fey allies", "their fey tormentors", "their awful weather", "their rare herbs", "their outstanding breads and pastries", "their love of a good brawl", "their extreme xenophobia", "their visitations from beyond", "their dark secrets"],

        // --- Isolated Dwelling ---
        isolated_dwelling_structure: ["a ramshackle chalet at the start of a muddy, wagon-rutted road", "a small inn called 'The Inn for the Wandering Weary', which appears as a Brigadoon for three days every hundred years", "a fortified town in the southern Rooky Wood governed by the Grand Master of the Order of the Lion", "a motte-and-bailey castle built of white stone, home to a barbaric fighting-woman named Elsien"],
        isolated_dwelling_occupants: ["a tall person of indeterminate gender with a sour expression", "a congenial family of somewhat strange looking Humans, with distinctively large and gapped front teeth", "crusader knights founded by the King of Lyonesse to rid the woods of goblins", "an elite squadron of berserkers, all tall men with white hair and ritually scarred faces"],
        
        // --- Temporary Camp ---
        temporary_camp_occupants: ["a trio of enterprising Woodfolk rustlers", "a company of knights from Tourney, on a quest", "a trio of Magpie Folk Millers, who grind bones to pay protection money to a local Ogre", "a band of humanoids from the 'Jezek & Sons Lumber Consortium'"],
        temporary_camp_activity: ["stalking a nearby flock of sheep", "recovering from a recent battle", "making camp near a strange, sculpted boulder", "felling tall pines in a vale"],
        temporary_camp_structure: ["a makeshift tavern, called 'Sky-West & Crooked'", "a well maintained Shrine to the Godling of Hangovers", "an incongruously immaculate Stone Circle, overseen by a Druidess", "an incredible mound inhabited by ensorcelled Dire Termites who do most of the heavy lifting"]
    },
    encounters: ["the village watch patrol", "a drunken brawler looking for a fight", "a traveling merchant with rare goods", "a charismatic cult leader recruiting followers"],
    discoveries: ["a notice board with a lucrative bounty", "a hidden stash of smuggled goods", "a local festival in full swing", "a secret meeting of conspirators in the tavern"]
};