import { h } from '../lib/engine/engine';
import { layoutComponent } from './layout-component';

export const rootComponent = function ({ state }) {
  return h('div.root', [layoutComponent({ state })]);
};
