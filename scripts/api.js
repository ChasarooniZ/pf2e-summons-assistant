import { MODULE_ID } from "./const.js";
import { disableItemsDialog } from "./disableItems.js";
import { summon } from "./summon.js";

export function setupAPI() {
  window[MODULE_ID] = {
    disableItemsDialog,
    summon,
  };
}
