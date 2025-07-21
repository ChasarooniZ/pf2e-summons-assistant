export function isBindHeroicSpiritHit(chatMessage) {
  return chatMessage?.flags?.pf2e?.context?.type === 'attack-roll'
    && ['success', 'criticalSuccess'].includes(chatMessage?.flags?.pf2e?.context?.outcome)
    && chatMessage?.flags?.pf2e?.context?.options?.includes("self:effect:bind-heroic-spirit");
}
