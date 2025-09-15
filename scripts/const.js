export const MODULE_ID = 'pf2e-summons-assistant';

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
    SUMMON_ROBOT: "Compendium.sf2e-anachronism.spells.Item.KlJEDmAOk1ztdNFf",
    PHANTASMAL_MINION: "Compendium.pf2e.spells-srd.Item.xqmHD8JIjak15lRk"
  },
  INCARNATE: {
    TEMPEST_OF_SHADES: "Compendium.pf2e.spells-srd.Item.JLdbyGKhjwAAoRLs",
    SUMMON_HEALING_SERVITOR: "Compendium.pf2e.spells-srd.Item.3r897dYO8oYvuyn5",
    SUMMON_ELEMENTAL_HERALD: "Compendium.pf2e.spells-srd.Item.kVNo3ga0lwLKPrem",
    CALL_FLUXWRAITH: "Compendium.pf2e.spells-srd.Item.i6GUJCWdNu2278oA",
  },

  WONDROUS_FIGURINE: {
    JADE_SERPENT: "Compendium.pf2e.equipment-srd.Item.RjJw7iHantxqeJu1"
  },

  MISC: {
    LIGHT: "Compendium.pf2e.spells-srd.Item.WBmvzNDfpwka3qT4",
    TELEKINETIC_HAND: "Compendium.pf2e.spells-srd.Item.pwzdSlJgYqN7bs2w",
    FLOATING_FLAME: "Compendium.pf2e.spells-srd.Item.2ZdHjnpEQJuqOYSG",
    CALL_URSINE_ALLY: "Compendium.pf2e.feats-srd.Item.kYYB7ziQZjlgQWWu",
    DUPLICATE_FOE: "Compendium.pf2e.spells-srd.Item.73rToy0v5Ra9NvL6",
    WOODEN_DOUBLE: "Compendium.pf2e.spells-srd.Item.aUMmmtPmBdCdVDed"
  },

  NECROMANCER: {
    CREATE_THRALL: "Compendium.pf2e-playtest-data.impossible-playtest-spells.Item.77lglowVpcnRRh3g",
    PERFECTED_THRALL: "Compendium.pf2e-playtest-data.impossible-playtest-spells.Item.kFkhtDYsR9fE0pAr",
    SKELETAL_LANCERS: "Compendium.pf2e-playtest-data.impossible-playtest-spells.Item.qtgps2eYcmWueed1",
    LIVING_GRAVEYARD: "Compendium.pf2e-playtest-data.impossible-playtest-spells.Item.SK8vQklaSQGd5DXw",
    RECURRING_NIGHTMARE: "Compendium.pf2e-playtest-data.impossible-playtest-spells.Item.ZVQziQ2l2vdZ5Wfr",
    CONGLOMERATE_OF_LIMBS: "Compendium.pf2e-playtest-data.impossible-playtest-spells.Item.OOmk0XI3lzhn42JT",

    INEVITABLE_RETURN: "Compendium.pf2e-playtest-data.impossible-playtest-actions.Item.jyhYP51XI09DFSqy",

    // Does not need slug, special case
    BIND_HEROIC_SPIRIT_STRIKE: "Compendium.pf2e-playtest-data.impossible-playtest-effects.Item.MTYxqIqJVzza1Lro"
  },

  COMMANDER: {
    PLANT_BANNER: "Compendium.pf2e.feats-srd.Item.xEeCaJsQeDtRAVk1"
  },

  MECHANIC: {
    DEPLOY_MINE: "Compendium.starfinder-field-test-for-pf2e.actions.Item.ccVcznj9KVYHLVaY",
    DOUBLE_DEPLOYMENT: "Compendium.starfinder-field-test-for-pf2e.feats.Item.x5rhl6ThqqjHGglD"
  },

  SUMMONER: {
    MANIFEST_EIDOLON: "Compendium.pf2e.actionspf2e.Item.n5vwBnLSlIXL9ptp"
  }
};

export const SLUG_TO_SOURCE = {
  "call-fluxwraith": SOURCES.CALL_FLUXWRAITH,
  "call-ursine-ally": SOURCES.CALL_URSINE_ALLY,
  "conglomerate-of-limbs": SOURCES.NECROMANCER.CONGLOMERATE_OF_LIMBS,
  "create-thrall": SOURCES.NECROMANCER.CREATE_THRALL,
  "deploy-mine": SOURCES.MECHANIC.DEPLOY_MINE,
  "double-deployment": SOURCES.MECHANIC.DOUBLE_DEPLOYMENT,
  "duplicate-foe": SOURCES.MISC.DUPLICATE_FOE,
  "floating-flame": SOURCES.MISC.FLOATING_FLAME,
  "inevitable-return": SOURCES.NECROMANCER.INEVITABLE_RETURN,
  "light": SOURCES.MISC.LIGHT,
  "living-graveyard": SOURCES.NECROMANCER.LIVING_GRAVEYARD,
  "manifest-eidolon": SOURCES.SUMMONER.MANIFEST_EIDOLON,
  "perfected-thrall": SOURCES.NECROMANCER.PERFECTED_THRALL,
  "phantasmal-minion": SOURCES.MISC.PHANTASMAL_MINION,
  "plant-banner": SOURCES.COMMANDER.PLANT_BANNER,
  "recurring-nightmare": SOURCES.NECROMANCER.RECURRING_NIGHTMARE,
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
  "telekinetic-hand": SOURCES.MISC.TELEKINETIC_HAND,
  "tempest-of-shades": SOURCES.INCARNATE.TEMPEST_OF_SHADES,
  "wondrous-figurine-jade-serpent": SOURCES.WONDROUS_FIGURINE.JADE_SERPENT,
  "activation-wondrous-figurine-jade-serpent": SOURCES.WONDROUS_FIGURINE.JADE_SERPENT,
  "wooden-double": SOURCES.MISC.WOODEN_DOUBLE
}

export const CREATURES = {
  PHANTASMAL_MINION: "Compendium.pf2e.pathfinder-bestiary.Actor.j7NNPfZwD19BwSEZ",
  LIGHT: {
    BLUE: "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.REPqt5wULBcqIM97",
    DARK_BLUE: "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.5nY61gR66kynnp5q",
    GREEN: "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.oESGKDON1Fi3dETS",
    WHITE: "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.pRL4h1K1hHBkEbIE",
    YELLOW: "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.wth1JZ22hGEusEC5"
  },
  FLOATING_FLAME: "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.HOq9yGxQLhhZcEAP",
  TELEKINETIC_HAND: "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.llXyX6eS8UHGqpnn",

  DUPLICATE_FOE: "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.03gFpid5kBiI3vXS",

  WOODEN_DOUBLE: "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.HItOCcAEKmJWVVko",

  HEALING_SERVITOR: "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.gqrW5aGfnjqNse2T",
  TEMPEST_OF_SHADES: "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.EwmHOiQTdCEmBKfA",
  ELEMENTAL_HERALD: {
    AIR: "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.upqvdqYb387AV0mW",
    EARTH: "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.9UfzRa3RWxk0CiJU",
    FIRE: "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.RYXePI8AGXkOIOm0",
    METAL: "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.etj1RoPaZdXWsiDL",
    WATER: "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.5pPl44PJyTu14aZM",
    WOOD: "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.y1WKpar1MIgAN45Y",
  },
  FLUXWRAITH: "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.3wO8dqpYCdGhIUla",

  BLACK_BEAR: "Compendium.pf2e.pathfinder-bestiary-2.Actor.xxP5FJotshmUQNtY",
  GRIZZLY_BEAR: "Compendium.pf2e.pathfinder-monster-core.Actor.6K4RWus85o8iqy0t",
  POLAR_BEAR: "Compendium.pf2e.pathfinder-bestiary-2.Actor.UqFObUjgFAlWrriA",
  CAVE_BEAR: "Compendium.pf2e.pathfinder-monster-core.Actor.AZIG0COCaDBronJa",

  GIANT_VIPER: "Compendium.pf2e.pathfinder-monster-core.Actor.AJ5LuNMVPLCydryP",

  COMMANDER: {
    PLANTED_BANNER: 'Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.D8gtAM19NQKqbBfW'
  },

  MECHANIC: {
    MINE: "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.sAVuxP25VE126TdZ",
  },

  NECROMANCER: {
    THRALL: "Compendium.pf2e-playtest-data.impossible-playtest-thralls.Actor.ISmLeI8zNc6YWysQ",
    PERFECTED_THRALL: "Compendium.pf2e-playtest-data.impossible-playtest-thralls.Actor.SX5QACMD5SvH9oeZ",
    SKELETAL_LANCERS: "Compendium.pf2e-playtest-data.impossible-playtest-thralls.Actor.d1333zUKqydfJM9b",
    LIVING_GRAVEYARD: "Compendium.pf2e-playtest-data.impossible-playtest-thralls.Actor.CN6TMEeEd0Wmvkct",
    RECURRING_NIGHTMARE: "Compendium.pf2e-playtest-data.impossible-playtest-thralls.Actor.uu7VA9eIwi1tUZVs",
    CONGLOMERATE_OF_LIMBS: "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-actors.Actor.XCOfL4Bx7BHwAXoa"
  },
}

export const FEATS = {
  MECHANIC: {
    CRITICAL_EXPLOSION: "Compendium.starfinder-field-test-for-pf2e.feats.Item.zsXV8mcHVZqx6FVj"
  }
}

export const SUMMON_LEVELS_BY_RANK = {
  1: -1, 2: 1, 3: 2, 4: 3, 5: 5, 6: 7, 7: 9, 8: 11, 9: 13, 10: 15
};

export const ALT_ART = {
  JB2A_FREE: {
    LIGHT: {
      TOKEN: "modules/JB2A_DnD5e/Library/Generic/Marker/MarkerLightOrbLoop_01_Regular_Blue_400x400.webm",
      ACTOR: "modules/JB2A_DnD5e/Library/Generic/Marker/MarkerLightOrbLoop_01_Regular_Blue_Thumb.webp"
    },
    FLOATING_FLAME: {
      TOKEN: "modules/JB2A_DnD5e/Library/2nd_Level/Flaming_Sphere/FlamingSphere_02_Orange_400x400.webm",
      ACTOR: "modules/JB2A_DnD5e/Library/2nd_Level/Flaming_Sphere/FlamingSphere_02_Orange_Thumb.webp"
    },
    TELEKINETIC_HAND: {
      TOKEN: "modules/JB2A_DnD5e/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Blue_400x400.webm",
      ACTOR: "modules/JB2A_DnD5e/Library/5th_Level/Arcane_Hand/ArcaneHand_Human_01_Idle_Blue_Thumb.webp"
    }
  }
}


export const EFFECTS = {
  NECROMANCER: {
    THRALL_EXPIRATION: (duration) => ({
      "name": game.i18n.localize("pf2e-summons-assistant.items.effects.thrall-expiration.name"),
      "type": "effect",
      "system": {
        "description": {
          "value": `<p>${game.i18n.localize("pf2e-summons-assistant.items.effects.thrall-expiration.description")}</p>`,
          "gm": ""
        },
        "publication": {
          "title": "PF2e Summons Assistant",
          "authors": "",
          "license": "OGL",
          "remaster": true
        },
        "level": {
          "value": 1
        },
        "duration": {
          "value": duration?.value ?? 1,
          "unit": duration?.unit ?? "minutes",
          "expiry": "turn-start",
        },
        "tokenIcon": {
          "show": true
        },
        "slug": "effect-thrall-expiration-date"
      },
      "img": "icons/magic/death/grave-tombstone-glow-teal.webp",
    }),
  },
  COMMANDER: {
    IN_PLANT_BANNER_RANGE: "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-items.Item.vnFV2b3aYdvGeVkM",
    PLANT_BANNER: "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-items.Item.uxS1nDflB45y3PPl"
  },
  SUMMON_OWNER: (imagePath) => ({
    "name": game.i18n.localize("pf2e-summons-assistant.items.effects.summon's-owner.name"),
    "type": "effect",
    "system": {
      "description": {
        "value": "",
        "gm": ""
      },
      "publication": {
        "title": "PF2e Summons Assistant",
        "authors": "",
        "license": "OGL",
        "remaster": true
      },
      "level": {
        "value": 1
      },
      "duration": {
        "value": -1,
        "unit": "unlimited",
        "expiry": null,
        "sustained": false
      },
      "tokenIcon": {
        "show": true
      },
      "slug": "effect-summons-owner"
    },
    "img": imagePath,
  }),
  DUPLICATE_FOE: (isFail) => ({
    "name": game.i18n.localize("pf2e-summons-assistant.items.effects.duplicate-foe.name"),
    "type": "effect",
    "system": {
      "description": {
        "value": "<p>Granted by @UUID[Compendium.pf2e.spells-srd.Item.73rToy0v5Ra9NvL6]</p><p>@Embed[Compendium.pf2e.spells-srd.Item.73rToy0v5Ra9NvL6]</p>",
        "gm": ""
      },
      "publication": {
        "title": "PF2e Summons Assistant",
        "authors": "",
        "license": "OGL",
        "remaster": true
      },
      "level": {
        "value": 1
      },
      "duration": {
        "value": isFail ? 1 : 2,
        "unit": isFail ? "minutes" : "rounds",
        "expiry": null,
        "sustained": true
      },
      "tokenIcon": {
        "show": true
      },
      "rules": [
        {
          "key": "TokenImage",
          "value": "{actor|prototypeToken.texture.src}",
          "tint": "#fea9a9",
        },
        ...(isFail ? [] :
          [{
            "key": "Note",
            "title": game.i18n.localize("pf2e-summons-assistant.items.effects.duplicate-foe.successful-save.title"),
            "selector": "strike-damage",
            "text": game.i18n.localize("pf2e-summons-assistant.items.effects.duplicate-foe.successful-save.text")
          }]
        )
      ],
      "slug": "effect-duplicate-foe"
    },
    "img": "systems/pf2e/icons/spells/duplicate-foe.webp",
  }),
  CONDITIONS: {
    INVISIBLE: 'Compendium.pf2e.conditionitems.Item.zJxUflt9np0q4yML'
  }
}

export const ACTIONS = {
  MECHANIC: {
    CRITICAL_EXPLOSION: () => ({
      "name": game.i18n.localize("pf2e-summons-assistant.items.actions.mechanic.critical-explosion.name"),
      "type": "action",
      "system": {
        "actionType": {
          "value": "passive"
        },
        "description": {
          "value": `<p>${game.i18n.localize("pf2e-summons-assistant.items.actions.mechanic.critical-explosion.description")}</p>`,
          "gm": ""
        },
        "publication": {
          "title": "PF2e Summons Assistant",
          "authors": "",
          "license": "OGL",
          "remaster": true
        },
        "rules": [{ "key": "RollOption", "option": "critical-explosion" }],
        "actions": {
          "value": 1
        },
        "category": null
      },
      "img": "systems/pf2e/icons/actions/Passive.webp",
    })
  }
}

export const ROLL_OPTION = {
  COMMANDER: {
    IN_PLANT_BANNER_RANGE: "self:effect:in-plant-banner-range"
  }
}