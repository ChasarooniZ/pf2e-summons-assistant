import { SOURCES, EFFECTS, MODULE_ID, SENSE_MODES } from "./const.js";
import { defaultTokenRayCrosshair, isVerticalWallSegment } from "./helpers.js";
import { handleJaggedBermsSpikes } from "./specificCases/jaggedBerms.js";
import {
  getWallData,
  setupStraightWall,
  setupWallCircle,
  WALL_ART,
} from "./specificCases/walls.js";

export async function handlePostSummon(
  itemUUID,
  summonedActorUUID,
  summonedActorID,
  summonerToken,
) {
  switch (itemUUID) {
    case SOURCES.COMMANDER.PLANT_BANNER:
      postSummonHelper.PLANT_BANNER(summonedActorUUID);
      break;
    case SOURCES.MISC.PRISMATIC_SPHERE:
      postSummonHelper.PRISMATIC_SPHERE(summonedActorID, summonerToken);
      break;
    case SOURCES.MISC.WOODEN_DOUBLE: {
      postSummonHelper.WOODEN_DOUBLE(summonerToken);
      break;
    }
    case SOURCES.KINETICIST.JAGGED_BERMS: {
      postSummonHelper.JAGGED_BERMS(summonedActorID);
      break;
    }

    case SOURCES.WALL.WALL_OF_ICE:
      postSummonHelper.WALL_OF_ICE(summonedActorID);
      break;
    case SOURCES.WALL.WALL_OF_FIRE:
      postSummonHelper.WALL_OF_FIRE(summonedActorID);
      break;
    case SOURCES.WALL.WALL_OF_SHADOW:
      postSummonHelper.WALL_OF_SHADOW(summonedActorID);
      break;
    case SOURCES.WALL.WALL_OF_STONE:
      postSummonHelper.WALL_OF_STONE(summonedActorID);
      break;
    case SOURCES.MISC.RAISE_THE_HORDE:
    case SOURCES.MISC.SWARM_FORTH:
      postSummonHelper.SHARED_HEALTH_SETUP(summonedActorID);
      break;
    //TO do set
    default:
      break;
  }
}

const postSummonHelper = {
  JAGGED_BERMS: async (summonedActorID) => {
    const summonToken = getTokenFromActorID(summonedActorID);
    await handleJaggedBermsSpikes(summonToken);
  },
  PLANT_BANNER: async (summonedActorUUID) => {
    setTimeout(function () {
      socketlib.modules.get(MODULE_ID).executeAsGM("createEffects", {
        actorUUIDs: canvas.tokens.placeables
          .filter((token) =>
            token.actor.items.some(
              (i) =>
                i.sourceId === EFFECTS.COMMANDER.IN_PLANT_BANNER_RANGE &&
                i?.flags?.[game.system.id]?.aura?.origin === summonedActorUUID,
            ),
          )
          .map((token) => token.actor.uuid),
        effectUUID: EFFECTS.COMMANDER.PLANT_BANNER,
      });
    }, 1500); // DO this after 1.5 seconds to hopefully fix the no stuff applied yet issue
  },
  PRISMATIC_SPHERE: async (summonedActorID, summonerToken) => {
    const prismaticSphereToken = getTokenFromActorID(summonedActorID);
    const items = summonerToken.actor.items.contents;
    const colors = {
      violet: "#EE82EE",
      indigo: "#4B0082",
      blue: "#0000FF",
      green: "#008000",
      yellow: "#FFFF00",
      orange: "#FFA500",
      red: "#FF0000",
    };

    const seq = new Sequence();

    let count = 0;
    for (const [name, color] of Object.entries(colors)) {
      console.log({ count, name, color });
      const eff = items?.find(
        (i) => i?.system?.slug === `effect-chromatic-wall-${name}`,
      );
      seq
        .effect()
        .atLocation(prismaticSphereToken.center)
        .shape("circle", {
          lineSize: 4,
          lineColor: color,
          radius: 2 + count * 0.04,
          gridUnits: true,
          alpha: 0.9,
        })
        .name(name)
        .tieToDocuments([summonerToken, eff])
        .blendMode(PIXI.BLEND_MODES.SCREEN)
        .persist(!!eff)
        .xray();
      count++;
    }
    seq.play();

    await setupWallCircle({
      position: prismaticSphereToken?.center,
      summonedWallToken: prismaticSphereToken,
      radiusSquares: 2,
      wallConfig: { light: SENSE_MODES.NONE, move: SENSE_MODES.NONE },
      art: null,
    });
  },
  SHARED_HEALTH_SETUP: async (summonedActorID) => {
    const actor = getTokenFromActorID(summonedActorID)?.actor;
    await actor.setFlag("pf2e-toolbelt", "shareData", {
      data: {
        master: summonerToken.actor.id,
        health: true,
        languages: false,
        timeEvents: false,
        armorRunes: false,
        heroPoints: false,
        skills: false,
        spellcasting: false,
        weaponRunes: false,
      },
    });
  },
  WALL_OF_ICE: async (summonedActorID) => {
    const summonedTokenWallOfIce = getTokenFromActorID(summonedActorID);

    if (summonedTokenWallOfIce.actor.system.details.blurb === "circle") {
      await setupWallCircle({
        position: summonedTokenWallOfIce?.center,
        summonedWallToken: summonedTokenWallOfIce,
        radiusSquares: 2,
        art: WALL_ART.ICE.CIRCLE,
      });
    } else if (summonedTokenWallOfIce.actor.system.details.blurb === "line") {
      const startingDistance = 30;
      await setupStraightWall({
        summonedWallToken: summonedTokenWallOfIce,
        startingDistance,
        distance: 60,
        art: WALL_ART.ICE.LINE,
      });
    }
  },
  WALL_OF_FIRE: async (summonedActorID) => {
    const summonedToken = getTokenFromActorID(summonedActorID);

    if (summonedToken.actor.system.details.blurb === "circle") {
      let squaresWide = 5.5;
      if (canvas.grid.units === "ft") {
        squaresWide *= canvas.grid.distance / 5;
      }

      new Sequence()
        .effect()
        .file("jb2a.wall_of_fire.500x100.yellow")
        .tieToDocuments(summonedToken)
        .attachTo(summonedToken, { bindScale: false })
        .size(squaresWide, { gridUnits: true })
        .persist()
        .play();
    } else if (summonedToken.actor.system.details.blurb === "line") {
      const ch = await defaultTokenRayCrosshair({
        token: summonedToken,
        maxDistance: 60,
        texture: Sequencer.Database.getEntry("jb2a.wall_of_fire.300x100.yellow")
          .originalFile,
      });

      new Sequence()
        .effect()
        .atLocation(ch)
        .file("jb2a.wall_of_fire.300x100.yellow")
        .tieToDocuments(summonedToken)
        .scale({ x: 1, y: 3 })
        .stretchTo(ch, { onlyX: true })
        .persist()
        .play();
    }
  },
  WALL_OF_SHADOW: async (summonedActorID) => {
    const summonedToken = getTokenFromActorID(summonedActorID);
    const pos = await defaultTokenRayCrosshair({
      token: summonedToken,
      maxDistance: 60,
      texture: WALL_ART.SHADOW,
    });

    const r = foundry.canvas.geometry.Ray.fromAngle(
      pos.x,
      pos.y,
      Math.toRadians(pos.direction),
      pos.distance * canvas.dimensions.distancePixels,
    );

    const wallDataArray = [
      getWallData({
        c: [r.A.x, r.A.y, r.B.x, r.B.y],
        move: SENSE_MODES.NONE,
        sound: SENSE_MODES.NONE,
        art: WALL_ART.SHADOW,
        summonedtokenID: summonedToken.id,
      }),
    ];

    await socketlib.modules
      .get(MODULE_ID)
      .executeAsGM("createWalls", wallDataArray);
  },
  WALL_OF_STONE: async (summonedActorID) => {
    const summonedWallToken = getTokenFromActorID(summonedActorID);
    const isVertical = isVerticalWallSegment(summonedWallToken);
    if (isVertical) {
      await summonedWallToken?.document?.update({ rotation: 90 });
    }
    const bounds = summonedWallToken.bounds;
    const coords = [];
    if (isVertical) {
      //Horizontal
      coords.push(bounds.center.x, bounds.top, bounds.center.x, bounds.bottom);
    } else {
      //Vertical
      coords.push(bounds.left, bounds.center.y, bounds.right, bounds.center.y);
    }
    const wallData = {
      c: coords,
      light: SENSE_MODES.NORMAL,
      move: SENSE_MODES.NORMAL,
      sight: SENSE_MODES.NORMAL,
      flags: {
        "pf2e-summons-assistant": {
          wallSegmentTokenID: `${summonedWallToken.id}`,
        },
      },
    };

    await socketlib.modules
      .get(MODULE_ID)
      .executeAsGM("createWalls", [wallData]);
  },
  WOODEN_DOUBLE: async (summonerToken) => {
    if (!summonerToken) return;
    const mvmntLocation = await Sequencer.Crosshair.show({
      location: {
        obj: summonerToken,
        showRange: true,
      },
      label: {
        text: game.i18n.localize(
          "pf2e-summons-assistant.display-text.wooden-double.step",
        ),
      },
      icon: {
        texture: summonerToken.document.texture.src,
      },
      snap: {
        position:
          summonerToken.document.width % 2 === 1
            ? CONST.GRID_SNAPPING_MODES.CENTER
            : CONST.GRID_SNAPPING_MODES.VERTEX,
      },
      gridHighlight: true,
    });

    await new Sequence()
      .animation()
      .on(summonerToken)
      .moveTowards(mvmntLocation, { relativeToCenter: true })
      .play();
  },
};

function getTokenFromActorID(actorID) {
  return canvas.tokens.placeables.find((tok) => tok?.actor?.id === actorID);
}
