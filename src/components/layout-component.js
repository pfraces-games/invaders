import { h } from '../lib/engine/engine';
import { settings } from '../settings';
import { worldLayerComponent } from './word-layer-component';
import { statsLayerComponent } from './stats-layer-component';
import { menuLayerComponent } from './menu-layer-component';

const canvasComponent = function ({ state }) {
  const { cellSize, cols, rows } = settings.grid;
  const { fontSize } = settings.theme;

  const {
    currentMenu,
    score,
    invaders,
    projectiles,
    explosions,
    defender,
    mysteryShip
  } = state;

  return h(
    'div.canvas',
    {
      style: {
        fontSize,
        width: `calc(${cellSize} * ${cols})`,
        height: `calc(${cellSize} * ${rows})`
      }
    },
    [
      worldLayerComponent({
        invaders,
        projectiles,
        explosions,
        defender,
        mysteryShip
      }),
      statsLayerComponent({ score }),
      menuLayerComponent({ currentMenu })
    ]
  );
};

const containerComponent = function ({ state }) {
  return h('div.container', [canvasComponent({ state })]);
};

export const layoutComponent = function ({ state }) {
  return h('div.layout', [containerComponent({ state })]);
};
