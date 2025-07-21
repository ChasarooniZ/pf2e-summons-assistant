import { MODULE_ID } from "./const.js";
const sampleData = {
    new: [{ item: "" }, { item: "", feat: true }, { children: [""] }],
    update: [{ item: "" }, { children: [""] }],
};

const updateData = {
    '1.7.0': {
        new: [
            { item: "Living Gravyard - Movement Summon", feat: true },
            { children: ["On Movement ask the user if they want to summon 3 thralls from the living graveyard (🖥️ @Sasane)"] },
            { item: "Show Only Token With Art", feat: true },
            { children: ["Adds a setting to default the picker to show only tokens with art"] },
        ],
        update: [
            { item: "Added localization to some action" },
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
