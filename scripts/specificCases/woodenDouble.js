import { CREATURES, MODULE_ID } from "../const.js";

function getDamageTotal(text) { return Number(text.match(/\d+/)?.[0]) }


export function setupWoodDoubleHooks() {
    if (game.user.isGM && game.settings.get(MODULE_ID, "specific-case.handle.wooden-double")) {
        Hooks.on("createChatMessage", woodenDoubleHandle)
    }
}

async function woodenDoubleHandle(message, data, userID) {
    if (message.actor.sourceId !== CREATURES.WOODEN_DOUBLE) return;
    const hpChange = message.flags?.pf2e?.appliedDamage?.updates
        ?.find(u => u?.path === "system.attributes.hp.value")?.value;
    if (!hpChange) return;
    const damageTotal = getDamageTotal(message.content);
    if (hpChange - damageTotal !== 0) {
        const DamageRoll = CONFIG.Dice.rolls.find(
            (r) => r.name === "DamageRoll"
        );
        new DamageRoll(`{${damageTotal - hpChange}}`).toMessage({
            flavor: game.i18n.localize("pf2e-summons-assistant.message.wooden-double"),
            speaker: ChatMessage.getSpeaker({ actor: message.actor }),
        });
    }
}