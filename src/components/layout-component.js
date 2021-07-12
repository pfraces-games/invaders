import { h } from '../lib/game-engine';
import { settings } from '../settings';
import { worldLayerComponent } from './word-layer-component';
import { menuLayerComponent } from './menu-layer-component';

const canvasComponent = function ({ state }) {
  const { fontSize, cellSize, gridCols, gridRows } = settings;
  const { currentMenu, invaders, projectiles, explosions, defender } = state;

  return h(
    'div.canvas',
    {
      style: {
        fontSize,
        width: `calc(${cellSize} * ${gridCols})`,
        height: `calc(${cellSize} * ${gridRows})`
      }
    },
    [
      worldLayerComponent({ invaders, projectiles, explosions, defender }),
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
