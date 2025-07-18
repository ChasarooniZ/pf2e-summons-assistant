function getFoeInfo(actor, rank) {
    const data = {
        "armorClass": getValueWithoutCircumstance(actor.armorClass),
        system: {
            perception: getValueWithoutCircumstance(actor.system.saves.perception),
            attributes: {
                hp: {
                    max: 70 + (rank - 7) * 10,
                    value: 70 + (rank - 7) * 10
                }
            },
            saves: {
                fortitude: getValueWithoutCircumstance(actor.system.saves.fortitude),
                reflex: getValueWithoutCircumstance(actor.system.saves.reflex),
                will: getValueWithoutCircumstance(actor.system.saves.will)
            },
            traits: {
                value: actor.system.traits.value,
                size: actor.system.traits.size
            },
            actions: actor.system.traits.actions.map(act => ({
                traits: act.weaponTraits.map(t => t.name),
                slug: act.slug,
                totalModifier: act.modifiers
                    .filter(mod => mod.type === 'circumstance')
                    .map(mod => mod.modifier)
                    .reduce((sum, val) => sum - val, act.totalModifier),
                damage: act?.item?.system?.damage,
                label: act.label
            })),
            skills: {}
        }
    }

    for (const skill in actor.system.skills) {
        data.system.skills[skill.slug] = getValueWithoutCircumstance(skill);
    }

}


function getValueWithoutCircumstance(basePath) {
    return basePath.modifiers
        .filter(mod => mod.type === 'circumstance')
        .map(mod => mod.modifier)
        .reduce((sum, val) => sum - val, basePath.value);
}