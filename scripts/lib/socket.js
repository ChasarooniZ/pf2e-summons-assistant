import { MODULE_ID } from "../const.js";

let socketlibSocket = undefined;
async function createEffects({ actorUUIDs, effectUUID }) {
  const source = (await fromUuid(effectUUID)).toObject();
  source.flags = foundry.utils.mergeObject(source.flags ?? {}, {
    core: { sourceId: effectUUID },
  });

  await Promise.all(
    actorUUIDs.map(async (actorUUID) => {
      const actor = await fromUuid(actorUUID);
      return actor.createEmbeddedDocuments("Item", [source]);
    }),
  );
}

async function deleteToken(tokenId) {
  const token = canvas.tokens.get(tokenId);
  if (token) {
    return token?.document?.delete();
  }
}

async function updateCombatant(combatantId, updateData) {
  const combatant = game?.combat?.combatants?.get(combatantId);
  if (combatant) {
    return combatant.update(updateData);
  }
}

async function createWalls(wallDocs) {
  return await canvas.scene.createEmbeddedDocuments("Wall", wallDocs);
}

async function createLights(lightDocs) {
  return await canvas.scene.createEmbeddedDocuments("AmbientLight", lightDocs);
}

export const setupSocket = () => {
  if (globalThis.socketlib) {
    socketlibSocket = globalThis.socketlib.registerModule(MODULE_ID);
    socketlibSocket.register("createEffects", createEffects);
    socketlibSocket.register("createWalls", createWalls);
    socketlibSocket.register("createLights", createLights);
    socketlibSocket.register("deleteToken", deleteToken);
    socketlibSocket.register("updateCombatant", updateCombatant);
  }
  return !!globalThis.socketlib;
};
