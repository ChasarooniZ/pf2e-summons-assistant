/**
 * From UUID function to maintain V12 & 13 Compatab ility
 * @param {*} uuid UUID to get
 * @returns 
 */
export async function compFromUuid(uuid) {
    if (parseInt(game.version) === 12) {
        return await fromUuid(uuid)
    } else {
        return await foundry.utils.fromUuid(uuid)
    }
}



export function addTraits(type) {
    if (type === 'summon') return ['minion', 'summoned']
    return [];
}

export function messageItemHasRollOption(msg, roll_option) {
    return msg?.flags?.pf2e?.origin?.rollOptions?.includes(roll_option)
}


export function hasNoTargets() {
    return game.user.targets.size === 0;
}


export function onlyHasJB2AFree() {
    return game.modules.get("JB2A_DnD5e")?.active && !game.modules.get("jb2a_patreon")?.active
}
export function capitalizeDamageType(type) {
    return type.charAt(0).toUpperCase() + type.slice(1);
}
