async function getFoeInfo(actor, rank) {

    const damagePromises = actor.system.actions.map(action =>
        action.damage({ getFormula: true })
    );

    const damages = await Promise.all(damagePromises);

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
            actions: actor.system.traits.actions.map((act, index) => ({
                traits: act.weaponTraits.map(t => t.name),
                slug: act.slug,
                totalModifier: act.modifiers
                    .filter(mod => mod.type === 'circumstance')
                    .map(mod => mod.modifier)
                    .reduce((sum, val) => sum - val, act.totalModifier),
                damage: parseDamageComponent(damages[index]),
                label: act.label
            })),
            skills: Object.keys(actor.system.skills).reduce((accumulator, skill) => {
                accumulator[skill] = {
                    slug: skill,
                    label: actor.system.skills[skill].label,
                    value: getValueWithoutCircumstance(actor.system.skills[skill])
                }
                return accumulator
            }, {})
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

function parseDamageString(damageStr) {
    // Split by '+' but handle parentheses properly
    const components = smartSplit(damageStr, '+');
    const results = [];

    for (const component of components) {
        const parsed = parseDamageComponent(component.trim());
        if (parsed) {
            results.push(parsed);
        }
    }

    return results;
}

function smartSplit(str, delimiter) {
    const parts = [];
    let current = '';
    let parenCount = 0;

    for (let i = 0; i < str.length; i++) {
        const char = str[i];

        if (char === '(') parenCount++;
        else if (char === ')') parenCount--;

        if (char === delimiter && parenCount === 0) {
            parts.push(current);
            current = '';
        } else {
            current += char;
        }
    }

    if (current) parts.push(current);
    return parts;
}

function parseDamageComponent(component) {
    const words = component.split(/\s+/);

    if (words.length < 2) return null;

    // Last 1 or 2 words are damage type (with optional category)
    if (words.length >= 3) {
        // Check if we have category + damage type (last 2 words)
        const possibleCategory = words[words.length - 2];
        const damageType = words[words.length - 1];
        const damage = words.slice(0, -2).join(' ');

        // Categories are words like "persistent", "ongoing", etc.
        const categories = ['persistent', 'precision', 'splash'];

        if (categories.includes(possibleCategory.toLowerCase())) {
            return {
                damage: damage,
                damageType: damageType,
                category: possibleCategory.toLowerCase()
            };
        } else {
            // No category, last word is damage type
            return {
                damage: words.slice(0, -1).join(' '),
                damageType: words[words.length - 1],
                category: null
            };
        }
    } else {
        // Only 2 words: damage and type
        return {
            damage: words[0],
            damageType: words[1],
            category: null
        };
    }
}