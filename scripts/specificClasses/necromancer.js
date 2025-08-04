import { MODULE_ID, SOURCES, CREATURES } from "../const.js";
import { capitalizeDamageType } from "../helpers.js";
import { getSpecificSummonDetails } from "../specificSummons.js";
import { summon } from "../summon.js";

$(document).on('click', ".living-graveyard-move-yes", async function () {
    const messageId = $(this).parent().parent().parent().data("message-id");
    if (messageId) {
        const t = game.messages.get(messageId);
        const sceneId = t.getFlag(MODULE_ID, 'sceneId');
        const tokenId = t.getFlag(MODULE_ID, 'tokenId');
        const scene = game.scenes.get(sceneId);
        const token = scene.tokens.get(tokenId);
        const actor = token.actor;
        const summonerId = actor.getFlag(MODULE_ID, 'summoner.id');
        const expirationEffect = actor.itemTypes.effect.find(p => p.system.slug === "effect-thrall-expiration-date");
        const currentTime = game.time.worldTime;
        const startTime = expirationEffect.system.start.value;
        const delta = currentTime - startTime;
        let duration = 60;
        if (delta > 0) {
            duration -= delta;
        }

        const summonerActor = game.actors.get(summonerId);

        const spellRank = Math.floor(summonerActor.level / 2);

        const durationInfo = { value: Math.floor(duration / 6), unit: 'rounds' };
        const spellRelevantInfo = { rank: spellRank, summonerLevel: summonerActor.level, duration: durationInfo }

        const summonDetailsGroup = getSpecificSummonDetails(SOURCES.NECROMANCER.CREATE_THRALL, spellRelevantInfo);

        for (const summonDetails of summonDetailsGroup) {
            summonDetails.amount = 3;
        }

        await summon(summonerActor, SOURCES.NECROMANCER.CREATE_THRALL, "thrall", summonDetailsGroup);
        await t.delete();
    }
});


const SPIRIT_MONGER_DAMAGE_TYPES = ["spirit", "void"];

export function setNecromancerHooks() {
    Hooks.on("preUpdateToken", (tokenDoc, data, id) => {
        if (!game.settings.get(MODULE_ID, "necromancer.handle-living-graveyard-movement")) {
            return;
        }
        if (tokenDoc?.actor?.isDead || !game?.combats?.active) {
            return
        }
        if (!data.x && !data.y) {
            return;
        }
        if (data.x === tokenDoc.x && data.y === tokenDoc.y) {
            return
        }
        if (game.combat) {
            if (game?.skipMoveTrigger?.[id]) {
                return
            }
            if (tokenDoc.actor._stats.compendiumSource === CREATURES.NECROMANCER.LIVING_GRAVEYARD) {
                checkLivingGraveyardMovement(tokenDoc);
            }
        }
    });
}

function checkLivingGraveyardMovement(tokenDoc) {
    const combatant = game.combat.combatant;
    const check = {
        cId: combatant._id,
        sceneId: tokenDoc.scene.id,
        tokenId: tokenDoc.id,
        actorId: tokenDoc.actorId,
        actorUuid: tokenDoc.actor.uuid,
        actionName: "living-graveyard-move"
    };
    let whispers = ChatMessage.getWhisperRecipients("GM").map((u) => u.id);
    if (combatant.players) {
        whispers = whispers.concat(combatant.players.map((u) => u.id));
    }
    let data = {
        flavor: '',
        user: null,
        speaker: {
            scene: null,
            actor: null,
            token: null,
            alias: "System"
        },
        style: CONST.CHAT_MESSAGE_STYLES.OOC,
        content: `<div>
                ${game.i18n.localize("pf2e-summons-assistant.message.living-graveyard.thralls")}
                </div>
            <div class="message-buttons">
                <button class="living-graveyard-move-yes">${game.i18n.localize("pf2e-summons-assistant.message.living-graveyard.summon")}</button>
            </div>`,
        whisper: whispers,
        flags: { 'pf2e-summons-assistant': check }
    };

    ChatMessage.create(data);
}
export function isBindHeroicSpiritHit(chatMessage) {
    return chatMessage?.flags?.pf2e?.context?.type === 'attack-roll'
        && ['success', 'criticalSuccess'].includes(chatMessage?.flags?.pf2e?.context?.outcome)
        && chatMessage?.flags?.pf2e?.context?.options?.includes("self:effect:bind-heroic-spirit");
}

export function createThrallAttackInfo({ uuid = '', castRank = 1, rollOptions = [] }) {
    if (!uuid) return [];
    // Configuration map for each thrall type
    const thrallConfigs = {
        [SOURCES.NECROMANCER.CREATE_THRALL]: {
            baseDamageTypes: ["bludgeoning", "piercing", "slashing"],
            config: {
                die: "d6",
                dice: Math.floor(castRank / 2) + 1,
                traits: ["magical"],
                name: "Thrall Strike"
            }
        },
        [SOURCES.NECROMANCER.PERFECTED_THRALL]: {
            baseDamageTypes: ["bludgeoning"],
            config: {
                die: "d10",
                dice: 7,
                traits: ["magical"],
                name: "Perfect Thrall Strike"
            }
        },
        [SOURCES.NECROMANCER.SKELETAL_LANCERS]: {
            baseDamageTypes: ["piercing"],
            config: {
                mod: 0,
                traits: ["magical", "reach"],
                name: "Skeletal Lancer Strike"
            }
        }
    };

    const thrallConfig = thrallConfigs[uuid];
    if (!thrallConfig) {
        return []; // or throw an error if preferred
    }

    return createThrallStrikeRuleElements(
        thrallConfig.baseDamageTypes,
        rollOptions,
        thrallConfig.config
    );
}

function createThrallStrikeRuleElements(baseDamageTypes, rollOptions, config) {
    const damageTypes = [...baseDamageTypes];

    // Add spirit-monger damage types if the feature is present
    if (rollOptions.includes("feature:spirit-monger")) {
        damageTypes.push(...SPIRIT_MONGER_DAMAGE_TYPES);
    }

    const ruleElements = [];
    const slugs = [];
    for (const type of damageTypes) {
        const damageName = game.i18n.localize(`PF2E.Trait${capitalizeDamageType(type)}`)
        const name = `${config.name} (${damageName})`;
        const slug = game.pf2e.system.sluggify(name);
        slugs.push(slug)
        ruleElements.push(
            getStrikeRE({
                ...config,
                name: name,
                slug: slug,
                damageType: type
            })
        );
    }
    ruleElements.push(getStrikeMod(slugs));
    return ruleElements;
}

export function getStrikeRE(config) {
    const base = {
        "damage": {
            "base": {
                "die": config?.die ?? "d4",
                "dice": config?.dice ?? 0,
                "damageType": config.damageType,
                "modifier": config?.mod ?? 0
            }
        },
        "attackModifier": 1,
        "traits": config?.traits ?? [],
        "img": config?.image ?? "icons/magic/death/hand-undead-skeleton-fire-green.webp",
        "key": "Strike",
        "slug": config.slug,
        "label": config?.name,
        "priority": 95
    };

    if (config?.group) base.group = config.group;
    if (config?.range) base.range = { increment: config.range };

    return base;
}

export function getStrikeMod(slugs) {
    return {
        "key": "FlatModifier",
        "selector": "attack",
        "value": "@item.origin.system.attributes.spellDC.value - 9",
        "predicate": [{
            "or": slugs.map(slug => `item:slug:${slug}`)
        }],
        "hideIfDisabled": true,
        "label": "Thrall"
    };
}