import { CONDITIONS_AFFECTING_SPELL_DC, MODULE_ID } from "./const.js";
import { getStrikeMod, getStrikeRE } from "./specificClasses/necromancer.js";

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
  return msg?.flags?.[game.system.id]?.origin?.rollOptions?.includes(
    roll_option,
  );
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

export function hasAnyJB2A() {
  return (
    game.modules.get("JB2A_DnD5e")?.active ||
    game.modules.get("jb2a_patreon")?.active
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
      game.pf2e.system.sluggify(type.label),
    ),
  ];
}

export function warnNotification(text) {
  const localizedText = game.i18n.localize(text);
  ui.notifications.warn(
    `『${game.i18n.localize("pf2e-summons-assistant.name")}』 ${localizedText}`,
  );
}

export function errorNotification(text) {
  const localizedText = game.i18n.localize(text);
  ui.notifications.error(
    `『${game.i18n.localize("pf2e-summons-assistant.name")}』 ${localizedText}`,
  );
}

async function triggerActorRefresh(actor) {
  return await actor.setFlag(
    MODULE_ID,
    "update-tick",
    !actor?.getFlag(MODULE_ID, "update-tick"),
  );
}

export function setupSummonedTokenRefreshHooks() {
  Hooks.on("preUpdateItem", async (item, _update, _info, userID) =>
    refreshTokensBasedOnItem(item, userID),
  );
  Hooks.on("preCreateItem", async (item, _data, _info, userID) =>
    refreshTokensBasedOnItem(item, userID),
  );
  Hooks.on("preDeleteItem", async (item, _info, userID) =>
    refreshTokensBasedOnItem(item, userID),
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
          actorUuid,
      )
      ?.map((t) => t.actor);
    const refreshList = [];
    for (const summon of summonedTokenActors) {
      refreshList.push(triggerActorRefresh(summon));
    }
    return await Promise.all(refreshList);
  }
}

export function getGridUnitsFromFeet(feet) {
  return (feet * canvas.grid.distance) / 5;
}

export function getAvengingWildwoodStrikeRuleElements({ rank }) {
  const rulesElements = ["bludgeoning", "piercing", "slashing"].map((type) => {
    const damageName = game.i18n.localize(
      `PF2E.Trait${capitalizeDamageType(type)}`,
    );
    const name = `Branch (${damageName})`;
    const slug = game.pf2e.system.sluggify(name);
    return getStrikeRE({
      die: "d8",
      dice: 2 + (rank - 1),
      damageType: type,
      traits: ["reach-15"],
      image: "icons/magic/nature/root-vine-entwined-thorns.webp",
      slug,
      label: name,
    });
  });
  rulesElements.push(
    getStrikeMod([rulesElements.map((re) => re.slug)], "Branch"),
  );
  return rulesElements;
}

export function notifyRayControls(rotateOnly = false) {
  let text = rotateOnly
    ? `<b>${game.i18n.localize("pf2e-summons-assistant.controls.rotate-wall")}: </b><span class='reference'>${game.i18n.localize("CONTROLS.ShiftScroll")}</span>`
    : `
          <b>${game.i18n.localize("pf2e-summons-assistant.controls.adjust-length")}:</b> <span class='reference'>${game.i18n.localize("CONTROLS.Alt")} + ${game.i18n.localize("pf2e-summons-assistant.controls.scroll")}</span>
          <br>
          <br>
          <b>${game.i18n.localize("pf2e-summons-assistant.controls.rotate-wall")}: </b><span class='reference'>${game.i18n.localize("CONTROLS.ShiftScroll")}</span>`;
  ui.notifications.info(text);
}

/**
 * This converts the passed in SF2e/PF2e UUID into a format this module recognizes (IE how it shows in the pf2e system)
 * @param {String} uuid Item UUID
 * @returns
 */
export function convertItemUUIDBasedOnSystem(uuid) {
  if (!uuid) return null;
  let finalUUID = uuid;
  if (game.system.id === "sf2e") {
    finalUUID = finalUUID
      .replace(".sf2e.", ".pf2e.")
      .replace(".pf2e-anachronism.", ".pf2e.")
      .replace(
        ".starfinder-field-test-for-pf2e.actions.",
        ".starfinder-field-test-for-pf2e.sf2e-actions.",
      )
      .replace(
        ".starfinder-field-test-for-pf2e.feats.",
        ".starfinder-field-test-for-pf2e.sf2e-feats.",
      )
      .replace(".actions.", ".actionspf2e.")
      .replace(".class-features.", ".classfeatures.")
      .replace(".conditions.", ".conditionitems.")
      .replace(".equipment.", ".equipment-srd.")
      .replace(".feats.", ".feats-srd.")
      .replace(".macros.", ".pf2e-macros.")
      .replace(".spells.", ".spells-srd.");
  } else if (
    game.system.id === "pf2e" &&
    uuid?.includes(".sf2e-anachronism.")
  ) {
    finalUUID = finalUUID
      .replace(".sf2e-anachronism.", ".sf2e.")
      .replace(".actionspf2e.", ".actions.")
      .replace(".classfeatures.", ".class-features.")
      .replace(".conditionitems.", ".conditions.")
      .replace(".equipment-srd.", ".equipment.")
      .replace(".feats-srd.", ".feats.")
      .replace(".pf2e-macros.", ".macros.")
      .replace(".spells-srd.", ".spells.");
  }

  return finalUUID;
}

export function isVerticalWallSegment({ x }) {
  return x % canvas.grid.size !== 0;
}

export function convertSpecificCreatureToSF2e(uuids) {
  if (game.system.id === "sf2e") {
    return uuids.map((uuid) =>
      uuid.replace(
        ".pf2e-summons-assistant-actors.",
        ".sf2e-summons-assistant-actors.",
      ),
    );
  } else {
    return uuids;
  }
}

export function getSpellRange(rangeText) {
  const feet = game.i18n.localize("pf2e-summons-assistant.code.range.feet");
  if (rangeText.endsWith(feet) || rangeText.endsWith("feet")) {
    return Number(rangeText.substring(0, rangeText.indexOf(" "))) || null;
  } else {
    return null;
  }
}

export async function defaultTokenRayCrosshair({
  token,
  maxDistance,
  texture = "",
}) {
  return Sequencer.Crosshair.show(
    {
      t: "ray",
      distance: maxDistance / 2,
      texture: texture,
      snap: {
        resolution: 20,
        direction: 10,
      },
      location: {
        obj: token,
        lockToEdge: true,
      },
      distanceMin: 0,
      distanceMax: maxDistance,
    },
    {
      [Sequencer.Crosshair.CALLBACKS.MOUSE_MOVE]: (crosshair) => {
        crosshair.updateCrosshair({
          "label.text": `[${Math.round((crosshair.ray.distance / canvas.dimensions.distancePixels) * 2) / 2}/${maxDistance}] ft`,
          "label.dx": crosshair.ray.dx,
          "label.dy": crosshair.ray.dy - canvas.grid.size * 0.7,
        });
      },
    },
  );
}

export function getHeightenedValue({
  baseVal,
  startLvl,
  currLvl,
  heightenEvery,
  heightenBonus,
}) {
  if (currLvl <= startLvl) return baseVal;

  const levelsGained = currLvl - startLvl;
  const increments = Math.floor(levelsGained / heightenEvery);

  return baseVal + increments * heightenBonus;
}

export async function deleteClones(actorID, tokens, selectedTokenId) {
  const combatant = game?.combat?.combatants?.contents?.find(
    (c) => c.actorId === actorID,
  );
  if (combatant) {
    socketlib.modules
      .get(MODULE_ID)
      .executeAsGM("updateCombatant", combatant.id, {
        tokenId: selectedTokenId,
      });
  }

  tokens
    .filter((t) => t.id !== selectedTokenId)
    .forEach((t) => {
      canvas.ping(t.center, { duration: 5000 });
      socketlib.modules.get(MODULE_ID).executeAsGM("deleteToken", t.id);
    });
}

export async function cloneToKeepDialog(
  actor,
  { title, button, error },
  defaultTokenId,
) {
  const tokens = canvas.tokens.placeables.filter(
    (t) => t.actor.id === actor.id,
  );
  if (tokens.length < 2) {
    ui.notifications.error(
      error
        ? error
        : game.i18n.localize(
            "pf2e-summons-assistant.notification.thaumaturge.mirror-implement.error",
          ),
    );
    return;
  }
  const arrows = getDirectionalArrows(tokens);
  const selectedTokenId = await foundry.applications.api.DialogV2.wait({
    window: {
      title: title,
    },
    position: { width: 400 },
    content: tokens
      .map(
        (tok, cnt) =>
          `<label style="display:flex" class="mirror-token" data-id="${tok.id}">
                <input type="radio" name="choice" class="mirror-token" value="${tok.id}"
                  ${(!defaultTokenId ? cnt === 0 : tok.id === defaultTokenId) ? "checked" : ""}
                  >
                <span style="display:flex">
                <i class="fas fa-arrow-${arrows[cnt]}"></i> ${cnt + 1} ${tok.name}
                </span>
            </label>`,
      )
      .join(""),
    render: (_event, app) => {
      const html = app.element ? app.element : app;
      html.querySelectorAll("label.mirror-token").forEach((label) => {
        label.addEventListener("mouseover", (event) => {
          const tid = label.dataset.id;
          const token = canvas.tokens.get(tid);
          if (token) {
            token._onHoverIn(event);
          }
        });
        label.addEventListener("mouseout", (event) => {
          const tid = label.dataset.id;
          const token = canvas.tokens.get(tid);
          if (token) {
            token._onHoverOut(event);
          }
        });

        label.addEventListener("click", (event) => {
          const tid = label.dataset.id;
          const token = canvas.tokens.get(tid);
          if (token) {
            canvas.ping(token.center);
          }
        });
      });
    },
    buttons: [
      {
        action: "choose",
        label: button,
        default: true,
        callback: (event, button, dialog) => {
          return button.form.elements.choice.value;
        },
      },
    ],
  });
  return { tokens, selectedTokenId };
}

function getDirectionalArrows(coords) {
  const center = {
    x: coords.reduce((sum, p) => sum + p.x, 0) / coords.length,
    y: coords.reduce((sum, p) => sum + p.y, 0) / coords.length,
  };

  return coords.map((point) => {
    const ray = new foundry.canvas.geometry.Ray(center, point);
    const angle = (Math.toDegrees(ray.angle) + 360) % 360;
    return angleToArrowDirection(angle);
  });
}

function angleToArrowDirection(angle) {
  if (angle >= 337.5 || angle < 22.5) {
    return "right";
  } else if (angle < 67.5) {
    return "down-right";
  } else if (angle < 112.5) {
    return "down";
  } else if (angle < 157.5) {
    return "down-left";
  } else if (angle < 202.5) {
    return "left";
  } else if (angle < 247.5) {
    return "up-left";
  } else if (angle < 292.5) {
    return "up";
  } else if (angle < 337.5) {
    return "up-right";
  }
}
