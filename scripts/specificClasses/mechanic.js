import { messageItemHasRollOption } from "../helpers.js";

export function isMechanic(msg){
    return messageItemHasRollOption(msg, "origin:item:trait:mechanic");
}

export function setMechanicRelevantInfo(mechanicActor, spellRelevantInfo){    
    spellRelevantInfo.classDC = mechanicActor.system.proficiencies.classDCs.mechanic?.value;
    spellRelevantInfo.int = mechanicActor.system.abilities.int.mod;
    spellRelevantInfo.hasCriticalExplosion = mechanicActor.itemTypes.feat.some(p=>p._stats.compendiumSource == "Compendium.starfinder-field-test-for-pf2e.feats.Item.zsXV8mcHVZqx6FVj");
}
