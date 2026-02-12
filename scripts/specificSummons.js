import {
  ACTIONS,
  ALT_ART,
  CREATURES,
  EFFECTS,
  RULE_ELEMENTS,
  SOURCES,
} from "./const.js";
import { getFoeInfo } from "./specificCases/duplicateFoe.js";
import {
  errorNotification,
  getAvengingWildwoodStrikeRuleElements,
  getGridUnitsFromFeet,
  hasAnyJB2A,
  hasNoTargets,
  onlyHasJB2AFree,
} from "./helpers.js";
import { incarnateDetails } from "./specificCases/incarnate.js";
import { getEidolon } from "./specificClasses/summoner.js";
import { isSummonSourceDisabled } from "./disableItems.js";
import { getNecromancerProf } from "./specificClasses/necromancer.js";

export async function getSpecificSummonDetails(
  uuid,
  data = {
    rank: 0,
    summonerLevel: 0,
    dc: 0,
    summonerRollOptions: [],
    itemRollOptions: [],
    targetTokenUUID: null,
    tokenWidth: 1,
    tokenHeight: 1,
  },
) {
  if (isSummonSourceDisabled(uuid)) {
    return null;
  }

  const SUMMON_HANDLERS = getSummonHandlers();
  const handler = SUMMON_HANDLERS[uuid];
  if (handler) {
    return await handler(data);
  }

  return null;
}

const getSummonHandlers = () => ({
  // Commander
  [SOURCES.COMMANDER.PLANT_BANNER]: handlers.commander.handlePlantBanner,

  // Incarnate
  [SOURCES.INCARNATE.CALL_FLUXWRAITH]: handlers.incarnate.handleCallFluxwraith,
  [SOURCES.INCARNATE.SUMMON_ELEMENTAL_HERALD]:
    handlers.incarnate.handleSummonElementalHerald,
  [SOURCES.INCARNATE.SUMMON_HEALING_SERVITOR]:
    handlers.incarnate.handleSummonHealingServitor,
  [SOURCES.INCARNATE.TEMPEST_OF_SHADES]:
    handlers.incarnate.handleTempestOfShades,

  // Kineticist
  [SOURCES.KINETICIST.TIMBER_SENTINEL]:
    handlers.kineticist.handleTimberSentinel,
  [SOURCES.KINETICIST.JAGGED_BERMS]: handlers.kineticist.handleJaggedBerms,

  // Mechanic
  [SOURCES.MECHANIC.DEPLOY_MINE]: handlers.mechanic.handleDeployMine,
  [SOURCES.MECHANIC.DOUBLE_DEPLOYMENT]:
    handlers.mechanic.handleDoubleDeployment,

  // Misc
  [SOURCES.MISC.AVENGING_WILDWOOD]: handlers.misc.handleAvengingWildwood,
  [SOURCES.MISC.CALL_URSINE_ALLY]: handlers.misc.handleCallUrsineAlly,
  [SOURCES.MISC.DRAGON_TURRET]: handlers.misc.handleDragonTurret,
  [SOURCES.MISC.DUPLICATE_FOE]: handlers.misc.handleDuplicateFoe,
  [SOURCES.MISC.FLOATING_FLAME]: handlers.misc.handleFloatingFlame,
  [SOURCES.MISC.LIGHT]: handlers.misc.handleLight,
  [SOURCES.MISC.PROTECTOR_TREE]: handlers.misc.handleProtectorTree,
  [SOURCES.MISC.SHADOW_SELF]: handlers.misc.handleShadowSelf,
  [SOURCES.MISC.TELEKINETIC_HAND]: handlers.misc.handleTelekineticHand,
  [SOURCES.MISC.WOODEN_DOUBLE]: handlers.misc.handleWoodenDouble,

  // Walls
  [SOURCES.WALL.WALL_OF_FIRE]: handlers.wall.handleWallOfFire,
  [SOURCES.WALL.WALL_OF_STONE]: handlers.wall.handleWallOfStone,

  // Necromancer
  [SOURCES.NECROMANCER.BIND_HEROIC_SPIRIT_STRIKE]:
    handlers.necromancer.handleBindHeroicSpiritStrike,
  [SOURCES.NECROMANCER.CONGLOMERATE_OF_LIMBS]:
    handlers.necromancer.handleConglomerateOfLimbs,
  [SOURCES.NECROMANCER.CREATE_THRALL]: handlers.necromancer.handleCreateThrall,
  [SOURCES.NECROMANCER.INEVITABLE_RETURN]:
    handlers.necromancer.handleInevitableReturn,
  [SOURCES.NECROMANCER.LIVING_GRAVEYARD]:
    handlers.necromancer.handleLivingGraveyard,
  [SOURCES.NECROMANCER.PERFECTED_THRALL]:
    handlers.necromancer.handlePerfectedThrall,
  [SOURCES.NECROMANCER.RECURRING_NIGHTMARE]:
    handlers.necromancer.handleRecurringNightmare,
  [SOURCES.NECROMANCER.SKELETAL_LANCERS]:
    handlers.necromancer.handleSkeletalLancers,

  // Summon
  [SOURCES.SUMMON.PHANTASMAL_MINION]: handlers.summon.handlePhantasmalMinion,

  // Summoner
  [SOURCES.SUMMONER.MANIFEST_EIDOLON]: handlers.summoner.handleManifestEidolon,

  // Wondrous Figurine
  [SOURCES.WONDROUS_FIGURINE.JADE_SERPENT]:
    handlers.wondrousFigurine.handleJadeSerpent,
});

const handlers = {
  commander: {
    handlePlantBanner: (data) => {
      return [
        {
          specific_uuids: [CREATURES.COMMANDER.PLANTED_BANNER],
          modifications: {
            "system.details.level.value": data.summonerLevel,
            "system.abilities.int.mod": data.int,
          },
          crosshairParameters: {
            snap: {
              position: CONST.GRID_SNAPPING_MODES.CORNER,
            },
          },
        },
      ];
    },
  },

  incarnate: {
    handleCallFluxwraith: (data) => {
      return [
        incarnateDetails({
          uuids: [CREATURES.FLUXWRAITH],
          rank: data.rank,
          dc: data.dc,
        }),
      ];
    },

    handleSummonElementalHerald: (data) => {
      return [
        incarnateDetails({
          uuids: Object.values(CREATURES.ELEMENTAL_HERALD),
          rank: data.rank,
          dc: data.dc,
        }),
      ];
    },

    handleSummonHealingServitor: (data) => {
      return [
        incarnateDetails({
          uuids: [CREATURES.HEALING_SERVITOR],
          rank: data.rank,
          dc: data.dc,
        }),
      ];
    },

    handleTempestOfShades: (data) => {
      return [
        incarnateDetails({
          uuids: [CREATURES.TEMPEST_OF_SHADES],
          rank: data.rank,
          dc: data.dc,
        }),
      ];
    },
  },

  kineticist: {
    handleTimberSentinel: (data) => {
      return [
        {
          specific_uuids: [CREATURES.PROTECTOR_TREE],
          modifications: {
            "system.attributes.hp.max":
              10 + (Math.round(data.summonerLevel / 2) - 1) * 10,
            "system.attributes.hp.value":
              10 + (Math.round(data.summonerLevel / 2) - 1) * 10,
            level: data.summonerLevel,
          },
          crosshairParameters: {
            location: {
              obj: data.position,
              limitMaxRange: getGridUnitsFromFeet(30),
              showRange: true,
            },
          },
        },
      ];
    },
    handleJaggedBerms: (data) => {
      return [
        {
          specific_uuids: [CREATURES.KINETICIST.JAGGED_BERMS],
          amount: 6,
          modifications: {
            "system.attributes.hp.max":
              20 + Math.floor((data.summonerLevel - 6) / 2) * 10,
            "system.attributes.hp.value":
              20 + Math.floor((data.summonerLevel - 6) / 2) * 10,
            level: data.summonerLevel,
          },
          crosshairParameters: ({ cnt }) => ({
            location: {
              obj: data.position,
              limitMaxRange: getGridUnitsFromFeet(120),
              showRange: true,
            },
            label: {
              text: `${game.i18n.localize(
                "pf2e-summons-assistant.display-text.jagged-berms.berm",
              )} (${cnt + 1} / 6)`,
              dy: -canvas.grid.size * 0.75,
            },
          }),
        },
      ];
    },
  },

  mechanic: {
    handleDeployMine: (data) => {
      return [
        {
          specific_uuids: [CREATURES.MECHANIC.MINE],
          rank: data.rank,
          modifications: {
            "system.details.level.value": data.summonerLevel,
            "system.resources.dc.value": data.classDC,
            "system.abilities.int.mod": data.int,
          },
          itemsToAdd: data.hasCriticalExplosion
            ? [ACTIONS.MECHANIC.CRITICAL_EXPLOSION()]
            : [],
        },
      ];
    },

    handleDoubleDeployment: (data) => {
      return [
        {
          specific_uuids: [CREATURES.MECHANIC.MINE],
          rank: data.rank,
          amount: 2,
          modifications: {
            "system.details.level.value": data.summonerLevel,
            "system.resources.dc.value": data.classDC,
            "system.abilities.int.mod": data.int,
          },
          itemsToAdd: data.hasCriticalExplosion
            ? [ACTIONS.MECHANIC.CRITICAL_EXPLOSION()]
            : [],
        },
      ];
    },
  },

  misc: {
    handleAvengingWildwood: (data) => {
      return [
        {
          specific_uuids: [CREATURES.AVENGING_WILDWOOD],
          modifications: {
            "system.attributes.hp.max": 20 + (data.rank - 2) * 10,
            "system.attributes.hp.value": 20 + (data.rank - 2) * 10,
            "system.attributes.ac.value": data.dc,
            "system.saves.fortitude.value": data.dc - 10,
            "system.saves.reflex.value": data.dc - 10,
            "system.saves.will.value": data.dc - 10,
          },
          itemsToAdd: [
            EFFECTS.RULE_EFFECT(
              getAvengingWildwoodStrikeRuleElements({ rank: data.rank }),
            ),
          ],
        },
      ];
    },
    handleCallUrsineAlly: (data) => {
      if (data.summonerLevel < 10) {
        return [{ specific_uuids: [CREATURES.BLACK_BEAR], rank: 3 }];
      } else if (data.summonerLevel < 12) {
        return [{ specific_uuids: [CREATURES.GRIZZLY_BEAR], rank: 4 }];
      } else if (data.summonerLevel < 14) {
        return [{ specific_uuids: [CREATURES.POLAR_BEAR], rank: 5 }];
      } else {
        return [{ specific_uuids: [CREATURES.CAVE_BEAR], rank: 6 }];
      }
    },
    handleDuplicateFoe: async (data) => {
      const token = await fromUuid(data.targetTokenUUID);
      const maxLevel = (data.rank - 7) * 2 + 15;

      if (token) {
        if (token?.actor?.level > maxLevel) {
          errorNotification(
            "pf2e-summons-assistant.notification.duplicate-foe.too-high",
          );
          return null;
        }

        const info = await getFoeInfo(token, data.rank);
        const isFail = await foundry.applications.api.DialogV2.confirm({
          content: game.i18n.localize(
            "pf2e-summons-assistant.dialog.duplicate-foe",
          ),
          rejectClose: false,
        });
        const effect = EFFECTS.DUPLICATE_FOE(isFail);
        effect.system.rules.push(...info.strikeRules);
        return [
          {
            specific_uuids: [CREATURES.DUPLICATE_FOE],
            rank: data.rank,
            modifications: {
              ...info.changes,
              "system.details.level.value": data.rank,
            },
            itemsToAdd: [effect, ...(info?.items ?? [])],
          },
        ];
      }
      return null;
    },

    handleDragonTurret: async (data) => {
      return [
        {
          specific_uuids: [CREATURES.DRAGON_TURRET],
          itemsToAdd: [EFFECTS.RULE_EFFECT([RULE_ELEMENTS.SPELL_DC_FLAG])],
          ...(data.itemRollOptions.length > 0
            ? {
                modifications: {
                  "system.traits.value": [
                    data.itemRollOptions
                      .find((option) =>
                        option.startsWith("spellcasting:tradition:"),
                      )
                      ?.replace("spellcasting:tradition:", ""),
                  ],
                },
              }
            : {}),
        },
      ];
    },

    handleFloatingFlame: async (data) => {
      return [
        {
          specific_uuids: [CREATURES.FLOATING_FLAME],
          rank: data.rank,
          modifications: {
            "system.details.level.value": data.rank,
            ...(onlyHasJB2AFree()
              ? {
                  "prototypeToken.texture.src":
                    ALT_ART.JB2A_FREE.FLOATING_FLAME.TOKEN,
                  img: ALT_ART.JB2A_FREE.FLOATING_FLAME.ACTOR,
                }
              : {}),
          },
          itemsToAdd: [EFFECTS.RULE_EFFECT([RULE_ELEMENTS.SPELL_DC_FLAG])],
        },
      ];
    },

    handleLight: async (data) => {
      if (hasNoTargets()) {
        return [
          {
            specific_uuids: Object.values(CREATURES.LIGHT),
            rank: data.rank,
            modifications: {
              "system.details.level.value": data.rank,
              ...(onlyHasJB2AFree()
                ? {
                    "prototypeToken.texture.src": ALT_ART.JB2A_FREE.LIGHT.TOKEN,
                    img: ALT_ART.JB2A_FREE.LIGHT.ACTOR,
                  }
                : {}),
            },
          },
        ];
      }
      return null;
    },

    handleShadowSelf: (data) => {
      const token = canvas.tokens.placeables.find(
        (t) => t.actor.id === data.summonerActorId,
      )?.document;
      return [
        {
          specific_uuids: [CREATURES.SHADOW_SELF],
          modifications: {
            img: token.actor.img,
            prototypeToken: {
              ring: token.ring,
              texture: { ...token.texture, tint: Color.fromString("#636363") },
            },
          },
          crosshairParameters: {
            location: {
              obj: data.position,
              limitMaxRange: getGridUnitsFromFeet(10),
              showRange: true,
            },
            icon: {
              texture: texture.src,
            },
          },
        },
      ];
    },

    handleTelekineticHand: async (data) => {
      const isInvisible = await foundry.applications.api.DialogV2.confirm({
        content: game.i18n.localize(
          "pf2e-summons-assistant.dialog.telekinetic-hand",
        ),
        rejectClose: false,
      });
      const itemsToAdd = [];
      if (isInvisible) {
        const invisible = await fromUuid(EFFECTS.CONDITIONS.INVISIBLE);
        itemsToAdd.push(invisible);
      }
      return [
        {
          specific_uuids: [CREATURES.TELEKINETIC_HAND],
          rank: data.rank,
          modifications: {
            ...(onlyHasJB2AFree()
              ? {
                  "prototypeToken.texture.src":
                    ALT_ART.JB2A_FREE.TELEKINETIC_HAND.TOKEN,
                  img: ALT_ART.JB2A_FREE.TELEKINETIC_HAND.ACTOR,
                }
              : {}),
          },
          itemsToAdd,
        },
      ];
    },

    handleWoodenDouble: async (data) => {
      return [
        {
          specific_uuids: [CREATURES.WOODEN_DOUBLE],
          modifications: {
            "system.details.level.value": data.rank,
            "system.attributes.hp.max": 20 + (data.rank - 3) * 10,
            "system.attributes.hp.value": 20 + (data.rank - 3) * 10,
            "prototypeToken.width": data.tokenWidth,
            "prototypeToken.height": data.tokenHeight,
          },
          crosshairParameters: {
            snap: {
              position:
                data.tokenWidth % 2 === 1
                  ? CONST.GRID_SNAPPING_MODES.CENTER
                  : CONST.GRID_SNAPPING_MODES.VERTEX,
            },
            label: {
              text: game.i18n.localize(
                "pf2e-summons-assistant.display-text.wooden-double.place-double",
              ),
            },
            ...(data.position
              ? {
                  location: {
                    obj: data.position,
                    limitMaxRange: 1,
                    showRange: true,
                  },
                }
              : {}),
          },
        },
      ];
    },

    handleProtectorTree: (data) => {
      return [
        {
          specific_uuids: [CREATURES.PROTECTOR_TREE],
          modifications: {
            "system.attributes.hp.max": 10 + (data.rank - 1) * 10,
            "system.attributes.hp.value": 10 + (data.rank - 1) * 10,
            level: data.rank,
          },
          crosshairParameters: {
            location: {
              obj: data.position,
              limitMaxRange: getGridUnitsFromFeet(30),
              showRange: true,
            },
          },
        },
      ];
    },
  },

  wall: {
    handleWallOfFire: async (data) => {
      if (!hasAnyJB2A()) {
        return null;
      }

      const type = await foundry.applications.api.DialogV2.wait({
        window: { title: "Wall of Fire" },
        content: await TextEditor.enrichHTML(
          `<p>${game.i18n.localize("pf2e-summons-assistant.dialog.choose-type-of")} @UUID[${SOURCES.WALL.WALL_OF_FIRE}]</p>`,
        ),
        // This example does not use i18n strings for the button labels,
        // but they are automatically localized.
        buttons: [
          {
            label: "Circle",
            action: "circle",
            icon: "fa-regular fa-circle",
          },
          {
            label: "Line",
            action: "line",
            icon: "fa-solid fa-direction-up-down",
          },
        ],
      });

      return [
        {
          specific_uuids: [CREATURES.WALL_OF_FIRE],
          rank: data.rank,
          modifications: {
            "system.details.level.value": data.rank,
            "system.details.blurb": type,
          },
          ...(type === "circle"
            ? {
                crosshairParameters: {
                  distance: 10.5,
                  snap: {
                    position:
                      CONST.GRID_SNAPPING_MODES.VERTEX |
                      CONST.GRID_SNAPPING_MODES.CENTER,
                  },
                },
              }
            : {
                crosshairParameters: {
                  label: {
                    text: game.i18n.localize(
                      "pf2e-summons-assistant.display-text.wall.start-point",
                    ),
                  },
                },
              }),
        },
      ];
    },
    handleWallOfStone: async (data) => {
      const max = 120;
      return [
        {
          specific_uuids: [CREATURES.WALL_OF_STONE],
          rank: data.rank,
          amount: max / 5,
          modifications: {
            "system.details.level.value": data.rank,
          },
          crosshairParameters: ({ cnt, prevSummonedToken }) => ({
            snap: {
              position: CONST.GRID_SNAPPING_MODES.EDGE_MIDPOINT,
              direction: 90,
            },
            label: {
              text: `${max - cnt * 5} / ${max} ft,`,
            },
            ...(prevSummonedToken
              ? {
                  location: {
                    obj: prevSummonedToken,
                    limitMaxRange: 5,
                  },
                }
              : {}),
          }),
        },
      ];
    },
  },

  necromancer: {
    handleBindHeroicSpiritStrike: (data) => {
      return [
        {
          specific_uuids: [CREATURES.NECROMANCER.THRALL],
          rank: 1,
          itemsToAdd: [EFFECTS.NECROMANCER.THRALL_EXPIRATION(data.duration)],
        },
      ];
    },

    handleConglomerateOfLimbs: (data) => {
      return [
        {
          specific_uuids: [CREATURES.NECROMANCER.CONGLOMERATE_OF_LIMBS],
          rank: data.rank,
          itemsToAdd: [EFFECTS.NECROMANCER.THRALL_EXPIRATION(data.duration)],
        },
      ];
    },

    handleCreateThrall: (data) => {
      return [
        {
          specific_uuids: [CREATURES.NECROMANCER.THRALL],
          rank: data.rank,
          amount: getNecromancerProf(data.summonerLevel),
          itemsToAdd: [
            EFFECTS.NECROMANCER.THRALL_EXPIRATION(data.duration, {
              uuid: SOURCES.NECROMANCER.CREATE_THRALL,
              castRank: data.rank,
              rollOptions: data.summonerRollOptions,
            }),
          ],
        },
      ];
    },

    handleInevitableReturn: (data) => {
      return [
        {
          specific_uuids: [CREATURES.NECROMANCER.THRALL],
          rank: data.rank,
          amount: 1,
          itemsToAdd: [EFFECTS.NECROMANCER.THRALL_EXPIRATION(data.duration)],
        },
      ];
    },

    handleLivingGraveyard: (data) => {
      return [
        {
          specific_uuids: [CREATURES.NECROMANCER.LIVING_GRAVEYARD],
          rank: data.rank,
          itemsToAdd: [EFFECTS.NECROMANCER.THRALL_EXPIRATION(data.duration)],
        },
        {
          specific_uuids: [CREATURES.NECROMANCER.THRALL],
          rank: data.rank,
          amount: 5,
          itemsToAdd: [
            EFFECTS.NECROMANCER.THRALL_EXPIRATION(data.duration, {
              uuid: SOURCES.NECROMANCER.CREATE_THRALL,
              castRank: data.rank,
              rollOptions: data.summonerRollOptions,
            }),
          ],
        },
      ];
    },

    handlePerfectedThrall: (data) => {
      return [
        {
          specific_uuids: [CREATURES.NECROMANCER.PERFECTED_THRALL],
          rank: data.rank,
          itemsToAdd: [
            EFFECTS.NECROMANCER.THRALL_EXPIRATION(data.duration, {
              uuid: SOURCES.NECROMANCER.PERFECTED_THRALL,
              castRank: data.rank,
              rollOptions: data.summonerRollOptions,
            }),
          ],
        },
      ];
    },

    handleRecurringNightmare: (data) => {
      return [
        {
          specific_uuids: [CREATURES.NECROMANCER.RECURRING_NIGHTMARE],
          rank: data.rank,
          itemsToAdd: [EFFECTS.NECROMANCER.THRALL_EXPIRATION(data.duration)],
        },
      ];
    },

    handleSkeletalLancers: (data) => {
      return [
        {
          specific_uuids: [CREATURES.NECROMANCER.SKELETAL_LANCERS],
          rank: data.rank,
          amount: 5,
          itemsToAdd: [
            EFFECTS.NECROMANCER.THRALL_EXPIRATION(data.duration, {
              uuid: SOURCES.NECROMANCER.SKELETAL_LANCERS,
              castRank: data.rank,
              rollOptions: data.summonerRollOptions,
            }),
          ],
        },
      ];
    },
  },

  summon: {
    handlePhantasmalMinion: (data) => {
      return [
        { specific_uuids: [CREATURES.PHANTASMAL_MINION], rank: data.rank },
      ];
    },
  },

  summoner: {
    handleManifestEidolon: async (data) => {
      const uuid = await getEidolon(data.summonerActorId);
      if (uuid) return [{ specific_uuids: [uuid], isCharacter: true }];
      return null;
    },
  },

  wondrousFigurine: {
    handleJadeSerpent: (data) => {
      return [
        {
          specific_uuids: [CREATURES.GIANT_VIPER],
        },
      ];
    },
  },
};
