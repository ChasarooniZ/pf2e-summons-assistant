import { MODULE_ID } from "../const.js";
import { handleSummonPlacingAndPost } from "../module.js";

let socketlibSocket;
// Taken by Reference from Pf2e Action Support
export const setupSocket = () => {
    if (globalThis.socketlib) {
        socketlibSocket = globalThis.socketlib.registerModule(MODULE_ID);
        socketlibSocket.register("gmHandleSummon", handleSummonPlacingAndPost);
    }
    return !!globalThis.socketlib;
};