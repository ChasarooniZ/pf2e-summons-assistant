import { ACTIONS, ALT_ART, CREATURES, EFFECTS, SOURCES } from "./const.js";
import { hasNoTargets, onlyHasJB2AFree } from "./helpers.js";
import { incarnateDetails } from "./incarnate.js";
import { getEidolon } from "./specificClasses/summoner.js"

export async function getSpecificSummonDetails(uuid, data = { rank: 0, summonerLevel: 0, dc: 0 }) {
    switch (uuid) {
        case SOURCES.SUMMON.PHANTASMAL_MINION:
            return [{ specific_uuids: [CREATURES.PHANTASMAL_MINION], rank: data.rank }]
        case SOURCES.MISC.LIGHT:
            if (hasNoTargets()) {
                return [{
                    specific_uuids: Object.values(CREATURES.LIGHT), rank: data.rank, modifications: {
                        "system.details.level.value": data.rank,
                        ...(
                            onlyHasJB2AFree() ?
                                { "prototypeToken.texture.src": ALT_ART.JB2A_FREE.LIGHT }
                                : {}
                        )
                    }
                }]
            }
            else return null;
        case SOURCES.MISC.FLOATING_FLAME:
            return [{
                specific_uuids: [CREATURES.FLOATING_FLAME], rank: data.rank, modifications: {
                    ...(
                        onlyHasJB2AFree() ?
                            { "prototypeToken.texture.src": ALT_ART.JB2A_FREE.FLOATING_FLAME }
                            : {}
                    )
                }
            }]

        case SOURCES.INCARNATE.SUMMON_HEALING_SERVITOR:
            return [incarnateDetails({
                uuids: [CREATURES.HEALING_SERVITOR],
                rank: data.rank,
                dc: data.dc
            })]
        case SOURCES.INCARNATE.TEMPEST_OF_SHADES:
            return [incarnateDetails({
                uuids: [CREATURES.TEMPEST_OF_SHADES],
                rank: data.rank,
                dc: data.dc
            })]
        case SOURCES.INCARNATE.SUMMON_ELEMENTAL_HERALD:
            return [incarnateDetails({
                uuids: Object.values(CREATURES.ELEMENTAL_HERALD),
                rank: data.rank,
                dc: data.dc
            })]
        case SOURCES.INCARNATE.CALL_FLUXWRAITH:
            return [incarnateDetails({
                uuids: [CREATURES.FLUXWRAITH],
                rank: data.rank,
                dc: data.dc
            })]


        case SOURCES.MISC.CALL_URSINE_ALLY:
            if (data.summonerLevel < 10) {
                return [{ specific_uuids: [CREATURES.BLACK_BEAR], rank: 3 }]
            } else if (data.summonerLevel < 12) {
                return [{ specific_uuids: [CREATURES.GRIZZLY_BEAR], rank: 4 }]
            } else if (data.summonerLevel < 14) {
                return [{ specific_uuids: [CREATURES.POLAR_BEAR], rank: 5 }]
            } else {
                return [{ specific_uuids: [CREATURES.CAVE_BEAR], rank: 6 }]
            }

        case SOURCES.NECROMANCER.CREATE_THRALL:
            return [{
                specific_uuids: [CREATURES.NECROMANCER.THRALL],
                rank: data.rank,
                amount: getNecromancerProf(data.summonerLevel),
                itemsToAdd: [EFFECTS.NECROMANCER.THRALL_EXPIRATION(data.duration)]
            }]
        case SOURCES.NECROMANCER.PERFECTED_THRALL:
            return [{
                specific_uuids: [CREATURES.NECROMANCER.PERFECTED_THRALL],
                rank: data.rank,
                itemsToAdd: [EFFECTS.NECROMANCER.THRALL_EXPIRATION(data.duration)]
            }]
        case SOURCES.NECROMANCER.SKELETAL_LANCERS:
            return [{
                specific_uuids: [CREATURES.NECROMANCER.SKELETAL_LANCERS],
                rank: data.rank,
                amount: 5,
                itemsToAdd: [EFFECTS.NECROMANCER.THRALL_EXPIRATION(data.duration)]
            }]
        case SOURCES.NECROMANCER.LIVING_GRAVEYARD:
            return [
                {
                    specific_uuids: [CREATURES.NECROMANCER.LIVING_GRAVEYARD],
                    rank: data.rank,
                    itemsToAdd: [EFFECTS.NECROMANCER.THRALL_EXPIRATION(data.duration)]
                },
                {
                    specific_uuids: [CREATURES.NECROMANCER.THRALL],
                    rank: data.rank,
                    amount: 5,
                    itemsToAdd: [EFFECTS.NECROMANCER.THRALL_EXPIRATION(data.duration)]
                }
            ]
        case SOURCES.NECROMANCER.RECURRING_NIGHTMARE:
            return [{
                specific_uuids: [CREATURES.NECROMANCER.RECURRING_NIGHTMARE],
                rank: data.rank,
                itemsToAdd: [EFFECTS.NECROMANCER.THRALL_EXPIRATION(data.duration)]
            }]

        case SOURCES.NECROMANCER.CONGLOMERATE_OF_LIMBS:
            return [{
                specific_uuids: [CREATURES.NECROMANCER.CONGLOMERATE_OF_LIMBS],
                rank: data.rank,
                itemsToAdd: [EFFECTS.NECROMANCER.THRALL_EXPIRATION(data.duration)]
            }]

        case SOURCES.NECROMANCER.INEVITABLE_RETURN:
            return [{
                specific_uuids: [CREATURES.NECROMANCER.THRALL],
                rank: data.rank,
                amount: 1,
                itemsToAdd: [EFFECTS.NECROMANCER.THRALL_EXPIRATION(data.duration)]
            }]
        case SOURCES.NECROMANCER.BIND_HEROIC_SPIRIT_STRIKE:
            return [{
                specific_uuids: [CREATURES.NECROMANCER.THRALL],
                rank: 1,
                itemsToAdd: [EFFECTS.NECROMANCER.THRALL_EXPIRATION(data.duration)]
            }]
        case SOURCES.MECHANIC.DEPLOY_MINE:
            return [{
                specific_uuids: [CREATURES.MECHANIC.MINE], rank: data.rank,
                modifications: {
                    'system.details.level.value': data.summonerLevel,
                    'system.resources.dc.value': data.classDC,
                    'system.abilities.int.mod': data.int
                },
                itemsToAdd: data.hasCriticalExplosion ? [ACTIONS.MECHANIC.CRITICAL_EXPLOSION()] : []
            }]
        case SOURCES.MECHANIC.DOUBLE_DEPLOYMENT:
            return [{
                specific_uuids: [CREATURES.MECHANIC.MINE], rank: data.rank, amount: 2,
                modifications: {
                    'system.details.level.value': data.summonerLevel,
                    'system.resources.dc.value': data.classDC,
                    'system.abilities.int.mod': data.int
                },
                itemsToAdd: data.hasCriticalExplosion ? [ACTIONS.MECHANIC.CRITICAL_EXPLOSION()] : []
            }]
        case SOURCES.SUMMONER.MANIFEST_EIDOLON:
            const uuid = await getEidolon(data.summonerActorId);
            if (uuid)
                return [{ specific_uuids: [uuid], isCharacter: true }];
            return null;
        case SOURCES.COMMANDER.PLANTED_BANNER:
            return [{
                specific_uuids: [CREATURES.COMMANDER.PLANTED_BANNER],
                modifications: {
                    'system.details.level.value': data.summonerLevel,
                    'system.abilities.int.mod': data.int
                },
                crosshairParameters: {
                    snap: {
                        position: CONST.GRID_SNAPPING_MODES.CORNER
                    }
                }
            }]


        default:
            return null;
    }
}


function getNecromancerProf(lvl) {
    if (lvl < 7) {
        return 1;
    } else if (lvl < 15) {
        return 2;
    } else if (lvl < 19) {
        return 3;
    } else {
        return 4;
    }
}