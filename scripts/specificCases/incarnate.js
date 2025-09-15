import { messageItemHasRollOption } from "./helpers.js";

export function extractDCValueRegex(htmlContent) {
    // Look for button with data-action="spell-save" and extract data-dc value
    const regex = /<button[^>]*data-action="spell-save"[^>]*data-dc="(\d+)"[^>]*>/;
    const match = htmlContent.match(regex);

    return match ? parseInt(match[1], 10) : null;
}


export function incarnateDetails({ uuids, rank, dc }) {
    return {
        specific_uuids: uuids,
        rank,
        modifications: {
            "level": rank,
            "system.resources.dc.value": dc
        }
    }
}


export function isIncarnate(msg) {
    return messageItemHasRollOption(msg, "incarnate")
}