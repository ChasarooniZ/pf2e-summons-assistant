import { ACTIONS, WEAPON_DAMAGE_TYPE_MODIFIERS } from "../const.js";
import { getStrikeMod } from "../specificClasses/necromancer.js";

/**
 *
 * @param {Actor} actor
 * @param {boolean} isAmped
 * @returns {{weapon: {id: string, name: string, img: string, group: string, base: string, damageTypes: string[], tokenArt: string}, effect: Item}}
 */
export async function dancingWeaponDialog(actor, isAmped = false) {
  const weapons = getCharacterWeapons(actor);
  return await foundry.applications.api.DialogV2.wait({
    window: {
      title: game.i18n.localize(
        "pf2e-summons-assistant.dialog.dancing-weapon.title",
      ),
    },
    position: { width: 400 },
    content: weapons
      .map(
        (weapon) =>
          `<label style="display:flex">
                <input type="radio" name="choice" value="${weapon.id}">
                <span style="display:flex"
                data-tooltip="${game.i18n.localize(
                  "pf2e-summons-assistant.dialog.dancing-weapon.damage-types",
                )}: ${weapon.damageTypes
                  .map((type) =>
                    game.i18n.localize(getDamageTypeLocalization(type)),
                  )
                  .join(", ")}"
                    data-tooltip-direction="RIGHT">
                <img src="${weapon.img}" width="20" />${weapon.name}
                </span>
            </label>`,
      )
      .join(""),
    buttons: [
      {
        action: "choose",
        label: game.i18n.localize(
          "pf2e-summons-assistant.dialog.dancing-weapon.choose",
        ),
        default: true,
        callback: (event, button, dialog) => {
          const result = button.form.elements.choice.value;
          const pickedWeapon = weapons.find((weapon) => weapon.id === result);
          return {
            weapon: pickedWeapon,
            effect: getEffect(pickedWeapon.damageTypes, isAmped),
          };
        },
      },
    ],
  });
}

/**
 * Get Character Weapon relevant info
 * @param {Actor} actor Actor
 * @return {{id: string, name: string, img: string, group: string, base: string, damageTypes: string[], tokenArt: string}}
 */
function getCharacterWeapons(actor) {
  const weapons = actor.items.documentsByType.weapon;

  return weapons.map((weapon) => ({
    id: weapon.id,
    name: weapon.name,
    img: weapon.img,
    damageTypes: getWeaponDamageTypes(weapon),
    tokenArt: getWeaponJb2aArt(weapon),
  }));
}

function getEffect(damageTypes, isAmped = false) {
  return {
    name: game.i18n.localize(
      "pf2e-summons-assistant.items.effects.dancing-blade.title",
    ),
    type: "effect",
    system: {
      rules: [
        getStrikeMod(["strike"], "Dancing Blade"),
        {
          domain: "all",
          key: "RollOption",
          label: "Dancing Blade Damage",
          option: "dancing-blade-damage",
          suboptions: damageTypes.map((damage) => ({
            label: getDamageTypeLocalization(damage),
            value: damage,
          })),
          flag: "dancingBladeDamage",
          alwaysActive: true,
          toggleable: true,
        },
        {
          key: "ActiveEffectLike",
          mode: "override",
          path: "flags.system.dancingBladeDamage",
          value: "{item|flags.system.rulesSelections.dancingBladeDamage}",
        },
        ...(isAmped
          ? [
              {
                key: "DamageDice",
                override: {
                  dieSize: "d10",
                },
                selector: "strike-damage",
              },
              {
                key: "GrantItem",
                uuid: ACTIONS.DANCING_BLADE.GUARD,
              },
              {
                key: "GrantItem",
                uuid: ACTIONS.DANCING_BLADE.PUSH,
              },
            ]
          : []),
      ],
      duration: {
        value: -1,
        unit: "unlimited",
        expiry: null,
        sustained: false,
      },
      level: {
        value: 1,
      },
      tokenIcon: {
        show: false,
      },
      publication: {
        title: "PF2e Summons Assistant",
        authors: "",
        license: "OGL",
        remaster: true,
      },
      slug: "effect-dancing-blade",
    },
    img: "systems/pf2e/icons/spells/dancing-blade.webp",
  };
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
      damageTypes.push(type);
    }
  }
  for (const rune of weapon.system.runes.property) {
    const type = WEAPON_DAMAGE_TYPE_MODIFIERS?.RUNES?.[rune];
    if (type) {
      damageTypes.push(type);
    }
  }
  return [...new Set(damageTypes)];
}

const SPECTRAL_WEAPON_ART = {
  "axe-musket": "jb2a.spiritual_weapon.greataxe.01.spectral.02.green",
  "dagger-pistol": "jb2a.spiritual_weapon.dagger.02.spectral.02.green",
  "gun-sword": "jb2a.spiritual_weapon.katana.01.spectral.02.green",
  "rapier-pistol": "jb2a.spiritual_weapon.rapier.01.spectral.02.green",
  "piercing-wind": "jb2a.spiritual_weapon.falchion.01.spectral.02.green",
  "cane-pistol": "jb2a.spiritual_weapon.quarterstaff.01.spectral.02.green",
  lancer: "jb2a.spiritual_weapon.javelin.01.spectral.02.green",
  "bow-staff": "jb2a.spiritual_weapon.quarterstaff.01.spectral.02.green",
  mikazuki: "jb2a.spiritual_weapon.quarterstaff.01.spectral.02.green",
  triggerbrand: "jb2a.spiritual_weapon.shortsword.01.spectral.02.green",
  "explosive-dogslicer": "jb2a.spiritual_weapon.falchion.01.spectral.02.green",
  "gnome-amalgam-musket": "jb2a.spiritual_weapon.mace.01.spectral.02.green",
  "hammer-gun": "jb2a.spiritual_weapon.warhammer.01.spectral.02.green",
  "three-peaked-tree": "jb2a.spiritual_weapon.trident.01.spectral.02.green",
  falchion: "jb2a.spiritual_weapon.falchion.01.spectral.02.green",
  falcata: "jb2a.spiritual_weapon.falchion.01.spectral.02.green",
  glaive: "jb2a.spiritual_weapon.glaive.01.spectral.02.green",
  halberd: "jb2a.spiritual_weapon.halberd.01.spectral.02.green",
  "bec-de-corbin": "jb2a.spiritual_weapon.warhammer.01.spectral.02.green",
  scythe: "jb2a.spiritual_weapon.scythe.01.spectral.02.green",
  trident: "jb2a.spiritual_weapon.trident.01.spectral.02.green",
  lance: "jb2a.spiritual_weapon.javelin.01.spectral.02.green",
  "gill-hook": "jb2a.spiritual_weapon.glaive.01.spectral.02.green",
  katana: "jb2a.spiritual_weapon.katana.01.spectral.02.green",
  nodachi: "jb2a.spiritual_weapon.katana.01.spectral.02.green",
  wakizashi: "jb2a.spiritual_weapon.katana.01.spectral.02.green",
  "bastard-sword": "jb2a.spiritual_weapon.longsword.01.spectral.02.green",
  mace: "jb2a.spiritual_weapon.mace.01.spectral.02.green",
  "light-mace": "jb2a.spiritual_weapon.mace.01.spectral.02.green",
  morningstar: "jb2a.spiritual_weapon.mace.01.spectral.02.green",
  staff: "jb2a.spiritual_weapon.quarterstaff.01.spectral.02.green",
  "probing-staff": "jb2a.spiritual_weapon.quarterstaff.01.spectral.02.green",
  whipstaff: "jb2a.spiritual_weapon.quarterstaff.01.spectral.02.green",
  "bo-staff": "jb2a.spiritual_weapon.quarterstaff.01.spectral.02.green",
  rapier: "jb2a.spiritual_weapon.rapier.01.spectral.02.green",
  scimitar: "jb2a.spiritual_weapon.scimitar.01.spectral.02.green",
};

function getWeaponJb2aArt(weapon) {
  const specificArt = SPECTRAL_WEAPON_ART?.[weapon?.system?.baseItem];
  if (specificArt) {
    return getJB2aPath(specificArt);
  } else {
    switch (weapon?.system?.group) {
      case "axe":
        if (
          weapon.system.usage.hands === 2 ||
          weapon.system.usage.value === "held-in-one-plus-hands"
        ) {
          return getJB2aPath(
            "jb2a.spiritual_weapon.greataxe.01.spectral.02.green",
          );
        } else {
          return getJB2aPath(
            "jb2a.spiritual_weapon.handaxe.01.spectral.02.green",
          );
        }
      case "club":
        if (
          weapon.system.usage.hands === 2 ||
          weapon.system.usage.value === "held-in-one-plus-hands"
        ) {
          return getJB2aPath(
            "jb2a.spiritual_weapon.greatclub.01.spectral.02.green",
          );
        } else {
          return getJB2aPath("jb2a.spiritual_weapon.club.01.spectral.02.green");
        }
      case "dart":
      case "knife":
        return getJB2aPath("jb2a.spiritual_weapon.dagger.02.spectral.02.green");
      case "flail":
        return getJB2aPath("jb2a.spiritual_weapon.mace.01.spectral.02.green");
      case "hammer":
        if (weapon.system.traits.value.includes("agile")) {
          return getJB2aPath(
            "jb2a.spiritual_weapon.hammer.01.spectral.02.green",
          );
        } else {
          return getJB2aPath(
            "jb2a.spiritual_weapon.warhammer.01.spectral.02.green",
          );
        }
      case "pick":
        return getJB2aPath(
          "jb2a.spiritual_weapon.warhammer.01.spectral.02.green",
        );
      case "polearm":
        return getJB2aPath("jb2a.spiritual_weapon.glaive.01.spectral.02.green");
      case "spear":
        return getJB2aPath("jb2a.spiritual_weapon.spear.01.spectral.02.green");
      case "sword":
        if (
          weapon.system.usage.hands === 2 ||
          weapon.system.usage.value === "held-in-one-plus-hands"
        ) {
          return getJB2aPath(
            "jb2a.spiritual_weapon.greatsword.01.spectral.02.green",
          );
        } else {
          return getJB2aPath(
            "jb2a.spiritual_weapon.shortsword.01.spectral.02.green",
          );
        }
      default:
        return getJB2aPath(
          "jb2a.spiritual_weapon.shortsword.01.spectral.02.green",
        );
    }
  }
}

export function getJB2aPath(video_path) {
  return Sequencer?.Database?.getEntry(video_path)?.file;
}

function getDamageTypeLocalization(type) {
  return `PF2E.Trait${type.charAt(0).toUpperCase()}${type.slice(1)}`;
}
