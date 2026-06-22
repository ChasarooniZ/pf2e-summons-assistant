import { SOURCES, EFFECTS, MODULE_ID, SENSE_MODES, COLORS } from "./const.js";
import { defaultTokenRayCrosshair, isVerticalWallSegment } from "./helpers.js";
import { handleJaggedBermsSpikes } from "./specificCases/jaggedBerms.js";
import {
  getWallData,
  setupStraightWall,
  setupStraightWallRegionsTokensSequences,
  setupWallCircle,
  WALL_ART,
} from "./specificCases/walls.js";

export async function handlePostSummon(
  itemUUID,
  summonedActorUUID,
  summonedActorID,
  summonerToken,
  summonedToken,
) {
  switch (itemUUID) {
    case SOURCES.COMMANDER.PLANT_BANNER:
      postSummonHelper.PLANT_BANNER(summonedActorUUID);
      break;
    case SOURCES.WALL.PRISMATIC_SPHERE:
      postSummonHelper.PRISMATIC_SPHERE(summonedActorID, summonerToken);
      break;
    case SOURCES.WALL.PRISMATIC_WALL:
      postSummonHelper.PRISMATIC_WALL(summonedActorID, summonerToken);
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
    case SOURCES.WALL.WALL_OF_THORNS:
      postSummonHelper.WALL_OF_THORNS(summonedActorID);
      break;
    case SOURCES.MISC.RAISE_THE_HORDE:
    case SOURCES.MISC.SWARM_FORTH:
      postSummonHelper.SHARED_HEALTH_SETUP(summonedActorID);
      break;
    case SOURCES.THAUMATURGE.MIRRORS_REFLECTION:
      postSummonHelper.MIRRORS_REFLECTION(summonedToken);
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
  MIRRORS_REFLECTION: async (summonedToken) => {
    summonedToken.update({
      texture: { scaleX: -summonedToken.texture.scaleX },
    });
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
    const items = prismaticSphereToken.actor.items.contents;
    const seq = new Sequence();

    let count = 0;
    for (const [name, color] of Object.entries(COLORS.PRISMATIC)) {
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
        .tieToDocuments([prismaticSphereToken, eff])
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

  PRISMATIC_WALL: async (summonedActorID, summonerToken) => {
    const prismaticWallToken = getTokenFromActorID(summonedActorID);
    const items = prismaticWallToken.actor.items.contents;
    const seq = new Sequence();

    const location = await Sequencer.Crosshair.show({
      distance: 60,
      t: "ray",
      texture:
        "modules/pf2e-summons-assistant/assets/tokens/token/prismatic_wall.svg",
      snap: {
        position:
          CONST.GRID_SNAPPING_MODES.VERTEX |
          CONST.GRID_SNAPPING_MODES.CENTER |
          CONST.GRID_SNAPPING_MODES.EDGE_MIDPOINT,
      },
    });

    const { source, target } = location.cachedPosition;
    const gridSize = canvas.grid.size;

    const angle = Math.toRadians(location.direction - 90);
    const gridOffset = 0.04;
    const offsetBase = Ray.fromAngle(0, 0, angle, gridOffset)?.B;

    const points = [
      { x: 0, y: 0 },
      {
        x: (target.x - source.x) / gridSize,
        y: (target.y - source.y) / gridSize,
      },
    ];

    let count = -3;
    for (const [name, color] of Object.entries(COLORS.PRISMATIC)) {
      const offset = { x: offsetBase.x * count, y: offsetBase.y * count };
      const eff = items?.find(
        (i) => i?.system?.slug === `effect-chromatic-wall-${name}`,
      );
      seq
        .effect()
        .persist()
        .atLocation(source)
        .shape("polygon", {
          lineSize: 3,
          lineColor: color,
          radius: 1.5,
          points: points.map((pt) => ({
            x: pt.x + offset.x,
            y: pt.y + offset.y,
          })),
          gridUnits: true,
          name: "test",
        })
        .tieToDocuments([prismaticWallToken.document, eff])
        .blendMode(PIXI.BLEND_MODES.ADD)
        .xray();
      count++;
    }
    seq.play();

    const wallDataArray = [
      getWallData({
        c: [source.x, source.y, target.x, target.y],
        move: SENSE_MODES.NONE,
        light: SENSE_MODES.NONE,
        art: "",
        summonedtokenID: prismaticWallToken.id,
      }),
    ];

    await socketlib.modules
      .get(MODULE_ID)
      .executeAsGM("createWalls", wallDataArray);

    const lightDataArray = [
      { rotationOffset: 270, position: source },
      { rotationOffset: 90, position: target },
    ].map(({ rotationOffset, position }) => ({
      config: {
        angle: 180,
        coloration: 1,
        animation: {
          type: "radialrainbow",
          speed: 2,
          intensity: 10,
        },
        bright: 20,
        dim: 40,
      },
      x: position.x,
      y: position.y,
      rotation: (location.direction + rotationOffset) % 360,
      flags: {
        "pf2e-summons-assistant": {
          lightTokenID: prismaticWallToken.id,
        },
      },
    }));

    await socketlib.modules
      .get(MODULE_ID)
      .executeAsGM("createLights", lightDataArray);
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
  WALL_OF_THORNS: async (summonedActorID) => {
    const summonedToken = getTokenFromActorID(summonedActorID);
    const pos = await defaultTokenRayCrosshair({
      token: summonedToken,
      maxDistance: 60,
      texture: WALL_ART.THORNS,
    });

    const r = foundry.canvas.geometry.Ray.fromAngle(
      pos.x,
      pos.y,
      Math.toRadians(pos.direction),
      pos.distance * canvas.dimensions.distancePixels,
    );

    setupStraightWallRegionsTokensSequences({
      pos,
      distance: pos.distance,
      angle: Math.toRadians(pos.direction),
      segFt: 10,
      summonedWallToken: summonedToken,
      art: WALL_ART.THORNS,
      behaviors: [
        {
          type: "modifyMovementCost",
          system: {
            difficulties: {
              walk: 2,
            },
          },
        },
      ],
    });
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
