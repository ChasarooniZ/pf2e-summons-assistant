// Basically flag the t0ken as B
// remove flah 8f one is destroyed
// dialog to select which on3 stays
//


// Summons copy of self
// Make surr to flip the token as that seems like a cute detail

//Sets flag on actor

token.actor.setFlag(MODULE_ID, "thaumMirrorImplementCloneActive", true);

// If Unconsvious/Start of Turn / Token Moves
pickerDialogue(actor)

// ping location ofndestroted clone for like 5-10 seconds
function pickerDialogue(actor, type = '') {
    const tokens = canvas.tokens.placeables(t => t.actor.id === actor.id);
    if (tokens.length < 2) {
        ui.notifications.error('[Error] You dont have a Mirrored Self clone active on this scene')
        return;
    }
    // Also modify wummon properties: noEffect, noTraits to remove the auto traits
    // Add a ping  of token
    // Preselect 
    let realId = canvas.tokens.controlled[0]?.id;
    if (type === 'adept-reaction') {
        realId = tokens?.find(t => t !== canvas.tokens.controlled[0]?.id)
    }

    // Copt the sttling onother oen but haveva default selected ln abd a ping buttkn


    const token = DialogV2WIP()
    tokens.filter(t => t.id !== token.id).forEach(t => t.delete() /* ping token spot*/)
    token.actor.unsetFlag(MODULE_ID, "thaumMirrorImplementCloneActive", true);
}