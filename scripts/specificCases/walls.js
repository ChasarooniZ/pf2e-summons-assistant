import { CREATURES, MODULE_ID } from "../const.js";

const WALLS_TO_SYNC_DELETE = [CREATURES.WALL_OF_STONE];

export function setupWallHooks() {
  Hooks.on("deleteToken", async (tokDoc, info, UserID) => {
    if (WALLS_TO_SYNC_DELETE.includes(tokDoc?.actor?.sourceId)) {
      const wall = canvas.walls.placeables.find(
        (wall) =>
          wall?.document?.getFlag(MODULE_ID, "wallSegmentTokenID") ===
          tokDoc.id,
      );
      wall?.document?.delete();
    }
  });
}
