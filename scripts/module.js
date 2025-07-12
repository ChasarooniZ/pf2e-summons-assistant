import { CREATURES, SPELLS, SUMMON_LEVELS_BY_RANK } from "./const.js";

Hooks.once("init", async function () { });

Hooks.once("ready", async function () {
  Hooks.on("createChatMessage", async (msg, _info, userID) => {
    if (userID !== game.user.id) return;
    const uuid = msg?.item?.sourceId;
    let rank = msg?.flags?.pf2e?.origin?.castRank;
    if (!uuid) return;
    if (typeof rank !== "number") return;
    // TODO handle Incarnate spells at a later date
    if (!msg?.flags?.pf2e?.origin?.rollOptions?.includes("summon")) return;
    let level = 20;

    const summoner = ChatMessage.getSpeakerActor(msg.speaker);
    const alliance = summoner.system.details.alliance;

    const details = getTraditionalSummonerSpellDetails(uuid, rank);
    const traits = details.traits;
    const specific_uuids = details.specific_uuids;
    level = SUMMON_LEVELS_BY_RANK[details.rank];

    const result = await foundrySummons.SummonMenu.start({
      //packs: ['pf2e.pathfinder-monster-core'],
      updateData: { 'system.details.alliance': alliance },
      filter: (actor) => {
        let result =
          actor.system.traits.rarity == "common" &&
          actor.system.details.level.value <= level;
        if (traits.length > 0) {
          result &= actor.system.traits.value.some((q) =>
            traits.some((r) => r.toLowerCase() == q.toLowerCase())
          );
        }
        if (specific_uuids.length > 0) {
          result &= specific_uuids.some((suuid) => suuid === actor?.uuid)
        }
        return result;
      },
      dropdowns: [{
        id: "sortOrder",
        name: "Sort order",
        options: [{ label: "Level descending", value: 0 }, { label: "Level", value: 1 }],
        sort: (a, b, i) => {
          if (i == 0) {
            if (a.system.details.level.value == b.system.details.level.value)
              return a.name.localeCompare(b.name);
            else
              return (b.system.details.level.value - a.system.details.level.value);
          }
          else {
            if (a.system.details.level.value == b.system.details.level.value)
              return a.name.localeCompare(b.name);
            else
              return (a.system.details.level.value - b.system.details.level.value);
          }
        }
      },
      {
        id: "traitsFilter",
        name: "Trait",
        options: [{ label: '', value: '' }, ...traits.toSorted().map(t => ({ label: t, value: t }))],
        func: (actor, i) => {
          return !i || actor.system.traits.value.some(q => i.toLowerCase() == q.toLowerCase());
        }
      }],
      toggles: [{
        id: "onlyWithImages",
        name: "Only with image",
        func: (actor, i) => {
          return !i || actor.img != "systems/pf2e/icons/default-icons/npc.svg";
        },
        indexedFields: [
          "system.details.level.value",
          "system.traits.value",
          "system.traits.rarity",
          "img"
        ]
      }]
    });
  });
});



/**
 * 
 * @param {String} uuid UUID of the spell casting
 * @param {Number} rank Rank of the spell cating
 * @returns {{traits: String[], rank: Number, specific_uuids?: String[]}} Traits and Rank of the spell
 */
function getTraditionalSummonerSpellDetails(uuid, rank) {
  const details = { traits: [], rank, specific_uuids: [] }
  switch (uuid) {
    case SPELLS.SUMMON.SUMMON_DRAGON:
      details.traits = ["dragon"];
      break;
    case SPELLS.SUMMON.SUMMON_UNDEAD:
      details.traits = ["undead"];
      break;
    case SPELLS.SUMMON.SUMMON_CELESTIAL:
      details.traits = ["celestial"];
      break;
    case SPELLS.SUMMON.SUMMON_FEY:
      details.traits = ["fey"];
      break;
    case SPELLS.SUMMON.SUMMON_ANIMAL:
      details.traits = ["animal"];
      break;
    case SPELLS.SUMMON.SUMMON_CONSTRUCT:
      details.traits = ["construct"];
      break;
    case SPELLS.SUMMON.SUMMON_LESSER_SERVITOR:
      details.traits = ["celestial", "fiend", "monitor", "animal"];
      if (rank > 4) details.rank = 4;
      break;
    case SPELLS.SUMMON.SUMMON_PLANT_OR_FUNGUS:
      details.traits = ["plant", "fungus"];
      break;
    case SPELLS.SUMMON.SUMMON_ELEMENTAL:
      details.traits = ["elemental"];
      break;
    case SPELLS.SUMMON.SUMMON_ENTITY:
      details.traits = ["aberration"];
      break;
    case SPELLS.SUMMON.SUMMON_FIEND:
      details.traits = ["fiend"];
      break;
    case SPELLS.SUMMON.SUMMON_GIANT:
      details.traits = ["giant"];
      break;
    case SPELLS.SUMMON.SUMMON_MONITOR:
      details.traits = ["monitor"];
      break;
    case SPELLS.SUMMON.PHANTASMAL_MINION:
      details.specific_uuids = [CREATURES.PHANTASMAL_MINION]
      break;
  }
  return details;
}

// function getMap(uuid) {
//   const name = fromUuidSync(uuid).name.toUpperCase().split(' ').join('_')
//       console.log(`${name}: "${uuid}",`)
//   }
