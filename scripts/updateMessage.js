import { MODULE_ID } from "./const.js";
const sampleData = {
    new: [{ item: "" }, { item: "", feat: true }, { children: [""] }],
    update: [{ item: "" }, { children: [""] }],
};

const updateData = {
    '1.10.0': {
        new: [
            { item: "Support for the following:", feat: true },
            {
                children: [
                    "`SF2e - Summon Robot` (🖥️ @Sasane)"
                ]
            },
        ],
        update: [
            { item: "Fix for `Commander - Plant Banner`" },
            { item: "Fixed `Necromancer - Summon Thrall` activating on `attack rolls` and `Damage Applied` messages" },
            { item: "Added CLI to clear up the packs thanks to (@Vauxs)" },
            { item: "Updated french translation (@rectulo, @Sasane)" },
        ],
    },
    '1.9.0': {
        new: [
            { item: "Support For Commander - Plant Banner", feat: true },
            {
                children: [
                    "This is only the start of automation (IE handles the base case but not other effects modifying the banner itself)",
                    "Those may / hopefully will be handled at a later time",
                    "Also bless @Vauxs for thinking of crosshairParams to begin with"
                ]
            },
        ],
        update: [
            { item: "Fix for missing logic to handle `Bind Heroic Spirit` (@Loki123)" },
            { item: "Fix for `Light` spell not properly handling higher level casts" }
        ],
    },
    '1.8.0': {
        new: [
            { item: "Added Support for the following" },
            { children: ["Conglomerate of Limbs", "Manifest Eidolon (🖥️ @Sasane)"] },
        ],
        update: [
        ],
    },
    '1.7.0': {
        new: [
            { item: "Living Graveyard - Movement Summon", feat: true },
            { children: ["On Movement ask the user if they want to summon 3 thralls from the living graveyard (🖥️ @Sasane)"] },
            { item: "Show Only Token With Art", feat: true },
            { children: ["Adds a setting to default the picker to show only tokens with art"] },
        ],
        update: [
            { item: "Added localization to some action" },
            { item: "Updated required version of **Foundry Summons** to `2.3.3`" }
        ],
    }
};

export async function handleUpdateMessage() {
    if (!game.user.isGM) return;
    const last_version = game.settings.get(MODULE_ID, "last-version");
    game.settings.set(
        MODULE_ID,
        "last-version",
        game.modules.get(MODULE_ID).version
    );
    if (
        last_version === game.modules.get(MODULE_ID).version
    ) {
        return;
    }

    const updateStuff = updateData?.[game.modules.get(MODULE_ID).version];

    if (!updateStuff) return;

    const updateMessage = {
        name: game.modules.get(MODULE_ID).title,
        icon: "fa-solid fa-wand-magic-sparkles",
        version: game.modules.get(MODULE_ID).version,
        ...updateStuff,
    };
    updateMessage.isNew = updateMessage?.new && updateMessage?.new?.length > 0
    updateMessage.isUpdate = updateMessage?.update && updateMessage?.update?.length > 0
    updateMessage.new = updateMessage?.new?.map(it => ({
        hasChild: !!it?.children && !!it?.children?.length > 0,
        ...it
    }))
    updateMessage.update = updateMessage?.update?.map(it => ({
        hasChild: !!it?.children && !!it?.children?.length > 0,
        ...it
    }))

    const content = await renderTemplate(
        `modules/${MODULE_ID}/templates/updateMessage.hbs`,
        updateMessage
    );

    ChatMessage.create({
        content,
        whisper: game.users.filter((u) => u.isGM).map((u) => u.id),
    });
}
