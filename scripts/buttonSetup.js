import { MODULE_ID, SOURCE_SET } from "./const.js";
import { getSourceID } from "./helpers.js";

export async function setupHeaderButtons(active, showText = false) {
  Hooks.on("getItemSheetHeaderButtons", addCustomizeItemButton);
  Hooks.on("getActorSheetPF2eHeaderButtons", addCustomizeActorButton);
}

async function addCustomizeItemButton(sheet, buttons) {
  const item = sheet.object;
  const uuid = getSourceID(item, item?.sourceId);

  if (SOURCE_SET.has(uuid)) {
    buttons.unshift({
      //label: "pf2e-summons-assistant.header.buttons.customize.item",
      //   class: "refresh-from-compendium",
      icon: "a-solid fa-rabbit",
      onclick: async () => {
        const it = this.item;
        const uuid = getSourceID(it, it?.sourceId);
        const flagData = this.item.actor.getFlag(MODULE_ID, "customization");
        if (!flagData?.[uuid]) {
          flagData?.[uuid] = {};
          this.item.actor.setFlag(MODULE_ID, "customization", flagData);
        }
      },
    });
  }
}

async function addCustomizeActorButton(sheet, buttons) {
  const actor = sheet.object;
  buttons.unshift({
    label: "pf2e-summons-assistant.header.buttons.customize.actor",
    //   class: "refresh-from-compendium",
    icon: "a-solid fa-rabbit",
    onclick: async () => {
      const act = this.actor;
      const flagData = act.getFlag(MODULE_ID, "customization");
      // if (!flagData?.[uuid]) {
      //   flagData?.[uuid] = {};
      //   this.item.actor.setFlag(MODULE_ID, "customization", flagData);
      // }
    },
  });
}