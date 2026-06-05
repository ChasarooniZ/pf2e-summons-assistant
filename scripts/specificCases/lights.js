import { LIGHTS_TO_SYNC_DELETE } from "../const.js";

export function setupLightsHooks() {
  if (!game.user.isGM) return;
  Hooks.on("deleteToken", async (tokDoc, info, UserID) => {
    if (LIGHTS_TO_SYNC_DELETE.has(tokDoc?.actor?.sourceId)) {
      const lights = canvas.lighting.placeables.filter(
        (light) =>
          light?.document?.getFlag(MODULE_ID, "lightTokenID") === tokDoc.id,
      );
      for (const light of lights) {
        light?.document?.delete();
      }
    }
  });
}
