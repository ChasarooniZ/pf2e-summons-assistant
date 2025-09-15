import { getAllDamageSlugs } from "./helpers.js";

export async function getFoeInfo(token, rank) {
    const actor = token.actor;

    const damagePromises = actor.system.actions.map(action =>
        action.damage({ getFormula: true })
    );

    const damages = await Promise.all(damagePromises);

    const data = {
        img: actor.img,
        system: {
            perception: {
                ...actor.system.perception,
                mod: getValueWithoutCircumstance(actor.system.perception)
            },
            attributes: {
                hp: {
                    max: 70 + (rank - 7) * 10,
                    value: 70 + (rank - 7) * 10
                },
                ac: {
                    value: getValueWithoutCircumstance(actor.system.attributes.ac)
                },
                speed: {
                    ...actor.system.attributes.speed,
                    value: getValueWithoutCircumstance(actor.system.attributes.speed)
                }
            },
            saves: {
                fortitude: {
                    value: getValueWithoutCircumstance(actor.system.saves.fortitude)
                },
                reflex: {
                    value: getValueWithoutCircumstance(actor.system.saves.reflex)
                },
                will: {
                    value: getValueWithoutCircumstance(actor.system.saves.will)
                }
            },
            abilities: {
                cha: {
                    mod: actor.system.abilities.cha.mod
                },
                con: {
                    mod: actor.system.abilities.con.mod
                },
                wis: {
                    mod: actor.system.abilities.wis.mod
                },
                dex: {
                    mod: actor.system.abilities.dex.mod
                },
                int: {
                    mod: actor.system.abilities.int.mod
                },
                str: {
                    mod: actor.system.abilities.str.mod
                },
            },
            traits: {
                value: [...actor.system.traits.value, 'minion'],
                size: actor.system.traits.size
            },
            skills: Object.keys(actor.system.skills).reduce((accumulator, skill) => {
                if (skill) {
                    accumulator[skill] = {
                        ...actor.system.skills[skill],
                        mod: getValueWithoutCircumstance(actor.system.skills[skill]),
                        value: getValueWithoutCircumstance(actor.system.skills[skill]),
                        base: getValueWithoutCircumstance(actor.system.skills[skill]),
                    }
                }
                return accumulator
            }, {})
        },
        prototypeToken: {
            ring: token.ring,
            texture: token.texture
        }
    }

    const actions = actor.system.actions.map((act, index) => ({
        traits: act?.weaponTraits?.map(t => t.name) ?? [...(act?.weapon?.traits ?? [])],
        slug: act.slug,
        totalModifier: act.modifiers
            .filter(mod => mod.type === 'circumstance' && mod.enabled)
            .map(mod => mod.modifier)
            .reduce((sum, val) => sum - val, act.totalModifier),
        damage: parseDamageString(damages[index]),
        label: act.label,
        img: act?.item?.img
    }));

    const items = actor.items.contents.filter(item => !item.traits?.has("magical") &&
        !item.traits?.has("arcane") &&
        !item.traits?.has("divine") &&
        !item.traits?.has("occult") &&
        !item.traits?.has("primal") &&
        ["equipment", "backpack", "consumable", "weapon", "armor"].includes(item.type));


    for (const skill in actor.system.skills) {
        data.system.skills[skill.slug] = getValueWithoutCircumstance(skill);
    }
    return {
        changes: data,
        strikeRules: [...actionsToStrikeRE(actions), damagePerTurn, healingImmune],
        items
    }
}


function getValueWithoutCircumstance(basePath) {
    return basePath?.modifiers
        ?.filter(mod => mod.type === 'circumstance' && mod.enabled)
        ?.map(mod => mod.modifier)
        ?.reduce((sum, val) => sum - val, basePath?.total ?? basePath?.value ?? basePath.mod);
}

function parseDamageString(damageStr) {
    const components = smartSplitDamage(damageStr);
    const results = [];

    for (const component of components) {
        const parsed = parseDamageComponent(component.trim());
        if (parsed) {
            const damageArray = parseDamageREItems(parsed.damage);
            for (const damageItem of damageArray) {
                results.push({
                    ...damageItem,
                    damageType: parsed.damageType,
                    category: parsed.category
                });
            }
        }
    }
    return results;
}


function smartSplitDamage(str) {
    const damageTypes = getAllDamageSlugs();

    const parts = [];
    let current = '';
    let parenCount = 0;
    const words = str.split(/\s+/);

    for (const element of words) {
        const word = element;


        parenCount += (word.match(/\(/g) || []).length;
        parenCount -= (word.match(/\)/g) || []).length;


        if (parenCount === 0 && damageTypes.includes(word.toLowerCase())) {
            current += (current ? ' ' : '') + word;
            parts.push(current);
            current = '';
        } else {
            if (current === '' && word === '+') {
                continue;
            }
            current += (current ? ' ' : '') + word;
        }
    }

    // Add any remaining content
    if (current.trim()) {
        parts.push(current);
    }

    return parts;
}

function parseDamageComponent(component) {
    const words = component.split(/\s+/);

    if (words.length < 2) return null;

    if (words.length >= 3) {
        const possibleCategory = words[words.length - 2];
        const damageType = words[words.length - 1];
        const damage = words.slice(0, -2).join(' ');

        const categories = ['persistent', 'precision', 'splash'];

        if (categories.includes(possibleCategory.toLowerCase())) {
            return {
                damage: damage,
                damageType: damageType,
                category: possibleCategory.toLowerCase()
            };
        } else {
            return {
                damage: words.slice(0, -1).join(' '),
                damageType: words[words.length - 1],
                category: null
            };
        }
    } else {
        return {
            damage: words[0],
            damageType: words[1],
            category: null
        };
    }
}

function parseDamageREItems(damageString) {
    const cleanString = damageString.replace(/[\s()]/g, '');

    const parts = [];
    let current = '';
    let i = 0;

    if (cleanString[0] !== '+' && cleanString[0] !== '-') {
        while (i < cleanString.length && cleanString[i] !== '+' && cleanString[i] !== '-') {
            current += cleanString[i];
            i++;
        }
        if (current) {
            parts.push(current);
            current = '';
        }
    }

    while (i < cleanString.length) {
        const char = cleanString[i];
        if (char === '+' || char === '-') {
            if (current) {
                parts.push(current);
                current = '';
            }
            parts.push(char);
        } else {
            current += char;
        }
        i++;
    }
    if (current) {
        parts.push(current);
    }

    const results = [];
    let currentSign = 1;

    for (const part of parts) {
        if (part === '+') {
            currentSign = 1;
        } else if (part === '-') {
            currentSign = -1;
        } else {
            const diceRegex = /^(\d+)?d(\d+)$/;
            const modifierRegex = /^\d+$/;

            if (diceRegex.test(part)) {
                const match = part.match(diceRegex);
                const [, diceCount, dieType] = match;
                results.push({
                    dice: (parseInt(diceCount) || 1) * (currentSign >= 0 ? 1 : currentSign),
                    die: `d${dieType}`,
                    mod: 0
                });
            } else if (modifierRegex.test(part)) {
                results.push({
                    dice: 0,
                    die: 'd1',
                    mod: parseInt(part) * currentSign
                });
            }
            currentSign = 1;
        }
    }

    return results;
}

function actionsToStrikeRE(actions) {
    const rules = [];
    for (const action of actions) {
        const { slug, traits, totalModifier, label, img } = action;
        let id = 1;
        for (const dmg of action.damage) {
            const { dice, die, mod, } = dmg;
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
                    category,
                    img
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
        "label": config.label,
        "img": config.img
    }
}

function getExtraDamageDiceRE(config) {
    return [
        ...(config.dice !== 0 ? [{
            "key": "DamageDice",
            "selector": `${config.slug}-damage`,
            "label": "_",
            "diceNumber": config.dice,
            "dieSize": config.die,
            "damageType": config.damageType,
            "damageCategory": config?.category,
            "predicate": [],
            "slug": String(config.id)
        }] : []),
        {
            "key": "FlatModifier",
            "selector": `${config.slug}-damage`,
            "value": config.modifier,
            "damageType": config.damageType,
            "damageCategory": config?.category,
            "hideIfDisabled": true,
            "label": "_"
        }
    ]
}

const damagePerTurn = {
    "key": "GrantItem",
    "uuid": "Compendium.pf2e.conditionitems.Item.lDVqvLKA6eF3Df60",
    "alterations": [
        {
            "mode": "override",
            "property": "persistent-damage",
            "value": {
                "damageType": "untyped",
                "formula": "4d6"
            }
        },
        {
            "mode": "override",
            "property": "pd-recovery-dc",
            "value": 21
        }
    ],
    "onDeleteActions": {
        "grantee": "cascade"
    }
}

const healingImmune = {
    "key": "Immunity",
    "type": "healing"
}