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
    game.settings.register(MODULE_ID, "house-rule.rank-upgrade", {
        name: `${MODULE_ID}.module-settings.house-rule.rank-upgrade.name`,
        hint: `${MODULE_ID}.module-settings.house-rule.rank-upgrade.hint`,
        requiresReload: false,
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });
    game.settings.register(MODULE_ID, "house-rule.scale-to-max-summon-level-for-rank", {
        name: `${MODULE_ID}.module-settings.house-rule.scale-to-max-summon-level-for-rank.name`,
        hint: `${MODULE_ID}.module-settings.house-rule.scale-to-max-summon-level-for-rank.hint`,
        requiresReload: false,
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });

    game.settings.register(MODULE_ID, "last-version", {
        name: "last-version",
        hint: "last-version",
        scope: "world",
        config: false,
        default: "",
        type: String
    });
}