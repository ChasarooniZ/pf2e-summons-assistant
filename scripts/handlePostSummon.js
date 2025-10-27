import { SOURCES, EFFECTS, MODULE_ID } from "./const.js";

export async function handlePostSummon(itemUUID, actorUUID, summonerToken) {
    switch (itemUUID) {
        case SOURCES.COMMANDER.PLANT_BANNER:
            setTimeout(function () {
                socketlib.modules.get(MODULE_ID).executeAsGM("createEffects", {
                    actorUUIDs: canvas.tokens.placeables.filter(token =>
                        token.actor.items.some(i =>
                            i.sourceId === EFFECTS.COMMANDER.IN_PLANT_BANNER_RANGE
                            && i?.flags?.pf2e?.aura?.origin === actorUUID
                        )
                    ).map(token => token.actor.uuid),
                    effectUUID: EFFECTS.COMMANDER.PLANT_BANNER
                })

            }, 1500) // DO this after 0.5 seconds to hopefully fix the no stuff applied yet issue
            break;
        case SOURCES.MISC.WOODEN_DOUBLE:
            if (!summonerToken) return;
            const mvmntLocation = await Sequencer.Crosshair.show(
                {
                    location: {
                        obj: summonerToken,
                        showRange: true
                    },
                    label: {
                        text: game.i18n.localize("pf2e-summons-assistant.display-text.wooden-double.step")
                    },
                    icon: {
                        texture: summonerToken.document.texture.src
                    },
                    snap: {
                        position: summonerToken.document.width % 2 === 1
                            ? CONST.GRID_SNAPPING_MODES.CENTER
                            : CONST.GRID_SNAPPING_MODES.VERTEX,
                    },
                    gridHighlight: true,
                }
            )

            await new Sequence()
                .animation()
                .on(summonerToken)
                .moveTowards(mvmntLocation, { relativeToCenter: true })
                .play()
            break;
        //TO do set 
        default:
            break;
    }
}