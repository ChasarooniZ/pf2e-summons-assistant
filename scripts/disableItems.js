import { MODULE_ID, SOURCES } from "./const.js";

function disableItemsDialog() {
  createToggleDialog(
    getAllSpecificOptions(),
    (result) => {
      console.log(result);
      game.settings.set(MODULE_ID, "disabled-items", result);
    },
    { disabled: game.settings.get(MODULE_ID, "disabled-items") }
  );
}

export function setupDisableItemHooks() {
  Hooks.on("renderSettingsConfig", (_cfg, form) => {
    form
      .querySelector("section[data-tab='pf2e-summons-assistant']")
      .insertAdjacentHTML(
        "afterbegin",
        `
        <a
          class='button'
          data-tooltip="${game.i18n.localize("pf2e-summons-assistant.dialog.disable-specific.button.hint")}"
          onclick="disableItemsDialog()"
        >
          <i class="fa-solid fa-gears"></i>
          ${game.i18n.localize("pf2e-summons-assistant.dialog.disable-specific.button.title")}
        </a>
        `
      );
  });
}

async function createToggleDialog(items, callback, options = {}) {
  const disabled = options.disabled || {};

  const result = await foundry.applications.api.DialogV2.wait({
    window: {
      title: game.i18n.localize(`${MODULE_ID}.dialog.disable-specific.title`),
      icon: "fa-solid fa-list-check",
    },
    content: `
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <input 
            type="text" 
            id="search-input" 
            placeholder="${game.i18n.localize(`${MODULE_ID}.dialog.disable-specific.title`)}" 
            style="width: 100%; padding: 6px; border: 1px solid var(--color-border-dark); border-radius: 3px;"
          />
          <div id="items-container" style="display: flex; flex-direction: column; gap: 8px; max-height: 400px; overflow-y: auto;">
            ${items
              .map(
                (item) => `
              <label data-uuid="${item.uuid}" data-name="${item.name.toLowerCase()}" style="display: flex; align-items: center; gap: 8px;">
                <input 
                  type="checkbox" 
                  name="${item.uuid}" 
                  ${disabled[item.uuid] ? "" : "checked"}
                  style="margin: 0;"
                />
                <span>${item.name}</span>
              </label>
            `
              )
              .join("")}
          </div>
        </div>
      `,
    buttons: [
      {
        action: "save",
        label: "Save",
        icon: "fa-solid fa-check",
        default: true,
        callback: (event, button, dialog) => {
          const resultObj = {};
          items.forEach((item) => {
            const checkbox = dialog.querySelector(`input[name="${item.uuid}"]`);
            // Only include items that are unchecked (disabled)
            if (!checkbox.checked) {
              resultObj[item.uuid] = true;
            }
          });
          return resultObj;
        },
      },
      {
        action: "cancel",
        label: "Cancel",
        icon: "fa-solid fa-times",
      },
    ],
    render: (event, html) => {
      const searchInput = html.querySelector("#search-input");
      const container = html.querySelector("#items-container");

      searchInput.addEventListener("input", (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const labels = container.querySelectorAll("label");

        labels.forEach((label) => {
          const name = label.dataset.name;
          if (name.includes(searchTerm)) {
            label.style.display = "flex";
          } else {
            label.style.display = "none";
          }
        });
      });
    },
  });

  if (result && callback) {
    callback(result);
  }

  return result;
}

function getAllSpecificOptions() {
  return getSourceValues(SOURCES).map((uuid) => ({
    uuid,
    name: getItemName(uuid),
  }));
}

function getItemName(uuid) {
  const [pack, id] = uuid.replace("Compendium.").split(".Item.");
  return game?.packs?.get(pack)?.index?.get(id)?.name;
}

function getSourceValues(sources) {
  return Object.values(sources).flatMap((category) => Object.values(category));
}
