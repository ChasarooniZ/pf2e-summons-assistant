import { MODULE_ID } from "./const.js";
import { disableItemsDialog } from "./disableItems";

export function setupAPI() {
  window[MODULE_ID] = {
    disableItemsDialog,
  };
}
