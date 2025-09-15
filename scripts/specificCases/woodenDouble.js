function getDamageTotal(text) { return Number(text.match(/\d+/)?.[0]) }


function setupWoodDoubleHooks() {

    if (!game.user.isGM) {
        Hooks.on("createChatMessage", async (message, data, userID) => {
            const hpChange = message.flags?.pf2e?.appliedDamage?.updates
                ?.find(u => u?.path === "system.attributes.hp.value")?.value;
            if (!hpChange) return;
            const damageTotal = getDamageTotal(message.content);
            if (hpChange - damageTotal !== 0) {
                const DamageRoll = CONFIG.Dice.rolls.find(
                    (r) => r.name === "DamageRoll"
                );
                new DamageRoll(`{${hpChange - damageTotal}}`).toMessage({
                    flavor: "Wooden Double Passthrough Damage",
                    speaker: ChatMessage.getSpeaker({ actor: message.actor }),
                });
            }
        })
    }
}