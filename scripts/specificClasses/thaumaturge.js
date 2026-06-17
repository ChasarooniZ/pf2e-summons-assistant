import { MODULE_ID } from "../const.js";

export function setupThaumaturgeHooks() {
  if (game.settings.get(MODULE_ID, "specific-case.handle.thaumaturge")) {
    Hooks.on("preCreateItem", (item, _info, _action, userID) => {
      if (
        item?.system?.slug === "effect-mirrors-implement" &&
        game.user.id === userID
      ) {
        const actorId = item?.actor?.id;
        askToDeleteMirrors(actorId, "default");
      }
    });
    Hooks.on("preDeleteItem", (item, _action, userID) => {
      if (item?.system?.slug === "unconscious" && game.user.id === userID) {
        const actorId = item?.actor?.id;
        askToDeleteMirrors(actorId, "unconscious");
      }
    });

    Hooks.on("preCreateChatMessage", async (chatMessage, _info, userID) => {
      if (
        chatMessage?.item?.system?.slug === "shatter-reflection" &&
        game.user.id === userID
      ) {
        const actorId = chatMessage?.item?.actor?.id;
        askToDeleteMirrors(actorId, "adept-action");
      }
    });
  }
}

function askToDeleteMirrors(actorId, reason = "") {
  const actor = game.actors.get(actorId);
  const res = pickerDialogue(actor, reason);
  deleteClones(actorId, res.tokens, res.selectedTokenId);
}

async function pickerDialogue(actor, type = "") {
  const tokens = canvas.tokens.placeables.filter(
    (t) => t.actor.id === actor.id,
  );
  if (tokens.length < 2) {
    ui.notifications.error(
      game.i18n.localize(
        "pf2e-summons-assistant.notification.thaumaturge.mirror-implement.error",
      ),
    );
    return;
  }
  let realId = canvas.tokens.controlled?.[0]?.id;
  if (type === "adept-action") {
    realId = tokens?.find((t) => t !== canvas.tokens.controlled[0]?.id)?.id;
  }
  const arrows = getDirectionalArrows(tokens);
  const selectedTokenId = await foundry.applications.api.DialogV2.wait({
    window: {
      title: game.i18n.localize(
        `pf2e-summons-assistant.dialog.thaumaturge.title.${reason}`,
      ),
    },
    position: { width: 400 },
    content: tokens
      .map(
        (tok, cnt) =>
          `<label style="display:flex" class="mirror-token" data-id="${tok.id}">
                <input type="radio" name="choice" class="mirror-token" value="${tok.id}" ${tok.id === realId ? "checked" : ""}>
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
        label: game.i18n.localize(
          "pf2e-summons-assistant.dialog.thaumaturge.choose",
        ),
        default: true,
        callback: (event, button, dialog) => {
          const result = button.form.elements.choice.value;
          const pickedToken = tokens.find((tok) => tok.id === result);
          return pickedToken;
        },
      },
    ],
  });
  return { tokens, selectedTokenId };
}

async function deleteClones(actorID, tokens, selectedTokenId) {
  const combatant = game?.combat?.combatants?.contents?.find(
    (c) => c.actorId === actorID,
  );
  if (combatant) {
    await combatant.update({ tokenId: selectedTokenId });
  }

  tokens
    .filter((t) => t.id !== token.id)
    .forEach((t) => {
      canvas.ping(t.center, { duration: 5000 });
      t.delete();
    });
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
  if (angle >= 337.5 || angle < 22.5) return "right";
  if (angle < 67.5) return "down-right";
  if (angle < 112.5) return "down";
  if (angle < 157.5) return "down-left";
  if (angle < 202.5) return "left";
  if (angle < 247.5) return "up-left";
  if (angle < 292.5) return "up";
  if (angle < 337.5) return "up-right";
}
