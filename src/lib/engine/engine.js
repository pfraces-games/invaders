import {
  addKeyBinding,
  applyKeyBindings,
  resetPressedKeys,
  listenKeyboard
} from './keyboard';

import {
  addSound,
  playSound,
  pauseSound,
  resumeSound,
  resetSound
} from './sound';

import {
  addAnimation,
  applyAnimations,
  runAnimation,
  stopAnimation,
  resetAnimations
} from './animation';

import { addCollider } from './collider';
import { patch } from './vdom';

export { h } from './vdom';

export const keyboard = {
  bind: addKeyBinding,
  reset: resetPressedKeys,
  listen: listenKeyboard
};

export const sound = {
  add: addSound,
  play: playSound,
  pause: pauseSound,
  resume: resumeSound,
  reset: resetSound
};

export const animation = {
  add: addAnimation,
  run: runAnimation,
  stop: stopAnimation,
  reset: resetAnimations
};

export const collider = {
  add: addCollider
};

export const mount = function (root, component) {
  let vnode = component();
  let timestamp = 0;

  const gameLoop = function (newTimestamp) {
    const delta = newTimestamp - timestamp;

    if (timestamp > 0) {
      applyKeyBindings();
      applyAnimations(delta);
    }

    const newVnode = component();
    patch(vnode, newVnode);

    vnode = newVnode;
    timestamp = newTimestamp;
    requestAnimationFrame(gameLoop);
  };

  patch(root, vnode);
  requestAnimationFrame(gameLoop);
};
