import { MODULE_ID, SOURCES } from "./const.js";
import { messageItemHasRollOption } from "./helpers.js";
import { extractDCValueRegex, isIncarnate } from "./incarnate.js";
import { isMechanic, setMechanicRelevantInfo } from "./specificClasses/mechanic.js";
import { isSummoner, setSummonerRelevantInfo } from "./specificClasses/summoner.js";
import { setupSettings } from "./settings.js";
import { getSpecificSummonDetails } from "./specificSummons.js";
import { handleUpdateMessage } from "./updateMessage.js";
import { summon, getTraditionalSummonerSpellDetails } from "./summon.js";
import { isBindHeroicSpiritHit, setNecromancerHooks } from "./specificClasses/necromancer.js";

Hooks.once("init", async function () {
  loadTemplates([
    `modules/${MODULE_ID}/templates/updateMessage.hbs`,
  ])
  setupSettings();
});

Hooks.once("ready", async function () {
  handleUpdateMessage();
  setNecromancerHooks();
  Hooks.on("createChatMessage", async (chatMessage, _info, userID) => {
    if (userID !== game.user.id) return;

    const isBindHeroicSpiritSuccess = isBindHeroicSpiritHit(chatMessage);

    if (chatMessage.isRoll && !isBindHeroicSpiritSuccess) return;

    // Handle Specific Case Bind Heroic Spirit
    const itemUuid = isBindHeroicSpiritSuccess
      ? SOURCES.NECROMANCER.BIND_HEROIC_SPIRIT_STRIKE
      : chatMessage?.item?.sourceId;

    if (!itemUuid) return;

    if (chatMessage?.flags?.pf2e?.appliedDamage) return;

    // TODO handle Incarnate spells at a later date
    //if (!chatMessage?.flags?.pf2e?.origin?.rollOptions?.includes("summon")) return;
    let summonLevel = 20;
    //attributes.classDC.value

    const summonerActor = ChatMessage.getSpeakerActor(chatMessage.speaker);

    const spellRank = chatMessage?.flags?.pf2e?.origin?.castRank ?? 0;
    const spellRelevantInfo = { rank: spellRank, summonerLevel: summonerActor.level }
    //Grab DC for Incarnate spells
    if (isIncarnate(chatMessage)) spellRelevantInfo.dc = extractDCValueRegex(chatMessage.content) ?? 0;
    if (isMechanic(chatMessage)) {
      setMechanicRelevantInfo(summonerActor, spellRelevantInfo);
    }
    if (isSummoner(chatMessage)) {
      setSummonerRelevantInfo(summonerActor, spellRelevantInfo);
    }
    if (itemUuid === SOURCES.COMMANDER.PLANTED_BANNER) {
      spellRelevantInfo.int = summonerActor.system.abilities.int.mod;
    }

    let summonDetailsGroup = await getSpecificSummonDetails(itemUuid, spellRelevantInfo)
    if (!summonDetailsGroup) {
      summonDetailsGroup = getTraditionalSummonerSpellDetails(itemUuid, spellRank);
    }

    const summonType = getSummonType(chatMessage);
    await summon(summonerActor, itemUuid, summonType, summonDetailsGroup);
  });
});

function getSummonType(chatMessage) {
  if (isMechanic(chatMessage))
    return "mechanic";
  if (messageItemHasRollOption(chatMessage, "thrall"))
    return "thrall";
  if (isSummoner(chatMessage))
    return "summoner";
  return "summon";
}
