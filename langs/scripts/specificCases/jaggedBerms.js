const spikes = "jb2a.spike_trap.05x05ft.side.holes.still_frame.deployed";
const spikeAnimation = "jb2a.spike_trap.05x05ft.side.holes.normal.01.01";

export async function handleJaggedBermsSpikes(token) {
  let cnt = 0;
  while (cnt < 8) {
    const location = await Sequencer.Crosshair.show({
      snap: {
        position: CONST.GRID_SNAPPING_MODES.CENTER,
      },
      label: {
        text: game.i18n.format(
          "pf2e-summons-assistant.display-text.jagged-berms.spikes",
          { count: cnt + 1 },
        ),
        dy: -canvas.grid.size * 0.75
      },
      icon: {
        texture: "systems/pf2e/icons/default-icons/hazard.svg",
      },
      location: {
        obj: token,
        limitMinRange: 5,
        limitMaxRange: 5,
        lockToEdgeDirection: true,
      },
    });
    if (!location) break;
    canvas.controls.drawPing(location, {
      style: CONFIG.Canvas.pings.types.PULSE,
      size: canvas.grid.size,
    });

    new Sequence()
      .effect()
      .file(spikeAnimation)
      .tint("#D88E52")
      .attachTo(token, {
        edge: "on",
        gridUnits: true,
        align: getRelativePosition(
          token.center.x,
          token.center.y,
          location.x,
          location.y,
        ),
      })
      .size({ width: canvas.grid.size })
      .anchor({ x: 0.5, y: 0.6 })
      .duration(1000)
      // .persist(true)
      .rotateTowards(token, { rotationOffset: -90 })
      .effect()
      .file(spikes)
      .tint("#D88E52")
      .delay(900)
      // .attachTo(token)
      // .atLocation(location)
      .attachTo(token, {
        edge: "on",
        // offset: {x: 0, y: 0.5},
        // local: true,
        gridUnits: true,
        align: getRelativePosition(
          token.center.x,
          token.center.y,
          location.x,
          location.y,
        ),
      })
      .size({ width: canvas.grid.size })
      .anchor({ x: 0.5, y: 0.6 })
      .persist(true)
      .rotateTowards(token, { rotationOffset: -90 })
      .play();
    cnt++;
  }
}

function getRelativePosition(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  const horizontal = dx === 0 ? "" : dx < 0 ? "left" : "right";
  const vertical = dy === 0 ? "" : dy < 0 ? "top" : "bottom";

  return `${vertical}${vertical && horizontal ? "-" : ""}${horizontal}`;
}
