//TODO
// Add Hooks for removal ie, Shatter Refleciton, on Unconcious, on Effect Removal
// Check if combatant update works as normal guy
// Check if summon works at all

function normalRemoval(actorId) {
  const actor = game.actors.get(actorId);
  const res = pickerDialogue(actor);
  deleteClones(actorId, res.tokens, res.selectedTokenId);
}

function shatterReflection(actorId) {
  const actor = game.actors.get(actorId);
  const res = pickerDialogue(actor, "adept-reaction");
  deleteClones(actorId, res.tokens, res.selectedTokenId);
}

async function pickerDialogue(actor, type = "") {
  const tokens = canvas.tokens.placeables.filter(
    (t) => t.actor.id === actor.id,
  );
  if (tokens.length < 2) {
    ui.notifications.error(
      "[Error] You dont have a Mirrored Self clone active on this scene",
    );
    return;
  }
  // Also modify wummon properties: noEffect, noTraits to remove the auto traits
  let realId = canvas.tokens.controlled[0]?.id;
  if (type === "adept-reaction") {
    realId = tokens?.find((t) => t !== canvas.tokens.controlled[0]?.id);
  }
  const arrows = getDirectionalArrows(tokens);
  const selectedTokenId = await foundry.applications.api.DialogV2.wait({
    window: {
      title: game.i18n.localize(
        "pf2e-summons-assistant.dialog.dancing-weapon.title",
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
          "pf2e-summons-assistant.dialog.dancing-weapon.choose",
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

  const tokens = canvas.tokens.placeables.filter((t) => t.actor.id === actorID);
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
    return angleToFASArrow(angle);
  });
}

function angleToFASArrow(a) {
  if (a >= 337.5 || a < 22.5) return "right";
  if (a < 67.5) return "down-right";
  if (a < 112.5) return "down";
  if (a < 157.5) return "down-left";
  if (a < 202.5) return "left";
  if (a < 247.5) return "up-left";
  if (a < 292.5) return "up";
  if (a < 337.5) return "up-right";
}
