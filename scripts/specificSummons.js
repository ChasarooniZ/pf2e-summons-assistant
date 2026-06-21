import {
  ACTIONS,
  ALT_ART,
  CREATURES,
  EFFECTS,
  RULE_ELEMENTS,
  SIZES,
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
import {
  dancingWeaponDialog,
  getJB2aPath,
} from "./specificCases/dancingWeapon.js";

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
    ignoreDialogue: false,
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
  [SOURCES.MISC.BILOCATION]: handlers.misc.handleBilocation,
  [SOURCES.MISC.CALL_URSINE_ALLY]: handlers.misc.handleCallUrsineAlly,
  [SOURCES.MISC.DRAGON_TURRET]: handlers.misc.handleDragonTurret,
  [SOURCES.MISC.DUPLICATE_FOE]: handlers.misc.handleDuplicateFoe,
  [SOURCES.MISC.FLOATING_FLAME]: handlers.misc.handleFloatingFlame,
  [SOURCES.MISC.HEALING_WELL]: handlers.misc.handleHealingWell,
  [SOURCES.MISC.LIGHT]: handlers.misc.handleLight,
  [SOURCES.MISC.ILLUSORY_CREATURE]: handlers.misc.handleIllusoryCreature,
  [SOURCES.MISC.INSTANT_MINEFIELD]: handlers.misc.handleInstantMinefield,
  [SOURCES.MISC.PROTECTOR_TREE]: handlers.misc.handleProtectorTree,
  [SOURCES.MISC.RAISE_THE_HORDE]: handlers.misc.handleNecrologistsHorde,
  [SOURCES.MISC.SHADOW_SELF]: handlers.misc.handleShadowSelf,
  [SOURCES.MISC.SWARM_FORTH]: handlers.misc.handleSwarmkeepersSwarm,
  [SOURCES.MISC.TELEKINETIC_HAND]: handlers.misc.handleTelekineticHand,
  [SOURCES.MISC.WOODEN_DOUBLE]: handlers.misc.handleWoodenDouble,

  // Creature Abilities
  [SOURCES.CREATURE_ABILITY.SHADOW_DOUBLES]:
    handlers.creatureAbility.handleShadowDouble,

  // Mundane
  [SOURCES.MUNDANE.CANDLE]: handlers.mundane.candle,
  [SOURCES.MUNDANE.LANTERN_BULLSEYE]: handlers.mundane.lanternBullseye,
  [SOURCES.MUNDANE.LANTERN_HOODED]: handlers.mundane.lanternHooded,
  [SOURCES.MUNDANE.TORCH]: handlers.mundane.torch,

  // Walls
  [SOURCES.WALL.PRISMATIC_SPHERE]: handlers.wall.handlePrismaticSphere,
  [SOURCES.WALL.PRISMATIC_WALL]: handlers.wall.handlePrismaticWall,
  [SOURCES.WALL.WALL_OF_ICE]: handlers.wall.handleWallOfIce,
  [SOURCES.WALL.WALL_OF_FIRE]: handlers.wall.handleWallOfFire,
  [SOURCES.WALL.WALL_OF_STONE]: handlers.wall.handleWallOfStone,
  [SOURCES.WALL.WALL_OF_SHADOW]: handlers.wall.handleWallOfShadow,

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

  // Psychic
  [SOURCES.PSYCHIC.DANCING_BLADE]: handlers.psychic.handleDancingBlade,

  // Summon
  [SOURCES.MISC.PHANTASMAL_MINION]: handlers.summon.handlePhantasmalMinion,

  // Summoner
  [SOURCES.SUMMONER.MANIFEST_EIDOLON]: handlers.summoner.handleManifestEidolon,

  [SOURCES.THAUMATURGE.MIRRORS_REFLECTION]:
    handlers.thaumaturge.handleMirrorsReflection,

  // Wondrous Figurine
  [SOURCES.WONDROUS_FIGURINE.BISMUTH_LEOPARDS]:
    handlers.wondrousFigurine.handleBismuthLeopards,
  [SOURCES.WONDROUS_FIGURINE.JADE_SERPENT]:
    handlers.wondrousFigurine.handleJadeSerpent,
});

const handlers = {
  commander: {
    handlePlantBanner: (data) => {
      return [
        {
          specific_uuids: [CREATURES.COMMANDER.PLANTED_BANNER],
          noDefaultTraits: true,
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
        {
          ...incarnateDetails({
            uuids: [CREATURES.FLUXWRAITH],
            rank: data.rank,
            dc: data.dc,
          }),
          noDefaultTraits: true,
        },
      ];
    },

    handleSummonElementalHerald: (data) => {
      return [
        {
          ...incarnateDetails({
            uuids: Object.values(CREATURES.ELEMENTAL_HERALD),
            rank: data.rank,
            dc: data.dc,
          }),
          noDefaultTraits: true,
        },
      ];
    },

    handleSummonHealingServitor: (data) => {
      return [
        {
          ...incarnateDetails({
            uuids: [CREATURES.HEALING_SERVITOR],
            rank: data.rank,
            dc: data.dc,
          }),
          noDefaultTraits: true,
        },
      ];
    },

    handleTempestOfShades: (data) => {
      return [
        {
          ...incarnateDetails({
            uuids: [CREATURES.TEMPEST_OF_SHADES],
            rank: data.rank,
            dc: data.dc,
          }),
          noDefaultTraits: true,
        },
      ];
    },
  },

  kineticist: {
    handleTimberSentinel: (data) => {
      return [
        {
          specific_uuids: [CREATURES.PROTECTOR_TREE],
          noDefaultTraits: true,
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
          noDefaultTraits: true,
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
          noDefaultTraits: true,
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
          noDefaultTraits: true,
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
          noDefaultTraits: true,
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
    handleBilocation: async (data) => {
      const actor = game.actors.get(data.summonerActorId);
      const effect = EFFECTS.BILOCATION;
      return [
        {
          specific_uuids: [actor.uuid],
          noDefaultTraits: true,
          isCharacter: true,
          itemsToAdd: [effect],
          crosshairParameters: {
            location: {
              obj: data.position,
              limitMaxRange: getGridUnitsFromFeet(5),
              displayRangePoly: true,
              rangePolyLineColor: 0x0,
              rangePolyFillColor: 0x0,
            },
          },
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
        const isFail = data.ignoreDialogue
          ? true
          : await foundry.applications.api.DialogV2.confirm({
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
          noDefaultTraits: true,
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
          noDefaultTraits: true,
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

    handleHealingWell: async (data) => {
      return [
        {
          specific_uuids: [CREATURES.HEALING_WELL],
          noDefaultTraits: true,
          rank: data.rank,
          modifications: {
            "system.details.level.value": data.rank,
          },
        },
      ];
    },

    handleInstantMinefield: async (data) => {
      return [
        {
          specific_uuids: [CREATURES.INSTANT_MINEFIELD_MINE],
          noDefaultTraits: true,
          amount: 6,
          rank: data.rank,
          modifications: {
            "system.details.level.value": data.rank,
            "system.skills.stealth.value": data.dc,
            "system.attributes.classDC.value": data.dc,
            hidden: game.user.isGM,
          },
        },
      ];
    },
    handleLight: async (data) => {
      let doSummon = true;
      if (!data.ignoreDialogue && hasNoTargets()) {
        doSummon = await foundry.applications.api.DialogV2.confirm({
          window: {
            title: game.i18n.localize(
              "pf2e-summons-assistant.dialog.light.title",
            ),
          },
          content: game.i18n.localize(
            "pf2e-summons-assistant.dialog.light.text",
          ),
          rejectClose: true,
          modal: true,
        });
      }
      if ((hasNoTargets() || data.ignoreDialogue) && doSummon) {
        return [
          {
            specific_uuids: Object.values(CREATURES.LIGHT),
            noDefaultTraits: true,
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
    handleIllusoryCreature: async (data) => {
      const maxSizeNumber = Math.min(data.rank + 1, SIZES.length);
      ui.notifications.info(
        game.i18n.localize(
          "pf2e-summons-assistant.notification.illusory-creature",
        ),
      );
      const actorUUID = data?.ignoreDialogue
        ? CREATURES.ILLUSORY_CREATURE
        : await foundrySummons.SummonMenu.start({
            noSummon: true,
            filter: (candidateActor) =>
              !candidateActor?.img?.endsWith("default-icons/npc.svg"),
            dropdowns: [
              {
                id: "sortOrder",
                name: game.i18n.localize("DOCUMENT.FIELDS.sort.label"),
                options: [
                  {
                    label: game.i18n.localize("PF2E.CharacterLevelLabel"),
                    value: 1,
                  },
                  {
                    label: `${game.i18n.localize("PF2E.CharacterLevelLabel")} ${game.i18n.localize("pf2e-summons-assistant.dialog.summon.sort.descending")}`,
                    value: 0,
                  },
                ],
                sort: (actorA, actorB, sortIndex) => {
                  const aLevel = actorA.system.details.level.value;
                  const bLevel = actorB.system.details.level.value;
                  if (aLevel === bLevel) {
                    return actorA.name.localeCompare(actorB.name);
                  } else {
                    return sortIndex === 0 ? bLevel - aLevel : aLevel - bLevel;
                  }
                },
              },
              {
                id: "traitsFilter",
                name: game.i18n.localize("PF2E.Traits"),
                options: [
                  { label: "", value: "" },
                  ...[
                    "dragon",
                    "undead",
                    "celestial",
                    "fey",
                    "animal",
                    "construct",
                    "celestial",
                    "plant",
                    "fungus",
                    "elemental",
                    "aberration",
                    "fiend",
                  ]
                    .toSorted()
                    .map((traitName) => ({
                      label: game.i18n.localize(
                        `PF2E.Trait${traitName[0].toUpperCase()}${traitName.slice(1)}`,
                      ),
                      value: traitName,
                    })),
                ],
                func: (filterActor, selectedTrait) => {
                  return (
                    !selectedTrait ||
                    filterActor.system.traits.value.some(
                      (actorTrait) =>
                        selectedTrait.toLowerCase() ===
                        actorTrait.toLowerCase(),
                    )
                  );
                },
              },
            ],
            toggles: [
              {
                id: "proper-size",
                name: "Proper Size",
                default: true,
                func: (toggleActor, isToggleActive) => {
                  return (
                    isToggleActive ||
                    SIZES?.[toggleActor?.system?.traits?.size?.value] <=
                      maxSizeNumber
                  );
                },
                indexedFields: [
                  "system.traits?.size.value",
                  "system.details.level.value",
                  "system.traits.value",
                  "img",
                ],
              },
            ],
          });
      const actor = await fromUuid(actorUUID);
      const texture = actor?.prototypeToken.ring.enabled
        ? actor?.prototypeToken?.ring?.subject?.texture ||
          actor?.prototypeToken?.texture?.src
        : actor?.prototypeToken?.texture?.src;
      return [
        {
          specific_uuids: [CREATURES.ILLUSORY_CREATURE],
          modifications: {
            "system.details.level.value": data.rank,
            "system.traits.size.value": actor?.system?.traits?.size?.value,
            prototypeToken: {
              "texture.src": actor?.prototypeToken?.texture?.src,
              alpha: actor?.prototypeToken?.alpha,
              ring: {
                enabled: actor?.prototypeToken?.ring?.enabled,
                subject: {
                  texture: actor?.prototypeToken?.ring?.subject?.texture,
                  scale: actor?.prototypeToken?.ring?.subject?.scale,
                },
              },
            },
          },
          tokenModifications: {
            "flags.pf2e.autoscale": false,
          },
          crosshairParameters: {
            texture: texture,
            distance: (actor?.prototypeToken.height * canvas.grid.distance) / 2,
          },
          itemsToAdd: [EFFECTS.RULE_EFFECT([RULE_ELEMENTS.SPELL_DC_FLAG])],
        },
      ];
    },
    handleNecrologistsHorde: async (data) => {
      const summonerActor = game.actors.get(data.summonerActorId);
      return [
        {
          specific_uuids: [CREATURES.NECROLOGISTS_HORDE],
          noDefaultTraits: true,
          rank: data.summonerLevel,
          modifications: {
            "system.details.level.value": data.summonerLevel,
            "system.attributes.ac.value":
              summonerActor?.system?.attributes?.ac?.value,
            "system.saves.fortitude.value":
              summonerActor?.system?.saves?.fortitude?.value,
            "system.saves.reflex.value":
              summonerActor?.system?.saves?.reflex?.value,
            "system.saves.will.value":
              summonerActor?.system?.saves?.will?.value,
            "system.perception.value": summonerActor?.system?.perception?.value,
          },
          crosshairParameters: {
            distance: canvas.grid.distance * 1.5,
          },
        },
      ];
    },
    handleShadowSelf: (data) => {
      const token = canvas.tokens.placeables.find(
        (t) => t?.actor?.id === data.summonerActorId,
      )?.document;
      return [
        {
          specific_uuids: [CREATURES.SHADOW_SELF],
          noDefaultTraits: true,
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

    handleSwarmkeepersSwarm: async (data) => {
      const summonerActor = game.actors.get(data.summonerActorId);
      return [
        {
          specific_uuids: [CREATURES.SWARMKEEPER_SWARM],
          noDefaultTraits: true,
          rank: data.summonerLevel,
          modifications: {
            "system.details.level.value": data.summonerLevel,
            "system.attributes.ac.value":
              summonerActor?.system?.attributes?.ac?.value,
            "system.saves.fortitude.value":
              summonerActor?.system?.saves?.fortitude?.value,
            "system.saves.reflex.value":
              summonerActor?.system?.saves?.reflex?.value,
            "system.saves.will.value":
              summonerActor?.system?.saves?.will?.value,
            "system.perception.value": summonerActor?.system?.perception?.value,
          },
          crosshairParameters: {
            distance: canvas.grid.distance,
            snap: {
              position: CONST.GRID_SNAPPING_MODES.VERTEX,
            },
          },
        },
      ];
    },

    handleTelekineticHand: async (data) => {
      const isInvisible = data.ignoreDialogue
        ? false
        : await foundry.applications.api.DialogV2.confirm({
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
          noDefaultTraits: true,
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
          noDefaultTraits: true,
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
          noDefaultTraits: true,
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
  creatureAbility: {
    handleShadowDouble: async (_data) => {
      return [
        {
          specific_uuids: [CREATURES.OZTHOOM_SHADOW_DOUBLE],
          noDefaultTraits: true,
          amount: 3,
        },
      ];
    },
  },
  mundane: {
    candle: async (_data) => {
      return [
        {
          specific_uuids: [CREATURES.MUNDANE.CANDLE],
          noDefaultTraits: true,
        },
      ];
    },
    lanternBullseye: async (_data) => {
      return [
        {
          specific_uuids: [CREATURES.MUNDANE.LANTERN_BULLSEYE],
          noDefaultTraits: true,
        },
      ];
    },
    lanternHooded: async (_data) => {
      return [
        {
          specific_uuids: [CREATURES.MUNDANE.LANTERN_HOODED],
          noDefaultTraits: true,
        },
      ];
    },
    torch: async (_data) => {
      return [
        {
          specific_uuids: [CREATURES.MUNDANE.TORCH],
          noDefaultTraits: true,
        },
      ];
    },
  },
  wall: {
    handlePrismaticSphere: (data) => {
      const token = canvas.tokens.placeables.find(
        (t) => t?.actor?.id === data.summonerActorId,
      );

      return [
        {
          specific_uuids: [CREATURES.PRISMATIC_SPHERE],
          noDefaultTraits: true,
          modifications: {
            level: data.rank,
            "system.resources.dc.value": data.dc,
          },
          crosshairParameters: {
            distance: getGridUnitsFromFeet(10),
            location: {
              obj: token,
              limitMaxRange:
                (canvas.grid.distance * token.document.width + 1) / 2,
            },
            snap: {
              position: CONST.GRID_SNAPPING_MODES.VERTEX,
            },
          },
        },
      ];
    },
    handlePrismaticWall: (data) => {
      return [
        {
          specific_uuids: [CREATURES.PRISMATIC_WALL],
          noDefaultTraits: true,
          modifications: {
            level: data.rank,
            "system.resources.dc.value": data.dc,
          },
          crosshairParameters: {
            snap: {
              position:
                CONST.GRID_SNAPPING_MODES.VERTEX |
                CONST.GRID_SNAPPING_MODES.CENTER,
            },
            label: {
              text: game.i18n.localize(
                "pf2e-summons-assistant.display-text.wall.start-point",
              ),
            },
          },
        },
      ];
    },
    handleWallOfIce: async (data) => {
      const type = data.ignoreDialogue
        ? "line"
        : await foundry.applications.api.DialogV2.wait({
            window: { title: "Wall of Ice" },
            content: await TextEditor.enrichHTML(
              `<p>${game.i18n.localize("pf2e-summons-assistant.dialog.choose-type-of")} @UUID[${SOURCES.WALL.WALL_OF_ICE}]</p>`,
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
          specific_uuids: [CREATURES.WALL_OF_ICE],
          noDefaultTraits: true,
          rank: data.rank,
          modifications: {
            "system.details.level.value": data.rank,
            "system.details.blurb": type,
            "system.attributes.hp.max":
              40 + Math.floor((data.rank - 5) / 2) * 10,
            "system.attributes.hp.value":
              40 + Math.floor((data.rank - 5) / 2) * 10,
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
    handleWallOfFire: async (data) => {
      if (!hasAnyJB2A()) {
        return null;
      }

      const type = data.ignoreDialogue
        ? "line"
        : await foundry.applications.api.DialogV2.wait({
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
          noDefaultTraits: true,
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
          noDefaultTraits: true,
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
    handleWallOfShadow: async (data) => {
      return [
        {
          specific_uuids: [CREATURES.WALL_OF_SHADOW],
          noDefaultTraits: true,
          rank: data.rank,
          modifications: {
            "system.details.level.value": data.rank,
          },
          crosshairParameters: {
            label: {
              text: game.i18n.localize(
                "pf2e-summons-assistant.display-text.wall.start-point",
              ),
            },
          },
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
          noDefaultTraits: true,
          rank: data.rank,
          itemsToAdd: [EFFECTS.NECROMANCER.THRALL_EXPIRATION(data.duration)],
        },
      ];
    },

    handleCreateThrall: (data) => {
      return [
        {
          specific_uuids: [CREATURES.NECROMANCER.THRALL],
          noDefaultTraits: true,
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
          noDefaultTraits: true,
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
          noDefaultTraits: true,
          rank: data.rank,
          itemsToAdd: [EFFECTS.NECROMANCER.THRALL_EXPIRATION(data.duration)],
        },
        {
          specific_uuids: [CREATURES.NECROMANCER.THRALL],
          noDefaultTraits: true,
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
          noDefaultTraits: true,
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
          noDefaultTraits: true,
          rank: data.rank,
          itemsToAdd: [EFFECTS.NECROMANCER.THRALL_EXPIRATION(data.duration)],
        },
      ];
    },

    handleSkeletalLancers: (data) => {
      return [
        {
          specific_uuids: [CREATURES.NECROMANCER.SKELETAL_LANCERS],
          noDefaultTraits: true,
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
  psychic: {
    handleDancingBlade: async (data) => {
      const summonerActor = game.actors.get(data.summonerActorId);
      const isAmped = data?.summonerRollOptions?.includes("amp-spell");
      let weapon = {
        id: "",
        name: "",
        tokenArt: getJB2aPath(
          "jb2a.spiritual_weapon.shortsword.01.spectral.02.green",
        ),
      };
      let dialogResult = {};
      let effect = {};
      if (!data.ignoreDialogue) {
        dialogResult = await dancingWeaponDialog(summonerActor, isAmped);
      }

      if (dialogResult.effect) {
        effect = dialogResult.effect;
      }
      if (dialogResult.weapon) {
        weapon = dialogResult.weapon;
      }

      return [
        {
          specific_uuids: [CREATURES.PSYCHIC.DANCING_BLADE],
          noDefaultTraits: true,
          rank: data.rank,
          modifications: {
            "system.details.level.value": data.rank,
            "prototypeToken.texture.src": weapon.tokenArt,
          },
          itemsToAdd: [effect],
          crosshairParameters: {
            distance: canvas.grid.distance / 4,
          },
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
      if (uuid)
        return [
          { specific_uuids: [uuid], noDefaultTraits: true, isCharacter: true },
        ];
      return null;
    },
  },
  thaumaturge: {
    handleMirrorsReflection: async (data) => {
      const actor = game.actors.get(data.summonerActorId);
      const effect = await fromUuid(EFFECTS.THAUMATURGE.MIRRORS_REFLECTION);
      return [
        {
          specific_uuids: [actor.uuid],
          noDefaultTraits: true,
          isCharacter: true,
          itemsToAdd: [effect],
          crosshairParameters: {
            location: {
              obj: data.position,
              limitMaxRange: getGridUnitsFromFeet(15),
              displayRangePoly: true,
              rangePolyLineColor: 0x0,
              rangePolyFillColor: 0x0,
            },
          },
        },
      ];
    },
  },

  wondrousFigurine: {
    handleBismuthLeopards: (data) => {
      return [
        {
          specific_uuids: [CREATURES.LEOPARD],
          amount: 2,
          modifications: {
            name: game.i18n.localize(
              "pf2e-summons-assistant.creature-name.wondrous-figurine.bismuth-leopard",
            ),
            "prototypeToken.name": game.i18n.localize(
              "pf2e-summons-assistant.creature-name.wondrous-figurine.bismuth-leopard",
            ),
            img: "modules/pf2e-summons-assistant/assets/actors/bismuth-leopard.webp",
            "prototypeToken.texture.src":
              "modules/pf2e-summons-assistant/assets/tokens/token/bismuth-leopard.webp",
            "prototypeToken.ring.subject.texture":
              "modules/pf2e-summons-assistant/assets/tokens/subject/bismuth-leopard.webp",
          },
          itemsToAdd: [
            EFFECTS.WONDROUS_FIGURINE.DURATION({ unit: "minute", amount: 10 }),
            EFFECTS.WONDROUS_FIGURINE.BISMUTH_LEOPARDS(),
          ],
        },
      ];
    },
    handleJadeSerpent: (data) => {
      return [
        {
          specific_uuids: [CREATURES.GIANT_VIPER],
          modifications: {
            name: game.i18n.localize(
              "pf2e-summons-assistant.creature-name.wondrous-figurine.jade-serpent",
            ),
            "prototypeToken.name": game.i18n.localize(
              "pf2e-summons-assistant.creature-name.wondrous-figurine.jade-serpent",
            ),
          },
          itemsToAdd: [
            EFFECTS.WONDROUS_FIGURINE.DURATION({ unit: "minute", amount: 10 }),
          ],
        },
      ];
    },
  },
};
