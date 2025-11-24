import { WEAPON_DAMAGE_TYPE_MODIFIERS } from "../const.js";
import { onlyHasJB2AFree } from "../helpers.js";

function getCharacterWeapons(actor) {
    const weapons = actor.items.documentsByType.weapon;

    return weapons.map(weapon => ({
        name: weapon.name,
        img: weapon.img,
        group: weapon.group,
        base: weapon.base,
        damageTypes: getWeaponDamageTypes(weapon)
    }))
}

/**
 * Gets weapon damage types including from versatile etc.
 * @param {Weapon} weapon Weapon to get
 * @returns { String[""] } array of weapon damage types
 */
function getWeaponDamageTypes(weapon) {
    const damageTypes = [weapon.system.damage.damageType];
    for (const trait of weapon.system.traits.value) {
        const type = WEAPON_DAMAGE_TYPE_MODIFIERS.TRAITS[trait];
        if (type) {
            damageTypes.push(type)
        }
    }
    for (const rune of weapon.system.runes.property) {
        const type = WEAPON_DAMAGE_TYPE_MODIFIERS.RUNES[rune];
        if (type) {
            damageTypes.push(type)
        }
    }
    return [...new Set(damageTypes)]
}

const BASE_WEAPONS = [
    {
        name: "Club",
        img: "",
        group: "club",
        base: "club",
        damageTypes: ["bludgeoning"]
    },
    {
        name: "Dagger",
        img: "",
        group: "knife",
        base: "dagger",
        damageTypes: ["piercing", "slashing"]
    },
    {
        name: "Falchion",
        img: "",
        group: "sword",
        base: "falchion",
        damageTypes: ["slashing"]
    },
    {
        name: "Glaive",
        img: "",
        group: "polearm",
        base: "glaive",
        damageTypes: ["slashing"]
    },
    {
        name: "Great Axe",
        img: "",
        group: "axe",
        base: "greataxe",
        damageTypes: ["slashing"]
    },
    {
        name: "Great Club",
        img: "",
        group: "club",
        base: "greatclub",
        damageTypes: ["bludgeoning"]
    },
    {
        name: "Greatsword",
        img: "",
        group: "sword",
        base: "greatsword",
        damageTypes: ["piercing", "slashing"]
    },
    {
        name: "Halberd",
        img: "",
        group: "polearm",
        base: "halberd",
        damageTypes: ["piercing", "slashing"]
    },
    {
        name: "Light Hammer",
        img: "",
        group: "hammer",
        base: "lighthammer",
        damageTypes: ["bludgeoning"]
    },
    {
        name: "Hand Adze",
        img: "",
        group: "axe",
        base: "handadze",
        damageTypes: ["bludgeoning"]
    },
    {
        name: "Club",
        img: "",
        group: "club",
        base: "club",
        damageTypes: [""]
    },
    {
        name: "Club",
        img: "",
        group: "club",
        base: "club",
        damageTypes: [""]
    },
    {
        name: "Club",
        img: "",
        group: "club",
        base: "club",
        damageTypes: [""]
    },
    {
        name: "Club",
        img: "",
        group: "club",
        base: "club",
        damageTypes: [""]
    },
    {
        name: "Club",
        img: "",
        group: "club",
        base: "club",
        damageTypes: [""]
    },
    {
        name: "Club",
        img: "",
        group: "club",
        base: "club",
        damageTypes: [""]
    },
    {
        name: "Club",
        img: "",
        group: "club",
        base: "club",
        damageTypes: [""]
    },
    {
        name: "Club",
        img: "",
        group: "club",
        base: "club",
        damageTypes: [""]
    },
]

const SPECTRAL_WEAPON_ART = {

}

function getWeaponJb2aArt(weapon) {
    if (SPECTRAL_WEAPON_ART.base) {

    } else {
        switch (weapon.group) {
            case "axe":
                if (weapon.system.usage.hands === 2 || weapon.system.usage.value === 'held-in-one-plus-hands') {
                    return getJB2aPath('jb2a.spiritual_weapon.greataxe.01.spectral.02.green')
                } else {
                    return getJB2aPath('jb2a.spiritual_weapon.handaxe.01.spectral.02.green')
                }
            case "club":
                if (weapon.system.usage.hands === 2 || weapon.system.usage.value === 'held-in-one-plus-hands') {
                    return getJB2aPath('jb2a.spiritual_weapon.greatclub.01.spectral.02.green')
                } else {
                    return getJB2aPath('jb2a.spiritual_weapon.club.01.spectral.02.green')
                }
            case 'dart':
            case 'knife':
                return getJB2aPath('jb2a.spiritual_weapon.dagger.02.spectral.02.green')
            case 'flail':
                return getJB2aPath('jb2a.spiritual_weapon.mace.01.spectral.02.green')
            case 'hammer':
                if (weapon.system.traits.value.includes('agile')) {
                    return getJB2aPath('jb2a.spiritual_weapon.hammer.01.spectral.02.green')
                } else {
                    return getJB2aPath('jb2a.spiritual_weapon.warhammer.01.spectral.02.green')
                }
            case 'pick':
                return getJB2aPath('jb2a.spiritual_weapon.warhammer.01.spectral.02.green')
            case 'polearm':
                return getJB2aPath('jb2a.spiritual_weapon.glaive.01.spectral.02.green')
            case 'spear':
                return getJB2aPath('jb2a.spiritual_weapon.spear.01.spectral.02.green')
            case 'sword':
                if (weapon.system.usage.hands === 2 || weapon.system.usage.value === 'held-in-one-plus-hands') {
                    return getJB2aPath('jb2a.spiritual_weapon.greatsword.01.spectral.02.green')
                } else {
                    return getJB2aPath('jb2a.spiritual_weapon.shortsword.01.spectral.02.green')
                }
        }
    }
}

function getJB2aPath(video_path) {
    return Sequencer?.Database?.getEntry(video_path)?.file;
    const jb2a_path = onlyHasJB2AFree() ? "JB2a_DnD5e" : "jb2a_patreon";
    const base_path = `modules/${jb2a_path}/Library/2nd_Level/Spiritual_Weapon/`
    return `${base_path}${video_path}`
}