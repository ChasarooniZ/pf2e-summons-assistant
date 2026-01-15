import { SOURCES, EFFECTS, MODULE_ID } from "./const.js";
import { notifyRayControls } from "./helpers.js";

export async function handlePostSummon(itemUUID, actorUUID, summonerToken) {
  switch (itemUUID) {
    case SOURCES.COMMANDER.PLANT_BANNER:
      setTimeout(function () {
        socketlib.modules.get(MODULE_ID).executeAsGM("createEffects", {
          actorUUIDs: canvas.tokens.placeables
            .filter((token) =>
              token.actor.items.some(
                (i) =>
                  i.sourceId === EFFECTS.COMMANDER.IN_PLANT_BANNER_RANGE &&
                  i?.flags?.pf2e?.aura?.origin === actorUUID
              )
            )
            .map((token) => token.actor.uuid),
          effectUUID: EFFECTS.COMMANDER.PLANT_BANNER,
        });
      }, 1500); // DO this after 0.5 seconds to hopefully fix the no stuff applied yet issue
      break;
    case SOURCES.MISC.WOODEN_DOUBLE:
      if (!summonerToken) return;
      const mvmntLocation = await Sequencer.Crosshair.show({
        location: {
          obj: summonerToken,
          showRange: true,
        },
        label: {
          text: game.i18n.localize(
            "pf2e-summons-assistant.display-text.wooden-double.step"
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
      break;
    case SOURCES.WALL.WALL_OF_FIRE:
      const summonedToken = canvas.tokens.placeables.find(
        (tok) => (tok.actor.uuid === actorUUID)
      );

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
        notifyRayControls();
        const startingDistance = 30;
        const ch = await Sequencer.Crosshair.show({
          t: CONST.MEASURED_TEMPLATE_TYPES.RAY,
          distance: startingDistance,
          snap: {
            direction: 10,
          },
          distanceMin: 0,
          distanceMax: 60,
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
      break;
    //TO do set
    default:
      break;
  }
}
