import { CONDITIONS_AFFECTING_SPELL_DC, MODULE_ID } from "./const.js";

/**
 * From UUID function to maintain V12 & 13 Compatab ility
 * @param {*} uuid UUID to get
 * @returns
 */
export async function compFromUuid(uuid) {
  if (parseInt(game.version) === 12) {
    return await fromUuid(uuid);
  } else {
    return await foundry.utils.fromUuid(uuid);
  }
}

export function addTraits(type) {
  if (type === "summon") return ["minion", "summoned"];
  return [];
}

export function messageItemHasRollOption(msg, roll_option) {
  return msg?.flags?.pf2e?.origin?.rollOptions?.includes(roll_option);
}

export function hasNoTargets() {
  return game.user.targets.size === 0;
}

export function onlyHasJB2AFree() {
  return (
    game.modules.get("JB2A_DnD5e")?.active &&
    !game.modules.get("jb2a_patreon")?.active
  );
}
export function capitalizeDamageType(type) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function getAllDamageSlugs() {
  return [
    "acid",
    "bludgeoning",
    "cold",
    "electricity",
    "fire",
    "force",
    "mental",
    "piercing",
    "poison",
    "slashing",
    "sonic",
    "spirit",
    "untyped",
    "vitality",
    "void",
    ...(game.settings.get("pf2e", "homebrew.damageTypes") ?? []).map((type) =>
      game.pf2e.system.sluggify(type.label)
    ),
  ];
}

export function warnNotification(text) {
  const localizedText = game.i18n.localize(text);
  ui.notifications.warn(
    `『${game.i18n.localize("pf2e-summons-assistant.name")}』 ${localizedText}`
  );
}

export function errorNotification(text) {
  const localizedText = game.i18n.localize(text);
  ui.notifications.error(
    `『${game.i18n.localize("pf2e-summons-assistant.name")}』 ${localizedText}`
  );
}

async function triggerActorRefresh(actor) {
  return await actor.setFlag(
    MODULE_ID,
    "update-tick",
    !actor?.getFlag(MODULE_ID, "update-tick")
  );
}

export function setupSummonedTokenRefreshHooks() {
  Hooks.on("preUpdateItem", async (item, _update, _info, userID) =>
    refreshTokensBasedOnItem(item, userID)
  );
  Hooks.on("preCreateItem", async (item, _data, _info, userID) =>
    refreshTokensBasedOnItem(item, userID)
  );
  Hooks.on("preDeleteItem", async (item, _info, userID) =>
    refreshTokensBasedOnItem(item, userID)
  );
}

async function refreshTokensBasedOnItem(item, userID) {
  if (game.user.id !== userID) return;
  if (
    item?.type === "condition" &&
    CONDITIONS_AFFECTING_SPELL_DC.has(item?.rollOptionSlug)
  ) {
    const actorUuid = item.actor.uuid;
    const summonedTokenActors = canvas.tokens.placeables
      .filter(
        (t) =>
          t?.actor?.flags?.["pf2e-summons-assistant"]?.summoner?.uuid ===
          actorUuid
      )
      ?.map((t) => t.actor);
    const refreshList = [];
    for (const summon of summonedTokenActors) {
      refreshList.push(triggerActorRefresh(summon));
    }
    return await Promise.all(refreshList);
  }
}
