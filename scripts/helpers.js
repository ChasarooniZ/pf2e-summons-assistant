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

export function getAllDamageSlugs() {
    return [
        'acid', 'bludgeoning', 'cold', 'electricity', 'fire', 'force', 'mental',
        'piercing', 'poison', 'slashing', 'sonic', 'spirit', 'untyped', 'vitality', 'void',
        ...(game.settings.get("pf2e", "homebrew.damageTypes") ?? []).map(type => game.pf2e.system.sluggify(type.label))
    ]
}


export function warnNotification(text) {
    const localizedText = game.i18n.localize(text);
    ui.notifications.warn(`『${game.i18n.localize('pf2e-summons-assistant.name')}』 ${localizedText}`)
}

export function errorNotification(text) {
    const localizedText = game.i18n.localize(text);
    ui.notifications.error(`『${game.i18n.localize('pf2e-summons-assistant.name')}』 ${localizedText}`)
}