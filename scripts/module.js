import { EFFECTS, MODULE_ID, SOURCES, SUMMON_LEVELS_BY_RANK } from "./const.js";
import { addTraits, compFromUuid, getTokenImage, messageItemHasRollOption } from "./helpers.js";
import { extractDCValueRegex, isIncarnate } from "./incarnate.js";
import { setupSocket } from "./lib/socket.js";
import { isMechanic, setMechanicRelevantInfo } from "./specificClasses/mechanic.js";
import { scaleActorItems, scaleNPCToLevel } from "./scaleActor/scaleActor.js";
import { setupSettings } from "./settings.js";
import { getSpecificSummonDetails } from "./specificSummons.js";
import { handleUpdateMessage } from "./updateMessage.js";
import { isBindHeroicSpiritHit } from "./specificClasses/necromancer.js";

Hooks.once("init", async function () {
  loadTemplates([
    `modules/${MODULE_ID}/templates/updateMessage.hbs`,
  ])
  setupSettings();
});

Hooks.once("setup", function () {
  if (!setupSocket())
    console.error("Error: Unable to set up socketlib for Genga");
});

Hooks.once("ready", async function () {
  handleUpdateMessage()
  Hooks.on("createChatMessage", async (chatMessage, _info, userID) => {
    if (userID !== game.user.id) return;

    // Handle Specific Case Bind Heroic Spirit
    const itemUuid = isBindHeroicSpiritHit(chatMessage)
      ? SOURCES.NECROMANCER.BIND_HEROIC_SPIRIT_STRIKE
      : chatMessage?.item?.sourceId;

    if (!itemUuid) return;

    let summonLevel = 20;
    //attributes.classDC.value

    const summonerActor = ChatMessage.getSpeakerActor(chatMessage.speaker);
    const summonerAlliance = summonerActor.system.details.alliance;

    const spellRank = chatMessage?.flags?.pf2e?.origin?.castRank ?? 0;
    const spellRelevantInfo = { rank: spellRank, summonerLevel: summonerActor.level }
    //Grab DC for Incarnate spells
    if (isIncarnate(chatMessage)) spellRelevantInfo.dc = extractDCValueRegex(chatMessage.content) ?? 0;
    if (isMechanic(chatMessage)) {
      setMechanicRelevantInfo(summonerActor, spellRelevantInfo);
    }

    let summonDetailsGroup = getSpecificSummonDetails(itemUuid, spellRelevantInfo)
    if (!summonDetailsGroup) {
      summonDetailsGroup = getTraditionalSummonerSpellDetails(itemUuid, spellRank);
    }

    // No Summon Spell Found
    if (summonDetailsGroup === null) return;

    for (const summonDetails of summonDetailsGroup) {
      const requiredTraits = summonDetails?.traits || [];
      const allowedSpecificUuids = summonDetails?.specific_uuids || [];
      const actorModifications = summonDetails?.modifications || {};
      const itemsToAdd = summonDetails?.itemsToAdd || [];
      if (game.settings.get(MODULE_ID, "effect-ownership")) {
        itemsToAdd.unshift(
          EFFECTS.SUMMON_OWNER(
            getTokenImage(summonerActor.prototypeToken)
          )
        );
      }
      const amount = summonDetails?.amount || 1;
      summonLevel = getMaxSummonLevel(summonDetails.rank);

      let selectedActorUuid;
      if (allowedSpecificUuids.length === 1) {
        selectedActorUuid = allowedSpecificUuids[0]
      } else {
        selectedActorUuid = await foundrySummons.SummonMenu.start({
          //packs: ['pf2e.pathfinder-monster-core'],
          noSummon: true,
          filter: (candidateActor) => {
            const isCommonAndValidLevel =
              candidateActor.system.traits.rarity === "common" &&
              candidateActor.system.details.level.value <= summonLevel;

            const hasValidTraits = requiredTraits.length === 0 ||
              candidateActor.system.traits.value.some(actorTrait =>
                requiredTraits.some(requiredTrait => requiredTrait.toLowerCase() === actorTrait.toLowerCase())
              );

            const hasValidUuid = allowedSpecificUuids.length > 0 &&
              allowedSpecificUuids.includes(candidateActor?.uuid);

            return allowedSpecificUuids.length > 0
              ? hasValidUuid
              : isCommonAndValidLevel && hasValidTraits;
          },
          dropdowns: [{
            id: "sortOrder",
            name: "Sort order",
            options: [{ label: "Level descending", value: 0 }, { label: "Level", value: 1 }],
            sort: (actorA, actorB, sortIndex) => {
              if (sortIndex == 0) {
                if (actorA.system.details.level.value == actorB.system.details.level.value)
                  return actorA.name.localeCompare(actorB.name);
                else
                  return (actorB.system.details.level.value - actorA.system.details.level.value);
              }
              else {
                if (actorA.system.details.level.value == actorB.system.details.level.value)
                  return actorA.name.localeCompare(actorB.name);
                else
                  return (actorA.system.details.level.value - actorB.system.details.level.value);
              }
            }
          },
          {
            id: "traitsFilter",
            name: "Trait",
            options: [{ label: '', value: '' }, ...requiredTraits.toSorted().map(traitName => ({ label: traitName, value: traitName }))],
            func: (filterActor, selectedTrait) => {
              return !selectedTrait || filterActor.system.traits.value.some(actorTrait => selectedTrait.toLowerCase() == actorTrait.toLowerCase());
            }
          }],
          toggles: [{
            id: "onlyWithImages",
            name: "Only with image",
            func: (toggleActor, isToggleActive) => {
              return !isToggleActive || toggleActor.img != "systems/pf2e/icons/default-icons/npc.svg";
            },
            indexedFields: [
              "system.details.level.value",
              "system.traits.value",
              "system.traits.rarity",
              "img"
            ]
          }]
        });
      }

      const summonType = getSummonType(chatMessage.toObject())
      const additionalTraits = addTraits(summonType);

      const params = { selectedActorUuid, summonLevel, chatMessage: chatMessage.toObject(), itemUuid, summonerAlliance, additionalTraits, actorModifications, summonerActor: summonerActor.toObject(), amount, itemsToAdd };
      if (game.settings.get(MODULE_ID, "gm-places-summons")) {
        socketlib.modules.get(MODULE_ID).executeAsGM("gmHandleSummon", params)
      } else {
        await handleSummonPlacingAndPost(params);
      }
    }
  });
});


export async function handleSummonPlacingAndPost({ selectedActorUuid, summonLevel, chatMessage, itemUuid, summonerAlliance, additionalTraits, actorModifications, summonerActor, amount, itemsToAdd }) {
  const selectedActor = await compFromUuid(selectedActorUuid);
  const originalActorLevel = selectedActor.level;

  const houseRuleUpdates = await getHouseRuleUpdates(selectedActor, summonLevel, chatMessage, itemUuid);

  const actorUpdateData = {
    'system.details.alliance': summonerAlliance,
    'system.traits.value': [...selectedActor.system.traits.value, ...additionalTraits],
    ...houseRuleUpdates,
    ...actorModifications
  };

  if (game.settings.get(MODULE_ID, "name-ownership")) {
    actorUpdateData.name = `${summonerActor.name}'s ${selectedActor.name}`;
    actorUpdateData["prototypeToken.name"] = `${summonerActor.prototypeToken.name}'s ${selectedActor.prototypeToken.name}`;
  }

  for (let i = 0; i < amount; i++) {
    const tokDoc = await foundrySummons.pick({
      uuid: selectedActorUuid,
      updateData: actorUpdateData,
    });

    if (isMaxSummonLevelRuleActive(selectedActor, summonLevel, chatMessage, itemUuid)) {
      await scaleActorItems(tokDoc.actor, originalActorLevel, summonLevel);
    }

    if (itemsToAdd.length > 0) {
      await tokDoc.actor.createEmbeddedDocuments("Item", itemsToAdd);
    }
  }
}

/**
 * 
 * @param {String} uuid UUID of the spell casting
 * @param {Number} rank Rank of the spell cating
 * @returns {{traits: String[], rank: Number}} Traits and Rank of the spell
 */
function getTraditionalSummonerSpellDetails(uuid, rank) {
  const details = { traits: [], rank }
  switch (uuid) {
    case SOURCES.SUMMON.SUMMON_DRAGON:
      details.traits = ["dragon"];
      break;
    case SOURCES.SUMMON.SUMMON_UNDEAD:
      details.traits = ["undead"];
      break;
    case SOURCES.SUMMON.SUMMON_CELESTIAL:
      details.traits = ["celestial"];
      break;
    case SOURCES.SUMMON.SUMMON_FEY:
      details.traits = ["fey"];
      break;
    case SOURCES.SUMMON.SUMMON_ANIMAL:
      details.traits = ["animal"];
      break;
    case SOURCES.SUMMON.SUMMON_CONSTRUCT:
      details.traits = ["construct"];
      break;
    case SOURCES.SUMMON.SUMMON_LESSER_SERVITOR:
      details.traits = ["celestial", "fiend", "monitor", "animal"];
      if (rank > 4) details.rank = 4;
      break;
    case SOURCES.SUMMON.SUMMON_PLANT_OR_FUNGUS:
      details.traits = ["plant", "fungus"];
      break;
    case SOURCES.SUMMON.SUMMON_ELEMENTAL:
      details.traits = ["elemental"];
      break;
    case SOURCES.SUMMON.SUMMON_ENTITY:
      details.traits = ["aberration"];
      break;
    case SOURCES.SUMMON.SUMMON_FIEND:
      details.traits = ["fiend"];
      break;
    case SOURCES.SUMMON.SUMMON_GIANT:
      details.traits = ["giant"];
      break;
    case SOURCES.SUMMON.SUMMON_MONITOR:
      details.traits = ["monitor"];
      break;
    default:
      return null;
  }
  return [details];
}


function getSummonType(chatMessage) {
  if (isMechanic(chatMessage)) {
    return "mechanic"
  } else if (messageItemHasRollOption(chatMessage, "thrall")) {
    return "thrall"
  }
  return "summon"
}

function getMaxSummonLevel(spellRank) {
  if (game.settings.get(MODULE_ID, "house-rule.rank-upgrade")) {
    return SUMMON_LEVELS_BY_RANK[Math.min(spellRank + 1, 10)]
  } else {
    return SUMMON_LEVELS_BY_RANK[spellRank]
  }
}

async function getHouseRuleUpdates(actor, maxSummonLevel, chatMessage, itemUuid) {
  if (isMaxSummonLevelRuleActive(actor, maxSummonLevel, chatMessage, itemUuid)) {
    const oldLevel = actor.level;
    if (oldLevel < maxSummonLevel) {
      return await scaleNPCToLevel(actor, maxSummonLevel);
    }
  } else {
    return {}
  }
}

function isMaxSummonLevelRuleActive(actor, maxSummonLevel, chatMessage, itemUuid) {
  return game.settings.get(MODULE_ID, "house-rule.scale-to-max-summon-level-for-rank")
    && messageItemHasRollOption(chatMessage, "summon")
    && itemUuid !== SOURCES.SUMMON.PHANTASMAL_MINION
    && actor.level < maxSummonLevel
}





// function getMap(uuid) {
//   const name = fromUuidSync(uuid).name.toUpperCase().split(' ').join('_')
//       console.log(`${name}: "${uuid}",`)
//   }
