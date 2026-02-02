import { WEAPON_DAMAGE_TYPE_MODIFIERS } from "../const.js";

function dancingWeaponDialog(actor) {
    
}

function getCharacterWeapons(actor) {
    const weapons = actor.items.documentsByType.weapon;

    return weapons.map(weapon => ({
        name: weapon.name,
        img: weapon.img,
        group: weapon.group,
        base: weapon.base,
        damageTypes: getWeaponDamageTypes(weapon)
    })).map(weapon => ({ ...weapon, token: getWeaponJb2aArt(weapon) }))
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



const SPECTRAL_WEAPON_ART = {
    falchion: 'jb2a.spiritual_weapon.falchion.01.spectral.02.green',
    falcata: 'jb2a.spiritual_weapon.falchion.01.spectral.02.green',
    glaive: 'jb2a.spiritual_weapon.glaive.01.spectral.02.green',
    halberd: 'jb2a.spiritual_weapon.halberd.01.spectral.02.green',
    'bec-de-corbin': 'jb2a.spiritual_weapon.warhammer.01.spectral.02.green',
    scythe: 'jb2a.spiritual_weapon.scythe.01.spectral.02.green',
    trident: 'jb2a.spiritual_weapon.trident.01.spectral.02.green',
    lance: 'jb2a.spiritual_weapon.javelin.01.spectral.02.green',
    'gill-hook': 'jb2a.spiritual_weapon.glaive.01.spectral.02.green',
    katana: 'jb2a.spiritual_weapon.katana.01.spectral.02.green',
    nodachi: 'jb2a.spiritual_weapon.katana.01.spectral.02.green',
    wakizashi: 'jb2a.spiritual_weapon.katana.01.spectral.02.green',
    'bastard-sword': 'jb2a.spiritual_weapon.longsword.01.spectral.02.green',
    mace: 'jb2a.spiritual_weapon.mace.01.spectral.02.green',
    'light-mace': 'jb2a.spiritual_weapon.mace.01.spectral.02.green',
    morningstar: 'jb2a.spiritual_weapon.mace.01.spectral.02.green',
    staff: 'jb2a.spiritual_weapon.quarterstaff.01.spectral.02.green',
    'probing-staff': 'jb2a.spiritual_weapon.quarterstaff.01.spectral.02.green',
    whipstaff: 'jb2a.spiritual_weapon.quarterstaff.01.spectral.02.green',
    'bo-staff': 'jb2a.spiritual_weapon.quarterstaff.01.spectral.02.green',
    rapier: 'jb2a.spiritual_weapon.rapier.01.spectral.02.green',
    scimitar: 'jb2a.spiritual_weapon.scimitar.01.spectral.02.green',
}

function getWeaponJb2aArt(weapon) {
    const specificArt = SPECTRAL_WEAPON_ART?.[weapon.base];
    if (specificArt) {
        return getJB2aPath(specificArt)
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
            default:
                return getJB2aPath('jb2a.spiritual_weapon.shortsword.01.spectral.02.green')
        }
    }
}

function getJB2aPath(video_path) {
    return Sequencer?.Database?.getEntry(video_path)?.file;
    // const jb2a_path = onlyHasJB2AFree() ? "JB2a_DnD5e" : "jb2a_patreon";
    // const base_path = `modules/${jb2a_path}/Library/2nd_Level/Spiritual_Weapon/`
    // return `${base_path}${video_path}`
}

// const BASE_WEAPONS = [
//     {
//         name: "Club",
//         img: "",
//         group: "club",
//         base: "club",
//         damageTypes: ["bludgeoning"]
//     },
//     {
//         name: "Dagger",
//         img: "",
//         group: "knife",
//         base: "dagger",
//         damageTypes: ["piercing", "slashing"]
//     },
//     {
//         name: "Falchion",
//         img: "",
//         group: "sword",
//         base: "falchion",
//         damageTypes: ["slashing"]
//     },
//     {
//         name: "Glaive",
//         img: "",
//         group: "polearm",
//         base: "glaive",
//         damageTypes: ["slashing"]
//     },
//     {
//         name: "Great Axe",
//         img: "",
//         group: "axe",
//         base: "greataxe",
//         damageTypes: ["slashing"]
//     },
//     {
//         name: "Great Club",
//         img: "",
//         group: "club",
//         base: "greatclub",
//         damageTypes: ["bludgeoning"]
//     },
//     {
//         name: "Greatsword",
//         img: "",
//         group: "sword",
//         base: "greatsword",
//         damageTypes: ["piercing", "slashing"]
//     },
//     {
//         name: "Halberd",
//         img: "",
//         group: "polearm",
//         base: "halberd",
//         damageTypes: ["piercing", "slashing"]
//     },
//     {
//         name: "Light Hammer",
//         img: "",
//         group: "hammer",
//         base: "lighthammer",
//         damageTypes: ["bludgeoning"]
//     },
//     {
//         name: "Hand Adze",
//         img: "",
//         group: "axe",
//         base: "handadze",
//         damageTypes: ["bludgeoning"]
//     },
//     {
//         name: "Club",
//         img: "",
//         group: "club",
//         base: "club",
//         damageTypes: [""]
//     },
//     {
//         name: "Club",
//         img: "",
//         group: "club",
//         base: "club",
//         damageTypes: [""]
//     },
//     {
//         name: "Club",
//         img: "",
//         group: "club",
//         base: "club",
//         damageTypes: [""]
//     },
//     {
//         name: "Club",
//         img: "",
//         group: "club",
//         base: "club",
//         damageTypes: [""]
//     },
//     {
//         name: "Club",
//         img: "",
//         group: "club",
//         base: "club",
//         damageTypes: [""]
//     },
//     {
//         name: "Club",
//         img: "",
//         group: "club",
//         base: "club",
//         damageTypes: [""]
//     },
//     {
//         name: "Club",
//         img: "",
//         group: "club",
//         base: "club",
//         damageTypes: [""]
//     },
//     {
//         name: "Club",
//         img: "",
//         group: "club",
//         base: "club",
//         damageTypes: [""]
//     },
// ]