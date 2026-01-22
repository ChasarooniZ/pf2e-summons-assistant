import { MODULE_ID } from "./const.js";

export function setupSettings() {
  game.settings.register(MODULE_ID, "name-ownership", {
    name: `${MODULE_ID}.module-settings.name-ownership.name`,
    hint: `${MODULE_ID}.module-settings.name-ownership.hint`,
    requiresReload: false,
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
  });
  game.settings.register(MODULE_ID, "effect-ownership", {
    name: `${MODULE_ID}.module-settings.effect-ownership.name`,
    hint: `${MODULE_ID}.module-settings.effect-ownership.hint`,
    requiresReload: false,
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
  });
  
  game.settings.register(MODULE_ID, "refresh.summons", {
    name: `${MODULE_ID}.module-settings.refresh.summons.name`,
    hint: `${MODULE_ID}.module-settings.refresh.summons.hint`,
    requiresReload: false,
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
  });


  game.settings.register(MODULE_ID, "filter.default.token-with-art", {
    name: `${MODULE_ID}.module-settings.filter.default.token-with-art.name`,
    hint: `${MODULE_ID}.module-settings.filter.default.token-with-art.hint`,
    requiresReload: false,
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
  });

  game.settings.register(MODULE_ID, "house-rule.rank-upgrade", {
    name: `${MODULE_ID}.module-settings.house-rule.rank-upgrade.name`,
    hint: `${MODULE_ID}.module-settings.house-rule.rank-upgrade.hint`,
    requiresReload: false,
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });
  game.settings.register(
    MODULE_ID,
    "house-rule.scale-to-max-summon-level-for-rank",
    {
      name: `${MODULE_ID}.module-settings.house-rule.scale-to-max-summon-level-for-rank.name`,
      hint: `${MODULE_ID}.module-settings.house-rule.scale-to-max-summon-level-for-rank.hint`,
      requiresReload: false,
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    }
  );

  game.settings.register(
    MODULE_ID,
    "necromancer.handle-living-graveyard-movement",
    {
      name: `${MODULE_ID}.module-settings.necromancer.handle-living-graveyard-movement.name`,
      hint: `${MODULE_ID}.module-settings.necromancer.handle-living-graveyard-movement.hint`,
      requiresReload: false,
      scope: "world",
      config: true,
      default: true,
      type: Boolean,
    }
  );

  game.settings.register(MODULE_ID, "necromancer.thrall.auto-expire", {
    name: `${MODULE_ID}.module-settings.necromancer.thrall.auto-expire.name`,
    hint: `${MODULE_ID}.module-settings.necromancer.thrall.auto-expire.hint`,
    requiresReload: true,
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
  });

  game.settings.register(MODULE_ID, "specific-case.handle.wooden-double", {
    name: `${MODULE_ID}.module-settings.specific-case.handle.wooden-double.name`,
    hint: `${MODULE_ID}.module-settings.specific-case.handle.wooden-double.hint`,
    requiresReload: true,
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
  });

  game.settings.register(MODULE_ID, "disabled-items", {
    name: `${MODULE_ID}.module-settings.disabled-items.name`,
    hint: `${MODULE_ID}.module-settings.disabled-items.hint`,
    requiresReload: true,
    scope: "world",
    config: false,
    default: true,
    type: Object,
  });

    game.settings.register(MODULE_ID, "customized-summons", {
    name: `${MODULE_ID}.module-settings.customized-summons.name`,
    hint: `${MODULE_ID}.module-settings.customized-summons.hint`,
    requiresReload: true,
    scope: "world",
    config: false,
    default: true,
    type: Object,
  });

  game.settings.register(MODULE_ID, "last-version", {
    name: "last-version",
    hint: "last-version",
    scope: "world",
    config: false,
    default: "",
    type: String,
  });
}
