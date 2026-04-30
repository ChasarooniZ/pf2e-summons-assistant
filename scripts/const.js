import { createThrallAttackInfo } from "./specificClasses/necromancer.js";

export const MODULE_ID = "pf2e-summons-assistant";

export const DEF_TOKEN_CONFIGS = {
  name: "",
  imagePath: "",
  scale: 1,
  ringEnabled: false,
  subjectTexture: "",
  subjectScaleCorrection: 1,
};

//Source is stored in the SYSTEM IT COMES FROM TO PREVENT ISSUES
export const SOURCES = {
  SUMMON: {
    SUMMON_DRAGON: "Compendium.pf2e.spells-srd.Item.kghwmH3tQjMIhdH1",
    SUMMON_UNDEAD: "Compendium.pf2e.spells-srd.Item.9WGeBwIIbbUuWKq0",
    SUMMON_CELESTIAL: "Compendium.pf2e.spells-srd.Item.lTDixrrNKaCvLKwX",
    SUMMON_FEY: "Compendium.pf2e.spells-srd.Item.hs7h8f4Z1ZNdUt3s",
    SUMMON_ANIMAL: "Compendium.pf2e.spells-srd.Item.4YnON9JHYqtLzccu",
    SUMMON_CONSTRUCT: "Compendium.pf2e.spells-srd.Item.lKcsmeOrgHtK4xQa",
    SUMMON_LESSER_SERVITOR: "Compendium.pf2e.spells-srd.Item.B0FZLkoHsiRgw7gv",
    SUMMON_PLANT_OR_FUNGUS: "Compendium.pf2e.spells-srd.Item.jSRAyd57kd4WZ4yE",
    SUMMON_ELEMENTAL: "Compendium.pf2e.spells-srd.Item.lpT6LotUaQPfinjj",
    SUMMON_ENTITY: "Compendium.pf2e.spells-srd.Item.i1TvBID5QLyXrUCa",
    SUMMON_FIEND: "Compendium.pf2e.spells-srd.Item.29ytKctjg7qSW2ff",
    SUMMON_GIANT: "Compendium.pf2e.spells-srd.Item.e9UJoVYUd5kJWUpi",
    SUMMON_MONITOR: "Compendium.pf2e.spells-srd.Item.ZbEHglw5tkJ3grQZ",
    SUMMON_ROBOT: "Compendium.sf2e.spells.Item.KlJEDmAOk1ztdNFf",
  },
  INCARNATE: {
    TEMPEST_OF_SHADES: "Compendium.pf2e.spells-srd.Item.JLdbyGKhjwAAoRLs",
    SUMMON_HEALING_SERVITOR: "Compendium.pf2e.spells-srd.Item.3r897dYO8oYvuyn5",
    SUMMON_ELEMENTAL_HERALD: "Compendium.pf2e.spells-srd.Item.kVNo3ga0lwLKPrem",
    CALL_FLUXWRAITH: "Compendium.pf2e.spells-srd.Item.i6GUJCWdNu2278oA",
  },

  WONDROUS_FIGURINE: {
    JADE_SERPENT: "Compendium.pf2e.equipment-srd.Item.RjJw7iHantxqeJu1",
  },

  MISC: {
    AVENGING_WILDWOOD: "Compendium.pf2e.spells-srd.Item.T7N0LrYOLk3SwrFW",
    CALL_URSINE_ALLY: "Compendium.pf2e.feats-srd.Item.kYYB7ziQZjlgQWWu",
    DRAGON_TURRET: "Compendium.pf2e.spells-srd.Item.eAOClJ1KRSPik8SX",
    DUPLICATE_FOE: "Compendium.pf2e.spells-srd.Item.73rToy0v5Ra9NvL6",
    FLOATING_FLAME: "Compendium.pf2e.spells-srd.Item.2ZdHjnpEQJuqOYSG",
    HEALING_WELL: "Compendium.pf2e.spells-srd.Item.CzjQtkRuRlzRvwzg",
    INSTANT_MINEFIELD: "Compendium.pf2e.spells-srd.Item.vuehhQN8gPSpqcEK",
    LIGHT: "Compendium.pf2e.spells-srd.Item.WBmvzNDfpwka3qT4",
    PHANTASMAL_MINION: "Compendium.pf2e.spells-srd.Item.xqmHD8JIjak15lRk",
    PROTECTOR_TREE: "Compendium.pf2e.spells-srd.Item.K9gI08enGtmih5X1",
    RAISE_THE_HORDE: "Compendium.pf2e.actionspf2e.Item.ND1G3s4lXNUAXc1q",
    SHADOW_SELF: "Compendium.pf2e.feats-srd.Item.7YvOqcdp9Z0RALMp",
    SWARM_FORTH: "Compendium.pf2e.actionspf2e.Item.E48YTUyreo1kc9GM",
    TELEKINETIC_HAND: "Compendium.pf2e.spells-srd.Item.pwzdSlJgYqN7bs2w",
    WOODEN_DOUBLE: "Compendium.pf2e.spells-srd.Item.aUMmmtPmBdCdVDed",
  },

  MUNDANE: {
    CANDLE: "Compendium.pf2e.equipment-srd.Item.Ti4gWILk69LPxKuU",
    LANTERN_BULLSEYE: "Compendium.pf2e.equipment-srd.Item.QrNvP9SgnK9DrerA",
    LANTERN_HOODED: "Compendium.pf2e.equipment-srd.Item.dIRZ0LL7G31fJNYz",
    TORCH: "Compendium.pf2e.equipment-srd.Item.8Jdw4yAzWYylGePS",
  },

  CREATURE_ABILITY: {
    SHADOW_DOUBLES: "Actor.KE3Xq3ee3Yzmkygl.Item.Q0VRtsqm6etoZxCa",
  },

  WALL: {
    WALL_OF_FIRE: "Compendium.pf2e.spells-srd.Item.IarZrgCeaiUqOuRu",
    WALL_OF_STONE: "Compendium.pf2e.spells-srd.Item.kOa055FIrO9Smnya",
  },

  KINETICIST: {
    TIMBER_SENTINEL: "Compendium.pf2e.feats-srd.Item.aHlcMMNQ85VLK7QT",
    JAGGED_BERMS: "Compendium.pf2e.feats-srd.Item.9L6c9sxweM4IdOse",
  },

  NECROMANCER: {
    CREATE_THRALL:
      "Compendium.pf2e-playtest-data.impossible-playtest-spells.Item.77lglowVpcnRRh3g",
    PERFECTED_THRALL:
      "Compendium.pf2e-playtest-data.impossible-playtest-spells.Item.kFkhtDYsR9fE0pAr",
    SKELETAL_LANCERS:
      "Compendium.pf2e-playtest-data.impossible-playtest-spells.Item.qtgps2eYcmWueed1",
    LIVING_GRAVEYARD:
      "Compendium.pf2e-playtest-data.impossible-playtest-spells.Item.SK8vQklaSQGd5DXw",
    RECURRING_NIGHTMARE:
      "Compendium.pf2e-playtest-data.impossible-playtest-spells.Item.ZVQziQ2l2vdZ5Wfr",
    CONGLOMERATE_OF_LIMBS:
      "Compendium.pf2e-playtest-data.impossible-playtest-spells.Item.OOmk0XI3lzhn42JT",

    INEVITABLE_RETURN:
      "Compendium.pf2e-playtest-data.impossible-playtest-actions.Item.jyhYP51XI09DFSqy",

    // Does not need slug, special case
    BIND_HEROIC_SPIRIT_STRIKE:
      "Compendium.pf2e-playtest-data.impossible-playtest-effects.Item.MTYxqIqJVzza1Lro",
  },

  COMMANDER: {
    PLANT_BANNER: "Compendium.pf2e.feats-srd.Item.xEeCaJsQeDtRAVk1",
  },

  MECHANIC: {
    DEPLOY_MINE:
      "Compendium.starfinder-field-test-for-pf2e.actions.Item.ccVcznj9KVYHLVaY",
    DOUBLE_DEPLOYMENT:
      "Compendium.starfinder-field-test-for-pf2e.feats.Item.x5rhl6ThqqjHGglD",
  },

  SUMMONER: {
    MANIFEST_EIDOLON: "Compendium.pf2e.actionspf2e.Item.n5vwBnLSlIXL9ptp",
  },
};

export const SLUG_TO_SOURCE = {
  "avenging-wildwood": SOURCES.MISC.AVENGING_WILDWOOD,
  "call-fluxwraith": SOURCES.CALL_FLUXWRAITH,
  "call-ursine-ally": SOURCES.CALL_URSINE_ALLY,
  candle: SOURCES.MUNDANE.CANDLE,
  "conglomerate-of-limbs": SOURCES.NECROMANCER.CONGLOMERATE_OF_LIMBS,
  "create-thrall": SOURCES.NECROMANCER.CREATE_THRALL,
  "deploy-mine": SOURCES.MECHANIC.DEPLOY_MINE,
  "double-deployment": SOURCES.MECHANIC.DOUBLE_DEPLOYMENT,
  "dragon-turret": SOURCES.MISC.DRAGON_TURRET,
  "duplicate-foe": SOURCES.MISC.DUPLICATE_FOE,
  "floating-flame": SOURCES.MISC.FLOATING_FLAME,
  "healing-well": SOURCES.MISC.HEALING_WELL,
  "inevitable-return": SOURCES.NECROMANCER.INEVITABLE_RETURN,
  "instant-minefield": SOURCES.MISC.INSTANT_MINEFIELD,
  "jagged-berms": SOURCES.KINETICIST.JAGGED_BERMS,
  "lantern-bulls-eye": SOURCES.MUNDANE.LANTERN_BULLSEYE,
  "lantern-hooded": SOURCES.MUNDANE.LANTERN_HOODED,
  light: SOURCES.MISC.LIGHT,
  "living-graveyard": SOURCES.NECROMANCER.LIVING_GRAVEYARD,
  "manifest-eidolon": SOURCES.SUMMONER.MANIFEST_EIDOLON,
  "perfected-thrall": SOURCES.NECROMANCER.PERFECTED_THRALL,
  "phantasmal-minion": SOURCES.MISC.PHANTASMAL_MINION,
  "plant-banner": SOURCES.COMMANDER.PLANT_BANNER,
  "protector-tree": SOURCES.MISC.PROTECTOR_TREE,
  "raise-the-horde": SOURCES.MISC.RAISE_THE_HORDE,
  "recurring-nightmare": SOURCES.NECROMANCER.RECURRING_NIGHTMARE,
  "shadow-doubles": SOURCES.CREATURE_ABILITY.SHADOW_DOUBLES,
  "shadow-self": SOURCES.SHADOW_SELF,
  "skeletal-lancers": SOURCES.NECROMANCER.SKELETAL_LANCERS,
  "summon-animal": SOURCES.SUMMON.SUMMON_ANIMAL,
  "summon-celestial": SOURCES.SUMMON.SUMMON_CELESTIAL,
  "summon-construct": SOURCES.SUMMON.SUMMON_CONSTRUCT,
  "summon-dragon": SOURCES.SUMMON.SUMMON_DRAGON,
  "summon-elemental": SOURCES.SUMMON.SUMMON_ELEMENTAL,
  "summon-elemental-herald": SOURCES.SUMMON.SUMMON_ELEMENTAL_HERALD,
  "summon-entity": SOURCES.SUMMON.SUMMON_ENTITY,
  "summon-fey": SOURCES.SUMMON.SUMMON_FEY,
  "summon-fiend": SOURCES.SUMMON.SUMMON_FIEND,
  "summon-giant": SOURCES.SUMMON.SUMMON_GIANT,
  "summon-healing-servitor": SOURCES.SUMMON.SUMMON_HEALING_SERVITOR,
  "summon-lesser-servitor": SOURCES.SUMMON.SUMMON_LESSER_SERVITOR,
  "summon-monitor": SOURCES.SUMMON.SUMMON_MONITOR,
  "summon-plant-or-fungus": SOURCES.SUMMON.SUMMON_PLANT_OR_FUNGUS,
  "summon-robot": SOURCES.SUMMON.SUMMON_ROBOT,
  "summon-undead": SOURCES.SUMMON.SUMMON_UNDEAD,
  "swarm-forth": SOURCES.MISC.SWARM_FORTH,
  "telekinetic-hand": SOURCES.MISC.TELEKINETIC_HAND,
  "tempest-of-shades": SOURCES.INCARNATE.TEMPEST_OF_SHADES,
  torch: SOURCES.MUNDANE.TORCH,
  "timber-sentinel": SOURCES.KINETICIST.TIMBER_SENTINEL,
  "wondrous-figurine-jade-serpent": SOURCES.WONDROUS_FIGURINE.JADE_SERPENT,
  "activation-wondrous-figurine-jade-serpent":
    SOURCES.WONDROUS_FIGURINE.JADE_SERPENT,
  "wall-of-fire": SOURCES.WALL.WALL_OF_FIRE,
  "wall-of-stone": SOURCES.WALL.WALL_OF_STONE,
  "wooden-double": SOURCES.MISC.WOODEN_DOUBLE,
};

export const CREATURES = {
  AVENGING_WILDWOOD:
    "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.LB2e6ze90XNiwFcW",
  BLACK_BEAR: "Compendium.pf2e.pathfinder-bestiary-2.Actor.xxP5FJotshmUQNtY",
  CAVE_BEAR: "Compendium.pf2e.pathfinder-monster-core.Actor.AZIG0COCaDBronJa",
  COMMANDER: {
    PLANTED_BANNER:
      "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.D8gtAM19NQKqbBfW",
  },
  DRAGON_TURRET:
    "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.UGy4139EDrjbVDbv",
  DUPLICATE_FOE:
    "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.03gFpid5kBiI3vXS",
  ELEMENTAL_HERALD: {
    AIR: "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.upqvdqYb387AV0mW",
    EARTH:
      "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.9UfzRa3RWxk0CiJU",
    FIRE: "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.RYXePI8AGXkOIOm0",
    METAL:
      "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.etj1RoPaZdXWsiDL",
    WATER:
      "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.5pPl44PJyTu14aZM",
    WOOD: "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.y1WKpar1MIgAN45Y",
  },
  FLOATING_FLAME:
    "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.HOq9yGxQLhhZcEAP",
  FLUXWRAITH:
    "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.3wO8dqpYCdGhIUla",
  GIANT_VIPER: "Compendium.pf2e.pathfinder-monster-core.Actor.AJ5LuNMVPLCydryP",
  GRIZZLY_BEAR:
    "Compendium.pf2e.pathfinder-monster-core.Actor.6K4RWus85o8iqy0t",
  HEALING_SERVITOR:
    "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.gqrW5aGfnjqNse2T",
  HEALING_WELL:
    "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.4JEJfYNtUzSuYxPW",
  INSTANT_MINEFIELD_MINE:
    "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.uQjg9X2YxIUCuqyF",
  KINETICIST: {
    JAGGED_BERMS:
      "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.Q93AQlbUTJcPlxYI",
  },
  LIGHT: {
    BLUE: "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.REPqt5wULBcqIM97",
    DARK_BLUE:
      "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.5nY61gR66kynnp5q",
    GREEN:
      "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.oESGKDON1Fi3dETS",
    WHITE:
      "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.pRL4h1K1hHBkEbIE",
    YELLOW:
      "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.wth1JZ22hGEusEC5",
  },
  MECHANIC: {
    MINE: "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.sAVuxP25VE126TdZ",
  },
  MUNDANE: {
    CANDLE:
      "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.fTM3vgcCM5bAJmrS",
    LANTERN_BULLSEYE:
      "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.NYZhWZaM91h2pyrr",
    LANTERN_HOODED:
      "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.Fne56CFRula1SkY0",
    TORCH:
      "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.arDOv12cxLYNh2tW",
  },
  NECROLOGISTS_HORDE:
    "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.NnaI8Zd5ZFfz8zs2",
  NECROMANCER: {
    THRALL:
      "Compendium.pf2e-playtest-data.impossible-playtest-thralls.Actor.ISmLeI8zNc6YWysQ",
    PERFECTED_THRALL:
      "Compendium.pf2e-playtest-data.impossible-playtest-thralls.Actor.SX5QACMD5SvH9oeZ",
    SKELETAL_LANCERS:
      "Compendium.pf2e-playtest-data.impossible-playtest-thralls.Actor.d1333zUKqydfJM9b",
    LIVING_GRAVEYARD:
      "Compendium.pf2e-playtest-data.impossible-playtest-thralls.Actor.CN6TMEeEd0Wmvkct",
    RECURRING_NIGHTMARE:
      "Compendium.pf2e-playtest-data.impossible-playtest-thralls.Actor.uu7VA9eIwi1tUZVs",
    CONGLOMERATE_OF_LIMBS:
      "Compendium.pf2e-playtest-data.impossible-playtest-thralls.Actor.Xuy2zf3qpsmm8wbb",
  },
  OZTHOOM_SHADOW_DOUBLE:
    "Compendium.pf2e.pathfinder-monster-core-2.Actor.wNa8UPQqSepdxscG",
  PHANTASMAL_MINION:
    "Compendium.pf2e.pathfinder-bestiary.Actor.j7NNPfZwD19BwSEZ",
  POLAR_BEAR: "Compendium.pf2e.pathfinder-bestiary-2.Actor.UqFObUjgFAlWrriA",
  PROTECTOR_TREE:
    "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.jVsAEp6bR4mXtwHQ",
  SHADOW_SELF:
    "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.nodnIFYW56Lk3mcY",
  SWARMKEEPER_SWARM:
    "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.OLl3yZYdsc3CLrld",
  TELEKINETIC_HAND:
    "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.llXyX6eS8UHGqpnn",
  TEMPEST_OF_SHADES:
    "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.EwmHOiQTdCEmBKfA",
  WALL_OF_FIRE:
    "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.r60N6I3qmqC8K965",
  WALL_OF_STONE:
    "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.HakOgoig5LWhcq1B",
  WOODEN_DOUBLE:
    "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.WNBOiDVexWG6DwCO",
};

export const FEATS = {
  MECHANIC: {
    CRITICAL_EXPLOSION:
      "Compendium.starfinder-field-test-for-pf2e.feats.Item.zsXV8mcHVZqx6FVj",
  },
};

export const SUMMON_LEVELS_BY_RANK = {
  1: -1,
  2: 1,
  3: 2,
  4: 3,
  5: 5,
  6: 7,
  7: 9,
  8: 11,
  9: 13,
  10: 15,
};

export const ALT_ART = {
  JB2A_FREE: {
    LIGHT: {
      TOKEN:
        "modules/JB2A_DnD5e/Library/Generic/Marker/MarkerLightOrbLoop_01_Regular_Blue_400x400.webm",
      ACTOR:
        "modules/JB2A_DnD5e/Library/Generic/Marker/MarkerLightOrbLoop_01_Regular_Blue_Thumb.webp",
    },
    FLOATING_FLAME: {
      TOKEN:
        "modules/JB2A_DnD5e/Library/2nd_Level/Flaming_Sphere/FlamingSphere_02_Orange_400x400.webm",
      ACTOR:
        "modules/JB2A_DnD5e/Library/2nd_Level/Flaming_Sphere/FlamingSphere_02_Orange_Thumb.webp",
    },
    TELEKINETIC_HAND: {
      TOKEN:
        "modules/JB2A_DnD5e/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Blue_400x400.webm",
      ACTOR:
        "modules/JB2A_DnD5e/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Blue_Thumb.webp",
    },
  },
};

export const EFFECTS = {
  NECROMANCER: {
    THRALL_EXPIRATION: (duration, config = {}) => ({
      name: game.i18n.localize(
        "pf2e-summons-assistant.items.effects.thrall-expiration.name",
      ),
      type: "effect",
      system: {
        description: {
          value: `<p>${game.i18n.localize("pf2e-summons-assistant.items.effects.thrall-expiration.description")}</p>`,
          gm: "",
        },
        publication: {
          title: "PF2e Summons Assistant",
          authors: "",
          license: "OGL",
          remaster: true,
        },
        level: {
          value: 1,
        },
        duration: {
          value: duration?.value ?? 1,
          unit: duration?.unit ?? "minutes",
          expiry: "turn-start",
        },
        rules: createThrallAttackInfo(config),
        tokenIcon: {
          show: true,
        },
        slug: "effect-thrall-expiration-date",
      },
      img: "icons/magic/death/grave-tombstone-glow-teal.webp",
    }),
  },
  COMMANDER: {
    IN_PLANT_BANNER_RANGE:
      "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-items.Item.vnFV2b3aYdvGeVkM",
    PLANT_BANNER:
      "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-items.Item.uxS1nDflB45y3PPl",
  },
  SUMMON_OWNER: (imagePath) => ({
    name: game.i18n.localize(
      "pf2e-summons-assistant.items.effects.summon's-owner.name",
    ),
    type: "effect",
    system: {
      description: {
        value: "",
        gm: "",
      },
      publication: {
        title: "PF2e Summons Assistant",
        authors: "",
        license: "OGL",
        remaster: true,
      },
      level: {
        value: 1,
      },
      duration: {
        value: -1,
        unit: "unlimited",
        expiry: null,
        sustained: false,
      },
      tokenIcon: {
        show: true,
      },
      slug: "effect-summons-owner",
    },
    img: imagePath,
  }),
  DUPLICATE_FOE: (isFail) => ({
    name: game.i18n.localize(
      "pf2e-summons-assistant.items.effects.duplicate-foe.name",
    ),
    type: "effect",
    system: {
      description: {
        value:
          "<p>Granted by @UUID[Compendium.pf2e.spells-srd.Item.73rToy0v5Ra9NvL6]</p><p>@Embed[Compendium.pf2e.spells-srd.Item.73rToy0v5Ra9NvL6]</p>",
        gm: "",
      },
      publication: {
        title: "PF2e Summons Assistant",
        authors: "",
        license: "OGL",
        remaster: true,
      },
      level: {
        value: 1,
      },
      duration: {
        value: isFail ? 1 : 2,
        unit: isFail ? "minutes" : "rounds",
        expiry: null,
        sustained: true,
      },
      tokenIcon: {
        show: true,
      },
      rules: [
        {
          key: "TokenImage",
          value: "{actor|prototypeToken.texture.src}",
          tint: "#fea9a9",
        },
        ...(isFail
          ? []
          : [
              {
                key: "Note",
                title: game.i18n.localize(
                  "pf2e-summons-assistant.items.effects.duplicate-foe.successful-save.title",
                ),
                selector: "strike-damage",
                text: game.i18n.localize(
                  "pf2e-summons-assistant.items.effects.duplicate-foe.successful-save.text",
                ),
              },
            ]),
      ],
      slug: "effect-duplicate-foe",
    },
    img: "systems/pf2e/icons/spells/duplicate-foe.webp",
  }),
  RULE_EFFECT: (ruleconfig) => ({
    name: game.i18n.localize(
      "pf2e-summons-assistant.items.effects.rule-elements.name",
    ),
    type: "effect",
    system: {
      description: {
        value: `<p>${game.i18n.localize("pf2e-summons-assistant.items.effects.rule-elements.description")}</p>`,
        gm: "",
      },
      publication: {
        title: "PF2e Summons Assistant",
        authors: "",
        license: "OGL",
        remaster: true,
      },
      level: {
        value: 1,
      },
      duration: {
        value: -1,
        unit: "unlimited",
        expiry: null,
      },
      rules: ruleconfig,
      tokenIcon: {
        show: false,
      },
      slug: "effect-rule-elements",
    },
    img: "icons/commodities/tech/cog-steel-grey.webp",
  }),
  CONDITIONS: {
    INVISIBLE: "Compendium.pf2e.conditionitems.Item.zJxUflt9np0q4yML",
  },
};

export const ACTIONS = {
  MECHANIC: {
    CRITICAL_EXPLOSION: () => ({
      name: game.i18n.localize(
        "pf2e-summons-assistant.items.actions.mechanic.critical-explosion.name",
      ),
      type: "action",
      system: {
        actionType: {
          value: "passive",
        },
        description: {
          value: `<p>${game.i18n.localize("pf2e-summons-assistant.items.actions.mechanic.critical-explosion.description")}</p>`,
          gm: "",
        },
        publication: {
          title: "PF2e Summons Assistant",
          authors: "",
          license: "OGL",
          remaster: true,
        },
        rules: [{ key: "RollOption", option: "critical-explosion" }],
        actions: {
          value: 1,
        },
        category: null,
      },
      img: "systems/pf2e/icons/actions/Passive.webp",
    }),
  },
};

export const ROLL_OPTION = {
  COMMANDER: {
    IN_PLANT_BANNER_RANGE: "self:effect:in-plant-banner-range",
    HAS_PLANT_BANNER_FEAT: "feat:plant-banner",
  },
};

export const CONDITIONS_AFFECTING_SPELL_DC = new Set([
  "frightened",
  "sickened",
  "stupefied",
]);

export const RULE_ELEMENTS = {
  SPELL_DC_FLAG: {
    key: "ActiveEffectLike",
    mode: "add",
    path: "flags.pf2e-summons-assistant.dc",
    value: "@item.origin.system.attributes.spellDC.value",
  },
};

export const AFFECTED_BY_HOUSE_RULES = new Set(Object.values(SOURCES.SUMMON));
