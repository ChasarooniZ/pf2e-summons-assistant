/**
 * The Following Code is sourced from `PF2e Workbench` under the Apache License
 * It has been adapted to JS as i am way too lazy for TS
 * https://github.com/xdy/xdy-pf2e-workbench/blob/main/src/module/feature/cr-scaler/NPCScaler.ts
 */

import { SCALE_APP_DATA } from "./scaleActorConst.js";

/**
 * 
 * @param {*} actor 
 * @param {*} newLevel 
 * @returns 
 */
export async function scaleNPCToLevel(actor, newLevel) {
    const system = actor.system;
    const oldLevel = system.details.level.value;
    const updateData = {
        ["system.details.level.value"]: newLevel,
    };

    // parse attribute modifiers
    for (const [key, attr] of Object.entries(system.abilities)) {
        const mod = getLeveledData("abilityScore", parseInt(attr.mod), oldLevel, newLevel).total;
        const value = 10 + mod * 2;
        const min = 3;

        updateData[`system.abilities.${key}`] = { value, min, mod };
    }

    // parse resistances
    const drData = [];
    const resistances = system.attributes.resistances;
    for (const resistance of resistances) {
        drData.push({
            label: extractLabel(resistance.label),
            type: resistance.type,
            exceptions: resistance.exceptions ?? "",
            value: getMinMaxData("resistance", resistance.value, oldLevel, newLevel),
            doubleVs: resistance.doubleVs ?? "",
        });
    }
    updateData["system.attributes.resistances"] = drData;

    // parse weaknesses
    const dvData = [];
    const weaknesses = system.attributes.weaknesses;
    for (const weakness of weaknesses) {
        dvData.push({
            label: extractLabel(weakness.label),
            type: weakness.type,
            exceptions: weakness.exceptions ?? [],
            value: getMinMaxData("weakness", weakness.value, oldLevel, newLevel),
        });
    }
    updateData["system.attributes.weaknesses"] = dvData;

    // parse simple modifiers
    updateData["system.attributes.ac.value"] = getLeveledData(
        "armorClass",
        system.attributes.ac?.value ?? 0,
        oldLevel,
        newLevel,
    ).total;
    updateData["system.perception.mod"] = getLeveledData(
        "perception",
        system.perception.mod ?? 0,
        oldLevel,
        newLevel,
    ).total;
    updateData["system.saves.fortitude.value"] = getLeveledData(
        "savingThrow",
        system.saves.fortitude.value ?? 0,
        oldLevel,
        newLevel,
    ).total;
    updateData["system.saves.reflex.value"] = getLeveledData(
        "savingThrow",
        system.saves.reflex.value ?? 0,
        oldLevel,
        newLevel,
    ).total;
    updateData["system.saves.will.value"] = getLeveledData(
        "savingThrow",
        system.saves.will.value ?? 0,
        oldLevel,
        newLevel,
    ).total;

    const hp = getHPData(system.attributes.hp?.value ?? 0, oldLevel, newLevel);
    updateData["system.attributes.hp.max"] = hp;
    updateData["system.attributes.hp.value"] = hp;

    for (const [key, attr] of Object.entries(system.skills).filter(([, attr]) => attr.base > 0)) {
        const mod = getLeveledData("skill", parseInt(attr.mod), oldLevel, newLevel).total;
        const value = getLeveledData("skill", parseInt(attr.value), oldLevel, newLevel).total;
        const base = getLeveledData("skill", parseInt(attr.base), oldLevel, newLevel).total;

        updateData[`system.skills.${key}`] = { ...{ ...attr, mod: mod, value: value, base: base } };
    }

    return updateData;
}

/**
 * 
 * @param {*} actor 
 * @param {*} oldLevel 
 * @param {*} newLevel 
 */
export async function scaleActorItems(actor, oldLevel, newLevel) {
    let itemUpdates = [];
    const items = actor.items;
    for (const itemId of items.keys()) {
        const item = items.get(itemId);

        if (item.type === "spellcastingEntry") {
            const oldAttack = parseInt(item.system.spelldc.value);
            const newAttack = getLeveledData("spell", oldAttack, oldLevel, newLevel).total;

            const oldDC = parseInt(item.system.spelldc.dc);
            const newDC = getLeveledData("difficultyClass", oldDC, oldLevel, newLevel).total;

            itemUpdates.push({
                _id: item.id,
                ["system.spelldc.value"]: newAttack,
                ["system.spelldc.dc"]: newDC,
            });
        } else if (item.type === "melee") {
            const oldAttack = parseInt(item.system.bonus.value);
            const newAttack = getLeveledData("spell", oldAttack, oldLevel, newLevel).total;

            const attackUpdate = {
                _id: item.id,
                ["system.bonus.value"]: newAttack,
                ["system.bonus.total"]: newAttack,
            };

            const damage = item.system.damageRolls;

            if (Array.isArray(damage)) {
                for (let i = 0; i < damage.length; i++) {
                    attackUpdate[`system.damageRolls.${i}.damage`] = getDamageData(
                        damage[i].damage,
                        oldLevel,
                        newLevel
                    );
                    attackUpdate[`system.damageRolls.${i}.damageType`] = damage[i].damageType;
                }
            } else {
                // Fix for #2 - some actors contain key/value pairs instead of array elements
                for (const key in damage) {
                    attackUpdate[`system.damageRolls.${key}.damage`] = getDamageData(
                        damage[key].damage,
                        oldLevel,
                        newLevel
                    );
                    attackUpdate[`system.damageRolls.${key}.damageType`] = damage[key].damageType;
                }
            }

            itemUpdates.push(attackUpdate);
        }
    }

    await actor.updateEmbeddedDocuments("Item", itemUpdates);

    itemUpdates = [];
    const DC_REGEXES = [/(data-pf2-dc=")(\d+)(")/g, /(@Check\[.*?type:.*?|dc:)(\d+)(.*?])/g];
    for (let regexNo = 0; regexNo < DC_REGEXES.length; regexNo++) {
        const regex = DC_REGEXES[regexNo];
        for (const item of items
            .filter(
                (item) => item.system.description.value.includes("DC") || item.system.description.value.includes("dc:")
            )
            .filter(
                (item) => !((
                    Array.of("consumable", "armor", "backpack", "book", "equipment", "treasure", "weapon")
                )).includes(item.type)
            ) //
            .filter((item) => !item.system.description.value.includes("type:flat"))) {
            const description = item.system.description.value;
            let newDescription = description;
            let match = regex.exec(description);

            let indexOffset = 0;
            while (match !== null) {
                const fullMatch = match[0];
                let value;
                if (regexNo === 0) {
                    value = match[1];
                } else {
                    value = match[2];
                }
                const index = match.index + indexOffset;
                const newDCValue = getLeveledData("difficultyClass", parseInt(value), oldLevel, newLevel).total;
                const newDCString = `${match[1]}${newDCValue}${match[3]}`;

                newDescription =
                    newDescription.substring(0, index) +
                    newDCString +
                    newDescription.substring(index + fullMatch.length);

                indexOffset += newDescription.length - description.length - indexOffset;

                match = regex.exec(description);
            }

            itemUpdates.push({
                _id: item.id,
                ["system.description.value"]: newDescription,
            });
        }
    }

    await actor.updateEmbeddedDocuments("Item", itemUpdates);

    itemUpdates = [];
    // Ignore spell damage, that will have to be handled manually
    for (const item of actor.items.filter((item) => !item.isOfType("spell")).values()) {
        const DMG_REGEX = /\d+d\d+(\+\d*)?/g;
        const description = item.system["description"].value;
        let newDescription = description;
        let match = DMG_REGEX.exec(description);
        let indexOffset = 0;
        while (match !== null) {
            const [fullMatch] = match;
            const index = match.index + indexOffset;
            const newDamageFormula = getAreaDamageData(fullMatch, oldLevel, newLevel);

            newDescription =
                newDescription.substring(0, index) +
                newDamageFormula +
                newDescription.substring(index + fullMatch.length);

            indexOffset += newDescription.length - description.length - indexOffset;

            match = DMG_REGEX.exec(description);
        }

        itemUpdates.push({
            _id: item.id,
            ["system.description.value"]: newDescription,
        });
    }

    await actor.updateEmbeddedDocuments("Item", itemUpdates);
}


function getMinMaxData(
    key,
    oldValue,
    oldLevel,
    newLevel,
) {
    const data = SCALE_APP_DATA[key];
    const oldLevelData = data[oldLevel + 1];
    const newLevelData = data[newLevel + 1];

    const oldRange = Math.abs(oldLevelData.maximum - oldLevelData.minimum);
    const oldPercentile = (oldValue - oldLevelData.minimum) / oldRange;

    const newRange = Math.abs(newLevelData.maximum - newLevelData.minimum);
    return Math.round(newLevelData.minimum + newRange * oldPercentile);
}

function getHPData(oldValue, oldLevel, newLevel) {
    const data = SCALE_APP_DATA["hitPoints"];
    const oldLevelData = data[oldLevel + 1];
    const newLevelData = data[newLevel + 1];

    // try to find an exact match
    let bestMatch = {
        key: "undefined",
        percentile: 0,
        delta: Number.MAX_SAFE_INTEGER,
    };
    for (const entry of Object.entries(oldLevelData)) {
        const key = entry[0];
        if (key === "level") {
            continue;
        }

        const entryValue = entry[1];
        const { minimum, maximum } = entryValue;
        const range = maximum - minimum;
        const percentile = (oldValue - minimum) / range;
        const dMin = Math.abs(oldValue - minimum);
        const dMax = Math.abs(oldValue - maximum);
        const delta = Math.min(dMin, dMax);

        if (oldValue > minimum && oldValue < maximum) {
            bestMatch = {
                key,
                percentile,
                delta,
            };
            break;
        } else {
            if (delta < bestMatch.delta) {
                bestMatch = {
                    key,
                    percentile,
                    delta,
                };
            }
        }
    }

    const newValue = newLevelData[bestMatch.key];
    return Math.round(newValue.minimum + (newValue.maximum - newValue.minimum) * bestMatch.percentile);
}

function getAreaDamageData(oldValue, oldLevel, newLevel) {
    const data = SCALE_APP_DATA["areaDamage"];
    const oldLevelData = data[oldLevel + 1];
    const newLevelData = data[newLevel + 1];
    const parsedOldValue = parseDamage(oldValue);

    let bestMatch = { key: "undefined", delta: Number.MAX_SAFE_INTEGER };
    for (const entry of Object.entries(oldLevelData)) {
        const key = entry[0];
        if (key === "level") {
            continue;
        }

        const value = entry[1];
        const delta = Math.abs(value.average - parsedOldValue.average);

        if (delta < bestMatch.delta) {
            bestMatch = {
                key,
                delta,
            };
        }
    }

    if (bestMatch.delta < parsedOldValue.average * 0.5) {
        return constructRelativeDamage(parsedOldValue, oldLevelData[bestMatch.key], newLevelData[bestMatch.key])
            .original;
    } else {
        return oldValue;
    }
}

function parseDamage(value) {
    const [diceString, bonusString] = value.split("+");
    let bonus = 0;
    if (bonusString !== undefined) {
        bonus = parseInt(bonusString);
    }

    const [diceCountString, diceSizeString] = diceString.split("d");
    const result = {
        diceCount: parseInt(diceCountString),
        diceSize: parseInt(diceSizeString),
        original: value,
        average: 0,
        bonus,
    };

    result.average = ((result.diceSize + 1) / 2) * result.diceCount + result.bonus;

    return result;
}

function constructRelativeDamage(oldDmg, stdDmg, newDmg) {
    const count = newDmg.diceCount;
    const size = newDmg.diceSize;
    const bonus = newDmg.bonus + oldDmg.bonus - stdDmg.bonus;

    return parseDamage(
        constructFormula({
            diceCount: count,
            diceSize: size,
            bonus,
        }),
    );
}

function constructFormula({
    diceCount,
    diceSize,
    bonus,
}) {
    let formula = `${diceCount}d${diceSize}`;
    if (bonus > 0) {
        formula = `${formula}+${bonus}`;
    }
    return formula;
}

function getDamageData(oldValue, oldLevel, newLevel) {
    const data = SCALE_APP_DATA["strikeDamage"];
    const oldLevelData = data[oldLevel + 1];
    const newLevelData = data[newLevel + 1];
    const parsedOldValue = parseDamage(oldValue);

    let bestMatch = { key: "undefined", delta: Number.MAX_SAFE_INTEGER };
    for (const entry of Object.entries(oldLevelData)) {
        const key = entry[0];
        if (key === "level") {
            continue;
        }

        const value = entry[1];
        const delta = Math.abs(value.average - parsedOldValue.average);

        if (delta < bestMatch.delta) {
            bestMatch = {
                key,
                delta,
            };
        }
    }

    if (bestMatch.delta < parsedOldValue.average * 0.5) {
        return constructRelativeDamage(parsedOldValue, oldLevelData[bestMatch.key], newLevelData[bestMatch.key])
            .original;
    } else {
        return oldValue;
    }
}

function getLeveledData(key, oldValue, oldLevel, newLevel) {
    const data = SCALE_APP_DATA[key];
    const oldLevelData = data[oldLevel + 1];
    const newLevelData = data[newLevel + 1];

    let bestMatch = { key: "undefined", delta: Number.MAX_SAFE_INTEGER };
    for (const entry of Object.entries(oldLevelData)) {
        const key = entry[0];
        if (key === "level") {
            continue;
        }

        const value = parseInt(entry[1]);
        const delta = Math.abs(value - oldValue);

        if (delta < bestMatch.delta) {
            bestMatch = {
                key,
                delta,
            };
        }
    }

    const result = {
        value: newLevelData[bestMatch.key],
        delta: oldValue - oldLevelData[bestMatch.key],
        total: 0,
    };
    result.total = result.value + result.delta;

    return result;
}

function extractLabel(label) {
    const match = label.match(/^(.*?)(?:\s+\d+)?$/);
    return match ? match[1] : label;
}