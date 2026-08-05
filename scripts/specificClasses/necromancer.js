import { MODULE_ID, SOURCES, CREATURES } from "../const.js";
import { capitalizeDamageType, getHeightenedValue } from "../helpers.js";
import { getSpecificSummonDetails } from "../specificSummons.js";
import { summon } from "../summon.js";

$(document).on("click", ".living-graveyard-move-yes", async function () {
  const messageId = $(this).parent().parent().parent().data("message-id");
  if (messageId) {
    const t = game.messages.get(messageId);
    const sceneId = t.getFlag(MODULE_ID, "sceneId");
    const tokenId = t.getFlag(MODULE_ID, "tokenId");
    const scene = game.scenes.get(sceneId);
    const token = scene.tokens.get(tokenId);
    const actor = token.actor;
    const summonerId = actor.getFlag(MODULE_ID, "summoner.id");
    const expirationEffect = actor.itemTypes.effect.find(
      (p) => p.system.slug === "effect-thrall-expiration-date",
    );
    const currentTime = game.time.worldTime;
    const startTime = expirationEffect.system.start.value;
    const delta = currentTime - startTime;
    let duration = 60;
    if (delta > 0) {
      duration -= delta;
    }

    const summonerActor = game.actors.get(summonerId);

    const spellRank = Math.floor(summonerActor.level / 2);

    const durationInfo = { value: Math.floor(duration / 6), unit: "rounds" };
    const spellRelevantInfo = {
      rank: spellRank,
      summonerLevel: summonerActor.level,
      duration: durationInfo,
    };

    const summonDetailsGroup = getSpecificSummonDetails(
      SOURCES.NECROMANCER.CREATE_THRALL,
      spellRelevantInfo,
    );

    for (const summonDetails of summonDetailsGroup) {
      summonDetails.amount = 3;
    }

    await summon(
      summonerActor,
      SOURCES.NECROMANCER.CREATE_THRALL,
      "thrall",
      summonDetailsGroup,
    );
    await t.delete();
  }
});

const SPIRIT_MONGER_DAMAGE_TYPES = ["spirit", "void"];

export function setNecromancerHooks() {
  Hooks.on("preUpdateToken", livingGraveyardMovementHook);

  if (game.settings.get(MODULE_ID, "necromancer.thrall.auto-expire")) {
    setupAutoDeleteThrallHook();
  }
}

function livingGraveyardMovementHook(tokenDoc, data, id) {
  if (
    !game.settings.get(
      MODULE_ID,
      "necromancer.handle-living-graveyard-movement",
    )
  ) {
    return;
  }
  if (tokenDoc?.actor?.isDead || !game?.combats?.active) {
    return;
  }
  if (!data.x && !data.y) {
    return;
  }
  if (data.x === tokenDoc.x && data.y === tokenDoc.y) {
    return;
  }
  if (game.combat) {
    if (game?.skipMoveTrigger?.[id]) {
      return;
    }
    if (tokenDoc.actor.sourceId === CREATURES.NECROMANCER.LIVING_GRAVEYARD) {
      checkLivingGraveyardMovement(tokenDoc);
    }
  }
}

function checkLivingGraveyardMovement(tokenDoc) {
  const combatant = game.combat.combatant;
  const check = {
    cId: combatant.id,
    sceneId: tokenDoc.scene.id,
    tokenId: tokenDoc.id,
    actorId: tokenDoc.actorId,
    actorUuid: tokenDoc.actor.uuid,
    actionName: "living-graveyard-move",
  };
  let whispers = ChatMessage.getWhisperRecipients("GM").map((u) => u.id);
  if (combatant.players) {
    whispers = whispers.concat(combatant.players.map((u) => u.id));
  }
  let data = {
    flavor: "",
    user: null,
    speaker: {
      scene: null,
      actor: null,
      token: null,
      alias: "System",
    },
    style: CONST.CHAT_MESSAGE_STYLES.OOC,
    content: `<div>
                ${game.i18n.localize("pf2e-summons-assistant.message.living-graveyard.thralls")}
                </div>
            <div class="message-buttons">
                <button class="living-graveyard-move-yes">${game.i18n.localize("pf2e-summons-assistant.message.living-graveyard.summon")}</button>
            </div>`,
    whisper: whispers,
    flags: { "pf2e-summons-assistant": check },
  };

  ChatMessage.create(data);
}
export function isBindHeroicSpiritHit(chatMessage) {
  return (
    chatMessage?.flags?.[game.system.id]?.context?.type === "attack-roll" &&
    ["success", "criticalSuccess"].includes(
      chatMessage?.flags?.[game.system.id]?.context?.outcome,
    ) &&
    chatMessage?.flags?.[game.system.id]?.context?.options?.includes(
      "self:effect:bind-heroic-spirit",
    )
  );
}

export function createThrallAttackInfo({
  uuid = "",
  castRank = 1,
  necromancerLevel = 1,
  rollOptions = [],
}) {
  if (!uuid) return [];
  const defaultDiceCount = getHeightenedValue({
    baseVal: 1,
    startLvl: 1,
    currLvl: necromancerLevel,
    heightenEvery: 4,
    heightenBonus: 1,
  });

  // Configuration map for each thrall type
  const thrallConfigs = {
    [SOURCES.NECROMANCER.CREATE_THRALL]: {
      baseDamageTypes: ["bludgeoning", "piercing", "slashing"],
      config: {
        die: "d6",
        dice: defaultDiceCount,
        traits: ["magical"],
        name: "Thrall Strike",
      },
    },
    [SOURCES.NECROMANCER.BLOODY_TENDRILS]: {
      baseDamageTypes: ["bludgeoning", "piercing", "slashing"],
      config: {
        die: "d6",
        dice: defaultDiceCount,
        traits: ["magical", "reach-10"],
        name: "Thrall Strike",
      },
    },
    [SOURCES.NECROMANCER.CONGLOMERATE_OF_LIMBS]: {
      baseDamageTypes: ["bludgeoning", "piercing", "slashing"],
      config: {
        die: "d6",
        dice: defaultDiceCount,
        traits: ["magical"],
        name: "Limbs Strike",
      },
    },
    [SOURCES.NECROMANCER.PERFECTED_THRALL]: {
      baseDamageTypes: ["bludgeoning"],
      config: {
        die: "d10",
        dice: 7,
        traits: ["magical"],
        name: "Perfect Thrall Strike",
      },
    },
    [SOURCES.NECROMANCER.RECURRING_NIGHTMARE]: {
      baseDamageTypes: ["void"],
      config: {
        die: "d6",
        dice: defaultDiceCount,
        traits: ["magical", "reach-0"],
        name: "Recurring Nightmare Strike",
      },
    },
    [SOURCES.NECROMANCER.LIVING_GRAVEYARD]: {
      baseDamageTypes: ["bludgeoning"],
      config: {
        die: "d6",
        dice: defaultDiceCount,
        traits: ["magical", "reach-15"],
        name: "Living Graveyard Strike",
      },
    },
    [SOURCES.NECROMANCER.SKELETAL_LANCERS]: {
      baseDamageTypes: ["piercing"],
      config: {
        die: "d6",
        dice: defaultDiceCount,
        traits: ["magical", "reach-10"],
        name: "Skeletal Lance",
      },
    },
  };

  const thrallConfig = thrallConfigs[uuid];
  if (!thrallConfig) {
    return []; // or throw an error if preferred
  }

  return createThrallStrikeRuleElements(
    thrallConfig.baseDamageTypes,
    rollOptions,
    thrallConfig.config,
    necromancerLevel,
  );
}

function createThrallStrikeRuleElements(
  baseDamageTypes,
  rollOptions,
  config,
  necromancerLevel = 1,
) {
  const damageTypes = [...baseDamageTypes];

  // Add spirit-monger damage types if the feature is present
  if (rollOptions?.includes("feature:spirit")) {
    damageTypes.push(...SPIRIT_MONGER_DAMAGE_TYPES);
  }

  const ruleElements = [];
  const slugs = [];
  for (const type of damageTypes) {
    const damageName = game.i18n.localize(
      `PF2E.Trait${capitalizeDamageType(type)}`,
    );
    const name = `${config.name} (${damageName})`;
    const slug = game?.pf2e.system.sluggify(name);
    slugs.push(slug);
    ruleElements.push(
      getStrikeRE({
        ...config,
        name: name,
        slug: slug,
        damageType: type,
      }),
    );
  }
  ruleElements.push(getStrikeMod(slugs));
  if (rollOptions?.includes("feat:the-hallowed-dead")) {
    ruleElements.push(
      {
        key: "ActorTraits",
        add: ["holy"],
      },
      {
        key: "AdjustStrike",
        mode: "add",
        property: "weapon-traits",
        value: "holy",
      },
      {
        key: "FlatModifier",
        selector: ["damage"],
        value: necromancerLevel < 10 ? 1 : 2,
        damageType: "spirit",
      },
    );
  }
  if (rollOptions?.includes("feature:bone")) {
    ruleElements.push({
      key: "FlatModifier",
      label: "Bone",
      selector: ["speed"],
      value: 5,
    });
  }
  return ruleElements;
}

export function getStrikeRE(config) {
  const base = {
    damage: {
      base: {
        die: config?.die ?? "d4",
        dice: config?.dice ?? 0,
        damageType: config.damageType,
        modifier: config?.mod ?? 0,
      },
    },
    attackModifier: config?.attackModifier ?? 1,
    traits: config?.traits ?? [],
    img:
      config?.image ?? "icons/magic/death/hand-undead-skeleton-fire-green.webp",
    key: "Strike",
    slug: config.slug,
    label: config?.name,
    priority: 95,
  };

  if (config?.group) base.group = config.group;
  if (config?.range) base.range = { increment: config.range };

  return base;
}

export function getStrikeMod(slugs, dynamic = true) {
  return {
    key: "AdjustModifier",
    selector: "attack",
    slug: "base",
    value: dynamic
      ? "@item.origin.system.attributes.spellDC.value - 10"
      : "@actor.flags.pf2e-summons-assistant.dc - 10",
    mode: "upgrade",
    predicate: [
      {
        or: slugs.map((slug) => `item:slug:${slug}`),
      },
    ],
  };
}

function setupAutoDeleteThrallHook() {
  Hooks.on("deleteItem", autoDeleteThrall);
}

async function autoDeleteThrall(effect, info) {
  if (!game.user.isGM) return;
  if (effect.rollOptionSlug !== "thrall-expiration-date") return;

  const tokDoc = info?.parent?.parent;
  return await tokDoc.delete();
}

export function getBaseThrallArtConfig(rollOptions) {
  if (rollOptions?.includes("feature:bone")) {
    return {
      prototypeToken: {
        texture: {
          src: "modules/pf2e-tokens-bestiaries/tokens/undead/skeletal/skeleton-guard.webp",
        },
        ring: {
          subject: {
            texture:
              "modules/pf2e-tokens-bestiaries/subjects/undead/skeletal/skeleton-guard.webp",
          },
        },
      },
    };
  } else if (rollOptions?.includes("feature:blood")) {
    return {
      prototypeToken: {
        texture: {
          src: "modules/pf2e-tokens-bestiaries/tokens/undead/vampiric/vampire-spawn-rogue.webp",
        },
        ring: {
          subject: {
            texture:
              "modules/pf2e-tokens-bestiaries/subjects/undead/vampiric/vampire-spawn-rogue.webp",
          },
        },
      },
    };
  } else if (rollOptions?.includes("feature:spirit")) {
    return {
      prototypeToken: {
        texture: {
          src: "modules/pf2e-tokens-monster-core/assets/tokens/ghost-commoner.webp",
        },
        ring: {
          subject: {
            texture:
              "modules/pf2e-tokens-monster-core/assets/subjects/ghost-commoner.webp",
          },
        },
      },
    };
  } else {
    return {};
  }
}
