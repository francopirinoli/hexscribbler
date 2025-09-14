// tables/tables-poi-sepulcher.js

export const tables = {
    thematic_modules: [
        {
            title: "The Secluded Sepulcher",
            intro: "Nestled between earthen banks squats a stone structure, stippled with skulls.",
            details: 'The ossuary is sealed ${poi.Sepulcher.sub_tables.seals}. Inside, the primary skeleton ${poi.Sepulcher.sub_tables.skeletons}. Interred alongside the bones, one might find that ${poi.Sepulcher.sub_tables.treasures}.'
        },
        // --- NEW MODULES ADDED ---
        {
            title: "A Hoard of Headstones",
            intro: "Crowded together, thick as quills on a hedgehog are several dozen silent cenotaphs and open ossuaries...",
            details: 'Inscriptions upon the stones ${poi.Sepulcher.sub_tables.headstones_inscriptions}. The markers are huddled near a tree, which is ${poi.Sepulcher.sub_tables.headstones_tree}. One ossuary is still sealed, and within one may find ${poi.Sepulcher.sub_tables.headstones_ossuary}.'
        },
        {
            title: "The Tomb of the Prince of Thieves",
            intro: "A strange well rises up here in the hills, constructed of tan stones but so overgrown with moss and weeds that one might mistake it for a natural feature.",
            details: 'The well leads down to a gauntlet of tunnels, which has no monsters, but ${poi.Sepulcher.sub_tables.tomb_of_thieves_tunnels}. At the center of the complex is the crypt, where one finds ${poi.Sepulcher.sub_tables.tomb_of_thieves_crypt}.'
        },
        {
            title: "A Barrow Tomb",
            intro: "You see a grassy mound, larger than the surrounding hills. A single, heavy stone slab blocks the entrance.",
            // CORRECTED PATHS: Now points to generic tables
            details: 'This is the tomb of a ${generic.npc_adjectives} ${Forest.sub_tables.barrow_person}. The entrance is sealed by ${Forest.sub_tables.barrow_seal}. Inside, the main chamber contains a ${generic.building_materials} sarcophagus, guarded by ${generic.guardians}.'
        }
    ],
    sub_tables: {
        seals: [
            "by only a large stone; an earthen rut reveals it was recently opened",
            "with a layer of thick beeswax, impregnated with silver dust",
            "shoddily, but it carries a curious Curse if disturbed: gradual tooth-loss (two a day) may plague any would-be Tomb Robbers",
            "only nominally, as the pine-plank portal easily swings open with the slightest touch"
        ],
        skeletons: [
            "sits on a moldering wooden throne, surrounded by crockery filled with fused copper pieces",
            "was disinterred ages ago by greedy acolytes of the Osseous Church",
            "will never grow lonely, guarded by a loyal pair of Spectral Mastiffs",
            "is decidedly inhuman, with too many arms and four jaws. Glyphs tell of this celestial visitor defending a settlement from a Granitehide Gorgon",
            "immediately articulates and attacks the party with a wicked scimitar. If defeated, it will re-animate the next nightfall and track the party",
            "is what remains of Saint Audrinath, patron of Seamstresses. If re-dressed in new fabrics, an alcove reveals Mithril Needles of Mending"
        ],
        treasures: [
            "is a humble Holy Symbol, puissant against Wraiths and Wights",
            "in an iron-bound chest, is enough silver to buy two horses",
            "are seven fine and jeweled gold rings, one is magical, of Fire-Walking",
            "is a Shortsword that cuts through purse-strings on critical hits",
            "is a decaying bow with a magic bowstring: Unbreakable and Ever-waxed",
            "is a gingerly folded, ochre-colored Robe of Many Ears",
            "and skulls, is a Canopic Effigy that can prevent organ damage once",
            "is a Terracotta Golem, and partial (85%) instructions for its creation"
        ],
        headstones_inscriptions: [
            "are heavily weathered and worn, but in the local language date the tombs back a century or so",
            "can no longer be read, having been strategically excised and edited by the rusty chisels that litter the area",
            "are illuminated and embellished by a tenacious form of magical Tomb Moss, which has transformed the text into Thanatos, the language of the forgotten dead",
            "reveal dates of death in the future, and some even feature familiar names"
        ],
        headstones_tree: [
            "an old, sighing Chapter Oak carved with a heart and the initials of the Dungeon Master",
            "a Hopecherry half in bloom and half fruiting. It's said that stones swallowed will temporarily eliminate the ability to dream",
            "the sole survivor of a Bitter Linden arbor, planted by passing missionaries of the religion most favored by the Party, ages ago",
            "the thunder-blighted trunk of the Charnel Ash-Treant Necromancer, Branchbare, barely clinging to Un-life",
            "which is actually a polymorphed Pseudo-Dracolich. This is her hoard",
            "a massive Cemetery Birch. Scrawl a name on the papery bark torn from the trunk, wear it near your heart for a week, and the nuts that fall in the Autumn and find purchase will sprout as a graven tombstone or marker"
        ],
        headstones_ossuary: [
            "a hungover but grateful Satyr, placed here by Nymphs as a prank",
            "a scattering of moldering Elf bones, ritualistically split for their precious marrow",
            "the remains of almost an entire generation of Forest Gnomes, complete with terracotta grave good effigies of fantastic food",
            "a narrow staircase, leading into the Underworld",
            "a nearly disintegrated Smallfolk skeleton, wearing magical thigh high leather Boots of Branchwalking",
            "the wrath of a particular deity, for you have disturbed a Saint's Rest",
            "enough gold coin to buy a small boat and a Scroll of Acid Rain",
            "the perturbed and famished Gnoll Vampire: Skalkell"
        ],
        tomb_of_thieves_tunnels: [
            "are filled with deadly traps, but no chambers",
            "have no chambers, only tunnels that never join at right angles, and floors that are never on the same level",
            "abound with deadly traps and have no chambers, only tunnels",
            "exist solely as a gauntlet to be run by thieves, a final resting place for the finest thief to ever purloin a purse in Blackpoort"
        ],
        tomb_of_thieves_crypt: [
            "the skeletal remains of the thief, still wearing his black and scarlet doublet and domino mask",
            "a few tools and a bucket of dried mortar, as if he walled himself into the crypt",
            "his last remaining treasure: a set of burglar's tools of such perfect manufacture that they grant a +2 bonus to all thief abilities",
            "a series of clay tablets recording his life and accomplishments"
        ]
    },
    encounters: ["a Mummy guardian", "a swarm of skeletal rats", "a grave robber gang", "a death-obsessed cultist", "a Specter"],
    discoveries: ["a set of antique burial tools", "an unlooted sarcophagus", "a hidden chamber with canopic jars", "a series of hieroglyphs detailing a prophecy"]
};