import { MODULE_ID } from "../const.js";
import { handleSummonPlacementAndPost } from "../summon.js";

let socketlibSocket;
// Taken by Reference from Pf2e Action Support
export const setupSocket = () => {
    if (globalThis.socketlib) {
        socketlibSocket = globalThis.socketlib.registerModule(MODULE_ID);
        socketlibSocket.register("gmHandleSummon", handleSummonPlacementAndPost);
    }
    return !!globalThis.socketlib;
};