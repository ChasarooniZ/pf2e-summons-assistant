import { EFFECTS, ROLL_OPTION } from "../const.js";

export async function setupCommanderHooks() {
    Hooks.on("pf2e.startTurn", async (combatant, encounter, user) => {
        handlePlantBannerStartOfTurn(combatant)
    })
}

async function handlePlantBannerStartOfTurn(combatant) {
    if (!game.user.isGM) return;
    if (!combatant?.actor?.rollOptions?.all
        ?.[ROLL_OPTION.COMMANDER.IN_PLANT_BANNER_RANGE]) return;
    setTimeout(async function () {
        addPlantBanner(combatant.actor)
    }, 500)

    const owners = Object.entries(combatant?.actor?.ownership)?.filter(([userID, permission]) => !game.users.get(userID)?.isGM && permission === CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER).map(([userID, _permission]) => userID)
    if (owners.length === 1) {
        const minions = getNonCombatTrackerCombatants(owners[0], combatant.actor.id).filter(m => m?.actor?.rollOptions?.all
            ?.[ROLL_OPTION.COMMANDER.IN_PLANT_BANNER_RANGE]);
        for (const minion of minions) {
            setTimeout(async function () {
                addPlantBanner(minion.actor)
            }, 500)
        }
    }
}

function getNonCombatTrackerCombatants(userID, actorID) {
    const combatTokens = new Set(game.combat.combatants.contents.map(c => c.tokenId));
    return canvas.tokens.placeables.filter(t => !combatTokens.has(t.id) && (t.actor.ownership?.[userID] === CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER || t.actor?.getFlag('pf2e-summons-assistant', 'summoner')?.id === actorID))
}

async function addPlantBanner(actor) {
    actor.createEmbeddedDocuments("Item", [
        (await fromUuid(EFFECTS.COMMANDER.PLANT_BANNER)).toObject()
    ])
}