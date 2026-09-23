import { messageItemHasRollOption } from "../helpers.js";

const EIDOLON_CLASS_UUID =
  "Compendium.pf2e-animal-companions.AC-Features.Item.xPn27nNxcLOByTXJ";

export function isSummoner(msg) {
  return messageItemHasRollOption(msg, "origin:item:trait:summoner");
}

export function setSummonerRelevantInfo(summonerActor, spellRelevantInfo) {
  spellRelevantInfo.summonerActorId = summonerActor.id;
}

export async function getEidolon(summonerActorId) {
  const summonerActor = game.actors.get(summonerActorId);

  const eidolons = game.actors.filter(
    (act) =>
      act.type === "character" &&
      (act?.class?.sourceId === EIDOLON_CLASS_UUID ||
        act?.class?.slug === "eidolon"),
  );

  const eidolonUUID = (
    eidolons.find(
      (act) =>
        act?.flags?.["pf2e-summons-assistant"]?.summoner?.uuid ===
        summonerActor.uuid,
    ) ??
    eidolons.find(
      (act) =>
        getNonGMOwnerStringified(act) ===
        getNonGMOwnerStringified(summonerActor),
    )
  )?.uuid;

  return eidolonUUID;
}

function getNonGMOwnerStringified(actor) {
  return JSON.stringify(
    Object.entries(actor?.ownership ?? {})
      .filter(
        (owner) =>
          owner[1] === CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER &&
          owner[0] !== game.users?.activeGM?.id,
      )
      .map((owner) => owner?.[0])
      .toSorted((a, b) => a.localeCompare(b)),
  );
}
