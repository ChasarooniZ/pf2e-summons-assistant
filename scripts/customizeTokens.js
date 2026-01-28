import { DEF_TOKEN_CONFIGS, MODULE_ID } from "./const.js";

export async function modifyActorsMenu({
  actors = game.packs.get(
    "pf2e-summons-assistant.pf2e-summons-assistant-actors",
  ).index.contents,
  item = null,
}) {
  const content = `
  <div>
    <input 
      type="text" 
      id="search-input" 
      placeholder="${game.i18n.localize("FILES.Search")}"
    />
    <div id="summons-items-container">
      ${actors
        .toSorted((a, b) => a.name.localeCompare(b.name))
        .map(
          (actor) => `
        <div class="summon-token-item" data-name="${actor.name}" data-uuid="${actor.uuid}" data-itemUuid="${item.uuid}">
          <img src="${actor.img}" alt="${actor.name}">
          <span>${actor.name} ${getIsActorCustomized(actor.uuid, item) ? '<i class="fa-solid fa-circle-exclamation" data-tooltip="This Summon has been customized"></i>' : ""}</span>
        </div>
      `,
        )
        .join("")}
    </div>
  </div>
`;

  const data = await foundry.applications.api.DialogV2.wait({
    window: {
      title: game.i18n.localize(
        "pf2e-summons-assistant.dialog.customize.summoned-token.title",
      ),
    },
    position: { width: 300 },
    content,
    buttons: [
      {
        label: "Close",
        action: "close",
      },
    ],
    render: (event) => {
      const html = event.target.element;
      const searchInput = html.querySelector("#search-input");
      const container = html.querySelector("#summons-items-container");

      // Add click handlers to token items
      const tokenItems = container.querySelectorAll(".summon-token-item");
      tokenItems.forEach((item) => {
        item.addEventListener("click", async (e) => {
          const src = e.currentTarget;
          const name = src.dataset.name;
          const uuid = src.dataset.uuid;
          const item = src.dataset.itemuuid
            ? await fromUuid(src.dataset.itemuuid)
            : null;
          customizeSummonedToken({ name, uuid }, item);
        });
      });

      // Add search functionality
      searchInput.addEventListener("input", (e) => {
        const searchTerm = e.target.value.toLowerCase();

        tokenItems.forEach((item) => {
          const name = item.dataset.name.toLowerCase();
          if (name.includes(searchTerm)) {
            item.style.display = "flex";
          } else {
            item.style.display = "none";
          }
        });
      });
    },
  });
}

async function customizeSummonedToken(tokenInfo, item) {
  let defCFG = DEF_TOKEN_CONFIGS;
  // Get customization setting
  if (item) {
    // get item
    const tokenCFG = item.getFlag(MODULE_ID, "customized-summons");
    if (tokenInfo?.uuid && tokenCFG?.[replacePeriods(tokenInfo?.uuid)]) {
      defCFG = tokenCFG?.[replacePeriods(tokenInfo?.uuid)];
    }
  } else {
    //get world
    const tokenCFG = game.settings.get(MODULE_ID, "customized-summons");
    if (tokenInfo?.uuid) {
      defCFG = tokenCFG[replacePeriods(tokenInfo?.uuid)];
    }
  }

  const data = await foundry.applications.api.DialogV2.input({
    window: {
      title: `${game.i18n.localize("pf2e-summons-assistant.dialog.customize.summoned-token.title")} (${tokenInfo.name})`,
    },
    content: `
    <div class="form-group">
      <label for="name">${game.i18n.localize("TOKEN.FIELDS.name.label")}</label>
      <input type="text" name="name" value="${defCFG.name}">
    </div>
    <div class="form-group">
      <label for="imagePath">${game.i18n.localize("TOKEN.FIELDS.texture.src.label")}</label>
      <file-picker type="imagevideo" value="${defCFG.imagePath}" name="imagePath">
    </div>
      <div class="form-group">
      <label for="scale">${game.i18n.localize("Scale")}</label>
      <range-picker value="${defCFG.scale}" min="0.2" max="3" step="0.01" name="scale">
    </div>
    <fieldset>
      <legend>${game.i18n.localize("TOKEN.RING.SHEET.legend")}</legend>
      <div class="form-group">
        <label for="ringEnabled">${game.i18n.localize("TOKEN.FIELDS.ring.enabled.label")}</label>
        <input type="checkbox" name="ringEnabled" ${defCFG.ringEnabled ? "checked" : ""}>
      </div>
      <div class="form-group">
        <label for="subjectTexture"
          data-tooltip="${game.i18n.localize("TOKEN.FIELDS.ring.subject.scale.hint")}"
          data-tooltip-direction="LEFT"
          >
            ${game.i18n.localize("TOKEN.FIELDS.ring.subject.texture.label")}
        </label>
        <file-picker type="image" value="${defCFG.subjectTexture}" name="subjectTexture">
      </div>
      <div class="form-group">
        <label for="subjectScaleCorrection"
          data-tooltip="${game.i18n.localize("TOKEN.FIELDS.ring.subject.texture.hint")}"
          data-tooltip-direction="LEFT"
          >
            ${game.i18n.localize("TOKEN.FIELDS.ring.subject.scale.label")}
        </label>
        <range-picker value="${defCFG.subjectScaleCorrection}" min="0.5" max="3" step="0.01" name="subjectScaleCorrection">
      </div>
    </fieldset
    `,
    ok: {
      label: "Save",
      icon: "fa-solid fa-floppy-disk",
    },
  });

  console.log({ data, tokenInfo });
  const isChangesMade =
    data && Object.keys(defCFG).some((key) => defCFG?.[key] !== data?.[key]);

  if (isChangesMade) {
    // Set Customization setting
    if (item) {
      //set item
      const prevSettings = item.getFlag(MODULE_ID, "customized-summons") ?? {};
      prevSettings[replacePeriods(tokenInfo.uuid)] = data;
      await item.setFlag(MODULE_ID, "customized-summons", prevSettings);
    } else {
      //set world
      const prevSettings =
        game.settings.get(MODULE_ID, "customized-summons") ?? {};
      prevSettings[replacePeriods(tokenInfo.uuid)] = data;
      await game.settings.set(MODULE_ID, "customized-summons", prevSettings);
    }

    ui.notifications.info(
      `${game.i18n.localize("pf2e-summons-assistant.notification.customization.saved")} <code>${tokenInfo.name}</code>`,
    );
  }
}

export function getSummonCustomizationData(summonUUID, item) {
  const itemCustomization = mapToActualModifications(
    item?.getFlag(MODULE_ID, "customized-summons")?.[
      replacePeriods(summonUUID)
    ],
  );
  if (itemCustomization) {
    return itemCustomization;
  }
  const settingsCustomization = mapToActualModifications(
    game.settings.get(MODULE_ID, "customized-summons")?.[
      replacePeriods(summonUUID)
    ],
  );
  if (settingsCustomization) {
    return settingsCustomization;
  }
  return {};
}

export function mapToActualModifications(cfg) {
  if (!cfg) return {};
  const updateData = {};
  if (cfg.name) {
    updateData.name = cfg.name;
  }
  updateData.prototypeToken = {
    ...(cfg?.name ? { name: cfg.name } : {}),
    texture: {
      ...(cfg?.imagePath ? { src: cfg.imagePath } : {}),
      scaleX: cfg.scale,
      scaleY: cfg.scale,
    },
    ring: {
      enabled: cfg.ringEnabled,
      subject: {
        scale: cfg.subjectScaleCorrection,
        ...(cfg?.subjectTexture ? { texture: cfg.subjectTexture } : {}),
      },
    },
  };
  return updateData;
}

export function getIsActorCustomized(actorUuid, item = null) {
  if (item) {
    return !!item?.getFlag(MODULE_ID, "customized-summons")?.[
      replacePeriods(actorUuid)
    ];
  } else {
    return !!game.settings.get(MODULE_ID, "customized-summons")?.[
      replacePeriods(actorUuid)
    ];
  }
}

function replacePeriods(uuid) {
  return uuid.replaceAll(".", ":");
}
