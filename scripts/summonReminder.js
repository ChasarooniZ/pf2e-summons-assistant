import { MODULE_ID } from "./const.js";

export function setupTurnReminders() {
  if (!game.settings.get(MODULE_ID, "reminder.message")) return;
  Hooks.on("pf2e.startTurn", (combatant, _encounter) => {
    if (combatant.hasPlayerOwner) {
      if (combatant.isOwner) {
        const minions = getMinions(combatant.actorId);
        sendAlertMessage(minions, combatant.name);
      }
    } else if (game.user.isGM) {
      const minions = getMinions(combatant.actorId);
      sendAlertMessage(minions, combatant.name);
    }
  });
}

function getMinions(actorID) {
  return canvas.tokens.placeables
    .filter(
      (tok) =>
        tok?.actor?.system?.traits?.value?.includes("minion") &&
        tok?.actor?.flags?.[MODULE_ID]?.summoner?.id === actorID,
    )
    .map((t) => ({ name: t.name }));
}

function sendAlertMessage(tokenData, summonerName) {
  if (tokenData.length === 0) return;
  ChatMessage.create({
    content: `<i class="fa-solid fa-hat-wizard" data-tooltip="${game.modules.get(MODULE_ID).title}"></i> ${game.i18n.format("pf2e-summons-assistant.notification.active-minions", { minionTooltip: game.i18n.localize("PF2E.TraitDescriptionMinion"), summonerName: summonerName })}:
    <ul>
        <li>
            ${tokenData.length === 1 ? tokenData[0].name : tokenData.map((t) => t.name).join("</li><li>")}
        </li>
    </ul>`,
    whisper: [game.user.id],
  });
}
