import { h } from '../lib/game-engine';
import { layoutComponent } from './layout-component';

export const rootComponent = function ({ state }) {
  return h('div.root', [layoutComponent({ state })]);
};
