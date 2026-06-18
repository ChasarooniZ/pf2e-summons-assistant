import { MODULE_ID } from "../const.js";
import { cloneToKeepDialog, deleteClones } from "../helpers.js";

export function setupThaumaturgeHooks() {
  if (game.settings.get(MODULE_ID, "specific-case.handle.thaumaturge")) {
    Hooks.on("preDeleteItem", (item, _info, _action) => {
      if (item?.system?.slug === "effect-mirrors-implement") {
        const actorId = item?.actor?.id;
        askToDeleteMirrors(actorId, "default");
      }
    });
    Hooks.on("preCreateItem", (item, _action) => {
      if (item?.system?.slug === "unconscious") {
        const actorId = item?.actor?.id;
        askToDeleteMirrors(actorId, "unconscious");
      }
    });

    Hooks.on("preCreateChatMessage", async (chatMessage, _info) => {
      if (chatMessage?.item?.system?.slug === "shatter-reflection") {
        const actorId = chatMessage?.item?.actor?.id;
        askToDeleteMirrors(actorId, "adept-action");
      }
    });
  }
}

async function askToDeleteMirrors(actorId, reason = "") {
  const actor = game.actors.get(actorId);
  let defaultTokenId = canvas.tokens.controlled?.[0]?.id;
  if (reason === "adept-action") {
    defaultTokenId = tokens?.find(
      (t) => t !== canvas.tokens.controlled[0]?.id,
    )?.id;
  }
  const res = await cloneToKeepDialog(
    actor,
    {
      title: game.i18n.localize(
        `pf2e-summons-assistant.dialog.thaumaturge.title.${reason}`,
      ),
      button: game.i18n.localize(
        "pf2e-summons-assistant.dialog.thaumaturge.choose",
      ),
    },
    defaultTokenId,
  );
  if (res) {
    deleteClones(actorId, res.tokens, res.selectedTokenId);
  }
}
