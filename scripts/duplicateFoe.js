export async function getFoeInfo(actor, rank) {

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

    const actions = actor.system.traits.actions.map((act, index) => ({
        traits: act.weaponTraits.map(t => t.name),
        slug: act.slug,
        totalModifier: act.modifiers
            .filter(mod => mod.type === 'circumstance')
            .map(mod => mod.modifier)
            .reduce((sum, val) => sum - val, act.totalModifier),
        damage: parseDamageString(damages[index]),
        label: act.label
    }));


    for (const skill in actor.system.skills) {
        data.system.skills[skill.slug] = getValueWithoutCircumstance(skill);
    }
    return {
        changes: data,
        strikeRules: actionsToStrikeRE(actions)
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
            results.push({
                ...parsed,
                damage: parseDamageREItems(parsed.damage),
            });
        }
    }

    return results;
}

function smartSplit(str, delimiter) {
    const parts = [];
    let current = '';
    let parenCount = 0;

    for (const element of str) {
        const char = element;

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

function parseDamageREItems(damageString) {
    // Remove all spaces from the string
    const cleanString = damageString.replace(/\s/g, '');

    // Regular expression to match dice notation: XdY+Z or XdY-Z or just XdY
    const diceRegex = /^(\d+)?d(\d+)([+-]\d+)?$/;
    const match = cleanString.match(diceRegex);

    if (!match) {
        throw new Error(`Invalid damage string format: ${damageString}`);
    }

    const [, diceCount, dieType, modifier] = match;

    return {
        dice: parseInt(diceCount) || 1, // Default to 1 if no number before 'd'
        die: `d${dieType}`,
        mod: modifier ? parseInt(modifier) : 0 // Default to 0 if no modifier
    };
}

function actionsToStrikeRE(actions) {
    const rules = [];
    for (const action of actions) {
        const { slug, traits, totalModifier, label } = action;
        let id = 1;
        for (const dmg of action.damage) {
            const { dice, die, mod, } = dmg.damage;
            const { damageType, category } = dmg;
            if (id === 1) {
                rules.push(getStrikeAction({
                    slug,
                    label,
                    traits,
                    attackModifier: totalModifier,
                    damageType,
                    dice,
                    die,
                    modifier: mod,
                    category
                }))
            } else {
                rules.push(
                    ...getExtraDamageDiceRE({
                        slug,
                        id,
                        damageType,
                        dice,
                        die,
                        category,
                        modifier: mod,
                    })
                )
            }
            id++;
        }
    }
    return rules;
}

function getStrikeAction(config) {
    return {
        "damage": {
            "base": {
                "damageType": config.damageType,
                "dice": config.dice,
                "die": config.die,
                "modifier": config.modifier
            }
        },
        "attackModifier": config.attackModifier,
        "traits": config.traits,
        "key": "Strike",
        "slug": config.slug,
        "label": config.label
    }
}

function getExtraDamageDiceRE(config) {
    return [
        {
            "key": "DamageDice",
            "selector": `${config.slug}-damage`,
            "label": "_",
            "diceNumber": config.dice,
            "dieSize": config.die,
            "damageType": config.damageType,
            "damageCategory": config?.category,
            "predicate": [],
            "slug": config.id
        },
        {
            "key": "FlatModifier",
            "selector": `${config.slug}-damage`,
            "value": config.modifier4,
            "damageType": config.damageType,
            "damageCategory": config?.category,
            "hideIfDisabled": true,
            "label": "_"
        }
    ]
}