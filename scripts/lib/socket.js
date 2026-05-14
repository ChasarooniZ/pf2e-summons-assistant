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

async function createWalls(wallDocs) {
  return await canvas.scene.createEmbeddedDocuments("Wall", wallDocs);
}

export const setupSocket = () => {
  if (globalThis.socketlib) {
    socketlibSocket = globalThis.socketlib.registerModule(MODULE_ID);
    socketlibSocket.register("createEffects", createEffects);
    socketlibSocket.register("createWalls", createWalls);
  }
  return !!globalThis.socketlib;
};
