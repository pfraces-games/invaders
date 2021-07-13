import { h } from '../lib/game-engine';
import { lcdComponent } from './lcd-component';

const scoreComponent = function ({ score }) {
  return h('div.score', [lcdComponent({ number: score })]);
};
export const statsLayerComponent = function ({ score }) {
  return h('div.stats-layer', [scoreComponent({ score })]);
};