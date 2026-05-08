import { CREATURES, MODULE_ID } from "../const.js";

const WALLS_TO_SYNC_DELETE = [CREATURES.WALL_OF_STONE, CREATURES.WALL_OF_ICE];

export const WALL_ART = {
  ICE: {
    LINE: "modules/pf2e-summons-assistant/assets/tokens/token/wall_of_ice.webp",
    CIRCLE:
      "modules/pf2e-summons-assistant/assets/tokens/token/wall_of_ice_circle.webp",
  },
};

export function setupWallHooks() {
  if (!game.user.isGM) return;
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

/**
 * Sets up wall circle (Uses an octogon ATM)
 * @param {*} param0
 * @returns
 */
export async function setupWallCircle({
  position,
  summonedWallToken,
  distance,
  art,
  wallConfig,
}) {
  const center = position;
  const gridSize = canvas.grid.size;
  const radiusInPixels = distance * gridSize;
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

    const wallData = {
      c: [x1, y1, x2, y2],
      light: CONST.WALL_SENSE_TYPES.NORMAL,
      move: CONST.WALL_SENSE_TYPES.NORMAL,
      sight: CONST.WALL_SENSE_TYPES.NORMAL,
      sound: CONST.WALL_SENSE_TYPES.NORMAL,
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
          wallSegmentTokenID: `${summonedWallToken.id}`,
        },
      },
    };

    wallDataArray.push(wallData);
  }

  const walls = await socketlib.modules
    .get(MODULE_ID)
    .executeAsGM("createWalls", wallDataArray);

  return walls;
}

export async function setupStraightWall({
  startingDistance,
  summonedWallToken,
  distance,
  art,
}) {
  const pos = await Sequencer.Crosshair.show({
    t: CONST.MEASURED_TEMPLATE_TYPES.RAY,
    distance: distance,
    snap: {
      position:
        CONST.GRID_SNAPPING_MODES.VERTEX |
        CONST.GRID_SNAPPING_MODES.EDGE_MIDPOINT,
      direction: 10,
    },
    distanceMin: 0,
    distanceMax: distance,
  });
  if (pos) {
    const origin = { x: pos.x, y: pos.y };
    const angleRad = Math.toRadians(pos.direction);

    const gridSize = canvas.grid.size;
    const totalDistanceFt = pos.distance;
    const segmentSizeFt = 10;

    // Split into segments
    const fullSegments = Math.floor(totalDistanceFt / segmentSizeFt);
    const remainder = totalDistanceFt % segmentSizeFt;
    const segments = Array(fullSegments).fill(segmentSizeFt);
    if (remainder >= 5) segments.push(remainder); // allow 5ft remainder

    let currentDistanceFt = 0;
    const wallDataArray = [];

    for (const segFt of segments) {
      const c = getFlatWallPoints(
        currentDistanceFt,
        gridSize,
        segFt,
        origin,
        angleRad,
      );

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

function getFlatWallPoints(
  currentDistanceFt,
  gridSize,
  segFt,
  origin,
  angleRad,
) {
  const startPx = currentDistanceFt * gridSize;
  const endPx = (currentDistanceFt + segFt) * gridSize;

  const x1 = origin.x + Math.cos(angleRad) * startPx;
  const y1 = origin.y + Math.sin(angleRad) * startPx;
  const x2 = origin.x + Math.cos(angleRad) * endPx;
  const y2 = origin.y + Math.sin(angleRad) * endPx;
  return [x1, y1, x2, y2];
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

function getWallData({ c, art, summonedtokenID }) {
  return {
    c: c,
    light: CONST.WALL_SENSE_TYPES.NORMAL,
    move: CONST.WALL_SENSE_TYPES.NORMAL,
    sight: CONST.WALL_SENSE_TYPES.NORMAL,
    sound: CONST.WALL_SENSE_TYPES.NORMAL,
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
