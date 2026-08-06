import { MODULE_ID } from "../const.js";

export function setupBrewrata() {
  if (game.modules.get("pf2e-brewrata")?.active) {
    const registry = game.brewrata.register(MODULE_ID);
    registry.errata(
      "thrall-charge",
      "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-items.Item.NWDTNTpfPEc821pu",
    );
    registry.errata("thrall-charge", {
      uuid: "Compendium.pf2e-summons-assistant.pf2e-summons-assistant-items.Item.NWDTNTpfPEc821pu",
      description: "Adds an Effect to Thrall Charge to give damage boosts",
    });
  }
}
