import { MODULE_ID } from "../const.js";
import { cloneToKeepDialog, deleteClones } from "../helpers.js";

export function setupBilocationHooks() {
  if (game.settings.get(MODULE_ID, "specific-case.handle.bilocation")) {
    Hooks.on("preDeleteItem", async (item, _info, _action) => {
      if (item?.system?.slug === "effect-bilocation") {
        const actor = item?.actor;
        const res = await cloneToKeepDialog(actor, {
          title: game.i18n.localize(
            `pf2e-summons-assistant.dialog.bilocation.title`,
          ),
          button: game.i18n.localize(
            "pf2e-summons-assistant.dialog.thaumaturge.choose",
          ),
          error: game.i18n.localize(
            "pf2e-summons-assistant.notification.bilocation.error",
          ),
        });
        if (res) {
          deleteClones(actor.id, res.tokens, res.selectedTokenId);
        }
      }
    });
  }
}
