import { MODULE_ID, SENSE_MODES, WALLS_TO_SYNC_DELETE } from "../const.js";
import { defaultTokenRayCrosshair } from "../helpers.js";

export const WALL_ART = {
  ICE: {
    LINE: "modules/pf2e-summons-assistant/assets/tokens/token/wall_of_ice.webp",
    CIRCLE:
      "modules/pf2e-summons-assistant/assets/tokens/token/wall_of_ice_circle.webp",
  },
  SHADOW:
    "modules/pf2e-summons-assistant/assets/tokens/token/wall_of_shadow.webp",
};

export function setupWallHooks() {
  if (!game.user.isGM) return;
  Hooks.on("deleteToken", async (tokDoc, info, UserID) => {
    if (WALLS_TO_SYNC_DELETE.includes(tokDoc?.actor?.sourceId)) {
      const walls = canvas.walls.placeables.filter(
        (wall) =>
          wall?.document?.getFlag(MODULE_ID, "wallSegmentTokenID") ===
            tokDoc.id ||
          wall?.document?.getFlag(MODULE_ID, "wallTokenID") === tokDoc.id,
      );
      for (const wall of walls) {
        wall?.document?.delete();
      }
    }
  });
}

/**
 * Sets up wall circle (Uses an octagon ATM)
 * @param {*} param0
 * @returns
 */
export async function setupWallCircle({
  position,
  summonedWallToken,
  radiusSquares,
  art,
  wallConfig,
}) {
  const center = position;
  const gridSize = canvas.grid.size;
  const radiusInPixels = radiusSquares * gridSize;
  const sideHalf = radiusInPixels * Math.tan(Math.PI / 8);

  const wallDataArray = [];
  const wallAmount = 8;
  for (let i = 0; i < wallAmount; i++) {
    // start at top at top
    const { x1, y1, x2, y2 } = getWallPointsForCircle(
      i,
      wallAmount,
      center,
      radiusInPixels,
      sideHalf,
    );

    const wallData = getWallData({
      c: [x1, y1, x2, y2],
      art,
      summonedtokenID: summonedWallToken.id,
    });

    wallDataArray.push(wallData);
  }

  const walls = await socketlib.modules
    .get(MODULE_ID)
    .executeAsGM("createWalls", wallDataArray);

  return walls;
}

export async function setupStraightWall({ summonedWallToken, distance, art }) {
  const pos = await defaultTokenRayCrosshair({
    token: summonedWallToken,
    maxDistance: distance,
    texture: art,
  });
  if (pos) {
    const origin = { x: pos.x, y: pos.y };
    const angleRad = Math.toRadians(pos.direction);

    const totalDistanceFt = pos.distance;
    const segmentSizeFt = 10;

    // Split into segments
    const fullSegments = Math.floor(totalDistanceFt / segmentSizeFt);
    const remainder = totalDistanceFt % segmentSizeFt;
    const segments = new Array(fullSegments).fill(segmentSizeFt);
    if (remainder >= 5) segments.push(remainder); // allow 5ft remainder

    let currentDistanceFt = 0;
    const wallDataArray = [];

    for (const segFt of segments) {
      const c = getFlatWallPoints(currentDistanceFt, segFt, origin, angleRad);

      const wallData = getWallData({
        c,
        art,
        summonedtokenID: summonedWallToken.id,
      });
      wallDataArray.push(wallData);
      currentDistanceFt += segFt;
    }

    // Create all wall segments via GM socket
    const walls = await socketlib.modules
      .get(MODULE_ID)
      .executeAsGM("createWalls", wallDataArray);

    return walls;
  }
}

function getFlatWallPoints(currentDistanceFt, segFt, origin, angleRad) {
  const pixelPerFoot = canvas.dimensions.distancePixels;
  const startDistance = currentDistanceFt * pixelPerFoot;
  const endDistance = (currentDistanceFt + segFt) * pixelPerFoot;

  const pointsA = foundry.canvas.geometry.Ray.fromAngle(
    origin.x,
    origin.y,
    angleRad,
    startDistance,
  ).B;
  const pointsB = foundry.canvas.geometry.Ray.fromAngle(
    origin.x,
    origin.y,
    angleRad,
    endDistance,
  ).B;
  return [pointsA.x, pointsA.y, pointsB.x, pointsB.y];
}

function getWallPointsForCircle(
  i,
  wallAmount,
  center,
  radiusInPixels,
  sideHalf,
) {
  const faceAngleRad = Math.toRadians(i * (360 / wallAmount));

  const midX = center.x + radiusInPixels * Math.cos(faceAngleRad);
  const midY = center.y + radiusInPixels * Math.sin(faceAngleRad);

  const perpAngleRad = faceAngleRad + Math.PI / 2;
  const dx = sideHalf * Math.cos(perpAngleRad);
  const dy = sideHalf * Math.sin(perpAngleRad);

  const x1 = midX - dx;
  const y1 = midY - dy;
  const x2 = midX + dx;
  const y2 = midY + dy;
  return { x1, y1, x2, y2 };
}

/**
 * Get Wall Document
 * @param {{c: [x1, y1, x2, y2], light: number, move: number, sight: number, sound: number, art: string, summonedtokenID: string}} wallConfig Wall configuration
 * @returns Wall Document
 */
export function getWallData({
  c,
  light = SENSE_MODES.NORMAL,
  move = SENSE_MODES.NORMAL,
  sight = SENSE_MODES.NORMAL,
  sound = SENSE_MODES.NORMAL,
  art,
  summonedtokenID,
}) {
  return {
    c: c,
    light,
    move,
    sight,
    sound,
    dir: 0,
    door: 2,
    ds: 0,
    animation: {
      type: "ascend",
      texture: art,
      flip: false,
      double: false,
      direction: 1,
      duration: 750,
      strength: 1,
    },
    flags: {
      "pf2e-summons-assistant": {
        wallSegmentTokenID: `${summonedtokenID}`,
      },
    },
  };
}
